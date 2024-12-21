const config = {
    app: {
        port: process.env.PORT ,
    },
    db: {
        uri: process.env.MONGODB_URI 
    }
};
module.exports = config;