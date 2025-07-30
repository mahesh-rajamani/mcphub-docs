# Custom Code as Tool

Create custom tools using Python code that execute within MCPHub's secure sandbox environment.

## Overview

Custom code tools allow you to create specialized functionality using Python code that runs in a dedicated execution engine. These tools can be used alongside REST, gRPC, and other API services within the same MCP configuration.

The Custom API type is specifically designed for MCPs that primarily use custom code tools but can be combined with traditional API endpoints for hybrid solutions.

## Backend Configuration

For deployed MCPHub services, ensure the Python engine is properly configured and accessible.

### Environment Variables

Configure these environment variables for the MCP Bridge backend:

```bash
# Python Engine Connection
ENGINES_PYTHON_URL=http://python-engine:8082
ENGINES_PYTHON_ENABLED=true
ENGINES_PYTHON_TIMEOUT=30
```

### Docker Deployment

When using Docker Compose, the Python engine runs as a separate service:

```yaml
# Python engine is automatically included in docker-compose.yml
services:
  python-engine:
    image: maheshrajamani/mcphub-python-engine:latest
    ports:
      - "8082:8082"
```

### Health Check

Verify the Python engine is running:

```bash
# Check engine status through MCP Bridge
curl http://localhost:8080/api/admin/engines/status

# Direct engine health check
curl http://localhost:8082/health
```

## Creating Custom Code Tools

### 1. Select Custom API Type

1. Open MCP Studio
2. Create a new MCP or edit an existing one
3. In the **API Types** section, select **Custom** from the dropdown
4. Configure the service name for your custom tools

### 2. Add Custom Code Tool

1. Scroll to the **Tools** section
2. Click **Add Tools** → **Custom Code Tool**
3. Configure the tool parameters:
   - **Tool Name**: Unique identifier (e.g., `calculate_metrics`)
   - **Description**: Clear explanation of what the tool does
   - **Engine Type**: Python 3.11 (automatic)
   - **Enabled**: Toggle to expose the tool to AI models

### 3. Configure Input Parameters

Define the parameters your Python code will receive:

1. Switch to the **Input Parameters** tab
2. Click **Add Input Parameter** for each parameter
3. Configure each parameter:
   - **Name**: Parameter name used in your Python code
   - **Type**: string, number, boolean, array, or object
   - **Required**: Whether the parameter is mandatory
   - **Description**: What this parameter represents
   - **Default Value**: Optional default value or user variable

### 4. Configure Output Parameters

Define what your Python code will return:

1. Switch to the **Output Parameters** tab
2. Click **Add Output Parameter** for each return value
3. Configure each output:
   - **Name**: Output field name
   - **Type**: Data type of the returned value
   - **Description**: What this output represents

### 5. Write Python Code

1. In the **Python Code** section, click **Generate Method Signature** to create a template
2. Write your custom logic within the generated function
3. Use the **AI Code Suggest** button for AI-powered code completion
4. Test your code using the **Test** button

## Python Code Guidelines

### Function Structure

Your Python code should follow this pattern:

```python
def execute(param1: str, param2: int = 10) -> dict:
    """
    Tool description goes here.
    
    Args:
        param1: Description of first parameter
        param2: Description of second parameter with default
        
    Returns:
        Dictionary with output parameters as defined in UI
    """
    # Your custom logic here
    result = perform_calculation(param1, param2)
    
    # Return dictionary matching your configured output parameters
    return {
        "result": result,
        "status": "completed"
    }
```

**Important**: The return dictionary must exactly match the output parameters you configured in the UI. Each key in the returned dictionary should correspond to an output parameter name you defined.

### Available Libraries

The Python execution environment includes:

- **Built-in modules**: `json`, `datetime`, `os`, `sys`, `base64`, `uuid`
- **HTTP clients**: `requests`, `httpx`
- **Data processing**: `json5`, `python-dateutil`
- **Standard exceptions**: `ValueError`, `TypeError`, `RuntimeError`, `KeyError`, `ConnectionError`, `TimeoutError`

### Security Considerations

- Code runs in a sandboxed environment with `RestrictedPython`
- Network access is limited to HTTP/HTTPS requests
- File system access is restricted
- Execution timeout is enforced (30 seconds default)
- Memory usage is monitored and limited

## User Variables in Custom Tools

Custom tools support user variables for dynamic configuration:

### In Input Parameters
- Set default values using `{{variableName}}` syntax
- Variables are resolved at runtime from environment or user settings

### In Code
- Access resolved values through function parameters
- No direct variable substitution in code - use parameters instead

### Example
```python
def execute(api_key: str = "{{userApiKey}}", endpoint: str = "{{serviceEndpoint}}") -> dict:
    # api_key and endpoint will contain resolved variable values
    response = requests.get(f"{endpoint}/data", headers={"Authorization": f"Bearer {api_key}"})
    return {"data": response.json()}
```

## Testing Custom Tools

### Local Testing
1. Use the **Test** button in the code editor
2. Provide sample input values
3. Review execution results and logs

### Integration Testing
1. Deploy your MCP configuration
2. Test the tool through the MCP protocol endpoint
3. Monitor logs in the Python engine for debugging

## Combining with Other APIs

Custom code tools work seamlessly with other API types:

1. **REST + Custom**: Use REST for standard operations, custom code for complex logic
2. **gRPC + Custom**: Combine type-safe gRPC calls with custom data processing
3. **Multiple API Types**: Single MCP can expose REST endpoints, gRPC services, and custom tools