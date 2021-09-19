
# Old Twitter Clone

Clone of Twitter from 2007-2008.


## Tech

**Client:** HTML, CSS, Javascript, EJS, Bootstrap, jQuery

**Server:** Node, Express, Mongoose, Bodyparser


## Run Locally

Clone the project

```bash
  git clone https://github.com/Coskntkk/old-twitter-clone.git
```

Go to the project directory

```bash
  cd old-twitter-clone
```

Install dependencies

```bash
  npm install
```

Start the server

```bash
  node server.js
```


## Database Structure

- For users:
```js
var userSchema = {
  user: {
    type: String,
    required: true,
    unique: true
  }, // Unique name of account
  email: {
    type: String,
    required: true,
    match: /.+\@.+\..+/,
    unique: true
  }, // Email
  password: {
    type: String,
    required: true,
  }, // Password
  nick: String, // Display name
  image: String, // Profile image url
  following: [String], // List of following accounts
  followers: [String], // List of follower accounts
  updates: [String], // List of tweet id's
  favorites: [String], // List of liked tweets's ids
  lastTweet: String, // Text of last update
  followingImages: [String], // List of following accounts profile images
}
```

- For tweets:
```js
var tweetSchema = {
  tweeter: String, // Display name of author
  author: String, // ID of author
  text: String, // Content of tweet
  likes: [String], // ID's of liked accounts
  date: String, // Date
  img: String, // Profile image of author
  parent: String // ID of parent tweet if it is a reply
}
```


## Features

- Home/Login page
- Feed page
- Profile page
- Pages with 2008 layout of Twitter
- Account & profile creation
- Validation for unique Email & ID
- Random profile image from different colored default eggs
- Logging in
- Tweeting
- MongoDB database using mongoose
- Profile pages with express routing parameters
- Template for profile and feed pages with EJS
- Fav icon, fav and unfav functions for tweets
- Delete icon and deleting your own tweets
- Following & unfollowing system
- Logging out
- Searching for tweets and users
- List page for search results and lists of followers, followings, liked tweets etc.
- List page for followings and followers
- Replying function for all tweets
- Tweet pages for viewing parent and child tweets
- Route parameters for own pages of tweets


## Roadmap

- ~~Changing profile name & bio~~ ( canceled )
- Layout improvements


## Lessons Learned

While building this project, I learned how important it is for the pages to be responsive.
I learned how high the probability of the user to encounter any errors and how critical it is to find and debug these errors.
It was hard, challenging for me to construct database system (it was my first time); but i have managed to overcome it with great effort.
I was unexperienced in techs like EJS, Express and Databases but it became was a great experience for me about theese and other techs.


## Screenshots

- Main Page
<img src="readme_images\1.png" alt="screenshot-1">

- Register Page
<img src="readme_images\2.png" alt="screenshot-2">

- Profile Page
<img src="readme_images\3.png" alt="screenshot-3">

- Feed Page
<img src="readme_images\4.png" alt="screenshot-4">


## Feedback

If you have any feedback, please reach out to me at coskntkk@gmail.com
