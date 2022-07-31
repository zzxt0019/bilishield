// const { VueLoaderPlugin } = require("vue-loader");
import * as fs from 'fs'
import * as path from 'path'
import { BannerPlugin, type Configuration } from 'webpack'


const config: Configuration = {

  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
    extensions: ['.ts', '.js', '.tsx'],
  },

  entry: './src/main.tsx',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'userscript.js',
  },

  optimization: {
    // minimizer: [
    //   new ESBuildMinifyPlugin({
    //     target: 'es2015',
    //     banner: fs
    //       .readFileSync(path.resolve(__dirname, './src/info.ts'), 'utf-8')
    //       .replace("${timestamp}", String(new Date().getTime()))
    //       .replace(/(==\/UserScript==)[\s\S]+$/, '$1'),
    //   }),
    // ],
  },

  module: {
    rules: [
      {
        test: /\.ts|\.tsx$/i,
        // loader: 'babel-loader',
        // options: {
        //   loader: 'ts',
        //   target: 'es2015',
        // },
        use: ['babel-loader','ts-loader']
      },
      // {
      //   test: /\.vue$/,
      //   use: "vue-loader",
      // },
      {
        test: /\.css|\.less$/,
        use: ["style-loader", "css-loader", "less-loader"],
      },
    ],
  },
  plugins: [
    new BannerPlugin({
      raw: true,
      banner: fs
        .readFileSync(path.resolve(__dirname, './src/info.ts'), 'utf-8')
        .replace("${timestamp}", String(new Date().getTime()))
        .replace(/(==\/UserScript==)[\s\S]+$/, '$1'),
    })
    // new VueLoaderPlugin(),
  ]
}

export default config
