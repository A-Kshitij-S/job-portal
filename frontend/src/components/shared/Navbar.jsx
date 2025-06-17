import React from 'react'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { LogOut, User2 } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom';
import { setUser } from '@/redux/authSlice'
import { toast } from 'sonner'
import { USER_API_END_POINT } from '@/utlis/constant'
import axios from 'axios'
import { useDispatch, useSelector } from 'react-redux'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';


const Navbar = () => {

  const { user } = useSelector(store => store.auth)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const logoutHandler = async () => {
    try {
      const res = await axios.get(`${USER_API_END_POINT}/logout`, {
        withCredentials: true,
      });

      if (res.data.success) {
        dispatch(setUser(null));
        navigate("/");
        toast.success(res.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.message || "Logout failed. Please try again.");
    }
  };


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
              {
                user && user.role === "recruter" ? (
                  <>
                    <li><Link to="/admin/companies">companies</Link> </li>
                    <li><Link to="/admin/jobs">Jobs</Link></li>
                  </>
                ) : (
                  <>
                    <li><Link to="/">Home</Link> </li>
                    <li><Link to="/jobs">Jobs</Link></li>
                    <li><Link to="/Browse">Browse</Link></li>
                  </>
                )
              }

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
                    <AvatarImage src={user?.profile?.profilePhoto} className="cursor-pointer " />
                    <AvatarFallback>CN</AvatarFallback>
                  </Avatar>
                </PopoverTrigger>
                <div className=''>
                  <PopoverContent >
                    <div className='bg-blue'>
                      <div className='flex gap-6 py-2 '>
                        <Avatar>
                          <AvatarImage src={user?.profile?.profilePhoto} className="cursor-pointer" />
                          <AvatarFallback>CN</AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className=' font-medium'>{user?.fullName}</h3>
                          <h4 className='text-sm text-gray-400'>{user?.profile?.bio}</h4>
                        </div>
                      </div>
                      <div>
                        {
                          user && user.role === "student" && (
                            <div className='flex'>
                              <span className='py-1'><User2 /></span>
                              <Button variant="link"><Link to="/profile">View Profile</Link></Button>
                            </div>
                          )
                        }
                        <div className='flex'>
                          <span className='py-1 pb-1'><LogOut /></span>
                          <Button onClick={logoutHandler} variant="link">Logout</Button>
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
