#!/usr/bin/env node

/**
 * mdBook preprocessor that strips YAML frontmatter from chapters.
 *
 * mdBook does not natively support YAML frontmatter — it renders the
 * content between --- delimiters as visible text. This preprocessor
 * removes frontmatter before rendering while preserving it on disk
 * for the indexing pipeline and llms.txt generation.
 *
 * Usage in book.toml:
 *   [preprocessor.strip-frontmatter]
 *   command = "node scripts/mdbook-strip-frontmatter.mjs"
 */

import { readFileSync } from "fs";

// Handle "supports" check
if (process.argv[2] === "supports") {
  process.exit(0); // supports all renderers
}

// Read [context, book] JSON from stdin
const input = readFileSync(0, "utf-8");
const [_context, book] = JSON.parse(input);

function stripFrontmatter(content) {
  if (!content.startsWith("---")) return content;
  const end = content.indexOf("\n---", 3);
  if (end === -1) return content;
  return content.slice(end + 4).replace(/^\n+/, "");
}

function processItems(items) {
  if (!Array.isArray(items)) return;
  for (const item of items) {
    if (item && item.Chapter) {
      item.Chapter.content = stripFrontmatter(item.Chapter.content);
      processItems(item.Chapter.sub_items);
    }
  }
}

// mdBook v0.5.x uses "items", older versions use "sections"
processItems(book.items || book.sections);
process.stdout.write(JSON.stringify(book));
