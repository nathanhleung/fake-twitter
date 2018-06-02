// Rudimentary db schema
const db = {
    users: [],
    tweets: [],
};

class User {
    constructor({ name, username }) {
        this.name = name;
        this.username = username;
        this.id = 'user' + (new Date()).getTime() + db.tweets.length;
    }
}

class Tweet {
    constructor({ text, authorId }) {
        this.text = text;
        this.authorId = authorId;
        this.id = 'tweet' + (new Date()).getTime() + db.tweets.length;
    }
}

module.exports = {
    User,
    Tweet,
    getUserById(id) {
        return db.users.find(u => u.id === id);
    },
    getUserByUsername(username) {
        return db.users.find(u => u.username === username);
    },
    getTweetById(id) {
        return db.tweets.find(t => t.id === id);
    },
    insertTweet(tweet) {
        if (!(tweet instanceof Tweet)) {
            throw new Error('Not a Tweet');
        }
        db.tweets.push(tweet);
    },
    insertUser(user) {
        if (!(user instanceof User)) {
            throw new Error("Not a User");
        }

        db.users.push(user);
    },
    getTweets() {
        return db.tweets;
    },
    getUsers() {
        return db.users;
    }
};