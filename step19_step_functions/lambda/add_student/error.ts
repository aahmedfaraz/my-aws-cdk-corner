export const handler = async (event: any) => {
    console.log("ERROR =============");
    console.log("EVENT >> ", event);
    return {
        error: {
            message: 'This is ERROR message from ERROR lambda'
        }
    }
};