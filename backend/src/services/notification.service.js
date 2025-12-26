const emailUtil = require('../utils/email.util');

class NotificationService {
    async sendWelcomeNotification(user) {
        try {
            await emailUtil.sendEmail({
                to: user.email,
                subject: 'Welcome to ApniSec Issue Tracker',
                html: emailUtil.getWelcomeEmailTemplate(user.username)
            });
            console.log(`Welcome email sent to ${user.email}`);
        } catch (error) {
            console.error('Failed to send welcome email:', error);
            // Don't throw error to avoid breaking registration
        }
    }

    async sendIssueCreatedNotification(user, issue) {
        try {
            await emailUtil.sendEmail({
                to: user.email,
                subject: `Issue Created: ${issue.title}`,
                html: emailUtil.getIssueEmailTemplate(user.username, issue)
            });
            console.log(`Issue notification sent to ${user.email}`);
        } catch (error) {
            console.error('Failed to send issue notification:', error);
            // Don't throw error to avoid breaking issue creation
        }
    }
}

module.exports = new NotificationService();