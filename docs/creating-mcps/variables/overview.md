# User Variables

User Variables make your MCP configurations dynamic and reusable across different environments. Instead of hardcoding values like API keys or URLs, you can use variables that get filled in when testing or deploying your MCP.

## Step 1: Create User Variables

### Access the Variables Tab
1. **Open** your MCP configuration in MCP Studio
2. **Click** the **"Variables"** tab in the main navigation
3. **You'll see** an empty variables list with an **"Add Variable"** button

### Add Your First Variable
1. **Click** the **"Add Variable"** button
2. **A new variable form appears** with several fields to fill out

### Fill Out Variable Details

#### Variable Name
- **Type** a name using only letters, numbers, and underscores
- **Good examples**: `apiKey`, `environment`, `maxResults`, `webhookUrl`
- **Bad examples**: `api-key` (hyphens not allowed), `API Key` (spaces not allowed)

#### Description
- **Write** a clear explanation of what this variable is for
- **Be specific**: Instead of "API key", write "OpenAI API key for GPT-4 integration"
- **Include instructions**: "Get your key from https://platform.openai.com/api-keys"

#### Variable Type
**Select** from the dropdown:

- **String**: General text (usernames, environment names, descriptions)
- **Token**: Sensitive data like API keys, passwords, auth tokens
- **URL**: Website addresses, webhook URLs, API endpoints
- **Number**: Numeric values like limits, timeouts, port numbers
- **Boolean**: True/false values for feature flags or options

#### Required Field
- **Check this box** if the variable must have a value
- **Leave unchecked** if the variable is optional

#### Sensitive Field
- **Check this box** for secrets like API keys and passwords
- **Sensitive variables** will show as password fields when entering values
- **They're encrypted** in storage and hidden from logs

#### Default Value
- **Enter** a value to use when no other value is provided
- **Leave empty** for required variables
- **Use** for sensible defaults like `environment: "production"`

#### Example Value
- **Provide** a sample value to help users understand the format
- **For tokens**: `"sk-abc123..."`
- **For URLs**: `"https://api.example.com"`
- **For environments**: `"staging"`

### Save Your Variable
1. **Click** the **"Save"** button next to the variable
2. **The variable appears** in your variables list
3. **Repeat** for each variable you need

## Step 2: Use Variables in REST API Configuration

### Base URL with Variables
1. **Go to** the **"Protocol Basic Info"** tab
2. **In the "Base URL" field**, type your URL with variables:
   ```
   https://\{\{environment\}\}.api.example.com
   ```
3. **As you type** `\{\{`, you'll see a dropdown of available variables
4. **Select** the variable you want, and it completes to `\{\{environment\}\}`

### Headers with Variables
1. **Scroll down** to the **"Headers"** section
2. **Click** **"Add Header"** 
3. **For the header name**, type: `Authorization`
4. **For the header value**, type: `Bearer \{\{apiKey\}\}`
5. **Add another header**:
   - **Name**: `X-Environment`
   - **Value**: `\{\{environment\}\}`

### Advanced Header Usage
You can combine variables with text:
- **Header Value**: `Bearer \{\{apiKey\}\}-\{\{environment\}\}`
- **Header Value**: `https://\{\{webhookUrl\}\}/callback`

### Endpoint Paths with Variables

#### Dynamic Path Parameters
1. **Go to** the **"Endpoints"** tab
2. **Click** on any endpoint to edit it
3. **In the "Path" field**, use variables for dynamic parts:
   ```
   /users/\{\{userId\}\}/orders
   ```
4. **You can use multiple variables**:
   ```
   /\{\{apiVersion\}\}/tenants/\{\{tenantId\}\}/users
   ```

#### Query Parameter Defaults
1. **Scroll to** the **"Query Parameters"** section
2. **Click** **"Add Parameter"**
3. **Fill out**:
   - **Name**: `limit`
   - **Description**: `Maximum number of results`
   - **Type**: `number`
   - **Default Value**: `\{\{maxResults\}\}`

### Request Body Variables

#### For POST/PUT Endpoints
1. **Click** on a POST or PUT endpoint
2. **Scroll to** the **"Request Body"** section
3. **In the JSON schema**, use variables in default values:
   
   **In the "Properties" section, add a property**:
   - **Property Name**: `organization_id`
   - **Type**: `string`
   - **Default Value**: `\{\{organizationId\}\}`

#### Multiple Variables in Body
**Add more properties with variables**:
- **Property**: `created_by` → **Default**: `\{\{currentUser\}\}`
- **Property**: `webhook_url` → **Default**: `\{\{webhookUrl\}\}`
- **Property**: `max_retries` → **Default**: `\{\{maxRetries\}\}`

## Step 3: Use Variables in gRPC Configuration

### gRPC Server URL
1. **Go to** the **"Protocol Basic Info"** tab  
2. **In the "gRPC Server URL" field**, type:
   ```
   \{\{grpcHost\}\}:\{\{grpcPort\}\}
   ```
3. **This allows** different hosts and ports for different environments

### gRPC Message Field Defaults
1. **Click** on any gRPC endpoint (like CreatePerson)
2. **In the "Request Message" section**, find the fields
3. **For each field**, you can set a **"Default Value"**:
   - **Field**: `tenant_id` → **Default Value**: `\{\{tenantId\}\}`
   - **Field**: `created_by` → **Default Value**: `\{\{currentUser\}\}`

### gRPC Authentication Headers
1. **In the "Headers" section**, add authentication:
   - **Name**: `authorization` → **Value**: `Bearer \{\{grpcToken\}\}`
   - **Name**: `x-api-key` → **Value**: `\{\{grpcApiKey\}\}`

## Step 4: Advanced Variable Definition Syntax

### Using \{\{token\}\} in Default Values
You can reference other variables in your default values:

1. **Create a base token variable**:
   - **Name**: `baseToken`
   - **Type**: `token`
   - **Sensitive**: ✓

2. **Create a derived variable**:
   - **Name**: `authHeader`
   - **Type**: `string`  
   - **Default Value**: `Bearer \{\{baseToken\}\}`

3. **Use the derived variable** in headers:
   - **Header Name**: `Authorization`
   - **Header Value**: `\{\{authHeader\}\}`

### Complex Variable Combinations
**You can combine multiple variables**:
- **Variable Name**: `fullApiUrl`
- **Default Value**: `https://\{\{environment\}\}.\{\{serviceName\}\}.com/\{\{apiVersion\}\}`

**Then use it as**:
- **Base URL**: `\{\{fullApiUrl\}\}`

### Environment-Specific Tokens
**Create environment-aware tokens**:
- **Variable Name**: `environmentToken`
- **Default Value**: `\{\{environment\}\}-\{\{baseToken\}\}`

## Step 5: Test Your Variables

### Open the Test Interface
1. **Click** the **"Test MCP"** button (top right)
2. **You'll see** a **"User Variables"** section on the right side
3. **All your variables** appear as input fields

### Variable Input Types
**Different variable types show different inputs**:
- **String variables**: Regular text boxes
- **Token variables**: Password fields (dots instead of text)
- **Boolean variables**: Checkboxes
- **Number variables**: Number input boxes
- **URL variables**: Text boxes with URL validation

### Fill in Test Values
**Enter values for your variables**:
- `apiKey`: `sk-test-abc123xyz789`
- `environment`: `staging`
- `maxResults`: `50`
- `userId`: `user-123`
- `tenantId`: `tenant-abc`

### Watch Variables Work
1. **Select an endpoint** to test
2. **Look at** the **"Request Preview"** section
3. **You'll see** how variables are replaced:
   - URL becomes: `https://staging.api.example.com/v1/users/user-123`
   - Headers show: `Authorization: Bearer sk-test-abc123xyz789`

## Step 6: Environment-Specific Setup

### Development Environment
**In the test interface, use**:
- `environment`: `dev`
- `apiKey`: `sk-dev-123`
- `grpcHost`: `localhost`
- `grpcPort`: `50051`
- `maxResults`: `10`

### Staging Environment
**Change values to**:
- `environment`: `staging`
- `apiKey`: `sk-staging-456`
- `grpcHost`: `staging-grpc.example.com`
- `grpcPort`: `443`
- `maxResults`: `100`

### Production Environment
**Use production values**:
- `environment`: `production`
- `apiKey`: `sk-prod-789`
- `grpcHost`: `grpc.example.com` 
- `grpcPort`: `443`
- `maxResults`: `1000`

## Step 7: Best Practices

### Mark Sensitive Variables
**For any variable containing secrets**:
1. **Check** the **"Sensitive"** checkbox
2. **This makes them**:
   - Show as password fields
   - Get encrypted in storage
   - Stay hidden from logs
   - Don't appear in exports

### Use Descriptive Names
**Good variable names**:
- `slackWebhookToken` (specific purpose)
- `databasePassword` (clear what it's for)
- `openaiApiKey` (identifies the service)
- `stripeTestKey` (includes environment context)

**Bad variable names**:
- `token` (too generic)
- `key` (unclear purpose)
- `secret` (not descriptive)

### Write Helpful Descriptions
**Instead of**: "API key"  
**Write**: "OpenAI API key for GPT-4 integration. Get yours at https://platform.openai.com/api-keys"

**Instead of**: "Database URL"  
**Write**: "PostgreSQL connection URL including username and password. Format: postgresql://user:pass@host:port/dbname"