require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const https= require("https");
const mongoose=require("mongoose");
////const encrypt=require("mongoose-encryption");
////const md5=require("md5");
const bcrypt=require("bcrypt");
const saltRounds=10;

const app = express();

////console.log(process.env.API_KEY);

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

//setting up mongo Server
mongoose.connect("mongodb://localhost:27017/userDB",{useNewUrlParser: true, useUnifiedTopology: true});

//creating db schema
const userSchema=new mongoose.Schema({
  email:String,
  password:String
});

//Encryption
//// userSchema.plugin(encrypt,{secret: process.env.SECRET ,encryptedFields:["password"]});

//Database Model
const User=new mongoose.model("User",userSchema);

//Sending get requests.............................................................................................................................
app.get("/",function(req,res) {
  res.render("home");
});

app.get("/login",function(req,res) {
  res.render("login");
});

app.get("/register",function(req,res) {
  res.render("register");
});


//.........................................................................................................................
app.post("/register",function(req,res){

  bcrypt.hash(req.body.password,saltRounds,function(err,hash){
    const newUser= new User({
      email:req.body.username,
      //password:md5(req.body.password)
      password:hash
    });
    newUser.save(function(err){
      if(err){
        console.log(err);
      }
      else{
        res.render("secrets");
      }
     });
  });


});

//hashing.........................................................................................................
// app.post("/login",function(req,res){
//   const username=req.body.username;
//   const password=md5(req.body.password);
//
//   User.findOne({email: username},function(err,foundUser){
//     if(err){
//       console.log(err);
//     }
//     else{
//       if(foundUser)
//       {
//         if(foundUser.password= password){
//            res.render("secrets");
//         }
//       }
//     }
//   });
// });

//Salting and hashing.................................................................................................................
app.post("/login",function(req,res){
  const username=req.body.username;
  const password=req.body.password;

  User.findOne({email: username},function(err,foundUser){
    if(err){
      console.log(err);
    }
    else{
      if(foundUser)
      {
        bcrypt.compare(password,foundUser.password,function(err,result){
          if(result===true){
            res.render("secrets");
          }
        });


      }
    }
  });
});
//........................................................................................................................




//Local  host to run app locally...........................................................................................
app.listen(process.env.PORT || 3000, function() {
  console.log("Server started on port 3000");
});
