import dotenv from 'dotenv';
import dotenvExpand from 'dotenv-expand';
dotenvExpand.expand(dotenv.config());

// get data from .env file
const config = {
    host: process.env.HOST || 'localhost',
    port: Number(process.env.PORT) || 3000,
    mongo_db: process.env.MONGO_CLUSTER_DB || "",
    mongo_local_db: process.env.MONGO_LOCAL_DB || "",
    mongo_connection_preference: process.env.MONGO_CONNECTION_PREFERENCE || "local",
    app_name: process.env.APP_NAME || "Practical Task",

    // bcrypt
    bcrypt_salt_round: Number(process.env.BCRYPT_SALT_ROUND) || 10,

    // set rate limit
    request_data_limit: process.env.REQUEST_DATA_LIMIT || '1000kb',

    // Jwt
    jwt_encryption: process.env.JWT_ENCRYPTION || 'secret',
    jwt_expiration: process.env.JWT_EXPIRATION || '1d',

    base_url: process.env.BASE_URL || '',

    // HTTP status codes
    http_status_ok: 200,
    http_status_auth_fail: 403,
    status_success: 1,
    status_fail: 0,
};

export default config;