import webpack from "webpack";

const { sources } = webpack;

export default class GeneratePrecacheManifest {
  apply(compiler) {
    compiler.hooks.thisCompilation.tap(
      "GeneratePrecacheManifest",
      (compilation) => {
        compilation.hooks.processAssets.tap(
          {
            name: "GeneratePrecacheManifest",
            stage: compiler.webpack.Compilation.PROCESS_ASSETS_STAGE_ADDITIONS,
          },
          (assets) => {
            const svgUrls = [];
            const fontUrls = [];

            for (const assetName of Object.keys(assets)) {
              if (
                assetName.startsWith("assets/svg/") &&
                assetName.endsWith(".svg")
              ) {
                svgUrls.push("/" + assetName);
              } else if (
                assetName.startsWith("assets/font/") &&
                assetName.endsWith(".ttf")
              ) {
                fontUrls.push("/" + assetName);
              }
            }

            const allAssets = ["/index.html", ...svgUrls, ...fontUrls];
            const source = `const APP_SHELL = ${JSON.stringify(allAssets, null, 2)};\n`;

            compilation.emitAsset(
              "precache-assets.js",
              new sources.RawSource(source),
            );
          },
        );
      },
    );
  }
}
