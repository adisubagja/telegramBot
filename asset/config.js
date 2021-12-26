const env = process.env;
const config = {
    db: {
        host : env.DB_HOST || 'ec2-34-193-235-32.compute-1.amazonaws.com',
        db: { /* do not put password or any sensitive info here, done only for demo */
            host: env.DB_HOST || 'ec2-34-193-235-32.compute-1.amazonaws.com',
            port: env.DB_PORT || '5432',
            username: env.DB_USER || 'telgrongtspbpp',
            password: env.DB_PASSWORD || '8125d5d4c2a23dde311fc634a7b0767df39762640a2d732549f5fd57f45a1d7f',
            database: env.DB_NAME || 'de0req4j9idcm5',
          },
        
    }
   
}
module.exports = config;