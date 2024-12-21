const mongoose = require('mongoose');
const config = require('../config/index');

async function connect() {
    try{
        await mongoose.connect(config.db.uri, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('Connect MongoDB successfully!!!');    
    } catch (error){
        console.log("Connect failure!!!");
    }
}
module.exports = {connect};