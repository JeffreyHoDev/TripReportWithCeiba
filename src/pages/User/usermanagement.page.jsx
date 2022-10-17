import './usermanagement.styles.css'
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';

import { Link } from 'react-router-dom'

import { Link } from 'react-router-dom'

const UserManagementPage = () => {


    return (
      <>
        <div className='user-management-page-container'>
            <div className='button-group'>
                <Link to={`/user-management/add-user`} className="link-name">ADD USER</Link>
            </div>
            <Table striped bordered hover responsive="sm">
                <thead>
                    <tr>
                        <th>Index</th>
                        <th>Username</th>
                        <th>Created by</th>
                        <th>Role</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>1</td>
                        <td>Jeffrey</td>
                        <td>AdminGor</td>
                        <td>Admin</td>
                    </tr>
                </tbody>
            </Table>
        </div>
      </>
    )
}

export default UserManagementPage