// server/index.js


const express = require("express");

var http = require('http');
var path = require("path");
var sha256 = require("crypto-js/sha256");
var bodyParser = require('body-parser');
var helmet = require('helmet');
var rateLimit = require("express-rate-limit");

const PORT = process.env.PORT || 3001;

const cors = require('cors');
const { randomUUID } = require("crypto");

//import routes
const userMethods = require('./routes/auth.js');
const instrumentMethods = require('./routes/instrument.js');
const studioMethods = require('./routes/studio.js');

const jobMethods = require('./routes/jobs.js');
const jobRejectionRequestMethods = require('./routes/jobRejectionRequest.js');

const unavailabilitiesMethods = require('./routes/unavailabilities.js');
const jobPreferencesMethods = require('./routes/jobPreferences.js');

const app = express();
var server = http.createServer(app);

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100 // limit each IP to 100 requests per windowMs
});


app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json())
app.use(helmet());
app.use(cors());
app.use(limiter);


//Use methods
app.use("/users", userMethods);
app.use("/instruments", instrumentMethods);
app.use("/studios", studioMethods);

app.use("/jobs",jobMethods);
app.use("/jobRejectionRequest", jobRejectionRequestMethods);

app.use("/unavailabilities", unavailabilitiesMethods);
app.use("/jobPreferences", jobPreferencesMethods);

app.listen(PORT, () => {
    console.log(`Server listening on ${PORT}`);
});