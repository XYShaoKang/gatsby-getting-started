/**
 * @typedef Project
 * @type {object}
 * @property {string} name - 项目名称,导航显示文本
 * @property {string} pathPrefix - 编译后相对地址前缀
 * @property {string} projectPath - 项目相对路径
 */

/**
 * @type {Array.<Project>} 需要编译的项目配置
 */
const projects = [
  {
    name: 'home',
    pathPrefix: '/',
    projectPath: '/examples/www/',
  },
  {
    name: 'gatsby-hello-world-preview',
    pathPrefix: '/gatsby-hello-world',
    projectPath: '/examples/gatsby-hello-world-preview/',
  },
]

module.exports = {
  projects,
}
