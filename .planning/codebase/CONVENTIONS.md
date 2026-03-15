# Coding Conventions

**Analysis Date:** 2026-03-15

## Naming Patterns

**Files:**
- kebab-case for all files (command-handler.js, gsd-tools.cjs, core.cjs)
- CommonJS modules use .cjs extension for clarity
- Hook files prefixed with gsd- (gsd-statusline.js, gsd-context-monitor.js, gsd-check-update.js)
- Library modules in `bin/lib/` with descriptive names (state.cjs, commands.cjs, verify.cjs, frontmatter.cjs)

**Functions:**
- camelCase for all functions (cmdStateLoad, execGit, safeReadFile, toPosixPath)
- Command functions prefixed with cmd (cmdGenerateSlug, cmdCurrentTimestamp, cmdListTodos)
- Internal helper functions use camelCase without prefix (stateExtractField, loadConfig, stateReplaceField)
- No async prefix - async functions follow same naming convention

**Variables:**
- camelCase for all variables (fileContent, configPath, statusExists)
- UPPER_SNAKE_CASE for constants (CRITICAL_THRESHOLD = 25, WARNING_THRESHOLD = 35, AUTO_COMPACT_BUFFER_PCT = 16.5)
- cwd is standard abbreviation for current working directory
- No underscore prefix for private members in CommonJS modules

**Types:**
- No TypeScript in this codebase - all CommonJS JavaScript
- Object structures used instead of interfaces
- Naming follows property convention (modelProfile, commitDocs, branchingStrategy)

## Code Style

**Formatting:**
- No Prettier or strict code formatter enforced
- Common patterns: 2 space indentation observed in code blocks
- Semicolons present but not universally enforced
- Single quotes used inconsistently (both single and double quotes appear)
- Line length varies, but generally readable within 80-100 characters

**Linting:**
- No ESLint configuration detected
- Code follows informal conventions from team review
- Comments indicate awareness of specific patterns and workarounds

## Import Organization

**Order:**
1. External packages (fs, path, child_process, require statements from Node core)
2. Internal modules (require('./lib/core.cjs'))
3. Destructuring from imported modules on same line as require

**Grouping:**
- Destructuring combined with require: `const { safeReadFile, loadConfig } = require('./core.cjs')`
- All imports typically at top of file, before function definitions
- No blank line separation typically used between import groups

**Path Aliases:**
- No path aliases configured
- All imports use relative paths (./lib/..., ../../lib/...)
- Recommended for new code: consistent relative path structure

## Error Handling

**Patterns:**
- Throw errors for invalid input or missing resources: `error('Missing value for --cwd')`
- Centralized error function: `error(message)` writes to stderr and exits with code 1
- try/catch blocks for file operations with graceful fallbacks: `try { ... } catch { return null; }`
- Silent failures (catch without action) used for non-critical operations

**Error Types:**
- Custom error function `error()` rather than throwing Error instances
- All errors exit process with code 1
- File operations often use safe wrappers like `safeReadFile()` that return null on failure
- No custom error classes - string messages passed to error()

**Strategy:**
- Validate arguments early and exit with helpful message
- Wrap risky operations (fs reads) in try/catch, log or return null
- For long-running operations (background processes), use silent failure to avoid blocking

## Logging

**Framework:**
- No centralized logging library (no pino, winston, etc.)
- Uses process.stdout, process.stderr for output
- Comments explain control flow and edge cases

**Patterns:**
- `output(result, raw, rawValue)` handles JSON or raw output
- Structured output to stdout as JSON when not in raw mode
- For very large payloads (>50KB), write to temp file and output path prefixed with @file:
- No debug logging throughout - comments used instead
- Silent failures preferred for non-blocking operations (statusline, hooks)

## Comments

**When to Comment:**
- Explain business logic and thresholds: `// WARNING_THRESHOLD  (remaining <= 35%): Agent should wrap up`
- Document cross-platform concerns: `// Timeout guard: if stdin doesn't close within 3s... See #775`
- Clarify counter-intuitive code: `// Normalize: subtract buffer from remaining, scale to usable range`
- Explain why, not what: prefer comments that explain intent over code review

**JSDoc/TSDoc:**
- Not used in this codebase (pure JavaScript, no TypeScript)
- File headers provide context: /** * GSD Tools — CLI utility for GSD workflow operations */
- Top of files document purpose concisely

**TODO Comments:**
- Format: `// TODO: description` with issue reference when applicable: `// TODO: Fix race condition (issue #123)`
- Not consistently used - reserved for significant future work

## Function Design

**Size:**
- Functions typically 10-50 lines
- Long commands delegated to sub-functions (cmdState routes to sub-subcommands)
- Extract helper functions for repeated logic patterns

**Parameters:**
- Max 3 parameters typical
- Use objects for 4+ parameters: `function cmdTemplateFill(cwd, templateType, options, raw)`
- Destructure from config/options objects when needed

**Return Values:**
- Explicit output() function handles return values (no direct returns)
- Functions exit process or call output() - no value returns in main flow
- Helper functions return values; cmd functions output and exit

## Module Design

**Exports:**
- All CommonJS exports use module.exports
- Export individual functions: `module.exports = { cmdGenerateSlug, cmdCurrentTimestamp, ... }`
- Modules organized by responsibility (state.cjs exports all state operations, commands.cjs exports utility commands)

**Barrel Files:**
- No barrel files used
- Each .cjs module exports its own functions
- gsd-tools.cjs imports and routes to specific module functions

**File Organization:**
- Large modules like phase.cjs group related operations together
- Each cmd function is self-contained but may call internal helpers
- Clear separation: public cmd* functions vs private helper functions

**Dependency Management:**
- Avoid circular dependencies through careful module design
- gsd-tools.cjs is the central router - imports from lib modules, lib modules don't import gsd-tools.cjs
- Common utilities in core.cjs required by other modules

---

*Convention analysis: 2026-03-15*
*Update when patterns change*
