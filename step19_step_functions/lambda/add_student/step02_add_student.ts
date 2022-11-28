export const handler = async (event: any) => {
    console.log("STEP 02 =============");
    console.log("EVENT >> ", event);
    if (event.Payload.step === 2) {
        return {
            error: {
                message: 'This is ERROR message from step - 02'
            }
        }
    } else {
        return {
            step: event.Payload.step
        }
    }
};