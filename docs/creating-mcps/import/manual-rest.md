# Import REST Endpoint using cURL

Import REST endpoint configurations from existing cURL commands.

## Accessing cURL Import

1. Open MCP Studio
2. Select **REST** protocol
3. Click **Add Endpoint**
4. Select **Import from cURL**

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