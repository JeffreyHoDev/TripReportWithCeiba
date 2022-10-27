import { CALLGoogleGeoLocationAPI } from './apicaller'
import { msToHMS, dateToMillis } from './util'


export const processGPS = (dataset) => {
    let speedholder = 0
    let maxspeed = 0

    let threshold = 3 * 60 * 1000; // Milliseconds
    let bigthreshold = 30 * 60 * 1000
    let accumulateTimerForStop = 0
    let timeHolderForStop = 0
    let processingStatusForStopAccTimer = false
    let alreadySendTemp = false

    let tempHolder = null;
    let currentHolder = null;

    let gotTemp = false

    const processedData = dataset.data.map((item, index) => {
        if(item.speed > maxspeed) {
            maxspeed = item.speed
        }
        if(index === 0) {
            currentHolder = Object.assign({}, item)
            return null            
        }
        if(currentHolder["speed"] !== 0 && item.speed === 0){ // If now come to a stop after driving
            if(dateToMillis(item["time"]) - dateToMillis(currentHolder["time"]) >= bigthreshold){
                let newTemp =  Object.assign({}, currentHolder)
                newTemp["maxSpeed"] = maxspeed;
                maxspeed = 0;
                currentHolder =  Object.assign({}, item)
                return newTemp
            }
            gotTemp = true
            tempHolder =  Object.assign({}, currentHolder)
            currentHolder =  Object.assign({}, item)
            return null
        }
        if(currentHolder["speed"] === 0 && item.speed === 0 && dateToMillis(item["time"]) - dateToMillis(currentHolder["time"]) > threshold){ // if still continue to stop until exceed threshold
            if(gotTemp){
                gotTemp = false
                tempHolder["maxSpeed"] = maxspeed;
                maxspeed = 0;
                return tempHolder
            }
            accumulateTimerForStop = dateToMillis(item["time"]) - dateToMillis(currentHolder["time"])
            return null
        }
        if(item.speed !== 0 && currentHolder["speed"] === 0 && accumulateTimerForStop >= threshold){
            let newTemp =  Object.assign({}, currentHolder)
            currentHolder =  Object.assign({}, item)
            newTemp["maxSpeed"] = 0
            accumulateTimerForStop = 0
            return newTemp
        }
        if(currentHolder["speed"] > 0 && item.speed > 0){
            return null
        }
    })
    //     if(item.speed > maxspeed){
    //         maxspeed = item.speed
    //     }
    //     if(index === 0){ // If first data
    //         speedholder = item.speed
    //         currentHolder = Object.assign({}, item)
    //         if(item.speed === 0 && processingStatusForStopAccTimer === false){
    //             timeHolderForStop = dateToMillis(item["time"])
    //         }
    //     }else if(index === dataset.data.length-1 ){  // if last data
    //         if(speedholder === 0 && item.speed !== 0 && accumulateTimerForStop >= threshold){ // if now is already driving after stop exceed threshold
    //             let temporary = Object.assign({}, currentHolder)
    //             temporary.maxSpeed = 0
    //             return temporary 
    //         }
    //         if(speedholder !== 0 && item.speed === 0 && gotTemp === true){ // if now is stop and previously driving
    //             let temporary = Object.assign({}, tempHolder)
    //             temporary["maxSpeed"] = maxspeed
    //             return temporary
    //         }
    //         if(speedholder === 0 && item.speed === 0 && gotTemp === true){
    //             accumulateTimerForStop = dateToMillis(item.time) - timeHolderForStop
    //             if(accumulateTimerForStop < threshold){
    //                 let temporary = Object.assign({}, currentHolder)
    //                 temporary.maxSpeed = 0
    //                 return temporary
    //             }else {
    //                 let temporary2 = Object.assign({}, tempHolder)
    //                 temporary2["maxSpeed"] = maxspeed
    //                 return temporary2
    //             }

    //         }
    //         if(speedholder !== 0 && item.speed !== 0){
    //             let temporary2 = Object.assign({}, currentHolder)
    //             temporary2["maxSpeed"] = maxspeed
    //             return temporary2
    //         }
    //     }else {
    //         if(speedholder > 0 && item.speed === 0){ // temporary only occur when it comes to a stop
    //             if(dateToMillis(item["time"]) - dateToMillis(currentHolder["time"]) > threshold){
    //                 let newTemp = Object.assign({}, currentHolder)
    //                 newTemp["maxSpeed"] = maxspeed;
    //                 maxspeed = 0;
    //                 alreadySendTemp = false
    //                 tempHolder = Object.assign({}, currentHolder)
    //                 gotTemp = true
    //                 currentHolder = Object.assign({}, item)
    //                 speedholder = currentHolder.speed
    //                 timeHolderForStop = dateToMillis(item["time"])
    //                 processingStatusForStopAccTimer = true
    //                 return newTemp
    //             }
    //             alreadySendTemp = false
    //             tempHolder = Object.assign({}, currentHolder)
    //             gotTemp = true
    //             currentHolder = Object.assign({}, item)
    //             speedholder = currentHolder.speed
    //             timeHolderForStop = dateToMillis(item["time"])
    //             processingStatusForStopAccTimer = true
    //         }

    //         if(speedholder === 0 && item.speed === 0){
    //             accumulateTimerForStop = dateToMillis(item.time) - timeHolderForStop
    //         }

    //         if(alreadySendTemp === false && accumulateTimerForStop >= threshold && processingStatusForStopAccTimer === true && gotTemp === true){
    //             alreadySendTemp = true;
    //             tempHolder["maxSpeed"] = maxspeed
    //             maxspeed = 0
    //             gotTemp = false;
    //             return tempHolder
    //         }

    //         // If threshold not enough then met driving
    //         if(speedholder === 0 && item.speed > 0 && accumulateTimerForStop < threshold && gotTemp === true){
    //             currentHolder = Object.assign({}, tempHolder)
    //             speedholder = currentHolder.speed
    //             processingStatusForStopAccTimer = false
    //             accumulateTimerForStop = 0
    //             alreadySendTemp = false
    //             timeHolderForStop = 0
    //             gotTemp = false
    //         }else if(speedholder === 0 && item.speed > 0 && accumulateTimerForStop >= threshold) {
    //             let temporary = Object.assign({}, currentHolder)
    //             temporary.maxSpeed = 0
    //             currentHolder = Object.assign({}, item)
    //             speedholder = item.speed
    //             processingStatusForStopAccTimer = false
    //             accumulateTimerForStop = 0
    //             timeHolderForStop = 0
    //             alreadySendTemp = false
    //             return temporary 
    //         }
                                
    //     }

    //     return null
    // })

    return processedData

}

export const processDuration = (datasets) => {
    const dataAfterDuration = datasets.map((item,index) => {
        if(index === datasets.length - 1){
            item["duration"] = "Last Data of the day"
            item["maxSpeed"] = item.speed
            return item
        }else {
            let durationDiff =  dateToMillis(datasets[index+1]["time"]) - dateToMillis(item["time"])
            item["duration"] = msToHMS(durationDiff)
            return item
        }
    })
    return dataAfterDuration
}

export const processLocationName = async(datasets) => {
    const dataAfterMap = await Promise.all(datasets.map(async item => {
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
    return dataAfterMap
}
