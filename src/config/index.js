import dotenv from 'dotenv';

dotenv.config();

export default {
  addressValidator: {
    realApiEnabled: process.env.ADDRESS_VALIDATOR_REAL_API_ENABLED === "true",
    apiKey: process.env.ADDRESS_VALIDATOR_API_KEY,
  },
}