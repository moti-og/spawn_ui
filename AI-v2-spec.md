# AI Chat Integration V2

**Scope:** Encapsulate UX via suggested actions and a button that displays all possible actions.

---

## Shared Platform Experience (Client Commonalities)

### Suggested Actions Bar
A persistent bar displays contextual quick-action buttons based on document state and user permissions.

**Success:** Users can perform common actions (Check Out, Versions, Manage Users, Chat with Human) with a single click without navigating menus.

### Show All Actions Button
A prominent button expands to reveal all available document actions in a tile-based grid view.

**Success:** Users discover and access the full range of capabilities without memorizing commands or navigating complex menus.

### Check-In / Check-Out System
Document locking mechanism that grants exclusive edit access to one user at a time.

**Success:** 
- Same as the check-in / check-out experience
- Modified per design

### Version History
Users can view and restore previous document versions from a dedicated panel.

**Success:**
- Users see a chronological list of document versions with timestamps and authors
- Users can preview any previous version
- Users can restore a previous version with confirmation
- Users can share a document with vendors

### Chat with Human / AI Toggle
Seamless switching between AI assistant and human support agent within the same chat interface.

**Success:**
- User clicks "Chat with Human" → System displays "Getting a human..." → Transition line appears → Human agent greeting displays
- User clicks "Chat with AI" → Transition line appears → AI responds "I'm back and ready to help"
- Visual differentiation: AI messages (grey), Human messages (blue with agent name)
- Human agent avatar/indicator displays when in human chat mode

### Intelligent Tool Routing (Client-Side)
Pre-LLM intent detection that identifies user requests and prompts for confirmation before activating tools.

**Success:**
- User types query (e.g., "show approval status", "view versions", "add signature")
- System detects intent using keyword/embedding matching (no LLM call)
- Confirmation message appears: "I can help you [action]. Would you like me to proceed?"
- User clicks "Yes, proceed" → Tool activates immediately
- User clicks "No, cancel" → System offers alternative assistance
- Reduces false positives and gives users explicit control

**Note:** This is the client-side implementation. The server-side intelligent routing (see Server section) uses embedding-based similarity matching for production.

### User Management
User management, access, and configuration

**Success:**
- Same as user management experience
- Modified per design

---

## Word Add-in — Unique Requirements

### Task Pane Integration
Suggested actions bar and chat UI embedded in the Word task pane.

**Success:** All V2 features accessible without leaving Word.

### Check-Out State Sync
Document lock state syncs with server; Word reflects real-time lock status. Need to figure out how we render the checked out state within the document (not in the sidepane)

**Success:** User opening a checked-out document in Word sees lock indicator immediately.

---

## Web Viewer — Unique Requirements

### Side Panel Integration
Suggested actions bar and chat UI in collapsible side panel.

**Success:** Consistent experience with Word add-in.

### Document Lock Visualization
Visual border and banner indicate check-out state in the document viewer.

**Success:** Red border and banner clearly communicate when document is checked out.

---

## Server — Shared Infrastructure

### No changes to the back-end for check-in / check-out, versions / files, and users

### Human Agent Routing
Server manages queue and routing for human chat requests.

**Success:**
- Human chat requests are queued when no agents available
- Requests are routed to available agents based on load/expertise
- Session handoff maintains conversation context

### Intelligent Tool Routing
Pre-LLM request parsing system that identifies user intent and triggers tool activation confirmation before executing actions.

**Success:**
- User query is analyzed before LLM call using embedding-based similarity matching
- System identifies intent (e.g., "check out document", "view versions", "add signature")
- Confirmation dialog appears: "I can help you [action]. Would you like me to proceed?"
- User confirms → Tool activates immediately
- User declines → System provides alternative assistance
- Reduces false positives and gives users control over tool execution

**Technical Approach:**
- Embed user prompt using semantic embedding model
- Compare against stored embeddings for known tool actions
- Similarity threshold determines if tool should be suggested
- Deterministic routing (no LLM call needed for tool detection)
- LLM only called after user confirms tool activation or for general queries

**Benefits:**
- Faster response time (no LLM latency for tool detection)
- Lower API costs (LLM only called when needed)
- Better user control (explicit confirmation before actions)
- Reduced errors (deterministic matching vs. LLM hallucination)

### User Permission Service
Server enforces role-based access control for all document operations.

**Success:**
- Permission checks on every action
- Role hierarchy: Viewer < Editor < Approver < Admin
- Permissions cached for performance, invalidated on change

---

## Capability Matrix (Client)

| Capability | Category | Word Add-in | Web Viewer |
|------------|----------|-------------|------------|
| Suggested Actions Bar | Shared Platform | Yes | Yes |
| Show All Actions | Shared Platform | Yes | Yes |
| Check-In / Check-Out | Shared Platform | Yes | Yes |
| Version History | Shared Platform | Yes | Yes |
| Chat with Human/AI | Shared Platform | Yes | Yes |
| Intelligent Tool Routing | Shared Platform | Yes | Yes |
| User Management | Shared Platform | Yes | Yes |
| Task Pane Integration | Unique: Add-in | Yes | No |
| Check-Out State Sync | Unique: Add-in | Yes | No |
| Side Panel Integration | Unique: Web | No | Yes |
| Document Lock Visualization | Unique: Web | No | Yes |

---

## Responsibility Matrix (Server)

| Responsibility | Server | Impacts (Clients) | Notes |
|----------------|--------|-------------------|-------|
| Document Lock Management | Yes | Word, Web | Atomic lock operations |
| Version Storage & Retrieval | Yes | Word, Web | Efficient storage with metadata |
| Human Agent Routing | Yes | Word, Web | Queue management and routing |
| Intelligent Tool Routing | Yes | Word, Web | Pre-LLM intent detection and confirmation |
| User Permission Service | Yes | Word, Web | Role-based access control |
| Audit Logging | Yes | Word, Web | All actions logged with metadata |

---

## Example Audit Log Entries (V2 Features)

| User | Date Updated | Category | Change | Contract Info | Original | New |
|------|--------------|----------|--------|---------------|----------|-----|
| alice@agency.gov | 08/22/2025 09:00:00 | Document Lock | Added | DOC-2001 | -- | Checked out by alice |
| alice@agency.gov | 08/22/2025 09:30:00 | Document Lock | Removed | DOC-2001 | Checked out | Checked in |
| bob@agency.gov | 08/22/2025 10:00:00 | Version | Added | DOC-2001 | v3 | v4 created |
| bob@agency.gov | 08/22/2025 10:15:00 | Version | Restored | DOC-2001 | v4 | Restored to v2 |
| alice@agency.gov | 08/22/2025 11:00:00 | Human Chat | Started | DOC-2001 | AI Chat | Human Chat (Gandalf) |
| alice@agency.gov | 08/22/2025 11:10:00 | Human Chat | Ended | DOC-2001 | Human Chat | AI Chat |
| bob@agency.gov | 08/22/2025 11:30:00 | Tool Routing | Detected | DOC-2001 | -- | Intent: "show approval status" |
| bob@agency.gov | 08/22/2025 11:30:05 | Tool Routing | Confirmed | DOC-2001 | Pending | ApprovalWorkflow activated |
| charlie@agency.gov | 08/22/2025 11:45:00 | Tool Routing | Detected | DOC-2001 | -- | Intent: "add signature" |
| charlie@agency.gov | 08/22/2025 11:45:03 | Tool Routing | Cancelled | DOC-2001 | Pending | User declined activation |
| admin@agency.gov | 08/22/2025 12:00:00 | User Management | Updated | DOC-2001 | bob: Editor | bob: Approver |
| admin@agency.gov | 08/22/2025 12:05:00 | User Management | Removed | DOC-2001 | charlie: Viewer | Access revoked |

---

## Open Questions

1. **User Management:** What specific user roles exist? What permissions does each role have?
2. **User Management:** Can users be added to documents, or only to the system?
3. **User Management:** Is there a workflow for requesting access?
4. **Human Chat:** What is the agent availability model? (24/7, business hours, etc.)
5. **Human Chat:** Are chat transcripts stored separately from audit logs?

