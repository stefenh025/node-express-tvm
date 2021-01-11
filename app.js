const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const expressValidator = require('connect-flash');
const flash = require('connect-flash');
const session = require('express-session')

//Connect to database
mongoose.connect('mongodb://localhost/nodekb');
let db = mongoose.connection;

//Check connection
db.once('open', () =>{
  console.log('Connected to mongoDB');
});

//Check for db errors
db.on('error', (err)=>{
  console.log(err);
});

//Init app
const app = express();

//Bring in models
let Article = require('./models/article');

//Load View Engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
// Body Parser Middleware
app.use(bodyParser.urlencoded({ extended: false}));
//parse application/json
app.use(bodyParser.json());
//express-messages, express-session connect-flash express-validator middleware 
//Express Session middleware
app.use(session({
  secret: 'keyboard cat',
  resave: true,
  saveUninitialized: true,
}));
//Express-message middleware
app.use(require('connect-flash')());
app.use((req, res, next) => {
  res.locals.messages = require('express-messages')(req, res);
  next();
});
//Express-validator middleware?
const { body, validationResult } = require('express-validator');

//Set Public Folder
app.use(express.static(path.join(__dirname, 'public')));

//Home Route
app.get('/', (req,res)=>{
  Article.find({}, (err, articles)=>{
    if(err){
      console.log(err);
    } else {
    res.render('index', {
      title:'Articles',
      articles: articles
    });
  }
  });
});

//Route Files
let articles = require('./routes/articles');
app.use('/articles', articles);


//Start Server
app.listen(3000, () =>{
  console.log('Server started on port 3000');
})