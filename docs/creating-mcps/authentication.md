# Authentication

MCPHub supports multiple authentication methods for integrating with backend APIs. Configure authentication in the MCP Studio interface under the **Protocol** tab (Tab 2).

## Authentication Types

| Authentication Type | Description | Use Case |
|-------------------|-------------|----------|
| **None** | No authentication required | Public APIs or testing environments |
| **Static Headers** | Fixed headers sent with every request | Fixed API keys or tokens that don't change |
| **Header Forwarding** | Pass-through authentication headers from MCP clients | Authentication tokens generated outside MCPHub |
| **JWT Authentication** | Acquire and manage JWT tokens automatically with refresh | Dynamic JWT tokens from token endpoints |
| **OAuth 2.0** | OAuth 2.0 flows including client credentials and authorization code | Industry standard OAuth flows |

**Note**: Both Static Headers and Header Forwarding are available for all authentication types. Use them to configure additional headers like Content-Type, custom API headers, or pass-through headers from MCP clients regardless of your chosen authentication method.

## Static Headers Configuration

### When to Use
- API requires fixed authentication tokens or API keys
- Token values don't change frequently
- Simple authentication with static credentials

### Configuration Steps

1. **Select Authentication Type**: Choose "Static Headers" from the authentication dropdown
2. **Configure API Call Headers**: In the "API call headers" section, add your authentication headers

### Configuration Examples

#### API Key Authentication
**In API call headers section:**
- **Header Name**: `X-API-Key`
- **Header Value**: `{{apiKey}}`

Result: `X-API-Key: your-api-key-value`

#### Bearer Token Authentication
**In API call headers section:**
- **Header Name**: `Authorization`
- **Header Value**: `Bearer {{apiToken}}`

Result: `Authorization: Bearer your-static-token`

#### Custom Authentication
**In API call headers section:**
- **Header Name**: `X-Auth-Token`
- **Header Value**: `{{authToken}}`

Result: `X-Auth-Token: your-auth-token`

### Required User Variables

Create user variables for the authentication values:

- `apiKey`: API key value (mark as sensitive)
- `apiToken`: Bearer token value (mark as sensitive)
- `authToken`: Custom authentication token (mark as sensitive)

## Header Forwarding Configuration

### When to Use
- Authentication tokens are generated outside MCPHub
- MCP clients provide authentication headers
- Pass-through authentication from client to backend API
- Dynamic tokens managed by external systems

### Configuration Steps

1. **Select Authentication Type**: Choose "Header Forwarding" from the authentication dropdown
2. **Configure Header Forwarding Rules**: Set up which headers to forward from MCP clients to backend APIs

### Configuration Examples

#### Forward Authorization Header
**In Header Forwarding configuration:**
- **Source Header**: `Authorization`
- **Target Header**: `Authorization`
- **Required**: `true`

Forwards: `Authorization: Bearer client-provided-token`

#### Map to Custom Header
**In Header Forwarding configuration:**
- **Source Header**: `X-Client-Token`
- **Target Header**: `X-API-Key`
- **Required**: `true`

Maps: `X-Client-Token: value` → `X-API-Key: value`

#### Optional Header Forwarding
**In Header Forwarding configuration:**
- **Source Header**: `X-Optional-Auth`
- **Target Header**: `X-Optional-Auth`
- **Required**: `false`

Forwards header only if present in client request.

### How Header Forwarding Works

1. **Client Request**: MCP client sends request with authentication header
2. **Header Extraction**: MCPHub extracts the specified source header
3. **Header Mapping**: Maps source header to target header name
4. **Backend Request**: Forwards header to backend API
5. **Response**: Returns backend response to client

### Usage with MCP Clients

When using header forwarding, MCP clients must include the authentication header:

```typescript
// Example MCP client request
const response = await fetch('/mcp/endpoint', {
  headers: {
    'Authorization': 'Bearer your-external-token',
    'Content-Type': 'application/json'
  }
});
```

## JWT Authentication Configuration

### When to Use
- API provides JWT tokens via token endpoint
- Need automatic token refresh
- Service-to-service authentication

### Configuration Fields

**Token Endpoint**: URL where JWT tokens are obtained
```
https://api.example.com/auth/token
```

**Login Method**: 
- `client_credentials` (currently supported)
- `username_password` (currently supported)

**Client Credentials**:
- **Client ID Variable**: `{{jwtClientId}}`
- **Client Secret Variable**: `{{jwtClientSecret}}`

**Username/Password**:
- **Username Variable**: `{{jwtUsername}}`
- **Password Variable**: `{{jwtPassword}}`

**Optional Configuration**:
- **Scope Variable**: `{{jwtScope}}`

### Token Usage Configuration

**Header Name**: HTTP header name for the token
- Default: `Authorization`
- Custom: `X-API-Token`, `X-Auth-Token`, etc.

**Header Format**: How the token is formatted in the header
- Default: `Bearer {{token}}`
- Token only: `{{token}}`
- Custom: `Token {{token}}`, `API-Key {{token}}`

### Token Storage Settings

**Token Storage**: 
- `encrypted_storage` (production)
- `memory` (development)

**Auto Refresh**: Enable automatic token renewal before expiration

**Refresh Threshold**: Minutes before expiry to refresh token (default: 5)

## OAuth 2.0 Configuration

### When to Use
- Industry standard OAuth 2.0 flows
- Integration with enterprise identity providers
- User authorization workflows

### Flow Types

#### Client Credentials Flow
For service-to-service authentication.

**Configuration**:
- **Flow Type**: `client_credentials`
- **Token URL**: `https://oauth.example.com/token`
- **Client ID Variable**: `{{oauthClientId}}`
- **Client Secret Variable**: `{{oauthClientSecret}}`
- **Scope Variable**: `{{oauthScope}}`

#### Authorization Code Flow
For user authorization workflows.

**Configuration**:
- **Flow Type**: `authorization_code`
- **Authorization URL**: `https://oauth.example.com/authorize`
- **Token URL**: `https://oauth.example.com/token`
- **Client ID Variable**: `{{oauthClientId}}`
- **Client Secret Variable**: `{{oauthClientSecret}}`
- **Redirect URI**: `http://localhost:8080/oauth2/{tenantId}/{mcpName}/auth`
- **Scope Variable**: `{{oauthScope}}`

**Redirect URI Configuration**:
- Replace `{tenantId}` with your tenant ID (e.g., `default`)
- Replace `{mcpName}` with your MCP name
- Example: `http://localhost:8080/oauth2/default/payment-api/auth`
- Production: `https://your-domain.com/oauth2/{tenantId}/{mcpName}/auth`

### Token Usage Configuration

**Header Name**: HTTP header name (default: `Authorization`)

**Header Format**: Token format in header (default: `Bearer {{token}}`)

### Security Options

**PKCE**: Enable Proof Key for Code Exchange for enhanced security

**State Parameter**: Enable state parameter for CSRF protection

## User Variables

Authentication configurations use user variables for credentials:

### JWT Variables
- `jwtClientId`: Client ID for JWT authentication
- `jwtClientSecret`: Client secret (sensitive)
- `jwtUsername`: Username for username/password flow
- `jwtPassword`: Password for username/password flow (sensitive)
- `jwtScope`: Authentication scope

### OAuth 2.0 Variables
- `oauthClientId`: OAuth client ID
- `oauthClientSecret`: OAuth client secret (sensitive)
- `oauthScope`: OAuth scope permissions

## Token Header Examples

### Standard Bearer Token
```json
{
  "headerName": "Authorization",
  "headerFormat": "Bearer {{token}}"
}
```
Result: `Authorization: Bearer eyJhbGciOiJIUzI1NiIs...`

### Token Without Bearer
```json
{
  "headerName": "Authorization",
  "headerFormat": "{{token}}"
}
```
Result: `Authorization: eyJhbGciOiJIUzI1NiIs...`

### Custom Header
```json
{
  "headerName": "X-API-Token",
  "headerFormat": "{{token}}"
}
```
Result: `X-API-Token: eyJhbGciOiJIUzI1NiIs...`

### Custom Format
```json
{
  "headerName": "Authorization",
  "headerFormat": "Token {{token}}"
}
```
Result: `Authorization: Token eyJhbGciOiJIUzI1NiIs...`

## Testing Authentication

### Using MCP Studio Test Interface

1. Configure authentication in the MCP configuration
2. Set user variable values (client ID, secret, etc.)
3. Deploy the MCP configuration
4. Use the test interface to verify authentication

### Authentication Status

The test interface shows:
- ✅ **Authenticated**: Valid token available
- ⏰ **Token expires in**: Time until token expiry
- ❌ **Not authenticated**: Login required

### Login Actions

- **Login**: For JWT and OAuth client credentials flows
- **Login with OAuth**: For OAuth authorization code flow

## How Authentication Works

1. **Token Acquisition**: MCPHub obtains tokens from authentication providers
2. **Token Storage**: Tokens stored securely with automatic refresh
3. **Request Authentication**: Tokens added to API requests using configured header format
4. **Token Refresh**: Automatic token renewal before expiration
5. **Backend Processing**: Backend APIs validate tokens and process requests

## Production Deployment

### Environment Variables

Set authentication credentials as environment variables:

```bash
# JWT Authentication
export jwtClientId="your-client-id"
export jwtClientSecret="your-client-secret"
export jwtScope="api:read api:write"

# OAuth 2.0
export oauthClientId="your-oauth-client-id"
export oauthClientSecret="your-oauth-client-secret"
export oauthScope="api:read api:write"
```

### Security Requirements

- Use HTTPS for all authentication endpoints
- Store credentials in secure environment variables
- Enable encrypted token storage for production
- Configure appropriate token refresh thresholds
- Use strong client secrets and rotate regularly