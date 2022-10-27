import { CALLGoogleGeoLocationAPI } from './apicaller'
import { msToHMS, dateToMillis } from './util'


export const processGPS = (dataset) => {

    let maxspeed = 0

    let threshold = 3 * 60 * 1000; // Milliseconds
    let bigthreshold = 30 * 60 * 1000
    let currentHolder = null;

    const processedData = dataset.data.map((item, index) => {
        if(item.speed > maxspeed){
            maxspeed = item.speed
        }
        if(index === 0){
            currentHolder = Object.assign({}, item)
            currentHolder["maxSpeed"] = item.speed
            return currentHolder
        }
        if(currentHolder["speed"] === 0 && item.speed > 0){
            let newTemp = Object.assign({}, currentHolder)
            newTemp["maxSpeed"] = 0
            currentHolder = Object.assign({}, item)
            return newTemp
        }

        if(currentHolder["speed"] > 0 && item.speed === 0){
            let newTemp = Object.assign({}, currentHolder)
            newTemp["maxSpeed"] = maxspeed
            maxspeed = 0
            currentHolder = Object.assign({}, item)
            return newTemp
        }
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
