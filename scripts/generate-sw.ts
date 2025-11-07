import { injectManifest } from "workbox-build";
import path from "path";

async function buildSW() {
  const swDest = path.join(__dirname, "../public/sw.js");

  const { count, size, warnings } = await injectManifest({
    swSrc: "workbox/sw-template.js",
    swDest: "public/sw.js",
    globDirectory: "public",
    globPatterns: ["**/*.{html,js,css,png,svg,jpg,jpeg,json,woff2}"],
    modifyURLPrefix: {
      "": "/"
    }
  });

  if (warnings.length) console.warn("⚠️ Workbox warnings:", warnings);
  console.log(
    `✅ Generated sw.js with ${count} files (${(size / 1024).toFixed(1)} KB)`
  );
}

buildSW();
