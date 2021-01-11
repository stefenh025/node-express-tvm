const express = require('express');
const router = express.Router();

const { body, validationResult } = require('express-validator');

//Bring in models
let Article = require('../models/article');

//Add Route
router.get('/add', (req, res) =>{
  res.render('add_article', {
    title:'Add Article'
  });
});

//Individual article page route
router.get('/:id', (req,res)=>{
  Article.findById(req.params.id, (err, article)=>{
    res.render('article', {
      article:article
    });
  });
})

router.get('/edit/:id', (req,res)=>{
  Article.findById(req.params.id, (err, article)=>{
    res.render('edit_article', {
      title: 'Edit Article',
      article:article
    });
  });
})

//Add submit POST route
router.post('/add',
 body('title').notEmpty(),
 body('author').notEmpty(),
 body('body').notEmpty(), (req, res) =>{
  //Title field can't be empty validation line
  // req.checkBody('title', 'Title is required').notEmpty;
  // req.checkBody('author', 'Author is required').notEmpty;
  // req.checkBody('body', 'Body is required').notEmpty;
  const errors = validationResult(req);
  //Get errors
  if(!errors.isEmpty()){
     res.render('add_article', {
       title: 'Add Article',
       errors:errors.array(),
     });
   } else{
    let article = new Article();
    article.title = req.body.title;
    article.author = req.body.author;
    article.body = req.body.body;

    article.save((err)=>{
      if(err){
        console.log(err);
        return;
      } else{
        req.flash('success', 'Article Added');
        res.redirect('/');
      }
    });
  };
});

//Add edit POST route
router.post('/edit/:id', (req, res) =>{
  let article = {};
  article.title = req.body.title;
  article.author = req.body.author;
  article.body = req.body.body;

  let query = {_id:req.params.id};
  
  Article.updateOne(query, article, (err)=>{
    if(err){
      console.log(err);
      return;
    } else{
      req.flash('success', 'Article Updated');
      res.redirect('/');
    }
  });
  return;
});

//Delete route
router.delete('/:id', (req, res)=>{
  //req.paras comes from the url
  let query = {_id: req.params.id};

  Article.deleteOne(query, (err)=>{
    if(err){
      console.log(err);
    }
    req.flash('success', 'Article deleted');
    res.send('Success');
  });
});

module.exports = router;