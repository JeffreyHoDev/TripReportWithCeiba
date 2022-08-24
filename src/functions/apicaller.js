export const CallCEIBALoginAPI = async ( username, password) => {
    try {
        const response = await fetch(`https://eye2a.tnts.com.sg:22056/api/v1/basic/key?username=${username}&password=${password}`)
        const data = await response.json()
        return data
    }catch(error) {
        console.log(error)
    }

}

export const CALLCEIBADeviceList = async( key ) => {
    try {
        const response = await fetch(`https://eye2a.tnts.com.sg:22056/api/v1/basic/devices?key=${key}`)
        const data = await response.json()
        return data
    }catch(error) {
        console.log(error)
    }
}

export const GPSDataProcess = (dataTobeProcessed) => {
    let speedholder = 0
    const processedData = dataTobeProcessed.data.map((item, index) => {
        if(index === 0 || index === dataTobeProcessed.data.length - 1) {
            speedholder = item.speed
            return item
        }else {
            if(speedholder === 0 && item.speed === 0) {
                return null
            }else if(speedholder === 0 && item.speed > 10){
                speedholder = item.speed
                return item
            }else if(speedholder > 0 && item.speed === 0){
                speedholder = item.speed
                return item
            }
        }
    })

    const preFinalData = processedData.filter(item => {
        return item
    })
    return preFinalData
}

export const CALLCEIBAGPSDetails = async( key, terid, searchDate ) => {
    try {
        const response = await fetch(`https://eye2a.tnts.com.sg:22056/api/v1/basic/gps/detail`, {
            method: "POST",
            headers: {
                "Content-type": "application/json"
            },
            body: JSON.stringify({
                "terid": terid,
                "key": key,
                "starttime": `${searchDate} 00:00:00`,
                "endtime": `${searchDate} 23:59:59`
            })
        })
        const data = await response.json()
        const finalData = await GPSDataProcess(data)
        return finalData
    }catch(error) {
        console.log(error)
    }
}

