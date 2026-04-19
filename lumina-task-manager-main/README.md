# Lumina Task

Lumina Task is a premium multi-tenant SaaS task management application built using React and TypeScript.

It is designed for organizations to manage projects, tasks, teams, roles, and tenant-specific data securely.

## Key Features

* JWT-based authentication with login, signup, forgot password, and localStorage persistence
* Role-based access control for Super Admin, Tenant Admin, Project Manager, Team Member, and Viewer
* Multi-tenant architecture with strict tenant data isolation
* Dashboard with analytics, activity feed, and project overview
* Project and task management with filters, search, and pagination
* Drag-and-drop Kanban board
* Calendar view for task deadlines
* Team member management and role permissions
* Audit logs and notifications
* Dark/light mode with persistent preferences

## Tech Stack

* React
* TypeScript
* React Router DOM
* Context API
* Tailwind CSS
* Framer Motion
* shadcn/ui
* Lucide React
* dnd-kit

## Demo Credentials

| Role            | Email                                                 | Password  |
| --------------- | ----------------------------------------------------- | --------- |
| Super Admin     | [superadmin@lumina.com](mailto:superadmin@lumina.com) | super123  |
| Tenant Admin    | [admin@techcorp.com](mailto:admin@techcorp.com)       | admin123  |
| Project Manager | [pm@techcorp.com](mailto:pm@techcorp.com)             | pm123     |
| Team Member     | [member@techcorp.com](mailto:member@techcorp.com)     | member123 |
| Viewer          | [viewer@techcorp.com](mailto:viewer@techcorp.com)     | viewer123 |

## Run Locally

```bash
npm install
npm run dev
```

## Purpose

This project demonstrates:

* Frontend architecture for SaaS applications
* Authentication and protected routes
* Role-based permissions
* Multi-tenant data handling
* Reusable component design
* State management using React Context

This project was built as part of an internship-ready portfolio to showcase full-stack SaaS application development skills.

