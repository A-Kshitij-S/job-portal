import React, { useState } from 'react'
import Navbar from './shared/Navbar'
import { Avatar, AvatarImage } from './ui/avatar'
import { Button } from './ui/button'
import { Contact, Mail, Pen } from 'lucide-react'
import { Label } from './ui/label'
import AppliedJobTable from './AppliedJobTable'
import UpdateProfileDialog from './UpdateProfileDialog'
import { useSelector } from 'react-redux'
import store from '@/redux/store'
import { Badge } from './ui/badge'

// const skills = ["Html", "Css", "Javascript", "Reactjs"]
const isResume = true;

const Profile = () => {
    // useGetAppliedJobs();
    const [openEditBox, setOpenEditBox] = useState(false);
    const { user } = useSelector(store => store.auth);

    const editHandler = (e) => {
        e.preventDefault();
        console.log("edit is working fine");
        setOpenEditBox(true);
    }

    const skills = Array.isArray(user?.profile?.skills)
        ? user.profile.skills
        : user?.profile?.skills?.split?.(",") || [];

    console.log("Resume URL:", user?.profile?.resume);


    return (
        <div>
            <Navbar />
            <div className='max-w-4xl mx-auto bg-white border border-gray-200 rounded-2xl my-5 p-8'>
                <div className='flex justify-between'>
                    <div className='flex items-center gap-4'>
                        <Avatar className="h-24 w-24">
                            <AvatarImage src={user?.profile?.profilePhoto} alt="profile" />
                        </Avatar>
                        <div>
                            <h1 className='font-medium text-xl'>{user?.fullName}</h1>
                            <p>{user?.profile?.bio}</p>
                        </div>
                    </div>
                    <Button onClick={(e) => editHandler(e)} className="text-right cursor-pointer" variant="outline"><Pen /></Button>
                </div>
                <div className='my-5'>
                    <div className='flex items-center gap-3 my-2'>
                        <Mail />
                        <span>{user?.email}</span>
                    </div>
                    <div className='flex items-center gap-3 my-2'>
                        <Contact />
                        <span>{user?.phoneNumber}</span>
                    </div>
                </div>
                <div className='my-5'>
                    <h1>Skills</h1>
                    <div className='flex items-center gap-1'>


                        {skills.length > 0
                            ? skills.map((item, idx) => <Badge variant=" destructive " key={idx}>{item}</Badge>)
                            : <span>NA</span>}

                    </div>
                </div>
                <div className='grid w-full max-w-sm items-center gap-1.5'>
                    <Label className="text-md font-bold">Resume</Label>


                    {
                        user?.profile?.resume
                        ? <a target="_blank" href={user?.profile?.resume} className="text-blue-500 hover:underline">{user.profile.resumeOriginalName}</a>
                        : <span>NA</span>
                    }
                </div>
            </div>
            <div className='max-w-4xl mx-auto bg-white rounded-2xl'>
                <h1 className='font-bold text-lg my-5'>Applied Jobs</h1>
                {/* Applied Job Table   */}
                <AppliedJobTable />
            </div>
            <UpdateProfileDialog openEditBox={openEditBox} setOpenEditBox={setOpenEditBox} />
        </div>
    )
}

export default Profile