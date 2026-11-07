# Graph Report - webmaster  (2026-11-06)

## Corpus Check
- 87 files · ~37,313 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 14 file(s) not represented in the graph (top: (none) 8, .css 4, .example 2)

## Summary
- 732 nodes · 1426 edges · 54 communities (47 shown, 7 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 8 edges (avg confidence: 0.88)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `7bae5fa4`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- Code Flaws Found (Read-Only Audit)
- carousel.tsx
- Fieldnotes App, Auth & Modules
- Sidebar & Input Layouts
- Command Palette & Modals
- Avatars, Breadcrumbs & Keys
- form.tsx
- app/package.json
- utils.ts
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
- Navigation Menu Component
- Sheet & Mobile Sidebar
- Express Backend & JWT Auth
- Backend API Integration Tests
- SQLite Database Connection
- Vite Build & React Plugin
- input-otp.tsx
- Empty State Component
- accordion.tsx
- class-variance-authority
- Sonner Toast Notifications
- Collapsible UI Component
- Root TypeScript Configuration
- Frontend NPM Scripts
- Template & Tooling Documentation
- Fieldnotes Project Overview
- Aspect Ratio Component
- Backend NPM Scripts
- Vite Environment Types
- popover.tsx
- field.tsx
- input-group.tsx
- avatar.tsx
- hover-card.tsx
- scroll-area.tsx
- class-variance-authority
- breadcrumb.tsx
- button-group.tsx

## God Nodes (most connected - your core abstractions)
1. `cn()` - 272 edges
2. `react` - 54 edges
3. `lucide-react` - 27 edges
4. `compilerOptions` - 22 edges
5. `Home()` - 19 edges
6. `compilerOptions` - 18 edges
7. `Code Flaws Found (Read-Only Audit)` - 17 edges
8. `class-variance-authority` - 14 edges
9. `Button()` - 13 edges
10. `Separator()` - 10 edges

## Surprising Connections (you probably didn't know these)
- `8. Account switching state churn in `Home`` --references--> `Home()`  [INFERRED]
  flaws.md → app/src/pages/Home.tsx
- `webmaster Project` --conceptually_related_to--> `Fieldnotes HTML Entry Point`  [INFERRED]
  README.md → app/index.html
- `Pagination()` --calls--> `cn()`  [EXTRACTED]
  app/src/components/ui/pagination.tsx → app/src/lib/utils.ts
- `PaginationContent()` --calls--> `cn()`  [EXTRACTED]
  app/src/components/ui/pagination.tsx → app/src/lib/utils.ts
- `PaginationEllipsis()` --calls--> `cn()`  [EXTRACTED]
  app/src/components/ui/pagination.tsx → app/src/lib/utils.ts

## Import Cycles
- 2-file cycle: `app/src/App.tsx -> app/src/pages/Home.tsx -> app/src/App.tsx`

## Hyperedges (group relationships)
- **Fieldnotes Webapp Scaffold & Tooling** — app_readme_react_typescript_vite, app_template_info_stack, app_template_info_structure, app_index_fieldnotes [INFERRED 0.85]

## Communities (54 total, 7 thin omitted)

### Community 0 - "Code Flaws Found (Read-Only Audit)"
Cohesion: 0.12
Nodes (16): 10. Video timer interval recreates on every progress update, 11. Inspect plugin enabled in Vite config, 12. Case-sensitive usernames, 13. Internal error detail exposure, 14. Potential CSS injection if chart config becomes dynamic, 15. No token revocation, 1. Server trusts client-authored progress, 2. Unbounded XP (+8 more)

### Community 1 - "carousel.tsx"
Cohesion: 0.06
Nodes (39): embla-carousel-react@^8.6.0, @radix-ui/react-alert-dialog@^1.1.15, react-day-picker@^9.13.0, AlertDialogAction(), AlertDialogCancel(), AlertDialogContent(), AlertDialogDescription(), AlertDialogFooter() (+31 more)

### Community 2 - "Fieldnotes App, Auth & Modules"
Cohesion: 0.07
Nodes (49): react-dom@^19.2.0, react-router@^7.6.1, App(), Auth(), AuthProps, BadgeCatalogItem, BadgeProgressInput, BadgesPage() (+41 more)

### Community 3 - "Sidebar & Input Layouts"
Cohesion: 0.08
Nodes (32): SidebarContent(), SidebarContext, SidebarContextProps, SidebarFooter(), SidebarGroup(), SidebarGroupAction(), SidebarGroupContent(), SidebarGroupLabel() (+24 more)

### Community 4 - "Command Palette & Modals"
Cohesion: 0.07
Nodes (30): cmdk@^1.1.1, @radix-ui/react-dialog@^1.1.15, @radix-ui/react-radio-group@^1.3.8, react-resizable-panels@^4.2.2, Command(), CommandDialog(), CommandGroup(), CommandInput() (+22 more)

### Community 5 - "Avatars, Breadcrumbs & Keys"
Cohesion: 0.14
Nodes (22): Card(), CardAction(), CardContent(), CardDescription(), CardFooter(), CardHeader(), CardTitle(), Kbd() (+14 more)

### Community 6 - "form.tsx"
Cohesion: 0.14
Nodes (16): @radix-ui/react-label@^2.1.8, react-hook-form@^7.70.0, FieldLabel(), FormControl(), FormDescription(), FormFieldContext, FormFieldContextValue, FormItem() (+8 more)

### Community 7 - "app/package.json"
Cohesion: 0.07
Nodes (29): dependencies, class-variance-authority@^0.7.1, clsx@^2.1.1, @hookform/resolvers@^5.2.2, lucide-react@^0.562.0, @radix-ui/react-checkbox@^1.3.3, @radix-ui/react-context-menu@^2.2.16, @radix-ui/react-progress@^1.1.8 (+21 more)

### Community 8 - "utils.ts"
Cohesion: 0.25
Nodes (5): Checkbox(), Progress(), Slider(), Switch(), react

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
Cohesion: 0.09
Nodes (25): devDependencies, autoprefixer@^10.4.23, eslint@^9.39.1, @eslint/js@^9.39.1, eslint-plugin-react-hooks@^7.0.1, eslint-plugin-react-refresh@^0.4.24, globals@^16.5.0, postcss@^8.5.6 (+17 more)

### Community 13 - "Menubar UI Component"
Cohesion: 0.11
Nodes (14): @radix-ui/react-menubar@^1.1.16, Menubar(), MenubarCheckboxItem(), MenubarContent(), MenubarItem(), MenubarLabel(), MenubarPortal(), MenubarRadioItem() (+6 more)

### Community 14 - "app/package.json"
Cohesion: 0.11
Nodes (18): date-fns@^4.1.0, @radix-ui/react-dropdown-menu@^2.1.16, @radix-ui/react-separator@^1.1.8, @radix-ui/react-switch@^1.2.6, @types/react@^19.2.5, @types/react-dom@^19.2.3, typescript@~5.9.3, name (+10 more)

### Community 15 - "Backend Package Dependencies"
Cohesion: 0.14
Nodes (18): dependencies, bcrypt@^6.0.0, cors@^2.8.5, dotenv@^16.3.1, express@^4.18.2, jsonwebtoken@^9.0.2, description, devDependencies (+10 more)

### Community 16 - "Context Menu Component"
Cohesion: 0.12
Nodes (9): ContextMenuCheckboxItem(), ContextMenuContent(), ContextMenuItem(), ContextMenuLabel(), ContextMenuRadioItem(), ContextMenuSeparator(), ContextMenuShortcut(), ContextMenuSubContent() (+1 more)

### Community 17 - "Dropdown Menu Component"
Cohesion: 0.12
Nodes (9): DropdownMenuCheckboxItem(), DropdownMenuContent(), DropdownMenuItem(), DropdownMenuLabel(), DropdownMenuRadioItem(), DropdownMenuSeparator(), DropdownMenuShortcut(), DropdownMenuSubContent() (+1 more)

### Community 18 - "item.tsx"
Cohesion: 0.18
Nodes (12): Item(), ItemActions(), ItemContent(), ItemDescription(), ItemFooter(), ItemGroup(), ItemHeader(), ItemMedia() (+4 more)

### Community 19 - "Select Input Component"
Cohesion: 0.18
Nodes (9): @radix-ui/react-select@^2.2.6, SelectContent(), SelectItem(), SelectLabel(), SelectScrollDownButton(), SelectScrollUpButton(), SelectSeparator(), SelectTrigger() (+1 more)

### Community 20 - "Recharts Visualization Wrapper"
Cohesion: 0.22
Nodes (12): recharts@^2.15.4, ChartConfig, ChartContainer(), ChartContext, ChartContextProps, ChartLegendContent(), ChartStyle(), ChartTooltipContent() (+4 more)

### Community 21 - "Vaul Drawer Component"
Cohesion: 0.18
Nodes (9): vaul@^1.1.2, DrawerContent(), DrawerDescription(), DrawerFooter(), DrawerHeader(), DrawerOverlay(), DrawerPortal(), DrawerTitle() (+1 more)

### Community 22 - "Navigation Menu Component"
Cohesion: 0.20
Nodes (11): @radix-ui/react-navigation-menu@^1.2.14, NavigationMenu(), NavigationMenuContent(), NavigationMenuIndicator(), NavigationMenuItem(), NavigationMenuLink(), NavigationMenuList(), NavigationMenuTrigger() (+3 more)

### Community 23 - "Sheet & Mobile Sidebar"
Cohesion: 0.26
Nodes (9): Sheet(), SheetContent(), SheetDescription(), SheetFooter(), SheetHeader(), SheetOverlay(), SheetPortal(), SheetTitle() (+1 more)

### Community 24 - "Express Backend & JWT Auth"
Cohesion: 0.18
Nodes (9): initDb(), app, bcrypt, cors, crypto, DEV_ORIGINS, express, jwt (+1 more)

### Community 25 - "Backend API Integration Tests"
Cohesion: 0.17
Nodes (6): assert, dataDir, fs, os, path, { test, after }

### Community 26 - "SQLite Database Connection"
Cohesion: 0.22
Nodes (8): getDb(), { open }, path, sqlite3, sqlite@^5.0.1, sqlite3@^6.0.1, sqlite, sqlite3

### Community 27 - "Vite Build & React Plugin"
Cohesion: 0.25
Nodes (6): kimi-plugin-inspect-react@^1.0.3, vite@^7.2.4, @vitejs/plugin-react@^5.1.1, kimi-plugin-inspect-react, vite, @vitejs/plugin-react

### Community 28 - "input-otp.tsx"
Cohesion: 0.29
Nodes (5): input-otp@^1.4.2, InputOTP(), InputOTPGroup(), InputOTPSlot(), input-otp

### Community 29 - "Empty State Component"
Cohesion: 0.29
Nodes (7): Empty(), EmptyContent(), EmptyDescription(), EmptyHeader(), EmptyMedia(), emptyMediaVariants, EmptyTitle()

### Community 30 - "accordion.tsx"
Cohesion: 0.29
Nodes (5): @radix-ui/react-accordion@^1.2.12, AccordionContent(), AccordionItem(), AccordionTrigger(), @radix-ui/react-accordion

### Community 31 - "class-variance-authority"
Cohesion: 0.43
Nodes (5): ToggleGroup(), ToggleGroupContext, ToggleGroupItem(), Toggle(), toggleVariants

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

### Community 44 - "popover.tsx"
Cohesion: 0.29
Nodes (3): @radix-ui/react-popover@^1.1.15, PopoverContent(), @radix-ui/react-popover

### Community 45 - "field.tsx"
Cohesion: 0.20
Nodes (10): Field(), FieldContent(), FieldDescription(), FieldError(), FieldGroup(), FieldLegend(), FieldSeparator(), FieldSet() (+2 more)

### Community 46 - "input-group.tsx"
Cohesion: 0.23
Nodes (10): InputGroup(), InputGroupAddon(), inputGroupAddonVariants, InputGroupButton(), inputGroupButtonVariants, InputGroupInput(), InputGroupText(), InputGroupTextarea() (+2 more)

### Community 47 - "avatar.tsx"
Cohesion: 0.33
Nodes (5): @radix-ui/react-avatar@^1.1.11, Avatar(), AvatarFallback(), AvatarImage(), @radix-ui/react-avatar

### Community 48 - "hover-card.tsx"
Cohesion: 0.33
Nodes (3): @radix-ui/react-hover-card@^1.1.15, HoverCardContent(), @radix-ui/react-hover-card

### Community 49 - "scroll-area.tsx"
Cohesion: 0.50
Nodes (4): @radix-ui/react-scroll-area@^1.2.10, ScrollArea(), ScrollBar(), @radix-ui/react-scroll-area

### Community 50 - "class-variance-authority"
Cohesion: 0.24
Nodes (8): Alert(), AlertDescription(), AlertTitle(), alertVariants, Badge(), badgeVariants, class-variance-authority, @radix-ui/react-slot

### Community 51 - "breadcrumb.tsx"
Cohesion: 0.25
Nodes (6): BreadcrumbEllipsis(), BreadcrumbItem(), BreadcrumbLink(), BreadcrumbList(), BreadcrumbPage(), BreadcrumbSeparator()

### Community 52 - "button-group.tsx"
Cohesion: 0.43
Nodes (5): ButtonGroup(), ButtonGroupSeparator(), ButtonGroupText(), buttonGroupVariants, Separator()

## Knowledge Gaps
- **5 isolated node(s):** `Type-Aware ESLint Configuration`, `shadcn UI Components Catalog`, `DOM Root Container (#root)`, `Webapp Project Structure`, `webmaster Project`
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 207 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **7 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `cn()` connect `Avatars, Breadcrumbs & Keys` to `carousel.tsx`, `Fieldnotes App, Auth & Modules`, `Sidebar & Input Layouts`, `Command Palette & Modals`, `form.tsx`, `utils.ts`, `Menubar UI Component`, `Context Menu Component`, `Dropdown Menu Component`, `item.tsx`, `Select Input Component`, `Recharts Visualization Wrapper`, `Vaul Drawer Component`, `Navigation Menu Component`, `Sheet & Mobile Sidebar`, `input-otp.tsx`, `Empty State Component`, `accordion.tsx`, `class-variance-authority`, `popover.tsx`, `field.tsx`, `input-group.tsx`, `avatar.tsx`, `hover-card.tsx`, `scroll-area.tsx`, `class-variance-authority`, `breadcrumb.tsx`, `button-group.tsx`?**
  _High betweenness centrality (0.290) - this node is a cross-community bridge._
- **What connects `Type-Aware ESLint Configuration`, `shadcn UI Components Catalog`, `DOM Root Container (#root)` to the rest of the system?**
  _5 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Code Flaws Found (Read-Only Audit)` be split into smaller, more focused modules?**
  _Cohesion score 0.11764705882352941 - nodes in this community are weakly interconnected._
- **Why does `react` connect `utils.ts` to `carousel.tsx`, `Fieldnotes App, Auth & Modules`, `Sidebar & Input Layouts`, `Command Palette & Modals`, `Avatars, Breadcrumbs & Keys`, `form.tsx`, `app/package.json`, `Menubar UI Component`, `app/package.json`, `Context Menu Component`, `Dropdown Menu Component`, `item.tsx`, `Select Input Component`, `Recharts Visualization Wrapper`, `Vaul Drawer Component`, `Navigation Menu Component`, `Sheet & Mobile Sidebar`, `input-otp.tsx`, `accordion.tsx`, `class-variance-authority`, `popover.tsx`, `field.tsx`, `input-group.tsx`, `avatar.tsx`, `hover-card.tsx`, `scroll-area.tsx`, `class-variance-authority`, `breadcrumb.tsx`, `button-group.tsx`?**
  _High betweenness centrality (0.179) - this node is a cross-community bridge._
- **Should `carousel.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.06086956521739131 - nodes in this community are weakly interconnected._
- **Why does `lucide-react` connect `Command Palette & Modals` to `Sonner Toast Notifications`, `carousel.tsx`, `Fieldnotes App, Auth & Modules`, `Sidebar & Input Layouts`, `app/package.json`, `utils.ts`, `Menubar UI Component`, `app/package.json`, `Context Menu Component`, `Dropdown Menu Component`, `breadcrumb.tsx`, `Select Input Component`, `Navigation Menu Component`, `Sheet & Mobile Sidebar`, `input-otp.tsx`, `accordion.tsx`?**
  _High betweenness centrality (0.085) - this node is a cross-community bridge._
- **Should `Fieldnotes App, Auth & Modules` be split into smaller, more focused modules?**
  _Cohesion score 0.0679563492063492 - nodes in this community are weakly interconnected._