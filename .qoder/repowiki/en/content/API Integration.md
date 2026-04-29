# API Integration

<cite>
**Referenced Files in This Document**
- [api.ts](file://lib/api.ts)
- [use-toast.ts](file://hooks/use-toast.ts)
- [toast.tsx](file://components/ui/toast.tsx)
- [layout.tsx](file://app/layout.tsx)
- [panggilan/page.tsx](file://app/panggilan/page.tsx)
- [agenda/page.tsx](file://app/agenda/page.tsx)
- [laporan-pengaduan/page.tsx](file://app/laporan-pengaduan/page.tsx)
- [mediasi/page.tsx](file://app/mediasi/page.tsx)
- [mediasi/sk/tambah/page.tsx](file://app/mediasi/sk/tambah/page.tsx)
- [mediasi/banners/tambah/page.tsx](file://app/mediasi/banners/tambah/page.tsx)
- [mediasi/sk/[id]/edit/page.tsx](file://app/mediasi/sk/[id]/edit/page.tsx)
- [sk-inovasi/page.tsx](file://app/sk-inovasi/page.tsx)
- [sk-inovasi/tambah/page.tsx](file://app/sk-inovasi/tambah/page.tsx)
- [sk-inovasi/[id]/edit/page.tsx](file://app/sk-inovasi/[id]/edit/page.tsx)
- [utils.ts](file://lib/utils.ts)
- [package.json](file://package.json)
</cite>

## Update Summary
**Changes Made**
- Added comprehensive SK Inovasi API functions including getAllSkInovasi(), getSkInovasi(), createSkInovasi(), updateSkInovasi(), and deleteSkInovasi() with support for both JSON and FormData responses
- Integrated SK Inovasi data model with file upload scenarios and enhanced error handling
- Implemented complete UI components for SK Inovasi management including list, add, and edit functionality
- Enhanced file upload handling with support for both URL-based content and direct file uploads
- Updated endpoint specifications and practical usage examples for SK Inovasi operations

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
This document describes the centralized RESTful API client and integration patterns used across the admin panel. It covers:
- Centralized API client architecture and HTTP methods
- URL patterns and request/response handling
- Authentication and response normalization
- CRUD endpoints for multiple resources including new SK Inovasi management
- Data models and parameter validation
- Toast notification system for user feedback and error display
- Loading states and pagination patterns
- Practical usage examples and best practices
- Caching strategies, performance optimization, and offline handling
- Troubleshooting and debugging techniques

## Project Structure
The API integration is implemented in a single centralized module that exposes typed functions for each resource. Pages consume these functions and integrate with a toast notification system for user feedback. The system now includes comprehensive SK Inovasi management capabilities alongside existing Mediasi management functionality.

```mermaid
graph TB
subgraph "Pages"
P1["app/panggilan/page.tsx"]
P2["app/agenda/page.tsx"]
P3["app/laporan-pengaduan/page.tsx"]
M1["app/mediasi/page.tsx"]
M2["app/mediasi/sk/tambah/page.tsx"]
M3["app/mediasi/banners/tambah/page.tsx"]
M4["app/mediasi/sk/[id]/edit/page.tsx"]
SI1["app/sk-inovasi/page.tsx"]
SI2["app/sk-inovasi/tambah/page.tsx"]
SI3["app/sk-inovasi/[id]/edit/page.tsx"]
end
subgraph "UI"
L["app/layout.tsx"]
TComp["components/ui/toast.tsx"]
UToast["hooks/use-toast.ts"]
end
subgraph "API Layer"
API["lib/api.ts"]
Utils["lib/utils.ts"]
end
P1 --> API
P2 --> API
P3 --> API
M1 --> API
M2 --> API
M3 --> API
M4 --> API
SI1 --> API
SI2 --> API
SI3 --> API
L --> TComp
TComp --> UToast
P1 --> UToast
P2 --> UToast
P3 --> UToast
M1 --> UToast
M2 --> UToast
M3 --> UToast
M4 --> UToast
SI1 --> UToast
SI2 --> UToast
SI3 --> UToast
P1 --> Utils
P2 --> Utils
P3 --> Utils
M1 --> Utils
M2 --> Utils
M3 --> Utils
M4 --> Utils
SI1 --> Utils
SI2 --> Utils
SI3 --> Utils
```

**Diagram sources**
- [api.ts:1-1386](file://lib/api.ts#L1-L1386)
- [use-toast.ts:1-195](file://hooks/use-toast.ts#L1-L195)
- [toast.tsx:1-130](file://components/ui/toast.tsx#L1-L130)
- [layout.tsx:1-37](file://app/layout.tsx#L1-L37)
- [panggilan/page.tsx:1-310](file://app/panggilan/page.tsx#L1-L310)
- [agenda/page.tsx:1-284](file://app/agenda/page.tsx#L1-L284)
- [laporan-pengaduan/page.tsx:1-355](file://app/laporan-pengaduan/page.tsx#L1-L355)
- [mediasi/page.tsx:1-222](file://app/mediasi/page.tsx#L1-L222)
- [mediasi/sk/tambah/page.tsx:1-112](file://app/mediasi/sk/tambah/page.tsx#L1-L112)
- [mediasi/banners/tambah/page.tsx:1-112](file://app/mediasi/banners/tambah/page.tsx#L1-L112)
- [mediasi/sk/[id]/edit/page.tsx:1-151](file://app/mediasi/sk/[id]/edit/page.tsx#L1-L151)
- [sk-inovasi/page.tsx:1-214](file://app/sk-inovasi/page.tsx#L1-L214)
- [sk-inovasi/tambah/page.tsx:1-191](file://app/sk-inovasi/tambah/page.tsx#L1-L191)
- [sk-inovasi/[id]/edit/page.tsx:1-227](file://app/sk-inovasi/[id]/edit/page.tsx#L1-L227)
- [utils.ts:1-26](file://lib/utils.ts#L1-L26)

**Section sources**
- [api.ts:1-1386](file://lib/api.ts#L1-L1386)
- [use-toast.ts:1-195](file://hooks/use-toast.ts#L1-L195)
- [toast.tsx:1-130](file://components/ui/toast.tsx#L1-L130)
- [layout.tsx:1-37](file://app/layout.tsx#L1-L37)
- [panggilan/page.tsx:1-310](file://app/panggilan/page.tsx#L1-L310)
- [agenda/page.tsx:1-284](file://app/agenda/page.tsx#L1-L284)
- [laporan-pengaduan/page.tsx:1-355](file://app/laporan-pengaduan/page.tsx#L1-L355)
- [mediasi/page.tsx:1-222](file://app/mediasi/page.tsx#L1-L222)
- [mediasi/sk/tambah/page.tsx:1-112](file://app/mediasi/sk/tambah/page.tsx#L1-L112)
- [mediasi/banners/tambah/page.tsx:1-112](file://app/mediasi/banners/tambah/page.tsx#L1-L112)
- [mediasi/sk/[id]/edit/page.tsx:1-151](file://app/mediasi/sk/[id]/edit/page.tsx#L1-L151)
- [sk-inovasi/page.tsx:1-214](file://app/sk-inovasi/page.tsx#L1-L214)
- [sk-inovasi/tambah/page.tsx:1-191](file://app/sk-inovasi/tambah/page.tsx#L1-L191)
- [sk-inovasi/[id]/edit/page.tsx:1-227](file://app/sk-inovasi/[id]/edit/page.tsx#L1-L227)
- [utils.ts:1-26](file://lib/utils.ts#L1-L26)

## Core Components
- Centralized API client: Provides typed functions for CRUD operations against multiple resources including new SK Inovasi management endpoints. It normalizes diverse server response formats into a unified shape and adds an API key header.
- Toast notification system: Provides a lightweight, Radix-based toast system with a hook for imperative notifications and a provider in the root layout.
- Page components: Consume the API client, manage loading states, pagination, and user actions, and surface feedback via the toast system.

Key responsibilities:
- API client: HTTP transport, headers, normalization, error shaping, and resource-specific endpoints.
- Toast system: Notification lifecycle, deduplication, and dismissal behavior.
- Pages: Orchestrate data fetching, pagination, editing, and deletion flows.

**Section sources**
- [api.ts:43-80](file://lib/api.ts#L43-L80)
- [api.ts:82-91](file://lib/api.ts#L82-L91)
- [use-toast.ts:1-195](file://hooks/use-toast.ts#L1-L195)
- [toast.tsx:1-130](file://components/ui/toast.tsx#L1-L130)
- [layout.tsx:1-37](file://app/layout.tsx#L1-L37)

## Architecture Overview
The system follows a layered architecture:
- UI layer (pages) orchestrates user interactions and renders data.
- API layer encapsulates HTTP calls and response normalization.
- Toast layer provides global user feedback.

```mermaid
sequenceDiagram
participant Page as "Page Component"
participant API as "API Client"
participant Server as "Backend API"
participant Toast as "Toast Hook"
Page->>API : "Call resource function"
API->>Server : "fetch(url, { method, headers, body })"
Server-->>API : "Response JSON"
API->>API : "normalizeApiResponse()"
API-->>Page : "ApiResponse<T>"
alt success
Page->>Toast : "toast({ title, description })"
else failure
Page->>Toast : "toast({ variant : destructive, title, description })"
end
```

**Diagram sources**
- [api.ts:53-80](file://lib/api.ts#L53-L80)
- [api.ts:82-91](file://lib/api.ts#L82-L91)
- [use-toast.ts:145-172](file://hooks/use-toast.ts#L145-L172)
- [panggilan/page.tsx:57-63](file://app/panggilan/page.tsx#L57-L63)

**Section sources**
- [api.ts:53-80](file://lib/api.ts#L53-L80)
- [api.ts:82-91](file://lib/api.ts#L82-L91)
- [use-toast.ts:145-172](file://hooks/use-toast.ts#L145-L172)
- [panggilan/page.tsx:57-63](file://app/panggilan/page.tsx#L57-L63)

## Detailed Component Analysis

### API Client: Centralized HTTP Layer
- Configuration:
  - Base URL and API key are loaded from environment variables.
  - Headers include an API key and Content-Type for JSON.
- Response normalization:
  - Supports multiple server response shapes:
    - Standard: { success: boolean, data?, message?, total?, current_page?, last_page?, per_page? }
    - Agenda API: { status: 'success'|'error', ... } mapped to standard shape
    - Fallback: { success: response.ok, data?, message? }
- HTTP methods and patterns:
  - GET: fetch lists and single records; includes query params and pagination.
  - POST: create records; supports FormData for file uploads.
  - PUT: update records; for FormData, uses POST with _method=PUT appended.
  - DELETE: remove records.
- File upload handling:
  - Several endpoints accept FormData; the client sets appropriate headers and uses POST with _method=PUT for updates.

**Updated** Added comprehensive SK Inovasi management endpoints with proper file upload handling for PDF documents and URL-based content.

Endpoints and patterns by resource:
- Panggilan Ghaib: getAllPanggilan, getPanggilan, createPanggilan, updatePanggilan, deletePanggilan
- Itsbat Nikah: getAllItsbat, getItsbat, createItsbat, updateItsbat, deleteItsbat
- Panggilan E-Court: getAllPanggilanEcourt, getPanggilanEcourt, createPanggilanEcourt, updatePanggilanEcourt, deletePanggilanEcourt
- Agenda Pimpinan: getAllAgenda, getAgenda, createAgenda, updateAgenda, deleteAgenda
- LHKPN Reports: getAllLhkpn, getLhkpn, createLhkpn, updateLhkpn, deleteLhkpn
- Realisasi Anggaran: getAllAnggaran, getAnggaran, createAnggaran, updateAnggaran, deleteAnggaran
- Pagu Anggaran: getAllPagu, updatePagu, deletePagu
- DIPA Pok: getAllDipaPok, getDipaPok, createDipaPok, updateDipaPok, deleteDipaPok
- Aset BMN: getAllAsetBmn, getAsetBmn, createAsetBmn, updateAsetBmn, deleteAsetBmn
- SAKIP: getAllSakip, getSakip, createSakip, updateSakip, deleteSakip
- Laporan Pengaduan: getAllLaporanPengaduan, getLaporanPengaduan, createLaporanPengaduan, updateLaporanPengaduan, deleteLaporanPengaduan
- Keuangan Perkara: getAllKeuanganPerkara, getKeuanganPerkara, createKeuanganPerkara, updateKeuanganPerkara, deleteKeuanganPerkara
- Sisa Panjar: getAllSisaPanjar, getSisaPanjar, createSisaPanjar, updateSisaPanjar, deleteSisaPanjar
- MOU: getAllMou, getMou, createMou, updateMou, deleteMou
- LRA: getAllLra, getLra, createLra, updateLra, deleteLra
- **Mediasi SK Management**: getAllMediasiSk, createMediasiSk, updateMediasiSk, deleteMediasiSk
- **Mediator Banner Management**: getAllMediatorBanners, createMediatorBanner, updateMediatorBanner, deleteMediatorBanner
- **SK Inovasi Management**: getAllSkInovasi, getSkInovasi, createSkInovasi, updateSkInovasi, deleteSkInovasi

Response normalization and error handling:
- normalizeApiResponse adapts server responses to a consistent shape.
- Some endpoints (e.g., Laporan Pengaduan, Keuangan Perkara) implement custom error handling that extracts field-level validation messages from JSON errors.

Caching and request options:
- Many GET endpoints set cache: 'no-store' to bypass browser caching.

Authentication:
- All requests include X-API-Key header populated from NEXT_PUBLIC_API_KEY.

**Section sources**
- [api.ts:1-1386](file://lib/api.ts#L1-L1386)

### Data Models and Parameter Validation
The API client defines TypeScript interfaces for each resource. Validation is primarily enforced by the backend; the client surfaces errors via normalized responses and toast notifications. Example models include:
- Panggilan, ItsbatNikah, AgendaPimpinan
- LhkpnReport, RealisasiAnggaran, PaguAnggaran, DipaPok
- AsetBmn, Sakip
- LaporanPengaduan (with enumerated fields)
- KeuanganPerkara, SisaPanjar, Mou, LraReport
- **MediasiSk**: { id?, tahun, link_sk_hakim?, link_sk_non_hakim?, created_at?, updated_at? }
- **MediatorBanner**: { id?, judul, image_url, type: 'hakim' | 'non-hakim', created_at?, updated_at? }
- **SkInovasi**: { id: number, tahun: number, nomor_sk: string, tentang: string, file_path?: string, file_url?: string, is_active: boolean, created_at?: string, updated_at?: string }

**Updated** Added new data model for SK Inovasi with comprehensive typing for file upload fields, URL-based content, and activation status.

Validation patterns:
- Enumerated fields (e.g., LaporanPengaduan.materi_pengaduan) restrict values.
- Numeric fields enforce non-negative amounts where applicable.
- Date fields are handled as ISO strings and formatted for display.
- **Mediasi SK**: Tahun harus berupa angka positif, link file atau URL opsional.
- **Mediator Banner**: Judul harus diisi, image_url bisa berupa file atau URL, type harus 'hakim' atau 'non-hakim'.
- **Sk Inovasi**: Tahun harus berupa angka positif, nomor_sk dan tentang harus diisi, file_path/file_url bersifat opsional, is_active harus boolean.

**Section sources**
- [api.ts:43-64](file://lib/api.ts#L43-L64)
- [api.ts:1179-1195](file://lib/api.ts#L1179-L1195)
- [api.ts:1335-1385](file://lib/api.ts#L1335-L1385)

### Toast Notification System
- Provider and components: Radix-based toast provider and UI components.
- Hook: useToast provides imperative toast creation and dismissal.
- Behavior:
  - Limit toasts to one at a time.
  - Auto-dismiss after a long timeout.
  - Dismiss on open change or explicit dismiss.
  - Expose update and dismiss helpers.

Integration:
- Root layout mounts the Toaster provider.
- Pages call toast() with title/description and optional variant for error states.

**Section sources**
- [toast.tsx:1-130](file://components/ui/toast.tsx#L1-L130)
- [use-toast.ts:1-195](file://hooks/use-toast.ts#L1-L195)
- [layout.tsx:1-37](file://app/layout.tsx#L1-L37)

### Pagination and Loading States
- Pagination:
  - Pages pass current_page and last_page from API responses to render pagination controls.
  - Some endpoints support per_page or page parameters.
- Loading:
  - Pages set loading state during fetch and render skeletons while data is loading.
  - Pagination links trigger reloads with the selected page.

**Section sources**
- [panggilan/page.tsx:35-137](file://app/panggilan/page.tsx#L35-L137)
- [agenda/page.tsx:56-131](file://app/agenda/page.tsx#L56-L131)
- [laporan-pengaduan/page.tsx:32-120](file://app/laporan-pengaduan/page.tsx#L32-L120)

### Practical Usage Examples and Best Practices
- Fetching lists with filters and pagination:
  - Use getAll* functions with optional query parameters (e.g., tahun, page, per_page).
  - Handle success/failure and update pagination state accordingly.
- Creating and updating records:
  - For file uploads, pass FormData; otherwise pass plain objects.
  - On update, FormData triggers POST with _method=PUT.
- Deleting records:
  - Confirm with an alert dialog; show success/error via toast.
- Error handling:
  - Normalize errors via API client or custom handlers.
  - Display user-friendly messages via toast.

**Updated** Added comprehensive examples for SK Inovasi management operations including file upload handling and form data construction with dual support for URL-based content and direct file uploads.

**Section sources**
- [panggilan/page.tsx:42-90](file://app/panggilan/page.tsx#L42-L90)
- [agenda/page.tsx:62-105](file://app/agenda/page.tsx#L62-L105)
- [laporan-pengaduan/page.tsx:43-117](file://app/laporan-pengaduan/page.tsx#L43-L117)
- [mediasi/sk/tambah/page.tsx:20-38](file://app/mediasi/sk/tambah/page.tsx#L20-L38)
- [mediasi/banners/tambah/page.tsx:22-41](file://app/mediasi/banners/tambah/page.tsx#L22-L41)
- [sk-inovasi/tambah/page.tsx:30-65](file://app/sk-inovasi/tambah/page.tsx#L30-L65)
- [sk-inovasi/[id]/edit/page.tsx:51-86](file://app/sk-inovasi/[id]/edit/page.tsx#L51-L86)

### SK Inovasi Management Endpoints
**New Section** Comprehensive SK Inovasi management capabilities for annual innovation decision documents.

#### SK Inovasi Management
- getAllSkInovasi: Retrieve all SK Inovasi records with optional tahun and active filters
- getSkInovasi: Retrieve single SK Inovasi record by ID
- createSkInovasi: Create new SK Inovasi with file upload support (PDF, DOC, DOCX)
- updateSkInovasi: Update existing SK Inovasi with file replacement or URL update
- deleteSkInovasi: Remove SK Inovasi records

#### SK Inovasi Data Model Features
- Dual content support: Either file upload (PDF/DOC/DOCX) OR external URL (Google Drive)
- Activation control: is_active flag to enable/disable SK Inovasi visibility
- Comprehensive metadata: tahun, nomor_sk, tentang with proper validation
- Flexible file handling: file_path vs file_url with automatic override behavior

**Section sources**
- [api.ts:1335-1385](file://lib/api.ts#L1335-L1385)
- [sk-inovasi/page.tsx:20-64](file://app/sk-inovasi/page.tsx#L20-L64)
- [sk-inovasi/tambah/page.tsx:17-65](file://app/sk-inovasi/tambah/page.tsx#L17-L65)
- [sk-inovasi/[id]/edit/page.tsx:17-86](file://app/sk-inovasi/[id]/edit/page.tsx#L17-L86)

### Mediasi Management Endpoints
**Updated** Enhanced Mediasi management capabilities with comprehensive SK and banner management.

#### Mediasi SK Management
- getAllMediasiSk: Retrieve all SK records with pagination support
- createMediasiSk: Create new SK record with PDF file upload support
- updateMediasiSk: Update existing SK record with file replacement
- deleteMediasiSk: Remove SK records

#### Mediator Banner Management
- getAllMediatorBanners: Retrieve all banner records with filtering by type
- createMediatorBanner: Create new banner with image upload or URL
- updateMediatorBanner: Update existing banner with image replacement
- deleteMediatorBanner: Remove banner records

**Section sources**
- [api.ts:1179-1273](file://lib/api.ts#L1179-L1273)
- [mediasi/page.tsx:38-222](file://app/mediasi/page.tsx#L38-L222)
- [mediasi/sk/tambah/page.tsx:15-112](file://app/mediasi/sk/tambah/page.tsx#L15-L112)
- [mediasi/banners/tambah/page.tsx:16-112](file://app/mediasi/banners/tambah/page.tsx#L16-L112)
- [mediasi/sk/[id]/edit/page.tsx:15-151](file://app/mediasi/sk/[id]/edit/page.tsx#L15-L151)

## Dependency Analysis
- API client depends on:
  - Environment variables for base URL and API key.
  - fetch for HTTP transport.
  - Response normalization logic.
- Pages depend on:
  - API client functions.
  - Toast hook for feedback.
  - Utility functions for year options and formatting.
- Toast system depends on:
  - Radix UI primitives and Tailwind classes.
  - Root layout to mount the provider.

```mermaid
graph LR
Env["Environment Variables"] --> API["lib/api.ts"]
API --> Pages["Page Components"]
API --> ToastHook["hooks/use-toast.ts"]
ToastHook --> ToastUI["components/ui/toast.tsx"]
Layout["app/layout.tsx"] --> ToastUI
Utils["lib/utils.ts"] --> Pages
```

**Diagram sources**
- [api.ts:1-4](file://lib/api.ts#L1-L4)
- [use-toast.ts:1-195](file://hooks/use-toast.ts#L1-L195)
- [toast.tsx:1-130](file://components/ui/toast.tsx#L1-L130)
- [layout.tsx:1-37](file://app/layout.tsx#L1-L37)
- [utils.ts:1-26](file://lib/utils.ts#L1-L26)

**Section sources**
- [api.ts:1-4](file://lib/api.ts#L1-L4)
- [use-toast.ts:1-195](file://hooks/use-toast.ts#L1-L195)
- [toast.tsx:1-130](file://components/ui/toast.tsx#L1-L130)
- [layout.tsx:1-37](file://app/layout.tsx#L1-L37)
- [utils.ts:1-26](file://lib/utils.ts#L1-L26)

## Performance Considerations
- Caching:
  - Current GET endpoints use cache: 'no-store'. Consider adding caching strategies for read-heavy lists if appropriate.
- Request batching:
  - For bulk operations (e.g., seeding Laporan Pengaduan), batch requests and report partial failures.
- Network resilience:
  - Implement retry logic and exponential backoff for transient failures.
- UI responsiveness:
  - Keep loading skeletons short-lived; prefetch next pages when nearing the end.
- Offline handling:
  - Integrate service workers or local storage for read-only offline access where feasible.
- **File Upload Optimization**:
  - Implement progress indicators for large file uploads.
  - Consider chunked uploads for very large files.
  - Cache uploaded files temporarily to reduce re-upload overhead.
  - **SK Inovasi File Handling**: Support both direct file uploads and URL-based content with automatic override behavior.

## Troubleshooting Guide
Common issues and debugging techniques:
- API connectivity:
  - Verify NEXT_PUBLIC_API_URL and NEXT_PUBLIC_API_KEY are set.
  - Check network tab for failed requests and CORS errors.
- Response parsing:
  - normalizeApiResponse handles multiple shapes; confirm server responses match expectations.
- Form submission:
  - For file uploads, ensure FormData is passed and _method=PUT is appended for updates.
- Toast not appearing:
  - Confirm Toaster is mounted in the root layout and useToast is invoked in the page.
- Pagination inconsistencies:
  - Ensure current_page and last_page from API responses are used to render pagination.
- **Mediasi File Upload Issues**:
  - Verify FormData construction includes proper file fields and metadata.
  - Check server-side file upload limits and allowed MIME types.
  - Ensure _method=PUT is appended for update operations with file uploads.
- **SK Inovasi File Upload Issues**:
  - Verify FormData includes either 'file' (direct upload) OR 'file_url' (URL-based content).
  - Check server-side file upload limits and allowed MIME types (.pdf, .doc, .docx).
  - Ensure proper field naming: 'tahun', 'nomor_sk', 'tentang', 'is_active', 'file_url', 'file'.

**Section sources**
- [api.ts:1-4](file://lib/api.ts#L1-L4)
- [api.ts:53-80](file://lib/api.ts#L53-L80)
- [api.ts:82-91](file://lib/api.ts#L82-L91)
- [layout.tsx:31-31](file://app/layout.tsx#L31-L31)
- [use-toast.ts:174-192](file://hooks/use-toast.ts#L174-L192)

## Conclusion
The centralized API client provides a consistent, typed interface for interacting with multiple backend resources. Combined with a robust toast notification system and well-structured pages, it enables reliable CRUD operations, responsive UIs, and clear user feedback. The addition of comprehensive SK Inovasi management capabilities significantly enhances the system's ability to handle complex document and media management scenarios with flexible file upload options. Extending the client with caching, retries, and offline capabilities will further improve reliability and performance.

## Appendices

### Endpoint Specifications (Selected Resources)
- Panggilan Ghaib
  - GET /panggilan?page=&year=
  - GET /panggilan/:id
  - POST /panggilan (supports FormData)
  - POST /panggilan/:id (with _method=PUT for FormData)
  - DELETE /panggilan/:id
- Agenda Pimpinan
  - GET /agenda?tahun=&bulan=&page=&per_page=
  - GET /agenda/:id
  - POST /agenda
  - PUT /agenda/:id
  - DELETE /agenda/:id
- Laporan Pengaduan
  - GET /laporan-pengaduan?tahun=
  - GET /laporan-pengaduan/:id
  - POST /laporan-pengaduan
  - PUT /laporan-pengaduan/:id
  - DELETE /laporan-pengaduan/:id
- **Mediasi SK Management**
  - GET /mediasi-sk
  - POST /mediasi-sk (supports FormData with PDF files)
  - POST /mediasi-sk/:id (with _method=PUT for FormData)
  - DELETE /mediasi-sk/:id
- **Mediator Banner Management**
  - GET /mediator-banners
  - POST /mediator-banners (supports FormData with image files)
  - POST /mediator-banners/:id (with _method=PUT for FormData)
  - DELETE /mediator-banners/:id
- **SK Inovasi Management**
  - GET /sk-inovasi?tahun=&active=
  - GET /sk-inovasi/:id
  - POST /sk-inovasi (supports FormData with PDF/DOC/DOCX files OR URL-based content)
  - POST /sk-inovasi/:id (with _method=PUT for FormData)
  - DELETE /sk-inovasi/:id

**Updated** Added comprehensive SK Inovasi endpoint specifications with proper file upload handling and dual content support.

Notes:
- All endpoints include X-API-Key header.
- Some endpoints return { status: 'success'|'error', ... } which is normalized to a standard shape.
- **Mediasi endpoints support both file uploads and URL-based content**.
- **SK Inovasi endpoints support both direct file uploads and external URL content with automatic override behavior**.

**Section sources**
- [api.ts:97-149](file://lib/api.ts#L97-L149)
- [api.ts:292-334](file://lib/api.ts#L292-L334)
- [api.ts:788-850](file://lib/api.ts#L788-L850)
- [api.ts:1179-1273](file://lib/api.ts#L1179-L1273)
- [api.ts:1335-1385](file://lib/api.ts#L1335-L1385)

### UI Integration Patterns
- Loading states:
  - Set loading flag during fetch; render skeletons while loading.
- Pagination:
  - Use current_page and last_page from API responses to render navigation.
- Deletion:
  - Confirm with AlertDialog; call delete function and refresh list.
- Editing:
  - Open dialogs or forms; call update function and refresh list.
- **Mediasi Forms**:
  - Construct FormData with proper field names for file uploads.
  - Handle optional file fields and URL alternatives.
  - Display current file information with preview links.
- **SK Inovasi Forms**:
  - Support dual content input: direct file upload OR URL-based content.
  - Automatic field validation for required fields (tahun, nomor_sk, tentang).
  - File override behavior: direct upload replaces URL-based content.
  - Status toggle for activation/deactivation.

**Updated** Added comprehensive UI integration patterns for SK Inovasi management forms with dual content support.

**Section sources**
- [panggilan/page.tsx:30-137](file://app/panggilan/page.tsx#L30-L137)
- [agenda/page.tsx:47-131](file://app/agenda/page.tsx#L47-L131)
- [laporan-pengaduan/page.tsx:32-120](file://app/laporan-pengaduan/page.tsx#L32-L120)
- [mediasi/page.tsx:38-222](file://app/mediasi/page.tsx#L38-L222)
- [mediasi/sk/tambah/page.tsx:20-112](file://app/mediasi/sk/tambah/page.tsx#L20-L112)
- [mediasi/banners/tambah/page.tsx:22-112](file://app/mediasi/banners/tambah/page.tsx#L22-L112)
- [sk-inovasi/page.tsx:20-64](file://app/sk-inovasi/page.tsx#L20-L64)
- [sk-inovasi/tambah/page.tsx:17-65](file://app/sk-inovasi/tambah/page.tsx#L17-L65)
- [sk-inovasi/[id]/edit/page.tsx:17-86](file://app/sk-inovasi/[id]/edit/page.tsx#L17-L86)

### Data Model Specifications
- **MediasiSk**
  - tahun: number (required) - Tahun SK
  - link_sk_hakim: string | null - Link ke file PDF SK Hakim
  - link_sk_non_hakim: string | null - Link ke file PDF SK Non-Hakim
  - created_at: string - Timestamp pembuatan
  - updated_at: string - Timestamp pembaruan
- **MediatorBanner**
  - judul: string (required) - Nama banner
  - image_url: string (required) - URL gambar banner
  - type: 'hakim' | 'non-hakim' (required) - Kategori mediator
  - created_at: string - Timestamp pembuatan
  - updated_at: string - Timestamp pembaruan
- **SkInovasi**
  - tahun: number (required) - Tahun SK Inovasi
  - nomor_sk: string (required) - Nomor SK
  - tentang: string (required) - Deskripsi SK
  - file_path: string | null - Path file lokal
  - file_url: string | null - URL dokumen eksternal
  - is_active: boolean (required) - Status aktif/nonaktif
  - created_at: string - Timestamp pembuatan
  - updated_at: string - Timestamp pembaruan

**Updated** Added comprehensive data model specifications for SK Inovasi management with dual content support.

**Section sources**
- [api.ts:1179-1195](file://lib/api.ts#L1179-L1195)
- [api.ts:1335-1385](file://lib/api.ts#L1335-L1385)