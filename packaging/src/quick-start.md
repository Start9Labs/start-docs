# Quick Start

This guide walks you through creating your own service package repository from the [Hello World](https://github.com/Start9Labs/hello-world-startos) template, building it, and installing it on StartOS.

> [!NOTE]
> Ensure you have completed every step of [Environment Setup](./environment-setup.md) before beginning.

## Create Your Repository

{{#tabs global="git-method"}}

{{#tab name="GitHub Template"}}

1. Navigate to the [Hello World Template](https://github.com/Start9Labs/hello-world-startos) on GitHub.

1. Click **"Use this template > Create new repository"**.

   ![use Github template](./assets/use-github-template.png)

1. Name your repository using the convention `<service-name>-startos` (e.g., `nextcloud-startos`).

1. Click **"Create Repository"**.

1. Clone your new repository:

   ```sh
   git clone https://github.com/YOUR-USERNAME/YOUR-REPO.git
   cd YOUR-REPO
   ```

{{#endtab}}

{{#tab name="Manual Setup"}}

Clone the template, then re-initialize it as your own repository:

```sh
git clone --depth 1 https://github.com/Start9Labs/hello-world-startos.git my-service-startos
cd my-service-startos
rm -rf .git
git init
git add .
git commit -m "Initial commit from hello-world template"
```

You can then push to any git hosting provider of your choice.

{{#endtab}}

{{#endtabs}}

## Build

Install dependencies and build the package:

```sh
npm install
make
```

This generates a `hello-world.s9pk` file in the project root.

## Install to StartOS

### Option 1: Sideload via UI

Open the `Sideload` tab and upload the `.s9pk`.

### Option 2: Direct Install (Local Network)

See [Installation](./makefile.md#installation).

## Next Steps

With Hello World running on your server, explore the rest of this packaging guide to learn how to build your own service.
