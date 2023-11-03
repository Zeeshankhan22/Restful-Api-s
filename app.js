const express    = require('express')
const bodyParser = require('body-parser')
const mongoose   = require('mongoose')

const app=express()
app.use(express.static("data"))
app.use(bodyParser.urlencoded({extended:true}))
app.set("view engine", "ejs")


mongoose.connect('mongodb://127.0.0.1:27017/wikidb')
const wikischema=mongoose.Schema({
    title:String,
    Content:String
})
const Article=mongoose.model('Article',wikischema)


//Main Route 
app.route('/')
.get((req,res)=>{
    Article.find()
    .then((data)=>res.render("home",{wikidata:data}))
    .catch((err)=>console.log(err))
})

.post((req,res)=>{
console.log(req.body.formTitle)
console.log(req.body.formContent)

const newarticle = new Article({
  title: req.body.formTitle,
  Content: req.body.formContent
})
newarticle.save()

res.redirect('/')
})

.delete((req,res)=>{
    Article.deleteMany()
    .then(()=>console.log('Successfully Deleted All Articles'))
    .catch((err)=>console.log(err))
})



//Specific articles Routes
app.route('/article/:articleTitle')

.get((req,res)=>{
    Article.find({title:req.params.articleTitle})
    .then((data)=>{
        if(data)res.send(data)
        else res.send("This TItle Related Article Not Avalible")
    })
    .catch((err)=>console.log(err))
})


.put((req,res)=>{                                                                                                           //For Both Title & COntent Update
    Article.findOneAndUpdate({title:req.params.articleTitle},{title:req.body.formTitle,Content:req.body.formContent},{overwrite:true})
    .then(()=>res.send('Successfully Updated'))
    .catch((err)=>console.log(err))
})


.patch((req,res)=>{                                                                                                        //For Just One Update Title OR COntent
    Article.findOneAndUpdate({title:req.params.articleTitle},{$set:{Content:req.body.formContent}})                                       //req.body for Just ChangeOne 'Any'
    .then(()=>res.send('Successfully Updated'))
    .catch((err)=>console.log(err))

})


.delete((req,res)=>{
    Article.deleteOne({ title: req.params.articleTitle })                                  //Delete Any Article By Put Specific Name on Postman  Like localhost:3000/article/neymar
      .then(() => res.send("Successfully Deleted"))
      .catch((err) => console.log(err))
})






//Listen ROute
app.listen(3000,()=>console.log("Server Run on 3000 Port"))


