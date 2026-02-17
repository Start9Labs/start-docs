#!/usr/bin/env npx tsx
/**
 * Pre-commit hook: validates and auto-syncs YAML frontmatter on all docs pages.
 *
 * Discovers books dynamically by scanning for {name}/book.toml at repo root.
 *
 * Auto-syncs (deterministic fields):
 *   - title: from the first H1 heading
 *   - section: from the book name + top-level directory (e.g., "startos/user-manual")
 *   - type: "index" for README.md, "guide" for everything else
 *
 * Validates (human-written fields):
 *   - description: must exist and be non-empty
 *   - keywords: must exist and be a non-empty array
 *
 * For new files with no frontmatter: adds skeleton frontmatter with
 * auto-synced fields and placeholder description/keywords, then errors
 * so the author can fill them in.
 */

import { readFileSync, writeFileSync, existsSync } from "fs"
import { basename, join } from "path"
import { globSync } from "glob"
import matter from "gray-matter"

const ROOT_DIR = join(import.meta.dirname, "..")

/** Discover all books by finding {name}/book.toml at repo root */
function discoverBooks(): { name: string; srcDir: string; summaryPath: string }[] {
  const bookTomls = globSync("*/book.toml", { cwd: ROOT_DIR })
  return bookTomls.map((tomlPath) => {
    const name = tomlPath.split("/")[0]
    const srcDir = join(ROOT_DIR, name, "src")
    const summaryPath = join(srcDir, "SUMMARY.md")
    return { name, srcDir, summaryPath }
  })
}

/** Parse SUMMARY.md to get the list of all pages in the book */
function getPagesFromSummary(summaryPath: string): string[] {
  const content = readFileSync(summaryPath, "utf-8")
  const pages: string[] = []
  const linkRegex = /\[.*?\]\((.+?\.md)\)/g
  let match: RegExpExecArray | null
  while ((match = linkRegex.exec(content)) !== null) {
    pages.push(match[1])
  }
  return pages
}

function extractTitle(content: string): string {
  const match = content.match(/^#\s+(.+)$/m)
  return match ? match[1].trim() : ""
}

function getSection(bookName: string, relPath: string): string {
  const parts = relPath.split("/")
  if (parts.length === 1) return bookName
  return `${bookName}/${parts[0]}`
}

function getType(relPath: string): string {
  return basename(relPath) === "README.md" ? "index" : "guide"
}

/**
 * Replace a single frontmatter field value using regex, preserving YAML style.
 * Handles both quoted and unquoted string values.
 */
function replaceFmField(raw: string, field: string, newValue: string): string {
  const escaped = newValue.replace(/"/g, '\\"')
  const pattern = new RegExp(`^(${field}:\\s*)(?:"[^"]*"|'[^']*'|[^\\n]*)`, "m")
  return raw.replace(pattern, `$1"${escaped}"`)
}

function main() {
  const books = discoverBooks()

  if (books.length === 0) {
    console.error("No books found (no */book.toml files)")
    process.exit(1)
  }

  let totalPages = 0
  let modified = 0
  const errors: string[] = []

  for (const book of books) {
    if (!existsSync(book.summaryPath)) {
      errors.push(`${book.name}: SUMMARY.md not found`)
      continue
    }

    console.log(`Validating ${book.name}...`)
    const pages = getPagesFromSummary(book.summaryPath)
    totalPages += pages.length

    for (const page of pages) {
      const filePath = join(book.srcDir, page)
      const displayPath = `${book.name}/${page}`
      let raw: string
      try {
        raw = readFileSync(filePath, "utf-8")
      } catch {
        errors.push(`${displayPath}: file not found`)
        continue
      }

      const hasFrontmatter = raw.startsWith("---\n")

      if (!hasFrontmatter) {
        const title = extractTitle(raw)
        const section = getSection(book.name, page)
        const type = getType(page)

        const skeleton = [
          "---",
          `title: "${title.replace(/"/g, '\\"')}"`,
          `description: "TODO: Add a one-sentence description"`,
          `section: "${section}"`,
          `type: "${type}"`,
          `keywords: []`,
          "---",
          "",
        ].join("\n")
        writeFileSync(filePath, skeleton + raw)
        errors.push(`${displayPath}: added skeleton frontmatter — fill in description and keywords`)
        modified++
        continue
      }

      // Parse frontmatter to read values
      const { data: fm, content } = matter(raw)
      const title = extractTitle(content) || extractTitle(raw)
      const section = getSection(book.name, page)
      const type = getType(page)

      // Auto-sync deterministic fields using regex replacement (preserves formatting)
      let updated = raw
      let changed = false

      if (title && fm.title !== title) {
        updated = replaceFmField(updated, "title", title)
        changed = true
      }

      if (fm.section !== section) {
        updated = replaceFmField(updated, "section", section)
        changed = true
      }

      if (fm.type !== type) {
        updated = replaceFmField(updated, "type", type)
        changed = true
      }

      // Validate human-written fields
      if (!fm.description || fm.description === "TODO: Add a one-sentence description") {
        errors.push(`${displayPath}: missing or placeholder description`)
      }

      if (!fm.keywords || !Array.isArray(fm.keywords) || fm.keywords.length === 0) {
        errors.push(`${displayPath}: missing or empty keywords`)
      }

      if (changed) {
        writeFileSync(filePath, updated)
        modified++
      }
    }
  }

  if (modified > 0) {
    console.log(`Frontmatter: auto-synced ${modified} file(s)`)
  }

  if (errors.length > 0) {
    console.error("\nFrontmatter validation errors:")
    for (const err of errors) {
      console.error(`  - ${err}`)
    }
    process.exit(1)
  }

  console.log(`Frontmatter: all ${totalPages} pages across ${books.length} book(s) valid`)
}

main()
