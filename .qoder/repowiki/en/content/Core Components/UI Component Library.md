# UI Component Library

<cite>
**Referenced Files in This Document**
- [button.tsx](file://components/ui/button.tsx)
- [input.tsx](file://components/ui/input.tsx)
- [select.tsx](file://components/ui/select.tsx)
- [textarea.tsx](file://components/ui/textarea.tsx)
- [label.tsx](file://components/ui/label.tsx)
- [avatar.tsx](file://components/ui/avatar.tsx)
- [badge.tsx](file://components/ui/badge.tsx)
- [skeleton.tsx](file://components/ui/skeleton.tsx)
- [tooltip.tsx](file://components/ui/tooltip.tsx)
- [card.tsx](file://components/ui/card.tsx)
- [dialog.tsx](file://components/ui/dialog.tsx)
- [table.tsx](file://components/ui/table.tsx)
- [tabs.tsx](file://components/ui/tabs.tsx)
- [tailwind.config.ts](file://tailwind.config.ts)
- [utils.ts](file://lib/utils.ts)
- [components.json](file://components.json)
- [page.tsx](file://app/mediasi/page.tsx)
</cite>

## Update Summary
**Changes Made**
- Added comprehensive documentation for the new Tabs component implementation
- Included detailed analysis of Tabs, TabsList, TabsTrigger, and TabsContent components
- Added usage examples from the real-world implementation in the mediasi page
- Updated component architecture overview to include the new Tabs component family
- Enhanced dependency analysis to show Tabs component relationships

## Table of Contents
1. [Introduction](#introduction)
2. [Project Structure](#project-structure)
3. [Core Components](#core-components)
4. [Architecture Overview](#architecture-overview)
5. [Detailed Component Analysis](#detailed-component-analysis)
6. [Dependency Analysis](#dependency-analysis)
7. [Performance Considerations](#performance-considerations)
8. [Troubleshooting Guide](#troubleshooting-guide)
9. [Conclusion](#conclusion)
10. [Appendices](#appendices)

## Introduction
This document describes the UI component library built on Radix UI primitives and Tailwind CSS. It explains the base component architecture, design system principles, and consistent styling patterns. It covers the button component system (variants and sizes), form input components (input, select, textarea, label), decorative components (avatar, badge, skeleton), interactive elements (tooltip), and the newly added tabbed interface functionality (tabs). It also documents prop interfaces, usage guidance, customization options, accessibility features, component composition patterns, state management, and extension guidelines.

## Project Structure
The UI components live under components/ui and are composed with:
- Radix UI primitives for accessible, unstyled foundations
- Tailwind CSS for styling and design tokens
- class-variance-authority (cva) for variant-driven styling
- A shared cn() utility for merging Tailwind classes safely

```mermaid
graph TB
subgraph "Design System"
TW["Tailwind Config<br/>colors, radii, animations"]
CV["cva Variants<br/>button, badge, label"]
CN["cn() Utility<br/>clsx + tailwind-merge"]
end
subgraph "Components"
BTN["Button"]
INP["Input"]
SEL["Select"]
TXT["Textarea"]
LAB["Label"]
AV["Avatar"]
BDG["Badge"]
SK["Skeleton"]
TP["Tooltip"]
TAB["Tabs"]
CARD["Card"]
DLG["Dialog"]
TBL["Table"]
end
TW --> BTN
TW --> INP
TW --> SEL
TW --> TXT
TW --> LAB
TW --> AV
TW --> BDG
TW --> SK
TW --> TP
TW --> TAB
TW --> CARD
TW --> DLG
TW --> TBL
CV --> BTN
CV --> BDG
CV --> LAB
CN --> BTN
CN --> INP
CN --> SEL
CN --> TXT
CN --> AV
CN --> BDG
CN --> SK
CN --> TP
CN --> TAB
CN --> CARD
CN --> DLG
CN --> TBL
```

**Diagram sources**
- [tailwind.config.ts:1-106](file://tailwind.config.ts#L1-L106)
- [button.tsx:7-35](file://components/ui/button.tsx#L7-L35)
- [badge.tsx:6-24](file://components/ui/badge.tsx#L6-L24)
- [label.tsx:9-11](file://components/ui/label.tsx#L9-L11)
- [utils.ts:4-6](file://lib/utils.ts#L4-L6)
- [tabs.tsx:1-56](file://components/ui/tabs.tsx#L1-L56)

**Section sources**
- [tailwind.config.ts:1-106](file://tailwind.config.ts#L1-L106)
- [components.json:1-25](file://components.json#L1-L25)

## Core Components
This section summarizes the foundational building blocks and their roles in the design system.

- Button: Variant-driven primary action with size options and support for rendering as child elements via a slot.
- Input: Text input with consistent focus states, disabled states, and responsive typography.
- Select: Composite widget built on Radix UI with trigger, content, item, label, separators, and scroll buttons.
- Textarea: Multi-line text area with consistent focus states and responsive typography.
- Label: Accessible label for form controls with peer-based disabled states.
- Avatar: Image with fallback and rounded-full shape.
- Badge: Lightweight indicator with variant-based color schemes.
- Skeleton: Pulse animation container for loading states.
- Tooltip: Provider-root-trigger-content triad with portal rendering and directional animations.
- Tabs: Tabbed interface system with Tabs, TabsList, TabsTrigger, and TabsContent components for accessible tab navigation.
- Card: Container with header, title, description, content, and footer slots.
- Dialog: Overlay, content, header/footer, title, and description with close button.
- Table: Scrollable wrapper plus table, thead, tbody, tfoot, tr, th, td, caption.

**Section sources**
- [button.tsx:37-57](file://components/ui/button.tsx#L37-L57)
- [input.tsx:5-22](file://components/ui/input.tsx#L5-L22)
- [select.tsx:9-159](file://components/ui/select.tsx#L9-L159)
- [textarea.tsx:5-22](file://components/ui/textarea.tsx#L5-L22)
- [label.tsx:13-24](file://components/ui/label.tsx#L13-L24)
- [avatar.tsx:8-50](file://components/ui/avatar.tsx#L8-L50)
- [badge.tsx:26-36](file://components/ui/badge.tsx#L26-L36)
- [skeleton.tsx:3-15](file://components/ui/skeleton.tsx#L3-L15)
- [tooltip.tsx:8-32](file://components/ui/tooltip.tsx#L8-L32)
- [tabs.tsx:8-55](file://components/ui/tabs.tsx#L8-L55)
- [card.tsx:5-76](file://components/ui/card.tsx#L5-L76)
- [dialog.tsx:9-122](file://components/ui/dialog.tsx#L9-L122)
- [table.tsx:5-120](file://components/ui/table.tsx#L5-L120)

## Architecture Overview
The library follows a consistent pattern:
- Use Radix UI for semantics and accessibility
- Apply Tailwind classes for styling and design tokens
- Use cva for variant-driven styles
- Use cn() to merge classes safely
- Compose small, focused components into larger ones (e.g., Card parts, Select parts, Tabs parts)

```mermaid
graph LR
R["Radix UI Primitives"] --> C["Components"]
TW["Tailwind Design Tokens"] --> C
CV["cva Variants"] --> C
CN["cn()"] --> C
C --> U["Usage in App Pages"]
```

**Diagram sources**
- [button.tsx:1-6](file://components/ui/button.tsx#L1-L6)
- [select.tsx:1-8](file://components/ui/select.tsx#L1-L8)
- [tabs.tsx:1-6](file://components/ui/tabs.tsx#L1-L6)
- [tailwind.config.ts:20-77](file://tailwind.config.ts#L20-L77)
- [utils.ts:4-6](file://lib/utils.ts#L4-L6)

## Detailed Component Analysis

### Button
- Purpose: Primary action with consistent focus, hover, active, disabled states.
- Variants: default, destructive, outline, secondary, ghost, link.
- Sizes: default, sm, lg, icon.
- Composition: Uses a slot to render as a child element when asChild is true.
- Accessibility: Inherits native button semantics; focus-visible ring applied via design system.

```mermaid
classDiagram
class Button {
+variant : "default"|"destructive"|"outline"|"secondary"|"ghost"|"link"
+size : "default"|"sm"|"lg"|"icon"
+asChild : boolean
+className : string
}
class buttonVariants {
+apply(variant,size,className) string
}
Button --> buttonVariants : "uses"
```

**Diagram sources**
- [button.tsx:7-35](file://components/ui/button.tsx#L7-L35)
- [button.tsx:37-57](file://components/ui/button.tsx#L37-L57)

**Section sources**
- [button.tsx:7-35](file://components/ui/button.tsx#L7-L35)
- [button.tsx:37-57](file://components/ui/button.tsx#L37-L57)

### Tabs System

**Updated** Added comprehensive documentation for the new Tabs component system

The Tabs component system provides accessible tabbed interface functionality built on Radix UI primitives. It consists of four main components that work together to create a fully functional tabbed interface.

#### Tabs Root Component
- Purpose: Container component that manages the state of the tabbed interface
- Props: Inherits all props from Radix UI Tabs Root primitive
- State Management: Handles active tab state and keyboard navigation
- Accessibility: Provides proper ARIA attributes and keyboard interaction

#### TabsList Component
- Purpose: Container for tab triggers with flexible layout options
- Styling: Uses muted background with foreground text color
- Layout Options: Supports grid layouts for responsive tab arrangements
- Active State: Background changes to main background when active

#### TabsTrigger Component
- Purpose: Individual tab activation controls
- Active State: Changes background to main background, text to foreground, and adds shadow
- Disabled State: Reduces opacity and disables pointer events
- Focus States: Includes focus-visible ring with ring color
- Transition Effects: Smooth transitions for state changes

#### TabsContent Component
- Purpose: Container for tab panel content
- Focus States: Includes focus-visible ring for keyboard navigation
- Spacing: Adds margin-top for visual separation from tab headers

```mermaid
classDiagram
class Tabs {
+defaultValue : string
+value : string
+onValueChange : function
+className : string
}
class TabsList {
+className : string
}
class TabsTrigger {
+value : string
+disabled : boolean
+className : string
}
class TabsContent {
+value : string
+className : string
}
Tabs --> TabsList : "contains"
TabsList --> TabsTrigger : "contains"
Tabs --> TabsContent : "contains"
```

**Diagram sources**
- [tabs.tsx:8-55](file://components/ui/tabs.tsx#L8-L55)

**Section sources**
- [tabs.tsx:8-55](file://components/ui/tabs.tsx#L8-L55)

### Form Inputs

#### Input
- Purpose: Single-line text input with consistent focus and disabled states.
- Styling: Inherits design tokens for border, background, placeholder, and focus ring.

```mermaid
flowchart TD
Start(["Render Input"]) --> Merge["Merge Base Classes + Props"]
Merge --> Focus["Focus Visible Ring Applied"]
Focus --> Disabled{"Disabled?"}
Disabled --> |Yes| Gray["Reduced Opacity"]
Disabled --> |No| Normal["Interactive"]
Gray --> End(["Done"])
Normal --> End
```

**Diagram sources**
- [input.tsx:5-22](file://components/ui/input.tsx#L5-L22)

**Section sources**
- [input.tsx:5-22](file://components/ui/input.tsx#L5-L22)

#### Select
- Purpose: Accessible single/multi-select with composite parts.
- Parts: Root, Group, Value, Trigger, Content, Label, Item, Separator, ScrollUp/Down buttons.
- Behavior: Portal-rendered content with animations; viewport sizing adapts to trigger.

```mermaid
sequenceDiagram
participant User as "User"
participant Trigger as "SelectTrigger"
participant Content as "SelectContent"
participant Item as "SelectItem"
User->>Trigger : Click
Trigger->>Content : Open (state)
Content->>User : Render Dropdown
User->>Item : Select Option
Item-->>Trigger : Update Value
Trigger-->>User : Close & Reflect Selection
```

**Diagram sources**
- [select.tsx:9-159](file://components/ui/select.tsx#L9-L159)

**Section sources**
- [select.tsx:9-159](file://components/ui/select.tsx#L9-L159)

#### Textarea
- Purpose: Multi-line text input with consistent focus and disabled states.

**Section sources**
- [textarea.tsx:5-22](file://components/ui/textarea.tsx#L5-L22)

#### Label
- Purpose: Accessible label paired with form controls.
- Variants: Uses cva for label-specific styling; integrates with peer-disabled states.

**Section sources**
- [label.tsx:9-24](file://components/ui/label.tsx#L9-L24)

### Decorative Components

#### Avatar
- Purpose: User or entity image with fallback and rounded-full shape.

```mermaid
classDiagram
class Avatar {
+className : string
}
class AvatarImage {
+className : string
}
class AvatarFallback {
+className : string
}
Avatar <|-- AvatarImage
Avatar <|-- AvatarFallback
```

**Diagram sources**
- [avatar.tsx:8-50](file://components/ui/avatar.tsx#L8-L50)

**Section sources**
- [avatar.tsx:8-50](file://components/ui/avatar.tsx#L8-L50)

#### Badge
- Purpose: Lightweight indicator with variant-based color schemes.

```mermaid
classDiagram
class Badge {
+variant : "default"|"secondary"|"destructive"|"outline"
+className : string
}
class badgeVariants {
+apply(variant) string
}
Badge --> badgeVariants : "uses"
```

**Diagram sources**
- [badge.tsx:6-24](file://components/ui/badge.tsx#L6-L24)
- [badge.tsx:26-36](file://components/ui/badge.tsx#L26-L36)

**Section sources**
- [badge.tsx:6-24](file://components/ui/badge.tsx#L6-L24)
- [badge.tsx:26-36](file://components/ui/badge.tsx#L26-L36)

#### Skeleton
- Purpose: Loading state with pulse animation.

**Section sources**
- [skeleton.tsx:3-15](file://components/ui/skeleton.tsx#L3-L15)

### Interactive Elements

#### Tooltip
- Purpose: Tooltip with provider-root-trigger-content structure and portal rendering.

```mermaid
sequenceDiagram
participant Provider as "TooltipProvider"
participant Root as "Tooltip"
participant Trigger as "TooltipTrigger"
participant Content as "TooltipContent"
Provider->>Root : Enable Tooltip
Root->>Trigger : Bind Events
Trigger->>Content : Show on Hover/Focus
Content-->>Trigger : Hide on Leave/Lost Focus
```

**Diagram sources**
- [tooltip.tsx:8-32](file://components/ui/tooltip.tsx#L8-L32)

**Section sources**
- [tooltip.tsx:8-32](file://components/ui/tooltip.tsx#L8-L32)

### Layout and Containers

#### Card
- Purpose: Container with header, title, description, content, and footer slots.

```mermaid
classDiagram
class Card
class CardHeader
class CardTitle
class CardDescription
class CardContent
class CardFooter
Card <|-- CardHeader
Card <|-- CardTitle
Card <|-- CardDescription
Card <|-- CardContent
Card <|-- CardFooter
```

**Diagram sources**
- [card.tsx:5-76](file://components/ui/card.tsx#L5-L76)

**Section sources**
- [card.tsx:5-76](file://components/ui/card.tsx#L5-L76)

#### Dialog
- Purpose: Modal overlay with close button, header/footer, title, and description.

**Section sources**
- [dialog.tsx:9-122](file://components/ui/dialog.tsx#L9-L122)

#### Table
- Purpose: Scrollable table with semantic head/body/footer and row/cell helpers.

**Section sources**
- [table.tsx:5-120](file://components/ui/table.tsx#L5-L120)

## Dependency Analysis
The components share common dependencies and patterns:
- Radix UI: Used across Select, Tooltip, Dialog, Label, Avatar, Tabs, and others for accessible semantics.
- Tailwind: Provides design tokens (colors, spacing, radii, shadows, animations).
- cva: Centralized variant definitions for Button, Badge, Label.
- cn(): Merges Tailwind classes consistently.

```mermaid
graph TB
BTN["Button"] --> RAD["Radix UI"]
SEL["Select"] --> RAD
TP["Tooltip"] --> RAD
DLG["Dialog"] --> RAD
LAB["Label"] --> RAD
AV["Avatar"] --> RAD
TAB["Tabs"] --> RAD
BTN --> TW["Tailwind"]
INP["Input"] --> TW
SEL --> TW
TXT["Textarea"] --> TW
LAB --> TW
AV["Avatar"] --> TW
TAB["Tabs"] --> TW
BDG["Badge"] --> TW
SK["Skeleton"] --> TW
TP["Tooltip"] --> TW
CARD["Card"] --> TW
DLG["Dialog"] --> TW
TBL["Table"] --> TW
BTN --> CV["cva"]
BDG --> CV
LAB --> CV
BTN --> CN["cn()"]
INP --> CN
SEL --> CN
TXT --> CN
AV --> CN
TAB --> CN
BDG --> CN
SK --> CN
TP --> CN
CARD --> CN
DLG --> CN
TBL --> CN
```

**Diagram sources**
- [button.tsx:1-6](file://components/ui/button.tsx#L1-L6)
- [select.tsx:1-8](file://components/ui/select.tsx#L1-L8)
- [tooltip.tsx:1-7](file://components/ui/tooltip.tsx#L1-L7)
- [dialog.tsx:1-8](file://components/ui/dialog.tsx#L1-L8)
- [label.tsx:1-8](file://components/ui/label.tsx#L1-L8)
- [avatar.tsx:1-7](file://components/ui/avatar.tsx#L1-L7)
- [tabs.tsx:1-6](file://components/ui/tabs.tsx#L1-L6)
- [badge.tsx:1-5](file://components/ui/badge.tsx#L1-L5)
- [tailwind.config.ts:20-77](file://tailwind.config.ts#L20-L77)
- [utils.ts:4-6](file://lib/utils.ts#L4-L6)

**Section sources**
- [button.tsx:1-6](file://components/ui/button.tsx#L1-L6)
- [select.tsx:1-8](file://components/ui/select.tsx#L1-L8)
- [tooltip.tsx:1-7](file://components/ui/tooltip.tsx#L1-L7)
- [dialog.tsx:1-8](file://components/ui/dialog.tsx#L1-L8)
- [label.tsx:1-8](file://components/ui/label.tsx#L1-L8)
- [avatar.tsx:1-7](file://components/ui/avatar.tsx#L1-L7)
- [tabs.tsx:1-6](file://components/ui/tabs.tsx#L1-L6)
- [badge.tsx:1-5](file://components/ui/badge.tsx#L1-L5)
- [tailwind.config.ts:20-77](file://tailwind.config.ts#L20-L77)
- [utils.ts:4-6](file://lib/utils.ts#L4-L6)

## Performance Considerations
- Prefer variant props over ad hoc class overrides to keep the variant set small and predictable.
- Use cn() to avoid redundant or conflicting Tailwind classes.
- Keep animations minimal; tooltips, selects, and tabs already apply subtle transitions.
- Defer heavy DOM work inside portals to reduce layout thrash.
- Reuse shared design tokens to minimize CSS bloat.
- Tabs content is lazy-loaded by default through Radix UI, improving initial render performance.

## Troubleshooting Guide
- Button not responding to clicks:
  - Ensure the component renders as a button element; when asChild is true, it renders whatever parent is passed.
- Select content not visible:
  - Confirm the Select is wrapped in a Portal and positioned correctly; check viewport sizing and trigger height.
- Tooltip not appearing:
  - Verify TooltipProvider is enabled and TooltipTrigger is attached to a focusable element.
- Tabs not switching content:
  - Ensure TabsTrigger values match corresponding TabsContent values.
  - Check that TabsList wraps all TabsTrigger components.
  - Verify defaultValue prop is set correctly on Tabs root.
- Input/Textarea focus ring missing:
  - Ensure focus-visible ring classes are not overridden; confirm Tailwind theme includes ring colors.
- Badge or Label variant not applying:
  - Check variant names match the cva definition and className is not overriding the variant classes.

**Section sources**
- [button.tsx:43-53](file://components/ui/button.tsx#L43-L53)
- [select.tsx:70-99](file://components/ui/select.tsx#L70-L99)
- [tooltip.tsx:8-32](file://components/ui/tooltip.tsx#L8-L32)
- [tabs.tsx:112-122](file://app/mediasi/page.tsx#L112-L122)
- [tailwind.config.ts:20-77](file://tailwind.config.ts#L20-L77)
- [badge.tsx:6-24](file://components/ui/badge.tsx#L6-L24)
- [label.tsx:9-11](file://components/ui/label.tsx#L9-L11)

## Conclusion
The UI component library leverages Radix UI for accessibility and Tailwind for a cohesive design system. Components are structured around variant-driven styling with cva, consistent class merging via cn(), and clear composition patterns. The addition of the Tabs component system completes the component library with comprehensive tabbed interface functionality, providing accessible navigation patterns that integrate seamlessly with the existing design system.

## Appendices

### Design System Principles
- Tokens-first: Colors, spacing, radii, and animations are defined centrally.
- Variants over overrides: Prefer variant props to maintain consistency.
- Accessibility-first: Built on Radix UI primitives with proper ARIA and keyboard navigation.
- Composition: Small, focused components compose into larger layouts.

**Section sources**
- [tailwind.config.ts:20-77](file://tailwind.config.ts#L20-L77)
- [components.json:6-12](file://components.json#L6-L12)

### Extending Components
- Add a new variant:
  - Extend cva in the component's file and export the updated variant function.
  - Update the component's prop interface to include the new variant option.
- Introduce a new component:
  - Place it under components/ui with a clear name.
  - Use cn() for class merging and Tailwind tokens for styling.
  - Wrap content in Radix primitives when appropriate for accessibility.
- Customize appearance:
  - Pass className to augment defaults; avoid overriding variant classes.
  - Adjust Tailwind tokens in the central configuration for global changes.

**Section sources**
- [button.tsx:7-35](file://components/ui/button.tsx#L7-L35)
- [badge.tsx:6-24](file://components/ui/badge.tsx#L6-L24)
- [utils.ts:4-6](file://lib/utils.ts#L4-L6)
- [tailwind.config.ts:20-77](file://tailwind.config.ts#L20-L77)

### Tabs Component Usage Examples

**Real-world Implementation** The Tabs component is used extensively in the mediasi page for organizing content into logical sections.

```typescript
// Basic Tabs structure with two tab panels
<Tabs defaultValue="sk" className="w-full">
  <TabsList className="grid w-full grid-cols-2 max-w-[400px] mb-4">
    <TabsTrigger value="sk" className="flex items-center gap-2">
      <FileText className="h-4 w-4" /> SK Tahunan
    </TabsTrigger>
    <TabsTrigger value="banner" className="flex items-center gap-2">
      <Users className="h-4 w-4" /> Banner Mediator
    </TabsTrigger>
  </TabsList>

  <TabsContent value="sk">
    {/* SK content goes here */}
  </TabsContent>

  <TabsContent value="banner">
    {/* Banner content goes here */}
  </TabsContent>
</Tabs>
```

**Section sources**
- [page.tsx:112-122](file://app/mediasi/page.tsx#L112-L122)
- [page.tsx:125-202](file://app/mediasi/page.tsx#L125-L202)
- [page.tsx:204-261](file://app/mediasi/page.tsx#L204-L261)