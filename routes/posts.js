var express = require("express");
var router = express.Router();
var Post = require("../models/Post");
var User = require("../models/User");
var util = require("../config/util");

// index
router.get("/", function(req,res){
  Post.find({}).sort("-createdAt").exec(function (err,posts) {
    if(err) return res.json({success:false, message:err});
    res.render("posts/list", {data:posts});
  });
});

// new
router.get("/new", function(req,res){
  var post = req.flash("post")[0] || {};
  var errors = req.flash("errors")[0] || {};
  res.render("posts/new", { post:post, errors:errors});
});

// create
router.post("/", function(req,res){
  Post.create(req.body, function (err,post){
    if(err){
      req.flash("post", req.body);
      req.flash("errors", util.parseError(err));
      return res.redirect("/posts/new");
    }
    res.redirect("/posts?page=1");
  });
});

// show
router.get("/:id", function(req,res){
  Post.findById(req.params.id, function (err,post){
    if(err) return res.json({success:false, message:err});
    res.render("posts/show", { post:post, user:req.user });
  });
});

// edit
router.get("/:id/edit", function(req,res){
  var post = req.flash("post")[0];
  var errors = req.flash("errors")[0] || {};
  if(!post){
    Post.findOne({_id:req.params.id}, function(err, post){
      if(err) return res.json(err);
      res.render("posts/edit", { post:post, errors:errors });
    });
  } else {
    post._id = req.params.id;
    res.render("posts/edit", { post:post, errors:errors });
  }
});

// update
router.put("/:id", function(req,res){
  req.body.updatedAt=Date.now();
  Post.findOneAndUpdate({_id:req.params.id}, req.body, {runValidators:true}, function(err, post){
    if(err){
      req.flash("post", req.body);
      req.flahs("errors", util.parseError(err));
      return res.redirect("/posts/"+req.params.id+"/edit");
    }
    res.redirect("/posts/"+req.params.id);
  });
});

// destroy
router.delete("/:id", function(req,res){
  Post.findByIdAndRemove(req.params.id, function (err,post) {
    if(err) return res.json({success:false, message:err});
    res.redirect('/posts?page=1');
  });
});


module.exports = router;
