const lodashMerge = require("lodash.merge");

const { generatePodcastFeed } = require("./utils/podcast-feed");

const PodcastPlugin = (eleventyConfig, suppliedOptions) => {
  const defaultOptions = {
    siteOutputDir: eleventyConfig.dir.output || "_site",
    collectionName: `textToSpeechPluginPages`,
    infoFilename: `/podcast-info.json`,
    feedOutputPath: `/podcast.xml`,
    feedInfo: {},
  };

  const options = lodashMerge(defaultOptions, suppliedOptions);

  eleventyConfig.addGlobalData("podcastPlugin", options);

  eleventyConfig.on("eleventy.after", () => generatePodcastFeed(options));
};

class PodcastInfoTemplate {
  getEpisodePagesFromData = (data) =>
    data.collections[data.podcastPlugin.collectionName];

  getInfoFromEpisodeData = (episodePage) => ({
    title: episodePage.data.title,
    description: episodePage.data.description,
    date: episodePage.data.date,
    pageUrl: episodePage.url,
    mp3Url: episodePage.data.mp3Url,
  });

  data() {
    return {
      permalink: (data) => data.podcastPlugin.infoFilename,
    };
  }

  async render(data) {
    // this should return everything that the podcast feed needs
    const episodePages = this.getEpisodePagesFromData(data);

    return JSON.stringify(
      episodePages.map(this.getInfoFromEpisodeData),
      null,
      2
    );
  }
}

module.exports = {
  PodcastPlugin,
  PodcastInfoTemplate,
};
