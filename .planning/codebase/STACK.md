# Technology Stack

**Analysis Date:** 2026-03-15

## Languages

**Primary:**
- JavaScript (Node.js) - CLI tools, hooks, core runtime

**Secondary:**
- Markdown - Configuration, templates, documentation

## Runtime

**Environment:**
- Node.js 22.16.0 (or compatible)

**Package Manager:**
- npm/yarn (inferred from package.json structure)
- Lockfile: Present (`.claude/package.json`)

## Frameworks

**Core:**
- GSD Framework (Get Shit Done) - Project management and phase orchestration system
- Custom CLI Tool Stack - Modular command library for project state management

**Utilities:**
- File system operations - `fs`, `path` (Node.js builtins)
- Git integration - `child_process.execSync` for git commands
- Child process management - `child_process` (spawn, execSync)

## Key Dependencies

**Critical:**
- Built-in Node.js modules only: `fs`, `path`, `child_process`, `os`
- No external npm dependencies (standalone compiled distribution)

**Infrastructure:**
- Frontmatter YAML parser (custom implementation in `lib/frontmatter.cjs`)
- Git CLI wrapper (via `execSync`)
- Markdown parser (custom implementation)

## Configuration

**Environment:**
- `CLAUDE_CONFIG_DIR` - Override config directory (supports multi-account setups)
- `BRAVE_API_KEY` - Optional Brave Search API key for web search integration
- Respects multiple AI IDE config directories: `.claude/`, `.opencode/`, `.gemini/`, `.config/opencode/`

**Build:**
- CommonJS modules (`.cjs` extension)
- Entry point: `bin/gsd-tools.cjs`
- Modular library structure: `bin/lib/*.cjs`

**Runtime Configuration:**
- `.planning/config.json` - Project-level configuration
- `~/.gsd/defaults.json` - User-level defaults
- `~/.gsd/brave_api_key` - Brave Search API credentials (file or env var)
- `.planning/STATE.md` - Project state (frontmatter + markdown)
- `.planning/ROADMAP.md` - Phase roadmap with progress tracking

## Platform Requirements

**Development:**
- Node.js 20+ (tested on 22.16.0)
- Git 2.50+ (for version control integration)
- Unix-like shell (bash/zsh) or compatible Windows shell
- Support for symlinks (if Claude IDE uses them)

**Production:**
- Deployed as distributed files in `.claude/get-shit-done/`
- Runs within Claude Code/OpenCode/Gemini IDE environments
- Hooks run via IDE SessionStart and PostToolUse lifecycle events
- Git access required for phase/milestone operations

## Performance Characteristics

**Large File Handling:**
- JSON payloads > 50KB written to temporary files (`/tmp/gsd-{timestamp}.json`)
- Callers detect `@file:` prefix to read results from disk
- Stdin timeout guard (3s) prevents hanging on pipe issues

**Concurrency:**
- Single-threaded Node.js event loop
- Background update checks spawn child processes without blocking
- Context monitoring uses temporary files for inter-process communication

## Special Notes

**No External Dependencies:**
This is a zero-dependency CLI tool. All functionality built with Node.js builtins and custom implementations. Makes distribution simple and update-safe.

**Multiple AI IDE Support:**
Detects and supports Claude Code, OpenCode (Codex), and Gemini AI IDE environments through config directory detection.

**Git Integration:**
Direct git CLI invocation via `execSync`. No git library dependency. Commands: commits, phase branching, milestone tagging.

---

*Stack analysis: 2026-03-15*
