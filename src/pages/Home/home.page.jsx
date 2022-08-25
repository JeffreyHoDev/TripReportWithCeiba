import { CALLCEIBADeviceList, CALLCEIBAGPSDetails } from '../../functions/apicaller'

import ListGroupComponent from '../../components/ListGroup/listgroup.component'

import InputGroup from 'react-bootstrap/InputGroup';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Table from 'react-bootstrap/Table';
import Spinner from 'react-bootstrap/Spinner';

import { useState, useEffect } from 'react'
import './home.page.styles.css'

const Homepage = ({ apikey, isLogin }) => {

    const [deviceList, setDeviceList] = useState(null)
    const [selectedDevice, setSelectedDevice] = useState(null)
    const [searchDate, setDate] = useState("")
    const [processedData, setProcessedData] = useState(null)
    const [queryVehicle, setQueryVehicle] = useState("")
    const [isQueryingData, setTripDataStatus] = useState(false)
    const [durationData, setDurationData] = useState(null)

    const searchHandler = async () => {
        if(selectedDevice === null || searchDate === ""){
            alert("Please select a vehicle and choose a date")
        }else {
            setTripDataStatus(true)
            const data = await CALLCEIBAGPSDetails(apikey, selectedDevice.deviceid, searchDate, selectedDevice.carlicence)
            setQueryVehicle(selectedDevice.carlicence)
            setProcessedData([].concat(data.dataAfterMap))
            setDurationData(data.durationData)
            setTripDataStatus(false)
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
                        <div className='small-details'>
                            <div>
                                <h3>{`Serial Number: ${selectedDevice.deviceid}`}</h3>
                                <h3>{`Vehicle Plate: ${selectedDevice.carlicence}`}</h3>
                                <h3>{`Search Date: ${searchDate ? searchDate : "Haven't select Date"}`}</h3>
                            </div>
                            {
                                durationData !== null ? (
                                    <div>
                                        <h4>{`Total Duration: ${durationData.totalDuration}`}</h4>
                                        <h4>{`Stopping Duration: ${durationData.idleDuration}`}</h4>
                                        <h4>{`Driving Duration: ${durationData.drivingDuration}`}</h4>
                                    </div>
                                ): <div></div>
                            }
                        </div>
                        : null
                    }

                    <div className='tripdetail-container'>
                    {
                        isQueryingData ? 
                        <Spinner animation="border" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </Spinner> : 
                        processedData !== null ? 
                        <Table striped bordered hover responsive="sm">
                            <thead>
                                <tr>
                                    <th>Vehicle Plate</th>
                                    <th>Time</th>
                                    <th>Location</th>
                                    <th>Max Speed(km/h)</th>
                                    <th>Duration</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    processedData.map((item, index) => {
                                        return (
                                            <tr key={`row-${index}`}>
                                                <td>{queryVehicle}</td>
                                                <td>{item.gpstime}</td>
                                                <td>{item.location === null ? <p style={{"color": "red"}}>Failed To Analyze</p> : item.location}</td>
                                                <td>{item.maxSpeed}</td>
                                                <td>{item.duration}</td>
                                                <td>{item.maxSpeed === 0 ? <p style={{"color": "red"}}>Stopping</p> : <p style={{"color": "green"}}>Driving</p>}</td>
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