import path, { dirname } from "path";
import HtmlWebpackPlugin from "html-webpack-plugin";
import CopyWebpackPlugin from "copy-webpack-plugin";
import GeneratePrecacheManifest from "./webpack/GeneratePrecacheManifest.js";

const __dirname = dirname("./");

export default {
  entry: {
    main: "./src/App.tsx",
  },

  output: {
    path: path.resolve(__dirname, "./build"),
    publicPath: "/",
    clean: true,
  },

  resolve: {
    extensions: [".tsx", ".jsx", ".ts", ".js"],
    alias: {
      "@react": path.resolve(__dirname, "src/react"),
    },
  },

  module: {
    rules: [
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
      {
        test: /\.svg$/,
        use: ["file-loader"],
      },
    ],
  },

  plugins: [
    new HtmlWebpackPlugin({
      template: "./public/index.html",
      filename: "index.html",
      favicon: "./public/assets/svg/favicon.svg",
    }),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: "public/sw.js",
          to: "sw.js",
          transform: (content) => {
            const version = Date.now();
            return `${content.toString()}\nconst BUILD_VERSION = ${version};`;
          },
        },
        {
          from: "**/*",
          to: "assets/",
          context: "public/assets/",
          noErrorOnMissing: true,
        },
      ],
    }),
    new GeneratePrecacheManifest(),
  ],
};
