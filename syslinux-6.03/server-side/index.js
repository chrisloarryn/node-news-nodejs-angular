"use strict";

// Import express
let express = require('express');
// Import Body parser
let bodyParser = require('body-parser');
// Import Mongoose
let mongoose = require('mongoose');
// Initialise the app
let app = express();
// Import Request
let Request = require('request');

// Configure bodyparser to handle post requests
app.use(bodyParser.urlencoded({
     extended: true
}));

app.use(bodyParser.json());

// Connect to Mongoose and set connection variable
mongoose.connect('mongodb://localhost/server', {
     useNewUrlParser: true,
     useUnifiedTopology: true
});
var db = mongoose.connection;

// Added check for DB connection
if (!db)
     console.log("Error connecting db")
else
     console.log("Db connected successfully")

// Setup server port
var port = process.env.PORT || 8080;

// Launch app to listen to specified port
app.listen(port, function () {
     console.log("Running Server +on port " + port);
});

// Creating News Schema
var Schema = mongoose.Schema
var newsSchema = new Schema({
     title: String,
     author: String,
     date: Date,
     story: String
}, {
     collection: 'news'
})

var News = mongoose.model('news', newsSchema);

// Get data from HN
let data = null;
let apiData = null;
Request.get("https://hn.algolia.com/api/v1/search_by_date?query=nodejs", (error, response, body) => {
     if (error) {
          return console.dir(error);
     } else {
          data = JSON.parse(body);

          db.collection('news').deleteMany({});
          var newData = null;
          for (var i in data.hits) {
               var title = null;
               if (data.hits[i].title == null) {
                    title = data.hits[i].story_title;
               } else {
                    title = data.hits[i].title;
               }
               newData = new News({
                    title: title,
                    author: data.hits[i].author,
                    date: data.hits[i].created_at,
                    story: data.hits[i].comment_text
               });
               db.collection('news').insertOne(newData);
          }


          News.find({}, function (err, docs) {
               apiData = docs;
          });
     }


});

// Use CORS FROM with Express
app.use((req, res, next) => {
     res.header("Access-Control-Allow-Origin", "*");
     res.header("'Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE'");
     res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
     next();
});


// Send data for default URL
app.get('/api/getAllNews', async (req, res) => await res.status(200).send(apiData));

app.get('/api/delete/:_idNew', async (req, res) => {
     return await model.newsSchema.deleteMany({
          where: {
               _idNew: req.params._idNew
          }
     }).then((newDeleted) => {
          console.log('hola', newDeleted);
     })
     /* if (!newDeleted) {
           return res.status(400).json({
                ok: false,
                err: {
                     message: 'new does not exist'
                }
           })
     }
     */

     // logService.createLog(req, res, {
     //      performer_id: 666,
     //      action: 'USER-HARD-DELETED',
     //      receiver: userId
     // })

     //      res.json({
     //           ok: true,
     //           message: 'newStory delete successfully',
     //           user: userId
     //      })
     // }).catch((err) => {
     //      return res.status(400).json({
     //           ok: false,
     //           message: `problems with newStory hard delete`,
     //           err
     //      })
     // })
     //console.log(req.params);
     // here I got the basic structure to an api.




     // response = {
     //      status: 'ok',
     //      code: 200,
     //      message: 'Deleted.'
     // };
     // res.send(response);

});

app.use((req, res, next) => {
     const response = {
          error: true,
          codigo: 404,
          mensaje: 'URL no encontrada/URL not found'
     };
     res.status(404).send(response);
});


//app.delete('/usuario', function (req, res) {
// if (usuario.nombre === '' || usuario.apellido === '') {
//      respuesta = {
//           error: true,
//           codigo: 501,
//           mensaje: 'El usuario no ha sido creado'
//      };
// } else {
//      respuesta = {
//           error: false,
//           codigo: 200,
//           mensaje: 'Usuario eliminado'
//      };
//      usuario = {
//           nombre: '',
//           apellido: ''
//      };
// }
// res.send(respuesta);
// });
