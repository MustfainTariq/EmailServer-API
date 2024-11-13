const express = require('express');
const nodemailer = require('nodemailer');
const app = express();
app.use(express.json());

// Configure Nodemailer transporter
const transporter = nodemailer.createTransport({
    service: 'gmail', // Or use 'smtp.mailgun.org' if using Mailgun's SMTP
    auth: {
        user: 'visualthoughtsapp@gmail.com', // Your email address
        pass: 'xvel dads uzhn shkf',  // Your email password or app-specific password
    },
});

app.post('/send-email', async (req, res) => {
    const { to_email, verification_code, firstName } = req.body;

    if (!to_email || !verification_code || !firstName) {
        return res.status(400).send("Missing email or verification code");
    }

    const mailOptions = {
        from: '"Visual Thoughts App" <no-reply@visualthoughtsapp.com>',
        to: to_email,
        subject: 'Your Verification Code',
        text: `Hello ${firstName},\n\nThank you for signing up with Visual Thoughts App!\n\nYour verification code is:\n\n${verification_code}\n\nPlease enter this code in the app to verify your email address. This code is valid for a limited time.\n\nThis is an automated email. Please do not reply.\n\nBest regards,\nThe Visual Thoughts App Team`,
        html: `
            <p>Hello ${firstName},</p>
            <p>Thank you for signing up with <strong>Visual Thoughts App</strong>!</p>
            <p>Your verification code is:</p>
            <h2 style="color: #333;">${verification_code}</h2>
            <p>Please enter this code in the app to verify your email address. This code is valid for a limited time.</p>
            <p style="color: #888;">This is an automated email. Please do not reply.</p>
            <p>Best regards,<br>The Visual Thoughts App Team</p>
        `,
    };

    try {
        await transporter.sendMail(mailOptions);
        res.send('Verification code sent!');
    } catch (error) {
        console.error("Error sending email:", error);
        res.status(500).send('Error sending verification code.');
    }
});

app.listen(3000, () => {
    console.log('Proxy server running on port 3000');
});
