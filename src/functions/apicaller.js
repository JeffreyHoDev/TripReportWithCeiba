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
        const compare = (a,b) => {
            if(a < b){
                return -1
            }
            if(a > b){
                return 1
            }
            return 0
        }
        
        data.data.sort((a,b) => compare(a.carlicence, b.carlicence))

        return data
    }catch(error) {
        console.log(error)
    }
}

export const CALLCEIBAGPSDetails = async( key, terid, searchDate, carplate ) => {
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
        
        return data
    }catch(error) {
        console.log(error)
    }
}

export const CALLGoogleGeoLocationAPI = async (coordinates) => {
    try {
        const key = "AIzaSyDr5VKsAqZqgN8zfppjow65NxlgfiB8pds"
        const response = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${coordinates.latitude},${coordinates.longitude}&key=${key}`)
        const data = await response.json()
        return data
    }catch(error){
        
        return {
            "error_message": error
        }
    }
}