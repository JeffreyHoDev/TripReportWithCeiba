import './topbar.styles.css'
import { Link } from 'react-router-dom'

const Topbar = ({ loginUser, isLogin }) => {
    return (
        <>
            {
                isLogin && loginUser ? 
                    <div className='topbar-container'>
                        <div className='nav'>
                            <Link to="/home" className='nav-item'>
                                Trip Report
                            </Link>
                        </div>
                        <div className='nav'>
                            <Link to="/user-management" className='nav-item'>
                                User Management
                            </Link>
                        </div>
                        <div className='nav'>
                            <Link to="/scheduletask" className='nav-item'>
                                Schedule Task
                            </Link>
                        </div>
                        <div className='nav'>
                            Logout
                        </div>
                        <div className='profile-group'>
                            <img src={require('../../assets/user-icon.png')} alt="user-icon"/>
                            <p>{loginUser}</p>
                        </div>
                    </div>
                : null
            }
        </>
    )
}

export default Topbar