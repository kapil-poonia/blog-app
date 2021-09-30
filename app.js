var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
// overriding put over post request 
// in update route
var methodOverride = require("method-override");


// APP config
mongoose.connect("mongodb://localhost/restful_blog_app");
app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.use(express.static('public'));
app.use(methodOverride("_method"));

// Mongoose/model config
var blogSchema = new mongoose.Schema({
    title: String,
    image: String,
    body: String,
    created: { type: Date, default: Date.now }
});
var Blog = mongoose.model("Blog", blogSchema);

// Blog.create({
//     title: "Test BLog",
//     image: "https://ychef.files.bbci.co.uk/live/624x351/p03gg1lc.jpg",
//     body: "First blog post"
// });

// Restful Routes
app.get("/", function(req, res) {
    res.redirect("/blogs");
});

app.get("/blogs", function(req, res) {
    Blog.find({}, function(err, blogs) {
        if (err)
            console.log("Error!");
        else
            res.render('index.ejs', { blogs: blogs });
    });
});

//new
images = [{ image: "https://ychef.files.bbci.co.uk/live/624x351/p03gg1lc.jpg" }];
app.get("/blogs/new", function(req, res) {
    res.render("new.ejs", { images: images });
});

// create
app.post("/blogs", function(req, res) {
    Blog.create(req.body.blog, function(err, newBlog) {
        if (err)
            res.render("new");
        else
        // redirect to index
            res.redirect("/blogs");
    });
});

// show
app.get("/blogs/:id", function(req, res) {
    Blog.findById(req.params.id, function(err, foundBlog) {
        if (err)
            res.redirect("/blogs");
        else
            res.render("show.ejs", { blog: foundBlog });
    });
});

// edit
app.get("/blogs/:id/edit", function(req, res) {
    Blog.findById(req.params.id, function(err, blogedit) {
        if (err)
            res.redirect("/blogs");
        else
            res.render("edit.ejs", { blog: blogedit });
    });
});

//update route
app.put("/blogs/:id", function(req, res) {
    Blog.findByIdAndUpdate(req.params.id, req.body.blog, function(err, updated) {
        if (err)
            res.redirect("/blogs");
        else
            res.redirect("/blogs/" + req.params.id);
    });
});

//delete
app.delete("/blogs/:id", function(req, res) {
    Blog.findByIdAndDelete(req.params.id, function(err) {
        if (err)
            res.redirect("/blogs");
        else
            res.redirect("/blogs");
    });
});

app.listen(3000, function() {
    console.log("Server Started !!");
});