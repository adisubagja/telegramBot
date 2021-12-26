const env = process.env;
const config = {
        connectionString:env.DATABASE_URL ,
        ssl: {    /* <----- Add SSL option */
          rejectUnauthorized: false,
        }, 
}
module.exports = config;