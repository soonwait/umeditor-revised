const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');

module.exports = {
    entry: {
        app: './src/index.js',
        print: './src/print.js',
        test: './src/test.js'
    },
    devtool: 'inline-source-map',
    plugins: [
        new CleanWebpackPlugin({

        }),
        new HtmlWebpackPlugin({
            title: 'Development',
            filename: 'index.html',
            template: './src/index.html',
            inject: 'body'
        }),
        new HtmlWebpackPlugin({
            title: 'Test',
            filename: 'test.html',
            template: './src/test.html',
            inject: 'body'
        })
    ],
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].bundle.js'
    },
    devServer: {
        // compress: true,
        contentBase: './dist',
        host: '0.0.0.0',
        port: 8081,
        disableHostCheck: true
    }
};