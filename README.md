# eleventy-plugin-podcast

This is a plugin that generates a podcast feed from your Eleventy site.

This is for Eleventy sites with:

- pages for each episode, with an MP3 url in the page data
- MP3 files in the output directory

This pairs nicely with [eleventy-plugin-text-to-speech](https://github.com/larryhudson/eleventy-plugin-text-to-speech).

This is a work in progress - more detailed instructions coming soon!

## How to get started

1. npm install https://github.com/larryhudson/eleventy-plugin-podcast

Add the plugin to your `eleventyConfig` in `.eleventy.js`

```js
const {PodcastPlugin} = require('eleventy-plugin-podcast')

module.exports = function(eleventyConfig) {
    eleventyConfig.addPlugin(PodcastPlugin, {
        siteUrl: `https://my-eleventy-site.com` //
        feedInfo: {
            title: "My Eleventy Site",
            author: "Author Name",
            description: "Site description",
        }
        collectionName: "textToSpeechPluginPages"
    })
}
```

Add a new `podcast-info.11ty.js` to your input directory with this content:

```js
const { PodcastInfoTemplate } = require("eleventy-plugin-podcast");

module.exports = PodcastInfoTemplate;
```
