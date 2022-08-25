import haversine from 'haversine'
import { CALLGoogleGeoLocationAPI } from './apicaller'

export const dateToMillis = (date) => {
    let d = new Date(date)
    return d.getTime()
}

export const msToHMS = ( ms ) => {
    // 1- Convert to seconds:
    let seconds = ms / 1000;
    // 2- Extract hours:
    const hours = parseInt( seconds / 3600 ); // 3,600 seconds in 1 hour
    seconds = seconds % 3600; // seconds remaining after extracting hours
    // 3- Extract minutes:
    const minutes = parseInt( seconds / 60 ); // 60 seconds in 1 minute
    // 4- Keep only seconds not extracted to minutes:
    seconds = seconds % 60;
    return (hours+"h "+minutes+ "m "+seconds +"s")
    
}

export const calculateDuration = (items) => {
    let idleDuration = 0;
    let drivingDuration = 0;
    let totalDuration = 0;

    for(let i = 1; i < items.length; i++){
        if(items[i]["speed"] === 0){
            let duration = dateToMillis(items[i]["gpstime"]) - dateToMillis(items[i-1]["gpstime"])
            totalDuration += duration
            drivingDuration += duration
        }else if(items[i]["speed"] > 0){
            let duration = dateToMillis(items[i]["gpstime"]) - dateToMillis(items[i-1]["gpstime"])
            totalDuration += duration
            idleDuration += duration
        }
    }

    return {
        totalDuration: msToHMS(totalDuration),
        idleDuration: msToHMS(idleDuration),
        drivingDuration: msToHMS(drivingDuration)
    }

}

export const GPSDataProcess = async (dataTobeProcessed, carplate) => {
    let speedholder = 0
    let maxspeed = 0
    let locationHolder = {
        latitude: "",
        longitude: ""
    }
    let maxspeedlist = []
    let threshold = 5 * 60 * 1000; // Milliseconds
    let previousTime = 0;

    const processedData = dataTobeProcessed.data.map((item, index) => {
        let distance = haversine(locationHolder, {"latitude": item.gpslat, "longitude": item.gpslng}, { unit: 'km'});
        if(index === 0) {
            if(item.speed !== 0) {
                maxspeed = item.speed
            }else {
                item["maxSpeed"] = 0
            }
            speedholder = item.speed
            previousTime = dateToMillis(item.gpstime)
            locationHolder.latitude = item.gpslat
            locationHolder.longitude = item.gpslng
            return item
        }
        else {
            if(item.speed > maxspeed && speedholder > 0 ){
                maxspeed = item.speed
            }
            // if previous is stop, now is driving, check distance more than 1km, yes then return else ignore
            // if previous is stop, now is still stop, return null
            // if previous is driving, now stop, return with max speed and reset
            // if previous is driving, now still driving, capture max speed, then return null

            if(speedholder === 0 && item.speed > 5 && (dateToMillis(item.gpstime) - previousTime) >= threshold ){
                if(distance > 1){
                    speedholder = item.speed
                    previousTime = dateToMillis(item.gpstime)
                    maxspeed = item.speed
                    locationHolder.latitude = item.gpslat
                    locationHolder.longitude = item.gpslng
                    return item
                }else {
                    return null
                }
            }else if(speedholder !== 0 && item.speed === 0 && (dateToMillis(item.gpstime) - previousTime) >= threshold){
                if(distance > 1){
                    maxspeedlist.push(maxspeed)
                    speedholder = item.speed
                    previousTime = dateToMillis(item.gpstime)
                    locationHolder.latitude = item.gpslat
                    locationHolder.longitude = item.gpslng
                    maxspeed = 0
                    item["maxSpeed"] = 0
                    return item
                }else {
                    return null
                }
            }
        }
    })

    const preFinalData = processedData.filter(item => {
        return item
    })

    const dataAfterMaxSpeed = preFinalData.map((item) => {
        if(item["maxSpeed"] !== 0) {
            item["maxSpeed"] = maxspeedlist[0]
            maxspeedlist.shift()
            return item
        }else {
            return item
        }
    })

    const dataAfterDuration = dataAfterMaxSpeed.map((item,index) => {
        if(index === dataAfterMaxSpeed.length - 1){
            item["duration"] = "Last Data of the day"
            item["maxSpeed"] = item.speed
            return item

        }else {
            let durationDiff =  dateToMillis(dataAfterMaxSpeed[index+1]["time"]) - dateToMillis(item["time"])
            item["duration"] = msToHMS(durationDiff)
            return item
        }
    })

    const dataAfterMap = await Promise.all(dataAfterDuration.map(async item => {
        try{
            let coordinates = {
                "latitude": parseFloat(item.gpslat),
                "longitude": parseFloat(item.gpslng)
            }
            const data = await CALLGoogleGeoLocationAPI(coordinates)
            if(data.error_message){
                item["location"] = null
            }else {
                item["location"] = data.results[0]["formatted_address"]
            }
            return item

        }catch(err) {
            console.log(err)
        }
    })
    )
    
    const durationData = calculateDuration(dataAfterMap)
    

    return {dataAfterMap, carplate, durationData}
}