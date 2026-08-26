# Mandatory Skill Discovery & Application Rule (Ecosystem First)

## Autonomous Workflow for Tasks and Features
Whenever the user requests any feature, architecture design, refactoring, performance optimization, security audit, or complex task:

1. **AUTONOMOUS ECOSYSTEM DISCOVERY (MANDATORY FIRST STEP)**:
   - Identify the primary technology/domain of the task (e.g., Supabase Auth, PostgreSQL Indexing, Tailwind CSS, Next.js, Web Performance, E2E Testing, Security Audits).
   - Check if an active skill is already installed in `.agents/skills/<skill-name>`.
   - If not already installed or if a newer/better skill is needed, execute the `find-skills` workflow (`npx skills find <topic>` or `npx skills add <package> -y`) to automatically discover and install the latest industry-standard, security-audited skill from the open ecosystem (skills.sh).
   - Read the installed `SKILL.md` using `view_file` to adopt its exact rules and patterns.

2. **ENFORCE SKILL GUIDELINES**:
   - Strictly follow the conventions, anti-patterns, and security guidelines from the loaded skill.
   - State clearly at the beginning of the response which skill from the ecosystem is guiding the implementation.
