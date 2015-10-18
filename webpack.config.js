var webpack = require('webpack');
module.exports = {
    entry: './src/client/main.tsx',
    output: {
        filename: 'dist/client/bundle.js'
    },
    // Turn on sourcemaps
    devtool: 'source-map',
    resolve: {
        modulesDirectories: ['web_modules', 'node_modules', 'src/client/components'],
        extensions: ['', '.webpack.js', '.web.js', '.js', '.ts', '.tsx']
    },
    // Add minification
    plugins: [
        new webpack.optimize.UglifyJsPlugin()
    ],
    module: {
        loaders: [
            {
                test: /\.ts(x?)$/,
                exclude: /(node_modules|bower_components)/,
                loader: 'ts-loader'
            }
        ]
    },
    /*ts: {
        compiler: 'ntypescript'
    }*/
}