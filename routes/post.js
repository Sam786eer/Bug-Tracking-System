const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const requireLogin = require('../middleware/requireLogin');
const Post = mongoose.model('Post');

//  Get all posts
router.get('/allpost', requireLogin, (req, res) => {
  Post.find()
    .populate('postedBy', "_id firstName lastName")
    .populate('comments.postedBy', '_id firstName lastName')
    .sort('-createdAt')
    .then(posts => res.json({ posts }))
    .catch(err => console.log(err));
});

//  Get posts from followed users
router.get('/getsubpost', requireLogin, (req, res) => {
  Post.find({ postedBy: { $in: req.user.following } })
    .populate('postedBy', "_id firstName lastName")
    .populate('comments.postedBy', '_id firstName lastName')
    .sort('-createdAt')
    .then(posts => res.json({ posts }))
    .catch(err => console.log(err));
});

//  Create a post (added github)
router.post('/createpost', requireLogin, (req, res) => {
  const { title, body, due, github, teamMembers, severity, status, language, framework } = req.body;

  if (!title || !body || !due || !teamMembers || !severity || !status || !language || !framework) {
    return res.status(422).json({ error: 'Please complete all fields' });
  }

  req.user.password = undefined;

  const post = new Post({
    title,
    body,
    due,
    github, //  include github
    teamMembers,
    severity,
    postedBy: req.user,
    status,
    language,
    framework
  });

  post.save()
    .then(result => res.json({ post: result }))
    .catch(err => console.log(err));
});

//  Get posts created by logged-in user
router.get('/mypost', requireLogin, (req, res) => {
  Post.find({ postedBy: req.user._id })
    .populate('postedBy', "_id firstName lastName")
    .then(mypost => res.json({ mypost }))
    .catch(err => console.log(err));
});

//  Like post
router.put('/like', requireLogin, (req, res) => {
  Post.findByIdAndUpdate(req.body.postId, {
    $push: { likes: req.user._id }
  }, { new: true })
    .exec((err, result) => {
      if (err) return res.status(422).json({ error: err });
      res.json(result);
    });
});

//  Add comment
router.put('/comment', requireLogin, (req, res) => {
  const comment = {
    text: req.body.text,
    postedBy: req.user._id
  };

  Post.findByIdAndUpdate(req.body.postId, {
    $push: { comments: comment }
  }, { new: true })
    .populate('comments.postedBy', '_id firstName lastName date')
    .populate('postedBy', '_id firstName lastName date')
    .exec((err, result) => {
      if (err) return res.status(422).json({ error: err });
      res.json(result);
    });
});

//  Delete post
router.delete('/deletepost/:postId', requireLogin, (req, res) => {
  Post.findOne({ _id: req.params.postId })
    .populate('postedBy', '_id')
    .exec((err, post) => {
      if (err || !post) return res.status(422).json({ error: err });
      if (post.postedBy._id.toString() === req.user._id.toString()) {
        post.remove()
          .then(result => res.json(result))
          .catch(err => console.log(err));
      }
    });
});

//  Update post (added github)
router.put('/updatepost/:postId', requireLogin, (req, res) => {
  const { title, body, due, github, teamMembers, severity, status, language, framework } = req.body;

  Post.findOne({ _id: req.params.postId })
    .populate('postedBy', '_id')
    .exec((err, post) => {
      if (err || !post) {
        return res.status(422).json({ error: 'Post not found' });
      }

      if (post.postedBy._id.toString() !== req.user._id.toString()) {
        return res.status(403).json({ error: 'Unauthorized' });
      }

      //  Update all fields including github
      post.title = title || post.title;
      post.body = body || post.body;
      post.due = due || post.due;
      post.github = github || post.github; //  fixed here
      post.teamMembers = teamMembers || post.teamMembers;
      post.severity = severity || post.severity;
      post.status = status || post.status;
      post.language = language || post.language;
      post.framework = framework || post.framework;

      post.save()
        .then(updatedPost => res.json(updatedPost))
        .catch(err => {
          console.log(err);
          res.status(500).json({ error: 'Update failed' });
        });
    });
});

module.exports = router;
