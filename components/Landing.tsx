'use client'

import { easeInOut, motion } from 'framer-motion'
import LandingPage from './LandingPage'
import { useState, useEffect } from 'react'

const Landing = () => {
    const [loading, setloading] = useState(false)
    
    useEffect(() => {
        const timer : ReturnType<typeof setTimeout> = setTimeout(() => {
            setloading(true)
        }, 2000);
    
        return ()=>clearTimeout(timer)
    }, [])

    const container = (delay : number)=>({
        inital : {
            position : 'fixed',
            top : '50%',
            left : '50%',
            translateX : '-50%',
            translateY : '-50%',
            opacity : 1,
            scale : 3
        },

        animate : {
            top : loading ? '20px' : '50%',
            left : loading ? '20px' : '50%',
            translateX : loading ? 0 : '-50%',
            translateY : loading ? 0 : '-50%',
            opacity : loading ? 1 : 1,
            scale : loading ? 1 : 3,
            transition :{
                duration : delay,
                ease : easeInOut
            }
        }

    })


  return (
    <div className='bg-black/90'>
    <motion.div variants={container(1)} initial='initial' animate='animate' style={{position : 'fixed', zIndex : '50'}} className='py-1'>
      <span className="font-mono text-green-400 md:text-lg px-5 text-sm">Stack<span className="text-gray-500">//</span>Mind</span>
    </motion.div>
    <motion.div initial={{opacity : 0}} animate={{opacity : loading ? 1 : 0}} transition={{duration : 1, delay : 1}} style={{zIndex : '50'}}>
        <LandingPage/>
    </motion.div>
    </div>
  )
}

export default Landing
