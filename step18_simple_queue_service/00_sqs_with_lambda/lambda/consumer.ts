exports.handler = async (event : any) => {
    event.Records.map((record : any, index : number) => {
        const { body } = record;
        console.info("BODY ", index + 1 , " : => ", body);
    })
}