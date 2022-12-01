export const handler = async (event: any) => {
    console.log("STEP 04 =============");
    console.log("EVENT >> ", event);
    if (event.Payload.step === 4) {
        return {
            error: {
                message: event.Payload.message + ' > 4 > ERROR'
            }
        }
    } else {
        return {
            success: {
                message: event.Payload.message + ' > 4 > SUCCESS'
            }
        }
    }
};