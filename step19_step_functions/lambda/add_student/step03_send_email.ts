export const handler = async (event: any) => {
    console.log("STEP 03 =============");
    console.log("EVENT >> ", event);
    if (event.Payload.step === 3) {
        return {
            error: {
                message: 'This is ERROR message from step - 03'
            }
        }
    } else {
        return {
            step: event.Payload.step
        }
    }
};