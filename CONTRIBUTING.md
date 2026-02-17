# Contributing

We welcome contributions! Whether you spot a typo or want to suggest new content, fork this repo and submit a PR. If you're not comfortable with that process, [create an issue](https://github.com/Start9Labs/docs/issues) or reach out via our [community channels](https://start9.com/contact).

## Local Setup

1. Install [Rust](https://rustup.rs):

   ```
   curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
   ```

2. Install [mdBook](https://rust-lang.github.io/mdBook/) and [mdbook-tabs](https://github.com/niccoloforlini/mdbook-tabs):

   ```
   cargo install mdbook mdbook-tabs
   ```

3. Install [Node.js](https://nodejs.org/) (v22+) and script dependencies:

   ```
   cd scripts && npm install && cd ..
   ```

4. Clone and serve:

   ```
   git clone https://github.com/Start9Labs/docs.git && cd docs
   ./serve.sh
   ```

   This builds all books and serves at http://localhost:3000. For live-reload while editing a single book:

   ```
   cd startos && mdbook serve -p 3001
   ```

## Writing Docs

All documentation lives under `startos/src/`, `start-tunnel/src/`, or `packaging/src/` as Markdown files. The sidebar for each book is defined by its `src/SUMMARY.md`.

### Frontmatter

Every page requires YAML frontmatter:

```yaml
---
title: "Page Title"
description: "One-sentence summary"
section: "startos/user-manual"
type: "guide"
keywords: [keyword1, keyword2]
---
```

A pre-commit hook auto-syncs `title`, `section`, and `type` from the file's location and content. You must provide `description` and `keywords` — the hook errors if they're missing.

New files without frontmatter get a skeleton added automatically. Fill in the description and keywords, then commit again.

### Admonitions

Use mdBook's built-in admonition syntax:

```markdown
> [!WARNING]
> Do not do this.

> [!NOTE]
> Something helpful.

> [!TIP]
> A useful suggestion.
```

Custom titles are **not supported** — `> [!WARNING] My Title` will break. Put context in the body instead.

### Tabs

Use mdbook-tabs for platform-specific content:

```markdown
{{#tabs global="os"}}
{{#tab name="Linux"}}
Linux instructions here.
{{#endtab}}
{{#tab name="Mac"}}
Mac instructions here.
{{#endtab}}
{{#endtabs}}
```

Avoid nesting tabs — use separate sections with single-level tabs instead.

### Cross-Book Links

Links between books use absolute paths since mdBook only validates intra-book links:

```markdown
See the [StartTunnel docs](/start-tunnel/).
```

Within a book, use relative paths as usual.

## Submitting Changes

1. Fork and create a branch
2. Make your changes
3. The pre-commit hook validates frontmatter — fix any errors it reports
4. Submit a PR against `master`
