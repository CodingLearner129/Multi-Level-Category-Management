import app from './app';
import config from './config/config';
import connectDB from './config/db';

const host = config.host;
const port = config.port;

connectDB().then(() => {
    app.listen(port, host, () => {
        console.log(`Listening on http://${host}:${port}`);
    });
});
