// Required imports and configuration
const express = require('express');
const nodemailer = require('nodemailer');
const app = express();
app.use(express.json());
require('dotenv').config();

// Configure Nodemailer transporter with environment variables
const transporter = nodemailer.createTransport({
    service: 'gmail', 
    auth: {
        user: process.env.EMAIL_USER, // Use Railway environment variable for the email address
        pass: process.env.EMAIL_PASS, // Use Railway environment variable for the email password
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

// New endpoint to send reset password link
app.post('/send-reset-password', async (req, res) => {
    const { to_email, reset_link } = req.body;

    if (!to_email || !reset_link) {
        return res.status(400).send("Missing email or reset link");
    }

    const mailOptions = {
        from: '"Visual Thoughts App" <no-reply@visualthoughtsapp.com>',
        to: to_email,
        subject: 'Reset Your Password',
        text: `Hello,\n\nWe received a request to reset your password for your Visual Thoughts App account.\n\nYou can reset your password by clicking the link below:\n\n${reset_link}\n\nIf you did not request a password reset, please ignore this email.\n\nBest regards,\nThe Visual Thoughts App Team`,
        html: `
            <p>Hello,</p>
            <p>We received a request to reset your password for your <strong>Visual Thoughts App</strong> account.</p>
            <p>You can reset your password by clicking the link below:</p>
            <p><a href="${reset_link}" target="_blank" style="color: #1a73e8;">Reset Password</a></p>
            <p>If you did not request a password reset, please ignore this email.</p>
            <p>Best regards,<br>The Visual Thoughts App Team</p>
        `,
    };

    try {
        await transporter.sendMail(mailOptions);
        res.send('Password reset link sent!');
    } catch (error) {
        console.error("Error sending reset password email:", error);
        res.status(500).send('Error sending reset password link.');
    }
});

app.get('/', (req, res) => {
    res.send('Visual Thoughts App Email Service');
});

app.listen(3000, () => {
    console.log('Proxy server running on port 3000');
});