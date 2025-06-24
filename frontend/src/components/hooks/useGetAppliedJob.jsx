import { setAllAppliedJobs } from "@/redux/jobSlice";
import { APPLICATION_API_END_POINT, JOB_API_END_POINT } from "@/utlis/constant";
import axios from "axios";
import { useEffect } from "react";
import { useDispatch } from "react-redux";

const useGetAppliedJob = () => {
  const dispatch = useDispatch();

  useEffect(() => {
  const fetchAppliedJobs = async () => {
    try {
      const res = await axios.get(`${APPLICATION_API_END_POINT}/get`, {
        withCredentials: true,
      });
      // console.log("👉 Applied jobs:", res.data); // <- log here
      if (res.data.success) {
        dispatch(setAllAppliedJobs(res.data.applications));
        // console.log("Dispatched:", res.data.applications); // <- log here
      }
    } catch (error) {
      console.error("Error fetching applied jobs:", error);
    }
  };

  fetchAppliedJobs();
}, [dispatch]);

};

export default useGetAppliedJob;
