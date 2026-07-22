'use client'
import WelcomeProPage from '@/components/ProWelcome'
import React from 'react'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
const page = () => {
    

const router = useRouter()

useEffect(() => {
    const timer = setTimeout(() => {
        router.replace('/dashboard')
        router.refresh()
    }, 3000)

    return () => clearTimeout(timer)
}, [router])

  return (
    <div>
      <WelcomeProPage/>
    </div>
  )
}

export default page
