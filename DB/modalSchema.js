const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
        name:{
            type:String,
            require:true
        },
        title:{
            type:String,
            required:true
        },
        image:{
            type:String,
            required:true
        },
        body:{
            type:String,
            required:true,
        }
    },
    {timestamps: true}
);

const Blog = new mongoose.model('Cmtblog',blogSchema);
module.exports = Blog;

// collection name => blog