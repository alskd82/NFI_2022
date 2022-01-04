const path = require('path');
const webpack = require('webpack');
const childProcess = require('child_process'); // 터미널 명령어 실행 가능
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const CopyPlugin = require("copy-webpack-plugin");

const webpackMode = process.env.NODE_ENV || 'development';

module.exports = {
	mode: webpackMode,
	entry: {
        // common: ['./src/a.js', './src/b.js'], // 여러개 합치기
		pc: './src/js/index_pc.js',         // 빌드 파일 //
	},
	output: {
		path: path.resolve('./dist'), // 빌드 완료 위치 //
		filename: '[name]_bundle.js?[chunkhash]'
	},
	devServer: {
		static: './src', hot: true,         
	},
	optimization: {
		minimizer: webpackMode === 'production' ? [
			new TerserPlugin({
				terserOptions: {
					compress: {
						drop_console: true
					}
				}
			})
		] : [],
		splitChunks: {
			chunks: 'all',
			usedExports: true,
		}
	},
	module: {
        // js 안에 import 로 불러오는 파일들을 처리하는 옵션들 //
		rules: [
			{
				test: /\.(css|scss|sass)$/,
				use: [
					webpackMode === 'production' ? MiniCssExtractPlugin.loader : 
					'style-loader','css-loader','sass-loader'
				]
			},
			{
				test: /\.(png|jpg|gif|svg)$/,
				loader: 'url-loader',
				options: {
					// publicPath: './dist/',// 경로 앞에 추가되는 문자열
					outputPath: 'assets', // 기본 output path 이후 경로
					name: '[name].[ext]?[chunkhash]',
					limit: 10000,         // 10kb 이하 이미지들은 base 64 방식으로 html 에 직접 입력 
				}
			},
			{
				test: /\.js$/,
				loader: 'babel-loader',
				exclude: /node_modules/, // 노드모듈안에 있는 js 는 제외
			},
			{
				test: /\.js$/,
				enforce: 'pre',
				use: ['source-map-loader'],
			}
		]
	},
	plugins: [
		new HtmlWebpackPlugin({
			template: './src/PC.html', // './src/Mobile.html',
			templateParameters: {
				env: webpackMode === 'development' ? '(개발용)' : ''
			},
			minify: webpackMode === 'production' ? {
				collapseWhitespace: true,
				removeComments: true,
			} : false
		}),
		new CleanWebpackPlugin(),
		...(webpackMode === 'production'
			? [new MiniCssExtractPlugin({ filename: '[name].css?[chunkhash]' })]
			: []
		),
		// 빌드 될 js에 포함시키지 않고 그대로 가져와서 쓰는 파일은 아래처럼 설정하고, HTML에도 직접 넣어주세요
		new CopyPlugin({
			patterns: [
				// { from: "./src/js/vendor/", to: "./js/vendor/[name][ext]" },
                // { from: "./src/assets/", to: "./assets/[name][ext]" },
                { from: "./src/css/", to: "./css/[name][ext]"}
			],
		})        
	]
};
