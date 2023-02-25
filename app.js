const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");

const app = express();

app.set("view engine", 'ejs');

app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static('public'));


mongoose.set("strictQuery", false);

// mongoose.connect("mongodb://127.0.0.1:27017/?directConnection=true&serverSelectionTimeoutMS=2000&appName=mongosh+1.7.1/wikiDB",)

mongoose.connect("mongodb://127.0.0.1:27017/appDB", {
    useNewUrlParser: true,
    useUnifiedTopology: true
});


const articleSchema = {
    title: String,
    content: String,
}

const Article = mongoose.model('Article', articleSchema);


// //////////////////////// request targeting all articles /////////////////
app.route("/articles")
    .get(function (req, res) {
        Article.find(function (err, foundArticles) {
            if (!err) {
                res.send(foundArticles);
            } else {
                res.send(err)
            }
        });
    })


    .post(function(req, res) {

        const newArticle = new Article({
            title: req.body.title,
            content: req.body.content,
        })

        newArticle.save(function(err){
            if (!err){
                res.send("successfully added a new article")
            } else {
                res.send(err)
            }
        });
        
    })


    .delete(function(req, res){
        Article.deleteMany(function(err){
            if (!err){
                res.send("sucessfully deleted all articles")
            } else {
                res.send(err)
            }
        });
    });



// /////////////////////////////////// request targeting specific article /////////////


app.route("/articles/:articleTitle")
    .get(function(req, res){
        Article.findOne({title: req.params.articleTitle}, function(err, foundArticle){
            if (foundArticle) {
                res.send(foundArticle)
            } else {
                res.send("no articles found with that title")
            }
        })
    })

    .put(function(req, res){
        Article.updateOne(
            {title: req.params.articleTitle},
            { $set: { title:  req.body.title, content: req.body.content } },
            {overwrite: true},
            function(err) {
                if (!err){
                    res.send("succesfully updated article")
                }
            }
        );
    })

   .patch(function(req, res){
        Article.updateOne(
            {title: req.params.articleTitle},
            
            { $set: req.body },
            {overwrite: true},
            function(err) {
                if (!err){
                    res.send("succesfully updated article")
                }
            }
        );
   })

   .delete(function(req, res){
        Article.deleteOne(
            {title: req.params.articleTitle},
            function(err){
                if (!err){
                    res.send("succefully deleted the article")
                }
            }
            
        )
   });


app.listen(3000, function () {
    console.log("server started at port 3000");
})
