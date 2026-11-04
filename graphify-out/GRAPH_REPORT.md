# Graph Report - webmaster  (2026-11-03)

## Corpus Check
- 85 files · ~34,627 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 11 file(s) not represented in the graph (top: (none) 5, .css 4, .example 2)

## Summary
- 713 nodes · 1408 edges · 53 communities (47 shown, 6 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 7 edges (avg confidence: 0.86)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `fd9503aa`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- pagination.tsx
- carousel.tsx
- Fieldnotes App, Auth & Modules
- Sidebar & Input Layouts
- Command Palette & Modals
- Avatars, Breadcrumbs & Keys
- field.tsx
- app/package.json
- utils.ts
- App TypeScript Compiler Config
- Node TypeScript Compiler Config
- shadcn UI Registry Config
- eslint.config.js
- Menubar UI Component
- Styling & Build DevDependencies
- Backend Package Dependencies
- Context Menu Component
- Dropdown Menu Component
- alert-dialog.tsx
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
- radio-group.tsx
- input-group.tsx
- avatar.tsx
- hover-card.tsx
- scroll-area.tsx
- alert.tsx
- resizable.tsx
- Input

## God Nodes (most connected - your core abstractions)
1. `cn()` - 272 edges
2. `react` - 54 edges
3. `lucide-react` - 27 edges
4. `compilerOptions` - 22 edges
5. `Home()` - 18 edges
6. `compilerOptions` - 18 edges
7. `class-variance-authority` - 14 edges
8. `Button()` - 13 edges
9. `Separator()` - 10 edges
10. `buttonVariants` - 9 edges

## Surprising Connections (you probably didn't know these)
- `webmaster Project` --conceptually_related_to--> `Fieldnotes HTML Entry Point`  [INFERRED]
  README.md → app/index.html
- `AlertDialogDescription()` --calls--> `cn()`  [EXTRACTED]
  app/src/components/ui/alert-dialog.tsx → app/src/lib/utils.ts
- `AlertDialogFooter()` --calls--> `cn()`  [EXTRACTED]
  app/src/components/ui/alert-dialog.tsx → app/src/lib/utils.ts
- `AlertDialogHeader()` --calls--> `cn()`  [EXTRACTED]
  app/src/components/ui/alert-dialog.tsx → app/src/lib/utils.ts
- `AlertDialogTitle()` --calls--> `cn()`  [EXTRACTED]
  app/src/components/ui/alert-dialog.tsx → app/src/lib/utils.ts

## Import Cycles
- 2-file cycle: `app/src/App.tsx -> app/src/pages/Home.tsx -> app/src/App.tsx`

## Hyperedges (group relationships)
- **Fieldnotes Webapp Scaffold & Tooling** — app_readme_react_typescript_vite, app_template_info_stack, app_template_info_structure, app_index_fieldnotes [INFERRED 0.85]

## Communities (53 total, 6 thin omitted)

### Community 0 - "pagination.tsx"
Cohesion: 0.24
Nodes (11): Button(), buttonVariants, Calendar(), CalendarDayButton(), Pagination(), PaginationContent(), PaginationEllipsis(), PaginationLink() (+3 more)

### Community 1 - "carousel.tsx"
Cohesion: 0.16
Nodes (15): embla-carousel-react@^8.6.0, Carousel(), CarouselApi, CarouselContent(), CarouselContext, CarouselContextProps, CarouselItem(), CarouselNext() (+7 more)

### Community 2 - "Fieldnotes App, Auth & Modules"
Cohesion: 0.07
Nodes (50): react-dom@^19.2.0, react-router@^7.6.1, App(), Auth(), AuthProps, BadgeCatalogItem, BadgeProgressInput, BadgesPage() (+42 more)

### Community 3 - "Sidebar & Input Layouts"
Cohesion: 0.09
Nodes (31): SidebarContent(), SidebarContext, SidebarContextProps, SidebarFooter(), SidebarGroup(), SidebarGroupAction(), SidebarGroupContent(), SidebarGroupLabel() (+23 more)

### Community 4 - "Command Palette & Modals"
Cohesion: 0.12
Nodes (20): cmdk@^1.1.1, @radix-ui/react-dialog@^1.1.15, Command(), CommandDialog(), CommandGroup(), CommandInput(), CommandItem(), CommandList() (+12 more)

### Community 5 - "Avatars, Breadcrumbs & Keys"
Cohesion: 0.11
Nodes (28): BreadcrumbEllipsis(), BreadcrumbItem(), BreadcrumbLink(), BreadcrumbList(), BreadcrumbPage(), BreadcrumbSeparator(), Card(), CardAction() (+20 more)

### Community 6 - "field.tsx"
Cohesion: 0.05
Nodes (45): @radix-ui/react-label@^2.1.8, @radix-ui/react-slot@^1.2.4, react-hook-form@^7.70.0, ButtonGroup(), ButtonGroupSeparator(), ButtonGroupText(), buttonGroupVariants, Field() (+37 more)

### Community 7 - "app/package.json"
Cohesion: 0.08
Nodes (35): dependencies, clsx@^2.1.1, date-fns@^4.1.0, @hookform/resolvers@^5.2.2, lucide-react@^0.562.0, @radix-ui/react-checkbox@^1.3.3, @radix-ui/react-menubar@^1.1.16, @radix-ui/react-progress@^1.1.8 (+27 more)

### Community 8 - "utils.ts"
Cohesion: 0.20
Nodes (7): Badge(), badgeVariants, Checkbox(), Progress(), Slider(), Switch(), react

### Community 9 - "App TypeScript Compiler Config"
Cohesion: 0.08
Nodes (23): compilerOptions, allowImportingTsExtensions, baseUrl, erasableSyntaxOnly, jsx, lib, module, moduleDetection (+15 more)

### Community 10 - "Node TypeScript Compiler Config"
Cohesion: 0.10
Nodes (19): compilerOptions, allowImportingTsExtensions, erasableSyntaxOnly, lib, module, moduleDetection, moduleResolution, noEmit (+11 more)

### Community 11 - "shadcn UI Registry Config"
Cohesion: 0.11
Nodes (18): aliases, components, hooks, lib, ui, utils, iconLibrary, registries (+10 more)

### Community 12 - "eslint.config.js"
Cohesion: 0.15
Nodes (12): eslint@^9.39.1, @eslint/js@^9.39.1, eslint-plugin-react-hooks@^7.0.1, eslint-plugin-react-refresh@^0.4.24, globals@^16.5.0, typescript-eslint@^8.46.4, eslint, @eslint/js (+4 more)

### Community 13 - "Menubar UI Component"
Cohesion: 0.12
Nodes (12): Menubar(), MenubarCheckboxItem(), MenubarContent(), MenubarItem(), MenubarLabel(), MenubarPortal(), MenubarRadioItem(), MenubarSeparator() (+4 more)

### Community 14 - "Styling & Build DevDependencies"
Cohesion: 0.11
Nodes (19): devDependencies, autoprefixer@^10.4.23, postcss@^8.5.6, tailwindcss@^3.4.19, tailwindcss-animate@^1.0.7, tw-animate-css@^1.4.0, @types/node@^24.10.1, @types/react@^19.2.5 (+11 more)

### Community 15 - "Backend Package Dependencies"
Cohesion: 0.14
Nodes (18): dependencies, bcrypt@^6.0.0, cors@^2.8.5, dotenv@^16.3.1, express@^4.18.2, jsonwebtoken@^9.0.2, description, devDependencies (+10 more)

### Community 16 - "Context Menu Component"
Cohesion: 0.11
Nodes (11): @radix-ui/react-context-menu@^2.2.16, ContextMenuCheckboxItem(), ContextMenuContent(), ContextMenuItem(), ContextMenuLabel(), ContextMenuRadioItem(), ContextMenuSeparator(), ContextMenuShortcut() (+3 more)

### Community 17 - "Dropdown Menu Component"
Cohesion: 0.11
Nodes (11): @radix-ui/react-dropdown-menu@^2.1.16, DropdownMenuCheckboxItem(), DropdownMenuContent(), DropdownMenuItem(), DropdownMenuLabel(), DropdownMenuRadioItem(), DropdownMenuSeparator(), DropdownMenuShortcut() (+3 more)

### Community 18 - "alert-dialog.tsx"
Cohesion: 0.16
Nodes (11): @radix-ui/react-alert-dialog@^1.1.15, AlertDialogAction(), AlertDialogCancel(), AlertDialogContent(), AlertDialogDescription(), AlertDialogFooter(), AlertDialogHeader(), AlertDialogOverlay() (+3 more)

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
Cohesion: 0.21
Nodes (11): class-variance-authority@^0.7.1, @radix-ui/react-toggle@^1.1.10, @radix-ui/react-toggle-group@^1.1.11, ToggleGroup(), ToggleGroupContext, ToggleGroupItem(), Toggle(), toggleVariants (+3 more)

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

### Community 45 - "radio-group.tsx"
Cohesion: 0.40
Nodes (4): @radix-ui/react-radio-group@^1.3.8, RadioGroup(), RadioGroupItem(), @radix-ui/react-radio-group

### Community 46 - "input-group.tsx"
Cohesion: 0.25
Nodes (8): InputGroup(), InputGroupAddon(), inputGroupAddonVariants, InputGroupButton(), inputGroupButtonVariants, InputGroupText(), InputGroupTextarea(), Textarea()

### Community 47 - "avatar.tsx"
Cohesion: 0.33
Nodes (5): @radix-ui/react-avatar@^1.1.11, Avatar(), AvatarFallback(), AvatarImage(), @radix-ui/react-avatar

### Community 48 - "hover-card.tsx"
Cohesion: 0.33
Nodes (3): @radix-ui/react-hover-card@^1.1.15, HoverCardContent(), @radix-ui/react-hover-card

### Community 49 - "scroll-area.tsx"
Cohesion: 0.50
Nodes (4): @radix-ui/react-scroll-area@^1.2.10, ScrollArea(), ScrollBar(), @radix-ui/react-scroll-area

### Community 50 - "alert.tsx"
Cohesion: 0.50
Nodes (4): Alert(), AlertDescription(), AlertTitle(), alertVariants

### Community 51 - "resizable.tsx"
Cohesion: 0.33
Nodes (4): react-resizable-panels@^4.2.2, ResizableHandle(), ResizablePanelGroup(), react-resizable-panels

### Community 52 - "Input"
Cohesion: 0.67
Nodes (3): InputGroupInput(), Input(), SidebarInput()

## Knowledge Gaps
- **5 isolated node(s):** `Type-Aware ESLint Configuration`, `shadcn UI Components Catalog`, `DOM Root Container (#root)`, `Webapp Project Structure`, `webmaster Project`
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 190 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **6 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `cn()` connect `Avatars, Breadcrumbs & Keys` to `pagination.tsx`, `carousel.tsx`, `Fieldnotes App, Auth & Modules`, `Sidebar & Input Layouts`, `Command Palette & Modals`, `field.tsx`, `utils.ts`, `Menubar UI Component`, `Context Menu Component`, `Dropdown Menu Component`, `alert-dialog.tsx`, `Select Input Component`, `Recharts Visualization Wrapper`, `Vaul Drawer Component`, `Navigation Menu Component`, `Sheet & Mobile Sidebar`, `input-otp.tsx`, `Empty State Component`, `accordion.tsx`, `class-variance-authority`, `popover.tsx`, `radio-group.tsx`, `input-group.tsx`, `avatar.tsx`, `hover-card.tsx`, `scroll-area.tsx`, `alert.tsx`, `resizable.tsx`, `Input`?**
  _High betweenness centrality (0.305) - this node is a cross-community bridge._
- **What connects `Type-Aware ESLint Configuration`, `shadcn UI Components Catalog`, `DOM Root Container (#root)` to the rest of the system?**
  _5 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Fieldnotes App, Auth & Modules` be split into smaller, more focused modules?**
  _Cohesion score 0.06666666666666667 - nodes in this community are weakly interconnected._
- **Why does `react` connect `utils.ts` to `pagination.tsx`, `carousel.tsx`, `Fieldnotes App, Auth & Modules`, `Sidebar & Input Layouts`, `Command Palette & Modals`, `Avatars, Breadcrumbs & Keys`, `field.tsx`, `app/package.json`, `Menubar UI Component`, `Context Menu Component`, `Dropdown Menu Component`, `alert-dialog.tsx`, `Select Input Component`, `Recharts Visualization Wrapper`, `Vaul Drawer Component`, `Navigation Menu Component`, `Sheet & Mobile Sidebar`, `input-otp.tsx`, `accordion.tsx`, `class-variance-authority`, `popover.tsx`, `radio-group.tsx`, `input-group.tsx`, `avatar.tsx`, `hover-card.tsx`, `scroll-area.tsx`, `alert.tsx`, `resizable.tsx`?**
  _High betweenness centrality (0.166) - this node is a cross-community bridge._
- **Should `Sidebar & Input Layouts` be split into smaller, more focused modules?**
  _Cohesion score 0.08571428571428572 - nodes in this community are weakly interconnected._
- **Why does `lucide-react` connect `Fieldnotes App, Auth & Modules` to `pagination.tsx`, `carousel.tsx`, `Sonner Toast Notifications`, `Sidebar & Input Layouts`, `Command Palette & Modals`, `Avatars, Breadcrumbs & Keys`, `app/package.json`, `utils.ts`, `Menubar UI Component`, `radio-group.tsx`, `Context Menu Component`, `Dropdown Menu Component`, `resizable.tsx`, `Select Input Component`, `Navigation Menu Component`, `Sheet & Mobile Sidebar`, `input-otp.tsx`, `accordion.tsx`?**
  _High betweenness centrality (0.078) - this node is a cross-community bridge._
- **Should `Command Palette & Modals` be split into smaller, more focused modules?**
  _Cohesion score 0.12333333333333334 - nodes in this community are weakly interconnected._