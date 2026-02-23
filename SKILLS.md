---
name: minions-tasks
description: Agent skills for creating, managing, and tracking tasks within the Minions ecosystem. Provides CRUD operations via CLI and SDK, task lifecycle management, dependency handling, and recurring task automation.
---

# minions-tasks Agent Skills

Skills for agents operating on the `minions-tasks` toolbox. All data is structured as Minion objects using the MinionTypes defined in `@minions-tasks/sdk`.

## Prerequisites

```bash
# TypeScript SDK
pnpm add @minions-tasks/sdk

# Python SDK
pip install minions-tasks

# CLI (global install for scripted operations)
pnpm add -g @minions-tasks/cli
```

---

## Using the CLI

The `tasks` CLI is the primary interface for scripted and terminal-based operations:

```bash
# Show project info (SDK name, CLI name, Python package)
tasks info
```

Use the CLI for scripted batch operations. For programmatic access within agent code, use the SDK directly.

---

## Using the SDK

### TypeScript

```ts
import { customTypes } from '@minions-tasks/sdk/schemas';

// List all available MinionTypes
for (const type of customTypes) {
  console.log(`${type.icon} ${type.name} (${type.slug})`);
  console.log(`  ${type.description}`);
  console.log(`  Fields: ${type.schema.map(f => f.name).join(', ')}`);
}

// Access a specific MinionType
const taskType = customTypes.find(t => t.slug === 'task');
const taskListType = customTypes.find(t => t.slug === 'task-list');
```

### Python

```python
from minions_tasks.schemas import custom_types

# List all MinionTypes
for t in custom_types:
    print(f"{t.icon} {t.name} ({t.slug})")
    print(f"  {t.description}")
```

---

## Available MinionTypes

| Slug | Icon | Purpose |
|------|------|---------|
| `task` | ✅ | A unit of work assignable to a human or agent |
| `task-list` | 📋 | An ordered or unordered collection of tasks |
| `task-dependency` | 🔗 | A blocking or relational dependency between tasks |
| `recurring-task` | 🔁 | A task template that spawns new instances on schedule |
| `task-assignment` | 👤 | An explicit assignment of a task to a person or agent |
| `task-checkpoint` | 🚩 | A named milestone or progress marker within a task |
| `task-history-entry` | 🕰️ | An immutable log of a single field change on a task |
| `task-comment` | 💬 | A comment or note left on a task |
| `task-outcome` | 🎯 | The recorded result of a completed or failed task |

---

## Skill: Create Task

When any workflow step produces a unit of work, create a `task` Minion.

1. Always set `contextRefType` and `contextRefId` to the originating Minion (e.g. `"job-posting"`, `"proposal-draft"`, `"agent-run"`)
2. Set `assigneeType: "agent"` if the work is automatable, `"human"` if it requires approval or judgment
3. Set `priority` based on urgency: `"critical"` for blocking items, `"high"` for time-sensitive, `"medium"` for standard, `"low"` for backlog
4. If the task is a subtask, set `parentTaskId` to the parent task's ID
5. Always set `createdBy` to the creating agent's ID
6. Valid `status` values: `"backlog"`, `"todo"`, `"in-progress"`, `"blocked"`, `"done"`, `"cancelled"`

---

## Skill: Manage Task List

Group related tasks into a `task-list` Minion.

1. If `ordered: true` — sequence matters, do not start task N+1 until task N reaches status `"done"`
2. If `ordered: false` — tasks can be parallelized across agents
3. Link the task list to a `minion-group` via `groupId` if the tasks belong to a named collection
4. Update `taskIds` when tasks are added or removed from the list

---

## Skill: Track Progress

On any meaningful state change, create the appropriate tracking Minion.

1. On any `status` field change: create a `task-history-entry` Minion with `field: "status"`, `from`, and `to` values
2. On any other field change worth recording: create a `task-history-entry` with the specific field name
3. On meaningful milestones (e.g. "first draft complete", "halfway done"): create a `task-checkpoint` Minion
4. On task completion (`status: "done"` or `"cancelled"`): always create a `task-outcome` Minion with:
   - `result`: `"success"`, `"partial"`, or `"failed"`
   - `summary`: what was accomplished
   - `artifactIds`: IDs of any Minions produced by this task
   - `lessons`: observations for the agent learning loop

---

## Skill: Handle Blocked Tasks

When a task becomes blocked, resolve the dependency chain.

1. If a task's `status` becomes `"blocked"`, query `task-dependency` Minions where `taskId` matches
2. Identify the blocking task via `dependsOnTaskId`
3. Notify the assignee or the Orchestrator with the blocking reason
4. Monitor the blocking task — when it reaches `status: "done"`, automatically advance the blocked task to `"todo"`
5. Create a `task-history-entry` logging the unblock event

---

## Skill: Recurring Tasks

Manage tasks that repeat on a schedule.

1. On each scheduler tick, check all `recurring-task` Minions where `status: "active"`
2. If `nextRunAt` has passed:
   - Spawn a new `task` Minion from the `templateTaskId` template
   - Append the new task's ID to `spawnedTaskIds`
   - Update `lastRunAt` to now
   - Compute and set `nextRunAt` from the `schedule` cron expression
3. If a recurring task is `"paused"`, skip it but do not clear `nextRunAt`

---

## Cross-Toolbox Context

The `contextRef` fields on `task` are the bridge to other toolboxes:

```
agent-run (minions-agents)           → spawns tasks with contextRef: { type: "agent-run" }
job-posting (minions-jobs)           → has tasks like "research this client"
proposal-draft (minions-proposals)   → has tasks like "add portfolio item X"
deliverable (minions-contracts)      → has tasks for work items within a contract
approval-request (minions-approvals) → is itself a task waiting for human action
```

Rather than every toolbox defining its own "todo" concept, they all point to `minions-tasks` for anything that represents work to be done.

---

## Hard Rules

- Every task MUST have a `contextRefType` and `contextRefId` — orphaned tasks are not allowed
- Every completed task MUST have a corresponding `task-outcome` Minion
- Never delete tasks — set status to `"cancelled"` instead
- All status transitions must be logged via `task-history-entry`
- Recurring task spawning must be idempotent — check `lastRunAt` before spawning to avoid duplicates
- All timestamps in ISO 8601 format
- This agent only writes to `minions-tasks` — it reads from other toolboxes but never writes to them
