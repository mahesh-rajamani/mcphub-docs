# MCP Resources

## Overview

In addition to exposing API endpoints as **MCP Tools** (callable functions), MCPHub allows you to expose them as **MCP Resources** (readable data sources). Resources represent data that AI models can read using the Model Context Protocol's `resources/read` method, making them ideal for read-only data access patterns.

### What are MCP Resources?

MCP Resources are standardized data endpoints that AI models can:
- **Discover** via `resources/list` to see available data sources
- **Read** via `resources/read` using resource URIs
- **Access** with parameters embedded in the URI path

For complete details on the MCP Resources specification, see the [official MCP documentation](https://spec.modelcontextprotocol.io/specification/server/resources/).

### Tools vs. Resources

**MCP Tools:**
- Represent **actions** that can be executed
- Called using `tools/call` method
- Parameters passed in request body
- Suitable for: write operations, complex logic, multi-step processes

**MCP Resources:**
- Represent **data** that can be read
- Read using `resources/read` method
- Parameters embedded in URI path
- Suitable for: read-only queries, data retrieval, static content

**Best of Both Worlds:**
An endpoint can be configured as **both** a tool and a resource, giving AI models flexibility in how they access the data.

## Enabling Endpoints as Resources

### Using the UI

When editing an endpoint in MCPHub Studio, you'll find the resource enablement option in the endpoint configuration:

**Step 1: Edit Your Endpoint**
1. Navigate to your MCP configuration
2. Go to the **Endpoints** section
3. Select the endpoint you want to configure
4. Look for the **Enable as MCP Resource** toggle

**Step 2: Enable as Resource**
- Toggle **Enable as MCP Resource** to ON
- The endpoint will now be exposed via `resources/list` and `resources/read`

**Step 3: Configure Resource Settings (Optional)**
Under the **Resource Configuration** section, you can customize:
- **URI Template**: Custom resource URI pattern (optional)
- **Resource Name**: Human-readable name for the resource
- **Description**: Describe what data the resource provides
- **MIME Type**: Content type (e.g., `application/json`, `image/png`)

### Restrictions

Not all endpoints can be enabled as resources. MCPHub enforces these restrictions:

**GraphQL Operations:**
- Only **query** operations can be resources
- Mutations and subscriptions cannot be resources (they modify data)

**Parameter Complexity:**
- Only endpoints with **flat parameters** can be resources
- Primitive types are allowed: `string`, `number`, `boolean`, `integer`
- Arrays of primitives are allowed
- **Nested objects are not allowed** in resource parameters

**Why These Restrictions?**
Resources are designed for simple, read-only data access with URI-based parameters. Complex nested parameters and write operations don't fit the resource model.

## Resource URI Format

### General Pattern

All MCP resources in MCPHub use this URI format:

```
resource://{resourcePath}
```

The tenant ID and MCP name are **implicit** based on which MCP endpoint the client is connected to.

### URI Structure by API Type

The resource path format depends on your endpoint's API type:

#### REST Endpoints

**Pattern:**
```
{path}/{queryParam1}/{value1}/{queryParam2}/{value2}/...
```

**Example Configuration:**
```
Endpoint Path: /persons/search
Query Parameter: name (string)
```

**Resource URI:**
```
resource://persons/search/name/{name}
```

**Usage Example:**
```
resource://persons/search/name/Alice
```

#### gRPC Endpoints

**Pattern:**
```
{service}/{method}/field1/{value1}/field2/{value2}/...
```

**Example Configuration:**
```
Service: PersonService
RPC Method: GetPersonByName
Input Fields: name (string)
```

**Resource URI:**
```
resource://PersonService/GetPersonByName/name/{name}
```

**Usage Example:**
```
resource://PersonService/GetPersonByName/name/Alice
```

#### GraphQL Endpoints

**Pattern:**
```
{operationType}/{operationName}/field1/{value1}/field2/{value2}/...
```

**Example Configuration:**
```
Operation Type: query
Operation Name: searchPersons
Input Fields: name (string)
```

**Resource URI:**
```
resource://query/searchPersons/name/{name}
```

**Usage Example:**
```
resource://query/searchPersons/name/Alice
```

#### SOAP Endpoints

**Pattern:**
```
{soapAction}/field1/{value1}/field2/{value2}/...
```

**Example Configuration:**
```
SOAP Action: GetPerson
Input Fields: id (string)
```

**Resource URI:**
```
resource://GetPerson/id/{id}
```

**Usage Example:**
```
resource://GetPerson/id/123
```

## Configuring Both Tool and Resource

A common pattern is to expose the same endpoint as both a tool and a resource, giving AI models flexibility in how they access the data.

### Configuration Steps

**Step 1: Enable as Tool**
- Toggle **Enabled** to ON
- Endpoint is callable via `tools/call`

**Step 2: Enable as Resource**
- Toggle **Enable as MCP Resource** to ON
- Endpoint is readable via `resources/read`

**Step 3: Deploy**
- Both configurations are active simultaneously
- AI models can choose which method to use

## Working with Parameters

### REST Parameters

REST endpoints can include multiple parameter types in resource URIs:

**Path Parameters:**
- Defined in the endpoint path using `{paramName}` syntax
- Example: `/persons/{id}` → `resource://persons/{id}`

**Query Parameters:**
- Defined in the query parameters list
- Appended to URI path: `/name/{name}/age/{age}`

**Example with Both:**
```json
{
  "path": "/persons/{id}",
  "pathParameters": [
    {"name": "id", "type": "string"}
  ],
  "queryParameters": [
    {"name": "includeDetails", "type": "boolean"}
  ]
}
```

**Resource URI:**
```
resource://persons/{id}/includeDetails/{includeDetails}
```

**Usage:**
```
resource://persons/123/includeDetails/true
```

### gRPC, GraphQL, and SOAP Parameters

For these protocols, all parameters come from the input message definition:

**Example (gRPC):**
```json
{
  "inputType": "GetPersonRequest"
}
```

**Message Definition:**
```json
{
  "name": "GetPersonRequest",
  "fields": [
    {"name": "id", "type": "string"},
    {"name": "includeDetails", "type": "boolean"}
  ]
}
```

**Resource URI:**
```
resource://PersonService/GetPerson/id/{id}/includeDetails/{includeDetails}
```

**Usage:**
```
resource://PersonService/GetPerson/id/123/includeDetails/true
```

### Parameter Type Support

**Supported Types:**
- `string` - text values
- `number` - numeric values
- `integer` - whole numbers
- `boolean` - true/false values
- Arrays of the above types

**Not Supported:**
- Nested objects
- Complex types
- Arrays of objects

## Binary Resources

Resources can also serve binary content like images, PDFs, and other files.

### Configuring Binary Resources

**Step 1: Set Response Format**
- In the endpoint configuration, set **Response Format** to **Binary**

**Step 2: Specify MIME Type**
- Set the appropriate MIME type:
  - Images: `image/png`, `image/jpeg`, `image/gif`
  - Documents: `application/pdf`, `application/msword`
  - Audio: `audio/mpeg`, `audio/wav`
  - Video: `video/mp4`, `video/webm`

**Step 3: Enable as Resource**
- Toggle **Enable as MCP Resource** to ON

### Example: Profile Picture Resource

```json
{
  "name": "getProfilePicture",
  "apiType": "rest",
  "method": "GET",
  "path": "/users/{userId}/profile-picture",
  "description": "Get user profile picture",
  "enabled": false,
  "enabledAsResource": true,
  "responseFormat": "binary",
  "resourceConfig": {
    "uriTemplate": "users/{userId}/picture",
    "mimeType": "image/png"
  },
  "pathParameters": [
    {"name": "userId", "type": "string"}
  ]
}
```

**Resource URI:**
```
resource://users/{userId}/picture
```

**Usage:**
```
resource://users/123/picture
```

**Response:**
The resource returns base64-encoded binary data with the specified MIME type, which AI models can display or process appropriately.

## Protocol-Specific Notes

### REST

**Advantages:**
- Natural fit for resource model
- Path and query parameters map directly to URIs
- HTTP GET methods are resource-friendly

**URI Components:**
- Path parameters → part of resource path
- Query parameters → appended to resource path
- Both combined into single URI template

### gRPC

**Advantages:**
- Strongly typed parameters from protobuf
- Field definitions guide URI template generation

**Considerations:**
- Service and method names included in default URI
- Custom templates recommended for cleaner URIs
- Only flat message fields supported

### GraphQL

**Advantages:**
- Queries naturally represent read-only data
- Input types clearly define parameters

**Restrictions:**
- Only query operations can be resources
- Mutations explicitly blocked
- Custom templates highly recommended

### SOAP

**Advantages:**
- SOAP actions map to resource operations
- WSDL provides parameter definitions

**Considerations:**
- SOAP action name in default URI
- Custom templates improve readability
- XML responses converted to JSON/binary for MCP

## Testing Resources

### Validation Checklist

- [ ] Resource appears in `resources/list` response
- [ ] Resource URI follows expected pattern
- [ ] Parameters are correctly embedded in URI
- [ ] `resources/read` returns correct data
- [ ] MIME type matches response content
- [ ] Binary resources return base64-encoded data
- [ ] Tool and resource (if both) return consistent data
