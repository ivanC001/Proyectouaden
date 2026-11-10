const fs = require("node:fs");
const path = require("node:path");

const root = __dirname;
const dist = path.join(root, "dist");
const client = path.join(dist, "client");
const server = path.join(dist, "server");

fs.rmSync(dist, { recursive: true, force: true });
fs.mkdirSync(client, { recursive: true });
fs.mkdirSync(server, { recursive: true });

for (const file of ["index.html"]) {
  fs.copyFileSync(path.join(root, file), path.join(client, file));
}

for (const directory of ["css", "js"]) {
  fs.cpSync(path.join(root, directory), path.join(client, directory), {
    recursive: true,
  });
}

fs.cpSync(path.join(root, "assets"), path.join(client, "assets"), {
  recursive: true,
});

fs.copyFileSync(path.join(root, "worker.js"), path.join(server, "index.js"));

fs.writeFileSync(
  path.join(server, "wrangler.json"),
  JSON.stringify(
    {
      name: "uaden-conferencista-pro",
      main: "index.js",
      compatibility_date: "2026-07-29",
      assets: {
        directory: "../client",
        binding: "ASSETS",
      },
      no_bundle: true,
    },
    null,
    2,
  ),
);

console.log("Landing compilada en dist/.");
