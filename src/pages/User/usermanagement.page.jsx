import './usermanagement.styles.css'
import Table from 'react-bootstrap/Table';

import { Link } from 'react-router-dom'

const UserManagementPage = () => {

    return (
      <>
        <div className='add-user-link-container'>
            <Link to="/user-management/add-user" className='add-user-link'>ADD USER</Link>
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
      </>
    )
}

export default UserManagementPage