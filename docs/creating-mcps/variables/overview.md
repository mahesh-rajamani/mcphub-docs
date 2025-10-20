# User Variables

User Variables make your MCP configurations dynamic and reusable across different environments. Instead of hardcoding values like API keys or URLs, you can use variables that get filled in when testing or deploying your MCP.

## Step 1: Create User Variables

### Access the User Variables Tab
1. **Open** your MCP configuration in MCP Studio
2. **Click** the **"User Variables"** tab in the main navigation
3. **You'll see** an empty variables list with an **"Add Variable"** button

### Add Your First Variable
1. **Click** the **"Add Variable"** button in the top right
2. **A new variable card appears** in the list
3. **Click** the card to expand it and see all configuration fields

### Fill Out Variable Details

#### Variable Name
- **Type** a name using only letters, numbers, and underscores
- **Must start** with a letter or underscore (not a number)
- **Good examples**: `apiKey`, `environment`, `maxResults`, `webhookUrl`, `_privateToken`
- **Bad examples**: `api-key` (hyphens not allowed), `API Key` (spaces not allowed), `1stToken` (starts with number)
- **Usage hint**: Variables are used as `{{variableName}}` in URLs, headers, and request bodies

#### Description
- **Write** a clear explanation of what this variable is for
- **Be specific**: Instead of "API key", write "OpenAI API key for GPT-4 integration"
- **Include instructions**: "Get your key from https://platform.openai.com/api-keys"
- **Use AI assistance**: Click the sparkle icon (✨) to generate a description automatically

#### Variable Type
**Select** from the dropdown:

- **String**: General text (usernames, environment names, descriptions)
- **Number**: Numeric values like limits, timeouts, port numbers
- **Boolean**: True/false values for feature flags or options
- **URL**: Website addresses, webhook URLs, API endpoints
- **Token**: Sensitive data like API keys, passwords, auth tokens
- **Certificate**: X.509 certificates and private keys in PEM format (auto-encrypted)

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
- **For Certificate type**: Provide PEM format certificate/key data

#### If Not Exist Toggle
- **Check this box** to only apply this variable if the AI model doesn't provide a value for the field
- **By default**, user variables always override model parameters
- **Use** for fallback values when the model may provide its own data

### Managing Variables
1. **Variables appear** in collapsible cards showing type, name, and description
2. **Click** a variable card to expand and edit its details
3. **Variables display badges** indicating:
   - Type (String, Number, Boolean, etc.)
   - Required status
   - Sensitive status
   - Certificate auto-encryption
   - If Not Exist condition
4. **Delete** variables using the trash icon on each card
5. **All changes are saved** when you save the MCP configuration

### AI-Powered Description Generation
1. **Click** the sparkle icon (✨) next to the Description field
2. **AI analyzes** the variable name, type, and settings to generate a helpful description
3. **Review** the suggested description
4. **Click "Apply"** to use the suggestion or edit it further
5. **This helps** create clear, consistent documentation for your variables

### Certificate Variables
Certificate type variables have special features:
- **Auto-encrypted**: Certificate data is automatically encrypted when stored, regardless of the sensitive setting
- **PEM format**: Designed for X.509 certificates and private keys in PEM format
- **Upload support**: During deployment, you can upload certificate files which will be read and stored securely
- **Use cases**: SOAP WS-Security, X.509 authentication, SSL/TLS client certificates
- **Displayed badge**: Shows "Auto-Encrypted" badge in the variable card

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
- **Number variables**: Number input boxes
- **Boolean variables**: Checkboxes
- **URL variables**: Text boxes with URL validation
- **Token variables**: Password fields (dots instead of text) with show/hide toggle
- **Certificate variables**: Text boxes for PEM format data with file upload support

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