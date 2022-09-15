import { useState } from 'react'
import Button from 'react-bootstrap/Button';

import './adduser.styles.css'

const AddUserComponent = () => {

    const [username, setUsername] = useState(null)
    const [email, setEmail] = useState(null)

    const addUserHandler = (e) => {
        e.preventDefault()
        if(!username || !email){
            alert("Please fill in the necessary information")
        }else {
            // insert the new user to database
        }
    }

    return (
        <>
            <h2 className='adduser-heading'>Add User</h2>
            <form className='form-container'>
                <div className="form-input">
                    <label htmlFor="username">Username</label><br/>
                    <input type="text" name="username" onChange={(e) => setUsername(e.target.value)}/>
                </div>
                <div className="form-input">
                    <label htmlFor="email">Email</label><br/>
                    <input type="email" name="email" onChange={(e) => setEmail(e.target.value)}/>
                </div>
                <Button variant="info" type="submit" onClick={(e) => addUserHandler(e)}>ADD</Button>
            </form>
        </>
    )
}

export default AddUserComponent