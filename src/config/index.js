import dotenv from "dotenv";

dotenv.config()

export default {
    ENVIRONMENT: process.env.ENVIRONMENT || "dev",
    PORT: Number(process.env.PORT || 3000),

    // Database
    DATABASE_NAME: process.env.DATABASE_NAME || "gbese",
    DATABASE_USERNAME: process.env.DATABASE_USERNAME || "uche09",
    DATABASE_PASSWORD: process.env.DATABASE_PASSWORD,
    DATABASE_HOST: process.env.DATABASE_HOST || "localhost",
    DATABASE_PORT: Number(process.env.DATABASE_PORT || 3306),
    DATABASE_DIALECT: process.env.DATABASE_DIALECT || "mysql",

    // Token
    ACCESS_TOKEN_SECRET: process.env.ACCESS_TOKEN_SECRET,
    REFRESH_TOKEN_SECRET: process.env.REFRESH_TOKEN_SECRET,
    ACCESS_TOKEN_EXPIRES: process.env.ACCESS_TOKEN_EXPIRES || "15", // 15 minutes
    REFRESH_TOKEN_EXPIRES: process.env.REFRESH_TOKEN_EXPIRES || "30", // 30  Days
    SESSION_COOKIE_NAME: process.env.SESSION_COOKIE_NAME || "refreshToken",
}