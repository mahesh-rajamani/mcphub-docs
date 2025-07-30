# Header Forwarding

Header forwarding is a powerful feature in MCPHub that enables seamless authentication and API integration by capturing headers from MCP requests and forwarding them to backend APIs. This allows for transparent authentication passthrough and custom header management.

## Overview

The header forwarding system supports two forwarding modes:

1. **Same-name forwarding**: Forward header with identical name (e.g., `Authorization` → `Authorization`)
2. **Name mapping**: Forward header with different name (e.g., `Authorization` → `X-API-Key`)

This enables complex authentication scenarios where:
- Different APIs expect different header names
- Multiple authentication tokens need to be passed
- Custom headers need to be forwarded for request context

## Configuration Structure

Header forwarding rules are defined in the `auth.headerForwarding` array within base configurations:

```json
{
  "baseConfigs": {
    "rest": {
      "baseUrl": "https://api.example.com",
      "auth": {
        "type": "none",
        "headerForwarding": [
          {
            "sourceHeader": "Authorization",
            "targetHeader": null,
            "required": true
          },
          {
            "sourceHeader": "X-API-Key",
            "targetHeader": "Token",
            "required": false
          },
          {
            "sourceHeader": "X-Tenant-ID",
            "targetHeader": "X-Organization-ID",
            "required": true
          }
        ]
      }
    }
  }
}
```

## Header Forwarding Rules

Each forwarding rule supports the following properties:

### Required Properties

- **`sourceHeader`**: Header name to capture from incoming MCP request
- **`targetHeader`**: Header name for backend API (optional - defaults to sourceHeader)
- **`required`**: Whether header must be present in the request

### Rule Examples

#### Basic Authorization Forwarding
```json
{
  "sourceHeader": "Authorization",
  "required": true
}
```
- Captures `Authorization` header from MCP request
- Forwards as `Authorization` to backend API
- Request fails if header is missing

#### API Key Mapping
```json
{
  "sourceHeader": "Authorization", 
  "targetHeader": "X-API-Key",
  "required": true
}
```
- Captures `Authorization` header from MCP request
- Forwards as `X-API-Key` to backend API
- Useful when backend expects different header name

#### Optional Context Headers
```json
{
  "sourceHeader": "X-User-ID",
  "targetHeader": "X-Context-User",
  "required": false
}
```
- Captures `X-User-ID` if present
- Forwards as `X-Context-User`
- Request continues if header is missing

## Configuration in MCP Studio

### Adding Header Forwarding Rules

1. **Open MCP Configuration** in MCP Studio
2. **Navigate to Protocol → Basic Info**
3. **Scroll to Authentication section**
4. **Add Header Forwarding Rule**:
   - **Source Header**: Header name from MCP request
   - **Target Header**: Header name for backend (leave empty for same name)
   - **Required**: Check if header must be present

### UI Interface

The MCP Studio provides an intuitive interface for managing header forwarding:

```typescript
// Header Forwarding Editor Component
<HeaderForwardingEditor
  rules={headerForwardingRules}
  onChange={setHeaderForwardingRules}
/>
```

**Features:**
- Add/remove rules dynamically
- Validation for header names
- Required field indicators
- Common header suggestions (Authorization, X-API-Key, etc.)

## Testing Header Forwarding

### Test Interface

The Enhanced Test Framework includes complete header forwarding support:

1. **Navigate to Test Tab** in MCP Studio
2. **Expand Test Headers section**
3. **Add headers** that match your forwarding configuration
4. **Execute test** to verify forwarding works correctly

### Quick-Add Buttons

The test interface provides quick-add buttons for configured headers:

```json
// Example: If you have Authorization forwarding configured
{
  "sourceHeader": "Authorization",
  "required": true
}
```

The test interface will show:
- **[+ Authorization]** button for quick header addition
- **Validation** that only configured headers are allowed
- **Sensitive masking** for authentication tokens

### Test Example

**Configuration:**
```json
{
  "auth": {
    "headerForwarding": [
      {
        "sourceHeader": "Authorization",
        "targetHeader": "Bearer-Token",
        "required": true
      }
    ]
  }
}
```

**Test Headers:**
```json
{
  "Authorization": "Bearer eyJhbGciOiJIUzI1NiIs..."
}
```

**Result:**
- MCP request receives `Authorization: Bearer eyJhbGciOiJIUzI1NiIs...`
- Backend API receives `Bearer-Token: Bearer eyJhbGciOiJIUzI1NiIs...`

## Common Use Cases

### Multi-Tenant SaaS Applications

Forward tenant context to backend APIs:

```json
{
  "auth": {
    "headerForwarding": [
      {
        "sourceHeader": "Authorization",
        "required": true
      },
      {
        "sourceHeader": "X-Tenant-ID",
        "required": true
      },
      {
        "sourceHeader": "X-User-Role",
        "targetHeader": "X-Permission-Level",
        "required": false
      }
    ]
  }
}
```

### API Gateway Integration

Forward multiple authentication headers:

```json
{
  "auth": {
    "headerForwarding": [
      {
        "sourceHeader": "X-API-Key",
        "targetHeader": "Authorization",
        "required": true
      },
      {
        "sourceHeader": "X-Client-ID",
        "required": true
      },
      {
        "sourceHeader": "X-Request-ID",
        "required": false
      }
    ]
  }
}
```

### Legacy System Integration

Map modern headers to legacy formats:

```json
{
  "auth": {
    "headerForwarding": [
      {
        "sourceHeader": "Authorization",
        "targetHeader": "X-Auth-Token",
        "required": true
      },
      {
        "sourceHeader": "Accept",
        "targetHeader": "Content-Type-Accept",
        "required": false
      }
    ]
  }
}
```

## Security Considerations

### Header Validation

MCPHub validates forwarded headers:

- **Name validation**: Headers must be valid HTTP header names
- **Value sanitization**: Removes potentially dangerous characters
- **Size limits**: Prevents oversized header values
- **Required enforcement**: Ensures required headers are present

### Sensitive Data Protection

Headers marked as sensitive are protected:

```json
{
  "sourceHeader": "Authorization",
  "targetHeader": "X-Secret-Token",
  "required": true,
  "sensitive": true  // Masks in logs and UI
}
```

**Protection features:**
- **Masked in logs**: Headers not logged in debug output
- **UI masking**: Shown as password fields in test interface
- **Audit trails**: Access tracking without exposing values

### Best Practices

1. **Minimize forwarded headers**: Only forward necessary headers
2. **Use specific names**: Avoid generic header names that might conflict
3. **Validate requirements**: Mark critical headers as required
4. **Monitor usage**: Track header forwarding in audit logs
5. **Rotate tokens**: Regularly rotate forwarded authentication tokens

## Backend Implementation

### Java/Quarkus Backend

Header forwarding is implemented in the REST protocol adapter:

```java
@ApplicationScoped
public class RestProtocolAdapter {
    
    public CompletionStage<JsonNode> executeRequest(
        Endpoint endpoint, 
        Map<String, Object> parameters,
        ExecutionContext context) {
        
        // Apply header forwarding rules
        HttpHeaders forwardedHeaders = applyHeaderForwarding(
            endpoint.getBaseConfig().getAuth().getHeaderForwarding(),
            context.getHeaders()
        );
        
        // Build request with forwarded headers
        HttpRequest request = HttpRequest.newBuilder()
            .uri(buildUri(endpoint, parameters))
            .headers(forwardedHeaders)
            .build();
            
        return httpClient.sendAsync(request, HttpResponse.BodyHandlers.ofString());
    }
}
```

### Execution Context

Headers are carried through the execution chain via `ExecutionContext`:

```java
public class ExecutionContext {
    private final Map<String, String> headers;
    private final String tenantId;
    private final String userId;
    
    // Constructor and getters
}
```

## Debugging Header Forwarding

### Enable Debug Logging

Add to `application.properties`:

```properties
# Enable header forwarding debug logs
quarkus.log.category."com.mcphub.bridge.auth".level=DEBUG
quarkus.log.category."com.mcphub.bridge.protocol".level=DEBUG
```

### Debug Output Example

```
2024-01-15 10:30:15 DEBUG [RestProtocolAdapter] Applying header forwarding rules: 3
2024-01-15 10:30:15 DEBUG [RestProtocolAdapter] Source header 'Authorization' → Target header 'Authorization'
2024-01-15 10:30:15 DEBUG [RestProtocolAdapter] Source header 'X-Tenant-ID' → Target header 'X-Organization-ID'
2024-01-15 10:30:15 DEBUG [RestProtocolAdapter] Header forwarding complete: 2 headers forwarded
```

### Common Issues

**Issue: Header not being forwarded**
- Check header name spelling in configuration
- Verify header is present in test request
- Check required field validation

**Issue: Backend receives wrong header name**
- Verify targetHeader configuration
- Check for header name conflicts
- Review backend API documentation

**Issue: Authentication failures**
- Verify token format and encoding
- Check backend authentication requirements
- Review header forwarding mapping

## Advanced Scenarios

### Dynamic Header Transformation

Combine header forwarding with user variables:

```json
{
  "userVariables": [
    {
      "name": "tenantPrefix",
      "type": "string",
      "defaultValue": "org"
    }
  ],
  "auth": {
    "headerForwarding": [
      {
        "sourceHeader": "X-Tenant-ID",
        "targetHeader": "X-{{tenantPrefix}}-ID",
        "required": true
      }
    ]
  }
}
```

### Conditional Forwarding

Forward headers based on endpoint configuration:

```json
{
  "endpoints": [
    {
      "name": "publicEndpoint",
      "auth": {
        "headerForwarding": []  // No headers forwarded
      }
    },
    {
      "name": "privateEndpoint", 
      "auth": {
        "headerForwarding": [
          {
            "sourceHeader": "Authorization",
            "required": true
          }
        ]
      }
    }
  ]
}
```

### Multi-Protocol Support

Header forwarding works across all supported protocols:

- **REST APIs**: HTTP headers
- **gRPC Services**: Metadata forwarding
- **GraphQL APIs**: HTTP headers with GraphQL context
- **SOAP Services**: SOAP headers and HTTP headers

## Related Topics

- [Authentication Configuration](../configuration/authentication.md)
- [User Variables](../creating-mcps/variables/overview.md) 
- [Testing MCPs](../testing/mcp-testing.md)
- [Admin API](../api-reference/admin-api.md)