import dotenv from 'dotenv';

if (!process.env.DOTENV_LOADED) {
  dotenv.config();
}

const environment = {
  addressValidator: {
    realApiEnabled: process.env.ADDRESS_VALIDATOR_REAL_API_ENABLED === 'true',
    endpoint: process.env.ADDRESS_VALIDATOR_REAL_API_ENDPOINT,
    apiKey: process.env.ADDRESS_VALIDATOR_API_KEY,
  },
  isDotEnvLoaded: process.env.DOTENV_LOADED,
};

export default environment;