const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
  title: String,
  author: String,
  url: String,
  likes: Number,
});

blogSchema.set('toJSON', {
  transform: (document, returnedObject) => ({
    title: returnedObject.title,
    author: returnedObject.author,
    url: returnedObject.url,
    likes: returnedObject.likes,
    id: returnedObject._id,
  }),
});

module.exports = mongoose.model('Blog', blogSchema);
