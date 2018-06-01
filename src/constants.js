const path = require('path');

module.exports = {
    GET: 'GET',
    POST: 'POST',
    CLIENT_ROOT: path.join(__dirname, 'client'),
    PORT: process.env.PORT || 3000,
}