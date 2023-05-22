const mongoose = require('mongoose');
// const app = require('../app');

const mongooseURL = `mongodb+srv://rms:maniya@cluster0.jill5yf.mongodb.net/rmsDB?retryWrites=true&w=majority`;

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