from datetime import datetime, timezone

from langgraph.store.base import BaseStore, GetOp, Item, ListNamespacesOp, PutOp, SearchItem, SearchOp

from app.integrations.mongo import get_interview_db


def _doc_id(namespace: tuple[str, ...], key: str) -> str:
    return "/".join((*namespace, key))


class MongoLongTermStore(BaseStore):
    """Hand-rolled BaseStore backed by one plain pymongo collection.

    Namespace matching is exact-match only (no true prefix search) -- this store is only ever
    queried with the full, exact namespaces this service defines: (user_id, "profile") and
    (user_id, "sessions"). A generic prefix search isn't needed for that usage.
    """

    def __init__(self):
        self._collection = get_interview_db()["long_term_memory"]
        self._collection.create_index([("namespace", 1), ("key", 1)], unique=True)

    def batch(self, ops):
        results = []
        for op in ops:
            if isinstance(op, GetOp):
                results.append(self._get(op))
            elif isinstance(op, PutOp):
                results.append(self._put(op))
            elif isinstance(op, SearchOp):
                results.append(self._search(op))
            elif isinstance(op, ListNamespacesOp):
                results.append(self._list_namespaces(op))
            else:
                results.append(None)
        return results

    async def abatch(self, ops):
        return self.batch(ops)

    def _get(self, op: GetOp):
        doc = self._collection.find_one({"_id": _doc_id(op.namespace, op.key)})
        if doc is None:
            return None
        return Item(
            value=doc["value"],
            key=op.key,
            namespace=tuple(op.namespace),
            created_at=doc["created_at"],
            updated_at=doc["updated_at"],
        )

    def _put(self, op: PutOp):
        doc_id = _doc_id(op.namespace, op.key)
        if op.value is None:
            self._collection.delete_one({"_id": doc_id})
            return None
        now = datetime.now(timezone.utc)
        self._collection.update_one(
            {"_id": doc_id},
            {
                "$set": {
                    "namespace": list(op.namespace),
                    "key": op.key,
                    "value": op.value,
                    "updated_at": now,
                },
                "$setOnInsert": {"created_at": now},
            },
            upsert=True,
        )
        return None

    def _search(self, op: SearchOp):
        query = {"namespace": list(op.namespace_prefix)} if op.namespace_prefix else {}
        cursor = self._collection.find(query).skip(op.offset).limit(op.limit)
        return [
            SearchItem(
                namespace=tuple(doc["namespace"]),
                key=doc["key"],
                value=doc["value"],
                created_at=doc["created_at"],
                updated_at=doc["updated_at"],
                score=None,
            )
            for doc in cursor
        ]

    def _list_namespaces(self, op: ListNamespacesOp):
        # NOTE: collection.distinct("namespace") would flatten across array elements instead of
        # returning unique whole-array values -- $group on the full field is the correct way to
        # get distinct namespace tuples out of an array field in MongoDB.
        docs = self._collection.aggregate([{"$group": {"_id": "$namespace"}}])
        return [tuple(doc["_id"]) for doc in docs]
