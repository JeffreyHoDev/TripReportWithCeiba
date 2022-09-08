import './usermanagement.styles.css'
import Table from 'react-bootstrap/Table';

const UserManagementPage = () => {

    return (
      <>
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