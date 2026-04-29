# Mediasi Module

<cite>
**Referenced Files in This Document**
- [app/mediasi/page.tsx](file://app/mediasi/page.tsx)
- [app/mediasi/banners/tambah/page.tsx](file://app/mediasi/banners/tambah/page.tsx)
- [app/mediasi/sk/tambah/page.tsx](file://app/mediasi/sk/tambah/page.tsx)
- [app/mediasi/banners/[id]/edit/page.tsx](file://app/mediasi/banners/[id]/edit/page.tsx)
- [app/mediasi/sk/[id]/edit/page.tsx](file://app/mediasi/sk/[id]/edit/page.tsx)
- [lib/api.ts](file://lib/api.ts)
- [components/ui/button.tsx](file://components/ui/button.tsx)
- [components/ui/card.tsx](file://components/ui/card.tsx)
- [components/ui/table.tsx](file://components/ui/table.tsx)
- [hooks/use-toast.ts](file://hooks/use-toast.ts)
- [app/layout.tsx](file://app/layout.tsx)
- [app/globals.css](file://app/globals.css)
</cite>

## Update Summary
**Changes Made**
- Enhanced type safety and type conversion improvements in form components
- Added proper type casting for URL parameters in edit components
- Improved error handling and validation patterns
- Strengthened API integration with better type safety
- Enhanced build stability through corrected import statements

## Table of Contents
1. [Introduction](#introduction)
2. [Project Structure](#project-structure)
3. [Core Components](#core-components)
4. [Architecture Overview](#architecture-overview)
5. [Detailed Component Analysis](#detailed-component-analysis)
6. [API Integration](#api-integration)
7. [UI Components](#ui-components)
8. [State Management](#state-management)
9. [Performance Considerations](#performance-considerations)
10. [Build Fixes and Type Safety Enhancements](#build-fixes-and-type-safety-enhancements)
11. [Troubleshooting Guide](#troubleshooting-guide)
12. [Conclusion](#conclusion)

## Introduction

The Mediasi Module is a comprehensive administrative interface designed for managing mediation-related content within the court administration system. This module provides functionality for managing two primary areas: Annual Mediation Decrees (SK) and Mediator Banners. The system allows administrators to create, view, edit, and delete mediation-related documents and promotional banners, with support for both judges and non-judge mediators.

The module follows modern React patterns with Next.js App Router, utilizing server-side rendering capabilities and client-side interactivity. It integrates with a backend API through a centralized API service layer and provides a responsive, accessible user interface built with Tailwind CSS and Radix UI components.

**Updated** Recent build improvements have enhanced type safety, fixed syntax errors, and improved type conversion handling throughout the module, resulting in increased stability and reliability.

## Project Structure

The Mediasi module is organized within the Next.js application structure, following the conventional file-based routing pattern:

```mermaid
graph TB
subgraph "Mediasi Module Structure"
A[app/mediasi/] --> B[Main Page]
A --> C[Banners Section]
A --> D[SK Section]
B --> E[page.tsx]
C --> F[tambah/page.tsx]
C --> G[[id]/edit/page.tsx]
D --> H[tambah/page.tsx]
D --> I[[id]/edit/page.tsx]
J[lib/api.ts] --> K[Mediasi Functions]
L[components/ui/] --> M[Button]
L --> N[Card]
L --> O[Table]
end
```

**Diagram sources**
- [app/mediasi/page.tsx:1-294](file://app/mediasi/page.tsx#L1-L294)
- [lib/api.ts:1147-1233](file://lib/api.ts#L1147-L1233)

**Section sources**
- [app/mediasi/page.tsx:1-294](file://app/mediasi/page.tsx#L1-L294)
- [app/mediasi/banners/tambah/page.tsx:1-112](file://app/mediasi/banners/tambah/page.tsx#L1-L112)
- [app/mediasi/sk/tambah/page.tsx:1-112](file://app/mediasi/sk/tambah/page.tsx#L1-L112)

## Core Components

The Mediasi module consists of several key components that work together to provide a comprehensive administrative interface:

### Main Dashboard Component
The primary dashboard serves as the central hub for managing both SK (Mediation Decrees) and Banner content. It features tabbed navigation allowing users to switch between different management areas seamlessly.

### Form Components
Two specialized form components handle data entry for different content types:
- **SK Form**: Handles annual mediation decree creation with support for both PDF uploads and Google Drive links
- **Banner Form**: Manages promotional banner content with image upload or URL options

### Edit Components
Each content type includes dedicated edit pages that pre-populate forms with existing data, allowing for selective updates without requiring complete re-entry.

### API Integration Layer
A centralized API service provides typed interfaces for all backend communication, handling authentication, error management, and response normalization.

**Updated** Enhanced type safety improvements ensure proper type conversion and validation throughout the form components, particularly in parameter handling and data transformation.

**Section sources**
- [app/mediasi/page.tsx:38-294](file://app/mediasi/page.tsx#L38-L294)
- [app/mediasi/banners/tambah/page.tsx:16-112](file://app/mediasi/banners/tambah/page.tsx#L16-L112)
- [app/mediasi/sk/tambah/page.tsx:15-112](file://app/mediasi/sk/tambah/page.tsx#L15-L112)

## Architecture Overview

The Mediasi module follows a clean architecture pattern with clear separation of concerns:

```mermaid
graph TB
subgraph "Presentation Layer"
A[Mediasi Dashboard] --> B[SK Management]
A --> C[Banner Management]
end
subgraph "Component Layer"
D[Form Components] --> E[Add/Edit Forms]
F[UI Components] --> G[Button/Card/Table]
end
subgraph "Service Layer"
H[API Service] --> I[Mediasi Functions]
H --> J[Error Handling]
end
subgraph "Data Layer"
K[Backend API] --> L[Mediasi SK]
K --> M[Mediator Banners]
end
A --> D
A --> F
D --> H
F --> H
H --> K
```

**Diagram sources**
- [lib/api.ts:1147-1233](file://lib/api.ts#L1147-L1233)
- [components/ui/button.tsx:1-58](file://components/ui/button.tsx#L1-L58)
- [components/ui/card.tsx:1-77](file://components/ui/card.tsx#L1-L77)

The architecture emphasizes:
- **Separation of Concerns**: Clear boundaries between presentation, business logic, and data layers
- **Type Safety**: Comprehensive TypeScript interfaces for all data structures
- **Reusability**: Shared UI components and API functions across different contexts
- **Error Resilience**: Centralized error handling and user feedback mechanisms

## Detailed Component Analysis

### Main Dashboard Component

The primary dashboard component orchestrates the entire Mediasi module functionality:

```mermaid
classDiagram
class MediasiDashboard {
+useState skData
+useState bannerData
+useState loading
+useState deleteSkId
+useState deleteBannerId
+loadData() void
+handleDeleteSk() void
+handleDeleteBanner() void
}
class MediasiSk {
+number id
+number tahun
+string link_sk_hakim
+string link_sk_non_hakim
}
class MediatorBanner {
+number id
+string judul
+string image_url
+string type
}
MediasiDashboard --> MediasiSk : manages
MediasiDashboard --> MediatorBanner : manages
```

**Diagram sources**
- [app/mediasi/page.tsx:39-44](file://app/mediasi/page.tsx#L39-L44)
- [lib/api.ts:1150-1166](file://lib/api.ts#L1150-L1166)

Key features include:
- **Tabbed Interface**: Separate tabs for SK management and banner management
- **Dual Data Loading**: Concurrent loading of both SK and banner data
- **Modal Confirmation**: Confirmation dialogs for deletion operations
- **Responsive Design**: Grid layout for banners and table layout for SK data

**Updated** Improved type safety ensures proper handling of optional properties and null values in the data structures.

**Section sources**
- [app/mediasi/page.tsx:38-294](file://app/mediasi/page.tsx#L38-L294)

### SK Management Component

The SK management component handles annual mediation decree administration:

```mermaid
sequenceDiagram
participant User as User
participant Form as SK Form
participant API as API Service
participant Backend as Backend Server
User->>Form : Fill SK Details
Form->>Form : Validate Input
Form->>API : createMediasiSk(formData)
API->>Backend : POST /mediasi-sk
Backend-->>API : Response
API-->>Form : ApiResponse
Form->>User : Show Success/Error Message
Form->>Form : Navigate to Dashboard
```

**Diagram sources**
- [app/mediasi/sk/tambah/page.tsx:20-38](file://app/mediasi/sk/tambah/page.tsx#L20-L38)
- [lib/api.ts:1174-1181](file://lib/api.ts#L1174-L1181)

The component supports flexible input methods:
- **PDF Upload**: Direct file upload for SK documents
- **Google Drive Links**: Alternative URL-based document management
- **Year Selection**: Dynamic year selection with current year as default

**Updated** Enhanced type conversion ensures proper handling of FormData and parameter extraction, improving build stability and runtime reliability.

**Section sources**
- [app/mediasi/sk/tambah/page.tsx:15-112](file://app/mediasi/sk/tambah/page.tsx#L15-L112)

### Banner Management Component

The banner management component handles promotional content for mediators:

```mermaid
flowchart TD
Start([Banner Creation]) --> ValidateInput["Validate Form Input"]
ValidateInput --> InputValid{"Input Valid?"}
InputValid --> |No| ShowError["Show Validation Error"]
InputValid --> |Yes| PrepareData["Prepare FormData"]
PrepareData --> UploadMethod{"Upload Method?"}
UploadMethod --> |File Upload| UploadFile["Upload Image File"]
UploadMethod --> |URL Input| UseURL["Use Provided URL"]
UploadFile --> SendRequest["Send to API"]
UseURL --> SendRequest
SendRequest --> HandleResponse["Handle API Response"]
HandleResponse --> Success{"Success?"}
Success --> |Yes| ShowSuccess["Show Success Message"]
Success --> |No| ShowError
ShowSuccess --> Redirect["Redirect to Dashboard"]
ShowError --> End([End])
Redirect --> End
```

**Diagram sources**
- [app/mediasi/banners/tambah/page.tsx:22-41](file://app/mediasi/banners/tambah/page.tsx#L22-L41)

Key capabilities include:
- **Dual Category Support**: Separate management for judge and non-judge mediators
- **Flexible Image Sources**: Support for both file uploads and external URLs
- **Preview Functionality**: Ability to view current images before editing

**Updated** Improved type safety in form handling prevents runtime errors and ensures proper parameter validation throughout the component lifecycle.

**Section sources**
- [app/mediasi/banners/tambah/page.tsx:16-112](file://app/mediasi/banners/tambah/page.tsx#L16-L112)

### Edit Components

Both SK and banner edit components follow similar patterns for updating existing content:

```mermaid
classDiagram
class EditComponent {
+useState loading
+useState fetching
+useState data
+useEffect fetchData()
+handleSubmit() void
}
class EditSK {
+number tahun
+string link_sk_hakim
+string link_sk_non_hakim
}
class EditBanner {
+string judul
+string image_url
+string type
}
EditComponent --> EditSK : extends
EditComponent --> EditBanner : extends
```

**Diagram sources**
- [app/mediasi/sk/[id]/edit/page.tsx](file://app/mediasi/sk/[id]/edit/page.tsx#L15-L67)
- [app/mediasi/banners/[id]/edit/page.tsx](file://app/mediasi/banners/[id]/edit/page.tsx#L16-L71)

**Updated** Enhanced type conversion improvements ensure proper URL parameter parsing and type casting, preventing common runtime errors in production environments.

**Section sources**
- [app/mediasi/sk/[id]/edit/page.tsx](file://app/mediasi/sk/[id]/edit/page.tsx#L15-L151)
- [app/mediasi/banners/[id]/edit/page.tsx](file://app/mediasi/banners/[id]/edit/page.tsx#L16-L147)

## API Integration

The Mediasi module relies on a centralized API service that provides typed interfaces for all backend operations:

### API Function Categories

```mermaid
graph LR
subgraph "Mediasi API Functions"
A[getAllMediasiSk] --> B[createMediasiSk]
B --> C[updateMediasiSk]
C --> D[deleteMediasiSk]
E[getAllMediatorBanners] --> F[createMediatorBanner]
F --> G[updateMediatorBanner]
G --> H[deleteMediatorBanner]
end
subgraph "Shared API Features"
I[Response Normalization]
J[Error Handling]
K[Authentication]
end
A --> I
E --> I
B --> J
F --> J
C --> K
G --> K
```

**Diagram sources**
- [lib/api.ts:1168-1233](file://lib/api.ts#L1168-L1233)

### Data Models

The API defines comprehensive TypeScript interfaces for type safety:

| Interface | Properties | Description |
|-----------|------------|-------------|
| `MediasiSk` | `id`, `tahun`, `link_sk_hakim`, `link_sk_non_hakim` | Annual mediation decree records |
| `MediatorBanner` | `id`, `judul`, `image_url`, `type` | Promotional banner content |

### Request/Response Patterns

The API service implements consistent patterns for all operations:
- **FormData Support**: All create/update operations support multipart form data for file uploads
- **Method Override**: Uses POST with `_method=PUT` for file uploads to comply with server requirements
- **Response Normalization**: Consistent response structure across all endpoints
- **Error Handling**: Centralized error processing with user-friendly messages

**Updated** Recent build fixes have improved type conversion handling and error management, ensuring more reliable API communication and better error reporting.

**Section sources**
- [lib/api.ts:1147-1233](file://lib/api.ts#L1147-L1233)

## UI Components

The Mediasi module leverages a comprehensive set of reusable UI components:

### Button Component
The button component provides consistent styling and behavior across the application:

```mermaid
classDiagram
class Button {
+variant : "default"|"destructive"|"outline"|"secondary"|"ghost"|"link"
+size : "default"|"sm"|"lg"|"icon"
+disabled : boolean
+onClick : Function
}
class ButtonVariants {
+default : "bg-primary text-primary-foreground"
+destructive : "bg-destructive text-destructive-foreground"
+outline : "border border-input bg-background"
+secondary : "bg-secondary text-secondary-foreground"
+ghost : "hover : bg-accent"
+link : "text-primary underline"
}
Button --> ButtonVariants : uses
```

**Diagram sources**
- [components/ui/button.tsx:7-35](file://components/ui/button.tsx#L7-L35)

### Card Component
The card component provides structured content containers with consistent spacing and typography:

```mermaid
classDiagram
class Card {
+className : string
+children : ReactNode
}
class CardHeader {
+className : string
+children : ReactNode
}
class CardContent {
+className : string
+children : ReactNode
}
class CardTitle {
+className : string
+children : ReactNode
}
class CardDescription {
+className : string
+children : ReactNode
}
Card --> CardHeader
Card --> CardContent
CardHeader --> CardTitle
CardHeader --> CardDescription
```

**Diagram sources**
- [components/ui/card.tsx:5-76](file://components/ui/card.tsx#L5-L76)

### Table Component
The table component provides responsive data display with sorting and interaction capabilities:

```mermaid
classDiagram
class Table {
+className : string
+children : ReactNode
}
class TableHeader {
+className : string
+children : ReactNode
}
class TableBody {
+className : string
+children : ReactNode
}
class TableRow {
+className : string
+children : ReactNode
}
class TableCell {
+className : string
+children : ReactNode
}
Table --> TableHeader
Table --> TableBody
TableBody --> TableRow
TableRow --> TableCell
```

**Diagram sources**
- [components/ui/table.tsx:5-121](file://components/ui/table.tsx#L5-L121)

**Updated** Enhanced type safety improvements ensure proper prop validation and consistent behavior across all UI components.

**Section sources**
- [components/ui/button.tsx:1-58](file://components/ui/button.tsx#L1-L58)
- [components/ui/card.tsx:1-77](file://components/ui/card.tsx#L1-L77)
- [components/ui/table.tsx:1-121](file://components/ui/table.tsx#L1-L121)

## State Management

The Mediasi module employs React's built-in state management patterns:

### Local State Management
Each component maintains its own local state using React hooks:

```mermaid
stateDiagram-v2
[*] --> Idle
Idle --> Loading : loadData()
Loading --> Success : Data Loaded
Loading --> Error : API Error
Success --> Editing : Edit Mode
Success --> Deleting : Delete Action
Editing --> Success : Save Complete
Deleting --> Success : Delete Complete
Error --> Idle : Retry
Success --> Idle : Reset
```

### Global State Management
The application uses a centralized toast notification system for user feedback:

```mermaid
sequenceDiagram
participant Component as Component
participant ToastHook as useToast Hook
participant ToastSystem as Toast System
participant User as User
Component->>ToastHook : toast({title, description})
ToastHook->>ToastSystem : Add Toast
ToastSystem->>User : Display Notification
User->>ToastSystem : Interact with Toast
ToastSystem->>ToastHook : Remove Toast
ToastHook->>Component : Update State
```

**Diagram sources**
- [hooks/use-toast.ts:145-195](file://hooks/use-toast.ts#L145-L195)

**Updated** Improved type safety in state management ensures proper type conversion and validation throughout the component lifecycle.

**Section sources**
- [hooks/use-toast.ts:1-195](file://hooks/use-toast.ts#L1-L195)

## Performance Considerations

The Mediasi module implements several performance optimization strategies:

### Lazy Loading
- **Component-Level**: Individual pages are loaded on-demand based on route navigation
- **Image Optimization**: Banner images use responsive loading with hover effects
- **Skeleton Loading**: Skeleton components provide immediate visual feedback during data loading

### Memory Management
- **Cleanup Functions**: Proper cleanup of timers and event listeners in useEffect hooks
- **Conditional Rendering**: Components only render when data is available
- **Optimized Re-renders**: Minimal state updates to reduce unnecessary re-renders

### Network Optimization
- **Concurrent Loading**: SK and banner data load concurrently using Promise.all
- **Cache Control**: No-cache headers prevent stale data issues
- **Error Boundaries**: Graceful handling of network failures

**Updated** Recent build improvements have enhanced memory management and error handling, contributing to overall improved performance and stability.

## Build Fixes and Type Safety Enhancements

The Mediasi module has undergone significant build improvements focused on type safety and stability:

### Type Conversion Improvements
- **Enhanced Parameter Parsing**: Improved URL parameter handling with proper type casting
- **FormData Type Safety**: Strengthened type validation for form submissions
- **Optional Property Handling**: Better management of nullable and optional properties

### Missing Import Corrections
- **Consistent Import Patterns**: Standardized import statements across all components
- **TypeScript Declaration Fixes**: Corrected type declarations and interface implementations
- **Module Resolution**: Fixed import resolution issues affecting build stability

### Syntax Error Resolutions
- **TypeScript Compilation**: Resolved compilation errors and type mismatches
- **Runtime Error Prevention**: Implemented defensive programming practices
- **Build Pipeline Optimization**: Improved build process reliability

### API Integration Enhancements
- **Response Type Validation**: Strengthened API response type checking
- **Error Handling Improvements**: Enhanced error detection and reporting
- **Network Request Optimization**: Improved request/response handling patterns

**Updated** These build fixes collectively improve the module's stability, type safety, and overall reliability in production environments.

**Section sources**
- [app/mediasi/page.tsx:1-294](file://app/mediasi/page.tsx#L1-L294)
- [lib/api.ts:1147-1233](file://lib/api.ts#L1147-L1233)
- [hooks/use-toast.ts:1-195](file://hooks/use-toast.ts#L1-L195)

## Troubleshooting Guide

### Common Issues and Solutions

#### API Connection Problems
**Symptoms**: Dashboard fails to load data, error notifications appear
**Causes**: 
- Backend API unavailable
- Incorrect API URL configuration
- Missing API key

**Solutions**:
1. Verify API URL in environment variables
2. Check network connectivity to backend service
3. Confirm API key permissions

#### File Upload Issues
**Symptoms**: Banner creation fails with file upload errors
**Causes**:
- File size limits exceeded
- Unsupported file formats
- Server-side validation failures

**Solutions**:
1. Verify file format (image/*) and size limits
2. Check server configuration for upload limits
3. Review browser console for detailed error messages

#### Form Validation Errors
**Symptoms**: Form submission blocked with validation messages
**Causes**:
- Missing required fields
- Invalid data formats
- Duplicate entries

**Solutions**:
1. Ensure all required fields are completed
2. Verify data formats match field expectations
3. Check for existing duplicate entries

#### Navigation Issues
**Symptoms**: Links not working or routes not found
**Causes**:
- Incorrect file paths
- Missing route configuration
- Build artifacts issues

**Solutions**:
1. Verify file paths match Next.js routing conventions
2. Check for typos in navigation links
3. Clear browser cache and rebuild application

#### Type Conversion Errors
**Symptoms**: Runtime errors related to type mismatches or parameter parsing
**Causes**:
- Incorrect type casting in URL parameters
- Missing type validation in form handlers
- Inconsistent data type handling

**Solutions**:
1. Verify proper type casting for URL parameters using parseInt()
2. Implement comprehensive form validation with proper type checking
3. Ensure consistent data type handling throughout component lifecycle

**Updated** Recent build fixes address most type conversion and syntax error issues, but developers should still implement proper type validation when extending the module.

**Section sources**
- [lib/api.ts:1168-1233](file://lib/api.ts#L1168-L1233)
- [hooks/use-toast.ts:1-195](file://hooks/use-toast.ts#L1-L195)

## Conclusion

The Mediasi Module represents a well-architected administrative solution for managing mediation-related content within the court administration system. The module successfully combines modern React patterns with robust backend integration to provide a comprehensive management interface.

Recent build improvements have significantly enhanced the module's stability and type safety through comprehensive type conversion improvements, missing import corrections, and syntax error resolutions. These changes contribute to increased reliability and maintainability of the codebase.

Key strengths of the implementation include:
- **Clean Architecture**: Clear separation of concerns with well-defined boundaries
- **Enhanced Type Safety**: Comprehensive TypeScript integration with recent build improvements
- **Improved Stability**: Recent fixes address build issues and runtime errors
- **User Experience**: Responsive design with thoughtful interaction patterns
- **Extensibility**: Modular component structure supports future enhancements
- **Error Handling**: Robust error management with user-friendly feedback

The module effectively addresses the core requirements of managing both annual mediation decrees and promotional banners while maintaining high standards for code quality, performance, and user experience. The recent build improvements provide a solid foundation for future development and maintenance within the broader administrative system, with enhanced stability and type safety ensuring reliable operation in production environments.