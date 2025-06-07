import React, { useState } from 'react'
import Navbar from '../shared/Navbar'
import { Button } from '../ui/button'
import { Link } from 'react-router-dom'

const Signup = () => {
    const [input, setInput] = useState({
        fullName: "",
        email: "",
        phoneNumber: "",
        password: "",
        role: "",
        file: ""
    })

    const changeEventHandler = (e) => {
        setInput({ ...input, [e.target.name]: e.target.value })
    }
    const changeFileHandler = (e) => {
        setInput({ ...input, file: e.target.files?.[0] })
    }

    const submitHandler = async (e) => {
        e.preventDefault()
        console.log(input)
    }

    return (
        <div>
            <Navbar />
            <div className="flex items-center justify-center px-4 sm:px-6 lg:px-8">
                <form
                    onSubmit={submitHandler}
                    className="w-full max-w-lg border border-gray-300 rounded-md p-6 my-10"
                >
                    <h1 className="font-bold text-2xl mb-5 text-center">Sign Up</h1>

                    <div className="my-2 flex flex-col">
                        <label className="text-sm">Full Name</label>
                        <input
                            type="text"
                            placeholder="Enter your full name"
                            className="p-2 border rounded-md"
                            name="fullName"
                            value={input.fullName}
                            onChange={changeEventHandler}
                        />
                    </div>

                    <div className="my-2 flex flex-col">
                        <label className="text-sm">Email</label>
                        <input
                            type="text"
                            placeholder="Enter your email"
                            className="p-2 border rounded-md"
                            name="email"
                            value={input.email}
                            onChange={changeEventHandler}
                        />
                    </div>

                    <div className="my-2 flex flex-col">
                        <label className="text-sm">Phone Number</label>
                        <input
                            type="text"
                            maxLength={10}
                            placeholder="Enter phone number"
                            className="p-2 border rounded-md"
                            name="phoneNumber"
                            value={input.phoneNumber}
                            onChange={changeEventHandler}
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

                    <div className="my-2 flex flex-col">
                        <label className="text-sm">Password</label>
                        <input
                            type="password"
                            placeholder="***"
                            className="p-2 border rounded-md"
                            name="password"
                            value={input.password}
                            onChange={changeEventHandler}
                        />
                    </div>

                    <div className="my-4 border border-gray-300 rounded-md p-4">
                        <div className="flex flex-col md:flex-row justify-between gap-4">

                            <div className="flex items-center gap-4">
                                <label className="flex items-center gap-2">
                                    <input
                                        type="radio"
                                        name="role"
                                        checked={input.role === 'student'}
                                        value="student"
                                        onChange={changeEventHandler}
                                    />
                                    <span className="cursor-pointer">Student</span>
                                </label>

                                <label className="flex items-center gap-2">
                                    <input
                                        type="radio"
                                        name="role"
                                        value="recruiter"
                                        checked={input.role === 'recruiter'}
                                        onChange={changeEventHandler}
                                    />
                                    <span className="cursor-pointer">Recruiter</span>
                                </label>
                            </div>

                            <div className="flex items-center gap-2 max-w-full overflow-hidden">
                                <label className="text-sm font-medium whitespace-nowrap">Profile:</label>
                                <div className="relative w-full">
                                    <input
                                        type="file"
                                        accept="image/*"
                                        name="profile"
                                        onChange={changeFileHandler}
                                        className="cursor-pointer text-sm w-full truncate file:mr-2 file:py-1 file:px-2 file:rounded-md file:border-0 file:bg-violet-50 file:text-violet-700 file:font-semibold"
                                    />
                                </div>
                            </div>

                        </div>
                    </div>

                    <Button
                        type="submit"
                        className="w-full my-4 bg-violet-950 text-white cursor-pointer"
                    >
                        Sign Up
                    </Button>

                    <span className="text-sm block text-center">
                        Already have an account?{' '}
                        <Link to="/login" className="text-blue-600">
                            Login
                        </Link>
                    </span>
                </form>
            </div>

        </div>
    )
}

export default Signup
