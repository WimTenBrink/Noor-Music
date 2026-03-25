export const SYSTEM_INSTRUCTIONS_MD = `
# System Instructions: Recreating Noor Music

This document provides the comprehensive instructions required to recreate the "Noor Music" AI Songwriting application from scratch using Google AI Studio and modern web technologies.

## 1. Project Vision and Persona
The application is designed for the fictional band "Noor", a four-member female group with a unique musical identity.
- **Band Members:** Miranda Noor (Soprano), Annelies Brink (Alto), Fannie de Jong (Mezzo-Soprano), and Emma Vermeer (Feminine Baritone).
- **Relationships:** Miranda and Annelies are married; Fannie and Emma are lovers.
- **Musical Style:** A blend of pop, experimental instrumentation, and sapphic themes.
- **Instrumentation:** Electric guitars, drums, gongs, synthesizers, bagpipes, and the Crwth.

## 2. Technical Stack
- **Frontend:** React 19, TypeScript, Vite.
- **Styling:** Tailwind CSS 4.0 (Dark Lavender Theme).
- **Animations:** Motion (formerly Framer Motion).
- **Icons:** Lucide React.
- **AI Integration:** @google/genai (Gemini 3 Flash/Pro).
- **State Management:** Custom React hooks and service-based architecture.

## 3. Core Architecture
The application follows a strict separation of concerns:
- **/src/app/components:** Pure UI logic.
- **/src/app/services:** Business logic and API interactions.
- **/src/app/hooks:** State orchestration.
- **/src/constants:** Static data (instruments, styles, prompts).
- **/src/types:** TypeScript interfaces.

## 4. Key Components to Implement

### A. Job Management System
Implement a robust job queue (\`jobService.ts\`) with:
- Priority-based execution (High, Normal, Low).
- Concurrency control (Max 5 simultaneous jobs).
- Pause/Resume functionality (Auto-pause on 429 errors).
- Raw request/response capture for debugging.
- Base64 data shortening in logs.

### B. Specialized Viewers
- **MarkdownView:** Render AI-generated lyrics with export to MD/PDF.
- **TreeView:** Display JSON/XML data in a collapsible, interactive format.
- **ImageView:** Advanced image viewer with wheel-zoom (5% to 1000%), drag-to-scroll, and PNG conversion.
- **TextView:** Fixed-font viewer for plain text.

### C. UI Layout
- **Header:** Logo, navigation menus (File, Edit, Settings, Help), and "Generate" button.
- **Sidebars:** Instrument and Style selection panels.
- **MainPanel:** Drag-and-drop zone for song JSON files, lyric editor.
- **StatusBar:** Real-time job counters, AI status, and resource monitoring (CPU/MEM).

## 5. AI Prompt Engineering
- **System Instructions:** Define the band's persona, instrumentation skills, and output format (JSON).
- **User Prompts:** Dynamically construct prompts based on selected instruments and styles.

## 6. Styling Guidelines
- Use a dark scheme with lavender accents.
- Ensure high contrast for accessibility.
- Implement custom scrollbars.
- Use a reasonably large font (18px base).

## 7. Implementation Steps
1. Initialize Vite project with React and TypeScript.
2. Configure Tailwind CSS with the custom lavender theme.
3. Build the core services (\`jobService\`, \`aiService\`, \`logService\`).
4. Create the specialized viewer components.
5. Implement the main layout and sidebars.
6. Integrate the Gemini API using the platform's API key selection dialog.
7. Add file persistence (Load/Save JSON).
8. Finalize the Help documents and Manual.

---
*Created by Katje B.V. (Knowledge And Technology Joyfully Engaged)*
`;

export const MANUAL_MD = `
# Noor Music: User Manual

Welcome to Noor Music, the ultimate AI-powered songwriting companion for the band Noor. This manual explains how to harness the power of AI to create beautiful, sapphic-themed pop music.

## Getting Started

### 1. API Key Configuration
Before generating songs, you must configure your Gemini API key.
- Go to **Settings > API Key**.
- Use the Google projects API dialog to select your key.
- Ensure your key has sufficient quota for generation.

### 2. Selecting Your Sound
The sidebars allow you to define the musical foundation of your song.
- **Instruments (Left):** Choose from a wide range of instruments, from electric guitars to the ancient Crwth.
- **Styles (Right):** Select genres and sub-genres to guide the AI's rhythmic and melodic direction.

## Generating Lyrics

### The Generate Button
Click the **Generate Song** button in the header to open the generation dialog.
- Enter a brief description or theme for your song.
- The AI will use your selected instruments and styles to craft unique lyrics.
- A new job will be added to the queue.

### Job Management
Monitor your generation progress in the **Status Bar**.
- **Pending:** Jobs waiting to be processed.
- **Running:** AI is currently thinking.
- **Done:** Song is ready to view.
- **Failed:** An error occurred (e.g., rate limiting).

Click any counter to see the most recent jobs and access actions like "Show", "Delete", or "Retry".

## Working with Songs

### The Main Editor
Once a song is generated or loaded, it appears in the main area.
- **Title:** Edit the song's name.
- **Style:** Refine the SUNO-compatible style string.
- **Lyrics:** Edit the generated lyrics. Use the copy icon to quickly grab the text.

### File Operations
- **Load:** Upload a previously saved song JSON file.
- **Save:** Download your current song as a JSON file.
- **Clear:** Reset the environment for a new project.
- **Drag & Drop:** Simply drop a song JSON file onto the main area to load it.

## Advanced Features

### Specialized Viewers
The application includes custom viewers for different data types:
- **Markdown:** Used for help documents and formatted lyrics.
- **JSON/XML:** View raw data in a clean tree structure.
- **Images:** Zoom and scroll through high-quality band imagery.

### System Console
Access the **Terminal** icon in the header to view system logs. This is useful for debugging issues or tracking application events.

---
*Enjoy your creative journey with Noor!*
`;

export const CODE_OVERVIEW_MD = `
# Noor Music: Code Overview

This document provides a technical deep dive into the architecture and implementation of the Noor Music application.

## 1. Project Structure

\`\`\`
/src
  /app
    /components   # UI Components (Header, Sidebars, Dialogs, etc.)
    /hooks        # Custom React hooks (useNoorApp, useJobQueue, etc.)
    /services     # Core logic (jobService, aiService, logService)
  /constants      # Static data and AI prompts
  /lib            # Utility functions
  /types          # TypeScript interfaces
App.tsx           # Main application entry and layout
main.tsx          # React DOM rendering
index.css         # Global styles and Tailwind configuration
\`\`\`

## 2. Core Services

### JobService (\`jobService.ts\`)
The heartbeat of the application. It manages an asynchronous queue of tasks.
- **Concurrency:** Uses a semaphore-like pattern to limit active AI calls.
- **Persistence:** Jobs are tracked in memory and notified to subscribers.
- **Logging:** Captures raw API payloads for transparency.

### AIService (\`aiService.ts\`)
A wrapper around the Google GenAI SDK.
- **Model:** \`gemini-3-flash-preview\`.
- **Configuration:** Uses system instructions to enforce the "Noor" persona.

### LogService (\`logService.ts\`)
A simple event-driven logging system used for the System Console.

## 3. Custom Hooks

### useNoorApp
The primary state orchestrator. It connects the UI to the services and manages:
- Current song state.
- Sidebar selections.
- Dialog visibility.
- File I/O actions.

### useJobQueue
Provides a React-friendly interface to the singleton \`JobService\`.

## 4. Key Components

### TreeView
A recursive component that renders nested objects. It includes a custom XML-to-JSON parser using \`DOMParser\`.

### ImageView
Implements a custom coordinate system for panning and zooming. It uses \`requestAnimationFrame\`-like logic via CSS transforms for smooth performance.

### Dialog
A highly reusable modal component with support for nested dialogs and standardized OK/Cancel actions.

## 5. Constants and Data

- **Instruments:** Categorized list of musical tools.
- **Styles:** Hierarchical list of musical genres.
- **Instructions:** The "Brain" of the AI, defining the band members and their skills.

## 6. Styling System
Built on Tailwind CSS 4.0, the app uses a custom color palette:
- \`lavender-bg\`: #0a0a0f
- \`lavender-accent\`: #a080ff
- \`lavender-text\`: #e0e0f0

---
*License: MIT | Created by Katje B.V.*
`;
