export const handler = async (event: any, context: any) => {
    console.log("STEP 01 =============");
    console.log("EVENT >> ", event);
    console.log("CONTEXT >> ", context);

    const step = JSON.parse(event.step);
    if (step === 1) {
        return {
            error: {
                message: 'PATH FOLLOWED : 1'
            }
        }
    } else {
        return {
            step,
            message: 'PATH FOLLOWED : 1'
        }
    }
};