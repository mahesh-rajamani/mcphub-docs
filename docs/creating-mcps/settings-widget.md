# Settings Widget

The MCPHub Settings Widget provides a streamlined interface for configuring backend connections, admin authentication, tenant settings, and AI model integration. This widget is accessible from the main navigation and allows you to manage the platform's core connectivity and authentication configuration.

## Overview

The Settings Widget provides access to:
- **Backend Configuration**: Set up and test connections to the MCP Bridge backend
- **Admin API Configuration**: Configure admin API authentication credentials
- **Tenant Management**: Configure tenant ID for multi-tenant isolation
- **AI Model Configuration**: Set up AI providers for testing and suggestions

## Initial Configuration: Welcome Workflow

When you first access MCPHub Studio, you'll be guided through a **Welcome Workflow** that presents the settings configuration dialog. This one-time setup wizard helps you configure the essential settings to get started:

### Welcome Workflow Steps

1. **First Launch**: When you open MCPHub Studio for the first time, the Welcome dialog automatically appears
2. **Configure Settings**: You'll be guided to configure:
   - Backend URL connection
   - Tenant ID (optional, defaults to "default")
   - AI model configuration (optional, can be configured later)
3. **Skip Option**: You can skip the AI configuration and set it up later through the Settings Widget
4. **Complete Setup**: Once configured, the settings are saved and you can start using MCPHub Studio

**After Initial Setup**: Once you've completed the Welcome Workflow, these settings can be updated anytime through the Settings Widget.

## Accessing the Settings Widget

After the initial Welcome Workflow, you can access and update settings:

1. **From Main Navigation**: Click the settings icon (⚙️) in the top navigation bar
2. **From Toolbar**: Look for the settings/gear icon in the main interface
3. **Anytime**: Settings can be updated whenever needed

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

### Authentication Configuration

If your Admin API is secured by authentication, you can configure authentication headers in the Settings Widget:

**Authentication Header Settings:**
- **Header Name**: The name of the authentication header (e.g., `Authorization`, `X-API-Key`)
- **Header Value**: The authentication value (e.g., `Bearer <token>`, API key)

**Configuration Steps:**
1. Open the Settings Widget
2. Navigate to Admin API Configuration section
3. Enter the **Authentication Header Name** (e.g., `Authorization`)
4. Enter the **Authentication Header Value** (e.g., `Bearer your-admin-token`)
5. Click "Save Settings" to persist the configuration

**Common Authentication Patterns:**

#### Bearer Token
```
Header Name: Authorization
Header Value: Bearer your-admin-api-token
```

#### API Key
```
Header Name: X-API-Key
Header Value: your-admin-api-key
```

#### Custom Authentication
```
Header Name: X-Auth-Token
Header Value: your-custom-token
```

### Admin Connection Test
Tests admin API connectivity with configured authentication:
```http
GET /admin/mcp/status
Accept: application/json
<Authentication-Header-Name>: <Authentication-Header-Value>
X-Tenant-ID: <tenant-id>
```

**Test Results:**
- ✅ **Success**: Green badge confirming admin API connection
- ❌ **Failure**: Red badge with authentication or connection errors
- ⏳ **Testing**: Loading indicator during test

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
