import { cpSync, mkdirSync, writeFileSync, existsSync } from "fs";

const OUT = ".vercel/output";

mkdirSync(`${OUT}/functions/index.func`, { recursive: true });
mkdirSync(`${OUT}/static`, { recursive: true });

// Static assets
if (existsSync("dist/client")) {
  cpSync("dist/client", `${OUT}/static`, { recursive: true });
}

// Server bundle → function
if (existsSync("dist/server")) {
  cpSync("dist/server", `${OUT}/functions/index.func`, { recursive: true });
}

// Vercel function config — points to the Nitro server entry (web handler format)
writeFileSync(
  `${OUT}/functions/index.func/.vc-config.json`,
  JSON.stringify(
    {
      runtime: "nodejs24.x",
      handler: "index.mjs",
      launcherType: "Nodejs",
      supportsResponseStreaming: true,
    },
    null,
    2
  )
);

// Vercel routing config
writeFileSync(
  `${OUT}/config.json`,
  JSON.stringify(
    {
      version: 3,
      routes: [
        {
          src: "/assets/(.*)",
          headers: { "cache-control": "public, max-age=31536000, immutable" },
          continue: true,
        },
        { handle: "filesystem" },
        { src: "/(.*)", dest: "/index" },
      ],
    },
    null,
    2
  )
);

console.log("✓ .vercel/output created from dist/");
