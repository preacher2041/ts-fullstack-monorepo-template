# Insomnia Integration & Git Sync Guide

This guide outlines how to import our auto-generated OpenAPI specification into Insomnia and configure **Git Sync** to keep your API request collections dynamically synchronized with the monorepo codebase.

---

## 1. Locate the OpenAPI Specification

Our backend automatically compiles and serializes the complete API schema to the following location in the monorepo:

- **JSON File**: `apps/api/openapi-spec.json`

Ensure you have generated the latest spec before importing by running this command in the monorepo root:

```bash
pnpm openapi:generate
```

---

## 2. Import into Insomnia

To load the OpenAPI spec as a structured, interactive Design Document in Insomnia:

1. Open **Insomnia**.
2. Click on the **Create** or **+** button in your dashboard.
3. Select **Import** -> **From File**.
4. Browse and select the `apps/api/openapi-spec.json` file in your local workspace.
5. Choose **Design Document** or **Request Collection** as the import target:
   - _Recommended_: Select **Design Document**. This parses the OpenAPI file, mounts it inside the Insomnia editor, and automatically populates the **Debug** tab with pre-configured requests for every endpoint (Auth and Users).

---

## 3. Configure Git Sync

Git Sync allows Insomnia to store your workspace metadata, collections, and environments directly inside this repository as YAML files, making them easily shareable and version-controlled.

### Step A: Initialize Git Sync in Insomnia

1. Open your imported Design Document workspace in Insomnia.
2. In the top-right corner of the interface, click on **Setup Git Sync**.
3. Fill out the Git Repository configurations:
   - **Git URI**: Paste the SSH or HTTPS URL of your remote Git repository (e.g. `git@github.com:preacher2041/ts-fullstack-monorepo-template.git`).
   - **Author Name**: Your name (e.g. `Lee Hitchcock`).
   - **Author Email**: Your email (e.g. `lee.hitchcock2041@gmail.com`).
   - **Auth Token / Password**: Paste your GitHub Personal Access Token (PAT) with `repo` scope.
4. Click **Link Repository**.

### Step B: Branching & Synchronizing

1. Select your active working branch (e.g., `leehitchcock2041/p2041-44-set-up-orval...` or `main`).
2. Click the **Sync** button in the Git Sync panel.
3. Insomnia will serialize your environment configurations and collections, saving them to the repository's git index.
4. You can now use the Insomnia UI to **Commit**, **Push**, and **Pull** API collection updates directly to/from the Git remote!

---

## 4. Troubleshooting & Best Practices

- **Merge Conflicts**: Since Insomnia v12.6.0+, collections are saved using standard git layouts. If you encounter a merge conflict inside your collections, resolve it directly in Insomnia or use standard git commands (like `git status` or `git checkout --ours`) in your CLI.
- **Sensitive Credentials**: Never commit API keys, session secrets, or passwords directly to Git. Always store credentials in **Insomnia Environment Variables** marked as _Private_ or _Local_, which are excluded from the git-synced YAML profiles.
