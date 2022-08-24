import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';

import { useState } from 'react'

import './login.page.styles.css'

import { CallCEIBALoginAPI } from '../../functions/apicaller'

const LoginPage = ({ isLogin, setLoginStatus, setKey }) => {

    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [isFetching, setFetchingStatus] = useState(false)
    

    const LoginHandler = async() => {
            setFetchingStatus(true)
            const data = await CallCEIBALoginAPI(username, password)
            if(data.errorcode === 200){
                setFetchingStatus(false)
                setKey(data.data.key)
                setLoginStatus(true)
                
            }else {
                console.log(data)
                setFetchingStatus(false)
            }

    }

    return (
        <>
        {
            isLogin ? null :  
            <div className='login-page-container'>
                <h1>Login</h1>
                <h3>Welcome to Trip Report Portal</h3>
                <Form>
                    <Form.Group className="mb-3 form-group" as={Row}>
                        <Form.Label >Username</Form.Label>
                        <Col>
                            <Form.Control type="text" placeholder="Enter username" onChange={(event) => setUsername(event.target.value)} />
                        </Col>
                    </Form.Group>
                    <Form.Group className="mb-3 form-group" as={Row}>
                        <Form.Label  >Password</Form.Label>
                        <Col>
                            <Form.Control type="password" placeholder="Password" onChange={(event) => setPassword(event.target.value)}  />
                        </Col>
                    </Form.Group>
                    <Button variant="info" type="button" onClick={() => LoginHandler()} disabled={isFetching}>
                        Login
                    </Button>
                </Form>
            </div>
        }

        </>
    )
}

export default LoginPage