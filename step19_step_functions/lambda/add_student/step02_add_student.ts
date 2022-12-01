export const handler = async (event: any, context: any) => {
    console.log("STEP 02 =============");
    console.log("EVENT >> ", event);
    console.log("CONTEXT >> ", context);
    if (event.Payload.step === 2) {
        return {
            error: {
                message: event.Payload.message + ' > 2',
            }
        }
    } else {
        return {
            step: event.Payload.step,
            message: event.Payload.message + ' > 2'
        }
    }
};