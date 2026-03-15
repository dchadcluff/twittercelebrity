# External Integrations

**Analysis Date:** 2026-03-15

## APIs & External Services

**Web Search:**
- Brave Search - Optional web search capability for research phases
  - SDK/Client: Native `fetch()` (Node.js builtin)
  - Auth: `BRAVE_API_KEY` environment variable or `~/.gsd/brave_api_key` file
  - Endpoint: `https://api.search.brave.com/res/v1/web/search`
  - Headers: `X-Subscription-Token: {apiKey}`, `Accept: application/json`
  - Features: Freshness filtering (day/week/month), result limits, descriptions
  - Fallback: If not configured, agent uses built-in web search (silent skip)

## Data Storage

**Databases:**
- Not used - No SQL/NoSQL database integration

**File Storage:**
- Local filesystem only
- Storage locations:
  - `.planning/` - Project root for all planning documents
  - `.planning/config.json` - Configuration
  - `.planning/STATE.md` - Project state
  - `.planning/ROADMAP.md` - Roadmap with progress
  - `.planning/phases/` - Phase directories
  - `.planning/milestones/` - Archived milestones
  - `.planning/todos/` - Task tracking (pending/completed)

**Caching:**
- File-based caching for update checks: `.claude/cache/gsd-update-check.json`
- Session metrics cache: `/tmp/claude-ctx-{session_id}.json` (temporary)
- Debounce cache for warnings: `/tmp/claude-ctx-{session_id}-warned.json`

## Authentication & Identity

**Auth Provider:**
- None - CLI tool runs within authenticated IDE environment
- IDE authentication handled by Claude Code/OpenCode/Gemini (outside GSD scope)

**Brave Search Auth:**
- API key-based authentication
- Stored as environment variable (`BRAVE_API_KEY`) or file (`~/.gsd/brave_api_key`)
- No OAuth or user account management

## Monitoring & Observability

**Error Tracking:**
- None - Errors logged to stderr
- No external error reporting service

**Logs:**
- Console output (stdout/stderr)
- Temporary files for large payloads
- Git log for version history
- No centralized logging

**Context Monitoring:**
- Session context metrics tracked in `/tmp/claude-ctx-{session_id}.json`
- PostToolUse hook reads metrics and injects warnings when context > 65% used
- WARNING threshold: >= 35% remaining context
- CRITICAL threshold: >= 25% remaining context
- Debounce: 5 tool uses between warnings (escalation bypasses debounce)

## CI/CD & Deployment

**Hosting:**
- Distributed as files within IDE config directories
- Runs locally on user machines (no cloud backend)
- No deployment required - pure filesystem distribution

**CI Pipeline:**
- Git integration for commit/push operations (no external CI service)
- Phase branching strategy: configurable (none/auto/manual)
- Milestone tagging via git tags

**Version Management:**
- Single VERSION file tracking framework version
- Update checks run in background
- Supports project-level version override (project VERSION takes precedence over global)

## Environment Configuration

**Required env vars:**
- None - All features optional or have sensible defaults

**Optional env vars:**
- `BRAVE_API_KEY` - Brave Search API key for web search
- `CLAUDE_CONFIG_DIR` - Override IDE config directory detection

**Secrets location:**
- `BRAVE_API_KEY` via environment variable or `~/.gsd/brave_api_key` file
- No other secrets required

## Webhooks & Callbacks

**Incoming:**
- None - GSD is not a server or webhook receiver

**Outgoing:**
- Git commits - Phase/milestone operations generate git commits with standardized messages
- Git branches - Phase branch creation for work isolation (optional)
- Git tags - Milestone completion creates git tags

## IDE Hooks & Lifecycle Integration

**Claude Code Hooks (settings.json):**
- `SessionStart`: `node .claude/hooks/gsd-check-update.js` - Update check in background
- `PostToolUse`: `node .claude/hooks/gsd-context-monitor.js` - Context monitoring
- Status line: `node .claude/hooks/gsd-statusline.js` - Display project status

**Hook Communications:**
- Update check: Writes to `.claude/cache/gsd-update-check.json`
- Context monitor: Reads from `/tmp/claude-ctx-{session_id}.json`, writes warnings to stdin
- Status line: Reads project state for display

## Inter-Process Communication

**Temporary Files:**
- `/tmp/gsd-{timestamp}.json` - Large JSON payloads (> 50KB)
- `/tmp/claude-ctx-{session_id}.json` - Context metrics (PostToolUse hook)
- `/tmp/claude-ctx-{session_id}-warned.json` - Warning debounce state

**File-Based Queues:**
- Project state files: `.planning/STATE.md`
- Phase plans: `.planning/phases/{N}-{name}/PLAN.md`
- Summaries: `.planning/phases/{N}-{name}/SUMMARY.md`

## Model Resolution

**Claude Model Selection:**
- Per-profile model mappings defined in `lib/model-profiles.cjs`
- Profiles: `fast`, `balanced`, `thorough`, `multipass`
- Agents: gsd-planner, gsd-executor, gsd-debugger, gsd-verifier, etc.
- Runtime resolution: `resolve-model {agent-type}` command

---

*Integration audit: 2026-03-15*
