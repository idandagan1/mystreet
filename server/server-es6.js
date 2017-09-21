import express from 'express';
import path from 'path';
import bodyParser from 'body-parser';
import log from 'morgan';
import mongoose from 'mongoose';
import connectMongo from 'connect-mongo';
import session from 'express-session';
import expressValidator from 'express-validator';
import webpack from 'webpack';
import WebpackDevServer from 'webpack-dev-server';
import * as devConfig from '../webpack.development.config';
import routes from './routes/';

const MongoStore = connectMongo(session);
const SERVER_DEV_PORT = 8001;
const port = process.env.PORT || SERVER_DEV_PORT;
const app = express();
const DIST_DIR = path.join(__dirname, '../dist');
const HTML_FILE = path.join(DIST_DIR, 'index.html');
const isDevelopment = process.env.NODE_ENV !== 'production';
const CLIENT_DEV_PORT = process.env.PORT || 8000;

if (isDevelopment) {
    mongoose.connect('mongodb://localhost/mystreet');
    process.env.url = 'http://localhost';
    new WebpackDevServer(webpack(devConfig), { historyApiFallback: true }).listen(CLIENT_DEV_PORT, startServerCallback);
} else {
    mongoose.connect('mongodb://emma:Aa123123@ds143734.mlab.com:43734/mystreet');
    process.env.url = 'https://mystreet.herokuapp.com';
    app.use(express.static(DIST_DIR));
    app.get('*', (req, res) => res.sendFile(HTML_FILE));
}

function startServerCallback(err, result) {
    if (err) console.error(err);
    console.log(`Listening at ${process.env.url}:${CLIENT_DEV_PORT}/`);
}

app.use(session({
    secret: 'keyboard cat',
    store: new MongoStore({ mongooseConnection: mongoose.connection }),
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
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');
    res.header('Access-Control-Allow-Credentials', 'true');
    next();
});

app.use(log('dev'));
app.use(routes);

const server = app.listen(port, () => {
    console.log(`${process.env.NODE_ENV} server started on ${process.env.url}:${port}`);
});
