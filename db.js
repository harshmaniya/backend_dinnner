const mongoose = require('mongoose');
// const app = require('../app');

const mongooseURL = process.env.DB_URL;

const connectToMongo = () => {
    mongoose.connect(mongooseURL,{
        // useNewUrlParser : true,
        // useCreateIndex: true,
        // useUnifiedTopology : true,
        // useFindAndModify: false
    }).then(()=>{
        console.log("Connected to Mongo!");
    }).catch((err)=> console.log(err))
}

module.exports = connectToMongo;