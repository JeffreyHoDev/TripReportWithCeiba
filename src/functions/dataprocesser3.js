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
        if(item.speed > maxspeed) {
            maxspeed = item.speed
        }
        if(index === 0){
            currentHolder = Object.assign({}, item)
            return null
        }

        if(currentHolder["speed"] > 0 && item.speed === 0){
            if(dateToMillis(item.time) - dateToMillis(currentHolder["time"]) >= bigthreshold){
                let newTemp = Object.assign({}, currentHolder)
                newTemp["maxSpeed"] = maxspeed;
                maxspeed = 0
                currentHolder = Object.assign({}, item)
                return newTemp
            }

            gotTemp = true;
            tempHolder = Object.assign({}, currentHolder)
            currentHolder = Object.assign({}, item)
        }

        if(currentHolder["speed"] === 0 && item.speed === 0){
            accumulateTimerForStop = dateToMillis(item["time"]) - dateToMillis(currentHolder["time"])
            if((accumulateTimerForStop >= threshold || accumulateTimerForStop >= bigthreshold) && gotTemp){
                tempHolder["maxSpeed"] = maxspeed
                maxspeed = 0
                gotTemp = false
                return tempHolder
            }
        }

        if(currentHolder["speed"] === 0 && item.speed > 0){
            if(accumulateTimerForStop >= threshold || accumulateTimerForStop >= bigthreshold){
                let newTemp = Object.assign({}, currentHolder)
                newTemp["maxSpeed"] = 0;
                currentHolder = Object.assign({}, item)
                accumulateTimerForStop = 0
                return newTemp
            }else if(accumulateTimerForStop < threshold && gotTemp){
                currentHolder = Object.assign({}, tempHolder)
                gotTemp = false
                accumulateTimerForStop = 0
                return null
            }else if(accumulateTimerForStop < threshold && !gotTemp){
                let newTemp = Object.assign({}, currentHolder)
                newTemp["maxSpeed"] = 0;
                accumulateTimerForStop = 0;
                currentHolder = Object.assign({}, item)
                return newTemp
            }
        }

    
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
