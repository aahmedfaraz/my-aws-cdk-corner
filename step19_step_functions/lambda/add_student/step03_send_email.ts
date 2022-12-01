export const handler = async (event: any) => {
    console.log("STEP 03 =============");
    console.log("EVENT >> ", event);
    if (event.Payload.step === 3) {
        return {
            error: {
                message: event.Payload.message + ' > 3'
            }
        }
    } else {
        return {
            step: event.Payload.step,
            message: event.Payload.message + ' > 3'
        }
    }
};