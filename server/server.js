import express from 'express';
import bodyParser from 'body-parser';
import http from 'http';
import { MongoClient } from 'mongodb';
import passport from 'passport';
import session from 'express-session';
import routes from './routes/';

const SERVER_DEV_PORT = 8001;
const port = process.env.PORT || SERVER_DEV_PORT;

require('./config/passport')(passport);

const app = express();
app.use(routes);
app.use(bodyParser.json());
app.use(session({
    secret: 'keyboard cat',
    resave: true,
    saveUninitialized: false,
}));
app.use(passport.initialize());
app.use(passport.session());

const url = 'mongodb://localhost:27017/mystreet';
MongoClient.connect(url, (err, db) => {});

const httpServer = http.Server(app);
httpServer.listen(port);
console.log(`Server started on ${port}`);
