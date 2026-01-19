# AI Workflow Builder

A visual no-code AI workflow builder built with React, TypeScript, and React Flow.

## Features

- **Drag-and-Drop Interface**: Easily create AI workflows by dragging components from the sidebar
- **Node Types**:
  - **User Query**: Starting point for user input
  - **Knowledge Base**: Document retrieval with embedding configuration
  - **LLM Engine**: AI language model with model selection and parameters
  - **Output**: Final response endpoint
- **Visual Connections**: Connect nodes with arrows to define workflow
- **Node Configuration**: Click any node to configure its settings
- **Workflow Validation**: Validates workflow structure before execution
- **Mock Chat**: Test your workflow with a simulated chat interface

## Tech Stack

- React 18
- TypeScript
- Vite
- React Flow (@xyflow/react)
- Tailwind CSS
- shadcn/ui components

## Getting Started

### Prerequisites

- Node.js 18+ or Bun

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

## Usage

1. **Add Nodes**: Drag components from the left sidebar onto the canvas
2. **Connect Nodes**: Click and drag from output handles (right side) to input handles (left side)
3. **Configure Nodes**: Click any node to open its configuration panel on the right
4. **Build Stack**: Click "Build Stack" to validate your workflow
5. **Chat with Stack**: Click "Chat with Stack" to test with mock responses

## Workflow Validation Rules

- Exactly one User Query node required
- Exactly one Output node required
- Valid path must exist from User Query to Output
- No cycles allowed in the workflow

## Project Structure

```
src/
├── components/
│   ├── layout/         # Layout components (TopBar, Sidebars)
│   ├── nodes/          # React Flow node components
│   ├── panels/         # Configuration panels and modals
│   └── ui/             # shadcn/ui components
├── pages/              # Page components
├── types/              # TypeScript type definitions
└── utils/              # Utility functions (validation)
```

## License

MIT
