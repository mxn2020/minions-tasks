#!/usr/bin/env node

/**
 * @minions-tasks/cli — CLI for Minions Tasks
 */

import { Command } from 'commander';
import chalk from 'chalk';
import { readFileSync, writeFileSync, mkdirSync, existsSync, readdirSync } from 'fs';
import { join, resolve } from 'path';
import { randomUUID } from 'crypto';
import { customTypes } from '@minions-tasks/sdk';

const program = new Command();
const STORE_DIR = resolve(process.env.MINIONS_STORE || '.minions');

function ensureStore() {
    if (!existsSync(STORE_DIR)) {
        mkdirSync(STORE_DIR, { recursive: true });
    }
}

function getTypeDir(slug: string) {
    const dir = join(STORE_DIR, slug);
    if (!existsSync(dir)) {
        mkdirSync(dir, { recursive: true });
    }
    return dir;
}

function findType(slug: string) {
    const type = customTypes.find(t => t.slug === slug);
    if (!type) {
        console.error(chalk.red(`Unknown type: ${slug}`));
        console.error(chalk.dim(`Available types: ${customTypes.map(t => t.slug).join(', ')}`));
        process.exit(1);
    }
    return type;
}

program
    .name('tasks')
    .description('Task and work management across agents, humans, and workflows')
    .version('0.4.0');

// ─── info ──────────────────────────────────────────────────
program
    .command('info')
    .description('Show project info')
    .action(() => {
        console.log(chalk.bold('Minions Tasks'));
        console.log(chalk.dim('Task and work management across agents, humans, and workflows'));
        console.log('');
        console.log(`  SDK:    ${chalk.cyan('@minions-tasks/sdk')}`);
        console.log(`  CLI:    ${chalk.cyan('@minions-tasks/cli')}`);
        console.log(`  Python: ${chalk.cyan('minions-tasks')}`);
        console.log(`  Store:  ${chalk.cyan(STORE_DIR)}`);
        console.log(`  Types:  ${chalk.cyan(String(customTypes.length))}`);
    });

// ─── types ─────────────────────────────────────────────────
const types = program.command('types').description('Manage MinionType schemas');

types
    .command('list')
    .alias('ls')
    .description('List all available MinionTypes')
    .action(() => {
        console.log(chalk.bold(`\n  ${customTypes.length} MinionTypes available:\n`));
        for (const type of customTypes) {
            const fieldCount = type.schema.length;
            console.log(`  ${type.icon}  ${chalk.bold(type.name)} ${chalk.dim(`(${type.slug})`)}`);
            console.log(`     ${chalk.dim(type.description)}`);
            console.log(`     ${chalk.dim(`${fieldCount} fields: ${type.schema.map(f => f.name).join(', ')}`)}`);
            console.log('');
        }
    });

types
    .command('show <slug>')
    .description('Show detailed schema for a MinionType')
    .action((slug: string) => {
        const type = findType(slug);
        console.log(`\n  ${type.icon}  ${chalk.bold(type.name)}`);
        console.log(`  ${chalk.dim(type.description)}`);
        console.log(`  ${chalk.dim(`ID: ${type.id}  Slug: ${type.slug}`)}\n`);
        console.log(chalk.bold('  Fields:\n'));
        for (const field of type.schema) {
            const typeColor = field.type === 'string' ? 'green' : field.type === 'number' ? 'yellow' : field.type === 'boolean' ? 'blue' : 'magenta';
            console.log(`    ${chalk.dim('•')} ${chalk.bold(field.name)}  ${(chalk as any)[typeColor](field.type)}`);
        }
        console.log('');
    });

// ─── create ────────────────────────────────────────────────
program
    .command('create <type>')
    .description('Create a new Minion of the specified type')
    .option('-d, --data <json>', 'Field data as JSON string')
    .option('-f, --file <path>', 'Read field data from a JSON file')
    .option('-t, --title <title>', 'Shortcut: set the title field')
    .option('-s, --status <status>', 'Shortcut: set the status field')
    .option('-p, --priority <priority>', 'Shortcut: set the priority field')
    .action((typeSlug: string, opts: any) => {
        const type = findType(typeSlug);
        ensureStore();

        let fields: Record<string, any> = {};

        if (opts.file) {
            fields = JSON.parse(readFileSync(opts.file, 'utf-8'));
        } else if (opts.data) {
            fields = JSON.parse(opts.data);
        }

        // Apply shortcut flags
        if (opts.title) fields.title = opts.title;
        if (opts.status) fields.status = opts.status;
        if (opts.priority) fields.priority = opts.priority;

        const minion = {
            id: randomUUID(),
            type: type.slug,
            typeName: type.name,
            fields,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };

        const dir = getTypeDir(type.slug);
        const filePath = join(dir, `${minion.id}.json`);
        writeFileSync(filePath, JSON.stringify(minion, null, 2));

        console.log(chalk.green(`\n  ✔ Created ${type.icon} ${type.name}`));
        console.log(`  ${chalk.dim('ID:')}    ${minion.id}`);
        console.log(`  ${chalk.dim('File:')}  ${filePath}`);
        if (fields.title) console.log(`  ${chalk.dim('Title:')} ${fields.title}`);
        console.log('');
    });

// ─── list ──────────────────────────────────────────────────
program
    .command('list [type]')
    .alias('ls')
    .description('List all Minions, optionally filtered by type')
    .option('--json', 'Output as JSON')
    .action((typeSlug: string | undefined, opts: any) => {
        ensureStore();

        const slugs = typeSlug ? [typeSlug] : customTypes.map(t => t.slug);
        const allMinions: any[] = [];

        for (const slug of slugs) {
            const dir = join(STORE_DIR, slug);
            if (!existsSync(dir)) continue;
            const files = readdirSync(dir).filter(f => f.endsWith('.json'));
            for (const file of files) {
                const minion = JSON.parse(readFileSync(join(dir, file), 'utf-8'));
                allMinions.push(minion);
            }
        }

        if (opts.json) {
            console.log(JSON.stringify(allMinions, null, 2));
            return;
        }

        if (allMinions.length === 0) {
            console.log(chalk.dim('\n  No Minions found.\n'));
            return;
        }

        console.log(chalk.bold(`\n  ${allMinions.length} Minion(s):\n`));
        for (const m of allMinions) {
            const type = customTypes.find(t => t.slug === m.type);
            const icon = type?.icon || '?';
            const title = m.fields?.title || m.fields?.name || m.fields?.label || chalk.dim('(untitled)');
            const status = m.fields?.status ? chalk.dim(`[${m.fields.status}]`) : '';
            console.log(`  ${icon}  ${chalk.bold(title)} ${status}`);
            console.log(`     ${chalk.dim(m.id)} ${chalk.dim(m.type)}`);
        }
        console.log('');
    });

// ─── show ──────────────────────────────────────────────────
program
    .command('show <id>')
    .description('Show a Minion by ID')
    .option('--json', 'Output as JSON')
    .action((id: string, opts: any) => {
        ensureStore();

        // Search across all type directories
        for (const type of customTypes) {
            const filePath = join(STORE_DIR, type.slug, `${id}.json`);
            if (existsSync(filePath)) {
                const minion = JSON.parse(readFileSync(filePath, 'utf-8'));

                if (opts.json) {
                    console.log(JSON.stringify(minion, null, 2));
                    return;
                }

                console.log(`\n  ${type.icon}  ${chalk.bold(minion.fields?.title || minion.fields?.name || type.name)}`);
                console.log(`  ${chalk.dim(`Type: ${minion.type}  ID: ${minion.id}`)}`);
                console.log(`  ${chalk.dim(`Created: ${minion.createdAt}`)}\n`);
                console.log(chalk.bold('  Fields:\n'));
                for (const [key, value] of Object.entries(minion.fields || {})) {
                    console.log(`    ${chalk.dim('•')} ${chalk.bold(key)}: ${value}`);
                }
                console.log('');
                return;
            }
        }
        console.error(chalk.red(`\n  Minion not found: ${id}\n`));
        process.exit(1);
    });

// ─── update ────────────────────────────────────────────────
program
    .command('update <id>')
    .description('Update fields on an existing Minion')
    .option('-d, --data <json>', 'Fields to update as JSON')
    .option('-s, --status <status>', 'Shortcut: update status')
    .option('-p, --priority <priority>', 'Shortcut: update priority')
    .action((id: string, opts: any) => {
        ensureStore();

        for (const type of customTypes) {
            const filePath = join(STORE_DIR, type.slug, `${id}.json`);
            if (existsSync(filePath)) {
                const minion = JSON.parse(readFileSync(filePath, 'utf-8'));
                let updates: Record<string, any> = {};

                if (opts.data) updates = JSON.parse(opts.data);
                if (opts.status) updates.status = opts.status;
                if (opts.priority) updates.priority = opts.priority;

                minion.fields = { ...minion.fields, ...updates };
                minion.updatedAt = new Date().toISOString();
                writeFileSync(filePath, JSON.stringify(minion, null, 2));

                console.log(chalk.green(`\n  ✔ Updated ${type.icon} ${minion.fields?.title || type.name}`));
                for (const [key, value] of Object.entries(updates)) {
                    console.log(`    ${chalk.dim('•')} ${key} → ${value}`);
                }
                console.log('');
                return;
            }
        }
        console.error(chalk.red(`\n  Minion not found: ${id}\n`));
        process.exit(1);
    });

// ─── delete ────────────────────────────────────────────────
program
    .command('delete <id>')
    .description('Delete a Minion by ID (sets status to cancelled if possible)')
    .option('--hard', 'Permanently delete the file')
    .action((id: string, opts: any) => {
        ensureStore();
        const { unlinkSync } = require('fs');

        for (const type of customTypes) {
            const filePath = join(STORE_DIR, type.slug, `${id}.json`);
            if (existsSync(filePath)) {
                if (opts.hard) {
                    unlinkSync(filePath);
                    console.log(chalk.yellow(`\n  🗑  Permanently deleted ${id}\n`));
                } else {
                    const minion = JSON.parse(readFileSync(filePath, 'utf-8'));
                    minion.fields.status = 'cancelled';
                    minion.updatedAt = new Date().toISOString();
                    writeFileSync(filePath, JSON.stringify(minion, null, 2));
                    console.log(chalk.yellow(`\n  ✔ Cancelled ${type.icon} ${minion.fields?.title || type.name}`));
                    console.log(chalk.dim(`    Use --hard to permanently delete\n`));
                }
                return;
            }
        }
        console.error(chalk.red(`\n  Minion not found: ${id}\n`));
        process.exit(1);
    });

// ─── validate ──────────────────────────────────────────────
program
    .command('validate <file>')
    .description('Validate a JSON file against its MinionType schema')
    .action((file: string) => {
        const data = JSON.parse(readFileSync(file, 'utf-8'));
        const type = customTypes.find(t => t.slug === data.type);

        if (!type) {
            console.error(chalk.red(`\n  Unknown type: ${data.type}\n`));
            process.exit(1);
        }

        const errors: string[] = [];
        const schemaFields = type.schema.map(f => f.name);
        const dataFields = Object.keys(data.fields || {});

        // Check for missing fields
        for (const f of schemaFields) {
            if (!(f in (data.fields || {}))) {
                errors.push(`Missing field: ${f}`);
            }
        }

        // Check for unknown fields
        for (const f of dataFields) {
            if (!schemaFields.includes(f)) {
                errors.push(`Unknown field: ${f}`);
            }
        }

        // Check field types
        for (const field of type.schema) {
            const value = data.fields?.[field.name];
            if (value === undefined) continue;
            if (field.type === 'number' && typeof value !== 'number') {
                errors.push(`Field ${field.name} should be number, got ${typeof value}`);
            }
            if (field.type === 'boolean' && typeof value !== 'boolean') {
                errors.push(`Field ${field.name} should be boolean, got ${typeof value}`);
            }
        }

        if (errors.length === 0) {
            console.log(chalk.green(`\n  ✔ Valid ${type.icon} ${type.name}\n`));
        } else {
            console.log(chalk.red(`\n  ✘ ${errors.length} validation error(s):\n`));
            for (const err of errors) {
                console.log(`    ${chalk.red('•')} ${err}`);
            }
            console.log('');
            process.exit(1);
        }
    });

// ─── stats ─────────────────────────────────────────────────
program
    .command('stats')
    .description('Show statistics about stored Minions')
    .action(() => {
        ensureStore();
        console.log(chalk.bold('\n  Minion Statistics:\n'));

        let total = 0;
        for (const type of customTypes) {
            const dir = join(STORE_DIR, type.slug);
            if (!existsSync(dir)) {
                console.log(`  ${type.icon}  ${type.name.padEnd(22)} ${chalk.dim('0')}`);
                continue;
            }
            const count = readdirSync(dir).filter(f => f.endsWith('.json')).length;
            total += count;
            const bar = chalk.cyan('█'.repeat(Math.min(count, 30)));
            console.log(`  ${type.icon}  ${type.name.padEnd(22)} ${String(count).padStart(4)}  ${bar}`);
        }
        console.log(`\n  ${chalk.bold('Total:')} ${total} Minion(s)`);
        console.log(`  ${chalk.dim(`Store: ${STORE_DIR}`)}\n`);
    });

// ─── blocked ───────────────────────────────────────────────
program
    .command('blocked')
    .description('List all tasks with status "blocked" and their dependencies')
    .action(() => {
        ensureStore();
        const taskDir = join(STORE_DIR, 'task');
        const depDir = join(STORE_DIR, 'task-dependency');
        if (!existsSync(taskDir)) { console.log(chalk.dim('\n  No tasks found.\n')); return; }

        const tasks = readdirSync(taskDir).filter(f => f.endsWith('.json'))
            .map(f => JSON.parse(readFileSync(join(taskDir, f), 'utf-8')))
            .filter(t => t.fields?.status === 'blocked');

        if (tasks.length === 0) { console.log(chalk.green('\n  ✔ No blocked tasks.\n')); return; }

        const deps = existsSync(depDir)
            ? readdirSync(depDir).filter(f => f.endsWith('.json')).map(f => JSON.parse(readFileSync(join(depDir, f), 'utf-8')))
            : [];

        console.log(chalk.bold(`\n  🚫 ${tasks.length} blocked task(s):\n`));
        for (const t of tasks) {
            console.log(`  ✅  ${chalk.bold(t.fields.title || '(untitled)')}`);
            console.log(`     ${chalk.dim(t.id)}`);
            const taskDeps = deps.filter(d => d.fields?.taskId === t.id);
            if (taskDeps.length > 0) {
                for (const d of taskDeps) {
                    console.log(`     ${chalk.red('→')} blocked by ${chalk.dim(d.fields.dependsOnTaskId)} (${d.fields.type})`);
                }
            } else {
                console.log(`     ${chalk.dim('No dependency records found')}`);
            }
            console.log('');
        }
    });

// ─── search ────────────────────────────────────────────────
program
    .command('search <query>')
    .description('Search Minions by title, name, or label')
    .option('-t, --type <type>', 'Filter by MinionType slug')
    .option('--status <status>', 'Filter by status')
    .option('--json', 'Output as JSON')
    .action((query: string, opts: any) => {
        ensureStore();
        const slugs = opts.type ? [opts.type] : customTypes.map(t => t.slug);
        const results: any[] = [];
        const q = query.toLowerCase();

        for (const slug of slugs) {
            const dir = join(STORE_DIR, slug);
            if (!existsSync(dir)) continue;
            const files = readdirSync(dir).filter(f => f.endsWith('.json'));
            for (const file of files) {
                const minion = JSON.parse(readFileSync(join(dir, file), 'utf-8'));
                const title = (minion.fields?.title || minion.fields?.name || minion.fields?.label || '').toLowerCase();
                const desc = (minion.fields?.description || minion.fields?.body || '').toLowerCase();
                if (title.includes(q) || desc.includes(q)) {
                    if (opts.status && minion.fields?.status !== opts.status) continue;
                    results.push(minion);
                }
            }
        }

        if (opts.json) { console.log(JSON.stringify(results, null, 2)); return; }
        if (results.length === 0) { console.log(chalk.dim(`\n  No results for "${query}".\n`)); return; }

        console.log(chalk.bold(`\n  ${results.length} result(s) for "${query}":\n`));
        for (const m of results) {
            const type = customTypes.find(t => t.slug === m.type);
            const icon = type?.icon || '?';
            const title = m.fields?.title || m.fields?.name || m.fields?.label || chalk.dim('(untitled)');
            const status = m.fields?.status ? chalk.dim(`[${m.fields.status}]`) : '';
            console.log(`  ${icon}  ${chalk.bold(title)} ${status}`);
            console.log(`     ${chalk.dim(m.id)} ${chalk.dim(m.type)}`);
        }
        console.log('');
    });

// ─── complete ──────────────────────────────────────────────
program
    .command('complete <id>')
    .description('Mark a task as done and create a task-outcome')
    .option('-r, --result <result>', 'Outcome result: success, partial, or failed', 'success')
    .option('--summary <summary>', 'Summary of what was accomplished')
    .option('--lessons <lessons>', 'Lessons learned for the agent learning loop')
    .action((id: string, opts: any) => {
        ensureStore();
        const filePath = join(STORE_DIR, 'task', `${id}.json`);
        if (!existsSync(filePath)) {
            console.error(chalk.red(`\n  Task not found: ${id}\n`));
            process.exit(1);
        }

        const task = JSON.parse(readFileSync(filePath, 'utf-8'));
        task.fields.status = 'done';
        task.fields.completedAt = new Date().toISOString();
        task.updatedAt = new Date().toISOString();
        writeFileSync(filePath, JSON.stringify(task, null, 2));

        // Create task-outcome
        const outcome = {
            id: randomUUID(),
            type: 'task-outcome',
            typeName: 'Task outcome',
            fields: {
                taskId: id,
                result: opts.result,
                summary: opts.summary || '',
                artifactIds: '',
                lessons: opts.lessons || '',
            },
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };
        const outcomeDir = getTypeDir('task-outcome');
        writeFileSync(join(outcomeDir, `${outcome.id}.json`), JSON.stringify(outcome, null, 2));

        console.log(chalk.green(`\n  ✔ Completed ✅ ${task.fields.title || 'Task'}`));
        console.log(`  ${chalk.dim('Result:')}  ${opts.result}`);
        console.log(`  ${chalk.dim('Outcome:')} ${outcome.id}\n`);
    });

// ─── assign ────────────────────────────────────────────────
program
    .command('assign <taskId> <assigneeId>')
    .description('Assign a task to a person or agent')
    .option('--type <type>', 'Assignee type: human or agent', 'agent')
    .option('--role <role>', 'Role: owner, collaborator, reviewer, observer', 'owner')
    .action((taskId: string, assigneeId: string, opts: any) => {
        ensureStore();
        const taskPath = join(STORE_DIR, 'task', `${taskId}.json`);
        if (!existsSync(taskPath)) {
            console.error(chalk.red(`\n  Task not found: ${taskId}\n`));
            process.exit(1);
        }

        const assignment = {
            id: randomUUID(),
            type: 'task-assignment',
            typeName: 'Task assignment',
            fields: {
                taskId,
                assigneeId,
                assigneeType: opts.type,
                assignedAt: new Date().toISOString(),
                assignedBy: 'cli',
                role: opts.role,
            },
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };

        const dir = getTypeDir('task-assignment');
        writeFileSync(join(dir, `${assignment.id}.json`), JSON.stringify(assignment, null, 2));

        console.log(chalk.green(`\n  ✔ Assigned task to ${assigneeId}`));
        console.log(`  ${chalk.dim('Task:')}       ${taskId}`);
        console.log(`  ${chalk.dim('Type:')}       ${opts.type}`);
        console.log(`  ${chalk.dim('Role:')}       ${opts.role}`);
        console.log(`  ${chalk.dim('Assignment:')} ${assignment.id}\n`);
    });

// ─── comment ───────────────────────────────────────────────
program
    .command('comment <taskId> <body>')
    .description('Add a comment to a task')
    .option('--author <id>', 'Author ID', 'cli')
    .option('--type <type>', 'Author type: human or agent', 'agent')
    .action((taskId: string, body: string, opts: any) => {
        ensureStore();
        const comment = {
            id: randomUUID(),
            type: 'task-comment',
            typeName: 'Task comment',
            fields: {
                taskId,
                authorId: opts.author,
                authorType: opts.type,
                body,
                createdAt: new Date().toISOString(),
                resolvedAt: '',
            },
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };
        const dir = getTypeDir('task-comment');
        writeFileSync(join(dir, `${comment.id}.json`), JSON.stringify(comment, null, 2));
        console.log(chalk.green(`\n  ✔ Comment added to task ${taskId}`));
        console.log(`  ${chalk.dim('ID:')} ${comment.id}\n`);
    });

program.parse();

