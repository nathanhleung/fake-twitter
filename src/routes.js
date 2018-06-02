const fs = require('fs');
const querystring = require('querystring');
const path = require('path');
const url = require('url');
const { CLIENT_ROOT } = require('./constants');
const db = require('./db');
const { Tweet, User, Like, Reply } = db;

function readBody(req, res) {
    return new Promise((resolve, reject) => {
        let rawBody = [];
        req.on('error', (err) => {
            return reject(err);
        }).on('data', (chunk) => {
            rawBody.push(chunk);
        }).on('end', () => {
            rawBody = Buffer.concat(rawBody).toString();
            const body = querystring.parse(rawBody);
            return resolve(body);
        });
    });
}

module.exports = {
    index: (req, res) => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "text/html");
        fs.readFile(path.join(CLIENT_ROOT, 'index.html'), (err, data) => {
            res.end(data);
        });
    },
    indexJS: (req, res) => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/javascript");
        fs.readFile(path.join(CLIENT_ROOT, 'index.js'), (err, data) => {
            res.end(data);
        });
    },
    indexCSS: (req, res) => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "text/css");
        fs.readFile(path.join(CLIENT_ROOT, 'index.css'), (err, data) => {
            res.end(data);
        });
    },
    postTweet: (req, res) => {
        readBody(req, res)
            .then(body => {
                let user = db.getUserByUsername(body.username);
                if (typeof user === 'undefined') {
                    user = new User({ name: body.name, username: body.username });
                    db.insertUser(user);
                }
                const tweet = new Tweet({text: body.text, authorId: user.id});
                db.insertTweet(tweet);
                res.setHeader('Content-Type', 'application/json');
                res.write(JSON.stringify(tweet));
                return res.end();
            });
    },
    readTweet: (req, res) => {
        const { query } = url.parse(req.url, true);
        if (typeof query.id === 'undefined') {
            res.statusCode = 404;
            res.write('Tweet not found');
            return res.end();
        }
        const tweet = db.getTweetById(query.id);
        if (typeof tweet === 'undefined') {
            res.statusCode = 404;
            res.write('Tweet not found');
            return res.end();
        }
        res.setHeader('Content-Type', 'application/json');
        res.write(JSON.stringify(tweet));
        return res.end();
    },
    readTweets: (req, res) => {
        res.setHeader('Content-Type', 'application/json');
        const tweets = db.getTweets();
        const { query } = url.parse(req.url, true);
        if (typeof query.after === 'undefined') {
            res.write(JSON.stringify(tweets));
            return res.end();
        }
        res.write(JSON.stringify(tweets.filter(t => t.created > query.after)));
        return res.end();
    },
    likeTweet: (req, res) => {
        readBody(req, res)
            .then((body) => {
                const { tweetId, likerId } = body;
                const like = new Like({ tweetId, likerId });
                db.likeTweet(like);
                res.end();
            });
    },
    replyTweet: (req, res) => {
        readBody(req, res)
            .then((body) => {
                const { text, name, username, repliedTweetId } = body;
                let user = db.getUserByUsername(body.username);
                if (typeof user === 'undefined') {
                    user = new User({ name: body.name, username: body.username });
                    db.insertUser(user);
                }
                const reply = new Reply({
                    text: body.text,
                    authorId: user.id,
                    repliedTweetId,
                });
                db.insertReply(reply);
                res.setHeader('Content-Type', 'application/json');
                res.write(JSON.stringify(reply));
                return res.end();
            })
    },
    getUser: (req, res) => {
        const { query } = url.parse(req.url, true);
        if (typeof query.id === 'undefined') {
            res.statusCode = 404;
            res.write('Tweet not found');
            return res.end();
        }
        const user = db.getUserById(query.id);
        if (typeof user === 'undefined') {
            res.statusCode = 404;
            res.write('User not found');
            return res.end();
        }
        res.setHeader('Content-Type', 'application/json');
        res.write(JSON.stringify(user));
        return res.end();
    },
    getUsers: (req, res) => {
        const users = db.getUsers();
        res.setHeader('Content-Type', 'application/json');
        res.write(JSON.stringify(users));
        res.end();
    },
    notFound: (req, res) => {
        res.statusCode = 404;
        res.write('Page not found.');
        return res.end();
    },
}