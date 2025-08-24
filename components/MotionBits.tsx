"use client";
import { motion } from "framer-motion";
import React from "react";

export const MotionCard = ({children, className = ""}:{children:React.ReactNode; className?: string}) => (
  <motion.div 
    className={`glass p-5 ${className}`} 
    initial={{opacity:0, y:10}} 
    animate={{opacity:1, y:0}} 
    transition={{duration:0.28}} 
    whileHover={{scale:1.01}}
  >
    {children}
  </motion.div>
);

export const MotionButton = ({label, onClick, className = ""}:{label:string; onClick?: () => void; className?: string}) => (
  <motion.button 
    className={`btn-primary ${className}`} 
    whileTap={{scale:0.98}}
    onClick={onClick}
  >
    {label}
  </motion.button>
);

export const MotionList = ({children}:{children:React.ReactNode}) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 0.3 }}
  >
    {children}
  </motion.div>
);

export const MotionItem = ({children, index}:{children:React.ReactNode; index: number}) => (
  <motion.div
    initial={{ opacity: 0, x: -20 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ 
      duration: 0.2, 
      delay: index * 0.1,
      ease: "easeOut"
    }}
  >
    {children}
  </motion.div>
);




