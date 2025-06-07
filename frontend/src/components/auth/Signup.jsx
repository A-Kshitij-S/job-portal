import React from 'react'
import Navbar from '../shared/Navbar'
import { Button } from '../ui/button'
import { Link } from 'react-router-dom'

const Signup = () => {
    return (
        <div>
            <Navbar />
            <div className='flex items-center justify-center max-w-7xl mx-auto '>
                <form action="" className=' w-1/2 border  border-gray-300 rounded-md p-4 my-10'>
                    <h1 className='font-bold text-2xl mb-5'> Sign Up</h1>
                    <div className='my-2 flex flex-col'>
                        <label className='text-sm'>Full Name</label>
                        <input
                            type="text"
                            placeholder='enter your full name'
                            className='p-2 border rounded-md '
                        />
                    </div>
                    <div className='my-2 flex flex-col'>
                        <label className='text-sm'>Email</label>
                        <input
                            type="text"
                            placeholder='enter your email'
                            className='p-2 border rounded-md '
                        />
                    </div>
                    <div className='my-2 flex flex-col'>
                        <label className='text-sm'>Phone Number</label>
                        <input
                            type="text"
                            maxLength={10}
                            placeholder="Enter phone number"
                            className='p-2 border rounded-md '
                            onKeyDown={(e) => {
                                const allowedKeys = ['Backspace', 'ArrowLeft', 'ArrowRight', 'Tab'];
                                if (!/[0-9]/.test(e.key) && !allowedKeys.includes(e.key)) {
                                    e.preventDefault();
                                }
                            }}
                            onPaste={(e) => {
                                const paste = e.clipboardData.getData('Text');
                                if (!/^\d+$/.test(paste)) {
                                    e.preventDefault();
                                }
                            }}
                        />

                    </div>
                    <div className='my-2 flex flex-col'>
                        <label className='text-sm'>Password</label>
                        <input
                            type="password"
                            placeholder='***'
                            className='p-2 border rounded-md'
                        />
                    </div>
                    <div className='flex gap-5 justify-between'>
                        <div className="flex items-center space-x-4">
                            <label className="flex items-center space-x-2">
                                <input type="radio" name="role" value="student" />
                                <span className='cursor-pointer'>Student</span>
                            </label>

                            <label className="flex items-center space-x-2">
                                <input type="radio" name="role" value="recruiter" />
                                <span className='cursor-pointer'>Recruiter</span>
                            </label>
                        </div>
                            <div className='flex items-center gap-2'>
                                <label className=''>Profile:</label>
                                <input 
                                type="file" 
                                accept='image/*'
                                className='cursor-pointer border'
                                />
                            </div>
                    </div>
                    <Button
                    type="submit"
                    className="w-full my-4 bg-violet-950 text-white cursor-pointer"
                    >Sign Up</Button>
                    <span className='text-sm'>Already have an account? <Link to="/login" className="text-blue-600">Login</Link></span>
                </form>
            </div>
        </div>
    )
}

export default Signup
