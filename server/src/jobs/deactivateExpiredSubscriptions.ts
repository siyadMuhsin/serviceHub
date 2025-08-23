// import cron from "node-cron";
// import expertModel from "../models/expert.model";
// import logger from "../config/logger";
// // Run every day at midnight
// cron.schedule("0 0 * * *", async () => {
//   logger.info(`[CRON] Checking for expired subscriptions...`);

//   const now = new Date();

//   try {
//     const result = await expertModel.updateMany(
//       {
//         "subscription.endDate": { $lte: now },
//         "subscription.isActive": true
//       },
//       {
//         $set: {
//           "subscription.isActive": false
//         }
//       }
//     );

//     logger.info(
//       `[CRON] Subscriptions deactivated: ${result.modifiedCount}`
//     );
//   } catch (err) {
//     logger.error(`[CRON] Error updating subscriptions:`, err);
//   }
// });
