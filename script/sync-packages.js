const { join } = require('path')
const shell = require('shelljs')

const packages = [
  {
    name: 'gatsby-hello-world',
    repository: 'gatsby-hello-world',
  },
  {
    name: 'gatsby-project-config',
    repository: 'gatsby-project-config',
  },
]

const GH_TOKEN = process.env.GH_TOKEN

const projectPath = join(__dirname, '../')

packages.forEach(async ({ name, repository }) => {
  const repositoryPath = join('/tmp', name)
  const branchName = `${name}-${new Date().getTime()}`

  shell.cd(projectPath)
  shell.exec(`git subtree split -P packages/${name} -b ${branchName}`)

  shell.mkdir('-p', repositoryPath)
  shell.cd(repositoryPath)
  shell.exec(`git init`)
  shell.exec(`git pull ${projectPath} ${branchName}`)
  shell.exec(
    `git remote add origin https://${GH_TOKEN}@github.com/XYShaoKang/${repository}.git`,
  )
  shell.exec(`git push -f -u origin master`)
  shell.cd(projectPath)
})
