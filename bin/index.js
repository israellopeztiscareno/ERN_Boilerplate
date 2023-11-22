#!/usr/bin/env node

// Use CLI to generate boilerplate: npx ern-boilerplate

const { execSync } = require("child_process");
const path = require("path");
const fs = require("fs");

if (process.argv.length < 3) {
  console.log("You have to provide a name to your app.");
  console.log("For example: npx ern-boilerplate");
  process.exit(1);
}

const projectName = process.argv[2];
const currentPath = process.cwd();
const projectPath = path.join(currentPath, projectName);
const PAT = "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";
const gitRepo =
  "https://" + PAT + "@github.com/israellopeztiscareno/ERN_Boilerplate.git";

try {
  fs.mkdirSync(projectPath);
} catch (err) {
  if (err.code === "EEXIST") {
    console.log(
      `The folder ${projectName} already exist in the current directory, please give it another name.`,
    );
  } else {
    console.log(err);
  }
  process.exit(1);
}

async function main() {
  try {
    console.log(`Generating the project ${projectName}...`);
    console.log("[1] Downloading starter project...");
    execSync(`git clone "${gitRepo}" "${projectPath}"`);

    process.chdir(projectPath);

    console.log("[2] Removing useless files");
    execSync("npx rimraf ./.git");
    await fs.rmSync(path.join(projectPath, "bin"), { recursive: true });

    console.log("[3] Initializing git...");
    execSync("git init");

    console.log(
      "[4] Installing dependencies (maybe it will take some time)...",
    );
    execSync("npm");

    console.log("🚀 The installation is done, now ready to use!");
  } catch (error) {
    console.log(error);
    console.log("\nGenerating starter project failed due to the error above.");
  }
}

main();
