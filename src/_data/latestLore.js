// Powers the homepage Lore card's teaser paragraph: at build time, finds
// whichever src/lore/**/*.md entry was most recently touched and surfaces
// its opening line, so the homepage always fronts the newest lore without
// anyone having to edit src/index.md by hand.
const fs = require("fs");
const path = require("path");
const { execFileSync } = require("child_process");
const matter = require("gray-matter");
const { getContentFilter, isTopicPageIncluded } = require("../../lib/content-filter");

const REPO_ROOT = path.join(__dirname, "..", "..");
const LORE_DIR = path.join(__dirname, "..", "lore");

function findMarkdownFiles(dir) {
  let results = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results = results.concat(findMarkdownFiles(fullPath));
    } else if (entry.isFile() && entry.name.endsWith(".md") && entry.name !== "index.md" && entry.name !== "README.md") {
      results.push(fullPath);
    }
  }
  return results;
}

// Git's last-commit time for the file, when it has one. A working-tree edit
// that hasn't been committed yet has no such entry - the caller falls back
// to filesystem mtime for that case, which is always at least as recent.
function lastCommitDate(filePath) {
  try {
    const out = execFileSync("git", ["log", "-1", "--format=%cI", "--", filePath], {
      cwd: REPO_ROOT,
      encoding: "utf8"
    }).trim();
    return out ? new Date(out) : null;
  } catch {
    return null;
  }
}


// Inline Markdown to plain words. Deliberately not a Markdown renderer:
// only the constructs that actually turn up mid-paragraph in this corpus.
function stripInlineMarkdown(text) {
  return text
    .replace(/!\[([^\]]*)\]\([^)]*\)/g, "$1")   // images -> alt text
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")    // links  -> label
    .replace(/`([^`]+)`/g, "$1")                  // code spans
    .replace(/\*\*([^*]+)\*\*/g, "$1")            // bold
    .replace(/(^|[^*])\*([^*]+)\*/g, "$1$2")      // italic
    .replace(/(^|[^_])_([^_]+)_/g, "$1$2");        // underscore italic
}

function firstParagraph(body) {
  const blocks = body.split(/\r?\n\s*\r?\n/).map((b) => b.trim()).filter(Boolean);
  for (const block of blocks) {
    if (/^#{1,6}\s/.test(block)) continue;
    if (/^!\[/.test(block)) continue;
    if (/^\[.+\]:\s/.test(block)) continue;
    // The excerpt is interpolated into src/index.md as plain text, so any
    // Markdown left in it renders literally - the homepage was showing raw
    // [label](/url) syntax and bare asterisks. Strip inline markup to its
    // words rather than converting to HTML: this string is a teaser inside
    // a sentence that already links to the entry, so nested links would be
    // noise, and keeping it plain means it can never inject markup.
    return stripInlineMarkdown(block).replace(/\s+/g, " ");
  }
  return "";
}

module.exports = function () {
  const filter = getContentFilter();
  let latest = null;

  for (const filePath of findMarkdownFiles(LORE_DIR)) {
    const raw = fs.readFileSync(filePath, "utf8");
    const { data, content } = matter(raw);
    if (!data.title || !isTopicPageIncluded(data, filter)) continue;

    const commitDate = lastCommitDate(filePath);
    const mtime = fs.statSync(filePath).mtime;
    const updated = commitDate && commitDate > mtime ? commitDate : mtime;

    if (latest && updated <= latest.updated) continue;

    // path.relative returns backslashes on Windows, and they went straight
    // into the href - local builds emitted /lore\entry/ . Production never
    // saw it because the deploy hosts are Linux, which is exactly why it
    // survived: the one platform that renders it wrong is the one the site
    // is authored on, and the one that renders it right is the one nobody
    // reads the output of.
    const relUrl = "/" + path.relative(path.join(REPO_ROOT, "src"), filePath)
      .split(path.sep).join("/")
      .replace(/\.md$/, "") + "/";
    latest = {
      updated,
      title: data.title,
      excerpt: firstParagraph(content),
      url: relUrl
    };
  }

  return latest;
};
