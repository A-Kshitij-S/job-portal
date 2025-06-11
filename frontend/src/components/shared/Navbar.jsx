import React from 'react'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { LogOut, User2 } from 'lucide-react'
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux'


const Navbar = () => {

  const {user}= useSelector(store=>store.auth)

  return (
    <div>
      <div className='flex items-center justify-between p-4 px-12 mx-auto h-24'>
        <div>
          <h1 className='text-4xl font-bold' > <span className='text-emerald-500'>Job</span>Portal</h1>
        </div>
        <div>

        </div>
        <div className='flex gap-5'>
          <div>
            <ul className='flex font-medium h-16 items-center gap-6 justify-between p-3'>
              <li><Link to="/">Home</Link> </li>
              <li><Link to="/jobs">Jobs</Link></li>
              <li><Link to="/Browse">Browse</Link></li>
            </ul>
          </div>
          {
            !user ? (
              <div className="flex font-medium h-16 items-center gap-6 justify-between  ">
                <Link to="/login">
                  <Button variant="outline" className="cursor-pointer">Login</Button>
                </Link>
                <Link to="/signup">
                  <Button variant="outline" className="ml-1 text-white bg-violet-800 hover:bg-violet-500 cursor-pointer">
                    Sign Up
                  </Button>
                </Link>
              </div>

            ) : (
              <Popover>
                <PopoverTrigger>
                  <Avatar>
                    <AvatarImage src="https://github.com/shadcn.png" className="cursor-pointer " />
                    <AvatarFallback>CN</AvatarFallback>
                  </Avatar>
                </PopoverTrigger>
                <div className=''>
                  <PopoverContent >
                    <div className='bg-blue'>
                      <div className='flex gap-6 py-2 '>
                        <Avatar>
                          <AvatarImage src="https://github.com/shadcn.png" className="cursor-pointer" />
                          <AvatarFallback>CN</AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className=' font-medium'>Morty</h3>
                          <h4 className='text-sm text-gray-400'>Lorem ipsum dolor sit amet.</h4>
                        </div>
                      </div>
                      <div>
                        <div className='flex'>
                          <span className='py-1'><User2 /></span>
                          <Button variant="link"><Link to="/profile">View Profile</Link></Button>
                        </div>
                        <div className='flex'>
                          <span className='py-1 pb-1'><LogOut /></span>
                          <Button variant="link">Logout</Button>
                        </div>
                      </div>
                    </div>
                  </PopoverContent>
                </div>
              </Popover>
            )
          }

        </div>
      </div>
    </div>
  )
}

export default Navbar
