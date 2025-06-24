import React, { useEffect } from 'react'
import Navbar from './shared/Navbar'
import HeroSection from './HeroSection'
import CategoryCarousel from './CategoryCarousel'
import LatestJobs from './LatestJobs'
import Footer from './Footer'
import useGetAllJobs from './hooks/useGetAllJobs'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'

const Home = () => {
  useGetAllJobs()
  const user = useSelector(store => store.auth)
  const navigate = useNavigate()

  useEffect(() => {
    // console.log("User in useEffect:", user)
    if (user.user?.role === "recruiter") {
      navigate("/admin/companies")
    }
  }, [user?.role, navigate])

  return (
    <div>
      <Navbar />
      <HeroSection />
      <CategoryCarousel />
      <LatestJobs />
      <Footer />
    </div>
  )
}

export default Home
