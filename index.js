require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser")
const cors = require("cors")
// const multer = require("multer");

const server = express();

// const storage = multer.memoryStorage();
// const upload = multer({ storage });

const response = require("./responseStatus");
const { userExist, getUserInfo } = require("./api/roblox/main");
const { 
    /* Firebase */
    crud, 
    sqlQuery, 
    verifyToken, 
    createCustomToken, 
    setCustomUserClaims, 
    getCustomUserClaims, 
    getUserProviderData, 
    sendEmail,
    /* Supabase */
    adminQueries
} = require("./api/provider/main");

server.use("/post/provider/*", cors({
    origin: [
        "https://codingwithrand.vercel.app", 
        "https://cwr-education.vercel.app"
    ]
}));

server.use(bodyParser.json())

server.use("/post/provider/cwr/*", (req, res, next) => {
    if(req.method === "POST" && req.body.adminKey === process.env.FIREBASE_PERSONAL_ADMIN_KEY) next();
    else response.unauthorized(res, "Invalid admin key");
})

server.use((req, res, next) => {
    const originalSend = res.send;
    res.send = function (body) {
        originalSend.call(this, body);
        console.log("ending connection")
        res.end();
    };
    next();
})

server.use((req, res, next) => {
    if(req.method === "GET"){
        if(req.is('application/json')) next();
        if(req.headers['user-agent'].includes("Mozilla") || req.headers['user-agent'].includes("Opera")){
            res.setHeader('Content-Type', 'text/html');
            res.json = (data) => res.send(`<pre>${JSON.stringify(data, null, 2)}</pre>`);
        }else res.setHeader('Content-Type', 'application/json')
    }else if(req.method === "POST") if(!req.is('application/json')) return response.unsupportContentType(res, "Invalid content-type (Must be json only)")
    next();
})

server.get("/get/roblox/users/exist/:userKey", userExist)
server.get("/get/roblox/users/info/:category/:userId", getUserInfo)

// These are for codingwithrand (cwr) project -> codingwithrand.vercel.app

/*Firebase*/
server.post("/post/provider/firebase/firestore/query", sqlQuery)
server.post("/post/provider/firebase/firestore/:mode", crud)
server.post("/post/provider/firebase/auth/verifyToken", verifyToken)
server.post("/post/provider/firebase/auth/createCustomToken", createCustomToken)
server.post("/post/provider/firebase/auth/setCustomUserClaims", setCustomUserClaims)
server.post("/post/provider/firebase/auth/getCustomUserClaims", getCustomUserClaims)
server.post("/post/provider/firebase/auth/getUserProviderData", getUserProviderData)
server.post("/post/provider/firebase/auth/sendEmail/:subject", sendEmail)

/*Supabase*/
server.post("/post/provider/supabase/queries/:mode", adminQueries)

server.post("*", (req, res) => response.notFound(res))
server.get("*", (req, res) => response.notFound(res))

server.listen(process.env.PORT || 3000, async () => {
    console.log(`Server is running on port ${process.env.PORT || 3000}`);
    const open = await import('open');
    open.default(`http://localhost:${process.env.PORT}`);
})