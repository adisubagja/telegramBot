const env = process.env;
const config = {
    db: {
        host : env.DB_HOST || 'localhost',
        db: { /* do not put password or any sensitive info here, done only for demo */
            host: env.DB_HOST || 'localhost',
            port: env.DB_PORT || '5432',
            user: env.DB_USER || 'postgres',
            password: env.DB_PASSWORD || 'root',
            database: env.DB_NAME || 'postgres',
          },
        
    }
   
}
module.exports = config;