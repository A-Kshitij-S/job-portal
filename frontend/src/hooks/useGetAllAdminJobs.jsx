import { setAllAdminJobs } from '@/redux/jobSlice';
import { JOB_API_END_POINT } from '@/utlis/constant'
import axios from 'axios' 
import { useEffect } from 'react'
import { useDispatch } from 'react-redux'

const useGetAllAdminJobs = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        const fetchAllAdminJobs = async () => {
            try {
                const res = await axios.get(`${JOB_API_END_POINT}/getadminjobs`, { withCredentials: true });
                if (res.data.success) {
                    // console.log(res.data) 
                    dispatch(setAllAdminJobs(res.data.job));
                }
            } catch (error) {
                console.log(error);
            }
        };
        fetchAllAdminJobs();
    }, [dispatch]);
};

export default useGetAllAdminJobs;
