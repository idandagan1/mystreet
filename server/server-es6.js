import express from 'express';
import path from 'path';
import bodyParser from 'body-parser';
import log from 'morgan';
import mongoose from 'mongoose';
import connectMongo from 'connect-mongo';
import session from 'express-session';
import expressValidator from 'express-validator';
import webpack from 'webpack';
import dotenv from 'dotenv';
import WebpackDevServer from 'webpack-dev-server';
import * as devConfig from '../webpack.development.config';
import * as config from './config/config';
import routes from './routes/';


const MongoStore = connectMongo(session);
const port = config.port || 8000;
const app = express();
const DIST_DIR = path.join(__dirname, '../dist');
const HTML_FILE = path.join(DIST_DIR, 'index.html');
const isDevelopment = config.env !== 'production';

dotenv.config({ path: './config/config' });
mongoose.connect(config.db);

if (isDevelopment) {
    new WebpackDevServer(webpack(devConfig), { historyApiFallback: true }).listen(config.clientport, startServerCallback);
} else {
    app.use(express.static(DIST_DIR));
    app.get('*', (req, res) => res.sendFile(HTML_FILE));
}

function startServerCallback(err, result) {
    if (err) console.error(err);
    console.log(`Client started on ${config.url}:${config.clientport}/`);
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
    console.log(`${config.env} server started on ${config.url}:${port}`);
});

module.exports = app;
