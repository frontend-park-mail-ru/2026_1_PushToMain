import HtmlBundlerPlugin from "html-bundler-webpack-plugin";
import path, { dirname } from "path";
import MiniCssExtractPlugin from "mini-css-extract-plugin";
import CssMinimizerPlugin from "css-minimizer-webpack-plugin";
import ImageMinimizerPlugin from "image-minimizer-webpack-plugin";

const __dirname = dirname("./");

export default {
    mode: "development",

    plugins: [
        new HtmlBundlerPlugin({
            entry: {
                index: "./src/react/test.html",
            },
        }),
        new MiniCssExtractPlugin(),
    ],

    optimization: {
        minimize: true,
        minimizer: [
            new CssMinimizerPlugin(),
            new ImageMinimizerPlugin({
                minimizer: {
                    implementation: ImageMinimizerPlugin.imageminMinify,
                    options: {
                        plugins: ["imagemin-mozjpeg", "imagemin-pngquant", "imagemin-svgo"],
                    },
                },
            }),
        ],
    },
    output: {
        path: path.resolve(__dirname, "./build"),
        publicPath: "/",
        clean: true,
    },

    module: {
        rules: [
            {
                test: /\.s[ac]ss$/i,
                use: ["style-loader", "css-loader", "sass-loader"],
            },
            {
                test: /\.css$/,
                loader: "css-loader",
            },
            {
                test: /\.(ts|tsx)$/,
                use: ["babel-loader", "ts-loader"],
            },
        ],
    },

    resolve: {
        extensions: [".tsx", ".jsx", ".ts", ".js"],
    },

    devServer: {
        port: 3000,
        open: true,
    },
};
