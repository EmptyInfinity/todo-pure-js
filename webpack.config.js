const webpack = require('webpack')
const path = require('path')
const { resolve } = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
    mode: "development",
    context: resolve(__dirname, 'src'),
    entry: {
        app: './index.js',
    }, output: {
        filename: 'bundle.js',
        path: resolve(__dirname, 'dist'),
    },
    devtool: "eval-source-map",
    module: {
        rules: [{
            test: /\.jsx?$/,
            exclude: /node_modules/,
            use: 'babel-loader'
        },
        {
            test: /\.scss$/,
            use: [
                "style-loader", // creates style nodes from JS strings
                "css-loader", // translates CSS into CommonJS
                "sass-loader" // compiles Sass to CSS, using Node Sass by default
            ]
        }]
    },
    plugins: [
        new webpack.HotModuleReplacementPlugin(),
        new HtmlWebpackPlugin({
            inject: true,
            template: resolve(__dirname, 'src/index.html'),
        }),
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development')
        }),
    ],
    devServer: {
        port: 3030,
        hot: true,
        contentBase: 'src',
        publicPath: '/',
        historyApiFallback: true
    },
}