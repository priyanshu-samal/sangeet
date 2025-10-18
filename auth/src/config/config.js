import { config as dotenvConfig } from "dotenv";

dotenvConfig();




const _config={
MONGO_URI:process.env.MONGO_URI ,
JWT_SECRET:process.env.JWT_SECRET ,
CLIENT_ID:process.env.CLIENT_ID ,
CLIENT_SECRET:process.env.CLIENT_SECRET,
RABBITMQ_URI:process.env.RABBITMQ_URI ,
}

export default _config;



