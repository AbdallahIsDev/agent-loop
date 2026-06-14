#!/usr/bin/env node
const fs = require("fs");
const path = require("path");
const os = require("os");
const { execSync } = require("child_process");

const TEMPLATES_DIR = path.join(__dirname, "..", "templates");
const INSTALL_DIR = path.join(os.homedir(), ".loop");

function main() {
  const args = process.argv.slice(2);
  const cmd = args[0];

  if (cmd !== "init") {
    console.error("Usage: loop init [--path <dir>] [--force]");
    console.error("       loop init              # scaffold in current dir");
    console.error("       loop init --path <dir>  # scaffold at specified dir");
    console.error("       loop init --force       # overwrite existing .loop/");
    process.exit(1);
  }

  // If running from clone dir (not installed), install first
  if (path.resolve(__dirname, "..") !== INSTALL_DIR) {
    install();
  }

  const force = args.includes("--force");
  const pathFlagIndex = args.indexOf("--path");
  const targetDir = pathFlagIndex !== -1 && args[pathFlagIndex + 1]
    ? path.resolve(args[pathFlagIndex + 1])
    : process.cwd();

  init(targetDir, force);
}

function install() {
  const selfDir = path.resolve(__dirname, "..");

  console.log("Installing loop globally...");

  // Copy all files to ~/.loop/
  if (!fs.existsSync(INSTALL_DIR)) {
    fs.mkdirSync(INSTALL_DIR, { recursive: true });
  }
  copyRecursive(selfDir, INSTALL_DIR, [".git"]);

  // Determine bin dir
  const isWin = process.platform === "win32";
  const binDir = isWin
    ? path.join(os.homedir(), ".local", "bin")
    : path.join(os.homedir(), ".local", "bin");

  if (!fs.existsSync(binDir)) {
    fs.mkdirSync(binDir, { recursive: true });
  }

  // Create launcher
  if (isWin) {
    const launcher = path.join(binDir, "loop.cmd");
    fs.writeFileSync(launcher, `@echo off\nnode "${INSTALL_DIR.replace(/\\/g, "\\\\")}\\bin\\loop.js" %*\n`);
  } else {
    const launcher = path.join(binDir, "loop");
    fs.writeFileSync(launcher, `#!/usr/bin/env bash\nnode "${INSTALL_DIR}/bin/loop.js" "$@"\n`);
    fs.chmodSync(launcher, 0o755);
  }

  // Add to PATH
  if (isWin) {
    const userPath = process.env["PATH"] || "";
    if (!userPath.includes(binDir)) {
      try {
        execSync(
          `[Environment]::SetEnvironmentVariable("Path", [Environment]::GetEnvironmentVariable("Path", "User") + ";${binDir}", "User")`,
          { shell: "powershell" }
        );
      } catch {}
    }
  } else {
    const rcFile = path.join(os.homedir(), ".bashrc");
    const zshRc = path.join(os.homedir(), ".zshrc");
    const line = `export PATH="${binDir}:$PATH"`;
    for (const rc of [rcFile, zshRc]) {
      if (fs.existsSync(rc)) {
        const content = fs.readFileSync(rc, "utf-8");
        if (!content.includes(line)) {
          fs.appendFileSync(rc, `\n# loop CLI\n${line}\n`);
        }
      }
    }
  }

  // Mark installed
  fs.writeFileSync(path.join(INSTALL_DIR, ".installed"), new Date().toISOString());

  console.log("  Installed to " + INSTALL_DIR);
  console.log("  Launcher at " + path.join(binDir, isWin ? "loop.cmd" : "loop"));
  console.log("  You may need to restart your terminal for PATH to update.");
  console.log("  (Or open a new terminal window and `loop init` will work anywhere)");
  console.log("");
}

function copyRecursive(src, dest, exclude = []) {
  const entries = fs.readdirSync(src, { withFileTypes: true });
  for (const entry of entries) {
    if (exclude.includes(entry.name)) continue;
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      fs.mkdirSync(destPath, { recursive: true });
      copyRecursive(srcPath, destPath, exclude);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

function init(targetDir, force) {
  const loopDir = path.join(targetDir, ".loop");

  if (fs.existsSync(loopDir)) {
    if (force) {
      fs.rmSync(loopDir, { recursive: true, force: true });
    } else {
      console.error(`Error: ${loopDir} already exists.`);
      console.error("  Use --force to overwrite with fresh templates.");
      process.exit(1);
    }
  }

  const projectName = path.basename(targetDir);
  const date = new Date().toISOString().slice(0, 10);

  fs.mkdirSync(loopDir, { recursive: true });
  fs.mkdirSync(path.join(loopDir, "tasks"), { recursive: true });

  const templates = [
    "MANIFEST.md", "SCOPE.md", "QUEUE.md", "INBOX.md",
    "QA.md", "STATUS.md", "DECISIONS.md",
  ];

  for (const tpl of templates) {
    const src = path.join(TEMPLATES_DIR, tpl);
    const dest = path.join(loopDir, tpl);

    if (!fs.existsSync(src)) {
      console.error(`Warning: template ${tpl} not found, writing default.`);
      fs.writeFileSync(dest, `# ${tpl.replace(".md", "")}\n\n(auto-generated)\n`);
      continue;
    }

    let content = fs.readFileSync(src, "utf-8");
    content = content
      .replace(/\{\{PROJECT_NAME\}\}/g, projectName)
      .replace(/\{\{PROJECT_ROOT\}\}/g, targetDir.replace(/\\/g, "/"))
      .replace(/\{\{DATE\}\}/g, date);
    fs.writeFileSync(dest, content);
  }

  // COMPLETED.md
  const completedSrc = path.join(TEMPLATES_DIR, "COMPLETED.md");
  const completedDest = path.join(loopDir, "COMPLETED.md");
  if (fs.existsSync(completedSrc)) {
    let content = fs.readFileSync(completedSrc, "utf-8");
    content = content
      .replace(/\{\{PROJECT_NAME\}\}/g, projectName)
      .replace(/\{\{PROJECT_ROOT\}\}/g, targetDir.replace(/\\/g, "/"))
      .replace(/\{\{DATE\}\}/g, date);
    fs.writeFileSync(completedDest, content);
  }

  // tasks/ template
  const detailSrc = path.join(TEMPLATES_DIR, "tasks", "_details.md");
  const detailDest = path.join(loopDir, "tasks", "_template.md");
  if (fs.existsSync(detailSrc)) fs.copyFileSync(detailSrc, detailDest);

  // README.loop.md
  const readmeSrc = path.join(TEMPLATES_DIR, "README.loop.md");
  const readmeDest = path.join(targetDir, "README.loop.md");
  if (fs.existsSync(readmeSrc)) {
    let readmeContent = fs.readFileSync(readmeSrc, "utf-8");
    readmeContent = readmeContent
      .replace(/\{\{PROJECT_NAME\}\}/g, projectName)
      .replace(/\{\{PROJECT_ROOT\}\}/g, targetDir.replace(/\\/g, "/"))
      .replace(/\{\{DATE\}\}/g, date);

    readmeContent += "\n\n";
    for (const tpl of templates) {
      const fp = path.join(loopDir, tpl);
      readmeContent += `=== .loop/${tpl} ===\n${fs.readFileSync(fp, "utf-8")}\n\n`;
    }
    readmeContent += `=== .loop/COMPLETED.md ===\n${fs.readFileSync(completedDest, "utf-8")}\n\n`;
    fs.writeFileSync(readmeDest, readmeContent);
  }

  // .gitignore
  const gitignorePath = path.join(targetDir, ".gitignore");
  const gitignoreEntry = ".loop/";
  if (fs.existsSync(gitignorePath)) {
    const existing = fs.readFileSync(gitignorePath, "utf-8");
    if (!existing.split(/\r?\n/).some(l => l.trim() === gitignoreEntry)) {
      fs.appendFileSync(gitignorePath, `\n# Infinity Loop System\n${gitignoreEntry}\n`);
    }
  } else {
    fs.writeFileSync(gitignorePath, `# Infinity Loop System\n${gitignoreEntry}\n`);
  }

  console.log(`✓ Initialized loop system in ${targetDir}`);
  console.log(`  .loop/          — 8 management files + tasks/ dir`);
  console.log(`  README.loop.md  — copy-paste prompt for your AI agent`);
  console.log(`  .gitignore      — .loop/ added (created if missing)`);
  console.log(``);
  console.log(`Next: open README.loop.md, copy everything, paste as your one prompt.`);
}

main();
