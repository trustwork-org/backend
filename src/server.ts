import 'dotenv/config';
import app from './app';
import { connectDB } from './config/db';
import { env } from './config/env';
import { blockchainListener } from './services/blockchainListener';

const start = async () => {
  await connectDB();
  
  // Start the blockchain event listener
  blockchainListener.start();

  app.listen(env.PORT, () => {
    console.log(`Server running on port ${env.PORT}`);
  });
};

start();
