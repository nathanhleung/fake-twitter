const fs = require('fs');
const path = require('path');
const { CLIENT_ROOT } = require('./constants');
const db = require('./db');
const { Tweet, User } = db;

var self = {
    index: (req, res) => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "text/html");
        fs.readFile(path.join(CLIENT_ROOT, 'index.html'), (err, data) => {
            //self.readTweet(req, res);   
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
            
            console.log("Request Body: " + body);
            
            var bodyArray = body.split("&");

            var tweetText = bodyArray[1].split("=")[1].replace("+"," ");
            var rawUser = bodyArray[0].split("=")[1].replace("+"," ");
        
            /*
            res.write("<p>");
            res.write("You wrote:");
            res.write('"' + tweetText + '"');
            res.write("</p>");
            */
            
            var user = db.getUserByUsername(rawUser);

            if (user === undefined) {

                user = new User({name: "Shrey", username: rawUser});

            }

            var tweet = new Tweet({text: tweetText, authorId: user.id});
            
            db.insertUser(user);
            db.insertTweet(tweet, user);

            //self.index();
        });
        
    },
    readTweet: (req, res) => {
        
        console.log("Fetching tweets...");

        var tweets = db.getTweets();
        
        console.log(JSON.stringify(tweets));
        console.log(JSON.stringify(db.getUsers()));
        
        // replace with WebSocket or some form
        // of communication with frontend
        tweets.forEach(t => {

            var user = db.getUserById(t.authorId);
            
            res.write("<p>");
            res.write(user.username + ": ");
            res.write(t.text);
            res.write("</p>");
            
        });
        
    },
    likeTweet: (req, res) => {
        
    },
    replyTweet: (req, res) => {
        
    }
}

module.exports = self;