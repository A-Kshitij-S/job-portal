import React, { useEffect } from 'react'
import Navbar from './shared/Navbar'
import HeroSection from './HeroSection'
import CategoryCarousel from './CategoryCarousel'
import LatestJobs from './LatestJobs'
import Footer from './Footer'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import useGetAllJobs from './hooks/useGetAllJobs'

const Home = () => {
  useGetAllJobs()
  const user = useSelector(store => store.auth)
  const navigate = useNavigate()
  useEffect(() => {
    if (user?.role === "recruter") {
      navigate("/admin/companies")
    }
  }, [])
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
