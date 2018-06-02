const fs = require('fs');
const path = require('path');

const DATA_FILE = path.join(__dirname, 'data', 'data.json');

let db;
const rawDB = fs.readFileSync(DATA_FILE, 'utf8');
const initialDB = {
    users: [],
    tweets: [],
    likes: [],
    replies: [],
};
if (rawDB === '') {
    db = initialDB;
} else {
    db = JSON.parse(rawDB);
}

class User {
    constructor({ name, username }) {
        this.name = name;
        this.username = username;
        this.id = 'user' + (new Date()).getTime() + db.tweets.length;
        this.created = (new Date()).getTime();
    }
}

class Tweet {
    constructor({ text, authorId }) {
        this.text = text;
        this.authorId = authorId;
        this.id = 'tweet' + (new Date()).getTime() + db.tweets.length;
        this.created = (new Date()).getTime();
    }
}

class Like {
    constructor({ tweetId, likerId }) {
        this.tweetId = tweetId;
        this.likerId = likerId;
        this.created = (new Date()).getTime();
    }
}

class Reply extends Tweet {
    constructor({ text, authorId, repliedTweetId }) {
        super({ text, authorId });
        this.repliedTweetId = repliedTweetId;
    }
}

module.exports = {
    User,
    Tweet,
    Like,
    Reply,
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
    likeTweet(like) {
        if (!(like instanceof Like)) {
            throw new Error('Not a Like');
        }
        db.likes.push(like);
    },
    replyTweet(reply) {
        if (!(reply instanceof Reply)) {
            throw new Error('Not a Reply');
        }
        db.replies.push(reply);
        
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

// Save to data.json on Ctrl+C
process.on('SIGINT', () => {
    fs.writeFile(DATA_FILE, JSON.stringify(db), 'utf8', () => {
        process.exit();
    });
});