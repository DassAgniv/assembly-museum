import express from 'express';
import { getVisitors } from './handlers/getVisitorsHandler';

const app = express();
const port = 3000;

app.get('/api/visitors', getVisitors);

const server = app.listen(port, () => {
    console.log(`Server started at http://localhost:${port}`);
});

export default server;