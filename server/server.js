import express from 'express';
import bodyParser from 'body-parser';
import http from 'http';

const SERVER_DEV_PORT = 8001;
const port = process.env.PORT || SERVER_DEV_PORT;

const app = express();
app.use(bodyParser.json());

const httpServer = http.Server(app);
httpServer.listen(port);
console.log(`Server started on ${port}`);
