// readTime.js

export const calculateReadTime = (content) => {
  const wordsPerMinute = 200;

  const wordCount = content.split(/\s+/).length;

  const readTimeMinutes = Math.ceil(wordCount / wordsPerMinute);

  return readTimeMinutes;
};
