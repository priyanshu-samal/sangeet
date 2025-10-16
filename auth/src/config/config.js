import { config as dotenvConfig } from "dotenv";

dotenvConfig();




const _config={
MONGO_URI:process.env.MONGO_URI ,
}

export default _config;


