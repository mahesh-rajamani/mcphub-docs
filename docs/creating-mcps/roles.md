# Roles: Aggregating Tools from Multiple MCPs

## Overview

Roles are a powerful feature in MCPHub that allow you to create **composite MCP servers** by aggregating tools and resources from multiple existing MCPs. Instead of giving clients access to individual MCPs, you can create role-based workflows where a single endpoint provides access to a curated set of tools from various backend APIs.

### What is a Role?

A Role is a virtual MCP server that:
- **Aggregates** tools and resources from multiple deployed MCPs
- **Aliases** each tool with a custom name for clarity and organization
- **Exposes** a unified MCP protocol endpoint: `/{tenantId}/role/{roleName}/mcp`
- **Supports** both tools (callable endpoints) and resources (data retrieval)
- **Controls** output schema inclusion at hierarchical levels

## Why Use Roles?

### Problem: Too Many MCP Endpoints

When you have multiple backend APIs exposed as MCPs, clients need to:
- Connect to multiple MCP endpoints
- Remember which tools belong to which MCP
- Manage authentication for each MCP separately
- Handle different response formats and conventions

### Solution: Role-Based Access

Roles solve these problems by:

1. **Simplified Access**: Single MCP endpoint for multiple APIs
2. **Persona-Based Workflows**: Create roles like "data-analyst", "customer-support", "developer"
3. **Custom Naming**: Alias tools with meaningful names for the role's context
4. **Selective Exposure**: Choose only the tools relevant to each role
5. **Centralized Authentication**: One authentication point for all underlying APIs
6. **Resource Support**: Enable endpoints as MCP resources for data retrieval

### Real-World Examples

**Data Analyst Role**
- Aggregate tools from: Database MCP, Analytics MCP, Reporting MCP
- Tools: `query_database`, `generate_report`, `export_csv`
- Result: Analysts get all data tools in one place

**Customer Support Role**
- Aggregate tools from: CRM MCP, Ticketing MCP, Knowledge Base MCP
- Tools: `get_customer_info`, `create_ticket`, `search_kb`
- Result: Support agents get all customer-facing tools unified

**Developer Role**
- Aggregate tools from: GitHub MCP, CI/CD MCP, Monitoring MCP
- Tools: `create_pr`, `trigger_build`, `check_metrics`
- Result: Developers get all dev tools in a single interface

## How Roles Work

### Architecture

```
┌─────────────────────────────────────────────────────┐
│  MCP Client (Claude Desktop, Custom Client, etc.)  │
└────────────────────┬────────────────────────────────┘
                     │
                     │ MCP Protocol
                     │
         ┌───────────▼──────────────┐
         │  Role MCP Endpoint       │
         │  /{tenant}/role/{name}/mcp│
         └───────────┬──────────────┘
                     │
         ┌───────────▼──────────────┐
         │  Role Routing Service    │
         │  - Alias Resolution      │
         │  - Tool Aggregation      │
         │  - Resource Mapping      │
         └───────────┬──────────────┘
                     │
        ┌────────────┼────────────┐
        │            │            │
    ┌───▼───┐    ┌───▼───┐    ┌───▼───┐
    │ MCP 1 │    │ MCP 2 │    │ MCP 3 │
    └───┬───┘    └───┬───┘    └───┬───┘
        │            │            │
    ┌───▼───┐    ┌───▼───┐    ┌───▼───┐
    │ API 1 │    │ API 2 │    │ API 3 │
    └───────┘    └───────┘    └───────┘
```

## Creating a Role

### Step 1: Navigate to Roles Tab

In the MCPHub Studio interface, click the **Roles** tab in the main navigation.

### Step 2: Click "Create Role"

This opens the Role creation form with two tabs: **Basic Information** and **Endpoints**.

### Step 3: Configure Basic Information

**Role Name** (Required)
- Must be unique across all MCPs and Roles
- Cannot be changed after creation
- Used in the role URL: `/{tenantId}/role/{roleName}/mcp`
- Example: `data-analyst-role`

**Description** (Recommended)
- Describe the purpose and intended users of this role
- Example: "Data analysis tools for the analytics team"

**Version** (Optional)
- Semantic version for the role configuration
- Default: "1.0.0"

**Include Output Schema** (Toggle)
- Role-level setting for including output schemas in tool specifications
- Can be overridden at endpoint level
- Both role and endpoint settings must be true for schemas to be included

### Step 4: Select and Configure Endpoints

Switch to the **Endpoints** tab to select tools from deployed MCPs.

#### Viewing Available Endpoints

- All deployed MCPs are listed with their enabled endpoints
- Click MCP name to expand/collapse endpoint list
- Search box filters across all MCPs and endpoints

#### Selecting Endpoints

**Individual Selection:**
- Click checkbox next to endpoint to include in role
- Endpoint is added with default alias (original name)

**Bulk Selection:**
- Click "Select All" next to MCP name to include all endpoints
- Click "Deselect All" to remove all endpoints from that MCP

#### Configuring Aliases

Each selected endpoint needs a unique alias:

**Manual Alias**
- Click alias field to edit
- Enter meaningful name for the role's context
- Example: Original name `getUser` → Role alias `fetch_customer`

**Auto-Generate Aliases**
- Click "Auto-Generate Aliases" button
- System creates unique aliases based on MCP name + endpoint name
- Example: `crypto_mcp_getCurrentPrice`, `weather_mcp_getForecast`

**Alias Validation**
- Must be unique within the role
- Cannot conflict with other aliases
- Real-time validation shows errors immediately

#### Enabling as Resource

Each endpoint can also be enabled as an MCP resource:

**Resource Toggle**
- Click "Enable as MCP Resource" checkbox
- Endpoint becomes readable via `resources/read` method
- Resource URI: `resource://{alias}`

**Use Cases for Resources:**
- Configuration data retrieval
- Static reference data
- Cached information
- Read-only endpoints

**Badge Indicators:**
- **Tool Only**: Default (callable tool)
- **Resource Only**: Only readable as resource
- **Tool + Resource**: Both callable and readable

### Step 5: Validation

The form performs real-time validation:

**Name Validation:**
- Checks for conflicts with existing MCPs and roles
- Shows error if name already exists

**Alias Validation:**
- Checks for duplicate aliases within role
- Shows error on conflicting alias field

**Endpoint Validation:**
- At least one endpoint required
- All endpoints must have valid aliases

### Step 6: Save

Click **Save** to create the role.

**What Happens:**
- Role is created with `PENDING` deployment status
- Backend validates all referenced MCPs exist
- Role appears in Roles list with "Pending" badge

### Step 7: Deploy

To activate the role, you must deploy it:

**From Roles List:**
1. Find your role in the list
2. Click the **Deploy** action button
3. System validates all referenced MCPs are deployed
4. Deployment status changes to `DEPLOYED`
5. Role MCP endpoint becomes active

**Deployment Validation:**
- All referenced MCPs must be deployed
- All selected endpoints must still exist
- System checks dependencies before deploying

**Role URL:**
After deployment, the role is accessible at:
```
http://localhost:8080/{tenantId}/role/{roleName}/mcp
```

Example:
```
http://localhost:8080/default/role/data-analyst-role/mcp
```

## Managing Roles

### Roles List View

The Roles list provides comprehensive management capabilities:

#### Dashboard Metrics
- **Total Roles**: Count of all roles
- **Deployed Roles**: Count of active roles
- **Total Tools**: Sum of all tools across roles
- **Healthy Roles**: Count of roles with all MCPs healthy

#### Role Actions

**View Role**
- See complete role configuration
- View all selected endpoints and aliases
- Check deployment status

**Edit Role**
- Modify description and version
- Add/remove endpoints
- Change aliases
- Toggle resource settings
- **Note**: Role name cannot be changed

**Duplicate Role**
- Create copy of existing role
- New role gets "-copy" suffix
- All endpoints and settings are copied
- Must deploy separately

**Deploy/Undeploy**
- Deploy: Activate role endpoint
- Undeploy: Deactivate role endpoint
- Deployment validates dependencies

**Delete Role**
- Permanently remove role
- Cannot be undone
- Must undeploy first if deployed

**Copy URL**
- Click to copy role MCP URL to clipboard
- Format: `http://localhost:8080/{tenantId}/role/{roleName}/mcp`

**Health Check**
- Real-time health monitoring for deployed roles
- Shows: Healthy Endpoints / Total Endpoints
- Click to see detailed per-endpoint health status

#### Bulk Operations

**Export Multiple Roles**
1. Enable selection mode
2. Select roles with checkboxes
3. Click "Export Selected"
4. Downloads ZIP with JSON files for each role

**Import Role**
1. Click "Import Role"
2. Select JSON file
3. System validates and checks for conflicts
4. Role is imported with all settings

#### Search and Filter
- Search by role name or description
- Filter by deployment status
- Sort by name, created date, or status

## Using Role-Based MCP Endpoints

### Connecting Clients

Configure your MCP client (Claude Desktop, custom client, etc.) to connect to the role endpoint:

**Claude Desktop Configuration**
```json
{
  "mcpServers": {
    "data-analyst-role": {
      "url": "http://localhost:8080/default/role/data-analyst-role/mcp"
    }
  }
}
```

**With Authentication (Header Forwarding)**
```json
{
  "mcpServers": {
    "data-analyst-role": {
      "url": "http://localhost:8080/default/role/data-analyst-role/mcp",
      "headers": {
        "Authorization": "Bearer your-token-here",
        "X-API-Key": "your-api-key"
      }
    }
  }
}
```

### Available MCP Methods

Role endpoints support standard MCP protocol methods:

#### `initialize`
Initialize connection to role endpoint.

**Request:**
```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "method": "initialize",
  "params": {
    "protocolVersion": "2024-11-05",
    "clientInfo": {
      "name": "example-client",
      "version": "1.0.0"
    }
  }
}
```

#### `tools/list`
List all tools aggregated in the role.

**Request:**
```json
{
  "jsonrpc": "2.0",
  "id": 2,
  "method": "tools/list"
}
```

**Response:**
```json
{
  "jsonrpc": "2.0",
  "id": 2,
  "result": {
    "tools": [
      {
        "name": "query_database",
        "description": "Execute SQL query on analytics database",
        "inputSchema": {
          "type": "object",
          "properties": {
            "query": {"type": "string"}
          },
          "required": ["query"]
        }
      },
      {
        "name": "generate_report",
        "description": "Generate analytics report",
        "inputSchema": {
          "type": "object",
          "properties": {
            "reportType": {"type": "string"},
            "dateRange": {"type": "string"}
          }
        }
      }
    ]
  }
}
```

#### `tools/call`
Call a tool by its alias.

**Request:**
```json
{
  "jsonrpc": "2.0",
  "id": 3,
  "method": "tools/call",
  "params": {
    "name": "query_database",
    "arguments": {
      "query": "SELECT COUNT(*) FROM users"
    }
  }
}
```

**Response:**
```json
{
  "jsonrpc": "2.0",
  "id": 3,
  "result": {
    "content": [
      {
        "type": "text",
        "text": "{\"count\": 12500}"
      }
    ]
  }
}
```

#### `resources/list`
List all resources available in the role.

**Request:**
```json
{
  "jsonrpc": "2.0",
  "id": 4,
  "method": "resources/list"
}
```

**Response:**
```json
{
  "jsonrpc": "2.0",
  "id": 4,
  "result": {
    "resources": [
      {
        "uri": "resource://config_data",
        "name": "config_data",
        "description": "System configuration data",
        "mimeType": "application/json"
      }
    ]
  }
}
```

#### `resources/read`
Read a resource by its URI.

**Request:**
```json
{
  "jsonrpc": "2.0",
  "id": 5,
  "method": "resources/read",
  "params": {
    "uri": "resource://config_data"
  }
}
```

**Response:**
```json
{
  "jsonrpc": "2.0",
  "id": 5,
  "result": {
    "contents": [
      {
        "uri": "resource://config_data",
        "mimeType": "application/json",
        "text": "{\"setting1\": \"value1\", \"setting2\": \"value2\"}"
      }
    ]
  }
}
```

#### `ping`
Health check for the role.

**Request:**
```json
{
  "jsonrpc": "2.0",
  "id": 6,
  "method": "ping"
}
```

**Response:**
```json
{
  "jsonrpc": "2.0",
  "id": 6,
  "result": {}
}
```

## Advanced Features

### Hierarchical Output Schema Control

Output schemas can be controlled at two levels:

**Role Level**
- Set via "Include Output Schema" toggle in Basic Information
- Applies to all endpoints in the role by default

**Endpoint Level**
- Each MCP endpoint has its own "Include Output Schema" setting
- Final decision: Both role AND endpoint settings must be true

**Use Cases:**
- Hide output schemas for simplified tool specifications
- Reduce payload size for bandwidth-constrained environments
- Control schema exposure per endpoint

### Authentication Pass-Through

All HTTP headers are forwarded to underlying MCPs:

**Supported Authentication Types:**
- Bearer tokens (JWT, OAuth2)
- API keys
- Basic authentication
- Custom headers

**How It Works:**
1. Client sends headers with MCP request
2. Role endpoint receives headers
3. Headers are forwarded to each underlying MCP
4. Each MCP validates using its configured auth method

**Example:**
```json
{
  "mcpServers": {
    "my-role": {
      "url": "http://localhost:8080/default/role/my-role/mcp",
      "headers": {
        "Authorization": "Bearer eyJ...",
        "X-API-Key": "api-key-123",
        "X-Tenant-ID": "tenant-456"
      }
    }
  }
}
```

### Health Monitoring

Role health is continuously monitored:

**Health Check Process:**
1. System checks each underlying MCP
2. Tests connectivity and authentication
3. Validates endpoint availability
4. Reports overall health status

**Health Indicators:**
- **Healthy**: All MCPs and endpoints operational
- **Degraded**: Some MCPs/endpoints unavailable
- **Unhealthy**: Role cannot function

**Viewing Health:**
- Real-time status in Roles list
- Detailed per-endpoint health in health view
- Shows: Healthy Endpoints / Total Endpoints

### Import/Export

**Export Single Role:**
1. Click "View" on role
2. Click "Export" button
3. Downloads JSON file

**Export Multiple Roles:**
1. Enable selection mode
2. Select roles
3. Click "Export Selected"
4. Downloads ZIP file

**Import Role:**
1. Click "Import Role" button
2. Select JSON file
3. System validates:
   - Schema format
   - Name conflicts
   - Referenced MCP availability
4. Role is created with imported settings
