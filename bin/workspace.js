#!/usr/bin/env node
const fs = require("fs");
const path = require("path");
const os = require("os");
const { execSync } = require("child_process");

const TEMPLATES_DIR = path.join(__dirname, "..", "templates");
const INSTALL_DIR = path.join(os.homedir(), ".workspace-cli");

function main() {
  const args = process.argv.slice(2);
  const cmd = args[0];

  if (cmd !== "init") {
    console.error("Usage: ws init [--path <dir>] [--force]");
    console.error("       ws init              # scaffold in current dir");
    console.error("       ws init --path <dir>  # scaffold at specified dir");
    console.error("       ws init --force       # overwrite existing .workspace/");
    process.exit(1);
  }

  // If running from clone dir (not installed), install first
  if (path.resolve(__dirname, "..") !== INSTALL_DIR) {
    install();
  }

  const force = args.includes("--force");
  const pathFlagIndex = args.indexOf("--path");
  const targetDir =
    pathFlagIndex !== -1 && args[pathFlagIndex + 1]
      ? path.resolve(args[pathFlagIndex + 1])
      : process.cwd();

  init(targetDir, force);
}

function install() {
  const selfDir = path.resolve(__dirname, "..");
  console.log("Installing workspace manager globally...");

  // Copy all files to ~/.workspace-cli/
  if (!fs.existsSync(INSTALL_DIR)) {
    fs.mkdirSync(INSTALL_DIR, { recursive: true });
  }
  copyRecursive(selfDir, INSTALL_DIR, [".git"]);

  // Determine bin dir
  const isWin = process.platform === "win32";
  const binDir = path.join(os.homedir(), ".local", "bin");
  if (!fs.existsSync(binDir)) {
    fs.mkdirSync(binDir, { recursive: true });
  }

  // Create launcher
  if (isWin) {
    const launcher = path.join(binDir, "ws.cmd");
    fs.writeFileSync(
      launcher,
      `@echo off\nnode "${INSTALL_DIR.replace(/\\/g, "\\\\")}\\bin\\workspace.js" %*\n`
    );
  } else {
    const launcher = path.join(binDir, "ws");
    fs.writeFileSync(
      launcher,
      `#!/bin/sh\nexec node "${INSTALL_DIR}/bin/workspace.js" "$@"\n`
    );
    fs.chmodSync(launcher, 0o755);
  }

  // Add to PATH if needed
  addToPath(binDir, isWin);
  console.log("Done. Run 'ws init' from any project directory.");
}

function addToPath(binDir, isWin) {
  try {
    if (isWin) {
      const currentPath = process.env.PATH || "";
      if (!currentPath.includes(binDir)) {
        console.log(
          `Please add ${binDir} to your PATH manually, or restart your terminal.`
        );
      }
    } else {
      const shellRc = getShellRc();
      if (shellRc) {
        const exportLine = `export PATH="${binDir}:$PATH"`;
        const rcContent = fs.existsSync(shellRc)
          ? fs.readFileSync(shellRc, "utf-8")
          : "";
        if (!rcContent.includes(binDir)) {
          fs.appendFileSync(shellRc, `\n# Workspace CLI\n${exportLine}\n`);
          console.log(`Added ${binDir} to PATH in ${shellRc}. Restart shell or run: source ${shellRc}`);
        }
      }
    }
  } catch (e) {
    // Silent fail - PATH update is best-effort
  }
}

function getShellRc() {
  const shell = process.env.SHELL || "";
  const home = os.homedir();
  if (shell.includes("zsh")) return path.join(home, ".zshrc");
  if (shell.includes("bash")) return path.join(home, ".bashrc");
  return path.join(home, ".profile");
}

function copyRecursive(src, dest, exclude = []) {
  if (!fs.existsSync(src)) return;
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
  const wsDir = path.join(targetDir, ".workspace");
  if (fs.existsSync(wsDir)) {
    if (force) {
      fs.rmSync(wsDir, { recursive: true, force: true });
    } else {
      console.error(`Error: ${wsDir} already exists.`);
      console.error("  Use --force to overwrite with fresh templates.");
      process.exit(1);
    }
  }

  const projectName = path.basename(targetDir);
  const date = new Date().toISOString().slice(0, 10);

  fs.mkdirSync(wsDir, { recursive: true });
  fs.mkdirSync(path.join(wsDir, "tasks"), { recursive: true });
  fs.mkdirSync(path.join(wsDir, "archive"), { recursive: true });

  const templates = [
    "guide.md",
    "briefing.md",
    "boundaries.md",
    "todo.md",
    "inbox.md",
    "questions.md",
    "status.md",
    "decisions.md",
    "notes.md",
  ];

  for (const tpl of templates) {
    const src = path.join(TEMPLATES_DIR, tpl);
    const dest = path.join(wsDir, tpl);
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

  // done.md
  const doneSrc = path.join(TEMPLATES_DIR, "done.md");
  const doneDest = path.join(wsDir, "done.md");
  if (fs.existsSync(doneSrc)) {
    let content = fs.readFileSync(doneSrc, "utf-8");
    content = content
      .replace(/\{\{PROJECT_NAME\}\}/g, projectName)
      .replace(/\{\{PROJECT_ROOT\}\}/g, targetDir.replace(/\\/g, "/"))
      .replace(/\{\{DATE\}\}/g, date);
    fs.writeFileSync(doneDest, content);
  }

  // tasks/ template
  const detailSrc = path.join(TEMPLATES_DIR, "tasks", "_details.md");
  const detailDest = path.join(wsDir, "tasks", "_template.md");
  if (fs.existsSync(detailSrc)) fs.copyFileSync(detailSrc, detailDest);

  // README.ws.md - the prompt file
  const readmeSrc = path.join(TEMPLATES_DIR, "prompt.md");
  const readmeDest = path.join(targetDir, "README.ws.md");
  if (fs.existsSync(readmeSrc)) {
    let readmeContent = fs.readFileSync(readmeSrc, "utf-8");
    readmeContent = readmeContent
      .replace(/\{\{PROJECT_NAME\}\}/g, projectName)
      .replace(/\{\{PROJECT_ROOT\}\}/g, targetDir.replace(/\\/g, "/"))
      .replace(/\{\{DATE\}\}/g, date);
    fs.writeFileSync(readmeDest, readmeContent);
  }

  // .gitignore
  const gitignorePath = path.join(targetDir, ".gitignore");
  const gitignoreEntries = [".workspace/", "README.ws.md"];
  const gitignoreHeader = "\n# Workspace Manager\n";
  if (fs.existsSync(gitignorePath)) {
    const existing = fs.readFileSync(gitignorePath, "utf-8");
    const missingEntries = gitignoreEntries.filter(
      (entry) => !existing.split(/\r?\n/).some((l) => l.trim() === entry)
    );
    if (missingEntries.length > 0) {
      fs.appendFileSync(
        gitignorePath,
        `${gitignoreHeader}${missingEntries.join("\n")}\n`
      );
    }
  } else {
    fs.writeFileSync(
      gitignorePath,
      `# Workspace Manager\n${gitignoreEntries.join("\n")}\n`
    );
  }

  console.log(`Initialized workspace in ${targetDir}`);
  console.log(`  .workspace/      — management files + tasks/ + archive/ dirs`);
  console.log(`  README.ws.md     — copy-paste prompt for your AI assistant`);
  console.log(`  .gitignore       — .workspace/ added`);
}

main();
