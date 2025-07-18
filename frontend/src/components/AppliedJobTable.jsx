import React from 'react'
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from './ui/table'
import { Badge } from './ui/badge'
import { useSelector } from 'react-redux'

const AppliedJobTable = () => {
  const { allAppliedJobs } = useSelector(store => store.job);

  return (
    <div>
      <Table>
        <TableCaption>A list of your applied jobs</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Job Role</TableHead>
            <TableHead>Company</TableHead>
            <TableHead className="text-right">Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {
            !allAppliedJobs || allAppliedJobs.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center text-muted-foreground">
                  You haven't applied to any jobs yet.
                </TableCell>
              </TableRow>
            ) : (
              allAppliedJobs.map((appliedJob) => {
                const status = appliedJob?.status?.toLowerCase() || "unknown";
                const badgeColor =
                  status === "rejected"
                    ? "bg-red-400"
                    : status === "pending"
                    ? "bg-gray-400"
                    : "bg-green-400";

                return (
                  <TableRow key={appliedJob?._id}>
                    <TableCell>{appliedJob?.createdAt?.split("T")[0]}</TableCell>
                    <TableCell>{appliedJob?.job?.title}</TableCell>
                    <TableCell>{appliedJob?.job?.company?.name}</TableCell>
                    <TableCell className="text-right">
                      <Badge className={badgeColor}>{status}</Badge>
                    </TableCell>
                  </TableRow>
                );
              })
            )
          }
        </TableBody>
      </Table>
    </div>
  )
}

export default AppliedJobTable
