import { config } from 'dotenv';

// Loads .env file
config();

export const PORT = process.env.PORT || 5000;

export const YOUTUBE_API = process.env.YOUTUBE_API;
