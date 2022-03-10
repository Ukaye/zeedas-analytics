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
        return res.status(500).send('Required parameter(s) not sent!');
    
    const developer = req.params.developer;
    const tasks = require('./data/tasks.json');
    const time_tracker = require('./data/time-tracker.json');
    const submissions = require('./data/submissions.json');
    let assigned_tasks = require('./data/assigned-tasks.json');
    assigned_tasks = assigned_tasks.filter(e => e.developer.toLowerCase() === developer.toLowerCase());
    assigned_tasks = assigned_tasks.map(assigned => {
        let task = tasks.filter(task => task.id === assigned.taskId)[0];
        if (!task) return {};
        task.assigned = assigned;
        task.time_tracker = time_tracker.filter(tracker => tracker.taskId === task.id);
        task.time_worked = helperFunctions.sumArrayObjectsByKey(task.time_tracker, 'duration');
        task.time_extension = task.time_worked > task.duration? task.time_worked - task.duration : 0;
        task.submissions = submissions.filter(submission => submission.taskId === task.id);
        task.total_submissions = task.submissions.length;
        return task;
    });
    // most recent 10
    assigned_tasks = assigned_tasks.slice(0, 9);

    const time_extension = helperFunctions.sumArrayObjectsByKey(assigned_tasks, 'time_extension').round(2);
    const total_complexity = helperFunctions.sumArrayObjectsByKey(assigned_tasks, 'complexity');
    const time_worked = helperFunctions.sumArrayObjectsByKey(assigned_tasks, 'time_worked').round(2);
    const speed = (total_complexity / time_worked).round(2);
    const accuracy = (10 / helperFunctions.sumArrayObjectsByKey(assigned_tasks, 'total_submissions')).round(2);

    res.send({
        status: 200,
        error: null,
        response: {
            time_extension,
            speed,
            accuracy,
            time_worked
        }
    })
});

// catch 404 and forward to error handler
app.use((req, res) => {
    res.status(404);

    if (req.accepts('html')) {
        return res.render('404', {
            url: req.url
        });
    }

    if (req.accepts('json')) {
        return res.send({
            error: 'Not found'
        });
    }

    res.type('txt').send('Not found');
});

app.get('/error', (req, res) => {
    console.log(req.query.error);
    res.render('404', {
        url: req.url,
        error: req.query.error
    });
});

module.exports = app;
let server = http.createServer(app);

server.listen(process.env.port || process.env.PORT || 4000, () => {
    console.log('server running on %s', process.env.PORT);
});




