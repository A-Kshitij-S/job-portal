import React from 'react'
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '../ui/table'
import { useSelector } from 'react-redux'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover'
import { MoreHorizontal } from 'lucide-react'
import axios from 'axios'
import { APPLICATION_API_END_POINT } from '@/utlis/constant'
import { toast } from 'sonner'


const shortlistingStatus = ["Accepted", "Rejected"];


const ApplicantsTable = () => {

    const { applicants } = useSelector(store => store.application)
    // console.log(shortlistingStatus);


    const statusHandler = async (status, id) => {
        if (!status || !id) {
            console.error("Missing status or ID");
            return;
        }

        console.log("Sending status update:", status, id);
        try {
            axios.defaults.withCredentials = true;
            status= status.toLowerCase()
            const res = await axios.post(`${APPLICATION_API_END_POINT}/status/${id}/update`, { status },  {withCredentials: true});
            // console.log(res);
            if (res.data.success) {
                toast.success(res.data.message);
            }
        } catch (error) {
            console.log(error); // 👈 more reliable than just error.response
            toast.error(error?.response?.data?.message || "Failed to update status");
        }

    }


    return (
        <div>
            <Table>
                <TableCaption>A list of your recent applied user</TableCaption>
                <TableHeader>
                    <TableRow>
                        <TableHead>FullName</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Contact</TableHead>
                        <TableHead>Resume</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead className="text-right">Action</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {
                        applicants && applicants?.applications?.map((item) => (
                            <tr key={item._id}>
                                <TableCell>{item?.applicant?.fullname}</TableCell>
                                <TableCell>{item?.applicant?.email}</TableCell>
                                <TableCell>{item?.applicant?.phoneNumber}</TableCell>
                                <TableCell >
                                    {
                                        item.applicant?.profile?.resume ? <a className="text-blue-600 cursor-pointer" href={item?.applicant?.profile?.resume} target="_blank" rel="noopener noreferrer">{item?.applicant?.profile?.resumeOriginalName}</a> : <span>NA</span>
                                    }
                                </TableCell>
                                <TableCell>{item?.applicant.createdAt.split("T")[0]}</TableCell>
                                <TableCell className="float-right cursor-pointer">
                                    <Popover>
                                        <PopoverTrigger>
                                            <MoreHorizontal className='cursor-pointer' />
                                        </PopoverTrigger>
                                        <PopoverContent className="w-32 bg-white border border-gray-200 shadow-lg cursor-pointer">
                                            {

                                                shortlistingStatus.map((status, index) => {
                                                    return (
                                                        <div onClick={() => statusHandler(status, item?._id)} key={index} className='flex w-fit items-center my-2 cursor-pointer'>
                                                            <span className='cursor-pointer'>{status}</span>
                                                        </div>
                                                    )
                                                })
                                            }
                                        </PopoverContent>
                                    </Popover>

                                </TableCell>

                            </tr>
                        ))
                    }

                </TableBody>

            </Table>
        </div>
    )
}

export default ApplicantsTable
