import {config as dotenvConfig} from 'dotenv';

dotenvConfig();



const _config = {
  mongoURI: process.env.MONGO_URI,
  jwtSecret: process.env.JWT_SECRET,
  jwtExpiration: process.env.JWT_EXPIRATION,
  emailUser: process.env.EMAIL_USER,
  emailClientId: process.env.CLIENT_ID,
  emailClientSecret: process.env.CLIENT_SECRET,
  emailRefreshToken: process.env.REFRESH_TOKEN,
  rabbitMQURI: process.env.RABBITMQ_URI,
};

export default Object.freeze(_config);
