// This is a fake server to subscribe an email address. The counter is used to reject the subscription when it is 2
let count = 0; 

export function postEmail(email: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if (count <= 1) {
                resolve(true);
                console.log("Email sent to server: ", email);
                count++; // Increase counter;
            } else {
                reject(false); // Reject subscription`);
                count = 0; // Reset counter
                console.log("Email not sent to server: ", email);
                return false;
            }
        }, Math.random()*1000 + 3000);
    });
}