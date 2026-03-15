# Architecture

**Analysis Date:** 2026-03-15

## Pattern Overview

**Overall:** Agent-based Orchestration Framework with Modular Workflows

**Key Characteristics:**
- Multi-agent system architecture with specialized agents for different GSD (Get Shit Done) workflows
- Configuration-driven setup with hook-based event handling
- File-manifest-based state tracking for reproducibility
- Decoupled agent responsibilities with clear separation of concerns

## Layers

**Configuration Layer:**
- Purpose: Define environment settings, hooks, and framework behavior
- Location: `/.claude/settings.json`, `/.claude/package.json`
- Contains: Hook definitions, status line configuration, CommonJS setup
- Depends on: Node.js runtime
- Used by: All agents and framework utilities

**Agent Layer:**
- Purpose: Implement specialized orchestration and planning workflows
- Location: `/.claude/agents/`
- Contains: Individual agent implementations for codebase mapping, planning, execution, debugging, and research
- Depends on: Configuration layer, framework templates, state management
- Used by: CLI commands, user-triggered workflows

**Template & Reference Layer:**
- Purpose: Provide reusable templates and documentation for consistent outputs
- Location: `/.claude/get-shit-done/templates/`, `/.claude/get-shit-done/references/`
- Contains: Markdown templates for projects, phases, milestones; reference docs for git integration, phase calculation, model profiles
- Depends on: Frontmatter parsing utilities
- Used by: Agents for generating structured outputs

**Command Layer:**
- Purpose: Expose CLI interface to trigger workflows
- Location: `/.claude/commands/`
- Contains: Command definitions and routing
- Depends on: Agent layer
- Used by: User shell interface

**State Management Layer:**
- Purpose: Track and persist framework state across sessions
- Location: `/.claude/get-shit-done/bin/lib/state.cjs`
- Contains: State persistence logic
- Depends on: File system
- Used by: All agents for continuity

**Utility & Support Layer:**
- Purpose: Provide cross-cutting functionality
- Location: `/.claude/hooks/`, `/.claude/get-shit-done/bin/lib/`
- Contains: Session hooks (check-update, context-monitor, statusline), core utilities (frontmatter, template parsing, model profiles)
- Depends on: Node.js APIs, configuration
- Used by: All layers

## Data Flow

**Agent Execution Flow:**

1. User invokes GSD command via CLI
2. Command router loads appropriate agent from `/.claude/agents/`
3. Agent reads configuration from `/.claude/settings.json`
4. Agent loads relevant templates from `/.claude/get-shit-done/templates/`
5. Agent processes user input and codebase state
6. Agent generates structured output (markdown with frontmatter) or modifies state
7. Post-execution hooks trigger (context monitoring, status line updates)

**Codebase Mapping Flow:**

1. Mapper agent invoked with focus area (tech, arch, quality, concerns)
2. Reads target codebase structure
3. Selects appropriate templates from `/.claude/get-shit-done/templates/codebase/`
4. Generates analysis documents to `.planning/codebase/`
5. Returns confirmation to user

**State Management:**

- State persisted in `/.claude/gsd-file-manifest.json` with SHA256 hashes of all tracked files
- Enables reproducibility and change detection across sessions
- Agents query manifest to understand project state

## Key Abstractions

**Agent:**
- Purpose: Encapsulates a specific GSD workflow (mapping, planning, execution, debugging, research)
- Examples: `gsd-codebase-mapper.md`, `gsd-planner.md`, `gsd-executor.md`
- Pattern: Markdown files with frontmatter defining agent capabilities and behavior

**Hook:**
- Purpose: Trigger functionality at specific lifecycle points (session start, post-tool-use)
- Examples: `/.claude/hooks/gsd-check-update.js`, `/.claude/hooks/gsd-context-monitor.js`
- Pattern: Node.js scripts executed as part of framework lifecycle

**Workflow:**
- Purpose: Define multi-step procedures for specific tasks
- Examples: `/.claude/get-shit-done/workflows/execute-phase.md`, `/.claude/get-shit-done/workflows/plan-phase.md`
- Pattern: Markdown documents with structured steps and decision points

**Template:**
- Purpose: Provide consistent structure for outputs and documentation
- Examples: `/.claude/get-shit-done/templates/milestone.md`, `/.claude/get-shit-done/templates/phase-prompt.md`
- Pattern: Markdown files with placeholders for dynamic content

**Reference:**
- Purpose: Document system behaviors and algorithms
- Examples: `/.claude/get-shit-done/references/decimal-phase-calculation.md`, `/.claude/get-shit-done/references/git-integration.md`
- Pattern: Detailed specifications for complex behaviors

## Entry Points

**GSD CLI:**
- Location: `/.claude/get-shit-done/bin/gsd-tools.cjs`
- Triggers: User invokes `gsd` command with workflow/agent argument
- Responsibilities: Parse arguments, route to appropriate agent, execute workflow

**Settings Hook:**
- Location: `/.claude/settings.json`
- Triggers: Framework initialization and post-tool-use
- Responsibilities: Configure hooks, status monitoring, runtime behavior

**Commands:**
- Location: `/.claude/commands/`
- Triggers: CLI routing from main tool
- Responsibilities: Map command names to agent implementations

## Error Handling

**Strategy:** Exception propagation with graceful degradation

**Patterns:**
- Hooks use exit codes to signal success/failure (0 = success)
- Agents return structured error information in output
- File operations fail explicitly (no silent swallowing)
- State operations validate manifest integrity before proceeding

## Cross-Cutting Concerns

**Logging:** Multi-level via CLI output; agents write to `.planning/` directory for audit trail

**Validation:** Manifest validation on state operations; frontmatter validation for documents; git state verification before operations

**Persistence:** File manifest-based tracking in `/.claude/gsd-file-manifest.json` with SHA256 checksums for change detection

**Configuration:** Centralized in `/.claude/settings.json` with environment variable overrides possible

---

*Architecture analysis: 2026-03-15*
