const http = require("http");
const path = require('path');
const routes = require('./routes');
const { GET, POST, PORT } = require('./constants');

const hostname = "0.0.0.0";

const server = http.createServer((req, res) => {
    const { url, method }  = req;
    
    if (method === GET) {
        if (url === '/') {
            return routes.index(req, res);
        }
        if (url === '/index.js') {
            return routes.indexJS(req, res);
        }
        if (url === '/index.css') {
            return routes.indexCSS(req, res);
        }
        if (url.indexOf('/api/tweets') === 0) {
            return routes.readTweets(req, res);
        }
        if (url.indexOf('/api/tweet') === 0) {
            return routes.readTweet(req, res);
        }
        if (url === 'api/users') {
            return routes.getUsers(req, res);
        }
        if (url.indexOf('/api/user') === 0) {
            return routes.getUser(req, res);
        }
    }
    
    if (method === POST) {
        if (url === '/') {
            return routes.postTweet(req, res);
        }
        if (url === '/api/like') {
            return routes.likeTweet(req, res);
        }
    }
    
    return routes.notFound(req, res);
});

server.listen(PORT, hostname, () => {
    console.log(`Server running on port ${PORT}!`);
});

