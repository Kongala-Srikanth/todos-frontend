import './index.css'

const Profile = () => {
    return(
      <div className="profile-container">
      <div className="profile-card">
        <div className="avatar">
          <span className="avatar-initial">S</span>
        </div>
        <h2 className="profile-title">Profile</h2>
        <div className="profile-info">
          <p><span className="label">Name:</span> Srikanth Kongala</p>
          <p><span className="label">Email:</span> srikanth@example.com</p>
          <p><span className="label">Password:</span> ********</p>
        </div>
        <button className="edit-profile">Edit Profile</button>
        <p className="logout"><a href="#">Logout</a></p>
      </div>
    </div>
    )
}

export default Profile