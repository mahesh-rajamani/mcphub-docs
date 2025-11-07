# Overview

MCPHub is a **no-code platform** for creating, governing, and sharing Model Context Protocol (MCP) servers. It transforms MCP development from manual coding to visual configuration, enabling teams to centrally manage and discover MCP endpoints across the organization. Think of it as an **enterprise MCP marketplace** where teams can publish, discover, and consume AI tool integrations without writing code.

## What is MCP?

The Model Context Protocol (MCP) is an open standard that enables AI assistants to securely connect with external data sources and tools. It provides a standardized way for AI models to interact with your systems, databases, and APIs while maintaining security and control.

Learn more: [Official MCP Documentation](https://modelcontextprotocol.io/)

## When to Use MCPHub

MCPHub is ideal for:

- **Enterprise Organizations** seeking centralized governance of MCP endpoints across teams
- **Platform Teams** building an internal MCP marketplace for organization-wide discovery and reuse
- **Development Teams** wanting to create MCP servers without coding
- **AI Application Developers** needing to quickly integrate multiple backend APIs as MCP tools
- **Organizations** requiring security, compliance, and audit trails for AI tool integrations
- **Multi-Team Environments** where MCP endpoints need to be shared and discovered across departments

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

## Top 10 Features

- **Visual MCP Designer** - No-code interface with drag-and-drop functionality
- **Multi-Protocol Import** - Import OpenAPI, gRPC, SOAP, and GraphQL specifications
- **Universal Schema Format** - Single JSON format for all protocols and deployment targets
- **Real-time Testing Framework** - Test MCPs with live API calls and AI model integration
- **AI-Powered Improvements** - Intelligent suggestions for tool descriptions and optimizations
- **Multi-Tenant Architecture** - Host multiple MCPs with complete tenant isolation
- **Variable Substitution System** - Dynamic configuration with `{{variableName}}` syntax
- **Production Deployment** - Docker containers, Kubernetes manifests, and CI/CD integration
- **Enterprise Security** - Authentication, authorization, encryption, and audit logging
- **Configuration Management** - Versioning, duplication, import/export, and deployment packages

## Universal Schema Format

MCPHub uses a single JSON format that supports all protocols:

```json
{
  "mcpName": "crypto-price-mcp",
  "description": "Cryptocurrency price information APIs",
  "tenantId": "system",
  "userVariables": [
    {
      "name": "apiKey",
      "description": "API key for authentication",
      "type": "token",
      "required": true,
      "sensitive": true
    }
  ],
  "baseConfigs": {
    "rest": {
      "baseUrl": "https://api.{{environment}}.example.com",
      "serviceName": "Crypto API",
      "auth": {
        "type": "jwt",
        "jwtConfig": {
          "tokenEndpoint": "https://auth.example.com/token",
          "loginMethod": "client_credentials"
        }
      }
    }
  },
  "endpoints": [
    {
      "name": "getCurrentPrice",
      "apiType": "rest",
      "method": "GET",
      "path": "/api/v3/ticker/price",
      "description": "Get current cryptocurrency price",
      "enabled": true,
      "queryParameters": [
        {
          "name": "symbol",
          "description": "Trading pair symbol (e.g., BTCUSDT)",
          "type": "string",
          "required": true
        }
      ]
    }
  ]
}
```

## Getting Started

Ready to build your first MCP? Choose your path:

1. **⚡ Quick Start**: [Install with Docker](quick-install.md) and be running in 5 minutes
2. **📚 Learn by Example**: Follow our [First MCP Tutorial](first-mcp.md)
3. **📥 Import Existing APIs**: Start with [Import Methods](../creating-mcps/import-methods.md)
4. **🛠️ Manual Creation**: Build from scratch with comprehensive guides

