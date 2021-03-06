//We import the express framework, body-parser, mongoose and meme schema. 
// App is the express framework. Body-parser is used to automatically convert requested content from one form to another. 
// Mongoose is the library which is used to connect the backend server to the mongodb database and Meme is the schema
var app=require('express')(),
    subApp=require('express')(),
    bodyParser=require('body-parser'),
    mongoose = require('mongoose'),
    Meme=require('./models/meme.js'),
    cors = require('cors'),
    https=require('https'),
    http=require('http');

const fs = require('fs');

const swaggerUi = require('swagger-ui-express'),
    swaggerDocument = require('./swagger.json');

// The next two lined is used to convert the input request body we get in the request from one form to another. 
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
app.use(cors());


// Depending upon the NODE_ENV, we choose the URL to connect to. In case of Development environment, code gets connected to local database while in case of production, it gets connected to cloud database
var URL;
if(process.env.NODE_ENV=='development'){
    URL='mongodb://127.0.0.1:27017/Xmeme';
}else{
    URL= "mongodb+srv://admin:B0h3uTOkOZfBFn29@cluster0.o2tok.mongodb.net/sambhav-xmeme?retryWrites=true&w=majority";
}

// The next two lines are used to connect to the database. 
mongoose.connect(URL,{useNewUrlParser: true,  useUnifiedTopology: true, useCreateIndex: true});
const connection=mongoose.connection;

// // The function gets executed when the connection of the backend gets established to the database
connection. once('open',function(){
  console.log("Mongoose database connected for Xmeme at "+URL);
});

//function to check if we have a valid URL or not
function validURL(str) {
    var pattern = new RegExp('^(https?:\\/\\/)?'+ // protocol
      '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ // domain name
      '((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
      '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
      '(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
      '(\\#[-a-z\\d_]*)?$','i'); // fragment locator
    return !!pattern.test(str);
  }

// This is the function handling the Get request. The function handled the get request to the url /memes. 
// The function returns the list of all the memes available in the database where each meme contains the details like id, name, url and caption. 
app.get('/memes',function(req,res){
    Meme.find().sort({ _id: -1 }).limit(100).exec(function(err,allMemes){
        if(err){
            res.status(500).send('Error fetching memes from the database');
        }else{
            allMemes=allMemes.map(meme=>{
                return {
                    "id":meme._id,
                    "name":meme.name,
                    "url":meme.url,
                    "caption":meme.caption,
                }
            })
            res.status(200).json(allMemes);
        }
    })
})

// This is the function handling the Get request. The function handled the get request to the url /memes/<id>. 
// The function returns the meme details assigned to the input id with the details like id, name, url and caption. 
app.get('/memes/:id',function(req,res){
    Meme.findById(req.params.id,function(err,meme){
        if(err){
            res.status(404).send('No such meme exists in the database');
        }else{
            res.status(200).json({
                "id":meme._id,
                "name":meme.name,
                "url":meme.url,
                "caption":meme.caption,
            });
        }
    })
})


// The function handles the POST request to /memes. The details required to save the meme are author name, image url and the caption for the meme. 
// The function can be used to add a new meme to the database. 
app.post('/memes',function(req,res){
    var {name,url,caption}=req.body;
    Meme.findOne({name, url, caption },function(err1,res1){
        if(err1){
            res.status(500).send('Error saving meme to the database');
        }else{
            if(res1){
                res.status(409).send('The meme already exists');
            }else{
                var meme=new Meme({name, url, caption});
                meme.save(function(err,temp){
                    if(err){
                        res.status(500).send('Error saving meme to the database');
                    }else{
                        res.status(200).json({id:temp._id});
                    }
                })
            }
        }
    })
})

// The function handles the Patch request to /memes/<id>. The details required to edit the meme are image url or the caption for the meme. 
// The function can be used to edit an existing meme to the database. 
app.patch('/memes/:id',function(req,res){

    Meme.findById(req.params.id,function(err,meme){
        if(err){
            res.status(404).send('No such meme exists in the database');
        }else{
            if(req.body.name&&(req.body.name!=meme.name)){
                return res.status(406).send("Name cannot be edited");
            }
            if(req.body.caption){
                meme.caption=req.body.caption;
            }
            if(req.body.url){
                meme.url=req.body.url;
            }
            meme.save(function(err2,savedMeme){
                if(err2){
                    res.status(404).send('Error saving the meme to the database');
                }else{
                    res.status(200).send();
                }
            })
        }
    })
})

subApp.use('/swagger-ui', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// The route is used to handle any request to the address of the server which has not been handled by any of the above routing functions. 
// It return a test stating that the page is not found.
app.get('*',(req,res)=>{
    res.send("Page not found");
})

// The function handles the port for swagger-ui.
subApp.listen(8080,function(){
    console.log("server for swagger UI active at 8080");
})

// The two function calls below are responsible for handling HTTPS and HTTP request respectively
const httpsServer = https.createServer({
    key: fs.readFileSync('key.pem'),
    cert: fs.readFileSync('cert.pem'),
  }, app);

const httpServer = http.createServer(app);

// The functions gets executed to establish the connection with port no 8081 and 8083 respectively to handle HTTP and HTTPs requests.
httpServer.listen(process.env.PORT||8081,function(){
    console.log("HTTP server started with environment type "+process.env.NODE_ENV+" at port no "+(process.env.PORT||8081));
})

httpsServer.listen(8083,function(){
    console.log("HTTPS server started with environment type "+process.env.NODE_ENV+" at port no "+(8083));
})