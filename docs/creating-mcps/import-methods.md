---
sidebar_label: Import using API specification
---

# Import using API specification

## Universal Schema Approach

MCPHub uses a **Universal Schema** format that provides a consistent configuration structure across all API types. Whether you're importing REST, gRPC, GraphQL, or SOAP services, MCPHub translates them into the same unified format with a consistent screen layout and configuration experience.

The Universal Schema maintains protocol-specific details internally while presenting a unified experience for configuration, testing, and deployment. While each API type has some unique features specific to its protocol, MCPHub maintains a consistent configuration experience as much as possible across all types.

---

## REST API - OpenAPI Specification

Import REST APIs using OpenAPI (formerly Swagger) specifications.

### Supported Versions

- **OpenAPI 3.0.x** ✅ (Recommended)
- **OpenAPI 3.1.x** ✅
- **Swagger 2.0** ✅ (Legacy support)

### Import Process

1. **Click** the **"Create New MCP"** button
2. **Select** **"REST API"**
3. **Select** **"Import from Specification"**
4. **Select** **"JSON Format"** tab (should be selected by default)
5. **Paste** the JSON content into the **"Or Paste Specification Content"** textarea
6. **Click** **"Configure"** to preview the API name and information
7. **Review** the auto-detected API information:
   - **MCP Name**: Auto-generated from the specification
   - **Description**: Extracted from the API description
8. **Click** **"Preview"** to preview the endpoints
9. **Review** the imported endpoints
10. **Click** **"Import"** to complete the import
11. **Click** **"Save Configuration"** to save the MCP
12. **Review configuration and test** - See [Your First MCP](../getting-started/first-mcp.md) for detailed testing instructions

### What Gets Imported

- **Base URL**: Extracted from `servers` section
- **Endpoints**: All paths and HTTP methods (GET, POST, PUT, DELETE, PATCH)
- **Parameters**: Path parameters, query parameters, headers, and request bodies
- **Request/Response Schemas**: Data types and structures from components
- **Descriptions**: Endpoint summaries and parameter documentation

---

## gRPC - Protocol Buffer Files

Import gRPC services using Protocol Buffer (.proto) definitions.

### Import Process

1. **Click** the **"Create New MCP"** button
2. **Select** **"gRPC"**
3. **Select** **"Import from Proto File"**
4. **Click** **"Upload .proto file"** and select the file using file browser
5. **Click** **"Configure"** to preview the API name and information
6. **Review** the auto-detected information or provide them:
   - **MCP Name**: Name you want to refer to the MCP service
   - **Description**: Description of the API
   - **gRPC Server Address**: URL where the gRPC service is running
7. **Click** **"Preview"** to preview the endpoints
8. **Click** **"Import"** to complete the import
9. **Click** **"Save Configuration"** to save the MCP
10. **Review configuration and test** - See [Your First MCP](../getting-started/first-mcp.md) for detailed testing instructions

### What Gets Imported

- **Service Definition**: Service name and package namespace
- **RPC Methods**: All defined methods with request/response message types
- **Message Structures**: Complete message definitions with all fields
- **Field Types**: Proto types automatically mapped to JSON schema types
- **Descriptions**: Comments from the proto file become tool descriptions
- **Nested Messages**: Complex type hierarchies and nested structures
- **Method Paths**: Fully qualified paths (e.g., `package.ServiceName/MethodName`)

### Configuration Notes

**URL Prefix Handling**: The system accepts and automatically strips URL schemes to determine TLS usage:
- `https://` → TLS enabled
- `http://` → TLS disabled (plaintext)
- `grpcs://` → TLS enabled
- `grpc://` → TLS disabled (plaintext)
- No prefix with `:443` → TLS enabled
- No prefix with other ports → TLS disabled (default)

---

## GraphQL - Schema Introspection

Import GraphQL APIs using schema introspection.

### Import Process

1. **Click** the **"Create New MCP"** button
2. **Select** **"GraphQL"**
3. **Select** **"Import from Schema"**
4. **Provide** the GraphQL introspect URL
5. **Select and provide** authentication required to introspect (if needed)
6. **Click** **"Introspect Schema"** to preview the API name and information
7. **Review** the auto-detected information or provide them:
   - **MCP Name**: Name you want to refer to the MCP service
   - **Description**: Description of the API
   - **All the endpoint names**: Review and configure imported queries/mutations
8. **Click** **"Import Schema"** to complete the import
9. **Click** **"Save Configuration"** to save the MCP
10. **Review configuration and test** - See [Your First MCP](../getting-started/first-mcp.md) for detailed testing instructions

### What Gets Imported

- **Queries**: All available query operations
- **Mutations**: All mutation operations
- **Subscriptions**: Real-time subscription operations (if supported)
- **Types**: Object types, enums, interfaces, and unions
- **Fields**: Field definitions with arguments
- **Descriptions**: Documentation from the GraphQL schema
- **Input Types**: Complex input object structures

---

## SOAP - WSDL Import

Import SOAP web services using WSDL (Web Services Description Language) files.

### Import Process

1. **Click** the **"Create New MCP"** button
2. **Select** **"Import from WSDL"**
3. **Select** **"From URL"** or **"Upload file"**
4. **Provide** the WSDL URL (if using URL option)
5. **Click** **"Configure"** to preview the API name and information
6. **Review** the auto-detected information or provide them:
   - **MCP Name**: Name you want to refer to the MCP service
   - **Description**: Description of the API
7. **Click** **"Preview"** to see the list of endpoints
8. **Click** **"Import"** to complete the import
9. **Click** **"Save Configuration"** to save the MCP
10. **Review configuration and test** - See [Your First MCP](../getting-started/first-mcp.md) for detailed testing instructions

### What Gets Imported

- **Service Definition**: WSDL service and port information
- **Operations**: All SOAP operations/methods
- **Messages**: Input and output message structures
- **Data Types**: XML schema types mapped to JSON
- **Bindings**: SOAP binding information
- **Documentation**: WSDL documentation elements

---

## After Import

Regardless of the import method, you can enhance your MCP configuration:

### AI Enhancement

1. **Click the ✨✨ (AI Assist) button** next to descriptions
2. **Generate improved descriptions** optimized for AI tool calling
3. **Review and apply suggestions** selectively

### Manual Refinement

- **Edit descriptions** for clarity and context
- **Add/remove endpoints** as needed
- **Configure authentication** for your requirements
- **Set up user variables** for dynamic values
- **Enable/disable tools** based on your use case

### Testing

1. **Deploy to MCP Bridge** using the Deploy button
2. **Use the Test MCP interface** to verify functionality
3. **Try different operations** with sample data
4. **Verify responses** match expectations
5. **Iterate and refine** as needed

---

## Next Steps

After successfully importing your API:

1. **Review [Authentication Configuration](./authentication.md)** to secure your MCP
2. **Set up [User Variables](./variables/overview.md)** for dynamic values
3. **Deploy your MCP** to the bridge
4. **Test thoroughly** using the testing interface
5. **Connect with AI models** using the MCP protocol
