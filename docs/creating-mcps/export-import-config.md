# Export and Import Configuration

MCPHub provides Universal Schema configuration export and import capabilities that allow you to share MCP configurations, create backups, and move configurations between environments or MCPHub instances.

## Overview

Universal Schema export/import functionality includes:
- **JSON Export**: Export configurations as Universal Schema JSON files
- **JSON Import**: Import existing Universal Schema JSON configurations
- **Bulk Export**: Export multiple configurations as a ZIP archive
- **File Upload**: Import configurations from JSON files
- **Environment Migration**: Move configurations between different MCPHub instances

## Exporting Configurations

### Single Configuration Export

#### From Configuration Editor
1. Open any MCP configuration in the editor
2. Copy the JSON content directly from the schema editor
3. Save the content to a `.json` file

#### Export Process
```json
{
  "mcpName": "payment-api",
  "description": "Payment processing API",
  "tenantId": "production",
  "userMetadata": {
    "version": "1.2.3"
  },
  "baseConfigs": {
    "rest": {
      "baseUrl": "https://api.example.com",
      "serviceName": "Payment Service"
    }
  },
  "endpoints": [
    {
      "name": "processPayment",
      "apiType": "rest",
      "method": "POST",
      "path": "/payments",
      "description": "Process a payment transaction"
    }
  ]
}
```

### Bulk Configuration Export

#### Multi-Select Export
1. Navigate to the MCP configurations list
2. Select multiple configurations using checkboxes
3. Click the **Export X MCPs** button
4. A ZIP file is automatically downloaded

#### Export Package Contents
The ZIP file contains:
- Individual JSON files for each selected configuration
- Filename format: `{mcpName}_v{version}.json`
- Example: `payment-api_v1.2.3.json`

#### Export Behavior
- **Complete Export**: All configuration data is exported
- **Version Specific**: Each version is exported as a separate file
- **No Sensitive Data**: User variable values are not included in exports
- **Tenant Context**: Original tenant ID is preserved

## Importing Configurations

### Universal Schema JSON Import

#### Accessing Import Feature
1. Navigate to the MCP configurations list
2. Click the **Import Schema** button
3. The import dialog opens

#### Import Methods

**Method 1: Paste JSON Content**
1. Paste Universal Schema JSON directly into the text area
2. Review the configuration
3. Click **Import Schema**

**Method 2: Upload JSON File**
1. Click **Upload JSON File** button
2. Select a `.json` file from your computer
3. The file content is loaded into the text area
4. Click **Import Schema**

#### Import Validation

The system validates:
- **JSON Format**: Valid JSON syntax
- **Required Fields**: Presence of `mcpName` and `endpoints`
- **Duplicate Check**: Prevents importing configurations that already exist
- **Version Conflicts**: Checks for existing versions with the same name

#### Import Process
```typescript
// Example validation and import
{
  "validation": {
    "jsonValid": true,
    "requiredFields": ["mcpName", "endpoints"],
    "duplicateCheck": "payment-api v1.2.3 already exists"
  },
  "import": {
    "status": "success",
    "mcpName": "payment-api-new",
    "endpointsCreated": 5,
    "variablesCreated": 3
  }
}
```

### Import Behavior

#### Configuration Creation
- **New Configuration**: Creates a completely new configuration
- **Tenant Assignment**: Uses current user's tenant context
- **Version Preservation**: Maintains original version if specified
- **Complete Import**: All endpoints, variables, and settings are imported

#### Import Results
Upon successful import:
- New configuration appears in the MCP list
- Configuration is saved but not deployed
- Success message shows import details
- Configuration can be immediately edited or deployed

## Configuration Format

### Universal Schema Structure

```json
{
  "mcpName": "string",
  "description": "string", 
  "tenantId": "string",
  "userMetadata": {
    "version": "string",
    "category": "string"
  },
  "userVariables": [
    {
      "name": "string",
      "description": "string",
      "type": "string|number|boolean|url|token",
      "required": boolean,
      "sensitive": boolean
    }
  ],
  "baseConfigs": {
    "rest": {
      "baseUrl": "string",
      "serviceName": "string",
      "auth": {
        "type": "static|jwt|oauth2",
        "headers": {},
        "jwtConfig": {},
        "oauth2Config": {}
      }
    },
    "grpc": {
      "serverUrl": "string",
      "serviceName": "string"
    }
  },
  "endpoints": [
    {
      "name": "string",
      "apiType": "rest|grpc",
      "method": "GET|POST|PUT|DELETE|PATCH",
      "path": "string",
      "description": "string",
      "enabled": boolean,
      "queryParameters": [],
      "pathParameters": [],
      "bodyParameters": []
    }
  ]
}
```

### Required Fields
- `mcpName`: Unique identifier for the MCP
- `endpoints`: Array of at least one endpoint
- `userMetadata.version`: Version identifier (recommended)

### Optional Fields  
- `description`: Human-readable description
- `userVariables`: Dynamic configuration variables
- `baseConfigs`: Protocol-specific base configurations
- `tenantId`: Tenant context (auto-assigned if missing)


