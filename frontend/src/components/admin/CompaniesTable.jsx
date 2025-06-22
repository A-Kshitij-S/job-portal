// import React, { useEffect } from 'react'
// import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '../ui/table'
// import { Avatar, AvatarImage } from '../ui/avatar'
// import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover'
// import { Edit2, MoreHorizontal } from 'lucide-react'
// import { useDispatch, useSelector } from 'react-redux'
// import store from '@/redux/store'
// import { setCompanies } from '@/redux/companySlice'

// const CompaniesTable = () => {
//     const dispatch = useDispatch()
//     const companies = useSelector(store => store.company)

//     useEffect(() => {
//         const fetchCompanies = async () => {
//             try {
//                 const res = await axios.get(`${COMPANY_API_END_POINT}/all`, {
//                     withCredentials: true
//                 })
//                 console.log("API response:", res.data)
//                 if (res.data.success) {
//                     dispatch(setCompanies(res.data.companies))
//                 }
//             } catch (err) {
//                 console.error("Error fetching companies:", err)
//             }
//         }

//         fetchCompanies()
//     }, [dispatch])

//     console.log(companies)
//     return (
//         <div>
//             <Table>
//                 <TableCaption>A list of your recent registered companies</TableCaption>
//                 <TableHeader>
//                     <TableRow>
//                         <TableHead>Logo</TableHead>
//                         <TableHead>Name</TableHead>
//                         <TableHead>Date</TableHead>
//                         <TableHead className="text-right">Action</TableHead>
//                     </TableRow>
//                 </TableHeader>
//                 <TableBody>
//                     {/* {
//                         filterCompany?.map((company) => ( */}
//                     {/* <tr>
//                                 <TableCell>
//                                     <Avatar>
//                                         <AvatarImage src={companies.logo} />
//                                     </Avatar>
//                                 </TableCell>
//                                 <TableCell>{companies.name}</TableCell>
//                                 <TableCell> {companies.createdAt.split("T")[0]}</TableCell>
//                                 <TableCell className="text-right cursor-pointer">
//                                     <Popover>
//                                         <PopoverTrigger><MoreHorizontal /></PopoverTrigger>
//                                         <PopoverContent className="w-32">
//                                             <div onClick={() => navigate(`/admin/companies/${companies._id}`)} className='flex items-center gap-2 w-fit cursor-pointer'>
//                                                 <Edit2 className='w-4' />
//                                                 <span>Edit</span>
//                                             </div>
//                                         </PopoverContent>
//                                     </Popover>
//                                 </TableCell>
//                             </tr>  */}

//                     {/* ))
//                     } */}
//                 </TableBody>
//                 <TableBody>
//                     {companies?.map((company) => (
//                         <TableRow key={company._id}>
//                             <TableCell>
//                                 <Avatar>
//                                     <AvatarImage src={company.logo} />
//                                 </Avatar>
//                             </TableCell>
//                             <TableCell>{company.name}</TableCell>
//                             <TableCell>{company.createdAt?.split("T")[0]}</TableCell>
//                             <TableCell className="text-right cursor-pointer">
//                                 <Popover>
//                                     <PopoverTrigger><MoreHorizontal /></PopoverTrigger>
//                                     <PopoverContent className="w-32">
//                                         <div
//                                             onClick={() => navigate(`/admin/companies/${company._id}`)}
//                                             className='flex items-center gap-2 w-fit cursor-pointer'
//                                         >
//                                             <Edit2 className='w-4' />
//                                             <span>Edit</span>
//                                         </div>
//                                     </PopoverContent>
//                                 </Popover>
//                             </TableCell>
//                         </TableRow>
//                     ))}
//                 </TableBody>



//             </Table>
//         </div>
//     )
// }

// export default CompaniesTable



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

const CompaniesTable = () => {
  const navigate = useNavigate()
  const { companies, searchCompanyByText } = useSelector((state) => state.company)
  const dispatch = useDispatch()

  const [data, setData] = useState()


  const [filterCompany, setFilterCompany] = useState()

  useEffect(() => {
    if (!companies || companies.length === 0) return;

    const filtered = companies.filter(company =>
      company?.name?.toLowerCase().includes(searchCompanyByText.toLowerCase())
    );

    setFilterCompany(filtered);
  }, [companies, searchCompanyByText]);


  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const res = await axios.get(`${COMPANY_API_END_POINT}/get`, {
          withCredentials: true,
        })
        if (res.data.success) {
          // setData(res.data.company)
          dispatch(setCompanies(res.data.company))
        }
      } catch (err) {
        console.error("Error fetching companies:", err)
      }
    }

    fetchCompanies()
  }, [dispatch])

  return (
    <div>
      <Table>
        <TableCaption>A list of your recently registered companies</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Logo</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Date</TableHead>
            <TableHead className="text-right">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {Array.isArray(filterCompany) && filterCompany.length > 0 ? (
            filterCompany.map((company) => (
              <TableRow key={company._id}>
                <TableCell>
                  <Avatar>
                    <AvatarImage src={company.logo} />
                  </Avatar>
                </TableCell>
                <TableCell>{company.name}</TableCell>
                <TableCell>{company.createdAt?.split("T")[0]}</TableCell>
                <TableCell className="text-right ">
                  <Popover >
                    <PopoverTrigger className="cursor-pointer"><MoreHorizontal /></PopoverTrigger>
                    <PopoverContent className="w-32">
                      <div
                        onClick={() => navigate(`/admin/companies/${company._id}`)}
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

export default CompaniesTable
