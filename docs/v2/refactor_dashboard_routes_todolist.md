# To-Do List: Refactor Dashboard Routes

## Goal 
Migrate routes from `src/app/{admin, teacher, parent, student}` to `src/app/dashboard/{teacher, admin, parent, student}` incrementally, excluding `dashboard_navbar` and `sidebar` components.

## Phase 1: Preparation and Analysis

*   [ ] Review `constitution.md` for guiding principles on modular architecture, development workflow, and governance that apply to this refactoring.
*   [ ] Consider creating a formal `spec.md` for this refactoring using the `spec-template.md` and `speckit.specify` command to fully define its scope, requirements, and success criteria.
*   [ ] Analyze `src/app/admin` to identify all files, subdirectories, and their dependencies.
*   [ ] Analyze `src/app/teacher` to identify all files, subdirectories, and their dependencies.
*   [ ] Analyze `src/app/parent` to identify all files, subdirectories, and their dependencies.
*   [ ] Analyze `src/app/student` to identify all files, subdirectories, and their dependencies.
*   [ ] Identify any components within these directories that are *not* directly part of the route logic but might be shared (e.g., specific modals, utility components) and ensure they are *not* moved, or are moved to a shared component directory if appropriate. Exclude `dashboard_navbar` and `sidebar`.
*   [ ] Understand how `dashboard_navbar` and `sidebar` are currently used and how their paths might be affected by the move, if at all (they should remain in their current location, likely `src/components`).
*   [ ] Map out new file paths for all components and pages to be moved.

## Phase 2: Execution of Migration

*   [ ] Create target directories: `src/app/dashboard/teacher`, `src/app/dashboard/admin`, `src/app/dashboard/parent`, `src/app/dashboard/student`.
*   [ ] Move files and subdirectories from `src/app/admin` to `src/app/dashboard/admin`.
*   [ ] Move files and subdirectories from `src/app/teacher` to `src/app/dashboard/teacher`.
*   [ ] Move files and subdirectories from `src/app/parent` to `src/app/dashboard/parent`.
*   [ ] Move files and subdirectories from `src/app/student` to `src/app/dashboard/student`.
*   [ ] Update all absolute and relative import paths in the moved files to reflect their new locations. This will be the most complex step.
*   [ ] Update any configuration files or routing definitions that reference the old paths.

## Phase 3: Verification and Cleanup

*   [ ] Run the application and thoroughly test all affected routes and functionalities.
*   [ ] Ensure `dashboard_navbar` and `sidebar` are still functioning correctly and their paths are undisturbed.
*   [ ] Remove the old, now empty, directories: `src/app/admin`, `src/app/teacher`, `src/app/parent`, `src/app/student`.
*   [ ] Address any linter warnings or errors.

## Phase 4: Database Schema and URL Considerations

*   [ ] This refactoring is being done with the knowledge that the Prisma schema and database URL will be changing soon. The current refactor *should not* depend on these changes, but future work might need to coordinate.
*   [ ] Ensure the migration doesn't introduce any database-related breaking changes prematurely.
