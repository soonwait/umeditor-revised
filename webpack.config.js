const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');

module.exports = {
    entry: {
        // 这里要有先后顺序
        revised: './src/revised/index-umeditor.js',
        console: './src/revised/um-console.js',
        instance: './src/revised/um-instance.js',
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
            inject: 'body',
            chunks: ['revised', 'console', 'instance', 'app']
        }),
        new HtmlWebpackPlugin({
            title: 'Test',
            filename: 'test.html',
            template: './src/test.html',
            inject: 'body',
            chunks: ['revised', 'instance', 'test']
        })
    ],
    output: {
        path: path.resolve(__dirname, 'docs'),
        filename: '[name].bundle.js'
    },
    devServer: {
        // compress: true,
        // open: true,
        // openPage: '/different/page',
        // 只有请求时才编译
        // lazy: true,
        // 只有请求这个文件时才编译
        // filename: "bundle.js",
        // 从哪里提供bundle.js，默认/，表示的是http相对路径，指向contentBase下
        // publicPath: "/assets/",
        // or []
        contentBase: path.join(__dirname, "docs"),
        // watchContentBase: true,
        // watchOptions: {
        //     poll: true
        // },
        // 主页
        // index: 'index.html',
        // https: true,
        // headers: {
        //     "X-Custom-Foo": "bar"
        // },
        host: '0.0.0.0',
        // browser open with your local IP，这个解决了open成0.0.0.0的问题
        useLocalIp: true,
        port: 8081,
        // proxy: {
        //     "/api": "http://localhost:3000"
        // },
        // 不检查域名
        disableHostCheck: true,
        // 域名白名单
        // allowedHosts: [],
        allowedHosts: []
    }
};