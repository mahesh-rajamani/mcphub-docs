# Overview

MCPHub is a platform for designing, testing, deploying, and managing Model Context Protocol (MCP) servers. It transforms MCP server development from manual, fragmented processes to a unified, governed platform that dramatically reduces development time while improving quality and consistency.


## When to Use MCPHub

MCPHub is ideal for:

- **Enterprise Organizations** building AI applications that need to integrate with multiple backend services
- **Development Teams** looking to standardize MCP server creation and management
- **AI Application Developers** who need reliable, scalable tool integration
- **Organizations** requiring governance, security, and compliance for AI tool integrations
- **Teams** wanting to reduce development time while maintaining high quality standards

## How MCPHub Helps

### **Development Acceleration**
- Reduces MCP development time through automation
- Visual design interface reduces manual coding requirements
- Import existing APIs (OpenAPI, gRPC, SOAP, GraphQL)
- Real-time testing with immediate feedback

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
│ • AI Suggestions│    │ • Authentication │    │ • Custom Code   │
│ • Configuration │    │ • Variable Mgmt  │    │                 │
│ • Import Tools  │    │ • Hot Reload     │    │                 │
└─────────────────┘    └──────────────────┘    └─────────────────┘
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

## GitHub Repository

**Source Code**: [github.com/mahesh-rajamani/mcphub](https://github.com/mahesh-rajamani/mcphub)

- Report issues via GitHub Issues
- Submit feature requests via GitHub Discussions
- Contribute via Pull Requests
- Documentation in the `/docs` directory

## Getting Started

Ready to build your first MCP? Choose your path:

1. **⚡ Quick Start**: [Install with Docker](quick-install.md) and be running in 5 minutes
2. **📚 Learn by Example**: Follow our [First MCP Tutorial](first-mcp.md)
3. **📥 Import Existing APIs**: Start with [OpenAPI Import](../creating-mcps/import/openapi.md)
4. **🛠️ Manual Creation**: Build from scratch with comprehensive guides

