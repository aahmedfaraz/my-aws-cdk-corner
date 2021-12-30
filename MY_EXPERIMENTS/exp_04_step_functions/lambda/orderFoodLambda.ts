exports.handler = (event : any) => {
    console.log("EVENT ==> ", event)
    return {
        customer : "Ahmed Faraz",
        task : "Ordering Food",
        food : "Pasta",
        quantity : "1"
    }
}