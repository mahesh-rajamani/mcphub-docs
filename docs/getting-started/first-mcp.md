# Your First MCP

Create your first Model Context Protocol server using MCPHub. This guide imports the [National Weather Service API](https://www.weather.gov/documentation/services-web-api) to demonstrate the complete OpenAPI import workflow.

## Prerequisites

- MCPHub running locally ([Quick Install](quick-install.md))
- Access to MCP Studio at http://localhost:3000 (if deployed using Docker) or your Render.com URL

## Step 1: Access MCP Studio

1. **Open your web browser**
2. **Navigate to**: `http://localhost:3000`
3. **First Time Setup**: If this is your first time accessing MCPHub Studio, you'll see a Welcome dialog that guides you through initial configuration:
   - Backend URL: Should be auto-detected and preloaded. In case of "mcphub-all" image deployed locally in Docker, the backend URL needs to be `http://localhost:3000`. Test the connection by clicking the **Test** button
   - Set up tenant ID (auto-generated UUID)
   - Configure AI model settings (optional)

   > **See**: [Initial Configuration: Welcome Workflow](../creating-mcps/settings-widget.md#initial-configuration-welcome-workflow) for detailed setup instructions.

4. **Verify**: After setup, you'll see the MCPHub Studio homepage with available MCPs

## Step 2: Import National Weather Service OpenAPI Specification

We'll import the National Weather Service API using the import wizard:

1. **Click** the **"Create New MCP"** button
2. **Select** **"REST API"**
3. **Select** **"Import from Specification"**
4. **Select** **"JSON Format"** tab (should be selected by default)
5. **Get the Weather API specification**:
   - Visit: `https://api.weather.gov/openapi.json`
   - Copy the entire JSON content from your browser
6. **Paste** the JSON content into the **"Or Paste Specification Content"** textarea
7. **Click** **"Configure"** to preview the API name and information
8. **Review** the auto-detected API information:
   - MCP Name (e.g., `weather-gov-api`)
   - Description: "weather.gov API" (auto-extracted from OpenAPI spec)
9. **Click** **"Preview"** to preview the endpoints
10. **Review** the imported endpoints (weather alerts, forecasts, observations, etc.)
11. **Click** **"Import"** to complete the import
12. **Click** **"Save Configuration"** to save your MCP configuration

## Step 3: Deploy Your MCP

Now that your MCP configuration is created, you need to deploy it to the MCP Bridge:

1. **Click** the **"Action"** button dropdown
2. **Select** **"Deploy"** from the dropdown menu
3. **In the deployment dialog**, **click** **"Deploy"**
4. **Wait** for deployment confirmation (green checkmark or success message)

## Step 4: Test Your Deployed MCP with Claude Desktop

Now let's test the deployed weather API configuration with Claude Desktop:

### Get Your MCP Configuration URL

1. **Click** the **"Action"** button dropdown
2. **Select** **"Copy URL"** option
3. **Note** the MCP URL format: `http://base_url/{tenant}/{mcp-name}/mcp`
   - Example: `http://localhost:3000/system/weather-gov-api/mcp`
   - The URL includes your tenant ID and MCP name
4. **Get** the API key (Base64-encoded credentials) as defined in the [Quick Install](quick-install.md) section
   - Use your username and password from the installation
   - Example: `admin:admin123` encodes to `YWRtaW46YWRtaW4xMjM=`

### Download and Install Claude Desktop

1. **Download** Claude Desktop from [claude.ai/download](https://claude.ai/download)
2. **Install** the application on your computer
3. **Launch** Claude Desktop

### Configure MCP Server

1. **Open** Claude Desktop settings
2. **Navigate** to the **"Developer"** section
3. **Click** **"Edit Config"**
4. **Add** your MCP configuration to the `claude_desktop_config.json` file:

```json
{
  "mcpServers": {
    "Weather-api": {
      "command": "npx",
      "args": [
        "mcp-remote",
        "http://localhost:3000/system/weather-gov-api/mcp",
        "--header",
        "Authorization: Basic YWRtaW46YWRtaW4xMjM="
      ]
    }
  }
}
```

> **Note**: Replace `YWRtaW46YWRtaW4xMjM=` with your Base64-encoded credentials (admin:your_password). You can generate this using:
> ```bash
> echo -n "admin:admin123" | base64
> ```

5. **Save** the configuration file
6. **Restart** Claude Desktop to load the MCP server

### Test the Weather API

1. **Ask Claude** a weather-related question, such as:
   - "What are the current weather alerts for California?"
   - "Get weather forecast information for New York City"
   - "Are there any weather alerts in Texas?"
2. **Observe** Claude using the weather MCP tools to retrieve real-time data
3. **Verify** the MCP integration is working correctly
