import React, { useState } from 'react'
import Navbar from '../shared/Navbar'
import { Button } from '../ui/button'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import axios from "axios";
import { toast } from 'sonner';
import { USER_API_END_POINT } from '@/utlis/constant';
import { useDispatch, useSelector } from 'react-redux';
import { setLoading, setUser } from '@/redux/authSlice';
import { Loader2 } from 'lucide-react';


const Login = () => {
    const [input, setInput] = useState({
        email: "",
        password: "",
        role: "",
    })
    const { loading } = useSelector(store => store.auth)
    const navigate = useNavigate()
    const dispatch = useDispatch()

    const changeEventHandler = (e) => {
        setInput({ ...input, [e.target.name]: e.target.value })
    }


    const submitHandler = async (e) => {
        e.preventDefault();

        try {
            dispatch(setLoading(true))
            const res = await axios.post(`${USER_API_END_POINT}/login`, input, {
                headers: {
                    "content-type": "application/json"
                },
                withCredentials: true
            });

            if (res.data.success) {
                dispatch(setUser(res.data.user))
                toast.success(res.data.message);
                navigate("/");
            }
        } catch (error) {
            console.error(error);
            toast.error(error?.response?.data?.message || "Login failed.");
        } finally {
            dispatch(setLoading(false))
        }
    };


    return (
        <div>
            <Navbar />
            <div className='flex items-center justify-center max-w-7xl mx-auto '>
                <form onSubmit={submitHandler} className=' w-1/2 border  border-gray-300 rounded-md p-4 my-10'>
                    <h1 className='font-bold text-2xl mb-5'> Sign Up</h1>

                    <div className='my-2 flex flex-col'>
                        <label className='text-sm'>Email</label>
                        <input
                            type="text"
                            placeholder='enter your email'
                            className='p-2 border rounded-md '
                            name='email'
                            value={input.email}
                            onChange={changeEventHandler}
                        />
                    </div>

                    <div className='my-2 flex flex-col'>
                        <label className='text-sm'>Password</label>
                        <input
                            type="password"
                            placeholder='***'
                            className='p-2 border rounded-md'
                            name='password'
                            value={input.password}
                            onChange={changeEventHandler}
                        />
                    </div>
                    <div className='flex gap-5 justify-between'>
                        <div className="flex items-center space-x-4">
                            <label className="flex items-center space-x-2">
                                <input type="radio"
                                    name="role"
                                    checked={input.role === "student"}
                                    value="student"
                                    onChange={changeEventHandler}
                                />
                                <span className='cursor-pointer'>Student</span>
                            </label>

                            <label className="flex items-center space-x-2">
                                <input type="radio"
                                    name="role"
                                    value="recruiter"
                                    checked={input.role === "recruiter"}
                                    onChange={changeEventHandler}
                                />
                                <span className='cursor-pointer'>Recruiter</span>
                            </label>
                        </div>

                    </div>
                    {
                        loading ? <Button className="w-full my-4"><Loader2 className='mr-2 h-4 w-4 animate-spin'>Please Wait</Loader2></Button> : <Button
                            type="submit"
                            className="w-full my-4 bg-violet-950 text-white cursor-pointer"
                        >Login</Button>
                    }

                    <span className='text-sm'>Don't have an account? <Link to="/signup" className="text-blue-600">Sign Up</Link></span>
                </form>
            </div>
        </div>
    )
}

export default Login
