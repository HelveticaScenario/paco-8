var path = require('path')
var webpack = require('webpack')
console.log(path.join(__dirname, 'src/paco-8.js'));

module.exports = {
    devtool: 'source-map',
    entry: [
        path.join(__dirname, 'src/paco-8.js')
    ],
    output: {
        path: path.join(__dirname, '/dist/'),
        filename: 'paco-8.js',
        publicPath: '/static/'
    },
    module: {
        loaders: [
            {
                test: /\.js$|\.jsx$/,
                loaders: [ 'babel-loader?{presets:["latest"]}' ],
                exclude: /node_modules/,
                include: [__dirname]
            }, {
                test: /\.json$/, loader: 'json'
            }, {
                test: /\.woff(2)?(\?.+)?$/, loader: "url?limit=10000&mimetype=application/font-woff"
            }, {
                test: /\.ttf(\?.+)?$/, loader: "url?limit=10000&mimetype=application/octet-stream"
            }, {
                test: /\.eot(\?.+)?$/, loader: "file"
            }, {
                test: /\.svg(\?.+)?$/, loader: "url?limit=10000&mimetype=image/svg+xml"
            }, {
                test: /\.png$/, loader: "url-loader?limit=100000"
            }, {
                test: /\.jpg$/, loader: "file-loader"
            }
        ]
    },
    resolve: {
        extensions: ["", ".json", ".js"],
    },
}
