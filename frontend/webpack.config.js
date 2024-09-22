const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require("copy-webpack-plugin");

module.exports = {
    mode: 'development',
    entry: './src/app.js',
    output: {
        filename: 'main.js',
        path: path.resolve(__dirname, 'dist'),
        clean: true,
    },
    module: {
        rules: [
            {
                test: /\.css$/,
                use: [
                    'style-loader',
                    'css-loader'
                ]
            }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
        template: "./index.html"
        }),
        new CopyPlugin({
            patterns: [
                {from: "templates", to: "templates"},
                {from: "static/images", to: "images"},
            ],
        }),
    ],
    devServer: {
        watchFiles: path.resolve(__dirname, 'src'),
        open: true,
        compress: true,
        hot: true
    }

};