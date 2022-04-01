const path = require("path");
const fs = require("fs");
const fsPromises = require("fs/promises");
const mp3Duration = require("mp3-duration");
const { Podcast } = require("podcast");
const lodashMerge = require("lodash.merge");

async function generatePodcastFeed(options) {
  const SITE_URL = options.siteUrl;

  if (!SITE_URL)
    throw new Error(
      "[eleventy-plugin-podcast] Cannot generate podcast feed because `siteUrl` is not set in the plugin options.\nThe podcast feed needs the siteUrl to generate full links."
    );

  const SITE_OUTPUT_DIR = options.siteOutputDir;
  const PODCAST_INFO_FILENAME = options.infoFilename;

  const PODCAST_INFO_FILEPATH = path.join(
    SITE_OUTPUT_DIR,
    PODCAST_INFO_FILENAME
  );

  const podcastInfoExists = fs.existsSync(PODCAST_INFO_FILEPATH);

  if (!podcastInfoExists)
    throw new Error(
      "[eleventy-plugin-podcast] Could not find the podcast info file in the output directory.\nCheck the instructions on adding the podcast info template to your input directory."
    );

  const podcastItemsFromJson = await fsPromises
    .readFile(PODCAST_INFO_FILEPATH)
    .then((data) => JSON.parse(data));

  //   Add file size and duration to each episode

  const podcastItems = await Promise.all(
    podcastItemsFromJson.map(async (podcastItem) => {
      const mp3FilePath = path.join(SITE_OUTPUT_DIR, podcastItem.mp3Url);

      const size = await fsPromises
        .stat(mp3FilePath)
        .then((fileStats) => fileStats.size);

      const duration = await mp3Duration(mp3FilePath);

      return {
        ...podcastItem,
        duration,
        size,
      };
    })
  );

  //   Create the podcast feed with the options set when adding plugin

  const getFullUrl = (url) => (url.startsWith("/") ? SITE_URL + url : url);

  const defaultFeedInfo = {
    feedUrl: getFullUrl(options.feedOutputPath),
    siteUrl: SITE_URL,
    generator: "eleventy-plugin-podcast",
    title: "eleventy-plugin-podcast",
  };

  // Merge default options with supplied options

  const feedInfo = lodashMerge(defaultFeedInfo, options.feedInfo);

  // Make sure the image URL is a full URL

  if (feedInfo.imageUrl) {
    feedInfo.imageUrl = getFullUrl(feedInfo.imageUrl);
  }

  const feed = new Podcast(feedInfo);

  podcastItems.forEach((podcastItem) => {
    feed.addItem({
      title: podcastItem.title,
      description: podcastItem.description,
      url: getFullUrl(podcastItem.pageUrl),
      date: podcastItem.date,
      itunesDuration: podcastItem.duration,
      itunesSummary: podcastItem.description,
      content: podcastItem.description,
      enclosure: {
        url: getFullUrl(podcastItem.mp3Url),
        size: podcastItem.size,
      },
    });
  });

  // Write the podcast XML file

  const podcastFeedXml = feed.buildXml();

  const PODCAST_FEED_OUTPUT_FILEPATH = path.join(
    SITE_OUTPUT_DIR,
    options.feedOutputPath
  );

  await fsPromises.writeFile(PODCAST_FEED_OUTPUT_FILEPATH, podcastFeedXml);

  // Delete the temporary podcast info file
  await fsPromises.rm(PODCAST_INFO_FILEPATH);
}

module.exports = {
  generatePodcastFeed,
};
