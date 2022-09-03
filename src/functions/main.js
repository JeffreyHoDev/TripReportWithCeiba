import { CALLCEIBAGPSDetails } from './apicaller'
import { processGPS, processDuration, processLocationName } from './dataprocesser'
import { calculateDuration, clearNullItem } from './util'


export const TripReportProcessStart = async(key, terid, searchDate, carplate) => {
    const GPSData = await CALLCEIBAGPSDetails(key, terid, searchDate, carplate)
    const compiledTrip =  processGPS(GPSData, carplate)
    const cleanedTripData = clearNullItem(compiledTrip)
    const dataWithDuration = processDuration(cleanedTripData)
    const finalData = await processLocationName(dataWithDuration)
    const durationData = calculateDuration(finalData)
    return {finalData, carplate, durationData}
}