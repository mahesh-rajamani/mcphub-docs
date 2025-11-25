# Overview

MCPHub is a **no-code platform** for creating, governing, and sharing Model Context Protocol (MCP) servers. It transforms MCP development from manual coding to visual configuration, enabling teams to centrally manage and discover MCP endpoints across the organization. Think of it as an **enterprise MCP marketplace** where teams can publish, discover, and consume AI tool integrations without writing code.

## What is MCP?

The Model Context Protocol (MCP) is an open standard that enables AI assistants to securely connect with external data sources and tools. It provides a standardized way for AI models to interact with your systems, databases, and APIs while maintaining security and control.

Learn more: [Official MCP Documentation](https://modelcontextprotocol.io/)

## Architecture

MCPHub follows a modern, cloud-native architecture designed for scalability and reliability:

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   MCP Studio    │────│   MCP Bridge     │────│  Backend APIs   │
│   (Frontend)    │    │   (Runtime)      │    │  (Your Services)│
│                 │    │                  │    │                 │
│ • Visual Design │    │ • MCP Protocol   │    │ • REST APIs     │
│ • Testing UI    │    │ • Multi-Tenant   │    │ • gRPC Services │
│ • AI Suggestions│    │ • Authentication │    │ • GraphQL APIs  │
│ • Configuration │    │ • Variable Mgmt  │    │ • SOAP Services │
│ • Import Tools  │    │ • Hot Reload     │    │ • Custom Code   │
└─────────────────┘    └────────┬─────────┘    └─────────────────┘
                                │
                                │
                       ┌────────┴─────────┐
                       │  Configuration   │
                       │    Storage       │
                       │                  │
                       │ • Memory         │
                       │ • PostgreSQL     │
                       │ • AWS RDS        │
                       │ • Azure Database │
                       │ • Cloud SQL      │
                       └──────────────────┘
```

### **MCP Studio (Frontend)**
Next.js 15 + React 19 + TypeScript + Tailwind CSS
- Visual MCP design interface
- Real-time testing framework
- AI-powered improvement suggestions
- Configuration management UI

### **MCP Bridge (Backend Runtime)**
Java 21 + Quarkus 3.6.4 + Maven
- Multi-tenant MCP server runtime
- Full MCP protocol implementation
- Authentication and authorization
- Live API execution engine

### **Shared Libraries**
- **Universal Schema**: Common data model for all protocols
- **Protocol Adapters**: REST, gRPC, SOAP, GraphQL support
- **Security Layer**: Encryption, authentication, audit logging

## How MCPHub Helps

### 🚀 **No-Code MCP Creation**
- Visual interface eliminates manual coding - zero TypeScript/Python required
- Import existing APIs (OpenAPI, gRPC, SOAP, GraphQL) automatically
- Configure endpoints through forms and dropdowns
- Deploy production-ready MCP servers in minutes, not days

### 🏛️ **Centralized Governance**
- Single platform for managing all organizational MCP endpoints
- Role-based access control for team-specific MCP management
- Versioning and deployment controls for change management
- Audit trails for compliance and security

### 🏪 **MCP Marketplace**
- Teams publish MCP servers to internal marketplace
- Cross-team discovery of available tools and integrations
- Prevent duplicate work by reusing existing MCPs
- Share and collaborate on MCP configurations organization-wide

### 🏢 **Enterprise-Ready**
- **Multi-tenant architecture** with strict data isolation
- **Production-grade security** with authentication and encryption
- **Scalable deployment** with Docker and Kubernetes support
- **Comprehensive audit logging** and monitoring

### 🤖 **AI-Powered Quality**
- **AI suggestions** for tool descriptions and improvements
- **Multi-model testing** with OpenAI, Anthropic, and Groq
- **Fine-tuning dataset generation** for model optimization
- **Intelligent validation** and error detection

### 🔧 **Operational Excellence**
- **Semantic versioning** with version management
- **Multi-tenant deployment** with tenant isolation
- **Configuration validation** and error checking
- **Deployment package generation** for multiple environments

## Getting Started

Ready to build your first MCP? Choose your path:

1. **⚡ Quick Start**: [Install with Docker](quick-install.md) and be running in 5 minutes
2. **📚 Learn by Example**: Follow our [First MCP Tutorial](first-mcp.md)
3. **📥 Import Existing APIs**: Start with [Import Methods](../creating-mcps/import-methods.md)
4. **🛠️ Manual Creation**: Build from scratch with comprehensive guides

