import dotenv from "dotenv";
import { AppError } from "../utils/appError";

dotenv.config();

function requireEnv(key: string): string {
    const value = process.env[key];
    if (!value) {
        throw new AppError(`missing enviroment variable 1, ${key}`, 500);

    }
    return value;
}

export const config = {
    //database
    database: {
        url: requireEnv("DATABASE_URL"),
    },
    //jWT
    jwt: {
        secret: requireEnv("JWT_SECRET"),
        expireIn: requireEnv("JWT_EXPIRES_IN"),
        refreshSecret: requireEnv("JWT_REFRESH_SECRET"),
        refreshExpiresIn: requireEnv("JWT_REFRESH_EXPIRES_IN"),

    },
    //server
    server: {
        port: requireEnv("PORT"),
        nodeEnv: requireEnv("NODE_ENV"),
    },

    //CORS
    cors: {
        origin: requireEnv("CORS_ORIGIN")
        .split(",")
        .map((S) => S.trim())
        .filter(Boolean) as unknown as string[],
    },

    //Rate Limiting
    rateLimit: {
        windowMs: parseInt(requireEnv("RATE_LIMIT_WINDOW_MS"), 10),
        maxRequests: parseInt(requireEnv("RATE_LIMIT_MAX_REQUESTS"), 10),
    },

    //Bcrypt
    bcrypt: {
        rounds: parseInt(requireEnv("BCRYPT_ROUNDS"), 10),
    },

    //Email/ smpt
    email: {
    enabled: requireEnv("EMAIL_ENABLED") === "true",
    host: requireEnv("SMTP_HOST"),
    port: parseInt(requireEnv("SMTP_PORT"), 10),
    secure: requireEnv("SMTP_SECURE") === "true",
    user: requireEnv("SMTP_USER"),
    pass: requireEnv("SMTP_PASS"),
    from: requireEnv("SMTP_FROM"),
    to: requireEnv("SMTP_TO")
    },
    //cloudinary
    cloudinary: {
    cloudName: requireEnv("CLOUDINARY_CLOUD_NAME"),
    apiKey: requireEnv("CLOUDINARY_API_KEY"),
    apiSecret: requireEnv("CLOUDINARY_API_SECRET"),
  },
    //twilio
      twilio: {
    accountSid: process.env.TWILIO_ACCOUNT_SID || "",
    authToken: process.env.TWILIO_AUTH_TOKEN || "",
    serviceSid: process.env.TWILIO_SERVICE_SID || "",
    senderName: process.env.TWILIO_SENDER_NAME || "CO-LAB",
  },
    
    //Google 0Auth
    // we dont use requireEnv here because we want to allow for empty values in case the user does not want to use Google OAuth
    google: {
    clientId: process.env.GOOGLE_CLIENT_ID || "",
    // For mobile apps, we use the web client ID
    webClientId: process.env.GOOGLE_WEB_CLIENT_ID || process.env.GOOGLE_CLIENT_ID || "",
  },

};