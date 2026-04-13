import fs from "fs";
import path from "path";
import { glob } from "glob";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

(async () => {
  try {
    const allFiles = await glob("public/assets/**/*", {
      nodir: true,
      absolute: false,
    });

    const assetUrls = allFiles.map((file) => {
      return "/" + file.replace(/\\/g, "/").replace("public/", "");
    });

    const hasIndexHtml = fs.existsSync(
      path.join(__dirname, "../public/index.html"),
    );

    const manifest = {
      version: "1.0.0",
      generatedAt: new Date().toISOString(),
      assets: {
        svg: assetUrls.filter((url) => url.match(/\.svg$/i)),
        images: assetUrls.filter((url) =>
          url.match(/\.(png|jpg|jpeg|gif|webp)$/i),
        ),
        css: assetUrls.filter((url) => url.match(/\.css$/i)),
        js: assetUrls.filter((url) => url.match(/\.js$/i)),
        other: assetUrls.filter(
          (url) =>
            !url.match(
              /\.(svg|png|jpg|jpeg|gif|webp|woff|woff2|ttf|eot|css|js)$/i,
            ),
        ),
      },
    };

    const manifestPath = path.join(__dirname, "../public/assets-manifest.json");
    fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));

    console.log(`Generated assets manifest:`);
    console.log(`   - SVG: ${manifest.assets.svg.length}`);
    console.log(`   - Images: ${manifest.assets.images.length}`);
    console.log(`   - Other: ${manifest.assets.other.length}`);
    console.log(`Manifest saved to: ${manifestPath}`);
  } catch (error) {
    console.error("Error generating manifest:", error);
    process.exit(1);
  }
})();
