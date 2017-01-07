import express from 'express';
import bodyParser from 'body-parser';
import log from 'morgan';
import mongoose from 'mongoose';
import session from 'express-session';
import expressValidator from 'express-validator';
import routes from './routes/';
import passportConfig from './config/passport';

const SERVER_DEV_PORT = 8001;
const port = process.env.PORT || SERVER_DEV_PORT;

const app = express();

mongoose.connect('mongodb://localhost/mystreet');

app.use(session({
    secret: 'keyboard cat',
    resave: true,
    saveUninitialized: true,
}));
app.use(bodyParser.urlencoded({
    extended: true,
}));
app.use(bodyParser.json());
app.use(expressValidator());

app.use(log('dev'));
passportConfig(app);
app.use(routes);

app.listen(port, () => {
    console.log(`Server started on ${port}`);
});
