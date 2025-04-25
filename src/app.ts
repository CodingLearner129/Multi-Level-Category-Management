import express from 'express';
import cors from 'cors';
import config from './config/config'
import { router as indexRouter } from "./routes/index";


const app = express();

app.use(cors());
app.use(express.json());

app.use('/api', indexRouter);

app.use((req, res) => {
    res.status(404).json({
        status: config.status_fail,
        message: `Can't find ${req.originalUrl} on this server!`
    });
});

export default app;
