const express = require('express');
require('./DB/conn');
const path = require("path");
const app = express();
const multer = require('multer');
const Blog = require('./DB/modalSchema');
const port = process.env.PORT || 5500;

//-------------view------------
app.set("view engine", "ejs"); 
const dynamic_path = path.join(__dirname,"./templates/views");
app.set("views", dynamic_path);
//-------------view------------

// -------------public file---------
app.use(express.static("public")); 

  
app.use(express.json()); 
app.use(express.urlencoded({extended:false}));


// --------------------------Pages--------------------

// Home Page
app.get("/", async(req,resp)=>{
    let search = "";
    if(req.query.searchblog){
        search = req.query.searchblog;
    }

    const allBlog = await Blog.find({
        $or:[
            {"name":{$regex:'.*'+search+'.*',$options:'i'}},
            {"title":{$regex:'.*'+search+'.*',$options:'i'}}
        ]
    });
    resp.render("home",{
        datas: allBlog
    });
});

// Add Read Blog page
app.get("/addblog",(req,resp)=>{
    resp.render("addBlog");
});

// Read Blog Page
app.get("/readblog/:id", async (req,resp)=>{
    const readBlog = await Blog.findById(req.params.id);
    resp.render("readBlog",{
        readBlog
    });
});

// --------------------End Pages-----------------------

// delete single blog
app.get('/delete/:id', async (req,resp)=>{
    const {id} = req.params;
    const deletecrud = await Blog.findByIdAndDelete({_id:id});
    resp.redirect("/");

})

//search
// app.get('/search', (req,resp)=>{
//     let info = req.query.searchblog;
//     if(info != " "){
//         console.log("info => " + info);
//     }else{
//         console.log("your info" + info)
//     }
//     resp.redirect("/");
// }); 

// --------------------multer ------------------------------------------ 
const storage =  multer.diskStorage({
    destination: function(req,file,cb){
        cb(null,path.resolve("./public/uploads/"));
    },
    filename:function(req,file,cb){
        const fileName = `${Date.now()}-${file.originalname}`;
        cb(null,fileName);
    }
});

const upload = multer({storage:storage});


// add data in database
app.post("/addblog", upload.single('image'), async (req,resp)=>{
    try {
        // console.log(req.body);
        // console.log(req.file);
            const userBlog = new Blog({
            name : req.body.name,
            title : req.body.title,
            body : req.body.body,
            image : `/uploads/${req.file.filename}`,
        });
        await userBlog.save();
        resp.redirect('/');
    } catch (error) {
        resp.send(error);
    }
})

app.listen(port, ()=>{
    console.log(`Server is running on ${port}`);
});