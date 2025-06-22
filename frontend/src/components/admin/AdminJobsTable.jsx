import React, { useEffect, useState } from 'react'
import {
    Table, TableBody, TableCaption, TableCell, TableHead,
    TableHeader, TableRow
} from '../ui/table'
import { Avatar, AvatarImage } from '../ui/avatar'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover'
import { Edit2, MoreHorizontal } from 'lucide-react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { setCompanies } from '@/redux/companySlice'
import axios from 'axios'
import { COMPANY_API_END_POINT } from '@/utlis/constant'

const AdminJobsTable = () => {
    const navigate = useNavigate()
    //   const { companies, searchCompanyByText } = useSelector((state) => state.company)
    const dispatch = useDispatch()
    const { allAdminJobs, searchJobByText } = useSelector(store => store.job)

    const [filterJobs, setFilterJobs] = useState(allAdminJobs)
    const [allJobs, setAllJobs] = useState([]);
    // console.log(filterJobs)



    useEffect(() => {
        if (!allJobs || allJobs.length === 0) return;

        // If no search text, just show all
        if (!searchJobByText.trim()) {
            setFilterJobs(allJobs);
            return;
        }

        const filtered = allJobs.filter((job) =>
            job?.company?.name?.toLowerCase().includes(searchJobByText.toLowerCase())
        );


        setFilterJobs(filtered);
    }, [allJobs, searchJobByText]);


    useEffect(() => {
        if (allAdminJobs && allAdminJobs.length > 0) {
            setAllJobs(allAdminJobs);
            setFilterJobs(allAdminJobs); // optional: to show unfiltered list by default
        }
    }, [allAdminJobs]);



    return (
        <div>
            <Table>
                <TableCaption>A list of your posted jobs</TableCaption>
                <TableHeader>
                    <TableRow>
                        <TableHead>Company Name</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead className="text-right">Action</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {Array.isArray(filterJobs) && filterJobs.length > 0 ? (
                        filterJobs.map((job) => (
                            <TableRow key={job._id}>

                                <TableCell>{job?.company?.name}</TableCell>
                                <TableCell>{job?.title}</TableCell>
                                <TableCell>{job?.createdAt?.split("T")[0]}</TableCell>
                                <TableCell className="text-right ">
                                    <Popover >
                                        <PopoverTrigger className="cursor-pointer"><MoreHorizontal /></PopoverTrigger>
                                        <PopoverContent className="w-32">
                                            <div
                                                onClick={() => navigate(`/admin/companies/${job._id}`)}
                                                className='flex items-center gap-2 w-fit cursor-pointer'
                                            >
                                                <Edit2 className='w-4 cursor-pointer' />
                                                <span >Edit</span>
                                            </div>
                                        </PopoverContent>
                                    </Popover>
                                </TableCell>
                            </TableRow>
                        ))
                    ) : (
                        <TableRow>
                            <TableCell colSpan={4} className="text-center text-gray-500">
                                No companies found.
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </div>
    )
}

export default AdminJobsTable
