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
    minimize: false
  },

  module: {
    rules: [
      {
        test: /\.ts|\.tsx$/i,
        exclude: /node_modules/,
        use: ['babel-loader', 'ts-loader']
      },
      {
        test: /\.raw\.css$/,
        exclude: /node_module/,
        use: ["raw-loader"]
      },
      {
        test: /\.yml|\.yaml$/,
        use: ["raw-loader"]
      }
    ],
  },
  plugins: [
    new BannerPlugin({
      raw: true,
      banner: fs.readFileSync(path.resolve(__dirname, './src/info.ts'), 'utf-8')
        .replace("${timestamp}", String(new Date().getTime()))
        .replace(/(==\/UserScript==)[\s\S]+$/, '$1'),
    })
  ]
}

export default config
