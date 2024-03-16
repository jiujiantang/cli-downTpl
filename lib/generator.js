const { getRepoList, getTagList } = require('./http')

const ora = require('ora')
const inquirer = require('inquirer')
const util = require('util')
const downloadGitRepo = require('download-git-repo')
const path = require('path')
const chalk = require('chalk')

// 封装loading外壳
async function wrapLoading(fn, message, ...args) {
    const spinner = ora(message)

    spinner.start()

    try {
        const result = await fn(...args)

        spinner.succeed()
        return result
    } catch (error) {
        spinner.fail('Requiest failed, please refetch...')
    }
}

class Generator {
    constructor(name, targetDir) {
        this.name = name
        this.targetDir = targetDir
        this.downloadGitRepo = util.promisify(downloadGitRepo)
    }

    // 获取用户选择的模版
    // 1. 从远端拉模版数据
    // 2. 用户去选择自己已有下载的模版名称
    // 3. 返回用户选择的模版
    async getRepo() {
        const repoList = await wrapLoading(getRepoList, 'waiting for fetch template')

        console.log(repoList)

        if (!repoList) return

        const repos = repoList.map(item => item.name)

        // 让用户去选择自己新下载的模版名称
        const { repo } = await inquirer.prompt({
            name: 'repo',
            type: 'list',
            choices: repos,
            message: 'Please choose a template to create project'
        })

        return repo
    }

    // 获取用户选择的版本
    // 1. 基于repo的结果，远程拉版本列表
    // 2. 自动选择最新的tag
    async getTag(repo) {
        const tags = await wrapLoading(getTagList, 'waiting for fetch tag', repo)
        if (!tags) return
        
        const tagsList = tags.map(item => item.name)
        
        return tagsList[0]
    }

    // 下载远程模版
    // 1. 拼接下载地址
    // 2. 调用下载方法
    async download(repo, tag) {
        const requestUrl = `FEcourseZone/${repo}${tag ? '#'+tag : ''}`

        await wrapLoading(
            this.downloadGitRepo,
            'waiting download template',
            requestUrl,
            path.resolve(process.cwd(), this.targetDir)
        )
    }

    // 核心创建逻辑
    async create() {
        // 1. 获取模版名称
        const repo = await this.getRepo()

        // 2. 获取tag名称
        const tag = await this.getTag(repo)

        // 3. 下载模版到目录
        await this.download(repo, tag)

        console.log(`\r\nSuccessfully created project ${chalk.cyan(this.name)}`)
    }
}

module.exports = Generator