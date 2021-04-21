const dotenv = require('dotenv');
dotenv.config();

module.exports = {
    port: process.env.port,
    mongoPassword: process.env.MONGO_ATLAS_PW,
    jwtKey: process.env.JWT_KEY,
};