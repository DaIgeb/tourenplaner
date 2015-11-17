'use strict';

var path = require('path');
var fs = require('fs');
var webpack = require('webpack');
var ExtractTextPlugin = require("extract-text-webpack-plugin");
var HtmlWebpackPlugin = require('html-webpack-plugin');

var srcPath = path.join(__dirname, 'src');

var node_modules = path.resolve(__dirname, 'node_modules');
var nodeModules = {};
fs.readdirSync(node_modules)
    .filter(function (x) {
        return ['.bin'].indexOf(x) === -1;
    })
    .forEach(function (mod) {
        nodeModules[mod] = 'commonjs ' + mod;
    });

// console.log('Node Modules: ' + JSON.stringify(nodeModules));
module.exports = [{
    name: 'server',
    entry: path.resolve(srcPath, 'server/server.ts'),
    target: 'node',
    output: {
        path: __dirname + '/dist',
        filename: 'server.js'
    },
    resolve: {
        root: srcPath,
        modulesDirectories: ['web_modules', 'node_modules', 'src/components'],
        extensions: ['', '.webpack.js', '.web.js', '.js', '.jsx', '.ts', '.tsx'],
        alias: {
            // 'react': pathToReact,
            //'react-dom': pathToReactDom
        }
    },
    externals: nodeModules,
    module: {
        loaders: [
            {
                test: /\.ts(x?)$/,
                exclude: /(node_modules|bower_components)/,
                loader: 'babel-loader!ts-loader'
            },
            {
                test: /\.js(x?)$/,
                loader: 'babel-loader'
            }, {
                test: /\.(json)$/,
                loader: 'json-loader'
            }]
    }
}, {
    target: 'web',
    entry: {
        app: path.resolve(srcPath, 'client/main.tsx'),
        vendor: ["react", "react-dom", 'alt']
    },
    output: {
        path: path.resolve(__dirname, 'dist/public'),
        publicPath: '',
        filename: '[name].js',
        pathInfo: true
    },
    resolve: {
        root: srcPath,
        modulesDirectories: ['web_modules', 'node_modules', 'src/components'],
        extensions: ['', '.webpack.js', '.web.js', '.js', '.jsx', '.ts', '.tsx'],
        alias: {
            // 'react': pathToReact,
            //'react-dom': pathToReactDom
        }
    },
    // Add minification
    plugins: [
        //new webpack.optimize.UglifyJsPlugin(),
        //new webpack.optimize.CommonsChunkPlugin(/* chunkName= */"app", /* filename= */"app.js"),
        //new webpack.optimize.CommonsChunkPlugin(/* chunkName= */"bundle", /* filename= */"bundle.js"),
        new webpack.optimize.CommonsChunkPlugin(/* chunkName= */"vendor", /* filename= */"vendor.bundle.js"),
        new ExtractTextPlugin("styles.css"),
        new HtmlWebpackPlugin({
            inject: true,
            template: 'src/client/index.html'
        }),
        new webpack.NoErrorsPlugin()
    ],
    module: {
        loaders: [
            {
                test: /\.ts(x?)$/,
                exclude: /(node_modules|bower_components)/,
                loader: 'babel-loader!ts-loader'
            },
            {
                test: function (absPath) {
                    var pattern = /src\\.*\.js(x?)$/;
                    return pattern.test(absPath);
                },
                exclude: /(node_modules|bower_components)/,
                loader: 'babel-loader'
            },
            {
                test: /\.less$/,
                loader: ExtractTextPlugin.extract('css?sourceMap!less?sourceMap') //'style-loader!css-loader!less-loader'
            },
            {
                test: /\.(woff(2?)|eot|ttf)$/,
                loader: 'url?limit=100000'
            },
            {
                test: /\.(png|jpg|svg)$/,
                loader: 'url?limit=25000'
            }
        ],
        noParse: [
            //   pathToReact,
            //    pathToReactDom
        ]
    },
    debug: true,
    devtool: 'source-map',
    devServer: {
        contentBase: './dist',
        historyApiFallback: true
    }
}];