const User = require("../Models/userSchema");
const ResetToken = require("../Models/ResetToken");
const VerificationToken = require("../Models/VerificationToken");
const axios = require("axios");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const jwt = require('jsonwebtoken');
const JWTSEC = process.env.JWTSEC;

const verifyMail = async (req, res) => {
    try {
        const { name, email } = req.body;
        const otp = Math.floor(Math.random() * 10000);
        if (otp < 1000 || otp > 9999) otp = 6969;

        const response = await axios({
            method: 'post',
            url: 'https://api.sendinblue.com/v3/smtp/email',
            headers: {
                'api-key': process.env.API_KEY,
                'content-type': 'application/json'
            },
            data: {
                sender: {
                    name: 'SocialBuddies',
                    email: 'deepikabajaj31@gmail.com'
                }, to: [{
                    email: email,
                    name: name
                }
                ],
                subject: 'Email Verification OTP for Social',
                htmlContent: `<p>Your email verification otp for Social is ${otp}</p>`,
                replyTo: {
                    email: 'deepikabajaj31@gmail.com',
                    name: 'SocialBuddies'
                }
            }
        });

        console.log('Email sent successfully:', response.data);
        // console.log('Email sent successfully:');
        res.status(201).json(otp);
    } catch (error) {
        res.status(500).json({ error: `Error sending email: ${error}` });
    }
}

const verifiedSuccessfullMail = async (req, res) => {
    try {
        const { user, OTP } = req.body;
        const mainuser = await User.findById(user);

        if (!mainuser) return res.status(400).json("User not found");
        if (mainuser.verifed === true) {
            return res.status(200).json("User already verifed");
        }

        const token = await VerificationToken.findOne({ user: mainuser._id });
        if (!token) {
            return res.status(400).json("Sorry token not found");
        }

        const isMatch = await bcrypt.compareSync(OTP, token.token);
        if (!isMatch) {
            return res.status(400).json("Token is not valid");
        }

        mainuser.verifed = true;
        await VerificationToken.findByIdAndDelete(token._id);

        await mainuser.save();
        const accessToken = jwt.sign(
            {
                id: mainuser._id,
                username: mainuser.username,
            },
            JWTSEC
        );
        const { password, ...other } = mainuser._doc;

        const response = await axios({
            method: 'post',
            url: 'https://api.sendinblue.com/v3/smtp/email',
            headers: {
                'api-key': process.env.API_KEY,
                'content-type': 'application/json'
            },
            data: {
                sender: {
                    name: 'SocialBuddies',
                    email: 'deepikabajaj31@gmail.com'
                }, to: [{
                    email: mainuser.email,
                    name: mainuser.username
                }
                ],
                subject: 'Email verified successfully',
                htmlContent: `<p>Now you can login in social app!</p>`,
                replyTo: {
                    email: 'deepikabajaj31@gmail.com',
                    name: 'SocialBuddies'
                }
            }
        });

        console.log('Email sent successfully:', response.data);

        res.status(200).json({ other, accessToken });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: `Error sending email: ${error}` });
    }
}

const forgotPassowrdMail = async (req, res) => {
    try {
        const { name, email } = req.body;

        let user = await User.findOne({ email: email });
        if (!user) {
            return res.status(400).json("User not found");
        }

        const token = await ResetToken.findOne({ user: user._id });
        if (token) {
            await ResetToken.findOneAndDelete({ user: user._id });
        }

        const RandomTxt = crypto.randomBytes(20).toString("hex");
        const resetToken = new ResetToken({
            user: user._id,
            token: RandomTxt,
        });
        await resetToken.save();

        const response = await axios({
            method: 'post',
            url: 'https://api.sendinblue.com/v3/smtp/email',
            headers: {
                'api-key': process.env.API_KEY,
                'content-type': 'application/json'
            },
            data: {
                sender: {
                    name: 'Social',
                    email: 'deepikabajaj31@gmail.com'
                }, to: [{
                    email: email,
                    name: name
                }
                ],
                subject: 'Reset Password for Social',
                htmlContent: `<p>Your reset password link is: 
                    <a href="https://socialbuddies-f3e87.web.app/reset/password?token=${RandomTxt}&_id=${user._id}">
                    https://socialbuddies-f3e87.web.app/reset/password?token=${RandomTxt}&_id=${user._id}
                    </a>
                </p>`,
                replyTo: {
                    email: 'deepikabajaj31@gmail.com',
                    name: 'Social'
                }
            }
        });

        console.log('Email sent successfully:', response.data);
        res.status(200).json("Check your email to reset password");
    } catch (error) {
        res.status(500).json({ error: `Error sending email: ${error}` });
    }
}

const resetPasswordMail = async (req, res) => {
    try {
        const { token, _id } = req.query;
        if (!token || !_id) {
            return res.status(400).json("Invalid req");
        }

        const user = await User.findOne({ _id: _id });
        if (!user) {
            return res.status(400).json("user not found");
        }

        const resetToken = await ResetToken.findOne({ user: user._id });
        if (!resetToken) {
            return res.status(400).json("Reset token is not found");
        }

        const isMatch = await bcrypt.compareSync(token, resetToken.token);
        if (!isMatch) {
            return res.status(400).json("Token is not valid");
        }

        const { password } = req.body;
        const secpass = await bcrypt.hash(password, 10);
        user.password = secpass;
        await user.save();

        const response = await axios({
            method: 'post',
            url: 'https://api.sendinblue.com/v3/smtp/email',
            headers: {
                'api-key': process.env.API_KEY,
                'content-type': 'application/json'
            },
            data: {
                sender: {
                    name: 'SocialBuddies',
                    email: 'deepikabajaj31@gmail.com'
                }, to: [{
                    email: user.email,
                    name: user.username
                }
                ],
                subject: 'Password reset successfully',
                htmlContent: `<p>Your passowrd has bee reset successfully. Now you can login with new password!</p>`,
                replyTo: {
                    email: 'deepikabajaj31@gmail.com',
                    name: 'SocialBuddies'
                }
            }
        });

        console.log('Email sent successfully:', response.data);
        res.status(200).json("Email has been send");
    } catch (error) {
        res.status(500).json({ error: `Error sending email: ${error}` });
    }
}

module.exports = { verifyMail, forgotPassowrdMail, resetPasswordMail, verifiedSuccessfullMail };