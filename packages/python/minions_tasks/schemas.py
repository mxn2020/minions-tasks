"""
Minions Tasks SDK — Type Schemas
Custom MinionType schemas for Minions Tasks.
"""

from minions.types import FieldDefinition, FieldValidation, MinionType

task_type = MinionType(
    id="tasks-task",
    name="Task",
    slug="task",
    description="A unit of work to be done, assignable to a human or agent.",
    icon="✅",
    schema=[
        FieldDefinition(name="title", type="string", label="title"),
        FieldDefinition(name="description", type="string", label="description"),
        FieldDefinition(name="status", type="select", label="status"),
        FieldDefinition(name="priority", type="select", label="priority"),
        FieldDefinition(name="assigneeId", type="string", label="assigneeId"),
        FieldDefinition(name="assigneeType", type="select", label="assigneeType"),
        FieldDefinition(name="createdBy", type="string", label="createdBy"),
        FieldDefinition(name="createdAt", type="string", label="createdAt"),
        FieldDefinition(name="dueAt", type="string", label="dueAt"),
        FieldDefinition(name="completedAt", type="string", label="completedAt"),
        FieldDefinition(name="tags", type="string", label="tags"),
        FieldDefinition(name="parentTaskId", type="string", label="parentTaskId"),
        FieldDefinition(name="contextRefType", type="string", label="contextRefType"),
        FieldDefinition(name="contextRefId", type="string", label="contextRefId"),
    ],
)

task_list_type = MinionType(
    id="tasks-task-list",
    name="Task list",
    slug="task-list",
    description="An ordered or unordered collection of tasks with a shared purpose.",
    icon="📋",
    schema=[
        FieldDefinition(name="name", type="string", label="name"),
        FieldDefinition(name="description", type="string", label="description"),
        FieldDefinition(name="taskIds", type="string", label="taskIds"),
        FieldDefinition(name="ordered", type="boolean", label="ordered"),
        FieldDefinition(name="ownerId", type="string", label="ownerId"),
        FieldDefinition(name="groupId", type="string", label="groupId"),
    ],
)

task_dependency_type = MinionType(
    id="tasks-task-dependency",
    name="Task dependency",
    slug="task-dependency",
    description="A blocking or relational dependency between two tasks.",
    icon="🔗",
    schema=[
        FieldDefinition(name="taskId", type="string", label="taskId"),
        FieldDefinition(name="dependsOnTaskId", type="string", label="dependsOnTaskId"),
        FieldDefinition(name="type", type="select", label="type"),
    ],
)

recurring_task_type = MinionType(
    id="tasks-recurring-task",
    name="Recurring task",
    slug="recurring-task",
    description="A task template that spawns new instances on a schedule.",
    icon="🔁",
    schema=[
        FieldDefinition(name="templateTaskId", type="string", label="templateTaskId"),
        FieldDefinition(name="schedule", type="string", label="schedule"),
        FieldDefinition(name="nextRunAt", type="string", label="nextRunAt"),
        FieldDefinition(name="lastRunAt", type="string", label="lastRunAt"),
        FieldDefinition(name="spawnedTaskIds", type="string", label="spawnedTaskIds"),
        FieldDefinition(name="status", type="select", label="status"),
    ],
)

task_assignment_type = MinionType(
    id="tasks-task-assignment",
    name="Task assignment",
    slug="task-assignment",
    description="An explicit assignment of a task to a person or agent with a role.",
    icon="👤",
    schema=[
        FieldDefinition(name="taskId", type="string", label="taskId"),
        FieldDefinition(name="assigneeId", type="string", label="assigneeId"),
        FieldDefinition(name="assigneeType", type="select", label="assigneeType"),
        FieldDefinition(name="assignedAt", type="string", label="assignedAt"),
        FieldDefinition(name="assignedBy", type="string", label="assignedBy"),
        FieldDefinition(name="role", type="select", label="role"),
    ],
)

task_checkpoint_type = MinionType(
    id="tasks-task-checkpoint",
    name="Task checkpoint",
    slug="task-checkpoint",
    description="A named milestone or progress marker within a task.",
    icon="🚩",
    schema=[
        FieldDefinition(name="taskId", type="string", label="taskId"),
        FieldDefinition(name="label", type="string", label="label"),
        FieldDefinition(name="completedAt", type="string", label="completedAt"),
        FieldDefinition(name="notes", type="string", label="notes"),
    ],
)

task_history_entry_type = MinionType(
    id="tasks-task-history-entry",
    name="Task history entry",
    slug="task-history-entry",
    description="An immutable log of a single field change on a task.",
    icon="🕰️",
    schema=[
        FieldDefinition(name="taskId", type="string", label="taskId"),
        FieldDefinition(name="changedAt", type="string", label="changedAt"),
        FieldDefinition(name="changedBy", type="string", label="changedBy"),
        FieldDefinition(name="field", type="string", label="field"),
        FieldDefinition(name="from", type="string", label="from"),
        FieldDefinition(name="to", type="string", label="to"),
    ],
)

task_comment_type = MinionType(
    id="tasks-task-comment",
    name="Task comment",
    slug="task-comment",
    description="A comment or note left on a task by a human or agent.",
    icon="💬",
    schema=[
        FieldDefinition(name="taskId", type="string", label="taskId"),
        FieldDefinition(name="authorId", type="string", label="authorId"),
        FieldDefinition(name="authorType", type="select", label="authorType"),
        FieldDefinition(name="body", type="string", label="body"),
        FieldDefinition(name="createdAt", type="string", label="createdAt"),
        FieldDefinition(name="resolvedAt", type="string", label="resolvedAt"),
    ],
)

task_outcome_type = MinionType(
    id="tasks-task-outcome",
    name="Task outcome",
    slug="task-outcome",
    description="The recorded result of a completed or failed task, including lessons learned.",
    icon="🎯",
    schema=[
        FieldDefinition(name="taskId", type="string", label="taskId"),
        FieldDefinition(name="result", type="select", label="result"),
        FieldDefinition(name="summary", type="string", label="summary"),
        FieldDefinition(name="artifactIds", type="string", label="artifactIds"),
        FieldDefinition(name="lessons", type="string", label="lessons"),
    ],
)

custom_types: list[MinionType] = [
    task_type,
    task_list_type,
    task_dependency_type,
    recurring_task_type,
    task_assignment_type,
    task_checkpoint_type,
    task_history_entry_type,
    task_comment_type,
    task_outcome_type,
]

