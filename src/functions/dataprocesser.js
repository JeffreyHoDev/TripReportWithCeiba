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
            let duration = dateToMillis(items[i]["time"]) - dateToMillis(items[i-1]["time"])
            totalDuration += duration
            drivingDuration += duration
        }else if(items[i]["speed"] > 0){
            let duration = dateToMillis(items[i]["time"]) - dateToMillis(items[i-1]["time"])
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

    let threshold = 5 * 60 * 1000; // Milliseconds

    let accumulateTimerForStop = 0
    let timeHolderForStop = 0
    let processingStatusForStopAccTimer = false
    let alreadySendTemp = false

    let tempHolder = null;
    let currentHolder = null;

    let startStopIndex = 0
    let gotTemp = false

    const processedData = dataTobeProcessed.data.map((item, index) => {
        if(item.speed > maxspeed){
            maxspeed = item.speed
        }
        if(index === 0){
            speedholder = item.speed
            currentHolder = Object.assign({}, item)
            if(item.speed === 0 && processingStatusForStopAccTimer === false){
                timeHolderForStop = dateToMillis(item["time"])
            }
        }else if(index === dataTobeProcessed.data.length-1 ){
            if(speedholder === 0 && item.speed !== 0 && accumulateTimerForStop >= threshold){
                let temporary = Object.assign({}, currentHolder)
                temporary.maxSpeed = 0
                return temporary 
            }
            if(speedholder !== 0 && item.speed === 0 && gotTemp === true){
                let temporary = Object.assign({}, tempHolder)
                temporary["maxSpeed"] = maxspeed
                return temporary
            }
            if(speedholder === 0 && item.speed === 0 && gotTemp === true){
                accumulateTimerForStop = dateToMillis(item.time) - timeHolderForStop
                if(accumulateTimerForStop < threshold){
                    let temporary = Object.assign({}, currentHolder)
                    temporary.maxSpeed = 0
                    return temporary
                }else {
                    let temporary2 = Object.assign({}, tempHolder)
                    temporary2["maxSpeed"] = maxspeed
                    return temporary2
                }

            }
            if(speedholder !== 0 && item.speed !== 0){
                let temporary2 = Object.assign({}, currentHolder)
                temporary2["maxSpeed"] = maxspeed
                return temporary2
            }
        }else {
            if(speedholder > 0 && item.speed === 0){
                alreadySendTemp = false
                tempHolder = Object.assign({}, currentHolder)
                gotTemp = true
                currentHolder = Object.assign({}, item)
                speedholder = currentHolder.speed
                timeHolderForStop = dateToMillis(item["time"])
                startStopIndex = index
                processingStatusForStopAccTimer = true
            }

            if(speedholder === 0 && item.speed === 0){
                accumulateTimerForStop = dateToMillis(item.time) - timeHolderForStop
            }

            if(alreadySendTemp === false && accumulateTimerForStop >= threshold && processingStatusForStopAccTimer === true && gotTemp === true){
                alreadySendTemp = true;
                tempHolder["maxSpeed"] = maxspeed
                maxspeed = 0
                gotTemp = false;
                return tempHolder
            }

            // If threshold not enough then met driving
            if(speedholder === 0 && item.speed > 0 && accumulateTimerForStop < threshold && gotTemp === true){
                currentHolder = Object.assign({}, tempHolder)
                speedholder = currentHolder.speed
                processingStatusForStopAccTimer = false
                accumulateTimerForStop = 0
                alreadySendTemp = false
                timeHolderForStop = 0
                gotTemp = false
            }else if(speedholder === 0 && item.speed > 0 && accumulateTimerForStop >= threshold) {
                let temporary = Object.assign({}, currentHolder)
                temporary.maxSpeed = 0
                currentHolder = Object.assign({}, item)
                speedholder = item.speed
                processingStatusForStopAccTimer = false
                accumulateTimerForStop = 0
                timeHolderForStop = 0
                alreadySendTemp = false
                return temporary 
            }
                                
        }

        return null
    })
    
    // if(dataTobeProcessed.data.length !== 0){
    //     for(let i = 0; i < dataTobeProcessed.data.length; i++){
    //         if(item.speed > maxspeed){
    //             maxspeed = dataTobeProcessed.data[i]["speed"]
    //         }
    
    //         if(i === 0){
    //             speedholder = dataTobeProcessed.data[i]["speed"]
    //             previousTime = dateToMillis(dataTobeProcessed.data[i]["time"])
    //             currentHolder = Object.assign({}, dataTobeProcessed.data[i])
    //             if(dataTobeProcessed.data[i]["speed"] > maxspeed){
    //                 maxspeed = dataTobeProcessed.data[i]["speed"]
    //             }
    //             if(dataTobeProcessed.data[i]["speed"] === 0 && processingStatusForStopAccTimer === false){
    //                 timeHolderForStop = dateToMillis(dataTobeProcessed.data[i]["gpstime"])
    //             }
    //         }
    //         else {
    //             // Tackle if it is first time there is stop
    //             if(dataTobeProcessed.data[i]["speed"] === 0 && processingStatusForStopAccTimer === false && timeHolderForStop === 0){
    //                 timeHolderForStop = dateToMillis(dataTobeProcessed.data[i]["gpstime"])
    //             }
    
    //             // Get Accumulate Timer for Stopping
    //             if(speedholder === 0 && dataTobeProcessed.data[i]["speed"] === 0){
    //                 accumulateTimerForStop = accumulateTimerForStop + ( dateToMillis(dataTobeProcessed.data[i]["gpstime"]) - timeHolderForStop)
    //                 processingStatusForStopAccTimer = true
    //                 if(accumulateTimerForStop >= threshold && alreadySendTemp === false && processingStatusForStopAccTimer === true) {
    //                     processedData.push(Object.assign({}, tempHolder))
    //                     processedData[processedData.length-1]["maxspeed"] = maxspeed
    //                     maxspeed = 0
    //                     processingStatusForStopAccTimer = false
    //                     alreadySendTemp = true
    //                 }
    //             }else if(speedholder === 0 && dataTobeProcessed.data[i]["speed"] > 0){
    //                 processedData.push(Object.assign({}, currentHolder))
    //                 processedData[processedData.length-1]["maxspeed"] = 0
    //                 maxspeed = 0
    //                 alreadySendTemp = false
    //             }
    
    //             if(speedholder > 0 && dataTobeProcessed.data[i]["speed"] === 0){
    //                 tempHolder = Object.assign({}, currentHolder)
    //                 currentHolder = Object.assign({}, dataTobeProcessed.data[i])
    //                 speedholder = currentHolder["speed"]
    //             }
    //         }
    //     }
    // }


    // const processedData = dataTobeProcessed.data.map((item, index) => {
    //     if(item.speed > maxspeed){
    //         maxspeed = item.speed
    //     }

    //     if(index === 0) {
    //         previousTime = dateToMillis(item.gpstime)
    //         speedholder = parseInt(item.speed)
    //         locationHolder.latitude = parseFloat(item.gpslat)
    //         locationHolder.longitude = parseFloat(item.gpslng)
    //         itemHolder = item
    //     } else if( speedholder !== 0 && item.speed === 0 && (dateToMillis(item.gpstime) - previousTime > threshold)  && (haversine(locationHolder, {"latitude": item.gpslat, "longitude": item.gpslng}, {unit: 'km'}) > 1)){ // if now come to stop when previous is driving, return the previousholder data with max speed, holder is current item now
    //         previousTime = dateToMillis(item.gpstime)
    //         speedholder = parseInt(item.speed)
    //         itemHolder["maxSpeed"] = maxspeed
    //         maxspeed = 0
    //         let itemToBeReturn = Object.assign({}, itemHolder)
    //         itemHolder = item
    //         locationHolder.longitude = item.gpslat
    //         locationHolder.longitude = item.gpslng
    //         return itemToBeReturn
    //     }else if( speedholder === 0 && item.speed !== 0 && (dateToMillis(item.gpstime) - previousTime > threshold)){
    //         previousTime = dateToMillis(item.gpstime)
    //         speedholder =  parseInt(item.speed)
    //         itemHolder["maxSpeed"] = 0
    //         let itemToBeReturn = Object.assign({}, itemHolder)
    //         itemHolder = item
    //         locationHolder.longitude = item.gpslat
    //         locationHolder.longitude = item.gpslng
    //         return itemToBeReturn            
    //     }
    //     return null
    // })

    // console.log(processedData)
    
    const preFinalData = processedData.filter(item => {
        return item
    })

    const dataAfterDuration = preFinalData.map((item,index) => {
        if(index === preFinalData.length - 1){
            item["duration"] = "Last Data of the day"
            item["maxSpeed"] = item.speed
            return item
        }else {
            let durationDiff =  dateToMillis(preFinalData[index+1]["time"]) - dateToMillis(item["time"])
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