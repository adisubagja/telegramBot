require('dotenv').config();
const env = process.env;
const config = {
        connectionString:env.DATABASE_URL ,
        ssl: process.env.DATABASE_URL ? true : false
}
module.exports = config;