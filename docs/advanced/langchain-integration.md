# Using MCPHub with LangChain

Learn how to integrate your MCPHub-deployed MCP servers with LangChain for powerful AI applications using Python.

## Overview

This guide shows you how to:
- Set up a Python environment with LangChain
- Connect to your MCPHub-deployed MCP servers
- Use MCP tools as LangChain tools
- Build AI applications that can call your APIs

## Prerequisites

- MCPHub running with deployed MCPs ([Quick Install](../getting-started/quick-install.md))
- Python 3.8+ installed
- OpenAI API key
- Basic familiarity with Python

## Step 1: Install Required Packages

Create a new Python project and install dependencies:

```bash
# Create project directory
mkdir mcphub-langchain-demo
cd mcphub-langchain-demo

# Create virtual environment
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

# Install required packages
pip install langchain langchain-openai requests python-dotenv
```

## Step 2: Set Up Environment Variables

Create a `.env` file in your project directory:

```bash title=".env"
OPENAI_API_KEY=your_openai_api_key_here
OPENAI_MODEL=gpt-4
MCPHUB_BASE_URL=http://localhost:8080
```

## Step 3: Download the Sample Code

Create the main application file:

```python title="mcphub_langchain_demo.py"
#!/usr/bin/env python3
"""
MCPHub LangChain Integration Demo

This script demonstrates how to use MCPHub-deployed MCP servers
as tools in LangChain applications.
"""

import os
import json
import requests
from typing import List, Dict, Any, Optional
from dotenv import load_dotenv

from langchain.tools import Tool
from langchain.agents import AgentType, initialize_agent
from langchain_openai import ChatOpenAI
from langchain.schema import BaseMessage, SystemMessage

# Load environment variables
load_dotenv()

class MCPHubTool:
    """Wrapper for MCPHub MCP tools to use with LangChain"""
    
    def __init__(self, mcp_url: str, tool_name: str, tool_info: Dict[str, Any]):
        self.mcp_url = mcp_url
        self.tool_name = tool_name
        self.tool_info = tool_info
        self.description = tool_info.get('description', f'Execute {tool_name}')
        
    def execute(self, **kwargs) -> str:
        """Execute the MCP tool and return results"""
        try:
            # Prepare the request payload for MCP protocol
            payload = {
                "jsonrpc": "2.0",
                "id": 1,
                "method": "tools/call",
                "params": {
                    "name": self.tool_name,
                    "arguments": kwargs
                }
            }
            
            # Make request to MCP server
            response = requests.post(
                self.mcp_url,
                json=payload,
                headers={"Content-Type": "application/json"},
                timeout=30
            )
            response.raise_for_status()
            
            # Parse MCP response
            result = response.json()
            if "error" in result:
                return f"Error: {result['error']['message']}"
            
            # Extract and format the result
            tool_result = result.get("result", {})
            if isinstance(tool_result, dict):
                return json.dumps(tool_result, indent=2)
            return str(tool_result)
            
        except requests.exceptions.RequestException as e:
            return f"Network error: {str(e)}"
        except Exception as e:
            return f"Execution error: {str(e)}"

class MCPHubIntegration:
    """Main class for integrating MCPHub with LangChain"""
    
    def __init__(self, openai_api_key: str, model_name: str = "gpt-4"):
        """
        Initialize MCPHub LangChain integration
        
        Args:
            openai_api_key: Your OpenAI API key
            model_name: OpenAI model to use (default: gpt-4)
        """
        self.llm = ChatOpenAI(
            api_key=openai_api_key,
            model=model_name,
            temperature=0
        )
        self.tools = []
        self.agent = None
        self.system_prompt = self._create_system_prompt()
        
    def _create_system_prompt(self) -> str:
        """Create a comprehensive system prompt for the AI agent"""
        return """You are an AI assistant with access to various tools through the Model Context Protocol (MCP).

Your role is to help users interact with different APIs and services by:

1. **Understanding User Intent**: Carefully analyze what the user is asking for
2. **Tool Selection**: Choose the most appropriate tools from those available to you
3. **Parameter Handling**: Use the correct parameters and formats when calling tools
4. **Error Handling**: If a tool call fails, explain the issue and suggest alternatives
5. **Response Formatting**: Present results in a clear, user-friendly manner

Guidelines for tool usage:
- Always read tool descriptions carefully before using them
- Use exact parameter names and types as specified by the tool
- If you're unsure about a parameter, ask the user for clarification
- Provide helpful context about what each tool does
- Combine multiple tool calls when needed to answer complex questions

When working with data:
- Format responses clearly and concisely
- Highlight important information
- If data seems incomplete or unexpected, mention this to the user

Remember: You have access to real APIs through MCP tools, so your actions can have real effects. Always be careful and confirm with users before making changes to data."""
        
    def add_mcp_server(self, mcp_url: str) -> bool:
        """
        Add an MCP server and load its tools
        
        Args:
            mcp_url: URL to the MCP server (e.g., http://localhost:8080/swagger-petstore/mcp)
            
        Returns:
            bool: True if successful, False otherwise
        """
        try:
            # Get available tools from MCP server
            payload = {
                "jsonrpc": "2.0",
                "id": 1,
                "method": "tools/list"
            }
            
            response = requests.post(
                mcp_url,
                json=payload,
                headers={"Content-Type": "application/json"},
                timeout=10
            )
            response.raise_for_status()
            
            result = response.json()
            if "error" in result:
                print(f"Error loading MCP server {mcp_url}: {result['error']['message']}")
                return False
            
            # Convert MCP tools to LangChain tools
            mcp_tools = result.get("result", {}).get("tools", [])
            for tool_info in mcp_tools:
                tool_name = tool_info["name"]
                mcp_tool = MCPHubTool(mcp_url, tool_name, tool_info)
                
                # Create LangChain tool (capture variables by value to avoid closure issues)
                def create_tool_func(mcp_tool_instance, current_tool_name, current_tool_info):
                    def tool_func(*args, **kwargs):
                        # Handle both string input and kwargs from LangChain
                        if args and len(args) == 1 and isinstance(args[0], str):
                            # Try to parse as JSON if it's a string
                            import json
                            try:
                                if args[0].strip():
                                    parsed_args = json.loads(args[0])
                                    if isinstance(parsed_args, dict):
                                        kwargs.update(parsed_args)
                                    else:
                                        # JSON parsed successfully but not a dict, treat as single parameter
                                        raise ValueError("Not a dict")
                                # If empty string or parsing fails, use empty kwargs
                            except (json.JSONDecodeError, ValueError):
                                # If not valid JSON dict, try to map to the first required parameter
                                if args[0].strip():
                                    # Get the input schema to find the correct parameter name
                                    input_schema = current_tool_info.get('inputSchema', {})
                                    properties = input_schema.get('properties', {})
                                    required = input_schema.get('required', [])
                                    
                                    # Use the first required parameter if available
                                    if required and required[0] in properties:
                                        kwargs = {required[0]: args[0]}
                                    # Otherwise use the first parameter
                                    elif properties:
                                        first_param = list(properties.keys())[0]
                                        kwargs = {first_param: args[0]}
                                    # If no parameters defined, leave kwargs empty (don't create artificial parameters)
                        
                        return mcp_tool_instance.execute(**kwargs)
                    return tool_func
                
                langchain_tool = Tool(
                    name=tool_name,
                    description=mcp_tool.description,
                    func=create_tool_func(mcp_tool, tool_name, tool_info)
                )
                
                self.tools.append(langchain_tool)
                print(f"Added tool: {tool_name}")
            
            print(f"Successfully loaded {len(mcp_tools)} tools from {mcp_url}")
            return True
            
        except Exception as e:
            print(f"Failed to load MCP server {mcp_url}: {str(e)}")
            return False
    
    def initialize_agent(self):
        """Initialize the LangChain agent with loaded tools"""
        if not self.tools:
            raise ValueError("No tools loaded. Add at least one MCP server first.")
        
        # Add system prompt as agent kwargs
        agent_kwargs = {
            "system_message": self.system_prompt
        }
        
        self.agent = initialize_agent(
            tools=self.tools,
            llm=self.llm,
            agent=AgentType.ZERO_SHOT_REACT_DESCRIPTION,
            verbose=True,
            handle_parsing_errors=True,
            agent_kwargs=agent_kwargs
        )
        print(f"Agent initialized with {len(self.tools)} tools and system prompt")
    
    def query(self, question: str) -> str:
        """
        Ask the AI agent a question
        
        Args:
            question: Natural language question
            
        Returns:
            str: Agent's response
        """
        if not self.agent:
            raise ValueError("Agent not initialized. Call initialize_agent() first.")
        
        try:
            # Use invoke instead of deprecated run method
            response = self.agent.invoke({"input": question})
            # Extract the output from the response
            if isinstance(response, dict) and "output" in response:
                return response["output"]
            return str(response)
        except Exception as e:
            return f"Error processing query: {str(e)}"
    
    def get_available_tools(self) -> List[str]:
        """Get list of available tool names and descriptions"""
        tool_info = []
        for tool in self.tools:
            tool_info.append(f"- {tool.name}: {tool.description}")
        return tool_info

def main():
    """Main function to demonstrate MCPHub + LangChain integration"""
    
    # Configuration
    OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
    OPENAI_MODEL = os.getenv("OPENAI_MODEL", "gpt-4")
    MCPHUB_BASE_URL = os.getenv("MCPHUB_BASE_URL", "http://localhost:8080")
    
    # Validate configuration
    if not OPENAI_API_KEY:
        print("Error: OPENAI_API_KEY not found in environment variables")
        print("Please set your OpenAI API key in the .env file")
        return
    
    print("🚀 MCPHub + LangChain Integration Demo")
    print("=" * 50)
    
    # Initialize integration
    integration = MCPHubIntegration(OPENAI_API_KEY, OPENAI_MODEL)
    
    # Add MCP servers (modify these URLs based on your deployed MCPs)
    mcp_urls = [
        f"{MCPHUB_BASE_URL}/default/person-rest-oauth/mcp",
        # Add more MCP URLs here as needed
        # f"{MCPHUB_BASE_URL}/default/your-other-mcp/mcp",
    ]
    
    print("\n📡 Loading MCP servers...")
    for url in mcp_urls:
        print(f"Loading: {url}")
        integration.add_mcp_server(url)
    
    # Initialize agent
    print("\n🤖 Initializing AI agent...")
    try:
        integration.initialize_agent()
    except ValueError as e:
        print(f"Error: {e}")
        return
    
    # Show available tools
    print("\n🔧 Available Tools:")
    available_tools = integration.get_available_tools()
    for tool_info in available_tools:
        print(f"  {tool_info}")
    
    # Interactive demo
    print("\n✨ Ready for questions! Type 'quit' to exit.")
    print("\nExample queries:")
    print("- 'Create a person named John Doe with email john@example.com'")
    print("- 'Get all persons from the system'")
    print("- 'Find a person by the name John'")
    print("- 'What tools are available to me?'")
    print("- 'Create a person with family information including spouse and children'")
    
    while True:
        try:
            question = input("\n❓ Your question: ").strip()
            
            if question.lower() in ['quit', 'exit', 'q']:
                print("👋 Goodbye!")
                break
            
            if not question:
                continue
            
            print("\n🤔 Thinking...")
            response = integration.query(question)
            print(f"\n💡 Response: {response}")
            
        except KeyboardInterrupt:
            print("\n👋 Goodbye!")
            break
        except Exception as e:
            print(f"\n❌ Error: {e}")

if __name__ == "__main__":
    main()
```

## Step 4: Configure Your Environment

1. **Get your OpenAI API key**:
   - Visit [OpenAI Platform](https://platform.openai.com/api-keys)
   - Create a new API key
   - Copy it to your `.env` file

2. **Verify your MCPHub deployment**:
   - Ensure MCPHub is running on `http://localhost:8080`
   - Verify you have deployed MCPs (e.g., the petstore MCP from the tutorial)

3. **Update MCP URLs** in the script:
   ```python
   mcp_urls = [
       f"{MCPHUB_BASE_URL}/default/person-rest-oauth/mcp",
       f"{MCPHUB_BASE_URL}/default/your-other-mcp/mcp",
   ]
   ```

## Step 5: Run the Demo

Start the interactive demo:

```bash
python mcphub_langchain_demo.py
```

You should see output like:
```
🚀 MCPHub + LangChain Integration Demo
==================================================

📡 Loading MCP servers...
Loading: http://localhost:8080/default/person-rest-oauth/mcp
Added tool: createPerson
Added tool: getPersonByName
Added tool: getAllPersons
Added tool: getPersonById
Added tool: updatePerson
Added tool: deletePerson
Successfully loaded 6 tools from http://localhost:8080/default/person-rest-oauth/mcp

🔧 Available Tools:
  - createPerson: Create a new person record with OAuth 2.0 authentication
  - getPersonByName: Retrieve a person by their name with OAuth 2.0 authentication
  - getAllPersons: Retrieve all persons from the system with OAuth 2.0 authentication
  - getPersonById: Retrieve a specific person by their ID with OAuth 2.0 authentication
  - updatePerson: Update an existing person record with OAuth 2.0 authentication
  - deletePerson: Delete a person record with OAuth 2.0 authentication

🤖 Initializing AI agent...
Agent initialized with 6 tools and system prompt

✨ Ready for questions! Type 'quit' to exit.
```

## Step 6: Test AI Queries

Try these example queries:

```
❓ Your question: Get all persons from the system

❓ Your question: Create a person named Alice with email alice@example.com

❓ Your question: Find a person by the name John

❓ Your question: Create a person with family information including spouse and children
```

## Sample Output

When you ask "Get all persons from the system", you'll see:

```
🤔 Thinking...

> Entering new AgentExecutor chain...
I need to retrieve all persons from the system. I should use the GetAllPersons tool.

Action: GetAllPersons
Action Input: {}
Observation: {
  "content": [
    {
      "type": "text", 
      "text": "{\"persons\":[{\"name\":\"John Doe\",\"age\":30,\"email\":\"john@example.com\"},{\"name\":\"Jane Smith\",\"age\":25,\"email\":\"jane@example.com\"}]}"
    }
  ]
}

Final Answer: I found all persons in the system. Here are the current records:

1. **John Doe**
   - Age: 30
   - Email: john@example.com

2. **Jane Smith** 
   - Age: 25
   - Email: jane@example.com

The system currently has 2 person records.
```

## Key Features

### Smart Parameter Mapping
The integration automatically maps LangChain's string arguments to the correct MCP tool parameters:

- **JSON Input**: If the AI provides structured JSON like `{"name": "John"}`, it's used directly
- **String Input**: If the AI provides a simple string like `"John"`, it's mapped to the first required parameter
- **No Parameters**: If a tool has no parameters, empty arguments are used

**Example:**
```python
# AI calls: getPersonByName("John")
# Mapped to: {"name": "John"}

# AI calls: getPersonById("123") 
# Mapped to: {"personId": "123"}
```

### Closure Issue Fix
The integration fixes Python closure issues that could cause parameter mapping to use the wrong tool schema:

```python
# Fixed: Variables captured by value
def create_tool_func(mcp_tool_instance, current_tool_name, current_tool_info):
    # Each tool gets its own correct schema
```

## Advanced Usage

### Adding Multiple MCP Servers

```python
# Add multiple MCP servers for different functionalities
mcp_urls = [
    f"{MCPHUB_BASE_URL}/default/person/mcp",        # Person management
    f"{MCPHUB_BASE_URL}/default/weather-api/mcp",   # Weather data
    f"{MCPHUB_BASE_URL}/default/inventory/mcp",     # Inventory operations
]
```

### Custom Tool Descriptions

Enhance tool descriptions for better AI understanding:

```python
# In your MCP configuration, provide detailed descriptions
{
  "name": "CreatePersonWithFamily",
  "description": "Creates a new person record including their family members with detailed attributes such as names, ages, relationships, and addresses. Requires person name, age, email, and optionally spouse and children information."
}
```

### Error Handling

The demo includes comprehensive error handling:
- Network timeouts
- MCP protocol errors
- OpenAI API errors
- Invalid queries

## Best Practices

### 1. Tool Descriptions
- Write clear, specific tool descriptions
- Include parameter examples
- Explain expected return values

### 2. Rate Limiting
- Be mindful of API rate limits
- Implement retry logic for production use
- Consider caching for frequently accessed data

### 3. Security
- Never commit API keys to version control
- Use environment variables
- Validate input parameters

### 4. Performance
- Load MCP servers once at startup
- Use connection pooling for high-volume applications
- Monitor tool execution times

## Troubleshooting

### Common Issues

**"No tools loaded"**
- Verify MCPHub is running
- Check MCP server URLs
- Ensure MCPs are deployed

**"Network error"**
- Check MCPHub connectivity
- Verify port 8080 is accessible
- Check firewall settings

**"OpenAI API error"**
- Verify API key is correct
- Check API usage limits
- Ensure sufficient credits

**"Tool execution failed"**
- Check MCP server logs
- Verify parameter formats
- Test tools individually in MCPHub Studio

### Debug Mode

Enable verbose logging:

```python
import logging
logging.basicConfig(level=logging.DEBUG)
```

## Example Applications

### HR Management System
```python
# Use person MCP for employee inquiries
question = "Create a new employee record for Sarah Johnson with email sarah@company.com"
response = integration.query(question)
```

### Family Database Management
```python
# Create comprehensive family records
question = "Add a new family: John Smith, age 35, with spouse Mary Smith, age 32, and two children: Emma (8) and Alex (12)"
response = integration.query(question)
```

### Contact Management
```python
# Search and retrieve person information
question = "Find all persons named John and show me their contact details"
response = integration.query(question)
```

The combination of MCPHub and LangChain provides a powerful foundation for building AI applications that can interact with any REST API through natural language!