# Quick Install

Get MCPHub running in under 5 minutes with Docker or deploy to the cloud.

The quick install uses a combined image (`mcphub-all`) that bundles all MCPHub microservices (MCP Studio, MCP Bridge, and Python Engine) into a single container for easy testing and evaluation. This image uses in-memory storage for configuration persistence, making it ideal for development and testing but not recommended for production use.

## Option 1: Docker Installation

Single container deployment with all components and built-in nginx:

```bash
docker run -p 3000:3000 \
  -e MCPHUB_AUTH_PASSWORD=admin123 \
  maheshrajamani/mcphub-all:latest
```

**Access the application:**
- **MCP Studio (Frontend)**: http://localhost:3000
- **Default Credentials**:
  - Username: `admin`
  - Password: `admin123` (or the password you set in `MCPHUB_AUTH_PASSWORD`)

**API Access:**
To access the API programmatically, create a Base64-encoded token:
```bash
# Mac/Linux
echo -n "admin:admin123" | base64

# Use in API requests
curl -H "Authorization: Basic YWRtaW46YWRtaW4xMjM=" http://localhost:3000/admin/mcp/configurations
```

> **Note**: The complete image includes nginx that handles routing to all internal services (MCP Bridge API on port 8080 and Python Engine on port 8082). You only need to expose port 3000.

## Option 2: Deploy to Render.com

One-click deployment to Render.com's free tier with auto-generated credentials. Note: Uses in-memory storage.

### Finding Your Deployed MCPHub URL

After deployment completes:

1. Go to your [Render Dashboard](https://dashboard.render.com/)
2. Click on your deployed service (named `mcphub-all`)
3. Click on **"Events"** in the left sidebar
4. Look for deployment events that show your service URL
5. Your MCPHub URL will be in the format: `https://your-service-name.onrender.com`

For complete deployment instructions, see: [MCPHub Render Deployment Guide](https://github.com/mahesh-rajamani/mcphub-render)

## Verification

After installation, verify everything is working:

1. **Access MCP Studio**: Open http://localhost:3000 in your browser

2. **Create Your First MCP**: Follow the [First MCP Guide](first-mcp.md)

## Production Deployment

**Important**: The `mcphub-all` image is designed for quick testing and evaluation only. For production deployments, use individual microservice images with a dedicated database.

### Production-Ready Architecture

For production environments, deploy MCPHub using separate containers for each component:

#### Individual Docker Images

- **MCPHub Server** (Backend API): [`maheshrajamani/mcphub-server`](https://hub.docker.com/r/maheshrajamani/mcphub-server)
- **MCPHub Studio** (Frontend UI): [`maheshrajamani/mcphub-studio`](https://hub.docker.com/r/maheshrajamani/mcphub-studio)
- **MCPHub Python Engine** (Code execution): [`maheshrajamani/mcphub-python-engine`](https://hub.docker.com/r/maheshrajamani/mcphub-python-engine)

### Production Recommendations

1. **Microservices Architecture**: MCPHub follows a microservices architecture allowing independent scaling
   - **mcphub-server**: Core backend service handling MCP protocol and API requests
   - **mcphub-studio**: Frontend UI for administrative operations
   - **mcphub-python-engine**: Python code execution engine for custom tools

2. **Horizontal Scaling**: Scale mcphub-server instances based on load requirements
   - Run **multiple mcphub-server instances** behind a load balancer for high availability
   - Scale independently based on MCP request volume and API traffic
   - Each instance serves MCP endpoints and API requests
   - **mcphub-studio** typically runs as a single instance (admin UI, not part of hot path)

3. **Database Storage**: Configure all backend services to use a shared PostgreSQL database instead of in-memory storage
   - Better data persistence and reliability
   - Enables horizontal scaling
   - Supports backup and recovery
   - All mcphub-server instances share the same database for configuration consistency

4. **API Gateway**: Use an API gateway (Kong, NGINX, AWS API Gateway, etc.) to:
   - Authenticate and authorize access to MCP endpoints
   - Load balance across multiple mcphub-server instances
   - Rate limiting and traffic management
   - SSL/TLS termination

5. **Logging for Kubernetes**: All individual images are configured to forward logs and errors to stdout/stderr
   - Compatible with Kubernetes log aggregation (kubectl logs, Fluentd, etc.)
   - Enables centralized logging with ELK, Splunk, or CloudWatch
   - No file-based logging - all output goes to standard streams

### Authentication Architecture

**Important Clarification**:
- **Protocol Tab Authentication** (in MCP Studio): Authenticates MCPHub → **Backend API Services** (your REST/gRPC/GraphQL APIs)
- **MCP Endpoint Authentication**: Secures **AI Clients → MCPHub MCP Servers** (handled by your API gateway/Kong)

```
AI Client (Claude, LangChain, etc.)
    ↓ [API Gateway Auth: Basic/JWT/OAuth2]
MCPHub MCP Server
    ↓ [Protocol Auth: Your API credentials]
Your Backend APIs
```

For detailed production deployment configurations, container orchestration (Kubernetes), and scaling strategies, please contact support or check our enterprise documentation.