/**
 * @type {import('gatsby').GatsbyConfig}
 */
const option = {
  pathPrefix: process.env.PATH_PREFIX || ``,
  plugins: [
    {
      resolve: `gatsby-hello-world`,
      options: {},
    },
  ],
}

module.exports = option
