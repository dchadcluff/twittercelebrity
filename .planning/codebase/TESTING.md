# Testing Patterns

**Analysis Date:** 2026-03-15

## Test Framework

**Runner:**
- No centralized test framework detected (no Jest, Vitest, Mocha)
- Testing approach: manual testing with manual verification
- Note: This project is a code generation and workflow automation system, not a traditional application with unit tests

**Assertion Library:**
- Not applicable - no automated test suite

**Run Commands:**
- No test commands in package.json
- Verification done through manual CLI testing and verification scripts
- Each major operation includes verification steps in documentation

## Test File Organization

**Location:**
- No *.test.js or *.spec.js files detected in codebase
- No __tests__/ directories present
- Testing happens through GSD workflows and manual verification

**Verification Instead of Unit Tests:**
- Each major operation includes verification specs: `verify plan-structure`, `verify phase-completeness`, `verify references`
- Reference: `/Users/chad.cluff/personal/twittercelebrity/.claude/get-shit-done/bin/lib/verify.cjs`
- Verification checks are embedded in gsd-tools commands

**Structure:**
- Verification commands in verify.cjs
- Each verify command checks specific properties of generated files
- Roadmap.md parsing validates consistency
- State.md frontmatter validated through dedicated functions

## Test Strategy

**Verification Approach:**
- Instead of unit tests, this project uses **verification scripts**
- `cmdVerifySummary()` in verify.cjs checks SUMMARY.md files post-execution
- `cmdVerifyPlanStructure()` validates PLAN.md structure and task definitions
- `cmdVerifyPhaseCompleteness()` ensures all plans have corresponding summaries
- `cmdVerifyReferences()` validates @-references and file paths resolve

**Verification Examples:**

```javascript
// From verify.cjs - spot-checking files mentioned in summaries
function cmdVerifySummary(cwd, summaryPath, checkFileCount, raw) {
  // Check 1: Summary exists
  if (!fs.existsSync(fullPath)) {
    return { passed: false, errors: ['SUMMARY.md not found'] };
  }

  // Check 2: Spot-check files mentioned in summary
  const mentionedFiles = new Set();
  const patterns = [
    /`([^`]+\.[a-zA-Z]+)`/g,
    /(?:Created|Modified|Added):\s*`?([^\s`]+\.[a-zA-Z]+)`?/gi,
  ];

  // Extract and validate each mentioned file exists
  for (const filePath of mentionedFiles) {
    if (!fs.existsSync(path.join(cwd, filePath))) {
      errors.push(`File not found: ${filePath}`);
    }
  }

  return { passed: errors.length === 0, errors };
}
```

**Manual Testing Protocol:**
1. Create phase/plan with scaffolding commands
2. Run plan execution
3. Run verification commands post-execution: `gsd-tools verify-summary <path>`
4. Review generated SUMMARY.md for correctness
5. Check git commits created as expected

## Coverage Approach

**Requirements:**
- No automated coverage target
- Manual spot-checking of critical paths:
  - Frontmatter parsing for all document types (PLAN.md, SUMMARY.md, STATE.md)
  - Phase numbering and renumbering logic
  - Git commit creation and message formatting
  - Markdown parsing and modification

**Tested Areas:**
- Phase operations (phase-next-decimal, phase-add, phase-complete)
- State management (state load, state update, state patch)
- Frontmatter extraction and validation
- File existence checks
- Path normalization

**Verification via:**
- `validate consistency` - checks phase numbering, disk/roadmap sync
- `validate health` - checks .planning/ directory integrity with repair capability
- `verify commits` - batch verify commit hashes exist in git
- `verify artifacts` - check must_haves.artifacts in plans match reality

## Test Types

**Verification Checks (Functional Testing):**
- **Plan structure validation**: Checks PLAN.md has required frontmatter, tasks with type attributes, success_criteria
  - Run: `gsd-tools verify plan-structure <path>`
  - File: `/Users/chad.cluff/personal/twittercelebrity/.claude/get-shit-done/bin/lib/verify.cjs`

- **Phase completeness**: Ensures every plan has a corresponding SUMMARY.md
  - Run: `gsd-tools verify phase-completeness <phase>`

- **Reference validation**: Verifies @-references in documents resolve to actual files/sections
  - Run: `gsd-tools verify references <file>`

- **Commit verification**: Checks git commits exist for claimed hashes
  - Run: `gsd-tools verify commits <h1> [h2] ...`

- **Summary verification**: Spot-checks files mentioned in SUMMARY.md actually exist
  - Run: `gsd-tools verify-summary <path>`
  - Default checks 2 files, configurable via --check-count

**Integration Testing:**
- Full workflow testing via GSD commands
- End-to-end phase planning → execution → verification pipeline
- Manual testing against sample projects in .claude/commands/gsd/

**Consistency Testing:**
- `validate consistency` checks:
  - All phase directories numbered correctly in ROADMAP.md
  - Phase directory numbers match disk
  - No duplicate phase numbers
  - REQUIREMENTS.md linked requirements exist
- `validate health` checks:
  - .planning/config.json valid JSON
  - STATE.md frontmatter present
  - ROADMAP.md parseable
  - All referenced phases have directories

## Common Test/Verification Patterns

**File Existence Validation:**
```javascript
// Pattern from cmdVerifyPathExists
try {
  const stats = fs.statSync(fullPath);
  const type = stats.isDirectory() ? 'directory' : 'file' : 'other';
  return { exists: true, type };
} catch {
  return { exists: false, type: null };
}
```

**Frontmatter Parsing and Validation:**
```javascript
// Pattern from frontmatter.cjs - extractFrontmatter
// Extract YAML frontmatter from document
const match = content.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)/);
const frontmatter = parseYAML(match[1]);
const body = match[2];

// Validate required fields
if (schema === 'plan') {
  required = ['phase', 'plan', 'type', 'autonomous'];
  missing = required.filter(f => !frontmatter[f]);
}
```

**Safe File Reading:**
```javascript
// Pattern from core.cjs - graceful degradation
function safeReadFile(filePath) {
  try {
    return fs.readFileSync(filePath, 'utf-8');
  } catch {
    return null;  // Silent failure
  }
}

// Used throughout for non-critical file operations
```

**JSON Output with Large Payload Handling:**
```javascript
// Pattern from core.cjs - output function
function output(result, raw, rawValue) {
  if (raw && rawValue !== undefined) {
    process.stdout.write(String(rawValue));
  } else {
    const json = JSON.stringify(result, null, 2);
    // Handle large payloads that exceed Claude Code's buffer (~50KB)
    if (json.length > 50000) {
      const tmpPath = path.join(os.tmpdir(), `gsd-${Date.now()}.json`);
      fs.writeFileSync(tmpPath, json, 'utf-8');
      process.stdout.write('@file:' + tmpPath);
    } else {
      process.stdout.write(json);
    }
  }
}
```

**Phase Numbering Validation:**
```javascript
// Pattern from verify.cjs - comparePhaseNum for sorting
// Handles both integer (1, 2, 3) and decimal (1.1, 1.2, 2.1) phases
function comparePhaseNum(a, b) {
  const aParts = String(a).split('.').map(Number);
  const bParts = String(b).split('.').map(Number);
  // Compare major, then minor phase numbers
}
```

## Adding New Tests/Verification

**For New Features:**
1. Add verification command to verify.cjs: `cmdVerifyFeature()`
2. Register command in gsd-tools.cjs router in verify case
3. Create corresponding test documents or manual test cases in .claude/commands/gsd/
4. Add to reference documentation at top of gsd-tools.cjs

**Manual Testing Checklist:**
- Create sample project with `gsd-tools init new-project`
- Create phase with `gsd-tools phase add "description"`
- Generate PLAN.md with `gsd-tools template fill plan --phase 1`
- Run verification: `gsd-tools verify plan-structure`
- Execute plan and verify: `gsd-tools verify-summary`
- Check consistency: `gsd-tools validate consistency`

**Code Review Focus:**
- Verify error messages provide actionable feedback
- Check file path handling across platforms (use toPosixPath)
- Ensure graceful degradation when optional files missing
- Confirm JSON payloads wrapped with @file: when > 50KB
- Review regex patterns for edge cases (empty fields, special characters)

---

*Testing analysis: 2026-03-15*
*Update when verification patterns change*
