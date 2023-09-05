const mongoose = require('mongoose');

mongoose.connect('mongodb://127.0.0.1:27017/crud',{
    useNewUrlParser:true,
    useUnifiedTopology:true
}).then(()=>{
    console.log("successfully connection");
}).catch((error)=>{
    console.log(error);
});
//crud -> database name