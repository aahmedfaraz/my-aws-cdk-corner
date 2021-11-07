type AppSyncEvent = {
    info: {
        fieldName: String
    }
}

exports.handler = async (event : AppSyncEvent) => {
    switch(event.info.fieldName){
        case 'welcome':
            return 'Welcome from AppSync Lambda, developed by Ahmed Faraz'
        case 'developer':
            return 'Ahmed Faraz'
        default:
            return 'No match found'
    }
}