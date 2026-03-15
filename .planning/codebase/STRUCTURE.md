# Codebase Structure

**Analysis Date:** 2026-03-15

## Directory Layout

```
/Users/chad.cluff/personal/twittercelebrity/
├── .claude/                    # GSD framework configuration and agents
│   ├── agents/                 # Specialized agent implementations
│   ├── commands/               # CLI command routing
│   ├── get-shit-done/         # Core framework, templates, references
│   │   ├── bin/               # Executable scripts and utilities
│   │   ├── templates/         # Output templates for various workflows
│   │   ├── references/        # System documentation and specifications
│   │   └── workflows/         # Workflow definitions (deprecated/reference)
│   ├── hooks/                 # Lifecycle hooks (session start, post-tool)
│   ├── settings.json          # Framework configuration with hooks
│   ├── package.json           # Node.js package metadata
│   └── gsd-file-manifest.json # State manifest with file hashes
├── .planning/                 # Output directory for planning documents
│   └── codebase/             # Codebase analysis documents (target for mappers)
└── .git/                      # Git repository metadata
```

## Directory Purposes

**`.claude/`:**
- Purpose: Complete GSD framework installation and project-specific configuration
- Contains: Agents, commands, core utilities, configuration, state tracking
- Key files: `settings.json`, `gsd-file-manifest.json`, `package.json`

**`.claude/agents/`:**
- Purpose: Agent implementations for different GSD workflows
- Contains: 16 agent markdown files defining specialized orchestrators
- Key agents:
  - `gsd-codebase-mapper.md`: Maps codebase structure and writes analysis docs
  - `gsd-planner.md`: Creates implementation plans from phase descriptions
  - `gsd-executor.md`: Executes phases and writes code
  - `gsd-debugger.md`: Diagnoses and fixes failing tests/implementations
  - `gsd-phase-researcher.md`: Researches and clarifies phase requirements
  - `gsd-verifier.md`: Tests implementation against requirements
  - `gsd-plan-checker.md`: Validates implementation plans
  - `gsd-project-researcher.md`: Researches greenfield projects
  - `gsd-integration-checker.md`: Tests integration with external services
  - `gsd-ui-auditor.md`: Audits UI implementation against specs
  - `gsd-ui-checker.md`: Verifies UI functionality
  - `gsd-ui-researcher.md`: Researches UI/UX requirements
  - `gsd-roadmapper.md`: Creates project roadmaps
  - `gsd-research-synthesizer.md`: Synthesizes research findings
  - `gsd-nyquist-auditor.md`: Audits for Nyquist (framework-specific) compliance

**`.claude/commands/`:**
- Purpose: CLI command interface routing
- Contains: Command definitions that map user input to agents
- Key files: Command routing configuration

**`.claude/get-shit-done/bin/`:**
- Purpose: Core utilities and executable logic
- Contains: Main CLI tool, library modules for state, templates, frontmatter
- Key files:
  - `gsd-tools.cjs`: Main CLI entry point
  - `lib/state.cjs`: State persistence and management
  - `lib/template.cjs`: Template loading and rendering
  - `lib/frontmatter.cjs`: Frontmatter parsing/generation
  - `lib/phase.cjs`: Phase calculation and management
  - `lib/milestone.cjs`: Milestone handling
  - `lib/commands.cjs`: Command parsing
  - `lib/core.cjs`: Core framework logic
  - `lib/model-profiles.cjs`: Model configuration handling

**`.claude/get-shit-done/templates/`:**
- Purpose: Define consistent structure for generated documents
- Contains: 50+ markdown templates for different workflow outputs
- Key templates:
  - `codebase/`: Architecture, structure, conventions, testing, stack, integrations, concerns analysis templates
  - `milestone.md`: Milestone structure template
  - `phase-prompt.md`: Phase definition template
  - `project.md`: Project metadata template
  - `requirements.md`: Requirements specification template
  - `discovery.md`: Discovery phase findings template
  - Various agent sub-prompts and validation templates

**`.claude/get-shit-done/references/`:**
- Purpose: System documentation for framework behaviors
- Contains: 15+ reference documents explaining algorithms and integrations
- Key references:
  - `decimal-phase-calculation.md`: Phase numbering scheme (0.0, 0.1, 1.0, etc.)
  - `git-integration.md`: Git workflow with GSD
  - `model-profile-resolution.md`: Model selection algorithm
  - `phase-argument-parsing.md`: CLI argument parsing rules
  - `planning-config.md`: Planning configuration schema
  - `verification-patterns.md`: Test/verification patterns
  - `tdd.md`: Test-driven development approach

**`.claude/hooks/`:**
- Purpose: Lifecycle event handlers
- Contains: Node.js scripts for framework initialization and monitoring
- Key hooks:
  - `gsd-check-update.js`: SessionStart hook for update checking
  - `gsd-context-monitor.js`: PostToolUse hook for context tracking
  - `gsd-statusline.js`: Status display during operations

**`.planning/`:**
- Purpose: Output directory for planning and analysis documents
- Contains: Generated documents from mappers, planners, and other agents
- Key directories:
  - `.planning/codebase/`: Target location for codebase analysis (ARCHITECTURE.md, STRUCTURE.md, CONVENTIONS.md, TESTING.md, STACK.md, INTEGRATIONS.md, CONCERNS.md)

## Key File Locations

**Entry Points:**
- `/.claude/get-shit-done/bin/gsd-tools.cjs`: Main CLI entry point for all GSD commands
- `/.claude/settings.json`: Framework configuration and hook definitions

**Configuration:**
- `/.claude/settings.json`: Hook configuration and status monitoring
- `/.claude/package.json`: Node.js package metadata (CommonJS)
- `/.claude/gsd-file-manifest.json`: File state manifest with SHA256 hashes

**Core Logic:**
- `/.claude/get-shit-done/bin/lib/core.cjs`: Framework core logic
- `/.claude/get-shit-done/bin/lib/state.cjs`: State management
- `/.claude/get-shit-done/bin/lib/commands.cjs`: Command routing

**Agent Implementations:**
- `/.claude/agents/gsd-codebase-mapper.md`: Focus for this analysis task
- `/.claude/agents/gsd-planner.md`: Phase planning orchestrator
- `/.claude/agents/gsd-executor.md`: Code execution orchestrator

**Testing & Validation:**
- `/.claude/get-shit-done/references/verification-patterns.md`: Test patterns documentation
- `/.claude/agents/gsd-verifier.md`: Implementation verification agent

## Naming Conventions

**Files:**
- Agent files: `gsd-[function].md` (e.g., `gsd-codebase-mapper.md`, `gsd-planner.md`)
- Hook files: `gsd-[trigger].js` (e.g., `gsd-check-update.js`, `gsd-context-monitor.js`)
- Template files: `[TITLE].md` with uppercase names (e.g., `ARCHITECTURE.md`, `VALIDATION.md`)
- Reference files: `[topic].md` in lowercase (e.g., `decimal-phase-calculation.md`, `git-integration.md`)
- Workflow files: `[action]-[phase].md` (e.g., `execute-phase.md`, `plan-phase.md`)

**Directories:**
- Utility directories: lowercase with hyphens (e.g., `get-shit-done`, `bin`, `lib`)
- Content directories: descriptive plural (e.g., `agents`, `templates`, `references`, `workflows`, `commands`, `hooks`)

## Where to Add New Code

**New Agent Implementation:**
- Primary code: `/.claude/agents/gsd-[function-name].md`
- Pattern: Markdown file with agent behavior definition (consumed by orchestrator)
- Reference existing agents as examples of expected structure

**New Hook:**
- Implementation: `/.claude/hooks/gsd-[event-type]-[function].js`
- Register in: `/.claude/settings.json` under appropriate hook trigger
- Pattern: Node.js CommonJS module exporting exit code-based status

**New Template:**
- Location: `/.claude/get-shit-done/templates/[category]/[TEMPLATE-NAME].md`
- Pattern: Markdown with `[Placeholder]` syntax for dynamic content
- Documentation: Add to references if template has special requirements

**New Reference Documentation:**
- Location: `/.claude/get-shit-done/references/[topic].md`
- Pattern: Markdown specification or algorithm documentation
- Usage: Linked from agent implementations when complex behavior needs explanation

**New Workflow:**
- Location: `/.claude/get-shit-done/workflows/[action]-[phase].md`
- Pattern: Markdown with sequential steps (currently largely deprecated in favor of agents)

**Codebase Analysis Output:**
- Location: `/.planning/codebase/[DOCUMENT-TYPE].md`
- Naming: UPPERCASE.md (ARCHITECTURE.md, STRUCTURE.md, CONVENTIONS.md, etc.)
- Pattern: Markdown with consistent sections per template
- Trigger: `gsd-codebase-mapper.md` agent writes these during mapping

## Special Directories

**`/.claude/get-shit-done/`:**
- Purpose: Core framework distribution
- Generated: No (manually maintained)
- Committed: Yes (part of framework)

**`/.planning/codebase/`:**
- Purpose: Target for codebase analysis documents
- Generated: Yes (created by codebase-mapper agent)
- Committed: Yes (version controlled as project analysis)

**`/.claude/gsd-file-manifest.json`:**
- Purpose: State persistence for file tracking
- Generated: Yes (updated by framework utilities)
- Committed: Yes (tracks project state over time)

---

*Structure analysis: 2026-03-15*
