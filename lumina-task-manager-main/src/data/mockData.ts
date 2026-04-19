export type TaskStatus = "todo" | "in_progress" | "in_review" | "done";
export type TaskPriority = "critical" | "high" | "medium" | "low";
export type ProjectStatus = "planning" | "active" | "completed" | "on_hold";

export interface Project {
  id: string;
  tenantId: string;
  name: string;
  description: string;
  status: ProjectStatus;
  progress: number;
  ownerId: string;
  memberIds: string[];
  dueDate: string;
  createdAt: string;
}

export interface Task {
  id: string;
  tenantId: string;
  projectId: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  assigneeId: string;
  dueDate: string;
  comments: Comment[];
  tags: string[];
  createdAt: string;
}

export interface Comment {
  id: string;
  userId: string;
  text: string;
  createdAt: string;
}

export interface AuditLogEntry {
  id: string;
  tenantId: string | null;
  userId: string;
  userName: string;
  action: "CREATE" | "UPDATE" | "DELETE" | "LOGIN";
  entity: string;
  entityName: string;
  timestamp: string;
}

export interface Notification {
  id: string;
  userId: string;
  message: string;
  type: "task_assigned" | "task_completed" | "comment" | "mention" | "project_update";
  read: boolean;
  timestamp: string;
  link?: string;
}

export const MOCK_PROJECTS: Project[] = [
  { id: "p1", tenantId: "tenant_1", name: "Website Redesign", description: "Complete overhaul of the company website with modern UI/UX", status: "active", progress: 65, ownerId: "3", memberIds: ["3", "4"], dueDate: "2025-06-30", createdAt: "2024-12-01" },
  { id: "p2", tenantId: "tenant_1", name: "Mobile App v2", description: "Native mobile application for iOS and Android", status: "planning", progress: 20, ownerId: "3", memberIds: ["3", "4"], dueDate: "2025-09-15", createdAt: "2025-01-15" },
  { id: "p3", tenantId: "tenant_1", name: "API Integration Hub", description: "Central API gateway for third-party integrations", status: "active", progress: 45, ownerId: "3", memberIds: ["3", "4", "5"], dueDate: "2025-07-01", createdAt: "2025-02-01" },
  { id: "p4", tenantId: "tenant_2", name: "AI Dashboard", description: "Real-time AI analytics dashboard with ML insights", status: "active", progress: 80, ownerId: "6", memberIds: ["6", "7"], dueDate: "2025-05-01", createdAt: "2024-11-01" },
  { id: "p5", tenantId: "tenant_2", name: "Data Pipeline", description: "Automated ETL pipeline for data processing", status: "planning", progress: 10, ownerId: "6", memberIds: ["6", "7"], dueDate: "2025-08-01", createdAt: "2025-03-01" },
];

export const MOCK_TASKS: Task[] = [
  // tenant_1 tasks
  { id: "t1", tenantId: "tenant_1", projectId: "p1", title: "Design homepage wireframes", description: "Create wireframes for the new homepage layout including hero section, features, and footer.", status: "in_progress", priority: "high", assigneeId: "4", dueDate: "2025-04-20", comments: [{ id: "c1", userId: "3", text: "Make sure to include the new brand colors", createdAt: "2025-04-10T10:00:00Z" }], tags: ["design", "ui"], createdAt: "2025-04-01" },
  { id: "t2", tenantId: "tenant_1", projectId: "p1", title: "Implement responsive navigation", description: "Build a responsive navigation component with mobile hamburger menu.", status: "todo", priority: "high", assigneeId: "4", dueDate: "2025-04-25", comments: [], tags: ["frontend", "responsive"], createdAt: "2025-04-02" },
  { id: "t3", tenantId: "tenant_1", projectId: "p1", title: "Set up CI/CD pipeline", description: "Configure GitHub Actions for automated testing and deployment.", status: "done", priority: "medium", assigneeId: "3", dueDate: "2025-04-10", comments: [], tags: ["devops"], createdAt: "2025-03-20" },
  { id: "t4", tenantId: "tenant_1", projectId: "p1", title: "Write unit tests for auth", description: "Comprehensive unit tests for the authentication module.", status: "in_review", priority: "medium", assigneeId: "4", dueDate: "2025-04-18", comments: [], tags: ["testing"], createdAt: "2025-04-05" },
  { id: "t5", tenantId: "tenant_1", projectId: "p2", title: "Research React Native vs Flutter", description: "Compare frameworks for the mobile app development.", status: "done", priority: "high", assigneeId: "3", dueDate: "2025-04-15", comments: [{ id: "c2", userId: "4", text: "React Native seems like the better fit", createdAt: "2025-04-12T14:00:00Z" }], tags: ["research"], createdAt: "2025-04-01" },
  { id: "t6", tenantId: "tenant_1", projectId: "p2", title: "Create app architecture document", description: "Document the overall architecture and tech stack decisions.", status: "in_progress", priority: "medium", assigneeId: "3", dueDate: "2025-04-22", comments: [], tags: ["documentation"], createdAt: "2025-04-08" },
  { id: "t7", tenantId: "tenant_1", projectId: "p1", title: "Optimize image assets", description: "Compress and convert images to WebP format.", status: "todo", priority: "low", assigneeId: "4", dueDate: "2025-04-28", comments: [], tags: ["performance"], createdAt: "2025-04-10" },
  { id: "t8", tenantId: "tenant_1", projectId: "p3", title: "Design API gateway schema", description: "Define the API gateway routing and authentication schema.", status: "in_progress", priority: "critical", assigneeId: "3", dueDate: "2025-04-16", comments: [], tags: ["api", "architecture"], createdAt: "2025-04-01" },
  { id: "t9", tenantId: "tenant_1", projectId: "p3", title: "Implement rate limiting", description: "Add rate limiting middleware for API endpoints.", status: "todo", priority: "high", assigneeId: "4", dueDate: "2025-05-01", comments: [], tags: ["api", "security"], createdAt: "2025-04-12" },
  { id: "t10", tenantId: "tenant_1", projectId: "p1", title: "Accessibility audit", description: "Run WCAG 2.1 compliance audit on all pages.", status: "todo", priority: "medium", assigneeId: "5", dueDate: "2025-05-05", comments: [], tags: ["accessibility"], createdAt: "2025-04-14" },
  { id: "t11", tenantId: "tenant_1", projectId: "p2", title: "Set up push notifications", description: "Implement push notification service for mobile app.", status: "todo", priority: "medium", assigneeId: "4", dueDate: "2025-05-10", comments: [], tags: ["mobile", "notifications"], createdAt: "2025-04-15" },
  { id: "t12", tenantId: "tenant_1", projectId: "p1", title: "Dark mode implementation", description: "Add dark mode support across all components.", status: "in_progress", priority: "low", assigneeId: "4", dueDate: "2025-04-30", comments: [], tags: ["ui", "theme"], createdAt: "2025-04-08" },
  // tenant_2 tasks
  { id: "t13", tenantId: "tenant_2", projectId: "p4", title: "Build ML model dashboard", description: "Create interactive dashboard for ML model performance metrics.", status: "in_progress", priority: "critical", assigneeId: "7", dueDate: "2025-04-18", comments: [{ id: "c3", userId: "6", text: "Use Chart.js for the visualizations", createdAt: "2025-04-11T09:00:00Z" }], tags: ["ml", "dashboard"], createdAt: "2025-04-01" },
  { id: "t14", tenantId: "tenant_2", projectId: "p4", title: "Implement real-time data streaming", description: "Set up WebSocket connections for real-time data updates.", status: "in_review", priority: "high", assigneeId: "7", dueDate: "2025-04-20", comments: [], tags: ["backend", "realtime"], createdAt: "2025-04-05" },
  { id: "t15", tenantId: "tenant_2", projectId: "p4", title: "Create prediction API endpoint", description: "Build REST API for ML model predictions.", status: "done", priority: "high", assigneeId: "6", dueDate: "2025-04-12", comments: [], tags: ["api", "ml"], createdAt: "2025-03-28" },
  { id: "t16", tenantId: "tenant_2", projectId: "p5", title: "Design ETL architecture", description: "Plan the data pipeline architecture with Apache Airflow.", status: "todo", priority: "high", assigneeId: "6", dueDate: "2025-04-25", comments: [], tags: ["architecture", "data"], createdAt: "2025-04-10" },
  { id: "t17", tenantId: "tenant_2", projectId: "p5", title: "Set up data warehouse", description: "Configure data warehouse with partitioning and indexing.", status: "todo", priority: "medium", assigneeId: "7", dueDate: "2025-05-01", comments: [], tags: ["database", "infrastructure"], createdAt: "2025-04-12" },
  { id: "t18", tenantId: "tenant_2", projectId: "p4", title: "Add user analytics tracking", description: "Implement event tracking for user behavior analytics.", status: "todo", priority: "low", assigneeId: "7", dueDate: "2025-05-05", comments: [], tags: ["analytics"], createdAt: "2025-04-14" },
  { id: "t19", tenantId: "tenant_2", projectId: "p4", title: "Performance optimization", description: "Optimize dashboard load time and rendering performance.", status: "in_progress", priority: "medium", assigneeId: "7", dueDate: "2025-04-22", comments: [], tags: ["performance"], createdAt: "2025-04-08" },
  { id: "t20", tenantId: "tenant_2", projectId: "p5", title: "Write data validation rules", description: "Create comprehensive data validation and cleaning rules.", status: "todo", priority: "medium", assigneeId: "6", dueDate: "2025-05-10", comments: [], tags: ["data", "quality"], createdAt: "2025-04-15" },
];

export const MOCK_AUDIT_LOG: AuditLogEntry[] = [
  { id: "a1", tenantId: "tenant_1", userId: "3", userName: "Carol Dev", action: "CREATE", entity: "project", entityName: "Website Redesign", timestamp: "2024-12-01T09:00:00Z" },
  { id: "a2", tenantId: "tenant_1", userId: "3", userName: "Carol Dev", action: "CREATE", entity: "task", entityName: "Design homepage wireframes", timestamp: "2025-04-01T10:00:00Z" },
  { id: "a3", tenantId: "tenant_1", userId: "4", userName: "Dave Worker", action: "UPDATE", entity: "task", entityName: "Design homepage wireframes", timestamp: "2025-04-10T14:30:00Z" },
  { id: "a4", tenantId: "tenant_1", userId: "3", userName: "Carol Dev", action: "CREATE", entity: "task", entityName: "Set up CI/CD pipeline", timestamp: "2025-03-20T11:00:00Z" },
  { id: "a5", tenantId: "tenant_1", userId: "3", userName: "Carol Dev", action: "UPDATE", entity: "task", entityName: "Set up CI/CD pipeline", timestamp: "2025-04-10T16:00:00Z" },
  { id: "a6", tenantId: "tenant_1", userId: "2", userName: "Bob TechCorp", action: "LOGIN", entity: "session", entityName: "Login", timestamp: "2025-04-15T08:00:00Z" },
  { id: "a7", tenantId: "tenant_1", userId: "4", userName: "Dave Worker", action: "UPDATE", entity: "task", entityName: "Write unit tests for auth", timestamp: "2025-04-14T15:00:00Z" },
  { id: "a8", tenantId: "tenant_1", userId: "3", userName: "Carol Dev", action: "CREATE", entity: "project", entityName: "API Integration Hub", timestamp: "2025-02-01T09:00:00Z" },
  { id: "a9", tenantId: "tenant_2", userId: "6", userName: "Frank InnovateCo", action: "CREATE", entity: "project", entityName: "AI Dashboard", timestamp: "2024-11-01T10:00:00Z" },
  { id: "a10", tenantId: "tenant_2", userId: "7", userName: "Grace Dev", action: "UPDATE", entity: "task", entityName: "Build ML model dashboard", timestamp: "2025-04-11T11:00:00Z" },
  { id: "a11", tenantId: "tenant_2", userId: "6", userName: "Frank InnovateCo", action: "CREATE", entity: "task", entityName: "Design ETL architecture", timestamp: "2025-04-10T09:00:00Z" },
  { id: "a12", tenantId: "tenant_2", userId: "6", userName: "Frank InnovateCo", action: "LOGIN", entity: "session", entityName: "Login", timestamp: "2025-04-15T07:30:00Z" },
  { id: "a13", tenantId: null, userId: "1", userName: "Alice Super", action: "LOGIN", entity: "session", entityName: "Login", timestamp: "2025-04-15T06:00:00Z" },
  { id: "a14", tenantId: "tenant_1", userId: "3", userName: "Carol Dev", action: "DELETE", entity: "task", entityName: "Old migration script", timestamp: "2025-04-13T17:00:00Z" },
  { id: "a15", tenantId: "tenant_2", userId: "7", userName: "Grace Dev", action: "CREATE", entity: "task", entityName: "Performance optimization", timestamp: "2025-04-08T10:00:00Z" },
];

export const MOCK_NOTIFICATIONS: Notification[] = [
  { id: "n1", userId: "4", message: "You were assigned to 'Design homepage wireframes'", type: "task_assigned", read: false, timestamp: "2025-04-15T10:00:00Z", link: "/tasks" },
  { id: "n2", userId: "4", message: "Carol commented on 'Design homepage wireframes'", type: "comment", read: false, timestamp: "2025-04-15T09:00:00Z", link: "/tasks" },
  { id: "n3", userId: "3", message: "'Set up CI/CD pipeline' was marked as done", type: "task_completed", read: true, timestamp: "2025-04-14T16:00:00Z", link: "/tasks" },
  { id: "n4", userId: "4", message: "New task assigned: 'Implement responsive navigation'", type: "task_assigned", read: false, timestamp: "2025-04-14T14:00:00Z", link: "/tasks" },
  { id: "n5", userId: "3", message: "Website Redesign progress updated to 65%", type: "project_update", read: true, timestamp: "2025-04-13T11:00:00Z", link: "/projects" },
  { id: "n6", userId: "7", message: "You were assigned to 'Build ML model dashboard'", type: "task_assigned", read: false, timestamp: "2025-04-15T08:00:00Z", link: "/tasks" },
  { id: "n7", userId: "6", message: "'Create prediction API endpoint' completed", type: "task_completed", read: true, timestamp: "2025-04-12T15:00:00Z", link: "/tasks" },
  { id: "n8", userId: "7", message: "Frank commented on 'Build ML model dashboard'", type: "comment", read: false, timestamp: "2025-04-11T09:30:00Z", link: "/tasks" },
  { id: "n9", userId: "2", message: "New team member Eve Viewer joined TechCorp", type: "project_update", read: true, timestamp: "2025-04-01T10:00:00Z", link: "/team" },
  { id: "n10", userId: "4", message: "You were mentioned in a comment on 'Mobile App v2'", type: "mention", read: false, timestamp: "2025-04-12T14:30:00Z", link: "/projects" },
];
