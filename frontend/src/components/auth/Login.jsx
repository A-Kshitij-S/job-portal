import React, { useState } from 'react'
import Navbar from '../shared/Navbar'
import { Button } from '../ui/button'
import { Link } from 'react-router-dom'

const Login = () => {
    const [input, setInput]= useState({
        email:"",
        password:"",
        role:"",
    })

    const changeEventHandler= (e)=>{
        setInput({...input, [e.target.name]:e.target.value})
    }
    const changeFileHandler= (e)=>{
        setInput({...input, file:e.target.files?.[0]})
    }

    const submitHandler= async(e)=>{
        e.preventDefault()
        console.log(input)
    }

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
                                checked={input.role==="student"}
                                value="student"
                                onChange={changeEventHandler}
                                 />
                                <span className='cursor-pointer'>Student</span>
                            </label>

                            <label className="flex items-center space-x-2">
                                <input type="radio" 
                                name="role" 
                                value="recruiter"
                                checked={input.role==="recruiter"}
                                onChange={changeEventHandler}
                                />
                                <span className='cursor-pointer'>Recruiter</span>
                            </label>
                        </div>
                            
                    </div>
                    <Button
                    type="submit"
                    className="w-full my-4 bg-violet-950 text-white cursor-pointer"
                    >Login</Button>
                    <span className='text-sm'>Don't have an account? <Link to="/signup" className="text-blue-600">Sign Up</Link></span>
                </form>
            </div>
        </div>
    )
}

export default Login
