const { join } = require('path')
const shell = require('shelljs')

const { projects } = require('./build-config')

const publicPath = join(__dirname, 'public')

// 根据是否在 CI 中配置对应的路径前缀
// 在本地演示中使用 / 作为根路径
// 在 CI 中,要发布到 GitHub Pages,使用 /gatsby-getting-started 做为根路径
const prefixRoot = process.env.TRAVIS ? '/gatsby-getting-started' : '/'

projects.forEach(async ({ pathPrefix, projectPath }) => {
  // 项目根目录
  const absoluteProjectPath = join(__dirname, projectPath)
  // 编译后的 public 源路径
  const publicPathSource = join(absoluteProjectPath, 'public')
  // public 需要移动的目标路径
  const publicPathTarget = join(publicPath, pathPrefix)

  shell.cd(absoluteProjectPath)
  shell.exec(
    `PATH_PREFIX=${join(prefixRoot, pathPrefix)} yarn build --prefix-paths`,
  )

  shell.mkdir('-p', publicPathTarget)
  shell.mv(`${publicPathSource}/*`, publicPathTarget)
})
