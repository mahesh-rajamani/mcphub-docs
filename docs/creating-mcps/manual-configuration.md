# MCP Configuration

Create configurations for different API endpoints using MCPHub Studio's tabbed interface. This guide walks you through each tab in the exact order they appear in the application.

This page explains the different tabs of MCP configuration. If you have an API specification file (OpenAPI, Proto, WSDL, GraphQL schema), use the [Import using API specification](import-methods.md) option instead for faster setup.

## Configuration Tab Structure

MCPHub Studio organizes MCP configuration into six tabs that you complete from left to right:

1. **Basic Info** - Fundamental MCP information
2. **Protocol** - API protocol and authentication setup
3. **User Variables** - Dynamic configuration variables
4. **Schema Definition** - Message schemas and data structures
5. **Endpoints** - Individual API endpoint definitions
6. **Custom Tools** - Specialized tools and custom functionality

---

## Tab 1: Basic Info

Start by providing essential information about your MCP server.

### Required Fields

**MCP Name**
- Enter a unique identifier for your MCP server
- Use lowercase letters, numbers, and hyphens only
- Example: `user-management-api`

**Description**
- Provide a clear description of what your MCP server does
- This helps AI models understand the purpose of your tools
- Example: "Manages user profiles and authentication for the customer portal"

**Version**
- Version identifier for your MCP configuration
- Used for versioning MCP configurations
- Example: `1.0.0`, `2.1.0`

---

## Tab 2: Protocol

Configure protocol-specific settings and authentication.

### REST Protocol Configuration

**Base URL** *
- Enter your API's base URL
- Supports variable substitution: `https://api.{{environment}}.example.com`
- Example: `https://api.mycompany.com/v1`

**API Call Headers**
- Add custom headers that will be included in all API calls
- Key-value pairs with variable substitution support
- Example: `X-Project-Id: {{projectId}}` where `{{projectId}}` is a user variable
- Use the "+ Add Header" button to add multiple headers

**Include Output Schema**
- Toggle to include response schemas in MCP tool definitions by default
- Helps AI models understand expected response structures

**Authentication**
- Configure authentication for your REST API
- See [Authentication Configuration](#authentication-configuration) below for detailed options

### gRPC Protocol Configuration

**Server Address** *
- Enter your gRPC server address and port
- Supports variable substitution: `grpc.{{environment}}.example.com:443`
- Example: `grpc.example.com:443`

**Package Name**
- The protobuf package name for the gRPC services
- Example: `com.example.api`

**gRPC Metadata**
- Add metadata that will be included in all gRPC calls (similar to HTTP headers)
- Key-value pairs with variable substitution support
- Example: `x-project-id: {{projectId}}` where `{{projectId}}` is a user variable
- Use the "+ Add Metadata" button to add multiple entries

**Include Output Schema**
- Toggle to include response schemas in MCP tool definitions by default
- Helps AI models understand expected response structures

**Authentication**
- Configure authentication for your gRPC service
- See [Authentication Configuration](#authentication-configuration) below for detailed options

### GraphQL Protocol Configuration

**GraphQL Endpoint** *
- Enter your GraphQL API endpoint URL
- Supports variable substitution: `https://api.{{environment}}.example.com/graphql`
- Example: `https://api.example.com/graphql`

**API Call Headers**
- Add custom headers that will be included in all GraphQL calls
- Key-value pairs with variable substitution support
- Example: `X-Project-Id: {{projectId}}` where `{{projectId}}` is a user variable
- Use the "+ Add Header" button to add multiple headers

**Include Output Schema**
- Toggle to include response schemas in MCP tool definitions by default
- Helps AI models understand expected response structures

**Authentication**
- Configure authentication for your GraphQL API
- See [Authentication Configuration](#authentication-configuration) below for detailed options

### SOAP Protocol Configuration

**Service Endpoint URL** *
- The actual SOAP service endpoint URL where requests are sent
- Example: `http://localhost:7013/PersonService`

**Target Namespace**
- XML namespace for SOAP service operations
- Auto-populated from WSDL during import
- Example: `http://example.com/api`

**SOAP Version**
- Select the SOAP protocol version for the entire service
- Options: SOAP 1.1 (default) or SOAP 1.2

**SOAP Call Headers**
- Add headers that will be included in all SOAP calls
- Each header can be placed in two locations:
  - **HTTP Header**: Standard HTTP header
  - **SOAP Header**: Embedded in SOAP envelope
- Key-value pairs with variable substitution support
- Example: `SOAPAction: urn:example#{{operation}}` where `{{operation}}` is a user variable
- Use the "+ Add Header" button to add multiple entries

**Include Output Schema**
- Toggle to include response schemas in MCP tool definitions by default
- Helps AI models understand expected response structures

**Authentication**
- Configure authentication for your SOAP service
- Supports X.509 WS-Security in addition to standard authentication methods
- See [Authentication Configuration](#authentication-configuration) below for detailed options

### Authentication Configuration

**Authentication Type Options:**

**None**
- No authentication required
- Use for public APIs or when authentication is handled elsewhere

**Static Headers**
- Simple API key or custom header authentication
- Add headers like `Authorization: Bearer {{apiKey}}`
- Headers support variable substitution

**JWT Authentication**
- Click "Configure JWT" to set up JWT-based authentication
- Choose between username/password or client credentials flow
- Automatic token refresh and secure storage

**OAuth 2.0**
- Click "Configure OAuth2" for OAuth 2.0 authentication
- Supports authorization code and client credentials flows
- Works with any OAuth2-compliant provider (Auth0, Keycloak, AWS Cognito, etc.)
- Automatic PKCE and state parameter handling

**Header Forwarding**
- Forward authentication headers from MCP clients
- Useful for pass-through authentication scenarios

See [Authentication](authentication.md) for detailed configuration instructions.

---

## Tab 3: User Variables

Set up dynamic variables used in your API configuration. These variables are provided during service deployment time and allow flexible configurations across different environments.

### Overview

User variables are dynamic configuration values referenced throughout your MCP using the `{{variableName}}` syntax. They enable you to create portable configurations that can be deployed to different environments without modifying the core definition.

### Variable Configuration

**Variable Name** * (required)
- Must be a valid identifier (letters, numbers, underscore)
- Use descriptive names: `apiEnvironment`, `projectId`, `jwtClientId`
- Reference in configurations using `{{variableName}}`
- Example pattern: `apiToken`, `environment`, `client_id`

**Type** (dropdown)
- Select the variable type - determines validation and how the value is handled:
  - **String**: General text values (API keys, usernames, environment names)
  - **Number**: Numeric values with validation (port numbers, limits, timeouts)
  - **Boolean**: True/false flags (feature toggles, debug modes)
  - **URL**: URLs with format validation (base URLs, webhook endpoints)
  - **Token**: Sensitive values masked in logs (passwords, secrets, tokens)
  - **Certificate**: X.509 certificates/keys in PEM format, automatically encrypted, used in SOAP WS-Security

**Description**
- Explain what the variable is used for
- Helps users understand configuration requirements
- Use the AI Assist button (✨) for auto-generated descriptions

**Default Value**
- Set default values for optional variables
- Reduces configuration overhead during deployment
- For Certificate type: Provide PEM format certificate/key data
- Sensitive values are masked with password field and eye icon toggle

**Required Toggle**
- Mark variables as required or optional
- Required variables must be provided during deployment
- Optional variables use default value if not provided

**Sensitive Toggle**
- Mark variables as sensitive (e.g., passwords, tokens)
- Sensitive values are masked in logs and UI
- Password field with visibility toggle for secure entry

**If Not Exist Toggle**
- Conditional application: only apply if value is not provided during deployment
- Default behavior: user variables always override model parameters
- Useful for fallback values when model may provide its own data

### Using Variables

Variables can be used throughout your MCP configuration:

**In URLs**: `https://api.{{environment}}.example.com`
**In Headers**: `X-Project-Id: {{projectId}}`
**In Paths**: `/{{apiVersion}}/users`
**In Parameters**: `region={{defaultRegion}}`

See [User Variables](variables/overview.md) for detailed configuration instructions.

---

## Tab 4: Schema Definition

Define reusable message schemas and complex data structures for your MCP. The Schema Definition tab provides a powerful visual interface for creating type-safe message definitions that work across REST, gRPC, GraphQL, and SOAP protocols.

### Overview

Message definitions serve as reusable data structure templates that can be referenced by endpoints for request bodies, response schemas, and complex parameters. MCPHub uses a unified schema system that works seamlessly across all supported protocols.

**Key Features:**
- **Protocol-agnostic**: Define once, use across REST, gRPC, GraphQL, and SOAP
- **Type safety**: Strong typing with validation ensures data integrity
- **Reusability**: Reference messages across multiple endpoints
- **AI-powered**: Get intelligent description suggestions
- **Auto-import**: Automatically import from Proto files, WSDL, GraphQL schemas, and OpenAPI specs

### Message Types

MCPHub supports two fundamental message types:

#### Simple Messages

Regular messages with defined fields - the most common message type for standard data structures.

**Use cases:**
- User profiles, product information, order details
- Request/response bodies for REST APIs
- gRPC message types from .proto files
- GraphQL types and input objects
- SOAP complex types

**Example:** A `Person` message with fields like `name`, `age`, `email`

#### Composition Messages

Advanced messages that combine multiple message types using composition patterns (oneOf, anyOf, allOf). These are used for polymorphic data, union types, and complex inheritance scenarios.

**Use cases:**
- Polymorphic responses (e.g., different payment methods)
- Union types (e.g., a field that can be multiple types)
- SOAP extension inheritance with xsi:type
- GraphQL union types and interfaces
- OpenAPI oneOf/anyOf/allOf schemas

**Example:** A `PaymentMethod` composition with oneOf `[CreditCard, BankTransfer, PayPal]`

---

### Creating Simple Messages

Click **"Create Message"** under the Simple Messages tab to create a new simple message.

#### Message Configuration

**Message Name** * (required)
- Unique identifier for this message type
- Use PascalCase convention: `UserProfile`, `OrderDetails`, `ProductInfo`
- Must be unique across all message definitions
- Example: `Person`, `Address`, `PaymentInfo`

**Description**
- Explain what this message represents
- Helps AI models understand data structure purpose
- Click the sparkle icon (✨) for AI-generated descriptions
- Example: "Represents a user's complete profile information including personal details and preferences"

**Message-Level Flags:**

**Additional Properties**
- ☑️ Enable to allow arbitrary additional properties beyond defined fields
- Useful for flexible JSON schemas that accept dynamic keys
- Maps to OpenAPI `additionalProperties: true`
- Cannot be used together with Entry Type (Map Data)
- Example: Configuration objects with user-defined keys

**Entry Type (Map Data)** *(REST & gRPC only)*
- ☑️ Enable to mark this message as a map entry pattern
- Automatically creates `key` and `value` fields
- Used for dictionary/map data structures
- Supported in REST JSON and gRPC protobuf protocols
- Example: `PersonEntry` for `map<string, Person>` in protobuf or `Record<string, Person>` in TypeScript

---

### Working with Fields

Each simple message contains fields that define its structure.

#### Adding Fields

Click **"Add Field"** to create a new field in your message.

#### Field Configuration

**Field Name** * (required)
- Name of the field
- Use camelCase or snake_case consistently
- Example: `firstName`, `email`, `phoneNumber`

**Field Type** * (required)

Select from the following unified field types:

| Type | Description | Example |
|------|-------------|---------|
| **String** | Text values | `"John Doe"`, `"hello@example.com"` |
| **Integer** | Whole numbers | `42`, `-10`, `0` |
| **Number** | Decimal numbers | `3.14`, `-0.5`, `100.99` |
| **Boolean** | True/false values | `true`, `false` |
| **Object** | Reference to another message | References `Address` message |
| **Date Time** | ISO 8601 timestamps | `"2024-01-15T10:30:00Z"` |
| **UUID** | Universally unique identifiers | `"550e8400-e29b-41d4-a716-446655440000"` |
| **Binary** | Binary data (base64 encoded) | File uploads, images |

**Proto Type** *(gRPC only)*

When using gRPC protocol, you can specify the protobuf-specific type:

| Proto Type | Unified Type | Description |
|------------|--------------|-------------|
| `string` | STRING | UTF-8 text |
| `int32` | INTEGER | 32-bit signed integer |
| `int64` | INTEGER | 64-bit signed integer |
| `uint32` | INTEGER | 32-bit unsigned integer |
| `uint64` | INTEGER | 64-bit unsigned integer |
| `bool` | BOOLEAN | Boolean value |
| `float` | NUMBER | 32-bit floating point |
| `double` | NUMBER | 64-bit floating point |
| `bytes` | BINARY | Arbitrary byte sequence |

**Field Number** *(gRPC only)*
- Unique identifier for this field in protobuf
- Must be unique within the message
- Auto-increments when adding new fields
- Example: `1`, `2`, `3`

**Field Options:**

- **Repeated** ☑️ - Field is an array/list of values
  - Example: `tags` as repeated string becomes `["tag1", "tag2"]`
  - gRPC: Maps to `repeated` keyword in protobuf
  - REST: Maps to JSON array

- **Optional** ☑️ - Field is not required
  - Can be omitted in requests
  - gRPC: Maps to `optional` keyword in protobuf
  - REST: Field not included in required array

**Field Description**
- Explain what this field represents
- Critical for AI model understanding
- Click the sparkle icon (✨) for AI-generated descriptions
- Example: "The user's primary email address used for notifications and account recovery"

#### Object Type Fields

When you select **Object** as the field type, you must specify which message type this field references.

**Message Type Reference**
- Dropdown to select from existing Simple Messages
- Creates a nested object structure
- Enables reusable, composable data models
- Example: `address` field of type Object referencing `Address` message

**Example Nested Structure:**
```json
{
  "name": "John Doe",
  "address": {
    "street": "123 Main St",
    "city": "Boston",
    "zipCode": "02101"
  }
}
```

---

### Creating Composition Messages

Click **"Create Composition"** under the Composition Messages tab to create a new composition message.

Composition messages define polymorphic structures where a value can be one of several message types (oneOf), all of several types (allOf), or any combination (anyOf).

#### Composition Configuration

**Composition Name** * (required)
- Unique identifier for this composition
- Use PascalCase convention: `PaymentMethod`, `Animal`, `Shape`
- Example: `Pet` (for Cat, Dog, Bird union)

**Description**
- Explain what this composition represents
- Describe the relationship between composed types
- Click the sparkle icon (✨) for AI-generated descriptions
- Example: "Represents any type of pet - can be a cat, dog, or bird"

**Composition Type** * (required)

Select how message types should be composed:

| Type | Behavior | Use Case | Example |
|------|----------|----------|---------|
| **One Of** | Exactly one message type | Exclusive choice, polymorphic data | Payment can be CreditCard OR PayPal OR BankTransfer |
| **Any Of** | One or more message types | Inclusive choice, flexible combinations | User can have Email AND/OR Phone AND/OR Address |
| **All Of** | All message types required | Merge/extend types, inheritance | Employee extends Person AND has EmployeeDetails |

**Message Types** * (required)
- Select which Simple Messages to include in this composition
- Click to add message types from available Simple Messages
- Remove types by clicking the X on the badge
- Must have at least one message type
- Example: For `PaymentMethod`, add `CreditCard`, `BankTransfer`, `PayPal`

**Message Type Names** *(optional)*
- Custom field names for each message type
- Auto-generates from message type names if not provided
- Useful for protocol-specific naming requirements
- Example: Message type `CreditCard` → field name `credit_card`

**Use xsi:type (XML/SOAP)** *(SOAP only)*

☑️ Enable for SOAP extension inheritance using xsi:type attribute

- **Enabled (xsi:type)**: Use XML type attribute for polymorphism
  ```xml
  <pet xsi:type="Dog">
    <name>Rex</name>
    <breed>Labrador</breed>
  </pet>
  ```

- **Disabled (element choice)**: Use element nesting for choice
  ```xml
  <pet>
    <dog>
      <name>Rex</name>
      <breed>Labrador</breed>
    </dog>
  </pet>
  ```

**When to use:**
- Enable for SOAP extension/restriction inheritance (xs:extension base)
- Disable for SOAP choice elements (xs:choice)
- Only relevant for SOAP/XML protocols

---

### Map Data (Entry Pattern)

For REST and gRPC protocols, MCPHub supports map/dictionary data structures through the Entry Type pattern.

#### What is Entry Type?

Entry Type (also called Entry Pattern or Map Data) represents key-value pair structures used in maps, dictionaries, and records.

**Supported Protocols:**
- ✅ REST (JSON `Record<string, T>` or `{ [key: string]: T }`)
- ✅ gRPC (Protobuf `map<key_type, value_type>`)

**Not supported:**
- ❌ GraphQL (use custom scalar or input types)
- ❌ SOAP (use arrays or custom complex types)

#### Creating Entry Type Messages

1. Create a new **Simple Message**
2. Enable the **"Entry Type (Map Data)"** checkbox
3. MCPHub automatically creates two fixed fields:
   - `key` - The map key (typically string)
   - `value` - The map value (any type)

**Example - Person Map:**

Message: `PersonEntry` (Entry Type enabled)
- Field: `key` (type: STRING) - Person's unique ID
- Field: `value` (type: OBJECT → Person) - Person details

**REST JSON representation:**
```json
{
  "users": {
    "user_123": {
      "name": "Alice",
      "email": "alice@example.com"
    },
    "user_456": {
      "name": "Bob",
      "email": "bob@example.com"
    }
  }
}
```

**gRPC protobuf representation:**
```protobuf
message PersonEntry {
  string key = 1;
  Person value = 2;
}

// Used as: map<string, Person> users
```

**Key points:**
- Entry Type messages have exactly 2 fields: `key` and `value`
- Cannot add additional fields to Entry Type messages
- Cannot enable both "Entry Type" and "Additional Properties"
- Value field can reference any other message type

---

### AI-Powered Description Generation

MCPHub provides AI assistance for generating high-quality descriptions.

#### Individual Field Suggestions

Click the sparkle icon (✨) next to any description field:

**Available for:**
- Message descriptions
- Field descriptions
- Composition descriptions

**How it works:**
1. Click the sparkle icon (✨)
2. AI analyzes context (field name, type, message structure)
3. Review the suggested description
4. Click "Apply" to use or "Dismiss" to ignore

#### Bulk Suggestions

Generate descriptions for entire messages at once:

1. Click the sparkle icon (✨) in the message header
2. AI generates descriptions for:
   - The message itself
   - All fields within the message
3. Review all suggestions in a dialog
4. Select which suggestions to apply
5. Click "Apply Selected"

**Benefits:**
- Saves time on documentation
- Ensures consistent description style
- Improves AI model comprehension
- High-quality, context-aware suggestions

---

### Protocol-Specific Features

#### REST/JSON

**Supported Features:**
- All unified field types
- Nested objects (Object type fields)
- Arrays (Repeated flag)
- Additional Properties flag
- Entry Type (Map Data)
- Composition messages (oneOf, anyOf, allOf)

**JSON Schema Mapping:**
- Generates compliant JSON Schema for MCP tools
- Respects required/optional field settings
- Validates data types automatically

#### gRPC/Protobuf

**Supported Features:**
- All unified field types with Proto type mapping
- Field numbers (required for protobuf)
- Repeated fields (arrays)
- Optional fields
- Nested messages (Object type fields)
- Entry Type for maps
- Composition via oneof (oneOf composition type)

**Proto Import:**
- Automatically imports message definitions from .proto files
- Preserves field numbers and proto types
- Maintains package structure
- Editable after import

**Example protobuf mapping:**
```protobuf
message Person {
  string name = 1;
  int32 age = 2;
  repeated string tags = 3;
  Address address = 4;  // Object reference
}
```

#### GraphQL

**Supported Features:**
- All unified field types
- Nested types (Object type fields)
- Lists (Repeated flag)
- Non-null fields (required)
- Composition via Union and Interface types

**GraphQL Schema Import:**
- Automatically imports types from introspection
- Converts GraphQL types to message definitions
- Supports object types, input types, interfaces, unions
- Field descriptions imported automatically

**Mapping:**
- GraphQL Object Type → Simple Message
- GraphQL Union Type → Composition Message (oneOf)
- GraphQL Interface → Composition Message (allOf/anyOf)

#### SOAP/XML

**Supported Features:**
- All unified field types
- Complex types (Object type fields)
- Sequences and arrays (Repeated flag)
- Composition for xsd:choice and xsd:extension
- xsi:type for polymorphic XML

**WSDL Import:**
- Automatically imports complex types from WSDL
- Converts xsd:complexType to Simple Messages
- Converts xsd:choice to Composition Messages
- Preserves XML namespaces and element structure

**Composition Modes:**

**xsi:type (Extension Inheritance):**
```xml
<pet xsi:type="Dog">
  <name>Rex</name>
  <breed>Labrador</breed>
</pet>
```

**Element Choice:**
```xml
<pet>
  <dog>
    <name>Rex</name>
    <breed>Labrador</breed>
  </dog>
</pet>
```

---

### Best Practices

#### Naming Conventions

**Messages:**
- Use PascalCase: `UserProfile`, `OrderDetails`, `PaymentInfo`
- Be descriptive and specific
- Singular nouns for entity types
- Avoid abbreviations unless widely known

**Fields:**
- Use camelCase (REST/GraphQL) or snake_case (gRPC/SOAP)
- Be consistent within a message
- Descriptive names over short names
- Example: `emailAddress` better than `email`

#### Organization

**Message Reusability:**
- Create small, focused messages
- Compose larger structures from smaller messages
- Example: `Address`, `ContactInfo`, `Person` (uses Address + ContactInfo)

**Avoid Duplication:**
- Reuse existing messages instead of duplicating
- Use Object type fields to reference other messages
- Keep message definitions DRY (Don't Repeat Yourself)

#### Descriptions

**Write clear descriptions:**
- Explain the purpose, not just the name
- Include constraints and validation rules
- Mention expected formats for complex types
- Bad: "User name" → Good: "User's full display name (first and last name combined)"

**Use AI assistance:**
- Generate initial descriptions with AI
- Review and refine AI suggestions
- Maintain consistent tone and style

#### Field Types

**Choose appropriate types:**
- Use UUID for unique identifiers, not String
- Use Date Time for timestamps, not String
- Use Number for decimals, Integer for whole numbers
- Use Binary for file data, not String

**Object references:**
- Always set message type for Object fields
- Ensure referenced messages exist
- Avoid circular references (A references B references A)

---

### Common Patterns

#### Request/Response Pairs

Create matching request and response messages:

**Example:**
- `CreateUserRequest` - Input data for creating user
- `CreateUserResponse` - Result with created user details

#### Nested Structures

Build complex data models from simple messages:

**Example:**
```
Person (Simple)
  ├─ name: String
  ├─ age: Integer
  └─ address: Object → Address

Address (Simple)
  ├─ street: String
  ├─ city: String
  └─ zipCode: String
```

#### Polymorphic Responses

Use composition for varying response types:

**Example:**
```
SearchResult (Composition - oneOf)
  ├─ UserResult
  ├─ ProductResult
  └─ ArticleResult
```

#### Map/Dictionary Data

Use Entry Type for key-value structures:

**Example:**
```
UserMap (Entry Type)
  ├─ key: String (userId)
  └─ value: Object → User
```

---

### Troubleshooting

**"No message types available" in composition:**
- Create Simple Messages first before creating compositions
- Compositions can only reference existing Simple Messages

**"Cannot add fields to Entry Type message:"**
- Entry Type messages are limited to `key` and `value` fields only
- Disable Entry Type to add custom fields

**"Cannot enable both Entry Type and Additional Properties:"**
- These are mutually exclusive features
- Choose one based on your use case

**Object field shows "No message type selected:"**
- Select a message type from the dropdown
- Create the referenced message if it doesn't exist

**Field numbers must be unique (gRPC):**
- Each field in a message must have a unique number
- Check for duplicate field numbers
- Auto-increment usually prevents this

---

### Summary

The Schema Definition tab provides comprehensive tools for creating reusable, type-safe data structures:

✅ **Simple Messages** - Standard data structures with typed fields
✅ **Composition Messages** - Polymorphic unions and combinations
✅ **Entry Types** - Map/dictionary data for REST and gRPC
✅ **AI Assistance** - Intelligent description generation
✅ **Multi-Protocol** - Works across REST, gRPC, GraphQL, and SOAP
✅ **Auto-Import** - Import from Proto, WSDL, GraphQL, OpenAPI
✅ **Visual Editor** - Intuitive UI for complex schemas

Use message definitions to create well-documented, maintainable MCP configurations that AI models can understand and use effectively.

---

## Tab 5: Endpoints

Define the API endpoints that will be exposed as MCP tools. Each endpoint becomes an individual tool that AI models can invoke to interact with your API.

### Overview

Endpoints are the core building blocks of your MCP configuration. Each endpoint represents a specific API operation (like "get user", "create order", "search products") and defines:
- How to call the API (method, path, parameters)
- What data to send (input/request structure)
- What data to expect back (output/response structure)
- How AI models should understand and use the tool

Each endpoint becomes a powerful tool that AI models can use to interact with your API effectively and safely.

### Workflow: Message Definitions First, Then Endpoints

**Important:** Before configuring endpoints with complex data structures, create your message definitions in Tab 4 (Schema Definition). This allows you to:

1. **Tab 4: Schema Definition** - Create reusable message schemas (e.g., `Person`, `CreateUserRequest`, `UserResponse`)
2. **Tab 5: Endpoints** - Configure endpoints and link them to your message definitions

This approach ensures type consistency, enables reusability, and simplifies maintenance across multiple endpoints.

---

### Adding Endpoints

Click the **"+ Add Endpoint"** button to create a new endpoint. The endpoint form includes several tabs for different configuration aspects:

- **Basic Info** - Core endpoint settings (name, method, path, description)
- **Parameters** - Query parameters, path parameters, headers
- **Request Body** - Input data structure for POST/PUT/PATCH requests
- **Response** - Expected response structure and status codes

---

### REST Endpoint Configuration

REST endpoints expose HTTP operations as MCP tools.

#### Basic Information

**Endpoint Name** * (required)
- Unique identifier for this tool
- Use camelCase or snake_case consistently
- Descriptive and action-oriented
- Examples: `getUserProfile`, `createOrder`, `searchProducts`, `update_user_settings`

**Display Name**
- Human-readable name shown to AI models
- Auto-generated from endpoint name if not provided
- Example: "Get User Profile", "Create Order"

**HTTP Method** * (required)
- Select the appropriate HTTP verb:
  - **GET** - Retrieve data (read-only operations)
  - **POST** - Create new resources or submit data
  - **PUT** - Update/replace entire resources
  - **PATCH** - Partial updates to resources
  - **DELETE** - Remove resources

**Path** * (required)
- API endpoint path appended to base URL
- Supports path parameters with `{paramName}` syntax
- Supports user variables with `{{variableName}}` syntax
- Examples:
  - `/users/{userId}`
  - `/{{apiVersion}}/products/{productId}`
  - `/orders/{orderId}/items`

**Description** * (required)
- Clear, detailed explanation of what this endpoint does
- Include expected behavior, side effects, and use cases
- Critical for AI model understanding
- Use the sparkle icon (✨) for AI-generated suggestions
- Example: "Retrieves the complete profile information for a specific user, including personal details, preferences, and account settings. Returns 404 if user not found."

**Enabled Toggle**
- Control whether this endpoint is active
- Disabled endpoints are not exposed as MCP tools
- Useful for temporarily hiding endpoints during development

#### Linking Message Definitions

This is where you connect your endpoint to the message schemas defined in Tab 4 (Schema Definition).

**Input Type** (for POST, PUT, PATCH)
- **Location:** Found in the Request Body tab of the endpoint configuration
- **Purpose:** Defines the structure of data sent to the API
- **How to use:**
  1. Go to Tab 4 (Schema Definition) and create a message (e.g., `CreateUserRequest`)
  2. Return to Tab 5 (Endpoints) and expand your endpoint
  3. Click the Request Body tab
  4. In the **"Input Type"** dropdown, select your message definition
  5. MCPHub automatically generates the request schema from your message

**Output Type** (for all methods)
- **Location:** Found in the Response tab of the endpoint configuration
- **Purpose:** Documents the structure of data returned by the API
- **How to use:**
  1. Go to Tab 4 (Schema Definition) and create a message (e.g., `UserResponse`)
  2. Return to Tab 5 (Endpoints) and expand your endpoint
  3. Click the Response tab
  4. In the **"Output Type"** dropdown, select your message definition
  5. MCPHub automatically generates the response schema from your message

**Example Workflow:**

```
Step 1 (Tab 4): Create Messages
  - CreateUserRequest (Simple Message)
    ├─ username: String
    ├─ email: String
    └─ password: String

  - UserResponse (Simple Message)
    ├─ id: UUID
    ├─ username: String
    ├─ email: String
    └─ createdAt: Date Time

Step 2 (Tab 5): Create Endpoint
  - Name: createUser
  - Method: POST
  - Path: /users
  - Description: "Creates a new user account..."
  - Input Type: CreateUserRequest ← Select from dropdown
  - Output Type: UserResponse ← Select from dropdown
```

#### Parameters

**Query Parameters**
- Parameters added to the URL query string: `?key=value&key2=value2`
- Click **"+ Add Query Parameter"** to add new parameters
- Configure for each parameter:
  - **Name**: Parameter name (e.g., `page`, `limit`, `filter`)
  - **Type**: Data type (string, number, boolean, array)
  - **Description**: What this parameter does
  - **Required**: Whether parameter must be provided
  - **Default Value**: Value used if not provided
- Example: `/users?page=1&limit=10&status=active`

**Path Parameters**
- Automatically detected from your path definition using `{paramName}` syntax
- Configure description and type for each detected parameter
- Path: `/users/{userId}/orders/{orderId}` automatically detects `userId` and `orderId`
- Required by default (path parameters cannot be optional)

**Header Parameters**
- Custom HTTP headers required by this specific endpoint
- Different from protocol-level headers (Tab 2)
- Supports user variable substitution: `X-Request-ID: {{requestId}}`
- Example: `X-API-Version: 2024-01`, `X-Tenant-ID: {{tenantId}}`

#### Request Body (Input Type)

**For POST, PUT, PATCH requests:**

**Method 1: Using Message Definitions (Recommended)**
1. Create a message definition in Tab 4 (Schema Definition)
2. Select the message from the **"Input Type"** dropdown
3. MCPHub automatically generates the request schema

**Method 2: Direct Schema Definition**
- Define the JSON schema directly in the endpoint
- Useful for simple, one-off structures
- Less reusable than message definitions

**Content Type**
- Automatically set to `application/json` for most REST APIs
- Can be customized for specific requirements

**Required Toggle**
- Mark if request body is mandatory
- POST and PUT typically require request bodies
- PATCH may allow optional bodies

#### Response (Output Type)

**For all REST endpoints:**

**Status Codes**
- Define expected HTTP response codes
- Default: 200 (OK)
- Add additional status codes (201 Created, 400 Bad Request, 404 Not Found, etc.)
- Document what each status code means

**Output Type Selection**
1. Create a response message in Tab 4 (Schema Definition)
2. Select the message from the **"Output Type"** dropdown
3. MCPHub automatically generates the response schema for AI models

**Include Output Schema Toggle**
- Enable to include full response structure in MCP tool definition
- Helps AI models understand what data they'll receive
- Can be set at protocol level (Tab 2) or per-endpoint

**Example REST Endpoint:**
```
Name: getUserById
Method: GET
Path: /users/{userId}
Description: "Retrieves detailed user information by user ID"

Path Parameters:
  - userId (UUID, required): "The unique identifier of the user"

Output Type: UserResponse
  ├─ id: UUID
  ├─ username: String
  ├─ email: String
  ├─ fullName: String
  ├─ createdAt: Date Time
  └─ lastLogin: Date Time

Response Codes:
  - 200: User found and returned
  - 404: User not found
  - 403: Forbidden
```

---

### gRPC Endpoint Configuration

gRPC endpoints expose RPC methods from your protobuf definitions as MCP tools.

#### Basic Information

**Endpoint Name** * (required)
- Unique identifier for this RPC tool
- Often matches the protobuf method name
- Examples: `GetUser`, `CreateOrder`, `ListProducts`

**Service** * (required)
- The protobuf service name
- Example: `UserService`, `OrderService`

**RPC Method** * (required)
- The method name from your .proto file
- Full method path: `package.ServiceName/MethodName`
- Example: `com.example.UserService/GetUser`

**Streaming Type**
- **None** - Unary RPC (single request, single response)
- **Client Streaming** - Multiple requests, single response
- **Server Streaming** - Single request, multiple responses
- **Bidirectional** - Multiple requests, multiple responses

**Description** * (required)
- Explain what this RPC method does
- Include behavior, side effects, and error conditions
- Use the sparkle icon (✨) for AI-generated suggestions

#### Linking Message Definitions (gRPC)

gRPC endpoints use protobuf messages, which are automatically imported into the Schema Definition tab when you import a .proto file.

**Input Type** * (required)
- **Location:** In the endpoint configuration form
- **Purpose:** Specifies the protobuf message type for requests
- **How to use:**
  1. Import your .proto file (automatically creates message definitions in Tab 4)
  2. In the endpoint configuration, select from the **"Input Type"** dropdown
  3. Choose the appropriate request message (e.g., `GetUserRequest`)
  4. Must match the method signature in your .proto file

**Output Type** * (required)
- **Location:** In the endpoint configuration form
- **Purpose:** Specifies the protobuf message type for responses
- **How to use:**
  1. After importing .proto file, messages are available in the dropdown
  2. Select from the **"Output Type"** dropdown
  3. Choose the appropriate response message (e.g., `GetUserResponse`)
  4. Must match the method signature in your .proto file

**Example gRPC Endpoint:**
```
Proto Definition:
  service UserService {
    rpc GetUser (GetUserRequest) returns (GetUserResponse);
  }

  message GetUserRequest {
    string user_id = 1;
  }

  message GetUserResponse {
    string id = 1;
    string username = 2;
    string email = 3;
  }

MCPHub Configuration:
  Name: GetUser
  Service: UserService
  RPC Method: com.example.UserService/GetUser
  Streaming Type: None
  Input Type: GetUserRequest ← Auto-populated from proto
  Output Type: GetUserResponse ← Auto-populated from proto
```

**Key Differences from REST:**
- Input/Output types are always required (gRPC is strongly typed)
- Message definitions are automatically created from .proto files
- Field numbers and proto types are preserved
- Changes to .proto files require re-importing to update

---

### GraphQL Endpoint Configuration

GraphQL endpoints expose queries and mutations as MCP tools.

#### Basic Information

**Endpoint Name** * (required)
- Unique identifier for this GraphQL operation
- Matches the query or mutation name
- Examples: `getUser`, `createPost`, `searchArticles`

**Operation Type** * (required)
- **Query** - Read-only data fetching operations
- **Mutation** - Operations that modify data
- **Subscription** - Real-time data updates (if supported)

**Description** * (required)
- Explain what this operation does
- Include expected arguments and return data
- Document field selection capabilities

#### Linking Message Definitions (GraphQL)

GraphQL types are automatically imported into the Schema Definition tab when you perform GraphQL introspection.

**Input Type** (for mutations with input objects)
- **Location:** In the endpoint configuration form
- **Purpose:** Specifies the GraphQL input type for mutation arguments
- **How to use:**
  1. Perform GraphQL introspection (creates message definitions in Tab 4)
  2. In the endpoint configuration, select from the **"Input Type"** dropdown
  3. Choose the appropriate input type (e.g., `CreatePostInput`)
  4. MCPHub maps GraphQL input types to MCP tool parameters

**Output Type** * (required)
- **Location:** In the endpoint configuration form
- **Purpose:** Specifies the GraphQL return type
- **How to use:**
  1. After introspection, types are available in the dropdown
  2. Select from the **"Output Type"** dropdown
  3. Choose the appropriate return type (e.g., `Post`, `User`)
  4. MCPHub generates the response schema from GraphQL type

**Field Selection**
- GraphQL endpoints include a special `fields` parameter
- Allows AI models to request specific fields
- Automatically populated from GraphQL schema
- Example: `["id", "name", "author.name", "comments.text"]`

**Example GraphQL Endpoint:**
```
GraphQL Schema:
  type Query {
    getUser(id: ID!): User
  }

  type Mutation {
    createPost(input: CreatePostInput!): Post
  }

  input CreatePostInput {
    title: String!
    content: String!
    authorId: ID!
  }

  type Post {
    id: ID!
    title: String!
    content: String!
    author: User!
  }

MCPHub Configuration:
  Name: createPost
  Operation Type: Mutation
  Input Type: CreatePostInput ← Auto-populated from introspection
  Output Type: Post ← Auto-populated from introspection

  Parameters (auto-generated):
    - input (CreatePostInput, required)
    - fields (String[], optional) - Field selection
```

---

### SOAP Endpoint Configuration

SOAP endpoints expose SOAP operations from WSDL definitions as MCP tools.

#### Basic Information

**Endpoint Name** * (required)
- Unique identifier for this SOAP operation
- Often matches the WSDL operation name
- Examples: `GetUserDetails`, `CreateOrder`, `ProcessPayment`

**Operation Name** * (required)
- The SOAP operation name from WSDL
- Example: `getUserDetails`, `createOrder`

**SOAP Action**
- The SOAPAction HTTP header value
- Auto-populated from WSDL import
- Example: `urn:example-com:getUserDetails`

**Description** * (required)
- Explain what this SOAP operation does
- Include expected behavior and fault conditions

#### Linking Message Definitions (SOAP)

SOAP complex types are automatically imported into the Schema Definition tab when you import a WSDL file.

**Input Type** * (required)
- **Location:** In the endpoint configuration form
- **Purpose:** Specifies the SOAP request message structure
- **How to use:**
  1. Import your WSDL file (creates message definitions in Tab 4)
  2. In the endpoint configuration, select from the **"Input Type"** dropdown
  3. Choose the request message (e.g., `GetUserRequest`)
  4. Must match the WSDL operation input

**Output Type** * (required)
- **Location:** In the endpoint configuration form
- **Purpose:** Specifies the SOAP response message structure
- **How to use:**
  1. After WSDL import, complex types are available
  2. Select from the **"Output Type"** dropdown
  3. Choose the response message (e.g., `GetUserResponse`)
  4. Must match the WSDL operation output

**SOAP-Specific Features:**
- Composition messages with `xsi:type` for polymorphism (see Tab 4)
- XML namespace handling
- SOAP 1.1 vs 1.2 version support
- WS-Security authentication support

---

### AI-Powered Enhancements

MCPHub provides AI assistance for improving endpoint documentation.

#### Individual Suggestions

Click the sparkle icon (✨) next to any field to get AI-generated suggestions:

**Available for:**
- Endpoint descriptions
- Parameter descriptions
- Path parameter explanations

**How it works:**
1. Click the sparkle icon (✨) next to the description field
2. AI analyzes context (endpoint name, method, path, parameters)
3. Review the suggested description
4. Click "Apply" to use or "Dismiss" to ignore

#### Bulk Suggestions

Generate descriptions for multiple endpoints at once:

1. Click **"Bulk AI Suggestions"** button at the top of the Endpoints tab
2. Select which endpoints to enhance
3. AI generates descriptions for:
   - Each endpoint
   - All parameters within selected endpoints
4. Review all suggestions in a dialog
5. Select which suggestions to apply
6. Click "Apply Selected"

**Benefits:**
- Saves significant time on documentation
- Ensures consistent description style
- Improves AI model comprehension
- High-quality, context-aware suggestions

---

### Best Practices for Endpoints

#### Naming Conventions

**Endpoint Names:**
- Use action verbs: `getUser`, `createOrder`, `updateProfile`
- Be specific: `getUserById` instead of `get`
- Consistent casing: stick to camelCase or snake_case
- Avoid abbreviations: `createUser` not `crtUsr`

**Path Design:**
- Use nouns for resources: `/users`, `/orders`, `/products`
- Hierarchical relationships: `/users/{userId}/orders`
- Plural for collections: `/users` not `/user`
- Version in path or variable: `/v1/users` or `/{{version}}/users`

#### Descriptions

**Write clear, actionable descriptions:**
- Start with action verb: "Retrieves...", "Creates...", "Updates..."
- Include side effects: "Creates a user and sends welcome email"
- Document error cases: "Returns 404 if user not found"
- Mention constraints: "Limit: 100 users per request"

**Good Example:**
```
"Retrieves paginated list of active users with optional filtering by role and department.
Returns up to 100 users per request. Use 'page' parameter for pagination.
Requires 'user:read' permission."
```

**Bad Example:**
```
"Gets users"
```

#### Message Definition Reuse

**Maximize reusability:**
- Create generic messages: `PageRequest`, `PageResponse`, `ErrorResponse`
- Share across endpoints: Multiple endpoints use same `UserResponse`
- Version your messages: `UserResponseV1`, `UserResponseV2`

**Example:**
```
Messages (Tab 4):
  - PageRequest (reusable pagination)
    ├─ page: Integer
    ├─ pageSize: Integer
    └─ sortBy: String

  - UserResponse (reusable user data)
    ├─ id: UUID
    ├─ username: String
    └─ email: String

Endpoints (Tab 5):
  - listUsers: Uses PageRequest + returns User[]
  - getUserById: Returns UserResponse
  - createUser: Returns UserResponse
  - updateUser: Returns UserResponse
```

#### Parameter Organization

**Query Parameters:**
- Pagination: `page`, `pageSize`, `limit`, `offset`
- Filtering: `status=active`, `role=admin`, `department=engineering`
- Sorting: `sortBy=createdAt`, `sortOrder=desc`
- Search: `q=searchterm`, `query=value`

**Path Parameters:**
- Resource IDs: `{userId}`, `{orderId}`, `{productId}`
- Hierarchical: `{tenantId}`, `{organizationId}`
- Use UUIDs or type hints in descriptions

---

### Troubleshooting

**"No message definitions available" in Input/Output Type dropdown:**
- Create message definitions in Tab 4 (Schema Definition) first
- Check that you're in the correct protocol (REST, gRPC, GraphQL, SOAP)
- Verify message definitions are saved

**Input Type dropdown is disabled:**
- Only available for POST, PUT, PATCH methods in REST
- Always available for gRPC, GraphQL mutations, and SOAP
- GET and DELETE typically don't have request bodies

**Message definition doesn't appear in dropdown:**
- Ensure the message is saved in Tab 4
- Check message type compatibility (Simple messages for most cases)
- Composition messages can also be used for polymorphic responses

**Changes to messages don't reflect in endpoints:**
- Changes to message definitions (Tab 4) automatically update linked endpoints
- Save your MCP configuration to persist changes
- Redeploy the MCP for changes to take effect

---

### Summary

The Endpoints tab is where you:

✅ **Define API Operations** - Configure how to call your API endpoints
✅ **Link Message Definitions** - Connect to schemas from Tab 4 for type safety
✅ **Document Behavior** - Provide clear descriptions for AI models
✅ **Configure Parameters** - Define query, path, and header parameters
✅ **Set Input/Output Types** - Specify request and response structures
✅ **Use AI Assistance** - Get intelligent description suggestions

---

## Tab 6: Custom Tools

Create custom Python tools to extend your MCP with specialized functionality. Custom tools run in a secure sandboxed Python environment and can perform data transformations, calculations, API calls, and database queries.

### Overview

Custom tools allow you to write Python code that executes server-side to handle operations that aren't covered by standard API endpoints. Each tool can accept input parameters, execute custom logic, and return structured outputs.

---

### Creating a Custom Tool

Click **"+ Add Custom Tool"** to create a new tool.

### Basic Configuration

**Tool Name** * (required)
- Unique identifier for the tool
- Use camelCase or snake_case consistently
- AI models will use this name to invoke the tool
- Example: `calculateAge`, `validateEmail`, `fetchUserData`

**Description** * (required)
- Clear explanation of what this tool does
- Include expected inputs and outputs
- Describe any side effects or requirements
- Example: "Calculates the age in years given a birth date in YYYY-MM-DD format"

**Enabled Toggle**
- Control whether this tool is active
- Disabled tools are not exposed to AI models
- Useful for testing or temporarily disabling functionality

---

### Input Parameters

Define the parameters your tool accepts. Each input parameter specifies data that must be provided when the tool is invoked.

Click **"Add Input Parameter"** to add a new input.

**Parameter Configuration:**

**Name** * (required)
- Variable name used in your Python code
- Use snake_case for Python convention
- Example: `birth_date`, `user_id`, `max_results`

**Type** * (required)
- Select the data type for validation:
  - **String** - Text values
  - **Integer** - Whole numbers
  - **Number** - Decimal numbers
  - **Boolean** - True/false values
  - **Object** - JSON objects
  - **Date/Time** - ISO 8601 timestamps
  - **Binary** - Base64 encoded data

**Description** * (required)
- Explain what this parameter is used for
- Include format requirements or constraints
- Example: "Birth date in YYYY-MM-DD format"

**Required Toggle**
- Mark whether this parameter must be provided
- Required parameters will be validated before execution
- Optional parameters can be omitted

**Default Value**
- Provide a default value for optional parameters
- Used when the parameter is not provided
- Must match the parameter type

---

### Output Parameters

Define the outputs your tool produces. These describe the structure of data returned by your tool.

Click **"Add Output Parameter"** to add a new output.

**Parameter Configuration:**

**Name** * (required)
- Key name in the output dictionary
- Use snake_case for Python convention
- Example: `result`, `age`, `validation_status`

**Type** * (required)
- Select the data type (same options as input types)
- Helps AI models understand the response structure

**Description** * (required)
- Explain what this output represents
- Include possible values or ranges
- Example: "Age in years as an integer"

**Default Value**
- Optional default value for the output
- Used for documentation purposes

---

### Python Code

Write your custom Python logic in the code editor. The code executes in a secure sandboxed environment.

#### Generate Template Button

Click **"Generate Template"** to automatically create a code template based on your defined input and output parameters.

**Generated template includes:**
- Comments listing available input variables
- Comments listing expected output variables
- Example function structure
- Return statement with correct output format

#### Available Environment

**Pre-loaded Modules** (use without import):
- `datetime` - Date and time operations
- `json` - JSON parsing and serialization
- `math` - Mathematical functions
- `re` - Regular expressions

**Special Functions:**
- `requests.get(url)` - Make HTTP GET requests
- `requests.post(url, data)` - Make HTTP POST requests
- `db.connect(url, user, pass)` - Connect to databases
- `db.query(conn, sql)` - Execute SQL queries
- `db.close(conn)` - Close database connections
- `log_info(message)` - Log debug messages

**Exception Classes** (pre-loaded):
- `Exception` - Base exception class
- `ValueError` - Invalid value errors
- `TypeError` - Type mismatch errors
- `RuntimeError` - Runtime errors
- `KeyError` - Missing dictionary key errors
- `ConnectionError` - Network connection errors
- `TimeoutError` - Request timeout errors

#### Writing Your Code

**Accessing Input Parameters:**
Input parameters are available as variables with the same name you defined.

```python
# If you defined an input parameter named "birth_date"
# It's automatically available as a variable:
birth_date_str = birth_date  # Access the input directly
```

**Setting Output:**
Use the global `output` variable to return results. It must be a dictionary with keys matching your output parameter names.

```python
output = {
    'result': calculated_value,
    'status': 'success'
}
```

**Example 1: Date Calculation**
```python
# Input parameters: birth_date (string)
# Output parameters: age (integer)

# Parse the birth date
from_date = datetime.strptime(birth_date, "%Y-%m-%d")
today = datetime.now()

# Calculate age
age_years = today.year - from_date.year
if (today.month, today.day) < (from_date.month, from_date.day):
    age_years -= 1

# Set output
output = {'age': age_years}
```

**Example 2: API Call with Error Handling**
```python
# Input parameters: user_id (string)
# Output parameters: user_data (object), success (boolean), error (string)

try:
    # Make API call
    response = requests.get(f"https://api.example.com/users/{user_id}")

    if response['status_code'] == 200:
        output = {
            'user_data': response['json'],
            'success': True,
            'error': ''
        }
    else:
        raise ValueError(f"API returned status {response['status_code']}")

except ConnectionError as e:
    output = {
        'user_data': None,
        'success': False,
        'error': f"Connection failed: {str(e)}"
    }
except Exception as e:
    output = {
        'user_data': None,
        'success': False,
        'error': f"Unexpected error: {str(e)}"
    }
```

**Example 3: Database Query**
```python
# Input parameters: table_name (string), limit (integer)
# Output parameters: records (object), count (integer)

try:
    # Connect to database
    conn = db.connect(
        "postgresql://host:5432/mydb",
        "username",
        "password"
    )

    # Execute query
    sql = f"SELECT * FROM {table_name} LIMIT {limit}"
    results = db.query(conn, sql)

    # Close connection
    db.close(conn)

    # Return results
    output = {
        'records': results,
        'count': len(results)
    }

except Exception as e:
    log_info(f"Database error: {str(e)}")
    output = {
        'records': [],
        'count': 0
    }
```

**Example 4: Data Transformation**
```python
# Input parameters: data_list (object), field_name (string)
# Output parameters: transformed (object)

# Transform array of objects
results = []
for item in data_list:
    if field_name in item:
        results.append({
            'original': item[field_name],
            'uppercase': item[field_name].upper(),
            'length': len(item[field_name])
        })

output = {'transformed': results}
```

---

### Security and Limitations

**Sandboxed Execution:**
- Code runs in a secure, isolated Python environment
- No access to file system or network except through provided functions
- Cannot install additional packages
- Execution timeout enforced to prevent infinite loops

**Memory and Performance:**
- Limited memory allocation per execution
- Long-running operations should be avoided
- Consider breaking complex tasks into smaller tools

**Best Practices:**
- Always handle exceptions to prevent tool failures
- Use `log_info()` for debugging during development
- Validate input parameters before processing
- Return structured error information in outputs
- Keep tools focused on a single responsibility
- Test tools thoroughly with various input values

---

### Troubleshooting

**"NameError: name 'X' is not defined":**
- Ensure the variable name matches your input parameter name exactly
- Check for typos in variable names
- Verify input parameters are defined

**"Module 'X' has no attribute 'Y'":**
- Only pre-loaded functions are available
- Cannot use standard import statements
- Use provided special functions (requests, db, log_info)

**"Execution timed out":**
- Code took too long to execute
- Optimize loops and reduce complexity
- Break into smaller tools if needed

**"Output not set":**
- Must set `output` variable before code ends
- Ensure all code paths set output
- Check that output is a dictionary

**"Invalid output format":**
- Output must be a dictionary
- Keys must match defined output parameter names
- Values must match defined output types

---

### Summary

Custom tools provide a powerful way to extend your MCP with server-side Python logic:

✅ **Python-Based** - Write custom logic in Python 3.x
✅ **Sandboxed** - Secure execution environment
✅ **Pre-loaded Libraries** - datetime, json, math, re available
✅ **HTTP Requests** - Make API calls with requests functions
✅ **Database Access** - Query databases with db functions
✅ **Error Handling** - Use standard Python exceptions
✅ **Structured I/O** - Define typed input and output parameters
✅ **AI-Friendly** - Tools are automatically exposed to AI models

Use custom tools to handle specialized logic that goes beyond simple API calls, enabling more sophisticated AI interactions with your systems.

---

## Saving Your Configuration

### Validation

- Real-time validation as you configure
- Error highlighting and helpful messages
- Warnings for potential improvements

### Save Process

1. Complete all required fields across the tabs
2. Click "Save Configuration" when ready
3. Configuration is validated and stored
4. Ready for deployment and testing

This tab-by-tab approach ensures you create comprehensive, well-configured MCP servers that work seamlessly with AI models.

## Deploying and Testing Your MCP

### Deployment
For deploying your MCP configuration, see [Deployment Management](deployment-management.md).

### Testing
After deployment, you can test your MCP using two approaches:

#### 1. Built-in Test Interface
Use MCPHub's integrated testing framework to test your deployed MCP directly in the application. See [Configure AI Testing](../getting-started/first-mcp.md#step-10-configure-ai-testing) for detailed instructions on setting up and using the test interface.

#### 2. LangChain Integration Testing  
Test your MCP using LangChain for more comprehensive integration testing scenarios. See [LangChain Integration](../advanced/langchain-integration.md) for setup and usage instructions.