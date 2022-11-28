export const handler = async (event: any) => {
    console.log("STEP 01 =============");
    console.log("EVENT >> ", event);
    if (event.step === 1) {
        return {
            error: {
                message: 'This is ERROR message from step - 01'
            }
        }
    } else {
        return {
            step: event.step
        }
    }
};