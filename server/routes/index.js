let express = require('express');
let router = express.Router();
let mongoMethods = require('../src/mongo-methods');
let bodyParser = require('body-parser');

/* GET news from DataBase */
router.get('/api', (req, res, next) => {
  mongoMethods.getAllNewsFromDb((result) => {
    console.log('getAllNewsFromDb OK !!!');
    res.status(200).send({
      status: 200,
      res: true,
      title: 'HN News',
      subtitle: 'We <3 hacker news!',
      feed: result
    })
    // res.render('index', {
    //   title: 'HN News',
    //   subtitle: 'We <3 hacker news!',
    //   feed: result
    // });
  })
});

/* GET news from DataBase as JSON DATA */
router.get('/api/dataonly', (req, res, next) => {
  mongoMethods.getAllNewsFromDb((result) => {
    res.send(result);
  })
});

module.exports = router;