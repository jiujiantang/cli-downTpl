#! /usr/bin/env node
const program = require('commander')

// 定义命令和参数
// create命令
program
.command('create <app-name>')
.description('create a new project')
.option('-f, --force', 'overwrite target directory if it exist')
.action((name, options) => {
    // 打印执行结果
    console.log('program name is', name)
    require('../lib/create')(name, options)
})

// 解析用户执行命令的传入参数
program.parse(process.argv)
