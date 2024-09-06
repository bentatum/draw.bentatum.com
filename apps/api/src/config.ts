import dotenv from 'dotenv';

dotenv.config();

export const PORT = process.env.PORT || 3001;
export const SOCKET_IO_ORIGIN = process.env.SOCKET_IO_ORIGIN || 'http://localhost:3000';