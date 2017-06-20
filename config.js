export const PORT = process.env.PORT || 3000;
export const HOSTNAME = process.env.HOSTNAME || 'localhost';
export const PROTOCOL = process.env.PROTOCOL || 'http';
export const DB_URL = process.env.DB_URL || 'mongodb://localhost/node-image-processing-api';
export const SECRET_KEY = process.env.SECRET_KEY || 'SecretKey';
export const API_VERSION = 'v1';
export const BASE_URL = `${PROTOCOL}://${HOSTNAME}:${PORT}`;
