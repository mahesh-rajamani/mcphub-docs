# Your First MCP

Create your first Model Context Protocol server using MCPHub. This guide imports the [Swagger Petstore API](https://petstore3.swagger.io/) to demonstrate the complete OpenAPI import workflow.

## Prerequisites

- MCPHub running locally ([Quick Install](quick-install.md))
- Access to MCP Studio at http://localhost:3000

## Step 1: Access MCP Studio

1. **Open your web browser**
2. **Navigate to**: `http://localhost:3000`
3. **Verify**: You see the MCPHub Studio homepage with available MCPs

## Step 2: Import Swagger Petstore OpenAPI Specification

We'll import a working sample API to demonstrate the complete workflow:

1. **Click** the **"Create New MCP"** button
2. **Click** **"Import OpenAPI"** button
3. **Select** **"JSON Format"** tab (should be selected by default)
4. **Get the Petstore specification**:
   - Visit: `https://petstore3.swagger.io/api/v3/openapi.json`
   - Copy the entire JSON content from your browser
5. **Paste** the JSON content into the **"Or Paste Specification Content"** textarea
6. **Note**: We'll use the Swagger Petstore API, a reliable demo API with a complete OpenAPI specification
7. **Click** **"Configure Import"** button
8. **Wait** for the import to complete (you'll see configuration options)

## Step 3: Configure MCP Settings

After clicking "Configure Import", you'll see the configuration step:

### MCP Settings
1. **Review** the auto-detected **MCP Name**: Should be something like `petstore3-swagger-io-api`
2. **Update Description** if needed: "Swagger Petstore - OpenAPI 3.0"
3. **Click** **"Import & Preview"** to proceed

## Step 4: Review Imported Configuration

After configuration, you'll see the MCP configuration form pre-filled:

### Tab 1: Basic Info
Review the automatically filled fields:
- **MCP Name**: `swagger-petstore` (auto-generated from API)
- **Description**: `This is a sample Pet Store Server...` (from OpenAPI spec)
- **Version**: `1.0.26` (from OpenAPI spec)

### Tab 2: Protocol
1. **Click** the **"Protocol"** tab
2. **Verify** the base URL: `https://petstore3.swagger.io/api/v3`
3. **Check** the authentication section (should be "None" for public API)

## Step 5: Explore Imported Endpoints

1. **Click** the **"Endpoints"** tab (Tab 3)
2. **Review** the imported endpoints (you should see 19 pet store endpoints):
   - **Pet endpoints** (8): `findPetsByStatus`, `findPetsByTags`, `getPetById`, `updatePet`, `addPet`, etc.
   - **Store endpoints** (4): `getInventory`, `placeOrder`, `getOrderById`, `deleteOrder`
   - **User endpoints** (7): `createUser`, `loginUser`, `getUserByName`, `updateUser`, etc.
3. **Click** on **"findPetsByStatus"** endpoint to examine it
4. **Notice** the following details:
   - **Method**: `GET`
   - **Path**: `/pet/findByStatus`
   - **Description**: Finds Pets by status
   - **Parameters**: Query parameter `status` with enum values

## Step 6: Enhance Descriptions with AI Assist

MCPHub includes an AI-powered feature to improve endpoint and parameter descriptions for better tool calling performance:

### Using the AI Description Assistant

1. **Click** on any endpoint in the **"Endpoints"** tab (try **"findPetsByStatus"**)
2. **Look** for the **✨✨ (double sparkle)** icon next to description fields
3. **Click** the **✨✨** button next to the **"Description"** field
4. **Review** the AI-generated suggestions that appear
5. **Choose** a suggestion or modify it to your needs

### AI-Enhanced Description Example

**Original**: "Finds Pets by status"

**AI-Enhanced**: "Find pets in the store by their current availability status. Returns a list of pets filtered by adoption status (available for adoption, pending adoption, or already sold). Essential for browsing adoptable pets."

### Benefits of AI-Enhanced Descriptions

- **Better AI Tool Selection**: More detailed descriptions help AI models choose the right tools
- **Improved Parameter Understanding**: AI can better understand what values to provide
- **Enhanced User Experience**: Clear descriptions make testing and usage easier
- **Consistency**: AI maintains consistent tone and detail level across all endpoints

### Pro Tips

- Use AI assist on **both endpoint descriptions** and **parameter descriptions**
- The AI understands the context from your OpenAPI specification
- You can edit the AI suggestions before applying them
- Better descriptions lead to more accurate AI tool calling in tests

## Step 7: Create Your MCP Configuration

After enhancing descriptions and reviewing the imported configuration, you need to save it as an MCP:

1. **Review** your configuration one final time
2. **Click** the **"Create MCP"** button (usually at the bottom right of the form)
3. **Wait** for the success confirmation
4. **Note**: You should see a message like "MCP 'swagger-petstore' created successfully"
5. **Verify**: You're now redirected to the MCP list where you can see your new configuration

## Step 8: Deploy Your MCP

Now that your MCP configuration is created, you need to deploy it to the MCP Bridge:

1. **Click** the **"Deploy"** button (top right of main interface)
2. **In the deployment dialog**:
   - **Environment**: Select `Development`
   - **Target**: Keep default `Local Bridge (http://localhost:8080)`
3. **Click** **"Deploy Now"**
4. **Wait** for deployment confirmation (green checkmark or success message)
5. **Note**: Your MCP is now live at `http://localhost:8080/swagger-petstore/mcp`

## Step 9: Test Your Deployed MCP

Now let's test the deployed configuration:

1. **Click** the **"Test MCP"** button (top right)
2. **In the test interface**, verify:
   - **Available Tools**: Shows list of 19 pet store endpoints
   - **Tool count**: 19 tools available
3. **Confirm** your MCP is properly deployed and ready for AI testing

## Step 10: Configure AI Testing

Before testing AI integration, you need to set up your AI provider:

### Add OpenAI API Key
1. **In the test interface**, **locate** the **"AI Model Configuration"** section
2. **Select** **"OpenAI"** as your provider
3. **Enter** your **OpenAI API Key**:
   - Get your API key from [OpenAI Platform](https://platform.openai.com/api-keys)
   - Paste it in the **"API Key"** field
   - The key will be saved for this session
4. **Select** your **model** (recommended: `gpt-4` or `gpt-3.5-turbo`)
5. **Click** **"Save Configuration"** to store your settings

### Test AI Integration
1. **In the query box**, **type**: `"Show me all available pets"`
2. **Click** **"Send"**
3. **Watch** as the AI automatically:
   - Selects the correct tool (`findPetsByStatus`)
   - Sets the parameter (`status=available`)
   - Executes the API call
   - Returns a list of available pets with details

### Try More AI Queries

Test these natural language queries:
- `"Find pets that are pending adoption"`
- `"Show me sold pets"`
- `"Get details for pet ID 1"`
- `"Create a new user named John Smith"`
- `"Place an order for pet ID 5"`

## Step 11: Explore User Variables (Optional)

If your configuration uses dynamic variables:

1. **Click** the **"User Variables"** tab (Tab 5)
2. **Review** any variables that were imported or are needed
3. **Note**: The Petstore API doesn't require authentication, so this tab will likely be empty

## Step 12: Check Custom Tools (Optional)

For advanced functionality:

1. **Click** the **"Custom Tools"** tab (Tab 6)
2. **Note**: This tab allows adding custom Python/JavaScript tools
3. **Skip** for this tutorial as we're focusing on REST API endpoints

## Step 13: Customize Tool Descriptions

Improve the tool descriptions for better AI performance:

1. **Return** to the **"Endpoints"** tab (Tab 3)
2. **Click** on **"getPetById"** endpoint
3. **Edit** the **Description** field to be more specific:
   ```
   Retrieve detailed information about a specific pet using its unique ID number. Returns complete pet profile including name, category, photos, and adoption status.
   ```
4. **Edit** the **petId parameter description**:
   ```
   The unique identifier of the pet to retrieve. Must be a valid pet ID number from the store database.
   ```
5. **Click** **"Save Configuration"** to save changes

## Step 14: Configure User Creation Endpoint

Let's enhance the "createUser" endpoint for POST operations:

1. **Click** on **"createUser"** in the endpoints list
2. **Review** the configuration:
   - **Method**: `POST`
   - **Path**: `/user`
   - **Request body**: User object (JSON)
3. **Improve** the **description**:
   ```
   Create a new user account in the pet store system. This endpoint allows registration of new customers who can browse pets and place orders.
   ```
4. **Review** the **request body schema** in the **Schema Definition** tab (Tab 4) - it should include fields like:
   - `username`, `firstName`, `lastName`, `email`, `password`, `phone`


