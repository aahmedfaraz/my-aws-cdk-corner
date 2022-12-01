export const handler = async (event: any, context: any) => {
    console.log("STEP 01 =============");
    console.log("EVENT >> ", event);
    console.log("CONTEXT >> ", context);
    if (event.body.step === 1) {
        return {
            error: {
                message: 'PATH FOLLOWED : 1'
            }
        }
    } else {
        return {
            step: event.body.step,
            message: 'PATH FOLLOWED : 1'
        }
    }
};