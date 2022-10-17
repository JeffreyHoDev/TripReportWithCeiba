
import './adduser.styles.css'

import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { InputGroup } from 'react-bootstrap';

const AddUserComponent = () => {

    const [username, setUsername] = useState("")
    const [email, setEmail] = useState("")
    const [domain, setDomain] = useState("")
    const [role, setRole] = useState("Admin")

    const navigate = useNavigate()

    const addUserHandler = () => {
        if(!username || !email || !domain){
            alert("Please fill in the fields")
        }else {
            console.log("submitted")
            navigate('/user-management')

        }
    }

    return (
        <>
            <div className="add-user-container">
                <h2>ADD A NEW USER</h2>
                <Form>
                    <Form.Group className="mb-3 form-group" as={Row}>
                        <Form.Label>Username</Form.Label>
                        <Col>
                            <Form.Control type="text" placeholder="Enter username" onChange={(event) => setUsername(event.target.value)} />
                        </Col>
                    </Form.Group>
                    <InputGroup >
                        <Form.Group className="mb-3 form-group" as={Row}>
                            <Form.Label>Email</Form.Label>
                            <div className='email-input-group'>
                                <Form.Control type="email" placeholder="Enter Email" onChange={(event) => setEmail(event.target.value)} />
                                <InputGroup.Text id="basic-addon2">@</InputGroup.Text>
                                <Form.Control type="text" placeholder="Enter Domain" onChange={(event) => setDomain(event.target.value)} />
                            </div>
                        </Form.Group>
                    </InputGroup>
                    <Form.Group className="mb-3 form-group" as={Row}>
                    <Form.Label>Role</Form.Label>
                        <Col>
                            <select name="role" onChange={(e) => setRole(e.target.value)} className="role-dropdown">
                                <option value="Admin">Admin</option>
                                <option value="Basic">Basic</option>
                            </select>
                        </Col>
                    </Form.Group>
                    <Button variant="success" type="button" onClick={() => addUserHandler()}>
                        ADD USER
                    </Button>
                </Form>
            </div>

        </>
    )
}

export default AddUserComponent