import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { APPLICATION_API_END_POINT } from '@/utlis/constant'
import axios from 'axios'
import { setCompanies } from '@/redux/companySlice'

const useGetAllCompanies = () => {
    const dispatch = useDispatch()

    useEffect(() => {
        const fetchAllCompanies = async () => {
            try {
                const res = await axios.get(`${APPLICATION_API_END_POINT}/get`, { withCredentials: true })
                if (res.data.success) {
                    dispatch(setCompanies(res.data.companies))
                }
            } catch (error) {
                console.log(error)
            }
        }
        fetchAllCompanies()
    },[])
}

export default useGetAllCompanies
