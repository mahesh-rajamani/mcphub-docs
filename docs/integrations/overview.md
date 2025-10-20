---
sidebar_label: AI Agent Integrations
---

# Building AI Agents with MCPHub

MCPHub acts as your MCP server, exposing your APIs as tools that AI frameworks and applications can discover and use. This page guides you through integrating MCPHub with various AI agent platforms.

## How It Works

1. **Deploy your APIs** to MCPHub as MCP configurations
2. **Get your MCP URL**: `http://your-mcphub-host/tenantId/mcpName/mcp`
3. **Connect AI frameworks** to your MCPHub MCP endpoint
4. **Build AI agents** that can call your APIs through natural language

---

## Quick Start: Testing Your MCPs

### Claude Desktop
**Best for**: Quick testing, prototyping, and interactive exploration

Test your MCPHub deployments instantly with Claude Desktop's native MCP support. This is the fastest way to verify your MCP configurations are working correctly.

- **Setup Time**: 5 minutes
- **Skill Level**: Beginner
- **Use Cases**: Testing, debugging, prototyping, personal productivity

👉 [Test with Claude Desktop](../getting-started/first-mcp.md#step-9-test-your-deployed-mcp-with-claude-desktop)

---

## Production Integrations

### Python Frameworks

#### LangChain + LangGraph
**Best for**: Production applications, complex workflows, and stateful agents

Build sophisticated AI agents with LangChain's extensive tooling ecosystem and LangGraph's stateful workflows.

- **Setup Time**: 15 minutes
- **Skill Level**: Intermediate to Advanced
- **Use Cases**: Production apps, complex workflows, multi-step agents

**Key Features**:
- Interactive and batch processing modes
- Full async/await support
- Comprehensive error handling
- Debug mode for troubleshooting
- Stateful agent workflows

👉 [MCPHub + LangChain Integration Guide](../advanced/langchain-integration.md) (Complete working example)

**What you'll get**: Production-ready Python code with authentication, error handling, and interactive/batch modes.

---

#### CrewAI
**Best for**: Multi-agent collaboration, role-based AI teams

Build teams of AI agents that work together on complex tasks, with each agent having specific roles and accessing your MCPHub tools.

- **Setup Time**: 20 minutes
- **Skill Level**: Intermediate
- **Use Cases**: Complex multi-step tasks, specialized agent teams, workflow automation

**Key Features**:
- Role-based agent design
- Sequential and parallel task execution
- Agent collaboration and delegation
- Memory and context sharing across agents

📚 [Official CrewAI MCP Documentation](https://docs.crewai.com/en/mcp/overview)

**Example**: Create a research team where one agent uses your MCPHub API tools to gather data, another analyzes it, and a third writes reports.

---

#### OpenAI Agents SDK
**Best for**: OpenAI-native multi-agent systems with MCP support

OpenAI's official framework for building production-ready multi-agent systems, with native MCP protocol support.

- **Setup Time**: 15 minutes
- **Skill Level**: Intermediate
- **Use Cases**: OpenAI-powered agents, multi-agent orchestration, production systems

**Key Features**:
- Official OpenAI framework
- Multiple MCP transport methods (stdio, SSE, HTTP)
- Agent handoffs and routing
- Managed infrastructure option

📚 [Official OpenAI Agents SDK MCP Documentation](https://openai.github.io/openai-agents-python/mcp/)

**Note**: This replaces the experimental Swarm framework with production-ready agent orchestration.

---

### OpenAI Platform Integrations

#### OpenAI Agent Builder
**Best for**: Visual no-code agent workflows, rapid prototyping without coding

Build production-ready AI agents using OpenAI's drag-and-drop visual canvas, with native MCP support for connecting to your MCPHub tools.

- **Setup Time**: 10 minutes
- **Skill Level**: Beginner
- **Use Cases**: No-code agent building, rapid prototyping, multi-agent workflows, business users
- **Status**: Beta

**Key Features**:
- Visual drag-and-drop canvas ("like Canva for agents")
- Multi-agent workflow orchestration
- Prebuilt templates
- Conditional logic and loops
- Custom guardrails configuration
- Version control for agent workflows

📚 [Official OpenAI Agent Builder Documentation](https://developers.openai.com/tracks/building-agents/)

**Example**: Build a complete workflow with multiple agents in minutes using the visual canvas, connecting to your MCPHub APIs as MCP tools.

---

#### OpenAI Apps SDK
**Best for**: Building ChatGPT-integrated applications, custom AI apps

Create custom apps that integrate directly with ChatGPT, using your MCPHub tools through MCP's streamable HTTP transport.

- **Setup Time**: 20 minutes
- **Skill Level**: Intermediate to Advanced
- **Use Cases**: ChatGPT integrations, custom AI applications, enterprise tools

**Key Features**:
- Native ChatGPT integration
- Streamable HTTP transport (recommended)
- Automatic tool discovery
- Cross-platform support (web and mobile)
- Built-in OAuth 2.1 authentication
- Component rendering for custom UIs

📚 [Official OpenAI Apps SDK MCP Documentation](https://developers.openai.com/apps-sdk/concepts/mcp-server/)

**How it works**: MCP is the backbone that keeps server, model, and UI in sync. Your MCPHub tools work across ChatGPT web and mobile without custom client code.

---

### Flowise
**Best for**: Visual chatbot builder, RAG applications

Build chat-based AI applications visually using Flowise, with your MCPHub tools accessible to agents via streamable HTTP.

- **Setup Time**: 10 minutes
- **Skill Level**: Beginner
- **Use Cases**: Chatbots, customer service, Q&A systems, RAG applications

**Key Features**:
- Visual LangChain workflow builder
- Streamable HTTP support
- Chat-focused interface
- Pre-built templates
- Vector store and embedding support

📚 [Official Flowise Streamable HTTP MCP Documentation](https://docs.flowiseai.com/tutorials/tools-and-mcp#streamable-http-recommended)

**Use case**: Create a customer service chatbot that can check order status, update information, and answer questions using your APIs through MCPHub.

---

### JavaScript/TypeScript Frameworks

#### LangChain.js
**Best for**: Node.js applications, web apps, serverless functions

Build AI agents in JavaScript/TypeScript using LangChain.js with your MCPHub MCP servers.

- **Setup Time**: 15 minutes
- **Skill Level**: Intermediate
- **Use Cases**: Web applications, API servers, serverless functions, Next.js apps

**Key Features**:
- Full LangChain ecosystem in JavaScript
- Async/await native support
- Multiple transport methods
- TypeScript type safety

📚 [Official LangChain.js MCP Documentation](https://docs.langchain.com/oss/javascript/langchain/mcp)

**Package**: `@langchain/mcp-adapters` - Use `MultiServerMCPClient` to connect to your MCPHub endpoints.

---

#### Vercel AI SDK
**Best for**: Next.js apps, React components, streaming AI responses

Integrate MCPHub tools into modern web applications with Vercel's AI SDK, with built-in support for streamable HTTP and UI components.

- **Setup Time**: 15 minutes
- **Skill Level**: Intermediate
- **Use Cases**: Chat interfaces, streaming responses, Next.js applications, React apps

**Key Features**:
- Streamable HTTP support
- Streaming AI responses
- React hooks and components
- Edge runtime support
- Built-in UI patterns

📚 [Official Vercel AI SDK MCP Documentation](https://ai-sdk.dev/cookbook/node/mcp-tools)

**Example**:
```typescript
import { StreamableHTTPClientTransport } from '@ai-sdk/mcp';

const transport = new StreamableHTTPClientTransport(
  new URL('http://localhost:3001/system/your-mcp/mcp')
);
```

