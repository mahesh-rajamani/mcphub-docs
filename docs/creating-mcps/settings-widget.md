# Settings Widget

The MCPHub Settings Widget provides a streamlined interface for configuring backend connections, admin authentication, tenant settings, and AI model integration. This widget is accessible from the main navigation and allows you to manage the platform's core connectivity and authentication configuration.

## Overview

The Settings Widget provides access to:
- **Backend Configuration**: Set up and test connections to the MCP Bridge backend
- **Admin API Configuration**: Configure admin API authentication credentials
- **Tenant Management**: Configure tenant ID for multi-tenant isolation
- **AI Model Configuration**: Set up AI providers for testing and suggestions

## Accessing the Settings Widget

1. **From Main Navigation**: Click the settings icon in the top navigation bar
2. **From Toolbar**: Look for the settings/gear icon in the main interface

## Backend Configuration

### Setting Backend URL
Configure the primary backend URL for MCP Bridge:

```typescript
backendUrl: "http://localhost:8080"  // Default for development
```

**Configuration Options:**
- **Development**: `http://localhost:8080`
- **Staging**: `https://staging-api.mcphub.io`
- **Production**: `https://api.mcphub.io`

**Validation:**
- Requires `http://` or `https://` protocol
- Automatically removes trailing slashes
- Real-time URL format validation

### Connection Testing

#### Public API Test
Tests the backend health endpoint:
```http
GET /health
Accept: application/json
```

**Test Results:**
- ✅ **Success**: Green badge with "Connected" status
- ❌ **Failure**: Red badge with error details
- ⏳ **Testing**: Loading indicator during test

## Admin API Configuration

### External Authentication
Admin API authentication is now handled externally by API Gateway:

**Configuration:**
- **Authentication**: Handled by API Gateway (OAuth2, SAML, etc.)
- **Session Management**: Browser cookies manage authentication state
- **No Credentials**: No username/password configuration needed in frontend

**How it Works:**
1. Admin users authenticate via API Gateway login page
2. API Gateway sets secure session cookies
3. Browser automatically sends cookies with admin API requests
4. Backend receives user context via forwarded headers

### Admin Connection Test
Tests admin API connectivity:
```http
GET /admin/mcp/status
Accept: application/json
Cookie: <session-cookies>
X-Tenant-ID: <tenant-id>
```

**External Authentication Benefits:**
- Enterprise SSO integration (Google, Azure AD, Okta)
- No credential storage in browser
- Secure session management
- Centralized authentication policies

## Tenant Management

### Tenant Configuration
Configure the tenant ID for multi-tenant isolation:

**Tenant ID Settings:**
- **Default**: `default`
- **Validation**: Letters, numbers, underscores, hyphens only
- **Length**: 1-50 characters
- **Auto-sanitization**: Removes invalid characters, converts to lowercase

**Tenant Isolation:**
- Complete data separation between tenants
- All API requests include tenant context
- Configuration and data are tenant-specific

## AI Model Configuration

### Provider Selection
Choose from multiple AI providers:

**Supported Providers:**
- **OpenAI**: gpt-4o-mini, gpt-4o, gpt-3.5-turbo
- **Anthropic**: claude-3-5-haiku, claude-3-5-sonnet, claude-3-opus
- **Groq**: llama3-70b-8192, mixtral-8x7b-32768, gemma-7b-it
- **Custom**: OpenAI-compatible APIs

### Model Configuration
**Settings:**
- **Provider**: Dropdown selection of AI providers
- **Model**: Provider-specific model selection
- **API Key**: Encrypted storage with visibility toggle

### Custom Provider Configuration
For self-hosted or custom AI services:

**Custom Settings:**
- **API URL**: Custom endpoint for AI service
- **Custom Headers**: Key-value pairs for authentication
- **Add/Remove Headers**: Dynamic header management

## Settings Management

### Save and Reset
**Save Settings:**
- Validates all inputs before saving
- Saves to browser localStorage
- Provides confirmation feedback

**Reset Settings:**
- Restores default values
- Clears all custom configurations
- Requires confirmation

### Settings Persistence
- **Storage**: Browser localStorage  
- **Session Based**: Settings persist during browser session

## Connection Testing Features

### Test Indicators
- **Visual Feedback**: Color-coded badges for connection status
- **Error Messages**: Detailed error descriptions with status codes
- **Real-time Updates**: Immediate feedback during testing

### Test Behavior
- **Error Handling**: Comprehensive error reporting with status codes
- **Real-time Feedback**: Immediate response during testing

