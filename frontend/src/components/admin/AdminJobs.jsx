import React, { useEffect, useState } from 'react'
import { Input } from '../ui/input'
import Navbar from '../shared/Navbar'
import { Button } from '../ui/button'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { setSearchCompanyByText } from '@/redux/companySlice'
import AdminJobsTable from './AdminJobsTable'
import useGetAllAdminJobs from '@/hooks/useGetAllAdminJobs'
import { setSearchJobByText } from '@/redux/jobSlice'

const AdminJobs = () => {
    useGetAllAdminJobs()

    const navigate = useNavigate()
    const [input, setInput] = useState("")

    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(setSearchJobByText(input))
    }, [input])
    return (
        <div>
            <Navbar />
            <div className='max-w-6xl mx-auto my-10'>
                <div className='flex items-center justify-between my-5'>
                    <Input
                        className="w-fit "
                        placeholder="Filter by name"
                        onChange={(e) => setInput(e.target.value)}
                    />
                    <Button className="bg-purple-700 text-white cursor-pointer" onClick={() => navigate("/admin/jobs/create")}>New Jobs</Button>
                </div>
                <AdminJobsTable />
            </div>
        </div>
    )
}

export default AdminJobs
