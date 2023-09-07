const dummy = (blogs) => 1;

const totalLikes = (blogs) => (blogs === null ? 0
  : blogs.reduce((sum, blog) => (sum + blog.likes), 0));

const favoriteBlog = (blogs) => {
  if (!blogs) {
    return {};
  }

  return blogs.reduce(
    (maxBlog, blog) => (maxBlog.likes > blog.likes ? { ...maxBlog } : { ...blog }),
    { ...blogs[0] },
  );
};

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog
};
