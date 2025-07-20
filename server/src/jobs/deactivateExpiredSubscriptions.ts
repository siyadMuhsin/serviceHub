import logger from "../config/logger";
import expertModel from "../models/expert.model";
import cron from 'node-cron'

// The actual task
const deactivateExpiredSubscriptions = async () => {
  try {
    const result = await expertModel.updateMany(
      {
        'subscription.isActive': true,
        'subscription.endDate': { $lt: new Date() }
      },
      {
        $set: { 'subscription.isActive': false }
      }
    );

    logger.info(
      `${new Date().toISOString()} — Deactivated ${result.modifiedCount} expired subscriptions`
    );
  } catch (err) {
    logger.error('Error in deactivateExpiredSubscriptions', err);
  }
};



// Schedule: daily at midnight
cron.schedule('0 0 * * *', () => {
  logger.info('Running scheduled job: deactivateExpiredSubscriptions');
  deactivateExpiredSubscriptions();
});