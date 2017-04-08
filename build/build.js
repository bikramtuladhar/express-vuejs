require('./check-versions')()

process.env.NODE_ENV = 'production'

var ora = require('ora')
var opn = require('opn')
var rm = require('rimraf')
var path = require('path')
var express = require('express')
var chalk = require('chalk')
var webpack = require('webpack')
var config = require('../config')
var webpackConfig = require('./webpack.prod.conf')

var spinner = ora('building for production...')
spinner.start()

rm(path.join(config.build.assetsRoot, config.build.assetsSubDirectory), err => {
    if (err) throw err
    webpack(webpackConfig, function (err, stats) {
        spinner.stop()
        if (err) throw err
        process.stdout.write(stats.toString({
                    colors: true,
                    modules: false,
                    children: false,
                    chunks: false,
                    chunkModules: false
                }) + '\n\n')

        console.log(chalk.cyan('  Build complete.\n'))
        console.log(chalk.yellow(
                '  Tip: built files are meant to be served over an HTTP server.\n' +
                '  Opening index.html over file:// won\'t work.\n'
        ))
    })
})
var app = express()
//var compiler = webpack(webpackConfig)

// default port where dev server listens for incoming traffic
var port = process.env.PORT || config.build.port

// handle fallback for HTML5 history API
app.use(require('connect-history-api-fallback')())

app.use('/static', express.static(path.join(__dirname, '../dist/static')))
app.use('/sw.js', express.static(path.join(__dirname, '../dist/sw.js')))
app.use('/index.html', express.static(path.join(__dirname, '../dist/index.html')))
console.log(path.join(__dirname, '../dist/static'));

var uri = 'http://localhost:' + port

var _resolve
var readyPromise = new Promise(resolve => {
    _resolve = resolve
})

console.log('\n> Starting dev server at ' + uri)

app.get('/*', function (req, res) {
    res.sendFile("index.html", {"root": 'dist'});
})

var server = app.listen(port)

module.exports = {
    ready: readyPromise,
    close: () => {
        server.close()
    }
}