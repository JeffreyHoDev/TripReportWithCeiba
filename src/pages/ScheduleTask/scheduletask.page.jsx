import './scheduletask.styles.css'
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

const ScheduleTaskPage = ({ isLogin }) => {
    return (
        <>
            {
                isLogin ? 
                    (
                        <div className='schedule-task-page-container'>
                            <h2>Schedule Task</h2>
                            <p style={{"fontStyle": "italic"}}>The feature is still under developing, not official in use</p>
                            <Form>
                                <Form.Group className="mb-3">
                                    <Form.Label>Job Date</Form.Label>
                                    <Form.Control type="date" placeholder="Enter Date" />
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label>Job Time</Form.Label>
                                    <Form.Control type="time" placeholder="Enter Time" />
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label>Location Name</Form.Label>
                                    <Form.Control type="text" placeholder="Location Name" />
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label>Workers</Form.Label>
                                    <Form.Control as="textarea" rows={3} placeholder="Workers Name" />
                                </Form.Group>
                                <Button variant="primary" type="button">
                                    Assign
                                </Button>
                            </Form>
                        </div>
                    )
                : null
            }
        </>
    )
}

export default ScheduleTaskPage