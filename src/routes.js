const fs = require('fs');
const path = require('path');
const { CLIENT_ROOT } = require('./constants');
const db = require('./db');
const { Tweet, User } = db;

module.exports = {
    index: (req, res) => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "text/html");
        fs.readFile(path.join(CLIENT_ROOT, 'index.html'), (err, data) => {
            res.end(data);
        });
    },
    postTweet: (req, res) => {
        let body = [];
        req.on('error', (err) => {
            console.error(err);
        }).on('data', (chunk) => {
            body.push(chunk);
        }).on('end', () => {
            body = Buffer.concat(body).toString();
            
            /// body will be defined here
            console.log("Request Body: " + body);
            
            var rawText = body.split("text=");
            var processedText = rawText[1];
        
            res.write("<p>");
            res.write("You wrote:");
            res.write('"' + processedText + '"');
            res.write("</p>");
            
            var user = new User({name: "Shrey", username: "@shrey150"});
            var tweet = new Tweet({text: user.name, authorId: user.id});
            
            db.insertTweet(tweet, user);
        });
        
    },
    readTweet: (req, res) => {
        
        var tweets = db.getTweets();
        
        JSON.stringify(tweets);

        /*        
        tweets.forEach(t => {
            
            console.log("Text: " + t.text);
            console.log("Author: " + t.authorId);
            console.log("ID: " + t.id);
            
        });
        */
        
    },
    likeTweet: (req, res) => {
        
    },
    replyTweet: (req, res) => {
        
    }
}