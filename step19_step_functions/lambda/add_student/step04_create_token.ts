export const handler = async (event: any) => {
    console.log("STEP 04 =============");
    console.log("EVENT >> ", event);
    if (event.Payload.step === 4) {
        return {
            error: {
                message: 'This is ERROR message from step - 04'
            }
        }
    } else {
        return {
            success: {
                message: 'Final Result: This is SUCCESS message from step - 04'
            }
        }
    }
};