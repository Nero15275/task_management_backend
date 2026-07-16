import { UserRole } from "@/common";

/**
 * Checks if a user is permitted to read a task
 */
export function canRead(
  user: { sub: string; role: UserRole },
  task: { assignedTo: string; createdBy: string },
  isDirectReport: boolean
): boolean {
  if (user.role === UserRole.MANAGER) return true; // Managers can see all tasks
  if (user.role === UserRole.TEAM_LEAD) {
    return task.assignedTo === user.sub || task.createdBy === user.sub || isDirectReport; // Team Leads see team's tasks
  }
  return task.assignedTo === user.sub; // Employees can only see their own tasks
}

/**
 * Checks if a user is permitted to update a task
 */
export function canUpdate(
  user: { sub: string; role: UserRole },
  task: { assignedTo: string; createdBy: string },
  isDirectReport: boolean
): boolean {
  if (user.role === UserRole.MANAGER) return true; // Managers can modify any task
  if (user.role === UserRole.TEAM_LEAD) {
    return task.assignedTo === user.sub || isDirectReport; // Team Leads modify self or team's tasks
  }
  return task.assignedTo === user.sub; // Employees can only modify their own tasks
}

/**
 * Checks if a user is permitted to delete a task
 */
export function canDelete(
  user: { sub: string; role: UserRole },
  task: { assignedTo: string }
): boolean {
  if (user.role === UserRole.MANAGER) return true; // Managers can delete anything
  if (task.assignedTo === user.sub) return true; // Anyone can delete their own self-assigned tasks
  return false;
}