import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { Dialog, DialogContent, DialogTitle } from '@radix-ui/react-dialog'
import { DialogFooter, DialogHeader } from './ui/dialog'
import { USER_API_END_POINT } from '@/utlis/constant'
import { setUser } from '@/redux/authSlice'
import { toast } from 'sonner'
import { Label } from '@radix-ui/react-label'
import { Input } from './ui/input'
import { Loader2 } from 'lucide-react'
import { Button } from './ui/button'
import { useDispatch, useSelector } from 'react-redux'

const UpdateProfileDialog = ({ openEditBox, setOpenEditBox }) => {
    const [loading, setLoading] = useState(false);
    const [input, setInput]= useState("")
    const { user } = useSelector(store => store.auth);

    // const [input, setInput] = useState({
    //     fullName: user?.fullname || "",
    //     email: user?.email || "",
    //     phoneNumber: user?.phoneNumber || "",
    //     bio: user?.profile?.bio || "",
    //     skills: user?.profile?.skills?.map(skill => skill) || "",
    //     file: user?.profile?.resume || ""
    // });
    useEffect(() => {
        setInput({
            fullName: user?.fullName || "",
            email: user?.email || "",
            phoneNumber: user?.phoneNumber || "",
            bio: user?.profile?.bio || "",
            skills: Array.isArray(user?.profile?.skills) ? user?.profile?.skills.join(",") : user?.profile?.skills || "",
            file: user?.profile?.resume || "",
        });
    }, [user]);
    const dispatch = useDispatch();

    const changeEventHandler = (e) => {
        setInput({ ...input, [e.target.name]: e.target.value });
    }

    const fileChangeHandler = (e) => {
        const file = e.target.files?.[0];
        setInput({ ...input, file })
    }

    const submitHandler = async (e) => {
        e.preventDefault();
        console.log("Submit clicked", input);

        const formData = new FormData();
        formData.append("fullName", input.fullName);
        formData.append("email", input.email);
        formData.append("phoneNumber", input.phoneNumber);
        formData.append("bio", input.bio);
        formData.append("skills", Array.isArray(input.skills) ? input.skills.join(",") : input.skills);

        if (input.file) {
            formData.append("file", input.file);
        }

        try {
            setLoading(true);
            const res = await axios.post(`${USER_API_END_POINT}/profile/update`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                },
                withCredentials: true
            });

            console.log("Response from server:", res.data);

            if (res.data.success) {
                dispatch(setUser(res.data.user));
                toast.success(res.data.message);
                setOpenEditBox(false);
                setLoading(false) // ✅ Move this inside the success block
            } else {
                toast.error("Update failed!");
            }
            setLoading(false)

        } catch (error) {
            console.log("Error occurred:", error);
            toast.error(error?.response?.data?.message || "Something went wrong");
            setLoading(false)
        } finally {
            setLoading(false);
        }
    };



    return (
        <div>
            <Dialog open={openEditBox} >
                <DialogContent className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 sm:max-w-[425px] bg-white p-6 rounded-lg shadow-lg" onInteractOutside={() => setOpenEditBox(false)}>
                    <DialogHeader>
                        <DialogTitle>Update Profile</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={submitHandler}>
                        <div className='grid gap-4 py-4'>
                            <div className='grid grid-cols-4 items-center gap-4'>
                                <Label htmlFor="name" className="text-right">Name</Label>
                                <Input
                                    id="fullName"
                                    name="fullName"
                                    type="text"
                                    value={input.fullName}
                                    onChange={changeEventHandler}
                                    className="col-span-3"
                                />
                            </div>
                            <div className='grid grid-cols-4 items-center gap-4'>
                                <Label htmlFor="email" className="text-right">Email</Label>
                                <Input
                                    id="email"
                                    name="email"
                                    type="email"
                                    value={input.email}
                                    onChange={changeEventHandler}
                                    className="col-span-3"
                                />
                            </div>
                            <div className='grid grid-cols-4 items-center gap-4'>
                                <Label htmlFor="number" className="text-right">Number</Label>
                                <Input
                                    id="number"
                                    name="number"
                                    value={input.phoneNumber}
                                    onChange={changeEventHandler}
                                    className="col-span-3"
                                />
                            </div>
                            <div className='grid grid-cols-4 items-center gap-4'>
                                <Label htmlFor="bio" className="text-right">Bio</Label>
                                <Input
                                    id="bio"
                                    name="bio"
                                    value={input.bio}
                                    onChange={changeEventHandler}
                                    className="col-span-3"
                                />
                            </div>
                            <div className='grid grid-cols-4 items-center gap-4'>
                                <Label htmlFor="skills" className="text-right">Skills</Label>
                                <Input
                                    id="skills"
                                    name="skills"
                                    value={input.skills}
                                    onChange={changeEventHandler}
                                    className="col-span-3"
                                />
                            </div>
                            <div className='grid grid-cols-4 items-center gap-4'>
                                <Label htmlFor="file" className="text-right">Resume</Label>
                                <Input
                                    id="file"
                                    name="file"
                                    type="file"
                                    accept="application/pdf"
                                    onChange={fileChangeHandler}
                                    className="col-span-3"
                                />
                            </div>
                        </div>
                        <DialogFooter>
                            {
                                loading ? <Button className="w-full my-4"> <Loader2 className='mr-2 h-4 w-4 animate-spin' /> Please wait </Button> : <Button type="submit" className="w-full my-4">Update</Button>
                            }
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    )
}

export default UpdateProfileDialog