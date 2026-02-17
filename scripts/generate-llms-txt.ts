export {};

/**
 * Generate llms.txt from multiple mdBook instances
 *
 * Discovers books by scanning for {name}/book.toml at repo root,
 * parses each book's SUMMARY.md to get page hierarchy,
 * reads YAML frontmatter from each page for title and description,
 * and outputs per-book files (docs/<book>/llms.txt, docs/<book>/llms-full.txt)
 * plus global combined files (docs/llms.txt, docs/llms-full.txt).
 *
 * Usage: npx tsx generate-llms-txt.ts
 */

import { readFileSync, writeFileSync, mkdirSync, existsSync } from "fs";
import { join } from "path";
import { globSync } from "glob";
import matter from "gray-matter";

const ROOT_DIR = join(import.meta.dirname, "..");
const OUT_DIR = join(ROOT_DIR, "docs");
const BASE_URL = "https://docs.start9.com";

type Book = {
  name: string;
  label: string;
  srcDir: string;
  summaryPath: string;
};

type SummaryEntry = {
  title: string;
  path: string;
  indent: number;
};

/** Discover all books by finding {name}/book.toml at repo root */
function discoverBooks(): Book[] {
  const bookTomls = globSync("*/book.toml", { cwd: ROOT_DIR });
  const labels: Record<string, string> = {
    startos: "StartOS",
    "start-tunnel": "StartTunnel",
    packaging: "Service Packaging",
  };
  return bookTomls.map((tomlPath) => {
    const name = tomlPath.split("/")[0];
    return {
      name,
      label: labels[name] || name,
      srcDir: join(ROOT_DIR, name, "src"),
      summaryPath: join(ROOT_DIR, name, "src", "SUMMARY.md"),
    };
  });
}

// Parse SUMMARY.md into a flat list of entries with indentation levels
function parseSummary(summaryPath: string): SummaryEntry[] {
  const content = readFileSync(summaryPath, "utf-8");
  const entries: SummaryEntry[] = [];

  for (const line of content.split("\n")) {
    // Match lines like "- [Title](path.md)" or "  - [Title](path.md)"
    const match = line.match(/^(\s*)-\s+\[([^\]]+)\]\(([^)]+)\)/);
    if (!match) continue;

    const indent = match[1].length / 2; // 2-space indentation
    const title = match[2];
    const path = match[3];

    entries.push({ title, path, indent });
  }

  return entries;
}

// Read frontmatter from a markdown file
function readFrontmatter(
  srcDir: string,
  relPath: string
): { title: string; description: string } | null {
  const filePath = join(srcDir, relPath);
  if (!existsSync(filePath)) {
    console.warn(`  Warning: ${relPath} not found`);
    return null;
  }

  try {
    const content = readFileSync(filePath, "utf-8");
    const { data } = matter(content);
    return {
      title: data.title || "",
      description: data.description || "",
    };
  } catch {
    return null;
  }
}

// Convert a markdown path to a URL for a specific book
function pathToUrl(bookName: string, relPath: string): string {
  // README.md -> index.html, foo.md -> foo.html
  const htmlPath = relPath
    .replace(/README\.md$/, "index.html")
    .replace(/\.md$/, ".html");
  return `${BASE_URL}/${bookName}/${htmlPath}`;
}

// Generate llms.txt content for a single book
function generateBookLlmsTxt(book: Book): string {
  const entries = parseSummary(book.summaryPath);
  const lines: string[] = [
    `# ${book.label}`,
    "",
  ];

  // Read the book homepage for a description
  const homeFm = readFrontmatter(book.srcDir, "README.md");
  if (homeFm?.description) {
    lines.push(`> ${homeFm.description}`);
    lines.push("");
  }

  let currentSection = "";

  for (const entry of entries) {
    const fm = readFrontmatter(book.srcDir, entry.path);
    const title = fm?.title || entry.title;
    const description = fm?.description || "";
    const url = pathToUrl(book.name, entry.path);

    if (entry.indent === 0) {
      if (currentSection) lines.push("");
      currentSection = title;
      lines.push(`## ${title}`);
    } else {
      if (description) {
        lines.push(`- [${title}](${url}): ${description}`);
      } else {
        lines.push(`- [${title}](${url})`);
      }
    }
  }

  lines.push("");
  return lines.join("\n");
}

// Generate llms-full.txt content for a single book
function generateBookLlmsFullTxt(book: Book): string {
  const entries = parseSummary(book.summaryPath);
  const parts: string[] = [
    `# ${book.label} — Full Content`,
    "",
  ];

  const homeFm = readFrontmatter(book.srcDir, "README.md");
  if (homeFm?.description) {
    parts.push(`> ${homeFm.description}`);
    parts.push("");
  }

  for (const entry of entries) {
    const filePath = join(book.srcDir, entry.path);
    if (!existsSync(filePath)) continue;

    const raw = readFileSync(filePath, "utf-8");
    const { content, data } = matter(raw);
    const title = data.title || entry.title;
    const body = content.trim();

    if (!body) continue;

    parts.push(`---`);
    parts.push(`## Page: ${title}`);
    if (data.description) {
      parts.push(`> ${data.description}`);
    }
    parts.push("");
    parts.push(body);
    parts.push("");
  }

  return parts.join("\n");
}

// Generate combined llms.txt across all books
function generateGlobalLlmsTxt(books: Book[]): string {
  const lines: string[] = [
    "# Start9 Documentation",
    "",
    `> Documentation for Start9 products including ${books.map((b) => b.label).join(", ")}.`,
    "",
  ];

  for (const book of books) {
    if (!existsSync(book.summaryPath)) continue;

    const entries = parseSummary(book.summaryPath);
    lines.push(`## ${book.label}`);
    lines.push("");

    let currentSection = "";

    for (const entry of entries) {
      const fm = readFrontmatter(book.srcDir, entry.path);
      const title = fm?.title || entry.title;
      const description = fm?.description || "";
      const url = pathToUrl(book.name, entry.path);

      if (entry.indent === 0) {
        if (currentSection) lines.push("");
        currentSection = title;
        lines.push(`### ${title}`);
      } else {
        if (description) {
          lines.push(`- [${title}](${url}): ${description}`);
        } else {
          lines.push(`- [${title}](${url})`);
        }
      }
    }

    lines.push("");
  }

  return lines.join("\n");
}

// Generate combined llms-full.txt across all books
function generateGlobalLlmsFullTxt(books: Book[]): string {
  const parts: string[] = [
    "# Start9 Documentation — Full Content",
    "",
    `> Complete documentation for Start9 products including ${books.map((b) => b.label).join(", ")}.`,
    "",
  ];

  for (const book of books) {
    if (!existsSync(book.summaryPath)) continue;

    const entries = parseSummary(book.summaryPath);
    parts.push(`---`);
    parts.push(`# ${book.label}`);
    parts.push("");

    for (const entry of entries) {
      const filePath = join(book.srcDir, entry.path);
      if (!existsSync(filePath)) continue;

      const raw = readFileSync(filePath, "utf-8");
      const { content, data } = matter(raw);
      const title = data.title || entry.title;
      const body = content.trim();

      if (!body) continue;

      parts.push(`---`);
      parts.push(`## Page: ${title}`);
      if (data.description) {
        parts.push(`> ${data.description}`);
      }
      parts.push("");
      parts.push(body);
      parts.push("");
    }
  }

  return parts.join("\n");
}

function main() {
  console.log("Generating llms.txt...");

  const books = discoverBooks();
  console.log(`  Found ${books.length} book(s): ${books.map((b) => b.name).join(", ")}`);

  // Ensure output directory exists
  if (!existsSync(OUT_DIR)) {
    mkdirSync(OUT_DIR, { recursive: true });
  }

  // Per-book llms.txt and llms-full.txt
  for (const book of books) {
    if (!existsSync(book.summaryPath)) continue;

    const bookOutDir = join(OUT_DIR, book.name);
    if (!existsSync(bookOutDir)) {
      mkdirSync(bookOutDir, { recursive: true });
    }

    const bookLlmsTxt = generateBookLlmsTxt(book);
    const bookLlmsTxtPath = join(bookOutDir, "llms.txt");
    writeFileSync(bookLlmsTxtPath, bookLlmsTxt);
    console.log(`  Wrote ${bookLlmsTxtPath}`);

    const bookLlmsFullTxt = generateBookLlmsFullTxt(book);
    const bookLlmsFullPath = join(bookOutDir, "llms-full.txt");
    writeFileSync(bookLlmsFullPath, bookLlmsFullTxt);
    console.log(`  Wrote ${bookLlmsFullPath} (${(bookLlmsFullTxt.length / 1024).toFixed(0)}KB)`);
  }

  // Global combined llms.txt and llms-full.txt
  const llmsTxt = generateGlobalLlmsTxt(books);
  const llmsTxtPath = join(OUT_DIR, "llms.txt");
  writeFileSync(llmsTxtPath, llmsTxt);
  console.log(`  Wrote ${llmsTxtPath}`);

  const llmsFullTxt = generateGlobalLlmsFullTxt(books);
  const llmsFullPath = join(OUT_DIR, "llms-full.txt");
  writeFileSync(llmsFullPath, llmsFullTxt);
  console.log(`  Wrote ${llmsFullPath} (${(llmsFullTxt.length / 1024).toFixed(0)}KB)`);

  console.log("Done!");
}

main();
