import ListGroup from 'react-bootstrap/ListGroup';
import Spinner from 'react-bootstrap/Spinner';


import './listgroup.styles.css'

const ListGroupComponent = ({ deviceList, setSelectedDevice, isLogin }) => {


    return (
    <>
        <div className='listgroup-component-container'>
            {
                isLogin ? 
                    deviceList === null ? 
                    (
                        <Spinner animation="border" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </Spinner>
                    )
                    : 
                    <div>
                        <ListGroup>
                        {
                            deviceList[0].data.map((item,index) => {
                                return (
                                    <ListGroup.Item key={`device${index}`} action href={`#${index}`} onClick={() => setSelectedDevice(item)}>
                                        {item.carlicence}
                                    </ListGroup.Item>
                                )
                            })
                        }
                        </ListGroup>
                    </div>                     
                : null
            }
        </div>
    </>
    );
}

export default ListGroupComponent;