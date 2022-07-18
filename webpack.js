const webpackConfig = require('@nextcloud/webpack-vue-config')
const path = require('path')

webpackConfig.entry = {
	settings: path.join(__dirname, 'src', 'settings.js'),
}

webpackConfig.stats = {
	context: path.resolve(__dirname, 'src'),
	assets: true,
	entrypoints: true,
	chunks: true,
	modules: true,
}

module.exports = webpackConfig
