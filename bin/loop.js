#!/usr/bin/env node
const fs = require("fs");
const path = require("path");

const TEMPLATES_DIR = path.join(__dirname, "..", "templates");

function main() {
  const args = process.argv.slice(2);
  const cmd = args[0];

  if (cmd !== "init") {
    console.error("Usage: loop init [--path <dir>]");
    console.error("       loop init              # scaffold in current dir");
    console.error("       loop init --path <dir>  # scaffold at specified dir");
    process.exit(1);
  }

  const pathFlagIndex = args.indexOf("--path");
  const targetDir = pathFlagIndex !== -1 && args[pathFlagIndex + 1]
    ? path.resolve(args[pathFlagIndex + 1])
    : process.cwd();

  init(targetDir);
}

function init(targetDir) {
  const loopDir = path.join(targetDir, ".loop");

  if (fs.existsSync(loopDir)) {
    console.error(`Error: ${loopDir} already exists.`);
    process.exit(1);
  }

  const projectName = path.basename(targetDir);
  const date = new Date().toISOString().slice(0, 10);

  // Create .loop directory structure
  fs.mkdirSync(loopDir, { recursive: true });
  fs.mkdirSync(path.join(loopDir, "tasks"), { recursive: true });

  // Template files to generate (order matters for README.loop.md)
  const templates = [
    "MANIFEST.md",
    "SCOPE.md",
    "QUEUE.md",
    "INBOX.md",
    "QA.md",
    "STATUS.md",
    "DECISIONS.md",
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

  // Create COMPLETED.md (archive for general tasks)
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

  // Copy big task detail template into tasks/
  const detailSrc = path.join(TEMPLATES_DIR, "tasks", "_details.md");
  const detailDest = path.join(loopDir, "tasks", "_template.md");
  if (fs.existsSync(detailSrc)) {
    fs.copyFileSync(detailSrc, detailDest);
  }

  // Generate README.loop.md at project root
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
      const filePath = path.join(loopDir, tpl);
      const fileContent = fs.readFileSync(filePath, "utf-8");
      readmeContent += `=== .loop/${tpl} ===\n${fileContent}\n\n`;
    }
    // Also append COMPLETED.md
    const compContent = fs.readFileSync(completedDest, "utf-8");
    readmeContent += `=== .loop/COMPLETED.md ===\n${compContent}\n\n`;

    fs.writeFileSync(readmeDest, readmeContent);
  }

  // Handle .gitignore
  const gitignorePath = path.join(targetDir, ".gitignore");
  const gitignoreEntry = ".loop/";

  if (fs.existsSync(gitignorePath)) {
    const existing = fs.readFileSync(gitignorePath, "utf-8");
    if (!existing.split(/\r?\n/).some(line => line.trim() === gitignoreEntry)) {
      fs.appendFileSync(gitignorePath, `\n# Infinity Loop System\n${gitignoreEntry}\n`);
    }
  } else {
    fs.writeFileSync(gitignorePath, `# Infinity Loop System\n${gitignoreEntry}\n`);
  }

  const fileCount = templates.length + 1; // +1 for COMPLETED.md

  console.log(`✓ Initialized loop system in ${targetDir}`);
  console.log(`  .loop/          — ${fileCount} management files + tasks/ dir`);
  console.log(`  README.loop.md  — copy-paste prompt for your AI agent`);
  console.log(`  .gitignore      — .loop/ added (created if missing)`);
  console.log(``);
  console.log(`Next: open README.loop.md, copy everything, paste as your one prompt.`);
}

main();
