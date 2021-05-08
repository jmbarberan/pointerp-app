const CopyPlugin = require("copy-webpack-plugin");
//const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
//const MiniCssExtractPlugin = require('mini-css-extract-plugin');
//const ExtractTextPlugin = require("extract-text-webpack-plugin");

module.exports = {
  runtimeCompiler: true,
  //publicPath: process.env.NODE_ENV === 'production' ? 'http://app.pointerp.local' : '/', 
  /*css: {
    sourceMap: true,
    extract: true
  },*/
  filenameHashing:false,
  productionSourceMap: false,
  configureWebpack:{
    /*module: {
      rules: [
        {
          test: /\.css$/,
          use: [ 
            process.env.NODE_ENV !== 'production' 
              ? 'vue-style-loader' 
              : MiniCssExtractPlugin.loader, 'css-loader'
          ]
        }
      ]
    },*/
    resolve: {
      symlinks: false
    },
    optimization: {
      splitChunks: {
        cacheGroups: {
          default: false,
          // Custom common chunk
          bundle: {
            name: 'commons',
            chunks: 'all',
            minChunks: 3,
            reuseExistingChunk: false,
          },
          // Customer vendor
          vendors: {
            chunks: 'initial',
            name: 'vendors',
            test: 'vendors',
          },
          // Merge all the CSS into one file
          styles: {
            name: 'styles',
            test: /\.s?css$/,
            chunks: 'all',
            minChunks: 1,
            reuseExistingChunk: true,
            enforce: true,
          },
        }  
      }
    },
    plugins: [
      new CopyPlugin(
        [
          { from: "src/assets/img", to: "assets/img" },
          { from: "src/assets/logos", to: "assets/logos" },
          { from: "src/assets/fonts", to: "assets/fonts" }
        ]
      ),
      //new BundleAnalyzerPlugin(),
      //new MiniCssExtractPlugin({ filename: 'estilos.css' })
    ],
  }
}