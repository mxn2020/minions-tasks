---
title: Quick Start
description: Get up and running with Minions Tasks in minutes
---

## TypeScript

```typescript
import { createClient } from '@minions-tasks/sdk';

const client = createClient();
console.log('Version:', client.version);
```

## Python

```python
from minions_tasks import create_client

client = create_client()
print(f"Version: {client['version']}")
```

## CLI

```bash
tasks info
```
