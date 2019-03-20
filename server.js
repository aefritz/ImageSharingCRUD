const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const logger = require('morgan');
const { Router } = require('express');
const { hash, compare, encode, verify, restrict, checkAccess } = require('./auth');
const { Post, User, Comment, Likes } = require('./models');

// allow the port to be defined with an env var or a dev value
const PORT = process.env.PORT || 3000;

// after importing middleware define app and mount them
const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(logger('dev'));

// mount route handlers
// --> create user
app.post('/users', async (req, res) => {
  try {
    let {name, password, email, bio, pro_pic} = req.body;
    console.log(name, password, email)
    let password_digest = await hash(password);
    const createUser = await User.create({
      name,
      password_digest,
      email,
      bio,
      pro_pic
    })
    let token = await encode(createUser.dataValues)
    res.json([token,createUser.dataValues]);
  } catch (e) {
    console.error(e);
  }
})
// --> login user
app.post('/users/login', async (req, res) => {
  try {
    let {password} = req.body;
    const loginUser = await User.findOne({
      where: {
        email: req.body.email
      }
    });
    let {password_digest} = loginUser;
    let verify = await compare(password, password_digest);
    if (verify) {
      let token = await encode(loginUser.dataValues)
      res.json([token,loginUser.dataValues]);
    } else {
      res.status(403)
    }
  } catch (e) {
    res.status(404).send(e.message)
  }
})
// --> user profile page <--- this path is now subsumed in get "users/:id/posts" which returns both a profile and images
  /*app.get('/users', async (req, res) => {
    try {

    } catch (e) {

    }
  })*/
  // --> get ALL users
    app.get('/allusers', async (req, res) => {
      try {
        let resp = await User.findAll();
        res.json(resp.map(user => user.dataValues));
      } catch (e) {
        res.status(403);
      }
    });
// --> edit profile page
app.put('/users/:id', async (req, res) => {
  try {
    let {name, bio, email, pro_pic} = req.body;
    const userProfile = await User.findByPk(req.params.id);
    let selectedProfile = await userProfile.update({name, bio, email, pro_pic});
    res.json(selectedProfile);
  } catch (e) {
    res.status(403)
  }
});
// --> create post
app.post('/users/:id/posts', async (req, res, next) => {

  try {
    let {title, description, publicId} = req.body
    const userId = req.params.id;
    const createPost = await Post.create({
      title, description, publicId, userId
    })
    console.log(title, userId)
    let selectedUser = await User.findOne({
      where: {
        id: userId
      }
    })
    let resp = await createPost.setUser(selectedUser)
    res.json(resp)
  } catch (e) {
    next(e)
  }
})
// --> show one user's profile & posts
app.get('/users/:id/posts', async (req, res, next) => {
  try {
    let {id} = req.params;
    console.log(req);
    const userPosts = await Post.findAll({
      where: {
        user_id: id
      }
    })
    let selectedUser = await User.findOne({
      where: {
        id
      }
    })
    res.json([userPosts,selectedUser])
  } catch (e) {
    next(e)
  }
})
// --> edit posts (tentatively done)
app.put('/users/posts/', async (req, res) => {
  let {post_id, title, description, publicId} = req.body;
  try {
    const userPost = await Post.findByPk(post_id);
    let updatedPost = await userPost.update({title,description,publicId});
    res.json(updatedPost);
  } catch (e) {
    res.status(403)
  }
})
// --> delete posts (tentatively done)
app.delete('/users/:id/posts/:post_id', async (req, res) => {
  try {
    const userPost = await Post.findByPk(req.params.post_id)
    userPost.destroy();
    res.status(200).send(`Deleted post with id ${req.params.post_id}`)
  } catch (e) {
    res.status(403).send(e.message);
  }
})
// Get Posts from All Users
app.get('/posts', async (req, res) => {
  try {
    console.log('hi posts')
    const posts = await Post.findAll();
    res.json(posts);
  } catch (e) {
    res.status(403).send(e.message);
  }
});

// generic "tail" middleware for handling errors
app.use((e, req, res, next) => {
  console.log(e);
  res.status(404).send(e.message);
});

// bind app to a port
app.listen(PORT, () => console.log(`up and running on port ${PORT}`));
