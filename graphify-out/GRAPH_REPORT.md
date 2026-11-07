# Graph Report - webmaster  (2026-11-06)

## Corpus Check
- 88 files · ~38,946 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 14 file(s) not represented in the graph (top: (none) 8, .css 4, .example 2)

## Summary
- 744 nodes · 1497 edges · 58 communities (39 shown, 19 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 8 edges (avg confidence: 0.88)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `7bae5fa4`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- Code Flaws Found (Read-Only Audit)
- carousel.tsx
- Home.tsx
- Sidebar & Input Layouts
- Command Palette & Modals
- Avatars, Breadcrumbs & Keys
- form.tsx
- dependencies
- react
- App TypeScript Compiler Config
- Node TypeScript Compiler Config
- shadcn UI Registry Config
- devDependencies
- Menubar UI Component
- app/package.json
- Backend Package Dependencies
- Context Menu Component
- Dropdown Menu Component
- item.tsx
- Select Input Component
- Recharts Visualization Wrapper
- Vaul Drawer Component
- utils.ts
- Sheet & Mobile Sidebar
- Express Backend & JWT Auth
- Backend API Integration Tests
- SQLite Database Connection
- Vite Build & React Plugin
- input-otp
- Home
- @radix-ui/react-accordion
- api.ts
- Sonner Toast Notifications
- Collapsible UI Component
- Root TypeScript Configuration
- Frontend NPM Scripts
- Template & Tooling Documentation
- Fieldnotes Project Overview
- Aspect Ratio Component
- Backend NPM Scripts
- Vite Environment Types
- @radix-ui/react-alert-dialog
- field.tsx
- @radix-ui/react-checkbox
- @radix-ui/react-dialog
- @radix-ui/react-dropdown-menu
- @radix-ui/react-scroll-area
- Account.tsx
- breadcrumb.tsx
- @radix-ui/react-radio-group
- @radix-ui/react-toggle
- @radix-ui/react-tooltip
- react-resizable-panels
- zod@^4.3.5

## God Nodes (most connected - your core abstractions)
1. `cn()` - 272 edges
2. `react` - 56 edges
3. `lucide-react` - 28 edges
4. `Home()` - 24 edges
5. `compilerOptions` - 22 edges
6. `Account()` - 18 edges
7. `compilerOptions` - 18 edges
8. `Code Flaws Found (Read-Only Audit)` - 17 edges
9. `class-variance-authority` - 14 edges
10. `Button()` - 13 edges

## Surprising Connections (you probably didn't know these)
- `8. Account switching state churn in `Home`` --references--> `Home()`  [INFERRED]
  flaws.md → app/src/pages/Home.tsx
- `webmaster Project` --conceptually_related_to--> `Fieldnotes HTML Entry Point`  [INFERRED]
  README.md → app/index.html
- `AlertDialogDescription()` --calls--> `cn()`  [EXTRACTED]
  app/src/components/ui/alert-dialog.tsx → app/src/lib/utils.ts
- `AlertDialogFooter()` --calls--> `cn()`  [EXTRACTED]
  app/src/components/ui/alert-dialog.tsx → app/src/lib/utils.ts
- `AlertDialogHeader()` --calls--> `cn()`  [EXTRACTED]
  app/src/components/ui/alert-dialog.tsx → app/src/lib/utils.ts

## Import Cycles
- 2-file cycle: `app/src/App.tsx -> app/src/pages/Home.tsx -> app/src/App.tsx`

## Hyperedges (group relationships)
- **Fieldnotes Webapp Scaffold & Tooling** — app_readme_react_typescript_vite, app_template_info_stack, app_template_info_structure, app_index_fieldnotes [INFERRED 0.85]

## Communities (58 total, 19 thin omitted)

### Community 0 - "Code Flaws Found (Read-Only Audit)"
Cohesion: 0.11
Nodes (17): 10. Video timer interval recreates on every progress update, 11. Inspect plugin enabled in Vite config, 12. Case-sensitive usernames, 13. Internal error detail exposure, 14. Potential CSS injection if chart config becomes dynamic, 15. No token revocation, 1. Server trusts client-authored progress, 2. Unbounded XP (+9 more)

### Community 1 - "carousel.tsx"
Cohesion: 0.06
Nodes (41): AlertDialogAction(), AlertDialogCancel(), AlertDialogContent(), AlertDialogDescription(), AlertDialogFooter(), AlertDialogHeader(), AlertDialogOverlay(), AlertDialogPortal() (+33 more)

### Community 2 - "Home.tsx"
Cohesion: 0.18
Nodes (19): LessonModal(), LessonModalProps, LessonViewMode, formatSeconds(), parseDurationSeconds(), ProgressPage(), ProgressPageProps, Lesson (+11 more)

### Community 3 - "Sidebar & Input Layouts"
Cohesion: 0.08
Nodes (33): InputGroupInput(), Input(), SidebarContent(), SidebarContext, SidebarContextProps, SidebarFooter(), SidebarGroup(), SidebarGroupAction() (+25 more)

### Community 4 - "Command Palette & Modals"
Cohesion: 0.09
Nodes (23): Checkbox(), Command(), CommandDialog(), CommandGroup(), CommandInput(), CommandItem(), CommandList(), CommandSeparator() (+15 more)

### Community 5 - "Avatars, Breadcrumbs & Keys"
Cohesion: 0.10
Nodes (27): AccordionContent(), AccordionItem(), AccordionTrigger(), Avatar(), AvatarFallback(), AvatarImage(), Card(), CardAction() (+19 more)

### Community 6 - "form.tsx"
Cohesion: 0.17
Nodes (14): @radix-ui/react-label@^2.1.8, FieldLabel(), FormControl(), FormDescription(), FormFieldContext, FormFieldContextValue, FormItem(), FormItemContext (+6 more)

### Community 7 - "dependencies"
Cohesion: 0.06
Nodes (32): dependencies, class-variance-authority@^0.7.1, cmdk@^1.1.1, date-fns@^4.1.0, @hookform/resolvers@^5.2.2, lucide-react@^0.562.0, @radix-ui/react-menubar@^1.1.16, @radix-ui/react-navigation-menu@^1.2.14 (+24 more)

### Community 8 - "react"
Cohesion: 0.19
Nodes (15): react-router@^7.6.1, App(), ProtectedRoute(), Auth(), AuthProps, AuthContext, AuthContextType, AuthProvider() (+7 more)

### Community 9 - "App TypeScript Compiler Config"
Cohesion: 0.08
Nodes (23): compilerOptions, allowImportingTsExtensions, baseUrl, erasableSyntaxOnly, jsx, lib, module, moduleDetection (+15 more)

### Community 10 - "Node TypeScript Compiler Config"
Cohesion: 0.10
Nodes (19): compilerOptions, allowImportingTsExtensions, erasableSyntaxOnly, lib, module, moduleDetection, moduleResolution, noEmit (+11 more)

### Community 11 - "shadcn UI Registry Config"
Cohesion: 0.11
Nodes (18): aliases, components, hooks, lib, ui, utils, iconLibrary, registries (+10 more)

### Community 12 - "devDependencies"
Cohesion: 0.07
Nodes (31): devDependencies, autoprefixer@^10.4.23, eslint@^9.39.1, @eslint/js@^9.39.1, eslint-plugin-react-hooks@^7.0.1, eslint-plugin-react-refresh@^0.4.24, globals@^16.5.0, postcss@^8.5.6 (+23 more)

### Community 13 - "Menubar UI Component"
Cohesion: 0.12
Nodes (12): Menubar(), MenubarCheckboxItem(), MenubarContent(), MenubarItem(), MenubarLabel(), MenubarPortal(), MenubarRadioItem(), MenubarSeparator() (+4 more)

### Community 14 - "app/package.json"
Cohesion: 0.09
Nodes (22): clsx@^2.1.1, embla-carousel-react@^8.6.0, @radix-ui/react-avatar@^1.1.11, @radix-ui/react-context-menu@^2.2.16, @radix-ui/react-hover-card@^1.1.15, @radix-ui/react-select@^2.2.6, @radix-ui/react-slider@^1.3.6, @radix-ui/react-tabs@^1.1.13 (+14 more)

### Community 15 - "Backend Package Dependencies"
Cohesion: 0.14
Nodes (18): dependencies, bcrypt@^6.0.0, cors@^2.8.5, dotenv@^16.3.1, express@^4.18.2, jsonwebtoken@^9.0.2, description, devDependencies (+10 more)

### Community 16 - "Context Menu Component"
Cohesion: 0.12
Nodes (9): ContextMenuCheckboxItem(), ContextMenuContent(), ContextMenuItem(), ContextMenuLabel(), ContextMenuRadioItem(), ContextMenuSeparator(), ContextMenuShortcut(), ContextMenuSubContent() (+1 more)

### Community 17 - "Dropdown Menu Component"
Cohesion: 0.18
Nodes (6): DropdownMenuCheckboxItem(), DropdownMenuLabel(), DropdownMenuRadioItem(), DropdownMenuShortcut(), DropdownMenuSubContent(), DropdownMenuSubTrigger()

### Community 18 - "item.tsx"
Cohesion: 0.20
Nodes (11): Item(), ItemActions(), ItemContent(), ItemDescription(), ItemFooter(), ItemGroup(), ItemHeader(), ItemMedia() (+3 more)

### Community 19 - "Select Input Component"
Cohesion: 0.22
Nodes (7): SelectContent(), SelectItem(), SelectLabel(), SelectScrollDownButton(), SelectScrollUpButton(), SelectSeparator(), SelectTrigger()

### Community 20 - "Recharts Visualization Wrapper"
Cohesion: 0.27
Nodes (10): ChartConfig, ChartContainer(), ChartContext, ChartContextProps, ChartLegendContent(), ChartStyle(), ChartTooltipContent(), getPayloadConfigFromPayload() (+2 more)

### Community 21 - "Vaul Drawer Component"
Cohesion: 0.22
Nodes (7): DrawerContent(), DrawerDescription(), DrawerFooter(), DrawerHeader(), DrawerOverlay(), DrawerPortal(), DrawerTitle()

### Community 22 - "utils.ts"
Cohesion: 0.05
Nodes (31): Badge(), badgeVariants, Empty(), EmptyContent(), EmptyDescription(), EmptyHeader(), EmptyMedia(), emptyMediaVariants (+23 more)

### Community 23 - "Sheet & Mobile Sidebar"
Cohesion: 0.26
Nodes (9): Sheet(), SheetContent(), SheetDescription(), SheetFooter(), SheetHeader(), SheetOverlay(), SheetPortal(), SheetTitle() (+1 more)

### Community 24 - "Express Backend & JWT Auth"
Cohesion: 0.18
Nodes (7): app, bcrypt, cors, crypto, DEV_ORIGINS, express, jwt

### Community 25 - "Backend API Integration Tests"
Cohesion: 0.15
Nodes (6): assert, dataDir, fs, os, path, { test, after }

### Community 26 - "SQLite Database Connection"
Cohesion: 0.18
Nodes (10): getDb(), initDb(), { open }, path, sqlite3, startServer(), sqlite@^5.0.1, sqlite3@^6.0.1 (+2 more)

### Community 27 - "Vite Build & React Plugin"
Cohesion: 0.25
Nodes (6): kimi-plugin-inspect-react@^1.0.3, vite@^7.2.4, @vitejs/plugin-react@^5.1.1, kimi-plugin-inspect-react, vite, @vitejs/plugin-react

### Community 29 - "Home"
Cohesion: 0.24
Nodes (11): BadgeCatalogItem, BadgeProgressInput, BadgesPage(), buildBadgeCatalog(), renderBadgeIcon(), Home(), closeLearning(), completeLesson() (+3 more)

### Community 31 - "api.ts"
Cohesion: 0.23
Nodes (10): ApiError, apiRequest(), BASE_URL, changePassword(), ChangePasswordData, ChangePasswordResponse, getProfile(), updateProfile() (+2 more)

### Community 32 - "Sonner Toast Notifications"
Cohesion: 0.33
Nodes (4): next-themes@^0.4.6, sonner@^2.0.7, next-themes, sonner

### Community 34 - "Root TypeScript Configuration"
Cohesion: 0.33
Nodes (5): compilerOptions, baseUrl, paths, files, references

### Community 35 - "Frontend NPM Scripts"
Cohesion: 0.40
Nodes (5): scripts, build, dev, lint, preview

### Community 36 - "Template & Tooling Documentation"
Cohesion: 0.40
Nodes (4): Type-Aware ESLint Configuration, React + TypeScript + Vite Template, shadcn UI Components Catalog, Tailwind CSS v3.4.19 + Vite v7.2.4 + shadcn Stack

### Community 37 - "Fieldnotes Project Overview"
Cohesion: 0.50
Nodes (4): Fieldnotes HTML Entry Point, DOM Root Container (#root), Webapp Project Structure, webmaster Project

### Community 39 - "Backend NPM Scripts"
Cohesion: 0.50
Nodes (4): scripts, dev, start, test

### Community 45 - "field.tsx"
Cohesion: 0.12
Nodes (19): @radix-ui/react-separator@^1.1.8, ButtonGroup(), ButtonGroupSeparator(), ButtonGroupText(), buttonGroupVariants, Field(), FieldContent(), FieldDescription() (+11 more)

### Community 50 - "Account.tsx"
Cohesion: 0.25
Nodes (14): Alert(), AlertDescription(), AlertTitle(), alertVariants, DropdownMenu(), DropdownMenuContent(), DropdownMenuItem(), DropdownMenuSeparator() (+6 more)

### Community 51 - "breadcrumb.tsx"
Cohesion: 0.20
Nodes (8): @radix-ui/react-slot@^1.2.4, BreadcrumbEllipsis(), BreadcrumbItem(), BreadcrumbLink(), BreadcrumbList(), BreadcrumbPage(), BreadcrumbSeparator(), @radix-ui/react-slot

## Knowledge Gaps
- **5 isolated node(s):** `Type-Aware ESLint Configuration`, `shadcn UI Components Catalog`, `DOM Root Container (#root)`, `Webapp Project Structure`, `webmaster Project`
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 209 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **19 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `cn()` connect `Avatars, Breadcrumbs & Keys` to `carousel.tsx`, `Sidebar & Input Layouts`, `Command Palette & Modals`, `form.tsx`, `react`, `field.tsx`, `Menubar UI Component`, `Context Menu Component`, `Dropdown Menu Component`, `Account.tsx`, `breadcrumb.tsx`, `Recharts Visualization Wrapper`, `Vaul Drawer Component`, `utils.ts`, `item.tsx`, `Select Input Component`, `Sheet & Mobile Sidebar`?**
  _High betweenness centrality (0.323) - this node is a cross-community bridge._
- **What connects `Type-Aware ESLint Configuration`, `shadcn UI Components Catalog`, `DOM Root Container (#root)` to the rest of the system?**
  _5 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Code Flaws Found (Read-Only Audit)` be split into smaller, more focused modules?**
  _Cohesion score 0.1111111111111111 - nodes in this community are weakly interconnected._
- **Why does `react` connect `react` to `carousel.tsx`, `Home.tsx`, `Sidebar & Input Layouts`, `Command Palette & Modals`, `Avatars, Breadcrumbs & Keys`, `form.tsx`, `dependencies`, `Menubar UI Component`, `app/package.json`, `Context Menu Component`, `Dropdown Menu Component`, `item.tsx`, `Select Input Component`, `Recharts Visualization Wrapper`, `Vaul Drawer Component`, `utils.ts`, `Sheet & Mobile Sidebar`, `Home`, `field.tsx`, `Account.tsx`, `breadcrumb.tsx`?**
  _High betweenness centrality (0.155) - this node is a cross-community bridge._
- **Should `carousel.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.06196078431372549 - nodes in this community are weakly interconnected._
- **Why does `lucide-react` connect `Command Palette & Modals` to `Sonner Toast Notifications`, `carousel.tsx`, `Home.tsx`, `Sidebar & Input Layouts`, `Avatars, Breadcrumbs & Keys`, `dependencies`, `react`, `Menubar UI Component`, `app/package.json`, `Context Menu Component`, `Dropdown Menu Component`, `Account.tsx`, `breadcrumb.tsx`, `Select Input Component`, `utils.ts`, `Sheet & Mobile Sidebar`, `Home`?**
  _High betweenness centrality (0.072) - this node is a cross-community bridge._
- **Should `Sidebar & Input Layouts` be split into smaller, more focused modules?**
  _Cohesion score 0.07965860597439545 - nodes in this community are weakly interconnected._