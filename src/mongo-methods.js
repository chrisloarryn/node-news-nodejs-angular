const axios = require('axios');
const newsUrl = 'https://hn.algolia.com/api/v1/search_by_date?query=nodejs';
const MongoClient = require('mongodb').MongoClient;
// const MongoUrl = 'mongodb://127.0.0.1:27017';
const MongoUrl = 'localhost:27017';
const MongoDb = 'hnDatabase';
const mongoose = require('mongoose');


// console.log(data);
// Once an hour, read from API-News-Endpoint and add new posts to Db
var scheduleJob = () => {

    cron = require('node-schedule');
    // '0 */1 * * *'
    cron.scheduleJob('0 */1 * * *', () => {
        console.log('News requested from Url')
        axios.get(newsUrl)
        console.log(newsUrl)
            .then(json => {
                // console.log('Hits loaded', json.data.hits.length);
                // return json.data.hits.map((hit) => {
                //     hit.title = hit.title ? hit.title : hit.story_title;
                //     //hit.author = hit.author.value;
                // });
                return json.data.hits;
            })
            .then(hits => {
                MongoClient.connect(`mongodb://${MongoUrl}`, (err, client) => {
                    if (err) return err;
                    db = client.db(MongoDb);
                    hits.forEach((newsItem) => {
                        db.collection('hnNews').update(newsItem, {
                            '$set': {
                                "deleted": false
                            }
                        }, {
                            upsert: true,
                            many: true
                        });
                    })
                });
            })
            .catch((error) => {
                if (error.response) {
                    // The request was made and the server responded with a status code
                    // that falls out of the range of 2xx
                    console.log(error.response.data);
                    console.log(error.response.status);
                    console.log(error.response.headers);
                } else if (error.request) {
                    // The request was made but no response was received
                    // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
                    // http.ClientRequest in node.js
                    console.log(error.request);
                } else {
                    // Something happened in setting up the request that triggered an Error
                    console.log('Error', error.message);
                }
                console.log(error.config);
            });
    })
};

var getAllNewsFromDb = (callback) => {
    MongoClient.connect(`mongodb://${MongoUrl}`, (err, client) => {
        db = client.db(MongoDb);
        db.collection('hnNews').find().toArray((err, items) => {
            if (!items) {
                console.log('no items');
                MongoClient.connect(`mongodb://${MongoUrl}`, (err, client) => {
                    axios.get(newsUrl)
                        .then(json => {
                            // console.log(json.data.hits)
                            return json.data.hits.map((hit) => {
                                // console.log(hit)
                                // hit._highlightResult.author = 'hit._highlightResult.author.value';
                                // hit._highlightResult.comment_text = hit._highlightResult.comment_text.value;
                                //     hit.title = hit.title ? hit.title : hit.story_title;
                                //     //hit.author = hit.author.value;
                            });
                            // return json.data.hits;
                        })
                        .then(hits => {
                            // console.log(hits)
                            MongoClient.connect(`mongodb://${MongoUrl}`, (err, client) => {
                                if (err) return err;
                                db = client.db(MongoDb);
                                hits.forEach((newsItem) => {
                                    db.collection('hnNews').update(newsItem, {
                                        '$set': {
                                            "deleted": false
                                        }
                                    }, {
                                        upsert: true,
                                        many: true
                                    });
                                })
                            });
                        })
                        .catch((error) => {
                            if (error.response) {
                                // The request was made and the server responded with a status code
                                // that falls out of the range of 2xx
                                console.log(error.response.data);
                                console.log(error.response.status);
                                console.log(error.response.headers);
                            } else if (error.request) {
                                // The request was made but no response was received
                                // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
                                // http.ClientRequest in node.js
                                console.log(error.request);
                            } else {
                                // Something happened in setting up the request that triggered an Error
                                console.log('Error', error.message);
                            }
                            console.log(error.config);
                        });
                    // callback(items)
                })
            }
            if (err) throw err;
            callback(items);

        });
    });
};

module.exports = {
    scheduleJob: scheduleJob,
    getAllNewsFromDb: getAllNewsFromDb
}