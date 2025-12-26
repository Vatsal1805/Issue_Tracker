const { Resend } = require('resend');

class EmailUtil {
    constructor() {
        this.resend = new Resend(process.env.RESEND_API_KEY);
        this.fromEmail = 'ApniSec <onboarding@resend.dev>';
    }
    async sendEmail(emailData) {
        try {
            const response = await this.resend.emails.send({
                from: this.fromEmail,
                ...emailData
            });
            return response;
        } catch (error) {
            console.error('Email sending failed:', error);
            throw error;
        }
    }

    getWelcomeEmailTemplate(name) {
        return `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
                .header h1 { color: white; margin: 0; font-size: 28px; }
                .content { background: #f9f9f9; padding: 30px; }
                .feature { background: white; margin: 15px 0; padding: 20px; border-radius: 8px; border-left: 4px solid #667eea; }
                .button { display: inline-block; background: #667eea; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; }
                .footer { background: #333; color: white; text-align: center; padding: 20px; border-radius: 0 0 8px 8px; }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>🛡️ Welcome to ApniSec</h1>
                    <p style="color: #e2e8f0;">Your Cybersecurity Issue Tracker</p>
                </div>
                
                <div class="content">
                    <h2>Hello ${name}! 👋</h2>
                    <p>Welcome to ApniSec Issue Tracker! Your account has been successfully created.</p>
                    
                    <div class="feature">
                        <h3>🎯 Track Security Issues</h3>
                        <p>Create and manage cybersecurity issues with priority levels.</p>
                    </div>
                    
                    <div class="feature">
                        <h3>📊 Dashboard Analytics</h3>
                        <p>Get real-time insights into your security issues.</p>
                    </div>
                    
                    <div style="text-align: center; margin: 30px 0;">
                        <a href="${process.env.FRONTEND_URL || 'http://localhost:3001'}/dashboard" class="button">Go to Dashboard</a>
                    </div>
                </div>
                
                <div class="footer">
                    <p>© 2024 ApniSec Issue Tracker</p>
                </div>
            </div>
        </body>
        </html>
        `;
    }

    getIssueEmailTemplate(name, issue) {
        const priorityColors = {
            'Low': '#10b981',
            'Medium': '#f59e0b',
            'High': '#ef4444'
        };

        return `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
                .header h1 { color: white; margin: 0; }
                .content { background: #f9f9f9; padding: 30px; }
                .issue-card { background: white; padding: 25px; border-radius: 8px; border-left: 4px solid #667eea; }
                .priority { padding: 5px 15px; border-radius: 20px; color: white; font-weight: bold; }
                .footer { background: #333; color: white; text-align: center; padding: 20px; border-radius: 0 0 8px 8px; }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>🚨 New Issue Created</h1>
                </div>
                
                <div class="content">
                    <h2>Hello ${name},</h2>
                    <p>A new security issue has been created.</p>
                    
                    <div class="issue-card">
                        <h3>${issue.title}</h3>
                        <p><strong>Type:</strong> ${issue.type}</p>
                        <p><strong>Priority:</strong> 
                            <span class="priority" style="background-color: ${priorityColors[issue.priority]};">
                                ${issue.priority}
                            </span>
                        </p>
                        <p><strong>Description:</strong></p>
                        <p style="background: #f7fafc; padding: 15px; border-radius: 4px;">
                            ${issue.description}
                        </p>
                    </div>
                </div>
                
                <div class="footer">
                    <p>© 2024 ApniSec Issue Tracker</p>
                </div>
            </div>
        </body>
        </html>
        `;
    }
}

module.exports = new EmailUtil();