// Loads the environment variables from the .env file
require('dotenv').config();


let fs = require('fs'),
    http = require('http'),
    express = require('express'),
    bodyParser = require('body-parser'),
    compression = require('compression'),
    cookieParser = require('cookie-parser'),
    helperFunctions = require('./utils/helper-functions');

let app = express(),
    cors = require('cors');

app.use(compression());    
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');
app.use(bodyParser.json({
    limit: '50mb',
    extended: true,
    parameterLimit: 1000000
}));
app.use(bodyParser.urlencoded({
    limit: '50mb',
    extended: true,
    parameterLimit: 1000000
}));
app.use(cookieParser());
app.use(cors());


app.get('/analytics/get/:developer', (req, res) => {
    if (!req.params.developer)
        retu
