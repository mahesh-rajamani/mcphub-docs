# Export and Import Configuration

MCPHub allows you to export MCP configurations as JSON files and import them to share configurations, create backups, or move configurations between environments.

## Exporting MCP Configurations

### Export Selected Configurations

Export one or more MCP configurations:

1. **Navigate to MCP List**: Go to the main MCP configurations screen
2. **Select MCPs**: Click the checkboxes next to the MCPs you want to export
   - Select one MCP to export a single configuration
   - Select multiple MCPs to export several configurations at once
3. **Click Export Button**: Click the **"Export X MCPs"** button that appears at the top
   - Shows "Export 1 MCPs" for single configuration
   - Shows "Export 2 MCPs", "Export 3 MCPs", etc. for multiple configurations
4. **ZIP Downloaded**: A ZIP file containing all selected configurations is downloaded

**Export File Contents:**
- Individual JSON files for each selected MCP
- Filename format: `{mcpName}_v{version}.json`
- Example: `payment-api_v1.2.3.json`
- ZIP filename: `mcp-configurations-{date}.zip`

**Note:** Even when exporting a single MCP, the download is a ZIP file containing one JSON file.

### What Gets Exported

When you export an MCP configuration:

- ✅ **Complete Configuration**: All endpoints, user variables, protocol settings, and metadata
- ✅ **Tenant ID**: The tenant ID is included in the export
- ✅ **Version Information**: Version number and metadata
- ✅ **Authentication Config**: Authentication type and settings (OAuth, JWT, etc.)
- ❌ **Variable Values**: User variable values (like API keys, tokens) are NOT exported for security

## Importing MCP Configurations

### Import from JSON

Import an MCP configuration from a Universal Schema JSON file:

1. **Navigate to MCP List**: Go to the main MCP configurations screen
2. **Click Import Button**: Click the **"Import Schema"** button
3. **Choose Import Method**:

   **Option A: Paste JSON**
   - Paste the Universal Schema JSON content into the text area
   - Click **"Import Schema"**

   **Option B: Upload File**
   - Click **"Upload JSON File"**
   - Select a `.json` file from your computer
   - The content is loaded automatically
   - Click **"Import Schema"**

4. **Import Completes**: The configuration is imported and appears in your MCP list

### Important: Tenant ID Matching

⚠️ **Tenant ID Requirement**

When importing an MCP configuration, the **tenant ID in the JSON file must match your currently configured tenant ID**.

- **Export includes tenant ID**: When you export a configuration, the tenant ID is saved in the JSON
- **Import validates tenant**: During import, the system checks if the tenant ID matches your current tenant setting
- **Mismatch handling**: If the tenant IDs don't match, you need to either:
  - Change your current tenant ID in Settings to match the export
  - Edit the JSON file to change the `tenantId` field to match your current tenant

**Example:**

```json
{
  "mcpName": "payment-api",
  "tenantId": "production",  // <-- This must match your current tenant
  "description": "Payment processing API",
  ...
}
```

If your current tenant is "default" but the JSON has "production", the import will fail. You must update either:
- Your tenant setting: Go to Settings → Change Tenant ID to "production"
- The JSON file: Edit `"tenantId": "production"` to `"tenantId": "default"`

### Import Validation

The system validates your import:

- ✅ **JSON Format**: Must be valid JSON syntax
- ✅ **Required Fields**: Must have `mcpName` and `endpoints`
- ✅ **Tenant Match**: Tenant ID must match your current tenant
- ✅ **Duplicate Check**: Prevents importing if the same MCP name and version already exist

### After Import

Once imported successfully:

- **Saved Configuration**: The MCP appears in your configurations list
- **Not Deployed**: Configuration is saved but not automatically deployed
- **Ready to Use**: You can edit, deploy, or test the configuration immediately
- **Variables Need Values**: If the configuration has user variables, you'll need to provide values before deploying
