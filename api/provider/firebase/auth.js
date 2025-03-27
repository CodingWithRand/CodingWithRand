const responseStatus = require("../../../responseStatus");
const nodemailer = require("nodemailer")
const path = require("path");
const fs = require("fs");
const { google } = require("googleapis");
const { auth } = require("./initialize");

const createCustomToken = async (req, res) => {
    const { uid } = req.body;
    try {
        const customToken = await auth.createCustomToken(uid)
        responseStatus.created(res, { message: "Custom token has been created!", requireJSON: true, responseJSON: { token: customToken } })
    } catch (e) {
        responseStatus.notFound(res, "Invalid uid!")
    }
}

const verifyToken = async (req, res) => {
    const { token } = req.body;
    try {
        await auth.verifyIdToken(token)
        responseStatus.noContent(res, "Token is valid!")
    } catch (e) {
        responseStatus.notFound(res, "Invalid token!")
    }
}

const setCustomUserClaims = async (req, res) => {
    const { uid, claims, securityStage } = req.body;
    try {
        switch(securityStage){
            case "none":
                await auth.setCustomUserClaims(uid, claims);
                responseStatus.noContent(res, "User's claims has been set!");
            default:
                responseStatus.notFound(res, "Invalid security stage!");
        }
    } catch (e) {
        responseStatus.badRequest(res, e.message)
    }
}

const getCustomUserClaims = async (req, res) => {
    const { uid, securityStage } = req.body;
    try {
        let visibleClaims = {};
        const user = await auth.getUser(uid);
        for(const claim in user.customClaims){
            switch(securityStage){
                case "none":
                    if(claim !== "adminLevel" || claim !== "premiumLevel") visibleClaims[claim] = user.customClaims[claim];
                    break;
                default:
                    responseStatus.notFound(res, "Invalid security stage!");
            }
        }
        responseStatus.ok(res, visibleClaims);
    } catch (e) {
        responseStatus.notFound(res, "Invalid uid!")
    }
}

const getUserProviderData = async (req, res) => {
    const { uid } = req.body;
    try {
        const user = await auth.getUser(uid);
        responseStatus.ok(res, user.providerData);
    } catch (e) {
        responseStatus.notFound(res, "Invalid uid!")
    }
}

const sendEmail = async (req, res) => {
    const { email } = req.body;
    const { subject } = req.params.subject

    const keyPath = path.join(__dirname, 'codingwithrand-firebase-adminsdk-g2ghs-e88a2d7f24.json');
    const keyFile = JSON.parse(fs.readFileSync(keyPath, 'utf8'));

    async function createJwtClient() {
        try {
          const jwtClient = new google.auth.JWT(
            keyFile.client_email,
            null,
            keyFile.private_key,
            ['https://www.googleapis.com/auth/gmail.send']
          );
      
          await jwtClient.authorize();
      
          return jwtClient;
        } catch (error) {
          console.error('Error creating JWT client:', error);
          throw error;
        }
    }
      
    async function createSafeTransporter() {
        try {
          const jwtClient = await createJwtClient();
      
          const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
              type: 'OAuth2',
              user: 'thanwisitang7910@gmail.com', // Your Gmail address
              clientId: keyFile.client_id,
              accessToken: jwtClient.credentials.access_token
            }
          });
      
          return transporter;
        } catch (error) {
          console.error('Error creating transporter:', error);
          throw error;
        }
    }

    try {
        const transporter = await createSafeTransporter();
        const mailContent = {
            from: `CWR <${keyFile.client_email}>`,
            to: `You <${email}>`
        }
        switch(subject){
            case "verifyEmail":
                const veLink = await auth.generateEmailVerificationLink(email);
                mailContent.subject = "Email Verification";
                mailContent.text = `Please click on the following link to verify your email: ${veLink}`;
                break;
            case "resetPassword":
                const rpLink = await auth.generatePasswordResetLink(email);
                mailContent.subject = "Password Reset";
                mailContent.text = `Please click on the following link to reset your password: ${rpLink}`;
                break;
            default:
                responseStatus.notFound(res, "Invalid subject!");
        }
        transporter.sendMail(mailContent, (err, info) => {
            if(err) console.error(err);
            else responseStatus.noContent(res, "Email has been sent!");
        }) 
    } catch (e) {
        responseStatus.badRequest(res, e.message)
    }
}

module.exports = {
    createCustomToken,
    verifyToken,
    setCustomUserClaims,
    getCustomUserClaims,
    getUserProviderData,
    sendEmail
}