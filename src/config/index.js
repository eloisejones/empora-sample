import dotenv from 'dotenv';

dotenv.config();

const environment = {
  addressValidator: {
    realApiEnabled: process.env.ADDRESS_VALIDATOR_REAL_API_ENABLED === "true",
    endpoint: process.env.ADDRESS_VALIDATOR_REAL_API_ENDPOINT,
    apiKey: process.env.ADDRESS_VALIDATOR_API_KEY,
  },
};

export default environment;