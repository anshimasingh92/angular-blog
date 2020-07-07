
var express = require('express'),
    app = express(),
    mongodb = require('mongodb').MongoClient,
    cors = require('cors'),
    ObjectId = require('mongodb').ObjectID,
    bodyParser = require('body-parser');
    jwt = require('jsonwebtoken');

var db = '';
const mongo_conn = 'mongodb://localhost/';

app.use(cors({
    origin: 'http://localhost:4200'
}));

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


// app.post('/login', function(req, res){
//     //  console.log(req);
//     db.collection('users').find({"username":req.body.username}).toArray(function(err,docs){
//           if(docs.length < 1){
//               db.collection('users').insertOne(req.body, function(err){
//                   if(!err){
//                       console.log("registered!");
//                       res.send({
//                           success:true
//                       });
//                   }else{
//                       console.log("registration error "+err);
//                   }
//               });
//           }else{
//               res.send({
//                   success:false
//               });
//           }
//       });

//   });


mongodb.connect(mongo_conn, function (err, client) {
    if (!err) {
        console.log('Connection established');
        app.listen(3000, function () {

            console.log('Server running @ localhost:3000');
        });
        db = client.db('mydb');
    }
    else {
        console.log(err);
    }
});

app.post('/authenticate', function (req, res) {
    var token = jwt.sign({ 'uname': req.body.username }, 'secret-key-1111', {
        expiresIn: '1h'
    });
    console.log(req.body);
    db.collection('users').find({username:req.body.username,password:req.body.password}).toArray(function (err, docs) {
        if (docs.length == 1) {
            res.send({
                isLoggedIn: true,
                token: token
            });
        }
        else {
            res.send({
                isLoggedIn: false
            });
        }
    });

});

app.post('/register', function (req, res) {
    console.log(req.body);
    db.collection('users').find({ "email": req.body.email }).toArray(function (err, docs) {
        if (docs.length < 1) {
            db.collection('users').insertOne(req.body, function (err) {
                if (!err) {
                    console.log("registered!");
                    res.send({
                        success: true
                    });
                } else {
                    console.log("registration error " + err);
                }
            });
        } else {
            res.send({
                success: false
            });
        }
    });

});


app.use(function (req, res, next) {
    var token = req.body.authtoken || req.query.authtoken || req.headers['authtoken'];
    if(token){
    jwt.verify(token, 'secret-key-1111', function (err, decoded) {
        if(!err){
            console.log(decoded);
            req.decoded = decoded;
            next();
        }else{
            res.send({
                success:false,
                err:'Invalid Credentials'
            });
        }
    })
}
else{
    res.send({
        success:false,
        err:'Invalid Credentials'
    });
}
});



app.post('/create', function(req,res){
    req.body.username=(req.decoded.uname);
    req.body.likes = [];
    req.body.comments = [];
    db.collection('posts').insert(req.body, function(err){
        if(!err){
            res.send({
                success:true
            });
        }else{
            res.send({
                success:false,
                err:'Oops...something went wrong!!! Please try again!'
            });
        }
    });
});

app.get('/getpost',function(req,res){
    db.collection('posts').find({_id: new ObjectId(req.query.id)}).toArray(function(err,docs){
        if(!err){
            res.send({
                success:true,
                docs:docs
            });
        }else{
            res.send({
                success: false,
                err: 'Oops...something went wrong!!! Please try again!'
            });
        }
    });
})


app.get('/getposts', function(req,res){
    db.collection('posts').find().toArray(function(err,docs){
        if(!err){
            for(i=0;i<docs.length;i++){
                var likes = docs[i].likes;
                var like = false;
               for(x in likes){
                   if(likes[x] == req.decoded.uname){
                    like = true;
                   }
               }
               docs[i].like = like;
            }
            res.send({
                success:true,
                docs: docs
            });
        }else{
            res.send({
                success:false,
                err:'Oops...something went wrong!!! Please try again!'
            });
        }
        
    });
});

app.get('/getcomments', function (req, res) {
    db.collection('comments').find({ postid: req.query.postid }).toArray(function (err, docs) {
        if (!err) {
            for (i = 0; i < docs.length; i++) {
                docs[i].isUser = false;
                if(docs[i].username==req.decoded.uname){
                    docs[i].isUser = true;
                }
            }
            res.send({
                success: true,
                docs: docs
            });
        } else {
            res.send({
                success: false,
                err: 'Oops...something went wrong!!! Please try again!'
            });
        }
    });
});

app.post('/deletepost', function(req,res){
    console.log(req.body.id);
    db.collection("posts").deleteOne({_id: new ObjectId(req.body.id)}, function(err) {
        if(!err){
            console.log("deleted post!");
            res.send({
                success:true
            });
        }else{
            res.send({
                success:false,
                err:'Oops...something went wrong!!! Please try again!'
            });
        }
    });
});

app.post('/addlike', function(req,res){
    db.collection("posts").update({_id: new ObjectId(req.body.id)},{$push: {likes : req.decoded.uname}}, function(err) {
        if(!err){
           // console.log("liked!");
            res.send({
                success:true
            });
        }else{
            success:false,
            res.send({
                success:false,
                err:'Oops...something went wrong!!! Please try again!'
            });
        }
    });
});



app.post('/addcomment', function(req,res){
    req.body.comment.uname=(req.decoded.uname);
    req.body.comment._id = new ObjectId();
    
    db.collection("posts").update({_id: new ObjectId(req.body.id)},{$push: {comments : req.body.comment}},  function(err) {
        if(!err){
            console.log("comment added!");
            res.send({
                success:true
            });
        }else{
            success:false,
            res.send({
                success:false,
                err:'Oops...something went wrong!!! Please try again!'
            });
        }
    });
});

app.post('/editpost',function(req,res){
    db.collection('posts').update({_id: new ObjectId(req.body._id)},{$set:{title:req.body.title,description:req.body.description}},function(err,docs){
        if(!err){
            res.send({
                success:true,
                docs:docs
            });
        }else{
            res.send({
                success: false,
                err: 'Oops...something went wrong!!! Please try again!'
            });
        }
    });
})




