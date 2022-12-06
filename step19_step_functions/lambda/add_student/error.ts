export const handler = async (event: any) => {
    console.log("ERROR =============");
    console.log("EVENT >> ", event);
    return {
        error: {
            message: event.Payload.error.message + ' > ERROR'
        }
    };
}