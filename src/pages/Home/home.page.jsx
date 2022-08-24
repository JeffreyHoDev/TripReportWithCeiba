import { CALLCEIBADeviceList, CALLCEIBAGPSDetails } from '../../functions/apicaller'

import ListGroupComponent from '../../components/ListGroup/listgroup.component'

import InputGroup from 'react-bootstrap/InputGroup';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Table from 'react-bootstrap/Table';

import { useState, useEffect } from 'react'
import './home.page.styles.css'

const Homepage = ({ apikey, isLogin }) => {

    const [deviceList, setDeviceList] = useState(null)
    const [selectedDevice, setSelectedDevice] = useState(null)
    const [searchDate, setDate] = useState("")
    const [processedData, setProcessedData] = useState(null)

    const searchHandler = async () => {
        if(selectedDevice === null || searchDate === ""){
            console.log("input not completed")
        }else {
            const data = await CALLCEIBAGPSDetails(apikey, selectedDevice.deviceid, searchDate)
            setProcessedData([].concat(data))
        }
    }

    useEffect(() => {
        const getDeviceList = async () => {
            if(apikey) {
                const data = await CALLCEIBADeviceList(apikey)
                setDeviceList([].concat(data))
            }
        }
        getDeviceList()
    }, [apikey])


    return (
        <>
        {
            !isLogin ? null 
            :            
            <div className='inputdate-container'>
                <InputGroup className="mb-3">
                    <InputGroup.Text id="basic-addon1">Query Date</InputGroup.Text>
                    <Form.Control
                    type="date"
                    placeholder="Start Date"
                    aria-label="Start Date"
                    aria-describedby="basic-addon1"
                    onChange={(event) => setDate(event.target.value)}
                    />
                </InputGroup>
                <div className="mb-2">
                    <Button variant="info" onClick={() => searchHandler()}>Search</Button>
                </div>
            </div>
        }
            <div className='home-page-container'>
                <ListGroupComponent 
                selectedDevice={selectedDevice} 
                deviceList={deviceList} 
                setSelectedDevice={setSelectedDevice} 
                isLogin={isLogin}
                />
                <div className='device-details'>
                    {
                        selectedDevice !== null ? 
                        <div>
                            <h2>{`Serial Number: ${selectedDevice.deviceid}`}</h2>
                            <h2>{`Vehicle Plate: ${selectedDevice.carlicence}`}</h2>
                        </div>
                        : null
                    }
                    <div className='tripdetail-container'>
                        {
                            processedData !== null ? 
                                <Table striped bordered hover>
                                    <thead>
                                        <tr>
                                            <th>Time</th>
                                            <th>Latitude</th>
                                            <th>Speed</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            processedData.map((item, index) => {
                                                return (
                                                    <tr key={`row-${index}`}>
                                                        <td>{item.gpstime}</td>
                                                        <td>{item.gpslat}</td>
                                                        <td>{item.speed}</td>
                                                    </tr>
                                                )
                                            })
                                        }
                                    </tbody>
                                </Table>
                            : null
                        }
                    </div>
                </div>
            </div>

        </>
    )
}

export default Homepage