/**
 * @type {import('gatsby').GatsbyConfig}
 */
const option = {
  pathPrefix: process.env.PATH_PREFIX || ``,
  plugins: [`gatsby-plugin-styled-components`],
}

module.exports = option
