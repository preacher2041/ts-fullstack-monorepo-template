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

## 2. Configure Git Sync (Project Level)

In modern Kong Insomnia (v8+ / v9+ / v10+), Git Sync is set up at the **Project level** in the dashboard, rather than per individual workspace or collection.

### Step A: Link your Git Repository to an Insomnia Project

1. Open **Insomnia** to the main dashboard.
2. Click your current project name in the top-left corner and select **Project Settings** (or click **Create** -> **Project** to create a new dedicated project).
3. In the settings pane, locate the **Type** dropdown and select **Git Sync**.
4. Fill out the Git Repository configurations:
   - **Repository URI**: Paste the SSH or HTTPS URL of your remote Git repository (e.g. `git@github.com:preacher2041/ts-fullstack-monorepo-template.git`).
   - **Auth Credentials**: Paste your GitHub Personal Access Token (PAT) with `repo` scope. (Alternatively, you can manage this globally in Insomnia via **Preferences > Credentials**).
5. Click **Update** or **Save**.

---

## 3. Import the OpenAPI Spec

Once your Project is configured to sync with Git, any documents or collections created inside it are automatically synced to the repository.

1. Ensure you are inside your newly linked **Git Sync Project** in the Insomnia dashboard.
2. Click **Create** or **+** and select **Import** -> **From File**.
3. Browse and select the `apps/api/openapi-spec.json` file in your local monorepo directory.
4. Choose **Design Document** as the import target:
   - _Recommended_: **Design Document**. This mounts the OpenAPI spec in the Insomnia editor, automatically generating interactive request templates for all endpoints (Auth and Users) under the **Debug** tab.

### Step B: Syncing and Version Control

1. Open your imported Design Document.
2. Look for the Git branch selector in the top menu or side panel and select your active working branch (e.g., `leehitchcock2041/p2041-46-...` or `main`).
3. Click the **Sync** button. Insomnia will serialize your collection metadata and environments, saving them directly into your local Git repository folder.
4. You can now use the Insomnia UI to **Commit**, **Push**, and **Pull** API changes alongside your source code!

---

## 4. Troubleshooting & Best Practices

- **Merge Conflicts**: Since Insomnia v12.6.0+, collections are saved using standard git layouts. If you encounter a merge conflict inside your collections, resolve it directly in Insomnia or use standard git commands (like `git status` or `git checkout --ours`) in your CLI.
- **Sensitive Credentials**: Never commit API keys, session secrets, or passwords directly to Git. Always store credentials in **Insomnia Environment Variables** marked as _Private_ or _Local_, which are excluded from the git-synced YAML profiles.
