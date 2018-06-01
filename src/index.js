const http = require("http");
const path = require('path');
const routes = require('./routes');
const { GET, POST, PORT } = require('./constants');

const hostname = "0.0.0.0";

const server = http.createServer((req, res) => {
    const { url, method }  = req;
    
    switch (url) {
        case '/': {
            if (method === GET) {
                routes.index(req, res);
                break;
            } else if (method === POST) {
                routes.postTweet(req, res);
                break;
            }
        }
        default: {
            res.statusCode = 404;
            return res.end();
        }
    }
});

server.listen(PORT, hostname, () => {
    
   console.log("Server running"); 
   
});

