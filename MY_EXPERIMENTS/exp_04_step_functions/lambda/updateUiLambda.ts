exports.handler = (event : any) => {
    console.log("EVENT ==> ", event)
    return {
        customer : "Ahmed Faraz",
        task : "Updating UI",
        UIStatus : true,
    }
}