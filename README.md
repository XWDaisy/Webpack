# webpack

#### 概念
>webpack 是一个Module Bundler(模块打包工具)
>支持Common JS模块，CMS, AMD, ES Module等模块的打包

#### 安装

安装： npm install webpack webpack-cli --save-dev

查看版本：npx webpack -v

webpack是核心模块，webpack-cli是命令行工具使我们可以在命令行里正确的使用webpack命令

#### 运行

global安装： webpack index.js
locale安装： npx webpack index.js
npm scripts: npm run ***

#### 基础配置

配置文件名： webpack.config.js

###### entry：打包的入口文件
```
单入口文件：
entry: './src/index.js'
多入口文件：
entry: {
   bundle1: '***',
   bundle2: '***'
}
```
###### output 打包的输出文件
```
output: {
    filename： ‘bundle.js’, //  打包出的文件名,可以使用占位符来实现多文件的打包比如 [name]_[hash].js
    path: path.resolve(__dirname, 'bundle') // 打包出的文件路径,
    publicPath: 'https//cdn.com' //打包出的文件加静态资源地址
}
```
###### mode: 打包的模式，默认production
```
mode: 'development'
```
##### devtool(SourceMap的配置)
>SourceMap可以对原代码和打包生成的代码形成一个映射关系，当出现错误时，可以通过映射关系找到对应的原代码的错误出处。
* source-map 生成一个单独的map文件
* inline-** 将映射代码以base64的形式放到打包之后的js文件中
* cheap-** 只显示映射的行数，提高打包的性能
* cheap-module-** 除业务代码的映射关系外还包含其他第三方js的映射
* eval 打包速度最快，但不适合复杂代码逻辑

>最佳实践
>development: cheap-module-eval-source-map
>production: cheap-module-source-map

##### resolve配置
```
resolve: {
    extensions: ['.js', '.jsx'], //当引入其他路径下的模块时，会查找以extensions为结尾的文件
    mainFiles: ['index', 'child'], // 当引入一个目录时，优先引入哪些文件
    alias: {
        @src: path.resove(__dir, '../src')
    } // 别名配置
}
```
#### Loader

##### file-loader

>打包静态资源文件(比如图片和字体文件)，并返回其路径

```
module: {
    rules: [{
        test: /\.jpg|png|gif$/,
        use: {
            loader: 'file-loader',
            options: {
                name: '[name]_[hash].[ext]',
                outputPath: 'images/'
            } 
        } 
    }]
 }
```
##### url-loader
>与file-loader作用类似，唯一不同是可以设置一个阈值，当小于该阈值时，以base64的形式打包到js文件中，大于该阈值时，打包成单独的文件
```
module: {
    rules: [{
        test: /\.jpg|png|gif$/,
        use: {
            loader: 'url-loader',
            options: {
                name: '[name]_[hash].[ext]',
                outputPath: 'images/'，
                limit： 2048
            } 
        } 
    }]
 }
```
##### 打包样式文件

##### style-loader
>将css挂载到页面的head部分

##### css-loader
>分析出几个css文件的关系，最终合并到一个css文件里
* `importLoaders` 当样式文件中引用其他样式文件时，不会执行下面的loader，加此属性之后无论是js中加载的样式文件还是样式文件中引用的样式文件，都会执行所有的loader

* `module` 当为true时表示按 css module的方式引用css, module之间互不影响

##### postcss-loader
>可以为css加浏览器前缀，需要使用autoprefixer插件
```
postcss.config.js
module.exports = {
  plugins: [
  	require('autoprefixer')
  ]
}
```
##### sass-loader
>将sass翻译为css

```
module: {
    rules: [{
        test: /\.scss$/,
        use: [
            'style-loader', 
            {
                loader: 'css-loader',
                options: {
                    importLoaders: 2,
                    modules: true
                }
            }, 
            'postcss-loader',
            'sass-loader',
        ]
    }]
}
```

#### plugin
>可以在webpack运行到某个时刻的时候帮助webpack做一些事情使得打包更加便捷

##### [html-webpack-plugin](https://webpack.js.org/plugins/html-webpack-plugin/)
>在打包结束后自动生成一个html文件并将打包生成的js文件自动引入到html文件中，支持自定义html template
>`npm install --save-dev html-webpack-plugin`
```
const HtmlWebpackPlugin = require('html-webpack-plugin');

plugins: [
    new HtmlWebpackPlugin({
        template: 'src/index.html'
    })
],
```

##### [clean-webpack-plugin](https://github.com/johnagan/clean-webpack-plugin#options-and-defaults-optional)
>在打包前先删除output.path中的内容然后重新生成
```
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
plugins: [
    new HtmlWebpackPlugin({
        template: 'src/index.html'
    }),
    new CleanWebpackPlugin()
],
```
#### webpack-dev-server

webpack --watch 监听文件的变化重新打包
webpack-dev-server 启动服务器重新打包并且打开浏览器，可以自动刷新浏览器
通过webpack-dev-middleware自己实现一个dev server
```
devServer: {
    contentBase: './dist', // 在哪个路径下启动服务
    historyApiFallback: true, //解决单页面应用路由问题
    open: true， // 是否自动打开浏览器
    proxy: {
        '/api': 'http://localhost/3000' //支持跨域代理
    }
},
```
#### Hot Module Replacement 热模块替换
>只更新修改的部分，保留其他部分，不会重新刷新整个页面
```
devServer: {
    hot: true, // 开启HMR
    hotOnly: true //当HMR不生效的时候也不刷新浏览器
},
plugins: [
    new webpack.HotModuleReplacementPlugin()
],
```
大部分语言的loader内置了HRM功能，即类似于以下的实现
```
if (module.hot) {
  module.hot.accept('模块', () => {
  })
}
```
#### 使用Babel转换ES6语法

```
npm install --save-dev babel-loader @babel/core
npm install @babel/preset-env --save-dev
npm install --save @babel/polyfill
module: {
  rules: [
    test: /\.js$/,
    exclude: /node_modules/,
    loader: "babel-loader",
    options: {
        "presets": [[
        "@babel/preset-env", // 转换ES6语法
        {
            targets: {
                chrome: "67" //只在特定版本上做
                babel转换
            },
            useBuiltIns: 'usage' // 使用polyfill补充低版本浏览器不支持的特性，只补充业务代码中使用的特性，并不是所有的
        }]]
    }
        
  ]
}
```
当打包一些第三方库时，为了避免使用polyfill注入一些module时污染全局变量，需要使用@babel/plugin-transform-runtime插件来配置
```
npm install --save @babel/runtime
npm install --save-dev @babel/plugin-transform-runtime
npm install --save @babel/runtime-corejs2
.babelrc配置
{
  "plugins": [
    [
      "@babel/plugin-transform-runtime",
      {
        "absoluteRuntime": false,
        "corejs": 2,
        "helpers": true,
        "regenerator": true,
        "useESModules": false,
        "version": "7.0.0-beta.0"
      }
    ]
  ]
}
```
打包React框架代码
```
npm install --save-dev @babel/preset-react
{
  "presets": ["@babel/preset-react"]
}
```
#### Tree Shaking
Tree Shaking只支持ES Module， 只引入需要的代码，并非所有的代码

在dev环境下的配置
```
webpack.config.js
optimization: {
    usedExports: true //打包那些导出的被使用的模块
},
package.json
sideEffects: ['*.css']  //哪些年模块不使用tree shaking
```
#### Code Splitting
##### webpack中实现代码分割，两种方式

* 同步代码： 只需要在wepack.config.js中进行配置

* 异步代码（import），无需任何配置，会自动进行代码分割(魔法注释：/*webpackChunkName: 'lodash'*/)

##### splitChunksPlugin配置
```
optimization: {
    splitChunks: {
      chunks: 'async',
      minSize: 30000,
      minRemainingSize: 0,
      maxSize: 0,
      minChunks: 1,
      maxAsyncRequests: 6,
      maxInitialRequests: 4,
      automaticNameDelimiter: '~',
      automaticNameMaxLength: 30,
      cacheGroups: {
        defaultVendors: {
          test: /[\\/]node_modules[\\/]/,
          priority: -10
        },
        default: {
          minChunks: 2,
          priority: -20,
          reuseExistingChunk: true
        }
      }
    }
  }
```

* chunks: 做代码分割时对同步或异步代码生效
    async: 对异步代码生效
    initial: 对同步代码生效
    all: 对同步异步都生效
* minSize: 引入的库大小大于minSize时做代码分割
* maxSize: 对分割出来的代码再次进行分割
* minChunks: 至少几个chunk文件使用到才会进行代码分割
* cacheGroup: 缓存分组，对分割的代码按一定规则进行分组

##### prefetching和preloading
>prefretching是在页面核心代码加载完毕后有空闲时再去加载
>/* webpackPrefetch: true */
>preloading是跟页面核心代码一起加载
##### css文件的代码分割
```
module.exports = {
  plugins: [
    new MiniCssExtractPlugin({
      filename: '[name].css',
      chunkFilename: '[id].css',
    }),
    new OptimizeCSSAssetsPlugin({}) //用于css文件的代码压缩
  ],
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
          'css-loader',
        ],
      },
    ],
  },
};
```
#### Shimming的作用
```
// 在一些引入的第三方js中注入一些库
plugins: [
    new webpack.ProvidePlugin({
        $: 'jquery',
        _: 'lodash'
    })
],
// 改变模块this的指向
module: {
    rules: [{
        test: /\.js$/,
        exclude: /node_modules/,
        use: [{
            loader: "babel-loader"
        }, {
            loader: 'imports-loader?this=>window'
        }]
}
```
#### Library的打包

##### library参数
当需要通过全局变量去获取Library库时可以配置此参数，将模块挂在到一个全局变量上 eg: library: 'root'，将此模块挂在到root变量上

##### libraryTarget参数
当需要使用模块引入的方式使用Library库时，可以配置此参数libraryTarget: 'umd'

##### externals
externals: 'lodash' 表示lodash
不会被打包到Library中去,需要业务代码去引入
```
module.exports = {
  mode: 'production',
  entry: './src/index.js',
  externals: ['lodash'],
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'library.js',
    libraryTarget: 'umd',
    library: 'library'
  }
}
```
#### PWA(Progressive Web Application)打包配置
当服务器挂掉的时候或者断网的情况下，页面可以使用第一次访问时留下的本地缓存，而避免出现错误的情况
```
const WorkboxPlugin = require('workbox-webpack-plugin');
plugins: [
    new WorkboxPlugin.GenerateSW({
        clientsClaim: true,
        skipWaiting: true
    })
],
```

#### 性能优化

1. 及时更新webpack,node,npm的版本，
2. 在尽可能少的模块上使用loader，比如排除node modules里面的模块
3. 尽可能少的使用plugin并确保其可靠性
4. resolve参数合理配置参数, extensions里只用js或jsx的逻辑文件
```
resolve: {
    extensions: ['.jsx']
}
```
5.使用DllPlugin提高打包速度

* 先打包一次第三方模块
```
const path = require('path');
const webpack = require('webpack');

module.exports = {
  mode: 'production',
  entry: {
    vendors: ['react', 'react-dom', 'lodash']
  }, 
  output: {
    filename: '[name].dll.js',
    path: path.resolve(__dirname, '../dll'),
    library: '[name]'
  },
  plugins: [
    new webpack.DllPlugin({
      name: '[name]',
      path: path.resolve(__dirname, '../dll/[name].manifest.json')
    })
  ]
}
```
* 引入第三方模块时使用dll引入 
```
plugins: [
    new AddAssetHtmlWebpackPlugin({
        filepath: path.resolve(__dirname, '../dll/vendors.dll.js')
    }),
    new webpack.DllReferencePlugin({
        manifest: path.resolve(__dirname, '../dll/vendors.manifest.json')
    }),
]
```
6. 控制包文件大小 
使用tree shaking, code splitting
7. thread-loader, parallel-webpack, happypack多进程打包
8. 合理使用sourceMap
9. 结合stats分析打包结果
10. 开发环境内存编译，比如webpack-dev-server
11. 开发环境无用插件剔除