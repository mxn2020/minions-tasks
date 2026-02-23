/**
 * @module @minions-tasks/sdk/schemas
 * Custom MinionType schemas for Minions Tasks.
 */

import type { MinionType } from 'minions-sdk';

export const taskType: MinionType = {
  id: 'tasks-task',
  name: 'Task',
  slug: 'task',
  description: 'A unit of work to be done, assignable to a human or agent.',
  icon: '✅',
  schema: [
    { name: 'title', type: 'string', label: 'title' },
    { name: 'description', type: 'string', label: 'description' },
    { name: 'status', type: 'select', label: 'status' },
    { name: 'priority', type: 'select', label: 'priority' },
    { name: 'assigneeId', type: 'string', label: 'assigneeId' },
    { name: 'assigneeType', type: 'select', label: 'assigneeType' },
    { name: 'createdBy', type: 'string', label: 'createdBy' },
    { name: 'createdAt', type: 'string', label: 'createdAt' },
    { name: 'dueAt', type: 'string', label: 'dueAt' },
    { name: 'completedAt', type: 'string', label: 'completedAt' },
    { name: 'tags', type: 'string', label: 'tags' },
    { name: 'parentTaskId', type: 'string', label: 'parentTaskId' },
    { name: 'contextRefType', type: 'string', label: 'contextRefType' },
    { name: 'contextRefId', type: 'string', label: 'contextRefId' },
  ],
};

export const tasklistType: MinionType = {
  id: 'tasks-task-list',
  name: 'Task list',
  slug: 'task-list',
  description: 'An ordered or unordered collection of tasks with a shared purpose.',
  icon: '📋',
  schema: [
    { name: 'name', type: 'string', label: 'name' },
    { name: 'description', type: 'string', label: 'description' },
    { name: 'taskIds', type: 'string', label: 'taskIds' },
    { name: 'ordered', type: 'boolean', label: 'ordered' },
    { name: 'ownerId', type: 'string', label: 'ownerId' },
    { name: 'groupId', type: 'string', label: 'groupId' },
  ],
};

export const taskdependencyType: MinionType = {
  id: 'tasks-task-dependency',
  name: 'Task dependency',
  slug: 'task-dependency',
  description: 'A blocking or relational dependency between two tasks.',
  icon: '🔗',
  schema: [
    { name: 'taskId', type: 'string', label: 'taskId' },
    { name: 'dependsOnTaskId', type: 'string', label: 'dependsOnTaskId' },
    { name: 'type', type: 'select', label: 'type' },
  ],
};

export const recurringtaskType: MinionType = {
  id: 'tasks-recurring-task',
  name: 'Recurring task',
  slug: 'recurring-task',
  description: 'A task template that spawns new instances on a schedule.',
  icon: '🔁',
  schema: [
    { name: 'templateTaskId', type: 'string', label: 'templateTaskId' },
    { name: 'schedule', type: 'string', label: 'schedule' },
    { name: 'nextRunAt', type: 'string', label: 'nextRunAt' },
    { name: 'lastRunAt', type: 'string', label: 'lastRunAt' },
    { name: 'spawnedTaskIds', type: 'string', label: 'spawnedTaskIds' },
    { name: 'status', type: 'select', label: 'status' },
  ],
};

export const taskassignmentType: MinionType = {
  id: 'tasks-task-assignment',
  name: 'Task assignment',
  slug: 'task-assignment',
  description: 'An explicit assignment of a task to a person or agent with a role.',
  icon: '👤',
  schema: [
    { name: 'taskId', type: 'string', label: 'taskId' },
    { name: 'assigneeId', type: 'string', label: 'assigneeId' },
    { name: 'assigneeType', type: 'select', label: 'assigneeType' },
    { name: 'assignedAt', type: 'string', label: 'assignedAt' },
    { name: 'assignedBy', type: 'string', label: 'assignedBy' },
    { name: 'role', type: 'select', label: 'role' },
  ],
};

export const taskcheckpointType: MinionType = {
  id: 'tasks-task-checkpoint',
  name: 'Task checkpoint',
  slug: 'task-checkpoint',
  description: 'A named milestone or progress marker within a task.',
  icon: '🚩',
  schema: [
    { name: 'taskId', type: 'string', label: 'taskId' },
    { name: 'label', type: 'string', label: 'label' },
    { name: 'completedAt', type: 'string', label: 'completedAt' },
    { name: 'notes', type: 'string', label: 'notes' },
  ],
};

export const taskhistoryentryType: MinionType = {
  id: 'tasks-task-history-entry',
  name: 'Task history entry',
  slug: 'task-history-entry',
  description: 'An immutable log of a single field change on a task.',
  icon: '🕰️',
  schema: [
    { name: 'taskId', type: 'string', label: 'taskId' },
    { name: 'changedAt', type: 'string', label: 'changedAt' },
    { name: 'changedBy', type: 'string', label: 'changedBy' },
    { name: 'field', type: 'string', label: 'field' },
    { name: 'from', type: 'string', label: 'from' },
    { name: 'to', type: 'string', label: 'to' },
  ],
};

export const taskcommentType: MinionType = {
  id: 'tasks-task-comment',
  name: 'Task comment',
  slug: 'task-comment',
  description: 'A comment or note left on a task by a human or agent.',
  icon: '💬',
  schema: [
    { name: 'taskId', type: 'string', label: 'taskId' },
    { name: 'authorId', type: 'string', label: 'authorId' },
    { name: 'authorType', type: 'select', label: 'authorType' },
    { name: 'body', type: 'string', label: 'body' },
    { name: 'createdAt', type: 'string', label: 'createdAt' },
    { name: 'resolvedAt', type: 'string', label: 'resolvedAt' },
  ],
};

export const taskoutcomeType: MinionType = {
  id: 'tasks-task-outcome',
  name: 'Task outcome',
  slug: 'task-outcome',
  description: 'The recorded result of a completed or failed task, including lessons learned.',
  icon: '🎯',
  schema: [
    { name: 'taskId', type: 'string', label: 'taskId' },
    { name: 'result', type: 'select', label: 'result' },
    { name: 'summary', type: 'string', label: 'summary' },
    { name: 'artifactIds', type: 'string', label: 'artifactIds' },
    { name: 'lessons', type: 'string', label: 'lessons' },
  ],
};

export const customTypes: MinionType[] = [
  taskType,
  tasklistType,
  taskdependencyType,
  recurringtaskType,
  taskassignmentType,
  taskcheckpointType,
  taskhistoryentryType,
  taskcommentType,
  taskoutcomeType,
];

