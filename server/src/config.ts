import { config } from 'dotenv';

// Loads .env file
config();

export const PORT = process.env.PORT || 5000;
