# Manual Configuration

Create REST and gRPC endpoint configurations manually using MCPHub Studio's tabbed interface. This guide walks you through each tab in the exact order they appear in the application.

## Configuration Tab Structure

MCPHub Studio organizes MCP configuration into six tabs that you complete from left to right:

1. **Basic Info** - Fundamental MCP information
2. **Protocol** - API protocol and authentication setup  
3. **Endpoints** - Individual API endpoint definitions
4. **Schema Definition** - Message schemas and data structures
5. **User Variables** - Dynamic configuration variables
6. **Custom Tools** - Specialized tools and custom functionality

---

## Tab 1: Basic Info

Start by providing essential information about your MCP server.

### Required Fields

**MCP Name**
- Enter a unique identifier for your MCP server
- Use lowercase letters, numbers, and hyphens only
- Example: `user-management-api`

**Description**
- Provide a clear description of what your MCP server does
- This helps AI models understand the purpose of your tools
- Example: "Manages user profiles and authentication for the customer portal"

**Tenant ID**
- Automatically populated from your settings
- Used for multi-tenant isolation

### Quick Setup Options

**Import OpenAPI**
- Click to upload an OpenAPI/Swagger specification file
- The system will automatically create endpoints from your spec
- AI enhancement can improve descriptions for better LLM understanding

**Import Proto**
- Upload gRPC .proto files to generate endpoints
- Automatically handles message definitions and service configurations

**API Type Dropdown**
- Select your primary protocol (REST, gRPC, etc.)
- This affects available configuration options in other tabs

---

## Tab 2: Protocol

Configure protocol-specific settings and authentication.

### REST Protocol Configuration

**Base URL**
- Enter your API's base URL
- Supports variable substitution: `https://api.{{environment}}.example.com`
- Example: `https://api.mycompany.com/v1`

**Service Name**
- Descriptive name for your REST service
- Used in tool descriptions and logging

### gRPC Protocol Configuration

**Server Address**
- Enter your gRPC server address and port
- Supports variable substitution: `grpc.{{environment}}.example.com:443`
- Example: `api.mycompany.com:443`

**Package Name**
- Optional: Specify the protobuf package name
- Used for method resolution and organization

**TLS Configuration**
- Enable/disable TLS encryption
- Configure custom certificates if needed

### Authentication Configuration

**Authentication Type Options:**

**None**
- No authentication required
- Use for public APIs or when authentication is handled elsewhere

**Static Headers**
- Simple API key or custom header authentication
- Add headers like `Authorization: Bearer {{apiKey}}`
- Headers support variable substitution

**JWT Authentication**
- Click "Configure JWT" to set up JWT-based authentication
- Choose between username/password or client credentials flow
- Automatic token refresh and secure storage

**OAuth 2.0**
- Click "Configure OAuth2" for OAuth 2.0 authentication
- Supports authorization code and client credentials flows
- Works with any OAuth2-compliant provider (Auth0, Keycloak, AWS Cognito, etc.)
- Automatic PKCE and state parameter handling

**Header Forwarding**
- Forward authentication headers from MCP clients
- Useful for pass-through authentication scenarios

See [Authentication](authentication.md) for detailed configuration instructions.

---

## Tab 3: Endpoints

Define the API endpoints that will be exposed as MCP tools.

### Adding Endpoints

**Add Endpoint**
- Click the "+" button to create a new endpoint
- Each endpoint becomes a tool available to AI models

### REST Endpoint Configuration

**Endpoint Name**
- Choose a descriptive name for your tool  
- Use camelCase or snake_case consistently
- Example: `getUserProfile` or `create_user`

**HTTP Method**
- Select from GET, POST, PUT, DELETE, PATCH
- Choose based on the operation type

**Path**
- Define the endpoint path
- Support path parameters: `/users/{userId}/profile`
- Variables can be used: `/{{apiVersion}}/users/{id}`

**Description**
- Provide a detailed description of what this endpoint does
- Include parameter information and expected behavior
- Good descriptions help AI models use tools correctly

**Parameters**

*Query Parameters*
- Add parameters that go in the URL query string
- Specify name, type, description, and whether required
- Types: string, number, boolean, array

*Path Parameters*
- Automatically detected from your path definition
- Configure type and description for each parameter

*Headers*
- Add custom headers required by this endpoint
- Support variable substitution

*Request Body*
- Configure the request body schema for POST/PUT requests
- Use the visual editor or import from examples

### Unwrapped/Wrapped Configuration

MCPHub provides two separate unwrapping flags that define the JSON schema structure for MCP tools. These flags help the MCP tool understand how to create appropriate JSON when calling your endpoints.

**Request Unwrapping (`unwrapped` flag)**

Defines the expected JSON structure for the MCP tool to create when sending requests:

- **`unwrapped = false` (Default)**: MCP tool creates wrapped JSON with message object
  - Schema tells tool to send: `{"Person": {"name": "John", "age": 30}}`

- **`unwrapped = true`**: MCP tool creates flat JSON with direct fields
  - Schema tells tool to send: `{"name": "John", "age": 30}`

**Response Unwrapping (`outputUnwrapped` flag)**

*Note: This feature is defined in the schema but not yet implemented in the current version.*

Defines how response schemas are presented to MCP tools:

- **`outputUnwrapped = false` (Default)**: Response schema shows wrapped structure
  - Schema shows: `{"UserResponse": {"id": 123, "name": "John", "email": "john@example.com"}}`

- **`outputUnwrapped = true`**: Response schema shows flat structure  
  - Schema shows: `{"id": 123, "name": "John", "email": "john@example.com"}`

**Configuration:**
- Toggle the "Unwrapped" checkbox for request unwrapping (`unwrapped` flag)
- Toggle the "Output Unwrapped" checkbox for response unwrapping (`outputUnwrapped` flag)
- Both flags are independent and can be configured separately per endpoint
- Can be mixed within the same MCP (some endpoints unwrapped, others wrapped)

### gRPC Endpoint Configuration

**Service Method**
- Select from available methods in your .proto file
- Full method path: `package.Service/Method`

**Message Definitions**
- Automatically imported from .proto files
- Edit message schemas in the Schema Definition tab

### AI-Powered Enhancements

**Individual Suggestions**
- Click the sparkle icon (✨) next to any endpoint
- Get AI-generated improvements for descriptions and parameters
- Review and apply suggestions selectively

**Bulk Suggestions**
- Use "Bulk AI Suggestions" for multiple endpoints
- Choose which endpoints to enhance
- Apply all suggestions at once or review individually

---

## Tab 4: Schema Definition

Configure message schemas and data structures.

### Message Definitions

**Adding Messages**
- Define reusable message schemas
- Used for request/response bodies and complex parameters

**Schema Editor**
- Visual JSON schema editor
- Support for nested objects, arrays, and complex types
- Real-time validation

### REST Schema Configuration

**Request Schemas**
- Define expected request body formats
- Link to specific endpoints

**Response Schemas**
- Document expected response formats
- Help AI models understand data structures

### gRPC Schema Configuration

**Proto Message Integration**
- Automatically imports message definitions from .proto files
- Edit and extend imported schemas
- Maintain compatibility with your gRPC services

---

## Tab 5: User Variables

Set up dynamic variables for flexible configurations.

### Variable Types

**String Variables**
- General text values
- Example: API keys, usernames, environment names

**Number Variables**
- Numeric values with validation
- Example: port numbers, limits, timeouts

**Boolean Variables**
- True/false flags
- Example: feature toggles, debug modes

**URL Variables**
- URLs with format validation
- Example: base URLs, webhook endpoints

**Token Variables**
- Sensitive values (masked in logs)
- Example: API keys, passwords, secrets

### Variable Configuration

**Variable Name**
- Use descriptive names: `apiEnvironment`, `jwtClientId`
- Reference in configurations using `{{variableName}}`

**Description**
- Explain what the variable is used for
- Helps users understand configuration requirements

**Required/Optional**
- Mark variables as required or optional
- Required variables must be provided during deployment

**Default Values**
- Set default values for optional variables
- Reduce configuration overhead

### Using Variables

Variables can be used throughout your configuration:

**In URLs**: `https://api.{{environment}}.example.com`
**In Headers**: `Authorization: Bearer {{apiToken}}`
**In Paths**: `/{{apiVersion}}/users`
**In Parameters**: `region={{defaultRegion}}`

See [User Variables](variables/overview.md) for detailed configuration instructions.

---

## Tab 6: Custom Tools

Add specialized tools and custom functionality.

### Custom Tool Configuration

**Tool Name**
- Unique identifier for your custom tool
- Used by AI models to invoke the tool

**Description**
- Detailed explanation of what the tool does
- Include usage examples and expected outcomes

**Engine Type**
- Choose the execution engine for your tool
- Options: Python, JavaScript, Shell, etc.

**Tool Parameters**
- Define input parameters for your tool
- Specify types, descriptions, and validation rules

**Implementation**
- Provide the actual tool implementation code
- Use the built-in code editor with syntax highlighting

### Python Tool Example

```python
def analyze_user_behavior(user_id: str, days: int = 30):
    """Analyze user behavior patterns over specified days"""
    # Your implementation here
    return {"user_id": user_id, "analysis": "..."}
```

---

## Saving Your Configuration

### Validation

- Real-time validation as you configure
- Error highlighting and helpful messages
- Warnings for potential improvements

### Save Process

1. Complete all required fields across the tabs
2. Click "Save Configuration" when ready
3. Configuration is validated and stored
4. Ready for deployment and testing

This tab-by-tab approach ensures you create comprehensive, well-configured MCP servers that work seamlessly with AI models.

## Deploying and Testing Your MCP

### Deployment
For deploying your MCP configuration, see [Deployment Management](deployment-management.md).

### Testing
After deployment, you can test your MCP using two approaches:

#### 1. Built-in Test Interface
Use MCPHub's integrated testing framework to test your deployed MCP directly in the application. See [Configure AI Testing](../getting-started/first-mcp.md#step-10-configure-ai-testing) for detailed instructions on setting up and using the test interface.

#### 2. LangChain Integration Testing  
Test your MCP using LangChain for more comprehensive integration testing scenarios. See [LangChain Integration](../advanced/langchain-integration.md) for setup and usage instructions.