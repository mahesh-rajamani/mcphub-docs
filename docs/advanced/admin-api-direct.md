# Admin API Direct Access

The MCPHub Admin API provides direct programmatic access to all configuration and management operations without using the MCP Studio frontend. This is ideal for automation, CI/CD pipelines, and headless deployments.

## Base URL and Authentication

### Admin API Endpoint

The Admin API is available at the same port as the MCP Bridge with the `/admin` prefix:

```
http://localhost:8080/admin
```

### Authentication

Admin API uses HTTP Basic Authentication with configurable credentials:

```bash
# Default credentials (development only)
Username: admin
Password: admin

# Production credentials (set via environment variables)
MCPHUB_ADMIN_USERNAME=your-admin-user
MCPHUB_ADMIN_PASSWORD=your-secure-password
```

### Authentication Header

```bash
# Basic Auth header
Authorization: Basic YWRtaW46YWRtaW4=

# Or use curl with credentials
curl -u admin:admin http://localhost:8080/admin/health
```

## Core API Endpoints

### Health and Status

#### Get System Health
```http
GET /admin/health
Authorization: Basic YWRtaW46YWRtaW4=
```

**Response:**
```json
{
  "status": "UP",
  "checks": [
    {
      "name": "storage",
      "status": "UP",
      "data": {
        "provider": "database",
        "connection": "healthy"
      }
    },
    {
      "name": "encryption",
      "status": "UP", 
      "data": {
        "algorithm": "AES-256-GCM",
        "keyStatus": "active"
      }
    }
  ]
}
```

#### Get System Information
```http
GET /admin/info
Authorization: Basic YWRtaW46YWRtaW4=
```

**Response:**
```json
{
  "application": {
    "name": "mcp-bridge",
    "version": "1.0.0",
    "buildTime": "2024-01-15T10:30:00Z"
  },
  "system": {
    "javaVersion": "21.0.1",
    "memoryUsed": "256MB",
    "memoryMax": "1GB"
  },
  "storage": {
    "provider": "database",
    "configurations": 15,
    "tenants": 3
  }
}
```

## Configuration Management

### List All Configurations

```http
GET /admin/configurations
Authorization: Basic YWRtaW46YWRtaW4=
```

**Query Parameters:**
- `tenant`: Filter by tenant ID
- `status`: Filter by status (ACTIVE, ARCHIVED, DRAFT)
- `limit`: Maximum results (default: 100)
- `offset`: Pagination offset

**Example:**
```bash
curl -u admin:admin \
  "http://localhost:8080/admin/configurations?tenant=default&limit=10"
```

**Response:**
```json
{
  "configurations": [
    {
      "id": "123e4567-e89b-12d3-a456-426614174000",
      "tenantId": "default",
      "mcpName": "weather-api",
      "version": "1.0.0",
      "description": "Weather information API",
      "status": "ACTIVE",
      "createdAt": "2024-01-15T10:30:00Z",
      "updatedAt": "2024-01-15T10:30:00Z",
      "endpointCount": 3,
      "variableCount": 2
    }
  ],
  "pagination": {
    "total": 15,
    "limit": 10,
    "offset": 0,
    "hasMore": true
  }
}
```

### Get Specific Configuration

```http
GET /admin/configurations/{configId}
Authorization: Basic YWRtaW46YWRtaW4=
```

**Example:**
```bash
curl -u admin:admin \
  "http://localhost:8080/admin/configurations/123e4567-e89b-12d3-a456-426614174000"
```

**Response:**
```json
{
  "id": "123e4567-e89b-12d3-a456-426614174000",
  "tenantId": "default",
  "mcpName": "weather-api",
  "version": "1.0.0",
  "description": "Weather information API",
  "configuration": {
    "mcpName": "weather-api",
    "description": "Weather information API",
    "userVariables": [
      {
        "name": "apiKey",
        "description": "OpenWeather API key",
        "type": "token",
        "required": true,
        "sensitive": true
      }
    ],
    "baseConfigs": {
      "rest": {
        "baseUrl": "https://api.openweathermap.org/data/2.5"
      }
    },
    "endpoints": [
      {
        "name": "getCurrentWeather",
        "protocol": "rest",
        "method": "GET",
        "path": "/weather",
        "description": "Get current weather conditions"
      }
    ]
  },
  "metadata": {
    "tags": ["weather", "api"],
    "documentation": "https://docs.example.com/weather-api"
  },
  "status": "ACTIVE",
  "createdAt": "2024-01-15T10:30:00Z",
  "updatedAt": "2024-01-15T10:30:00Z"
}
```

### Create New Configuration

```http
POST /admin/configurations
Authorization: Basic YWRtaW46YWRtaW4=
Content-Type: application/json
```

**Request Body:**
```json
{
  "tenantId": "default",
  "configuration": {
    "mcpName": "github-api",
    "description": "GitHub repository management API",
    "userVariables": [
      {
        "name": "githubToken",
        "description": "GitHub personal access token",
        "type": "token",
        "required": true,
        "sensitive": true
      }
    ],
    "baseConfigs": {
      "rest": {
        "baseUrl": "https://api.github.com",
        "headers": {
          "Accept": "application/vnd.github.v3+json",
          "Authorization": "token {{githubToken}}"
        }
      }
    },
    "endpoints": [
      {
        "name": "listRepositories",
        "protocol": "rest",
        "method": "GET",
        "path": "/user/repos",
        "description": "List repositories for the authenticated user"
      }
    ]
  },
  "metadata": {
    "tags": ["github", "version-control"],
    "version": "1.0.0"
  }
}
```

**Example:**
```bash
curl -u admin:admin \
  -X POST "http://localhost:8080/admin/configurations" \
  -H "Content-Type: application/json" \
  -d @github-mcp.json
```

**Response:**
```json
{
  "id": "456e7890-e89b-12d3-a456-426614174001",
  "tenantId": "default",
  "mcpName": "github-api",
  "version": "1.0.0",
  "status": "ACTIVE",
  "createdAt": "2024-01-15T11:00:00Z",
  "mcpEndpoint": "http://localhost:8080/github-api/mcp"
}
```

### Update Configuration

```http
PUT /admin/configurations/{configId}
Authorization: Basic YWRtaW46YWRtaW4=
Content-Type: application/json
```

**Request Body:** Same as create, with updated configuration

**Example:**
```bash
curl -u admin:admin \
  -X PUT "http://localhost:8080/admin/configurations/456e7890-e89b-12d3-a456-426614174001" \
  -H "Content-Type: application/json" \
  -d @updated-github-mcp.json
```

### Delete Configuration

```http
DELETE /admin/configurations/{configId}
Authorization: Basic YWRtaW46YWRtaW4=
```

**Example:**
```bash
curl -u admin:admin \
  -X DELETE "http://localhost:8080/admin/configurations/456e7890-e89b-12d3-a456-426614174001"
```

**Response:**
```json
{
  "message": "Configuration deleted successfully",
  "id": "456e7890-e89b-12d3-a456-426614174001"
}
```

## Variable Management

### Get Configuration Variables

```http
GET /admin/configurations/{configId}/variables
Authorization: Basic YWRtaW46YWRtaW4=
```

**Response:**
```json
{
  "variables": [
    {
      "id": "var-123",
      "name": "apiKey",
      "type": "token",
      "description": "OpenWeather API key",
      "required": true,
      "sensitive": true,
      "hasValue": true,
      "createdAt": "2024-01-15T10:30:00Z"
    },
    {
      "id": "var-456", 
      "name": "maxResults",
      "type": "number",
      "description": "Maximum results per request",
      "required": false,
      "sensitive": false,
      "defaultValue": "10",
      "hasValue": false,
      "createdAt": "2024-01-15T10:30:00Z"
    }
  ]
}
```

### Set Variable Value

```http
PUT /admin/configurations/{configId}/variables/{variableName}
Authorization: Basic YWRtaW46YWRtaW4=
Content-Type: application/json
```

**Request Body:**
```json
{
  "value": "your-secret-api-key",
  "description": "Updated API key for production"
}
```

**Example:**
```bash
curl -u admin:admin \
  -X PUT "http://localhost:8080/admin/configurations/123e4567-e89b-12d3-a456-426614174000/variables/apiKey" \
  -H "Content-Type: application/json" \
  -d '{"value": "sk-prod-123456789"}'
```

### Delete Variable Value

```http
DELETE /admin/configurations/{configId}/variables/{variableName}
Authorization: Basic YWRtaW46YWRtaW4=
```

## Version Management

### List Configuration Versions

```http
GET /admin/configurations/{configId}/versions
Authorization: Basic YWRtaW46YWRtaW4=
```

**Response:**
```json
{
  "versions": [
    {
      "version": "1.2.0",
      "description": "Added weather forecast endpoint",
      "createdAt": "2024-01-15T12:00:00Z",
      "createdBy": "admin",
      "changeCount": 2,
      "status": "ACTIVE"
    },
    {
      "version": "1.1.0", 
      "description": "Updated authentication method",
      "createdAt": "2024-01-10T10:00:00Z",
      "createdBy": "admin", 
      "changeCount": 1,
      "status": "ARCHIVED"
    }
  ]
}
```

### Create New Version

```http
POST /admin/configurations/{configId}/versions
Authorization: Basic YWRtaW46YWRtaW4=
Content-Type: application/json
```

**Request Body:**
```json
{
  "version": "1.3.0",
  "description": "Added air pollution endpoint",
  "configuration": {
    // Updated Universal Schema configuration
  }
}
```

### Get Version Diff

```http
GET /admin/configurations/{configId}/versions/{fromVersion}/diff/{toVersion}
Authorization: Basic YWRtaW46YWRtaW4=
```

**Response:**
```json
{
  "fromVersion": "1.1.0",
  "toVersion": "1.2.0", 
  "changes": [
    {
      "type": "added",
      "path": "endpoints[2]",
      "description": "Added new endpoint: getAirPollution"
    },
    {
      "type": "modified",
      "path": "baseConfigs.rest.headers",
      "description": "Updated authentication headers"
    }
  ],
  "summary": {
    "added": 1,
    "modified": 1,
    "removed": 0
  }
}
```

## Tenant Management

### List Tenants

```http
GET /admin/tenants
Authorization: Basic YWRtaW46YWRtaW4=
```

**Response:**
```json
{
  "tenants": [
    {
      "id": "default",
      "name": "Default Tenant",
      "description": "Default tenant for single-tenant deployments",
      "configurationCount": 15,
      "status": "ACTIVE",
      "createdAt": "2024-01-01T00:00:00Z"
    },
    {
      "id": "acme-corp",
      "name": "ACME Corporation", 
      "description": "ACME Corp tenant",
      "configurationCount": 8,
      "status": "ACTIVE",
      "createdAt": "2024-01-05T09:00:00Z"
    }
  ]
}
```

### Create Tenant

```http
POST /admin/tenants
Authorization: Basic YWRtaW46YWRtaW4=
Content-Type: application/json
```

**Request Body:**
```json
{
  "id": "startup-inc",
  "name": "Startup Inc.",
  "description": "Startup Inc. tenant for development",
  "metadata": {
    "contact": "admin@startup.com",
    "tier": "premium"
  }
}
```

## Bulk Operations

### Bulk Configuration Import

```http
POST /admin/configurations/bulk
Authorization: Basic YWRtaW46YWRtaW4=
Content-Type: application/json
```

**Request Body:**
```json
{
  "tenantId": "default",
  "configurations": [
    {
      "mcpName": "config1",
      "configuration": { /* Universal Schema */ }
    },
    {
      "mcpName": "config2", 
      "configuration": { /* Universal Schema */ }
    }
  ],
  "options": {
    "skipExisting": true,
    "validateOnly": false
  }
}
```

### Bulk Variable Update

```http
PUT /admin/configurations/{configId}/variables/bulk
Authorization: Basic YWRtaW46YWRtaW4=
Content-Type: application/json
```

**Request Body:**
```json
{
  "variables": {
    "apiKey": "new-api-key-value",
    "environment": "production",
    "maxRetries": "5"
  },
  "options": {
    "createMissing": false,
    "validateTypes": true
  }
}
```

## Audit and Monitoring

### Get Audit Logs

```http
GET /admin/audit
Authorization: Basic YWRtaW46YWRtaW4=
```

**Query Parameters:**
- `tenant`: Filter by tenant
- `user`: Filter by user
- `action`: Filter by action type
- `resource`: Filter by resource type
- `from`: Start date (ISO format)
- `to`: End date (ISO format)
- `limit`: Maximum results
- `offset`: Pagination offset

**Example:**
```bash
curl -u admin:admin \
  "http://localhost:8080/admin/audit?action=CREATE&from=2024-01-15T00:00:00Z&limit=50"
```

**Response:**
```json
{
  "logs": [
    {
      "id": "audit-123",
      "tenantId": "default",
      "userId": "admin",
      "action": "CREATE",
      "resourceType": "CONFIGURATION",
      "resourceId": "123e4567-e89b-12d3-a456-426614174000",
      "resourceName": "weather-api",
      "details": {
        "endpointCount": 3,
        "variableCount": 2
      },
      "ipAddress": "192.168.1.100",
      "userAgent": "curl/7.68.0",
      "timestamp": "2024-01-15T10:30:00Z"
    }
  ],
  "pagination": {
    "total": 150,
    "limit": 50,
    "offset": 0,
    "hasMore": true
  }
}
```

### Get Metrics

```http
GET /admin/metrics
Authorization: Basic YWRtaW46YWRtaW4=
```

**Response:**
```json
{
  "system": {
    "uptime": "72h15m30s",
    "memoryUsage": {
      "used": "256MB",
      "max": "1GB",
      "percentage": 25.6
    },
    "requestCount": 15847,
    "errorRate": 0.02
  },
  "storage": {
    "provider": "database",
    "connectionPoolActive": 8,
    "connectionPoolMax": 16,
    "queryLatencyP95": "15ms"
  },
  "mcp": {
    "activeConfigurations": 15,
    "totalRequests": 8934,
    "averageResponseTime": "45ms"
  }
}
```

## Error Handling

### Standard Error Response

All error responses follow this format:

```json
{
  "error": {
    "code": "CONFIGURATION_NOT_FOUND",
    "message": "Configuration with ID '123' not found",
    "details": {
      "configId": "123",
      "tenant": "default"
    },
    "timestamp": "2024-01-15T10:30:00Z",
    "path": "/admin/configurations/123"
  }
}
```

### Common Error Codes

- `AUTHENTICATION_REQUIRED` (401): Missing or invalid credentials
- `FORBIDDEN` (403): Insufficient permissions
- `CONFIGURATION_NOT_FOUND` (404): Configuration doesn't exist
- `VALIDATION_ERROR` (400): Invalid request data
- `TENANT_NOT_FOUND` (404): Tenant doesn't exist
- `VARIABLE_NOT_FOUND` (404): Variable doesn't exist
- `ENCRYPTION_ERROR` (500): Encryption/decryption failure
- `STORAGE_ERROR` (500): Database or storage error

## Automation Examples

### Deployment Script

Create a script to deploy MCP configurations programmatically:

```bash
#!/bin/bash
# deploy-mcp.sh - Deploy MCP configuration via Admin API

set -e

MCP_CONFIG_FILE=$1
MCPHUB_URL=${MCPHUB_URL:-https://your-mcphub-instance.com}
ADMIN_USER=${ADMIN_USER:-admin}
ADMIN_PASS=${ADMIN_PASS}

if [ -z "$ADMIN_PASS" ]; then
  echo "Error: ADMIN_PASS environment variable must be set"
  exit 1
fi

# Deploy configuration
echo "Deploying MCP configuration..."
RESPONSE=$(curl -u "$ADMIN_USER:$ADMIN_PASS" \
  -X POST "$MCPHUB_URL/admin/configurations" \
  -H "Content-Type: application/json" \
  -d @"$MCP_CONFIG_FILE")

CONFIG_ID=$(echo "$RESPONSE" | jq -r '.id')
MCP_ENDPOINT=$(echo "$RESPONSE" | jq -r '.mcpEndpoint')

echo "✅ MCP deployed successfully!"
echo "Configuration ID: $CONFIG_ID"
echo "MCP Endpoint: $MCP_ENDPOINT"

# Test MCP endpoint
echo "Testing MCP endpoint..."
curl -X POST "$MCP_ENDPOINT" \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc": "2.0", "id": 1, "method": "tools/list"}'
```

**Usage:**
```bash
# Set your admin password
export ADMIN_PASS="your-admin-password"

# Deploy your MCP configuration
./deploy-mcp.sh my-weather-api.json
```

### Variable Management Script

```python
#!/usr/bin/env python3
# manage-variables.py - Manage MCP variables via Admin API

import requests
import json
import os
from base64 import b64encode

class MCPHubAdmin:
    def __init__(self, base_url, username, password):
        self.base_url = base_url
        auth_string = f"{username}:{password}"
        self.auth_header = {
            'Authorization': f'Basic {b64encode(auth_string.encode()).decode()}'
        }
    
    def set_variable(self, config_id, variable_name, value):
        """Set a variable value"""
        url = f"{self.base_url}/admin/configurations/{config_id}/variables/{variable_name}"
        response = requests.put(
            url,
            headers={**self.auth_header, 'Content-Type': 'application/json'},
            json={'value': value}
        )
        response.raise_for_status()
        return response.json()
    
    def get_variables(self, config_id):
        """Get all variables for a configuration"""
        url = f"{self.base_url}/admin/configurations/{config_id}/variables"
        response = requests.get(url, headers=self.auth_header)
        response.raise_for_status()
        return response.json()

# Usage example
admin = MCPHubAdmin(
    base_url="https://your-mcphub-instance.com",
    username=os.getenv("ADMIN_USER", "admin"),
    password=os.getenv("ADMIN_PASS")
)

# Set variables for your MCP configuration
config_id = "your-config-id-here"
admin.set_variable(config_id, "apiKey", os.getenv("YOUR_API_KEY"))
admin.set_variable(config_id, "environment", "production")

print("✅ Variables updated successfully!")
```

**Usage:**
```bash
# Set required environment variables
export ADMIN_PASS="your-admin-password"
export YOUR_API_KEY="your-actual-api-key"

# Run the script
python3 manage-variables.py
```

## Security Considerations

### API Security Best Practices

1. **Strong Passwords**: Use strong, unique admin passwords
2. **HTTPS Only**: Always use HTTPS for admin API access in production
3. **IP Restrictions**: Ask your administrator to restrict admin API access to trusted IPs
4. **Audit Logging**: All admin API usage is automatically logged
5. **Credential Rotation**: Regularly update admin passwords
6. **Environment Variables**: Never hardcode credentials in scripts

### Secure Script Usage

**✅ Good Practice:**
```bash
# Use environment variables for credentials
export ADMIN_PASS="your-secure-password"
export API_KEY="your-api-key"

# Never hardcode in scripts
./deploy-mcp.sh config.json
```

**❌ Bad Practice:**
```bash
# Don't hardcode credentials in scripts
ADMIN_PASS="password123"  # Visible in process lists and logs
```

### Network Access

- **VPN Access**: Use VPN when accessing admin API remotely
- **Firewall Rules**: Ensure only authorized networks can reach admin endpoints
- **Private Networks**: Keep admin API on private networks when possible

## Related Topics

- [Storage & Encryption](storage-encryption.md)
- [Authentication Configuration](../creating-mcps/authentication.md)