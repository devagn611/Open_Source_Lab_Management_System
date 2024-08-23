
const mongoose = require('mongoose')

mongoose.connect("mongodb+srv://devagnmaniya611:Devagn61123@cluster0.ir2l0r5.mongodb.net/?retryWrites=true&w=majority",);

const db = mongoose.connection;

db.on("error",console.error.bind(console ,'Error connecting to MOngoDB') );

db.once('open',()=>{
    console.log('connected to mongoDB');
})

module.exports = db;