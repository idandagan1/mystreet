import express from 'express';
import bodyParser from 'body-parser';
import log from 'morgan';
import mongoose from 'mongoose';
import session from 'express-session';
import expressValidator from 'express-validator';
import routes from './routes/';

const SERVER_DEV_PORT = 8001;
const port = process.env.PORT || SERVER_DEV_PORT;

const app = express();

mongoose.connect('mongodb://localhost/mystreet');

app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: false,
    },
}));

app.use(bodyParser.urlencoded({
    extended: true,
}));
app.use(bodyParser.json());
app.use(expressValidator());

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', req.headers.origin);
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH');
    res.header('Access-Control-Allow-Credentials', 'true');
    next();
});

app.use(log('dev'));
app.use(routes);

app.listen(port, () => {
    console.log(`Server started on ${port}`);
});
