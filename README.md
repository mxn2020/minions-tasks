# minions-tasks

**Task and work management across agents, humans, and workflows**

Built on the [Minions SDK](https://github.com/mxn2020/minions).

---

## Quick Start

```bash
# TypeScript / Node.js
npm install @minions-tasks/sdk minions-sdk

# Python
pip install minions-tasks

# CLI (global)
npm install -g @minions-tasks/cli
```

---

## CLI

```bash
# Show help
tasks --help
```

---

## Python SDK

```python
from minions_tasks import create_client

client = create_client()
```

---

## Project Structure

```
minions-tasks/
  packages/
    core/           # TypeScript core library (@minions-tasks/sdk on npm)
    python/         # Python SDK (minions-tasks on PyPI)
    cli/            # CLI tool (@minions-tasks/cli on npm)
  apps/
    web/            # Playground web app
    docs/           # Astro Starlight documentation site
    blog/           # Blog
  examples/
    typescript/     # TypeScript usage examples
    python/         # Python usage examples
```

---

## Development

```bash
# Install dependencies
pnpm install

# Build all packages
pnpm run build

# Run tests
pnpm run test

# Type check
pnpm run lint
```

---

## Documentation

- Docs: [tasks.minions.help](https://tasks.minions.help)
- Blog: [tasks.minions.blog](https://tasks.minions.blog)
- App: [tasks.minions.wtf](https://tasks.minions.wtf)

---

## License

[MIT](LICENSE)
