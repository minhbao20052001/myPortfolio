const express = require('express');
const cookieParser = require('cookie-parser');
const expressLayouts = require('express-ejs-layouts');



const viewRoute = require('./routes/viewRoute');
const userRoute = require('./routes/userRoute');
const eduRoute = require('./routes/eduRoute');
const messageRoute = require('./routes/messageRoute');



const app = express();

// Use public
app.use(express.static(`${__dirname}/public`));

// users express layouts
app.use(expressLayouts);

// Use view engine
app.set('view engine', 'ejs');

// User parse json
app.use(express.json());

// User cookie
app.use(cookieParser())


// Use routes
app.use('/api/v1/user', userRoute)
app.use('/api/v1/edu', eduRoute)
app.use('/api/v1/message', messageRoute)
app.use('/', viewRoute)

app.all('*', (req, res, next) => {
    res.send('Not Found!');
})

module.exports = app;