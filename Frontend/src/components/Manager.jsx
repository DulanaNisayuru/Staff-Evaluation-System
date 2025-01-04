import React from 'react'
import { useNavigate } from 'react-router-dom'
import MgrSidebar from './Manager/MgrSidebar';
import MgrHeaderImage from './Manager/MgrHeaderImage';
import './css/Manager.css';

export default function Manager() {
    const navigate =useNavigate();

    const handleClick = () => {
        navigate('/assignMarks')
    }
     
   


  return (
    <div className='mgr-main'>
        <MgrSidebar/>
        <div className="mgr-sub">
            <MgrHeaderImage/>
        </div>
        
    </div>

  )
}
