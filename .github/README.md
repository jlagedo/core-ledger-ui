# GitHub Copilot Instructions Setup

This directory contains GitHub Copilot instructions to provide context-aware guidance when working with this repository.

## Overview

The Copilot instructions are organized into multiple files, each targeting specific file types or areas of the codebase:

### Main Instructions File
- **`copilot-instructions.md`** - High-level project overview, quick reference, and core principles

### Specialized Instructions Files
- **`typescript.instructions.md`** - TypeScript & Angular development guidance (applies to `**/*.ts`)
- **`testing.instructions.md`** - Testing best practices and guidelines (applies to `**/*.spec.ts`)
- **`styling.instructions.md`** - Template & styling conventions (applies to `**/*.html`, `**/*.scss`)
- **`auth.instructions.md`** - Authentication system guidance (applies to `src/app/auth/**/*`)
- **`environment.instructions.md`** - Environment configuration (applies to `src/environments/**/*.ts`)
- **`store.instructions.md`** - State management & stores (applies to `**/*-store.ts`)

## How It Works

Each specialized instructions file includes frontmatter with an `applyTo` pattern that tells GitHub Copilot when to use those instructions:

```markdown
---
applyTo: "**/*.ts,**/*.tsx"
---

# Instructions content...
```

This ensures developers get relevant, context-aware guidance based on the files they're working with.

## Benefits

1. **Context-Aware Guidance** - Different instructions apply to different file types
2. **Better Organization** - Specialized instructions are easier to maintain and update
3. **Comprehensive Coverage** - Covers all major areas: TypeScript, testing, styling, auth, config, state
4. **Best Practices** - Codifies project conventions and patterns for consistency
5. **Onboarding** - New developers get guidance automatically through Copilot

## Usage

These instructions work automatically with:
- **GitHub Copilot** in VS Code, Visual Studio, JetBrains IDEs, Neovim
- **GitHub Copilot Chat** for conversational assistance
- **GitHub Copilot Workspace** for larger code generation tasks

No manual configuration required - just use Copilot as normal!

## Maintenance

When updating instructions:
1. Keep the main `copilot-instructions.md` focused on high-level overview
2. Add detailed, specific guidance to the appropriate specialized file
3. Ensure frontmatter `applyTo` patterns accurately target the right files
4. Test instructions by using Copilot in relevant file types
5. Keep instructions concise but comprehensive

## Documentation Reference

For more information about GitHub Copilot instructions:
- [GitHub Copilot Documentation](https://docs.github.com/en/copilot/customizing-copilot/adding-custom-instructions-for-github-copilot)
- [Best Practices for Copilot Instructions](https://gh.io/copilot-coding-agent-tips)

## Related Documentation

Additional project documentation:
- `../README.md` - Project setup and installation
- `../CLAUDE.md` - Detailed architecture and patterns
- `../TESTING_GUIDELINES.md` - Comprehensive testing guidelines
- `../ENVIRONMENT_SETUP.md` - Environment configuration guide
