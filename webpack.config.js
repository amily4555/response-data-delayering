"use strict";
var path = require('path');

const autoprefixer = require('autoprefixer');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');
const WebpackMd5Hash = require('webpack-md5-hash');


//=========================================================
//  ENVIRONMENT VARS
//---------------------------------------------------------
const NODE_ENV = process.env.NODE_ENV;

console.log('oOooooOoo::::::', process.env.NODE_ENV);

const ENV_DEVELOPMENT = NODE_ENV === 'development';
const ENV_PRODUCTION = NODE_ENV === 'production';
const ENV_TEST = NODE_ENV === 'test';
const ENV_STAGING = NODE_ENV === 'staging';

const HOST = process.env.HOST || 'localhost';
const PORT = process.env.PORT || 3003;

const config = {
    entry: path.resolve(__dirname, 'app/app.module.js'),
    cache: true,
    debug: true,
    devtool: 'cheap-module-source-map'
};


module.exports = config;

config.resolve = {
    extensions: ['', '.html', '.js'],
    modulesDirectories: ['node_modules'],
    root: path.resolve('.')
};

config.module = {
    loaders: [
        {
            test: /\.js$/,
            include: path.resolve(__dirname, 'app/'),
            loader: 'ng-annotate?map=false!babel-loader',
            presets: ['es2015']
        },
        {
            test: /\.html$/,
            include: path.resolve(__dirname, 'app/'),
            loader: 'raw'
        },
        {
            test: /\.css$/,
            loader: 'style!css'
        },
        {
            test: /\.scss$/,
            loader: 'raw!postcss!sass'
        },
        {
            test: /\.(png|jpg|jpge|gif|woff|woff2|eot|ttf|svg)$/,
            loader: 'url-loader?limit=100000'
        }

    ]
};


config.output = {
    filename: '[name].js',
    path: path.resolve('./app'),
    publicPath: '/'
};

config.plugins = [
    new webpack.DefinePlugin({
        'process.env.NODE_ENV': JSON.stringify(NODE_ENV)
    })
];

config.postcss = [
    autoprefixer({browsers: ['last 3 versions']})
];

config.sassLoader = {
    outputStyle: 'compressed',
    precision: 10,
    sourceComments: false
};

config.devServer = {
    contentBase: './app',
    historyApiFallback: true,
    host: HOST,
    outputPath: config.output.path,
    port: PORT,
    publicPath: config.output.publicPath,
    stats: {
        cached: true,
        cachedAssets: true,
        chunks: true,
        chunkModules: false,
        colors: true,
        hash: false,
        reasons: true,
        timings: true,
        version: false
    }
};

config.plugins.push(
    new webpack.optimize.CommonsChunkPlugin({
        name: ['vendor', 'polyfills'],
        minChunks: Infinity
    }),

    new CopyWebpackPlugin([
        {from: './app/assets', to: 'assets'},
        {from: './app/lib', to: 'lib'},
        {from: './app/env', to: 'env'},
        {from: './app/get.html', to: ''},
        {from: './app/store', to: 'store'}
    ]),

    new HtmlWebpackPlugin({
        chunkSortMode: 'dependency',
        filename: 'index.html',
        hash: false,
        inject: 'body',
        template: './app/index.html'
    })
);


if(ENV_PRODUCTION) {
    // config.devtool = 'source-map';

    // config.entry = {
    //     vendor: path.resolve('./node_modules/angular/angular.js')
    // };

    config.output = {
        filename: '[name].[chunkhash].js',
        path: path.resolve('./dist'),
        publicPath: ''
    };

    config.plugins.push(
        new WebpackMd5Hash(),
        new ExtractTextPlugin('styles.[contenthash].css'),
        new webpack.optimize.DedupePlugin(),
        new webpack.optimize.UglifyJsPlugin({
            mangle: true,
            compress: {
                dead_code: true, // eslint-disable-line camelcase
                screw_ie8: true, // eslint-disable-line camelcase
                unused: true,
                warnings: false
            }
        }),

        new CopyWebpackPlugin([
            {from: path.resolve('./dist'), to: path.resolve('../ec____ui/dist')}

        ])
    );
}

