const cron = require('node-cron');
const { Advertisement } = require('./src/models/ads.model');

function startCronJobs() {
    // Run the job every day at 00:00
    cron.schedule('0 0 * * *', async () => {
        const advertisements = await Advertisement.find({
            isPaid: true,
            isExpired: false
        });

        advertisements.forEach(async (advertisement) => {
            const expiryDate = new Date(advertisement.paidAt.getTime() + advertisement.expiresIn * 24 * 60 * 60 * 1000);
            if (new Date() > expiryDate) {
                advertisement.isExpired = true;
                await advertisement.save();
            }
        });
    });


    //test everyminute
    // cron.schedule('* * * * *', async () => {
    //     const advertisements = await Advertisement.find({
    //         isPaid: true,
    //         isExpired: false
    //     });

    //     advertisements.forEach(async (advertisement) => {
    //         const expiryDate = new Date(advertisement.paidAt.getTime() + 60 * 1000);
    //         if (new Date() > expiryDate) {
    //             advertisement.isExpired = true;
    //             await advertisement.save();
    //         }
    //     });
    // });
}

module.exports = startCronJobs;
