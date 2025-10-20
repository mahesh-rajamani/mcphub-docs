# Using MCPHub with LangChain

Learn how to integrate your MCPHub-deployed MCP servers with LangChain for powerful AI applications using Python.

## Overview

This guide shows you how to:
- Set up a Python environment with LangChain and LangGraph
- Connect to your MCPHub-deployed MCP servers
- Use MCP tools through the LangChain MCP adapter
- Build interactive AI agents that can call your APIs

## Prerequisites

- MCPHub running with deployed MCPs ([Quick Install](../getting-started/quick-install.md))
- Python 3.8+ installed
- OpenAI API key
- Basic familiarity with Python and async programming

## Step 1: Install Required Packages

Create a new Python project and install dependencies:

```bash
# Create project directory
mkdir mcphub-langchain-agent
cd mcphub-langchain-agent

# Create virtual environment
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

# Install required packages
pip install langchain-mcp-adapters langchain-openai langgraph
```

## Step 2: Set Up Environment Variables

Create a `.env` file in your project directory:

```bash title=".env"
# MCP Server URL - update with your MCPHub server endpoint
MCP_URL=http://localhost:3001/system/weather-gov-api/mcp

# Authentication - choose the method your MCP server requires
# For Basic Auth (username:password encoded in base64):
BASIC_AUTH=YWRtaW46eW91cl9wYXNzd29yZA==

# For JWT token:
# JWT_TOKEN=your_jwt_token_here

# For OAuth2 token:
# OAUTH_TOKEN=your_oauth2_token_here

# OpenAI API Key - required for the AI agent
OPENAI_API_KEY=sk-proj-your_openai_api_key_here

# Enable MCP debug logging to see HTTP requests (optional)
DEBUG_MCP=false

# System message to guide the LLM (optional)
SYSTEM_MESSAGE=When calling tools: 1) Check the tool schema for REQUIRED parameters and always include them. 2) If a tool call fails with an error, DO NOT retry the same call - instead report the error to the user. 3) Only use 'fields' parameter if the user explicitly asks for specific fields.

# Recursion limit for agent (optional, default: 25)
RECURSION_LIMIT=25
```

**Note on Authentication:**
- To generate `BASIC_AUTH`: `echo -n "username:password" | base64`
- Replace `MCP_URL` with your actual MCPHub deployment URL (format: `http://host:port/tenantId/mcpName/mcp`)
- Get your OpenAI API key from [OpenAI Platform](https://platform.openai.com/api-keys)

## Step 3: Create the Interactive Agent

Create a file named `interactive_agent.py`:

```python title="interactive_agent.py"
#!/usr/bin/env python3
"""
Interactive MCP agent using LangChain and LangGraph
"""
import asyncio
import os
import logging
import sys
from pathlib import Path
from langchain_mcp_adapters.client import MultiServerMCPClient
from langchain_openai import ChatOpenAI
from langgraph.prebuilt import create_react_agent

# Set logging to INFO level only
logging.basicConfig(level=logging.INFO, format='%(name)s - %(levelname)s - %(message)s')

# Load environment variables from .env file
def load_env():
    """Load environment variables from .env file"""
    env_path = Path(__file__).parent / '.env'
    if env_path.exists():
        with open(env_path) as f:
            for line in f:
                line = line.strip()
                if line and not line.startswith('#') and '=' in line:
                    key, value = line.split('=', 1)
                    os.environ[key] = value
        print(f"📄 Loaded configuration from {env_path}")
    else:
        print(f"⚠️  No .env file found at {env_path}")

# Load .env on import
load_env()

# Check if debug mode is enabled (after loading .env)
DEBUG_MCP = os.getenv("DEBUG_MCP", "false").lower() == "true"

if DEBUG_MCP:
    # Enable detailed HTTP and MCP logging
    logging.getLogger("httpx").setLevel(logging.DEBUG)
    logging.getLogger("httpcore").setLevel(logging.DEBUG)
    logging.getLogger("mcp").setLevel(logging.DEBUG)
    print("🔍 MCP Debug logging enabled")
else:
    # Reduce HTTP noise in normal mode
    logging.getLogger("httpx").setLevel(logging.WARNING)
    logging.getLogger("httpcore").setLevel(logging.WARNING)

# Apply the patches for JSON-RPC compatibility
def patch_jsonrpc_validation():
    """Patch JSON-RPC message validation to fix id=null issues"""
    try:
        from mcp.types import JSONRPCMessage

        original_model_validate_json = JSONRPCMessage.model_validate_json

        @classmethod
        def patched_model_validate_json(cls, json_data, **kwargs):
            if isinstance(json_data, (str, bytes)):
                import json
                data = json.loads(json_data)
            else:
                data = json_data

            # Handle empty dict responses (notifications that return {})
            if isinstance(data, dict) and not data:
                # These are notification acknowledgments - create a minimal valid response
                data = {"jsonrpc": "2.0", "result": {}, "id": 0}
            elif isinstance(data, dict) and data.get('jsonrpc') == '2.0':
                if 'result' in data and data.get('id') is None:
                    data['id'] = 1
                elif 'method' in data and data.get('id') is None:
                    data['id'] = 1

            fixed_json = json.dumps(data) if not isinstance(json_data, str) else json.dumps(data)
            return original_model_validate_json(fixed_json, **kwargs)

        JSONRPCMessage.model_validate_json = patched_model_validate_json

    except ImportError:
        pass

def patch_list_tools_result():
    try:
        from mcp.types import ListToolsResult

        original_model_validate = ListToolsResult.model_validate

        @classmethod
        def patched_model_validate(cls, obj, **kwargs):
            if isinstance(obj, dict) and not obj:
                obj = {"tools": []}
            elif isinstance(obj, dict) and "tools" not in obj:
                obj["tools"] = []

            return original_model_validate(obj, **kwargs)

        ListToolsResult.model_validate = patched_model_validate

    except ImportError:
        pass

def patch_output_schema_validation():
    """Disable output schema validation to accept text responses"""
    try:
        from mcp.client.session import ClientSession

        # Replace the validation method with a no-op
        async def patched_validate_tool_result(self, name: str, result) -> None:
            """Skip output schema validation"""
            pass

        ClientSession._validate_tool_result = patched_validate_tool_result
        print("✅ Disabled output schema validation")

    except ImportError as e:
        print(f"⚠️  Could not patch output schema validation: {e}")
        pass

# Apply patches
patch_jsonrpc_validation()
patch_list_tools_result()
patch_output_schema_validation()

# Global variables to cache tools and agent
cached_tools = None
cached_agent = None
cached_client = None

async def initialize_agent():
    """Initialize the MCP client, tools, and agent once at startup"""
    global cached_tools, cached_agent, cached_client

    # Get configuration from environment (loaded from .env)
    mcp_url = os.getenv("MCP_URL", "http://localhost:3001/system/weather-gov-api/mcp")
    openai_key = os.getenv("OPENAI_API_KEY")

    if not openai_key:
        print("❌ OpenAI API key not found in .env file")
        print("   Please set OPENAI_API_KEY in your .env file")
        return False

    print(f"🎯 Target: {mcp_url}")

    try:
        print("1. Connecting to MCPHub and discovering tools...")

        # Get authentication if available
        jwt_token = os.getenv("JWT_TOKEN")
        oauth_token = os.getenv("OAUTH_TOKEN")
        basic_auth = os.getenv("BASIC_AUTH")

        # Configure MCP client with authentication headers
        headers = {}
        if jwt_token:
            headers["Authorization"] = f"Bearer {jwt_token}"
        elif oauth_token:
            headers["Authorization"] = f"Bearer {oauth_token}"
        elif basic_auth:
            headers["Authorization"] = f"Basic {basic_auth}"

        client_config = {
            "transport": "streamable_http",
            "url": mcp_url
        }

        if headers:
            client_config["headers"] = headers

        cached_client = MultiServerMCPClient({
            "mcphub_server": client_config
        })

        # Get tools once
        cached_tools = await cached_client.get_tools()

        if not cached_tools:
            print("   No tools available")
            return False

        print(f"   ✅ Found {len(cached_tools)} tools")

        print("\n2. Initializing OpenAI LLM...")
        llm = ChatOpenAI(model="gpt-4o-mini", temperature=0, api_key=openai_key)

        print("3. Creating React agent...")
        cached_agent = create_react_agent(llm, cached_tools)

        print("✅ Agent initialized and ready!")
        return True

    except Exception as e:
        print(f"❌ Failed to initialize agent: {e}")
        return False

async def execute_user_request(user_input, system_message=None, debug=False):
    """Execute a user request using the cached MCP agent"""
    global cached_agent

    if not cached_agent:
        print("❌ Agent not initialized")
        return

    try:
        print(f"🔄 Processing request: {user_input}")
        print("-" * 60)

        # Prepare messages with optional system message
        messages = []
        if system_message:
            messages.append({"role": "system", "content": system_message})
        messages.append({"role": "user", "content": user_input})

        # Execute the request with configurable recursion limit (default: 25)
        recursion_limit = int(os.getenv("RECURSION_LIMIT", "25"))
        result = await cached_agent.ainvoke(
            {"messages": messages},
            {"recursion_limit": recursion_limit}
        )

        if debug:
            print("\n📋 Agent Response:")
            print("=" * 60)

            # Display the conversation with step counter
            step_num = 0
            for message in result["messages"]:
                message_type = message.__class__.__name__

                if message_type == 'HumanMessage':
                    print(f"👤 USER: {message.content}\n")
                elif message_type == 'AIMessage':
                    step_num += 1
                    if hasattr(message, 'tool_calls') and message.tool_calls:
                        print(f"🤖 STEP {step_num} - ASSISTANT is calling tools:")
                        for tool_call in message.tool_calls:
                            import json
                            tool_name = tool_call.get('name', 'unknown')
                            tool_args = tool_call.get('args', {})
                            tool_id = tool_call.get('id', 'unknown')

                            print(f"   📞 TOOL CALL: {tool_name}")
                            print(f"      ID: {tool_id}")

                            # Show the full MCP request that will be made
                            print(f"      🔍 MCP REQUEST:")
                            print(f"         Method: tools/call")
                            print(f"         Tool: {tool_name}")
                            print(f"         Arguments:")
                            for key, value in tool_args.items():
                                print(f"            {key}: {json.dumps(value, indent=15)}")
                        print()
                    elif message.content:
                        print(f"🤖 STEP {step_num} - ASSISTANT: {message.content}\n")
                elif message_type == 'ToolMessage':
                    print(f"🔧 TOOL RESULT:")
                    print(f"   Tool: {getattr(message, 'name', 'unknown')}")
                    # Check if result indicates an error
                    content = message.content
                    if isinstance(content, str):
                        if 'error' in content.lower() or 'exception' in content.lower() or 'failed' in content.lower():
                            print(f"   ⚠️  ERROR DETECTED:")
                            print(f"   {content[:500]}")
                        else:
                            print(f"   ✅ SUCCESS:")
                            print(f"   {content[:500]}")
                    else:
                        print(f"   {content}")
                    print()

            print("=" * 60)
        else:
            # Compact output - just show final response
            for message in result["messages"]:
                message_type = message.__class__.__name__
                if message_type == 'AIMessage' and message.content and not (hasattr(message, 'tool_calls') and message.tool_calls):
                    print(f"\n🤖 {message.content}")

        print("✅ Request completed!")

    except Exception as e:
        if "recursion_limit" in str(e).lower():
            print(f"\n⚠️ Request took too many steps to complete (limit: {recursion_limit})")
            if debug:
                print("   This usually means the agent is stuck in a loop.")
                print("\n🔍 Check the TOOL RESULTS above for errors")
            else:
                print("   Run with --debug flag to see detailed step-by-step output")
        else:
            print(f"❌ Agent failed with error: {e}")
            if debug:
                import traceback
                print("\n🔍 Full traceback:")
                traceback.print_exc()

async def cleanup():
    """Clean up resources"""
    global cached_client
    if cached_client:
        try:
            await cached_client.aclose()
        except AttributeError:
            pass

async def interactive_mode(debug=False):
    """Run in interactive mode"""
    print("🤖 MCPHub Interactive Agent")
    print("=" * 50)

    # Initialize agent once at startup
    if not await initialize_agent():
        return

    # Check for custom system message
    system_message = os.getenv("SYSTEM_MESSAGE")
    if system_message:
        print(f"📋 Using custom system message: {system_message[:100]}{'...' if len(system_message) > 100 else ''}")

    if debug:
        print("🐛 DEBUG MODE ENABLED")

    print("\n💡 Type your request and press Enter")
    print("   Type 'exit' or 'quit' to end")
    print("=" * 50)

    print("\n📝 Example requests:")
    print("   - What are the current weather alerts for California?")
    print("   - Get weather forecast for New York")
    print("   - Search for persons named Smith")
    print("=" * 50)

    try:
        while True:
            print("\n")
            user_input = input("👤 You: ").strip()

            if user_input.lower() in ['exit', 'quit']:
                print("👋 Goodbye!")
                break
            elif not user_input:
                continue

            await execute_user_request(user_input, system_message, debug)

    except KeyboardInterrupt:
        print("\n\n👋 Session interrupted. Goodbye!")
    finally:
        await cleanup()

async def main():
    """Main entry point"""
    # Check for --debug flag
    debug = '--debug' in sys.argv
    if debug:
        sys.argv.remove('--debug')

    if len(sys.argv) > 1:
        # If command line argument provided, execute it and exit
        user_input = ' '.join(sys.argv[1:])
        print(f"📝 Executing: {user_input}")

        # Initialize agent for single command
        if await initialize_agent():
            system_message = os.getenv("SYSTEM_MESSAGE")
            await execute_user_request(user_input, system_message, debug)
            await cleanup()
    else:
        # Interactive mode
        await interactive_mode(debug)

if __name__ == "__main__":
    asyncio.run(main())
```

## Step 4: Run the Interactive Agent

### Interactive Mode

Run the agent in interactive mode to ask multiple questions:

```bash
python interactive_agent.py
```

You'll see output like:

```
📄 Loaded configuration from .env
✅ Disabled output schema validation
🤖 MCPHub Interactive Agent
==================================================
🎯 Target: http://localhost:3001/system/weather-gov-api/mcp
1. Connecting to MCPHub and discovering tools...
   ✅ Found 8 tools

2. Initializing OpenAI LLM...
3. Creating React agent...
✅ Agent initialized and ready!

💡 Type your request and press Enter
   Type 'exit' or 'quit' to end
==================================================

📝 Example requests:
   - What are the current weather alerts for California?
   - Get weather forecast for New York
   - Search for persons named Smith
==================================================


👤 You:
```

### Single Command Mode

Execute a single command and exit:

```bash
python interactive_agent.py "What are the weather alerts for Texas?"
```

### Debug Mode

Enable detailed step-by-step output:

```bash
python interactive_agent.py --debug
```

Or for single command:

```bash
python interactive_agent.py --debug "Get weather forecast for Seattle"
```

## Sample Interactions

### Example 1: Weather Alerts

```
👤 You: What are the current weather alerts for California?

🔄 Processing request: What are the current weather alerts for California?
------------------------------------------------------------

🤖 There are currently 23 active weather alerts for California. Here are some of the alerts:

1. **Red Flag Warning** - Valid until Oct 19, 10:00 PM PDT
   - Areas: Northern and Southern Salinas Valley

2. **Wind Advisory** - Valid until Oct 19, 8:00 PM PDT
   - Areas: San Francisco Bay Area

3. **High Surf Advisory** - Valid until Oct 20, 3:00 AM PDT
   - Areas: San Luis Obispo County Beaches

✅ Request completed!
```

### Example 2: Person Search (if using person MCP)

```
👤 You: Create a person named Alice Johnson, age 28

🔄 Processing request: Create a person named Alice Johnson, age 28
------------------------------------------------------------

🤖 I've successfully created a person record for Alice Johnson, age 28.

✅ Request completed!
```

## Understanding the Code

### Key Components

#### 1. Environment Configuration
The agent loads configuration from `.env` file, supporting:
- MCP server URLs
- Multiple authentication methods (Basic, JWT, OAuth2)
- OpenAI API configuration
- Debug settings

#### 2. JSON-RPC Patches
The code includes patches to handle MCPHub's JSON-RPC responses:
- `patch_jsonrpc_validation()`: Fixes `id=null` issues
- `patch_list_tools_result()`: Handles empty tool lists
- `patch_output_schema_validation()`: Accepts text responses

#### 3. Agent Initialization
- Connects to MCP server once at startup
- Discovers available tools
- Creates a React agent with LangGraph

#### 4. Request Execution
- Supports both interactive and single-command modes
- Configurable recursion limit
- Optional debug mode for detailed output

## Configuration Options

### Debug Mode

Enable detailed logging:

```bash
# In .env
DEBUG_MCP=true
```

Or use the `--debug` flag when running.

### System Message

Guide the LLM's behavior:

```bash
# In .env
SYSTEM_MESSAGE=You are a helpful assistant. Always be concise and accurate.
```

### Recursion Limit

Control how many steps the agent can take:

```bash
# In .env
RECURSION_LIMIT=50  # Default is 25
```

## Troubleshooting

### "OpenAI API key not found"

Make sure your `.env` file has:
```bash
OPENAI_API_KEY=sk-proj-your_actual_key_here
```

### "No tools available"

Check:
1. MCPHub is running at the specified URL
2. The MCP is deployed in MCPHub
3. Authentication credentials are correct

### "Request took too many steps"

The agent hit the recursion limit. Try:
1. Increase `RECURSION_LIMIT` in `.env`
2. Simplify your request
3. Run with `--debug` to see what's happening

### Connection Errors

Verify:
1. MCPHub URL is correct (format: `http://host:port/tenantId/mcpName/mcp`)
2. MCPHub is accessible from your machine
3. Authentication headers are properly configured

## Advanced Usage

### Multiple MCP Servers

Modify the client configuration to connect to multiple MCPs:

```python
cached_client = MultiServerMCPClient({
    "weather_api": {
        "transport": "streamable_http",
        "url": "http://localhost:3001/system/weather-gov-api/mcp",
        "headers": {"Authorization": f"Basic {basic_auth}"}
    },
    "person_api": {
        "transport": "streamable_http",
        "url": "http://localhost:3001/system/person-rest/mcp",
        "headers": {"Authorization": f"Basic {basic_auth}"}
    }
})
```

### Custom Models

Change the OpenAI model:

```python
llm = ChatOpenAI(model="gpt-4", temperature=0, api_key=openai_key)
```

### Error Handling

The agent includes comprehensive error handling:
- Network errors
- Authentication failures
- Tool execution errors
- Recursion limit exceeded

The combination of MCPHub and LangChain provides a powerful foundation for building AI applications that can interact with any API through natural language!
