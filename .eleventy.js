const { TextToSpeechPodcastPlugin } = require("./index");
const { TextToSpeechPlugin } = require("eleventy-plugin-text-to-speech");

module.exports = function (eleventyConfig) {
  eleventyConfig.addPlugin(TextToSpeechPodcastPlugin, {
    siteUrl: `https://eleventy-plugin-podcast.netlify.app`,
    feedInfo: {
      title: "My Eleventy Feed",
      author: "Larry Hudson",
      description: "Audio versions of my Eleventy content",
    },
  });
  eleventyConfig.addPlugin(TextToSpeechPlugin);

  return {
    dir: {
      input: "test_input",
      output: "mysite",
    },
  };
};
