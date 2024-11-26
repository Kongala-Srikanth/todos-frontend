import { useEffect, useState } from 'react'
import {Link} from 'react-router-dom'
import Cookies from 'js-cookie'
import './index.css'
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min'
import { ThreeDots } from "react-loader-spinner";
import { IoHome } from "react-icons/io5";
import { IoIosContact } from "react-icons/io";
import { MdLogout } from "react-icons/md";

const dataStatus = {
  initial: 'INITIAL',
  done: 'DONE',
  progress: 'PROGRESS',
  failed: 'FAILED'

}

const Profile = () => {
    const [userDetails, setUserDetails] = useState()
    const [pageStatus, setPageStatus] = useState(dataStatus.initial)
    const [editDetails, setEditDetails] = useState(false)

    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [email, setEmail] = useState('')

    const history = useHistory()

    const getUserDetails = async () => {
      setPageStatus(dataStatus.progress)
      const jwtToken = Cookies.get('jwt')
      const url = 'https://todos-app-nk7v.onrender.com/profile'
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${jwtToken}`
        }
      })

      if (response.ok){
        const data = await response.json()
        setUserDetails(data)
        setPageStatus(dataStatus.done)
      } else{
        setPageStatus(dataStatus.failed)
      }

    }

    useEffect(() => {
      getUserDetails()
    }, [editDetails])


    const editUserDetails = () => {
      setEditDetails(!editDetails)
      setUsername(userDetails.username || '')
      setEmail(userDetails.email || '')
    }

    const onLogout = () => {
      Cookies.remove('jwt')
      return history.push('/login')
    }

    const onUpdateDetails = async (event) => {
      event.preventDefault()

      const url = 'https://todos-app-nk7v.onrender.com/profile'
      const jwtToken = Cookies.get('jwt')
      const updateUserDetails = {
        username, email, password
      }

      const response = await fetch(url, {
        method: 'PUT',
        headers: {
          'Content-Type' : 'application/json',
          Authorization: `Bearer ${jwtToken}`
        },
        body: JSON.stringify(updateUserDetails)
      })

      if (response.ok){
        setEmail('')
        setUsername('')
        setEditDetails(!editDetails)
      }

    }

    console.log(pageStatus)


    return(
      <>
      {
        pageStatus === dataStatus.progress && <div className='page-center-position'>
          <div className="products-loader-container">
        <ThreeDots type="ThreeDots" color="#0b69ff" height="50" width="50" />
      </div>
        </div>
      }

      {
        pageStatus === dataStatus.failed && <div className='page-center-position'>
          <div class="error-container">
          <h1>Something Went Wrong</h1>
          <p>We couldn't process your request. Please try again later.</p>
          <button class="retry-btn" onClick={getUserDetails}>Retry</button>
      </div>
        </div>
      }

      {
        pageStatus === dataStatus.done && !editDetails && <div className="profile-container">
          <nav className='nav-bar'>
            <Link to='/'>
                <button type='button' className='hide-btn'>
                  <IoHome className='icons'/>
                </button>
              </Link>
              <Link to='/profile'>
                <button type='button' className='hide-btn'>
                  <IoIosContact className='icons' />
                </button>
              </Link>
              <Link to='/login'>
                <button type='button' className='hide-btn' onClick={onLogout}>
                <MdLogout className='icons' />
                </button>
              </Link>
          </nav>
        <div className="profile-card">
          <div className="avatar">
            <span className="avatar-initial">{userDetails.username[0].toUpperCase()}</span>
          </div>
          <h2 className="profile-title">Profile</h2>
          <div className="profile-info">
            <p><span className="label">Name:</span> {userDetails.username}</p>
            <p><span className="label">Email:</span> {userDetails.email}</p>
            <p><span className="label">Password:</span>********</p>
          </div>
          <button className="edit-profile" onClick={editUserDetails}>Edit Profile</button>
          <p className="logout" onClick={onLogout}>Logout</p>
        </div>
      </div>
      }

      {
        editDetails &&
        <div className='edit-profile-container'>
        <div className="profile-edit">
        <h2 className="profile-heading">Edit Profile</h2>
        <form className="profile-form" onSubmit={onUpdateDetails}>
            <label className="form-label" htmlFor="username">Username</label>
            <input onChange={e => setUsername(e.target.value)} value={username} className="form-input" type="text" id="username" name="username"  />
            <label className="form-label" htmlFor="email">Email</label>
            <input onChange={e => setEmail(e.target.value)} value={email} className="form-input" type="email" id="email" name="email"  />
            <label className="form-label" htmlFor="password">Password</label>
            <input onChange={e => setPassword(e.target.value)} className="form-input" type="password" id="password" name="password"  />
            <div className="button-group">
                <button type="submit" className="submit-btn">Submit</button>
                <button type="button" className="cancel-btn" onClick={editUserDetails}>Cancel</button>
            </div>
        </form>
    </div>
    </div>
      }

    
      </>
    )
}

export default Profile