# Import REST Endpoint using cURL

Import REST endpoint configurations from existing cURL commands.

## Accessing cURL Import

This feature is only supported for REST endpoints in the Endpoints tab. The cURL import widget can be opened by clicking the **"Import curl"** button in the Endpoints tab.

## Supported cURL Features

- HTTP methods: GET, POST, PUT, DELETE, PATCH
- Headers and authentication
- Query parameters
- Request body (JSON, form data, text)
- URL parsing and path extraction

## Example cURL Commands

### Simple GET Request
```bash
curl -X GET "https://api.example.com/users/123"
```

### POST with JSON Data
```bash
curl -X POST "https://api.example.com/users" \
  -H "Content-Type: application/json" \
  -d '{"name": "John", "email": "john@example.com"}'
```

### Authentication Headers
```bash
curl -X GET "https://api.example.com/protected" \
  -H "Authorization: Bearer your-token-here"
```

### Query Parameters
```bash
curl -X GET "https://api.example.com/search?q=test&limit=10"
```

## Import Process

1. **Paste cURL Command**: Enter your curl command in the text area
2. **Validation**: System validates syntax and extracts components
3. **Preview**: Review the generated endpoint configuration
4. **Import**: Click "Import Endpoint" to add to your MCP

## Automatic Conversion

The system automatically converts:
- URL path to endpoint path
- Headers to endpoint headers
- Query parameters to endpoint parameters
- Request body to body parameters
- HTTP method to endpoint method

**Path Parameters**: If any part of the URL needs to be made into a path parameter, you can change that part with `{paramName}` syntax. For example, change `https://api.example.com/users/123` to `https://api.example.com/users/{userId}` to make `123` a path parameter.