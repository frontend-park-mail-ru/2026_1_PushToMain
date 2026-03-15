import HtmlWebpackPlugin from "html-webpack-plugin"
import path, { dirname } from "path";
import MiniCssExtractPlugin from "mini-css-extract-plugin";
import CssMinimizerPlugin from "css-minimizer-webpack-plugin";
import ImageMinimizerPlugin from "image-minimizer-webpack-plugin";

const __dirname = dirname("./");

export default {
    mode: "development",

    entry: {
        main: "./src/App.tsx",
    },

    plugins: [
        new HtmlWebpackPlugin({
            template: "./public/index.html",
            filename: "index.html",
        }),
        new MiniCssExtractPlugin(),
    ],

    optimization: {
        minimize: false,
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
                use: ["style-loader", "css-loader"],
            },
            {
                test: /\.(ts|tsx)$/,
                use: [
                    {
                        loader: "babel-loader",
                        options: {
                            presets: [
                                "@babel/preset-env",
                                "@babel/preset-typescript",
                                [
                                    "@babel/preset-react",
                                    {
                                        pragma: "Death13.createElement",
                                        pragmaFrag: "Death13.Fragment",
                                    },
                                ],
                            ],
                        },
                    },
                ],
            },
        ],
    },

    resolve: {
        extensions: [".tsx", ".jsx", ".ts", ".js"],
        alias: {
            "@react": path.resolve(__dirname, "src/react"),
        },
    },

    devServer: {
        port: 3000,
        open: true,
        hot: true,
        historyApiFallback: true,
    },
};
