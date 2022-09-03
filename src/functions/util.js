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

export const dateToMillis = (date) => {
    let d = new Date(date)
    return d.getTime()
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

export const clearNullItem = (dataset) => {
    const preFinalData = dataset.filter(item => {
        return item
    })
    return preFinalData
}

