### 脚手架
快速自动化搭建启动项目工具

目标：
```js
    // 命令行直接创建基于模版的项目
    // pluto-cli create ${name}
```

目录：
```js
    /**
    |bin
        --plutoCli.js
    |lib
        --create.js
        --generator.js
        --http.js
    --package.json
    */
```

#### 第一步：处理依赖
```js
    /**
     * path {路径拼接}
     * chalk {文字高亮}
     * fs-extra {文件操作}
     * inquirer {选择确认}
     * commander {命令创建}
     * axios {ajax请求}
     * download-git-repo {模板下载}
     * ora {loading显示}
     */
    npm i path          
    npm i chalk@4.1.0
    npm i fs-extra
    npm i inquirer@8.2.4
    npm i commander
    npm i axios
    npm i download-git-repo

    // ora easy-table figlet
```

#### 第二步：处理工程入口
```js
    // 1. 初始化npm
    npm init

    // 2. 新建主命令，配置项更新
    // bin + package.json

    // 3. 关联主命令与配置项
    npm link

    // 4. 执行主命令即可关联逻辑内容
    // pluto-cli
```

#### 第三步：加入命令交互
交互好帮手 - commander
```js
    // 1、创建命令 - create
    // 2、拉取、选择模板
    // 3、下载模板到目录
```

### case
```js
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
```