import { merge } from "webpack-merge";
import MiniCssExtractPlugin from "mini-css-extract-plugin";
import CssMinimizerPlugin from "css-minimizer-webpack-plugin";
import ImageMinimizerPlugin from "image-minimizer-webpack-plugin";
import common from "./webpack.common.js";

export default merge(common, {
  mode: "production",
  devtool: "source-map",

  output: {
    filename: "js/[name].[contenthash].js",
    chunkFilename: "js/[name].[contenthash].chunk.js",
    assetModuleFilename: "assets/[name].[contenthash][ext]",
  },

  optimization: {
    minimize: true,
    minimizer: [
      new CssMinimizerPlugin(),
      new ImageMinimizerPlugin({
        minimizer: {
          implementation: ImageMinimizerPlugin.imageminMinify,
          options: {
            plugins: [
              ["imagemin-mozjpeg", { quality: 80 }],
              ["imagemin-pngquant", { quality: [0.6, 0.8] }],
              ["imagemin-svgo", {}],
            ],
          },
        },
      }),
    ],
    splitChunks: {
      chunks: "all",
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: "vendors",
          priority: 10,
        },
      },
    },
  },

  module: {
    rules: [
      {
        test: /\.s[ac]ss$/i,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: "css-loader",
            options: {
              url: { filter: (url) => !url.startsWith("/assets/") },
            },
          },
          "sass-loader",
        ],
      },
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, "css-loader"],
      },
    ],
  },

  plugins: [
    new MiniCssExtractPlugin({
      filename: "css/[name].[contenthash].css",
      chunkFilename: "css/[name].[contenthash].css",
    }),
  ],
});
