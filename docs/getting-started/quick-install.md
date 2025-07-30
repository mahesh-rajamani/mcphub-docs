# Quick Install

Get MCPHub running in under 5 minutes with Docker or Kubernetes.

## Docker Installation

### Option 1: Complete Image (Recommended for Testing)

Single container deployment with all components:

```bash
docker run -p 3000:3000 -p 8080:8080 -p 8082:8082 \
  -e MCPHUB_ADMIN_PASSWORD=admin123 \
  maheshrajamani/mcphub-all:latest
```

**Access the application:**
- **MCP Studio (Frontend)**: http://localhost:3000
- **MCP Bridge API**: http://localhost:8080
- **Python Engine**: http://localhost:8082 (for custom code tools)

> **Note**: No environment variables needed for the frontend! The backend URL is configured through the Settings UI in MCP Studio.

### Option 2: Separate Containers (Recommended for Production)

#### 1. Start the Backend (MCP Bridge)

```bash
docker run -d --name mcphub-server \
  -p 8080:8080 \
  -e MCPHUB_ADMIN_PASSWORD=your_secure_password \
  maheshrajamani/mcphub-server:latest
```

#### 2. Start the Frontend (MCP Studio)

```bash
docker run -d --name mcphub-studio \
  -p 3000:3000 \
  maheshrajamani/mcphub-studio:latest
```

### Option 3: Docker Compose

Create a `docker-compose.yml` file:

```yaml title="docker-compose.yml"
version: '3.8'

services:
  mcphub-server:
    image: maheshrajamani/mcphub-server:latest
    container_name: mcphub-server
    ports:
      - "8080:8080"
    environment:
      - MCPHUB_ADMIN_PASSWORD=admin123
      - QUARKUS_HTTP_HOST=0.0.0.0
    networks:
      - mcphub-network
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:8080/q/health"]
      interval: 30s
      timeout: 10s
      retries: 3

  mcphub-studio:
    image: maheshrajamani/mcphub-studio:latest
    container_name: mcphub-studio
    ports:
      - "3000:3000"
    networks:
      - mcphub-network
    depends_on:
      mcphub-server:
        condition: service_healthy

networks:
  mcphub-network:
    driver: bridge
```

Run with:

```bash
docker-compose up -d
```

## Optional: Custom Code Engine Setup

MCPHub supports custom Python code execution for advanced tool creation. The Python engine is included by default in the complete image.

### For Separate Container Deployments

If you're using separate containers and want custom code functionality, add the Python engine:

```yaml title="docker-compose.yml (with Python Engine)"
version: '3.8'

services:
  mcphub-server:
    image: maheshrajamani/mcphub-server:latest
    container_name: mcphub-server
    ports:
      - "8080:8080"
    environment:
      - MCPHUB_ADMIN_PASSWORD=admin123
      - QUARKUS_HTTP_HOST=0.0.0.0
      # Python Engine Configuration
      - ENGINES_PYTHON_URL=http://python-engine:8082
      - ENGINES_PYTHON_ENABLED=true
      - ENGINES_PYTHON_TIMEOUT=30
    networks:
      - mcphub-network
    depends_on:
      python-engine:
        condition: service_healthy

  python-engine:
    image: maheshrajamani/mcphub-python-engine:latest
    container_name: mcphub-python-engine
    ports:
      - "8082:8082"
    environment:
      - ENGINE_HOST=0.0.0.0
      - ENGINE_PORT=8082
      - LOG_LEVEL=info
    networks:
      - mcphub-network
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:8082/health"]
      interval: 30s
      timeout: 10s
      retries: 3

  mcphub-studio:
    image: maheshrajamani/mcphub-studio:latest
    container_name: mcphub-studio
    ports:
      - "3000:3000"
    networks:
      - mcphub-network
    depends_on:
      mcphub-server:
        condition: service_healthy

networks:
  mcphub-network:
    driver: bridge
```

### Verification

Check that the Python engine is working:

```bash
# Check engine status through MCP Bridge
curl http://localhost:8080/api/admin/engines/status

# Direct engine health check
curl http://localhost:8082/health
```

## Kubernetes Installation

### Prerequisites

- Access to a Kubernetes cluster (local or cloud)
- `kubectl` command-line tool installed and configured
- LoadBalancer or Ingress controller (for external access)
- Basic familiarity with Kubernetes concepts

### Quick Deploy Manifests

#### 1. Namespace and ConfigMap

```yaml title="k8s-namespace.yaml"
apiVersion: v1
kind: Namespace
metadata:
  name: mcphub
---
apiVersion: v1
kind: ConfigMap
metadata:
  name: mcphub-config
  namespace: mcphub
data:
  MCPHUB_ADMIN_PASSWORD: "admin123"
  QUARKUS_HTTP_HOST: "0.0.0.0"
```

#### 2. Backend Deployment

```yaml title="k8s-backend.yaml"
apiVersion: apps/v1
kind: Deployment
metadata:
  name: mcphub-server
  namespace: mcphub
spec:
  replicas: 2
  selector:
    matchLabels:
      app: mcphub-server
  template:
    metadata:
      labels:
        app: mcphub-server
    spec:
      containers:
      - name: mcphub-server
        image: maheshrajamani/mcphub-server:latest
        ports:
        - containerPort: 8080
        env:
        - name: MCPHUB_ADMIN_PASSWORD
          valueFrom:
            configMapKeyRef:
              name: mcphub-config
              key: MCPHUB_ADMIN_PASSWORD
        - name: QUARKUS_HTTP_HOST
          valueFrom:
            configMapKeyRef:
              name: mcphub-config
              key: QUARKUS_HTTP_HOST
        livenessProbe:
          httpGet:
            path: /q/health/live
            port: 8080
          initialDelaySeconds: 30
          periodSeconds: 10
        readinessProbe:
          httpGet:
            path: /q/health/ready
            port: 8080
          initialDelaySeconds: 5
          periodSeconds: 5
        resources:
          requests:
            memory: "512Mi"
            cpu: "250m"
          limits:
            memory: "1Gi"
            cpu: "500m"
---
apiVersion: v1
kind: Service
metadata:
  name: mcphub-server
  namespace: mcphub
spec:
  selector:
    app: mcphub-server
  ports:
  - port: 8080
    targetPort: 8080
  type: ClusterIP
```

#### 3. Frontend Deployment

```yaml title="k8s-frontend.yaml"
apiVersion: apps/v1
kind: Deployment
metadata:
  name: mcphub-studio
  namespace: mcphub
spec:
  replicas: 2
  selector:
    matchLabels:
      app: mcphub-studio
  template:
    metadata:
      labels:
        app: mcphub-studio
    spec:
      containers:
      - name: mcphub-studio
        image: maheshrajamani/mcphub-studio:latest
        ports:
        - containerPort: 3000
        # No environment variables needed - configured via Settings UI
        livenessProbe:
          httpGet:
            path: /
            port: 3000
          initialDelaySeconds: 30
          periodSeconds: 10
        readinessProbe:
          httpGet:
            path: /
            port: 3000
          initialDelaySeconds: 5
          periodSeconds: 5
        resources:
          requests:
            memory: "256Mi"
            cpu: "100m"
          limits:
            memory: "512Mi"
            cpu: "250m"
---
apiVersion: v1
kind: Service
metadata:
  name: mcphub-studio
  namespace: mcphub
spec:
  selector:
    app: mcphub-studio
  ports:
  - port: 3000
    targetPort: 3000
  type: LoadBalancer
```

#### 4. Ingress (Optional)

```yaml title="k8s-ingress.yaml"
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: mcphub-ingress
  namespace: mcphub
  annotations:
    nginx.ingress.kubernetes.io/rewrite-target: /
spec:
  rules:
  - host: mcphub.your-domain.com
    http:
      paths:
      - path: /
        pathType: Prefix
        backend:
          service:
            name: mcphub-studio
            port:
              number: 3000
      - path: /api
        pathType: Prefix
        backend:
          service:
            name: mcphub-server
            port:
              number: 8080
```

### Deploy to Kubernetes

**Step 1: Save the manifests**
Save each of the YAML configurations above to separate files:
- `k8s-namespace.yaml`
- `k8s-backend.yaml` 
- `k8s-frontend.yaml`
- `k8s-ingress.yaml` (optional)

**Step 2: Deploy to your cluster**
```bash
# Deploy all components
kubectl apply -f k8s-namespace.yaml
kubectl apply -f k8s-backend.yaml
kubectl apply -f k8s-frontend.yaml
kubectl apply -f k8s-ingress.yaml  # Optional

# Check deployment status
kubectl get pods -n mcphub

# Wait for pods to be ready
kubectl wait --for=condition=ready pod -l app=mcphub-server -n mcphub --timeout=300s
kubectl wait --for=condition=ready pod -l app=mcphub-studio -n mcphub --timeout=300s
```

**Step 3: Access the application**
```bash
# Get external IP (for LoadBalancer)
kubectl get service mcphub-studio -n mcphub

# Or port-forward for local access
kubectl port-forward service/mcphub-studio 3000:3000 -n mcphub
```

## Verification

After installation, verify everything is working:

1. **Check Health Endpoints**:
   ```bash
   curl http://localhost:8080/q/health
   curl http://localhost:3000
   ```

2. **Access MCP Studio**: Open http://localhost:3000 in your browser

3. **Create Your First MCP**: Follow the [First MCP Guide](first-mcp.md)

## Initial Configuration

After installation, you'll need to configure the backend URL in MCP Studio:

1. **Open MCP Studio**: Navigate to http://localhost:3000
2. **Open Settings**: Click the Settings (⚙️) icon in the top navigation
3. **Configure Backend URL**: 
   - For local Docker: `http://localhost:8080`
   - For Kubernetes: Use the appropriate service URL or LoadBalancer IP
   - For remote deployments: Enter your server's URL
4. **Save Settings**: Click "Save" to persist the configuration

> **💡 Tip**: The settings are stored in your browser's localStorage, so you only need to configure this once per browser.

## Troubleshooting

### Common Issues

**Container won't start:**
```bash
# Check logs
docker logs mcphub-server
docker logs mcphub-studio
```

**Can't access the application:**
- Ensure ports 3000 and 8080 are not in use
- Check firewall settings
- Verify container health with `docker ps`

**Backend connection issues:**
- Configure backend URL in MCP Studio Settings (⚙️ icon)
- Check network connectivity between containers
- Verify backend is running on port 8080

For more troubleshooting, see [Advanced Troubleshooting](../advanced/troubleshooting.md).