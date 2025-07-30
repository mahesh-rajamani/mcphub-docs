# Versioning and Configuration Merge

MCPHub provides versioning and merge capabilities that enable basic configuration management workflows. This system supports semantic versioning and visual diff/merge operations for configuration management.

## Overview

The versioning and merge system provides:
- **Semantic Versioning**: Basic semantic versioning with automatic patch increment
- **Multiple Versions**: Store multiple versions of the same MCP configuration
- **Visual Diff Viewer**: Compare configurations side-by-side
- **Configuration Merging**: Create merged configurations from differences
- **Deployment Management**: Deploy specific versions independently

## Version Management

### Version Structure

MCPHub uses semantic versioning with the format `MAJOR.MINOR.PATCH`:

- **Major (1.x.x)**: Breaking changes
- **Minor (x.1.x)**: New features 
- **Patch (x.x.1)**: Bug fixes and improvements

Each MCP configuration includes version information in its metadata:

```json
{
  "mcpName": "payment-api",
  "userMetadata": {
    "version": "1.2.3"
  }
}
```

### Creating New Versions

#### Automatic Patch Increment

When you create a new version of an existing configuration:

1. Navigate to the MCP configurations list
2. Click the **More Actions** (⋮) button next to the desired MCP
3. Select **Create New Version** from the dropdown menu
4. Confirm the version creation

The system automatically increments the patch version:
- `1.0.0` → `1.0.1`
- `1.2.5` → `1.2.6`
- `custom-v1` → `custom-v1.1`

#### Version Creation Behavior

- **Full Copy**: Creates a complete copy of the configuration
- **Independent Management**: New version can be edited independently
- **Same MCP Name**: Maintains the same name with different version
- **Unique Deployment**: Only one version can be deployed at a time

### Multiple Version Support

MCPHub supports storing multiple versions of the same MCP:

#### Version Display
- **Version Badges**: UI shows version information for each configuration
- **Multiple Versions Indicator**: Badge shown when multiple versions exist
- **Deployment Status**: Clear indication of which version is deployed

#### Version Management
- **Edit Restriction**: Cannot edit deployed versions (must undeploy first)
- **Independent Testing**: Each version can be tested independently
- **Version-Specific Deployment**: Deploy any saved version

## Configuration Comparison and Merge

### Diff Viewer

MCPHub provides a visual diff viewer for comparing configurations:

#### Accessing the Diff Viewer

1. Navigate to the MCP configurations list
2. Select exactly 2 configurations using the checkboxes
3. Click the **Diff & Merge** button
4. The diff viewer opens in a modal dialog

#### Diff Viewer Features

- **Side-by-Side Comparison**: Shows configurations side by side
- **JSON Highlighting**: Syntax highlighting for better readability
- **Difference Highlighting**: 
  - Red highlighting for removed content
  - Green highlighting for added content
- **Expandable Sections**: Collapsible JSON sections for easy navigation

### Configuration Merging

#### Creating Merged Configurations

1. Open the diff viewer with two selected configurations
2. Review the differences between configurations
3. Edit the merged configuration in the bottom panel
4. Provide a new name for the merged configuration
5. Click **Save Merged Configuration**

#### Merge Behavior

- **Manual Merging**: All merging is done manually by the user
- **New Configuration**: Creates a new configuration (doesn't modify originals)
- **Full JSON Edit**: Complete control over the merged configuration
- **Validation**: Basic JSON validation before saving

### Use Cases

#### Version Comparison

Compare different versions of the same MCP:
- Identify changes between versions
- Understand evolution of configuration
- Review impact of modifications

#### Configuration Consolidation

Merge features from different configurations:
- Combine endpoints from multiple MCPs
- Merge variable definitions
- Consolidate authentication configurations

#### Template Creation

Create template configurations:
- Start with existing configurations
- Merge common patterns
- Create reusable templates


