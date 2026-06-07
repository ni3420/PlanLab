<h1 align="center">PlanLab</h1>
> A team management workspace built with Next.js and Hono.

![GitHub stars](https://img.shields.io/github/stars/ni3420/PlanLab?style=for-the-badge&logo=github) ![GitHub forks](https://img.shields.io/github/forks/ni3420/PlanLab?style=for-the-badge&logo=github) ![GitHub issues](https://img.shields.io/github/issues/ni3420/PlanLab?style=for-the-badge&logo=github) ![Last commit](https://img.shields.io/github/last-commit/ni3420/PlanLab?style=for-the-badge&logo=github) ![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white) ![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white) ![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)

---

## 📝 Description

PlanLab is a team-oriented management application designed to coordinate collaboration and streamline tasks. Built with Next.js and TypeScript, the application is tailored to serve as a centralized hub for managing team efforts, organizing operational workflows, and tracking goals.

## 📑 Table of Contents

- [Description](#-description)
- [Key Features](#-key-features)
- [Use Cases](#-use-cases)
- [Tech Stack](#-tech-stack)
- [Quick Start](#-quick-start)
- [Configuration](#-configuration)
- [Key Dependencies](#-key-dependencies)
- [Available Scripts](#-available-scripts)
- [API Endpoints](#-api-endpoints)
- [Project Structure](#-project-structure)
- [Development Setup](#-development-setup)
- [Contributing](#-contributing)

---

## ✨ Key Features

- **🔥 Hono API Layer** — Utilizes Hono for high-performance and predictable API route management within the full-stack architecture.
- **🛡️ Type-Safe Forms and Validation** — Integrates Zod with React Hook Form to ensure strict client-side and API payload verification.
- **🔄 Asynchronous Data Fetching** — Employs TanStack Query for efficient client-side data caching, background updating, and state synchronization.
- **🎨 Tailwind and Theme Management** — Features a responsive design styled with Tailwind CSS alongside a dynamic ThemeProvider for custom appearance toggles.
- **🔔 Sonner Toast Notifications** — Incorporates a toaster component to deliver real-time, lightweight user notifications and alerts.

## 🎯 Use Cases

- Establishing a centralized task and team management dashboard for collaborative workspaces.
- Serving as a full-stack template combining Next.js App Router with Hono API endpoints and React Hook Form validation.

## 🛠️ Tech Stack

- ▲ **Next.js**
- 🌬️ **Tailwind CSS**
- 📘 **TypeScript**

**Notable libraries:** Hono, React Hook Form, TanStack Query, Zod

---

## ⚡ Quick Start

```bash
# 1. Clone the repository
git clone https://github.com/ni3420/PlanLab.git

# 2. Install dependencies
npm install

# 3. Start the dev server
npm run dev
```

---

## ⚙️ Configuration

Since this application uses Appwrite integration (as indicated by `node-appwrite` and the `src/appwrite` directories), you will need to set up your environment variables.

```bash
# Create an environment variables file
touch .env.local
```

<!-- TODO: Add your Appwrite and project environment variables below -->
```env
# Example environment variables placeholder
# NEXT_PUBLIC_APPWRITE_ENDPOINT=""
# NEXT_PUBLIC_APPWRITE_PROJECT=""
# APPWRITE_API_KEY=""
```

---

## 📦 Key Dependencies

These are the major packages and version alignments utilized in the project:

```json
{
  "@hello-pangea/dnd": "^18.0.1",
  "@hono/zod-validator": "^0.8.0",
  "@hookform/resolvers": "^5.4.0",
  "@tanstack/react-query": "^5.100.14",
  "class-variance-authority": "^0.7.1",
  "clsx": "^2.1.1",
  "date-fns": "^4.4.0",
  "hono": "^4.12.23",
  "lucide-react": "^1.17.0",
  "next": "16.2.7",
  "next-themes": "^0.4.6",
  "node-appwrite": "^26.0.0",
  "radix-ui": "^1.4.3",
  "react": "19.2.4",
  "react-day-picker": "^10.0.1"
}
```

---

## 🚀 Available Scripts

Inside the project directory, you can run the following commands:

- `npm run dev` — Starts the development server.
- `npm run build` — Compiles the production build.
- `npm run start` — Runs the compiled production-ready server.
- `npm run lint` — Analyzes and flags code issues using ESLint.

---

## 🌐 API Endpoints

Detected endpoints (best-effort scan):

```http
GET/POST/PUT/DELETE /api/[[...routes]]
```

---

## 📁 Project Structure

<details>
<summary>Click to view the complete repository folder tree</summary>

```
.
├── AGENTS.md
├── CLAUDE.md
├── bun.lock
├── components.json
├── eslint.config.mjs
├── next.config.ts
├── package.json
├── postcss.config.mjs
├── public
│   ├── file.svg
│   ├── globe.svg
│   ├── img.svg
│   ├── next.svg
│   ├── vercel.svg
│   └── window.svg
├── src
│   ├── app
│   │   ├── (auth)
│   │   │   ├── login
│   │   │   │   └── page.tsx
│   │   │   └── register
│   │   │       └── page.tsx
│   │   ├── (dashboard)
│   │   │   ├── layout.tsx
│   │   │   └── workspace
│   │   │       ├── [workspaceId]
│   │   │       │   └── ...
│   │   │       └── page.tsx
│   │   ├── api
│   │   │   └── [[...routes]]
│   │   │       └── route.ts
│   │   ├── favicon.ico
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── appwrite
│   │   ├── adminclient.ts
│   │   ├── middleware.ts
│   │   └── types.ts
│   ├── components
│   │   ├── form.tsx
│   │   ├── mobile-sidebar.tsx
│   │   └── ui
│   │       ├── avatar.tsx
│   │       ├── button.tsx
│   │       ├── calendar.tsx
│   │       ├── card.tsx
│   │       ├── dialog.tsx
│   │       ├── drawer.tsx
│   │       ├── dropdown-menu.tsx
│   │       ├── input.tsx
│   │       ├── label.tsx
│   │       ├── menubar.tsx
│   │       ├── popover.tsx
│   │       ├── scroll-area.tsx
│   │       ├── select.tsx
│   │       ├── sheet.tsx
│   │       ├── skeleton.tsx
│   │       ├── sonner.tsx
│   │       ├── table.tsx
│   │       └── textarea.tsx
│   ├── config
│   │   └── conf.ts
│   ├── features
│   │   ├── auth
│   │   │   ├── Schema.ts
│   │   │   ├── api
│   │   │   │   ├── use-currentuser.tsx
│   │   │   │   ├── use-login.tsx
│   │   │   │   ├── use-logout.tsx
│   │   │   │   └── use-register.tsx
│   │   │   ├── components
│   │   │   │   ├── LoginCard.tsx
│   │   │   │   ├── ProtectedRoutes.tsx
│   │   │   │   ├── RegisterCard.tsx
│   │   │   │   └── userButton.tsx
│   │   │   └── server
│   │   │       └── route.ts
│   │   ├── dashboard
│   │   │   └── components
│   │   │       ├── navbar.tsx
│   │   │       ├── sidebar.tsx
│   │   │       ├── toggle-button.tsx
│   │   │       ├── workpaceAnalytics.tsx
│   │   │       └── workspace-switcher.tsx
│   │   ├── member
│   │   │   ├── Schema.ts
│   │   │   ├── api
│   │   │   │   ├── use-deletemember.tsx
│   │   │   │   ├── use-getmembers.tsx
│   │   │   │   └── use-updatemember.tsx
│   │   │   ├── components
│   │   │   │   ├── joinwrapper.tsx
│   │   │   │   ├── memberList.tsx
│   │   │   │   └── memberinvitioncard.tsx
│   │   │   └── server
│   │   │       └── route.ts
│   │   ├── projects
│   │   │   ├── Schema.ts
│   │   │   ├── api
│   │   │   │   ├── use-createproject.tsx
│   │   │   │   ├── use-deleteproject.tsx
│   │   │   │   ├── use-getAllprojects.tsx
│   │   │   │   ├── use-getproject.tsx
│   │   │   │   └── use-updateproject.tsx
│   │   │   ├── components
│   │   │   │   ├── ListProject.tsx
│   │   │   │   ├── createprojectform.tsx
│   │   │   │   ├── creatprojectmodel.tsx
│   │   │   │   ├── projectinfo.tsx
│   │   │   │   └── updateprojectform.tsx
│   │   │   └── server
│   │   │       └── route.ts
│   │   ├── tasks
│   │   │   ├── Schema.ts
│   │   │   ├── api
│   │   │   │   ├── use-bulkupdate.tsx
│   │   │   │   ├── use-createtask.tsx
│   │   │   │   ├── use-deleteTask.tsx
│   │   │   │   ├── use-getAllTasks.tsx
│   │   │   │   └── use-updatetask.tsx
│   │   │   ├── components
│   │   │   │   ├── CreateDirectModel.tsx
│   │   │   │   ├── Taskanalytics.tsx
│   │   │   │   ├── Tasks.tsx
│   │   │   │   ├── createTaskForm.tsx
│   │   │   │   ├── createmodel.tsx
│   │   │   │   ├── kanbanBoard.tsx
│   │   │   │   ├── projectTasks.tsx
│   │   │   │   └── tableData.tsx
│   │   │   └── server
│   │   │       └── route.ts
│   │   └── workspace
│   │       ├── Schema.ts
│   │       ├── api
│   │       │   ├── use-CreateWorkspace.tsx
│   │       │   ├── use-DeleteWorkpace.tsx
│   │       │   ├── use-JoinWorkspace.tsx
│   │       │   ├── use-ResetInviteCode.tsx
│   │       │   ├── use-UpdateWorkapce.tsx
│   │       │   ├── use-getAllWorkspace.tsx
│   │       │   ├── use-inviteCardInfo.tsx
│   │       │   └── use-workpaceInfo.tsx
│   │       ├── components
│   │       │   ├── CreateWorkspaceForm.tsx
│   │       │   ├── ShowAllworkpaceMembers.tsx
│   │       │   ├── WorkspaceUpadte.tsx
│   │       │   ├── createworkspacemodel.tsx
│   │       │   ├── invitationCardWrapper.tsx
│   │       │   ├── inviteCodeCard.tsx
│   │       │   └── settings.tsx
│   │       ├── genrate.ts
│   │       └── server
│   │           └── route.ts
│   ├── lib
│   │   ├── rpc.ts
│   │   └── utils.ts
│   └── providers
│       ├── provider.tsx
│       └── themeProvider.tsx
└── tsconfig.json
```

</details>

---

## 🛠️ Development Setup

### Node.js / JavaScript Requirements
1. Ensure you have Node.js installed (**v18+ recommended**).
2. Install project dependencies:
   ```bash
   npm install
   # or alternative packages managers:
   # yarn install
   # pnpm install
   # bun install
   ```
3. Start the local development server:
   ```bash
   npm run dev
   ```

---

## 👥 Contributing

Contributions are welcome! Please follow the standard flow below:

1. **Fork** the repository.
2. **Clone** your fork locally:
   ```bash
   git clone https://github.com/ni3420/PlanLab.git
   ```
3. **Create a branch** for your adjustments:
   ```bash
   git checkout -b feature/your-feature
   ```
4. **Commit** your changes using clean syntax:
   ```bash
   git commit -m 'feat: add some feature'
   ```
5. **Push** your changes up:
   ```bash
   git push origin feature/your-feature
   ```
6. **Open** a Pull Request against the main branch.

Please match the established code style and provide tests for modified or new features where applicable.

---

