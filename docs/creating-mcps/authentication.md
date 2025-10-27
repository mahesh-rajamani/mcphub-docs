# Authentication

MCPHub supports multiple authentication methods for integrating with backend APIs. Configure authentication in the MCP Studio interface under the **Protocol** tab (Tab 2).

## Authentication Types

| Authentication Type | Description | Use Case | Protocols |
|-------------------|-------------|----------|-----------|
| **None** | No authentication required | Public APIs or testing environments | All |
| **API Key** | Simple API key authentication via header or query parameter | APIs requiring API keys in headers or query strings | REST only |
| **Static Headers** | Fixed headers sent with every request | Fixed API keys or tokens that don't change | All |
| **Header Forwarding** | Pass-through authentication headers from MCP clients | Authentication tokens generated outside MCPHub | All |
| **JWT Authentication** | Acquire and manage JWT tokens automatically with refresh | Service-to-service API authentication | All |
| **OAuth 2.0** | OAuth 2.0 client credentials flow with automatic token refresh | Industry standard OAuth flows for service-to-service auth | All |
| **X.509 WS-Security** | Client certificate authentication in SOAP security headers | SOAP web services with certificate-based mutual auth | SOAP only |

**Note**: Static Headers and Header Forwarding can be configured alongside other authentication methods to add custom headers or pass-through headers from MCP clients.

---

## Automatic User Variable Creation

When you select JWT Authentication, OAuth 2.0, or X.509 WS-Security, MCPHub **automatically creates** the required user variables with standardized names. These variables are created in the User Variables tab and are ready to use.

### JWT Authentication Variables (Auto-Created)
- `jwtClientId` - JWT Client ID for service authentication
- `jwtClientSecret` - JWT Client Secret (marked as sensitive)
- `jwtScope` - JWT scope for API access permissions (optional)

### OAuth 2.0 Variables (Auto-Created)
- `oauthClientId` - OAuth 2.0 Client ID from authorization server
- `oauthClientSecret` - OAuth 2.0 Client Secret (marked as sensitive)
- `oauthScope` - OAuth 2.0 scope for API access permissions (optional)

### X.509 WS-Security Variables (Auto-Created, SOAP only)
- `clientCertificate` - Client X.509 certificate (Certificate type, auto-encrypted)
- `clientPrivateKey` - Client private key (Certificate type, auto-encrypted)

**Important**: Variable names are standardized and cannot be changed. This ensures consistency across configurations and simplifies deployment.

---

## API Key Authentication Configuration (REST Only)

### When to Use
- API requires simple API key authentication
- API key is sent as an HTTP header or query parameter
- No token refresh or complex authentication flows needed
- Common with public APIs and third-party services

### Configuration Steps

1. **Go to Protocol tab** (Tab 2) with REST selected
2. **Select Authentication Type**: Choose "API Key" from the authentication dropdown
3. **Configure API Key settings** in the API Key Authentication Configuration card

### Configuration Fields

#### API Key Location
Choose where the API key should be sent in the HTTP request:

**Send as HTTP Header** (Most Common)
- API key is sent in an HTTP request header
- More secure as it's not visible in URLs or logs
- Examples: `Authorization`, `X-API-Key`, `api-key`

**Send as Query Parameter**
- API key is sent as a URL query parameter
- Visible in URLs and server logs
- Use only when the API specifically requires it
- Examples: `?api_key=xxx`, `?apikey=xxx`, `?key=xxx`

#### Header Name / Query Parameter Name
The name of the header or query parameter:

**For headers:**
- Common names: `Authorization`, `X-API-Key`, `api-key`, `X-Auth-Token`
- Example: `Authorization` → `Authorization: your-api-key-value`

**For query parameters:**
- Common names: `api_key`, `apikey`, `key`, `access_token`
- Example: `api_key` → `/api/data?api_key=your-api-key-value`

#### API Key Value (Optional)
The actual API key value or a user variable reference:

**Using User Variables (Recommended)**:
```
{{apiKey}}
```

**Using Fixed Value** (for testing only):
```
sk-1234567890abcdef
```

**Note**: Leave this field empty or use a variable syntax like `{{apiKey}}` for production. The actual value should be provided via user variables.

### Configuration Examples

#### Example 1: Header-Based API Key
**Configuration:**
- **API Key Location**: Send as HTTP Header
- **Header Name**: `X-API-Key`
- **API Key Value**: `{{apiKey}}`

**Result**: `X-API-Key: your-api-key-value`

**User Variable Setup**:
1. Go to **User Variables tab** (Tab 3)
2. Click **"Add Variable"**
3. Configure variable:
   - **Name**: `apiKey`
   - **Type**: Token
   - **Sensitive**: Yes
   - **Default Value**: Your actual API key

#### Example 2: Query Parameter API Key
**Configuration:**
- **API Key Location**: Send as Query Parameter
- **Query Parameter Name**: `api_key`
- **API Key Value**: `{{apiKey}}`

**Result**: `/api/endpoint?api_key=your-api-key-value`

**User Variable Setup**: Same as Example 1

#### Example 3: Authorization Header
**Configuration:**
- **API Key Location**: Send as HTTP Header
- **Header Name**: `Authorization`
- **API Key Value**: `{{apiKey}}`

**Result**: `Authorization: your-api-key-value`

**Note**: If your API requires a prefix like "Bearer" or "Token", include it in the API Key Value:
```
Bearer {{apiKey}}
```

Result: `Authorization: Bearer your-api-key-value`

#### Example 4: Multiple Query Parameters
If your API requires the API key as a query parameter along with other parameters, configure:
- **API Key Location**: Send as Query Parameter
- **Query Parameter Name**: `access_token`
- **API Key Value**: `{{apiKey}}`

The API key will be automatically appended to existing query parameters:
```
/api/users?limit=10&access_token=your-api-key-value
```

### Variable Resolution

API Key authentication supports **user variable substitution** for flexible configuration:

**Variable Syntax**: `{{variableName}}`

**Examples**:
- `{{apiKey}}` - Resolves to the value of the `apiKey` user variable
- `Bearer {{apiKey}}` - Resolves to "Bearer" followed by the API key value
- `{{environment}}-key-{{suffix}}` - Combines multiple variables

Variables are resolved at runtime from:
1. User variable default values (User Variables tab)
2. Environment variables (production deployment)

### Security Considerations

**Header vs Query Parameter**:
- **Prefer headers** for API keys when possible
- Query parameters are visible in:
  - Browser address bar
  - Server logs
  - Browser history
  - Proxy logs
  - Referrer headers

**Protecting API Keys**:
- Always mark API key variables as **Sensitive** (will be masked in UI)
- Use **user variables** instead of hardcoded values
- Store actual keys in **environment variables** for production
- Never commit API keys to version control

### OpenAPI Import

When importing OpenAPI specifications, MCPHub automatically detects API key authentication:

**OpenAPI Security Scheme**:
```yaml
securitySchemes:
  ApiKeyAuth:
    type: apiKey
    in: header          # or "query"
    name: X-API-Key
```

MCPHub will:
1. Detect the `apiKey` security scheme
2. Read the `in` field to determine location (header or query)
3. Read the `name` field for the parameter/header name
4. Create API Key authentication configuration automatically

### Testing API Key Authentication

1. **Configure API Key** in Protocol tab
2. **Create user variable** in User Variables tab with your API key
3. **Save and deploy** the MCP configuration
4. **Use Test MCP interface** to verify:
   - Request includes the API key header or query parameter
   - Backend API accepts the authentication
   - API responses are successful

### Production Deployment

Set API key as an environment variable:

```bash
# Export API key as environment variable
export apiKey="sk-1234567890abcdef"

# Start MCPHub
docker run -d \
  -e apiKey="sk-1234567890abcdef" \
  -p 3000:3000 -p 8080:8080 \
  mcphub/complete:latest
```

### Common API Key Patterns

| API Provider | Location | Parameter/Header Name | Format |
|--------------|----------|---------------------|---------|
| OpenAI | Header | `Authorization` | `Bearer {{apiKey}}` |
| Stripe | Header | `Authorization` | `Bearer {{apiKey}}` |
| SendGrid | Header | `Authorization` | `Bearer {{apiKey}}` |
| Mailchimp | Header | `Authorization` | `Basic apikey:{{apiKey}}` |
| Google Maps | Query | `key` | `{{apiKey}}` |
| OpenWeather | Query | `appid` | `{{apiKey}}` |
| Generic REST | Header | `X-API-Key` | `{{apiKey}}` |

### API Key vs Static Headers

**Use API Key when**:
- API documentation specifically mentions "API key authentication"
- Single authentication credential needed
- OpenAPI spec uses `type: apiKey`
- Simple header or query parameter authentication

**Use Static Headers when**:
- Multiple custom headers needed
- Complex authentication schemes
- Non-standard header formats
- Need to combine multiple authentication methods

---

## Static Headers Configuration

### When to Use
- API requires fixed authentication tokens or API keys
- Token values don't change frequently
- Simple authentication with static credentials

### Configuration Steps

1. **Go to Protocol tab** (Tab 2)
2. **Select Authentication Type**: Choose "Static Headers" from the authentication dropdown
3. **Configure API Call Headers**: Add your authentication headers below

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

### Creating User Variables for Static Headers

After configuring headers, create user variables for the values:

1. **Go to User Variables tab** (Tab 3)
2. **Click "Add Variable"**
3. **Configure each variable**:
   - `apiKey`: Type = Token, Sensitive = Yes
   - `apiToken`: Type = Token, Sensitive = Yes
   - `authToken`: Type = Token, Sensitive = Yes

---

## Header Forwarding Configuration

### When to Use
- Authentication tokens are generated outside MCPHub
- MCP clients provide authentication headers
- Pass-through authentication from client to backend API
- Dynamic tokens managed by external systems

### Configuration Steps

1. **Go to Protocol tab** (Tab 2)
2. **Scroll to Header Forwarding section** (available for all authentication types)
3. **Click "Add Forwarding Rule"**
4. **Configure rules**: Set up which headers to forward from MCP clients to backend APIs

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

---

## JWT Authentication Configuration

### When to Use
- API provides JWT tokens via token endpoint
- Need automatic token refresh
- Service-to-service authentication (API to API communication)

### Configuration Steps

1. **Go to Protocol tab** (Tab 2)
2. **Select Authentication Type**: Choose "JWT Authentication" from dropdown
3. **Required user variables are automatically created**: `jwtClientId`, `jwtClientSecret`, `jwtScope`
4. **Configure JWT settings** in the JWT Authentication Configuration card

### Configuration Fields

#### Token Endpoint URL (Required)
URL where JWT tokens are obtained

```
https://api.example.com/auth/token
```

Example: `https://auth.example.com/token`

#### Login Method
**Client Credentials** (fixed) - For service-to-service API authentication

The system uses the OAuth 2.0 client credentials flow to obtain JWT tokens.

#### Client Application Settings

These variables are **automatically created** with standardized names:

- **Client ID Variable**: `{{jwtClientId}}` (fixed, auto-created)
- **Client Secret Variable**: `{{jwtClientSecret}}` (fixed, auto-created)
- **Scope Variable**: `{{jwtScope}}` (fixed, auto-created, optional)

**Additional optional variables:**
- **Domain Variable**: Enter `{{jwtDomain}}` for enterprise domain authentication
- **Audience Variable**: Enter `{{jwtAudience}}` for JWT audience claim

#### Token Management

**Token Storage**:
- `encrypted_storage` - Production (recommended)
- `memory` - Development only

**Auto Refresh**: Enable automatic token renewal before expiration (enabled by default)

**Refresh Threshold**: Minutes before expiry to refresh token (default: 5)

#### Token Usage Configuration

**Header Name**: HTTP header name for the token
- Default: `Authorization`
- Custom: `X-API-Token`, `X-Auth-Token`, etc.

**Header Format**: How the token is formatted in the header
- Default: `Bearer {{token}}`
- Token only: `{{token}}`
- Custom: `Token {{token}}`, `API-Key {{token}}`

**Request Format**: Format for token request
- `json` - JSON (application/json)
- `form` - Form Data (application/x-www-form-urlencoded)

### Setting Variable Values

After configuration, go to **User Variables tab** (Tab 3) to set values:

1. **Expand `jwtClientId`** variable card
2. **Enter your JWT client ID** in the default value field
3. **Expand `jwtClientSecret`** variable card
4. **Enter your JWT client secret** in the default value field (will be masked)
5. **Expand `jwtScope`** variable card (if needed)
6. **Enter scope value** (optional, e.g., "api:read api:write")

---

## OAuth 2.0 Configuration

### When to Use
- Industry standard OAuth 2.0 client credentials flow
- Integration with enterprise identity providers
- Service-to-service authentication

### Configuration Steps

1. **Go to Protocol tab** (Tab 2)
2. **Select Authentication Type**: Choose "OAuth 2.0" from dropdown
3. **Required user variables are automatically created**: `oauthClientId`, `oauthClientSecret`, `oauthScope`
4. **Configure OAuth 2.0 settings** in the OAuth 2.0 Authentication Configuration card

### Quick Setup for Popular Providers

Use the quick setup buttons to automatically configure URLs for popular providers:

- **Google OAuth** - Configures Google Cloud OAuth endpoints
- **Microsoft Azure AD** - Configures Azure AD endpoints
- **GitHub OAuth** - Configures GitHub OAuth endpoints

Click a button to auto-populate Token URL, Authorization URL, and default scope.

### OAuth 2.0 Flow Configuration

#### Login Method
**Client Credentials** (fixed) - For service-to-service API authentication (API to API communication)

#### Token URL (Required)
Endpoint for obtaining and refreshing access tokens

```
https://oauth.example.com/token
```

Examples:
- Google: `https://oauth2.googleapis.com/token`
- Microsoft: `https://login.microsoftonline.com/common/oauth2/v2.0/token`
- GitHub: `https://github.com/login/oauth/access_token`

#### Authorization URL (Optional)
Endpoint for user authorization (informational)

```
https://oauth.example.com/authorize
```

### Client Application Settings

These variables are **automatically created** with standardized names:

- **Client ID Variable**: `{{oauthClientId}}` (fixed, auto-created)
- **Client Secret Variable**: `{{oauthClientSecret}}` (fixed, auto-created)
- **Scope Variable**: `{{oauthScope}}` (fixed, auto-created, optional)

**Additional optional variables:**
- **Audience Variable**: Enter `{{oauthAudience}}` for OAuth audience claim

### Token Usage Configuration

**Header Name**: HTTP header name (default: `Authorization`)

**Header Format**: Token format in header (default: `Bearer {{token}}`)

### Custom OAuth Parameters

Add provider-specific parameters for authorization and token requests:

1. **Click "Add Parameter"**
2. **Enter parameter name**: e.g., `prompt`, `access_type`, `resource`
3. **Enter parameter value**: e.g., `consent`, `offline`, `https://api.example.com`

**Common examples:**
- `prompt: consent` - Force consent screen
- `access_type: offline` - Get refresh token
- `resource: https://api.example.com` - Azure AD resource

### Setting Variable Values

After configuration, go to **User Variables tab** (Tab 3) to set values:

1. **Expand `oauthClientId`** variable card
2. **Enter your OAuth client ID**
3. **Expand `oauthClientSecret`** variable card
4. **Enter your OAuth client secret** (will be masked)
5. **Expand `oauthScope`** variable card (if needed)
6. **Enter scope value** (optional, e.g., "read write")

### OAuth Provider Setup

Create OAuth credentials at:
- **Google Cloud Console**: https://console.cloud.google.com/
- **Azure Portal**: https://portal.azure.com/ (App registrations)
- **GitHub Developer Settings**: https://github.com/settings/developers (OAuth Apps)

---

## X.509 WS-Security Configuration (SOAP Only)

### When to Use
- SOAP web services requiring mutual authentication
- Client certificate authentication in SOAP security headers
- WS-Security standards compliance

### Configuration Steps

1. **Go to Protocol tab** (Tab 2) with SOAP selected
2. **Select Authentication Type**: Choose "X.509 WS-Security" from dropdown
3. **Required user variables are automatically created**: `clientCertificate`, `clientPrivateKey`
4. **Certificate and Private Key variables are displayed** (read-only, auto-populated)

### Configuration Fields

**Certificate Variable**: `{{clientCertificate}}` (fixed, auto-created)
- Variable containing the X.509 certificate in PEM format
- Automatically encrypted when stored

**Private Key Variable**: `{{clientPrivateKey}}` (fixed, auto-created)
- Variable containing the private key in PEM format
- Automatically encrypted when stored

### Setting Certificate Values

After configuration, go to **User Variables tab** (Tab 3) to set certificate values:

1. **Expand `clientCertificate`** variable card
2. **Paste PEM format certificate** or **upload certificate file**
3. **Expand `clientPrivateKey`** variable card
4. **Paste PEM format private key** or **upload key file**

### X.509 WS-Security Features

- Uses client certificates embedded in SOAP Security headers
- Certificate and private key must be in PEM format
- Provides mutual authentication between client and server
- Supports both X.509 Binary Security Token and X.509 Certificate references
- Certificate data is automatically encrypted regardless of sensitive setting

---

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

---

## Testing Authentication

### Using MCP Studio Test Interface

1. Configure authentication in the Protocol tab (Tab 2)
2. Set user variable values in User Variables tab (Tab 3)
3. **Save the MCP configuration**
4. **Deploy the MCP** using the Deploy button
5. Use the **Test MCP interface** to verify authentication

### Authentication Status

The test interface shows:
- ✅ **Authenticated**: Valid token available
- ⏰ **Token expires in**: Time until token expiry
- ❌ **Not authenticated**: Login required

### Login Actions

- **Login**: For JWT and OAuth client credentials flows
- Tokens are automatically refreshed based on refresh threshold settings

---

## How Authentication Works

1. **Configuration**: Select authentication type in Protocol tab
2. **Auto-Variable Creation**: Required user variables are automatically created with standardized names
3. **Set Values**: Go to User Variables tab to enter credentials
4. **Token Acquisition**: MCPHub obtains tokens from authentication providers using client credentials
5. **Token Storage**: Tokens stored securely with automatic refresh
6. **Request Authentication**: Tokens added to API requests using configured header format
7. **Token Refresh**: Automatic token renewal before expiration
8. **Backend Processing**: Backend APIs validate tokens and process requests

---

## Production Deployment

### Environment Variables

Set authentication credentials as environment variables matching the standardized variable names:

```bash
# JWT Authentication
export jwtClientId="your-client-id"
export jwtClientSecret="your-client-secret"
export jwtScope="api:read api:write"

# OAuth 2.0
export oauthClientId="your-oauth-client-id"
export oauthClientSecret="your-oauth-client-secret"
export oauthScope="api:read api:write"

# X.509 WS-Security (SOAP)
export clientCertificate="-----BEGIN CERTIFICATE-----
MIIDXTCCAkWgAwIBAgIJAKJ...
-----END CERTIFICATE-----"
export clientPrivateKey="-----BEGIN PRIVATE KEY-----
MIIEvQIBADANBgkqhkiG9w0...
-----END PRIVATE KEY-----"
```

### Security Requirements

- Use HTTPS for all authentication endpoints
- Store credentials in secure environment variables
- Enable encrypted token storage for production
- Configure appropriate token refresh thresholds (default 5 minutes)
- Use strong client secrets and rotate regularly
- For X.509 certificates, protect private keys and rotate certificates before expiration

---

## Summary

MCPHub authentication features:

✅ **Auto-Variable Creation** - Authentication variables automatically created with standardized names
✅ **Multi-Protocol Support** - JWT and OAuth 2.0 work across REST, gRPC, GraphQL, and SOAP
✅ **API Key Authentication** - Simple header or query parameter API key authentication for REST APIs
✅ **Automatic Token Refresh** - Tokens renewed before expiration
✅ **Encrypted Storage** - Secure token and credential storage
✅ **Header Forwarding** - Pass-through authentication from MCP clients
✅ **Static Headers** - Fixed headers for any authentication method
✅ **Quick Setup** - Pre-configured templates for popular OAuth providers
✅ **X.509 Support** - Certificate-based authentication for SOAP services
✅ **OpenAPI Import** - Automatic detection and configuration from OpenAPI specs

All authentication configurations use the standardized user variable system for consistent, secure credential management.
