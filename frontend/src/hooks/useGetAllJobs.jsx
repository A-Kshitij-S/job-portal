import { setAllJobs } from '@/redux/jobSlice'
import { JOB_API_END_POINT } from '@/utlis/constant'
import axios from 'axios'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

const useGetAllJobs = () => {
    const dispatch = useDispatch();
    const { searchedQuery } = useSelector(store => store.job)
    useEffect(() => {
        const fetchAllJobs = async () => {
            try {
                const res = await axios.get(
                    `${JOB_API_END_POINT}/get?keyword=${searchedQuery}`,
                    { withCredentials: true }
                );
                if (res.data.success) {
                    dispatch(setAllJobs(res.data.jobs));
                }
            } catch (error) {
                if (error.response?.status === 404) {
                    // Handle "no jobs found" gracefully
                    dispatch(setAllJobs([]));
                } else {
                    console.error("❌ Unexpected error fetching jobs:", error);
                }
            }
        };

        fetchAllJobs();
    }, [dispatch, searchedQuery]);
};

export default useGetAllJobs;
