AI Chat Integration V2

Scope: Encapsulate UX via suggested actions and a button that displays all possible actions.



Shared Platform Experience (Client Commonalities)

Embedded AI Chat Module: An inline panel (task pane in Word, side panel in Web) provides conversational access to AI.
Success: Users can ask questions or request redlines without leaving the document.

Pre-Send Document Context: On open, the document (or a structured summary) is automatically shared with the AI.
Success: The AI has full context immediately; no need to paste text manually.

Persistent AI Session: AI sessions are tied to the document and user. The same context persists across actions and platform switches.
Success: A user can continue the same AI conversation when moving from Word to Web.

AI Audit History (Needs fleshing out): Every prompt and response is logged to the audit history for compliance and later review.
V1 Success: Existing audit log is updated with a prompt and timestamp
V2 Success: New (better) audit log where users and admins can review exactly what queries were made and what responses were returned.





Word Add-in — Unique Requirements

Task Pane Integration: Chat UI embedded in the Word task pane.
Success: Users can open/close the AI assistant without affecting editing space.

Context Binding: The add-in passes the currently open DOCX and metadata to the AI session automatically.
Success: AI responses are scoped to the active document.





Web Viewer — Unique Requirements

Web Panel Integration: Chat UI implemented in a collapsible side panel.
Success: AI panel behaves consistently with Word task pane.

Document Context Sync: Web viewer sends the same canonical DOCX context to the AI session.
Success: Responses remain consistent with Word add-in.





Server — Shared Infrastructure

Session Management: Server establishes and persists AI sessions linked to document IDs.
Success: Session state survives page refresh, client restarts, and cross-platform switches.

Context Provisioning: First the doc and then second the server pre-processes documents (summaries, embeddings) and sends them to the AI.
V1 Success: Send the doc with each API call
V2 Success: Send a summary with each API call and a tool that knows when to retrieve more content

Model Routing & Toggles: Server brokers requests to selected models.
Success: Switching models does not lose session context.

AI Audit Logging: All prompts/responses stored with metadata (user, timestamp, document).
Success: Complete traceability for compliance.





Capability Matrix (Client)



Capability


Category


Word Add-in


Web Viewer


Embedded AI Chat Module


Shared Platform


Yes


Yes


Pre-Send Document Context


Shared Platform


Yes


Yes


Persistent AI Session


Shared Platform


Yes


Yes


Optional Model Toggle


Shared Platform


Yes


Yes


AI Audit History (Needs fleshing out)


Shared Platform


Yes


Yes


Task Pane Integration


Unique: Add-in


Yes


No


Context Binding (DOCX)


Unique: Add-in


Yes


No


Web Panel Integration


Unique: Web


No


Yes


Document Context Sync


Unique: Web


No


Yes




Responsibility Matrix (Server)



Responsibility


Server


Impacts (Clients)


Notes


Session Management


Yes


Word, Web


Link AI session to document ID


Context Provisioning


Yes


Word, Web


Summaries/embeddings sent to AI


Model Routing & Toggles


Yes


Word, Web


Broker across approved AI models


AI Audit Logging


Yes


Word, Web


Log prompts/responses with metadata




Example Audit Log Entries (Basic AI Integration)



User


Date Updated


Category


Change


Contract Info


Original


New


alice@agency.gov


08/22/2025 09:00:00


AI Session


Added


DOC-2001


--


Session initialized with GPT


alice@agency.gov


08/22/2025 09:05:00


AI Query


Added


DOC-2001


--


"Summarize section 2.3"


system


08/22/2025 09:05:01


AI Response


Added


DOC-2001


--


Summary returned


bob@agency.gov


08/22/2025 09:20:00


Model Toggle


Updated


DOC-2001


GPT


Claude


system


08/22/2025 09:20:01


AI Session


Updated


DOC-2001


Claude


Session resumed with context


alice@agency.gov


08/22/2025 09:30:00


AI Query


Added


DOC-2001


--


"Generate redlines for vendor edits"

