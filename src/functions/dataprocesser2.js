import { CALLGoogleGeoLocationAPI } from './apicaller'
import { msToHMS, dateToMillis } from './util'


export const processGPS = (dataset) => {
    let maxspeed = 0

    let threshold = 3 * 60 * 1000; // Milliseconds
    let bigthreshold = 30 * 60 * 1000
    let accumulateTimerForStop = 0


    let tempHolder = null;
    let currentHolder = null;

    let gotTemp = false

    const processedData = dataset.data.map((item, index) => {
        console.log(currentHolder)
        if(index === 0) {
            currentHolder = Object.assign({}, item)
            return null            
        }
        if(item.speed > maxspeed) {
            maxspeed = item.speed
        }

        if(currentHolder["speed"] > 0 && item.speed === 0){
            if(dateToMillis(item.time) - dateToMillis(currentHolder["time"]) >= bigthreshold){
                let newTemp = Object.assign({}, currentHolder)
                newTemp["maxSpeed"] = maxspeed;
                maxspeed = 0;
                currentHolder = Object.assign({}, item)
                return newTemp
            }
            console.log("Assign tempholder")
            gotTemp = true;
            tempHolder = Object.assign({}, currentHolder)
            currentHolder = Object.assign({}, item)
        }

        if(currentHolder["speed"] === 0 && item.speed === 0){
            console.log("calculate accumulate timer")
            accumulateTimerForStop = dateToMillis(item["time"]) - dateToMillis(currentHolder["time"])
            
            if(accumulateTimerForStop >= threshold && gotTemp){
                console.log("Push the temp holder")
                tempHolder["maxSpeed"] = maxspeed
                maxspeed = 0;
                gotTemp = false
                return tempHolder
            }
        }

        if(currentHolder["speed"] === 0 && item.speed > 0){
            if(dateToMillis(item.time) - dateToMillis(currentHolder["time"]) >= bigthreshold){
                let newTemp = Object.assign({}, currentHolder)
                newTemp["maxSpeed"] = 0;
                currentHolder = Object.assign({}, item)
                return newTemp
            }
            if(accumulateTimerForStop < threshold && gotTemp){
                console.log("reset current holder to temp holder")
                gotTemp = false
                currentHolder = Object.assign({}, tempHolder)
            }else if(accumulateTimerForStop < threshold && !gotTemp) {
                console.log("If no temp and less than threshold")
                let newTemp = Object.assign({}, currentHolder)
                newTemp["maxSpeed"] = 0;
                currentHolder = Object.assign({}, item)
                return newTemp
            }else if(accumulateTimerForStop >= threshold){
                console.log("push the stop record more than threshold")
                let newTemp = Object.assign({}, currentHolder)
                newTemp["maxSpeed"] = 0;
                accumulateTimerForStop = 0
                currentHolder = Object.assign({}, item)
                return newTemp
            }
        }





        // // If driving until come to a stop
        // if(currentHolder["speed"] !== 0 && item.speed === 0){ 
        //     if(dateToMillis(item["time"]) - dateToMillis(currentHolder["time"]) >= bigthreshold){
        //         let newTemp =  Object.assign({}, currentHolder)
        //         newTemp["maxSpeed"] = maxspeed;
        //         maxspeed = 0;
        //         currentHolder =  Object.assign({}, item)
        //         return newTemp
        //     }

        //     gotTemp = true
        //     tempHolder =  Object.assign({}, currentHolder)
        //     currentHolder =  Object.assign({}, item)
        //     return null
        // }


        // if(currentHolder["speed"] === 0 && item.speed === 0){ // if keep stop
        //     accumulateTimerForStop = dateToMillis(item["time"]) - dateToMillis(currentHolder["time"])
        //     if(gotTemp && (accumulateTimerForStop >= threshold || accumulateTimerForStop >= bigthreshold)){
        //         gotTemp = false;
        //         tempHolder["maxSpeed"] = maxspeed;
        //         maxspeed = 0;
        //         return tempHolder
        //     }
        // }

        // if(currentHolder["speed"] > 0 && item.speed > 0){ // if keep run
        //     return null
        // }


        // // if stop until come to drive
        // if(currentHolder["speed"] === 0 && item["speed"] > 0) {
        //     if(accumulateTimerForStop >= threshold ){
        //         let newTemp = Object.assign({}, currentHolder)
        //         newTemp["maxSpeed"] = 0;
        //         currentHolder = Object.assign({}, item)
        //         return newTemp
        //     }
        //     else{
        //         currentHolder = Object.assign({}, tempHolder)
        //         accumulateTimerForStop = 0
        //     }
        // }

        return null
    })

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
