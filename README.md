# MCPHub Documentation Website

This website is built using [Docusaurus](https://docusaurus.io/), a modern static website generator.

## Getting Started

### Installation

```bash
npm install
```

### Local Development

```bash
npm start
```

This command starts a local development server and opens up a browser window. Most changes are reflected live without having to restart the server.

### Build

```bash
npm run build
```

This command generates static content into the `build` directory and can be served using any static contents hosting service.

### Deployment

**GitHub Pages:**

```bash
npm run deploy
```

**Manual Deployment:**

```bash
npm run build
# Then upload the `build` directory to your hosting provider
```

## Documentation Structure

### Getting Started
- **Overview**: Introduction to MCPHub and its components
- **Quick Install**: Docker and Kubernetes installation guides
- **Architecture**: System architecture and component overview
- **First MCP**: Step-by-step tutorial for creating your first MCP

### Configuration
- **Settings**: Application configuration and customization
- **Storage Setup**: Database and storage configuration
- **Authentication**: Security setup and user management

### Creating MCPs
- **Import Methods**: OpenAPI, gRPC, and cURL import guides
- **Manual Creation**: Step-by-step manual MCP creation
- **User Variables**: Dynamic configuration with variables

### Testing & AI
- **MCP Testing**: Testing framework and validation
- **AI Suggestions**: AI-powered improvement recommendations
- **Diff Comparison**: Version comparison and change tracking

### Deployment
- **Docker**: Container deployment guides
- **Kubernetes**: Orchestration and scaling
- **Production**: Production deployment best practices

### Version Management
- **Creating Versions**: Version control and management
- **Managing Versions**: Version lifecycle and operations

### API Reference
- **Overview**: API documentation structure
- **MCP Protocol**: Model Context Protocol implementation
- **Admin API**: Administrative interface and operations
- **Authentication**: API authentication and authorization

### Advanced
- **Custom Protocols**: Extending MCPHub with custom protocols
- **Plugins**: Plugin development and integration
- **Troubleshooting**: Common issues and solutions

## Writing Documentation

### Markdown Features

Docusaurus supports enhanced markdown with:

- **Code blocks with syntax highlighting**
- **Tabs and code groups**
- **Admonitions (tips, warnings, notes)**
- **Interactive components**

### Code Examples

Use triple backticks with language specification:

```json
{
  "mcpName": "example",
  "description": "Example MCP configuration"
}
```

### Copy Buttons

Code blocks automatically include copy buttons for easy copying.

### Links and References

- Use relative links for internal pages: `[Quick Install](quick-install.md)`
- Use absolute links for external resources: `[GitHub](https://github.com/mahesh-rajamani/mcphub)`

### Images and Assets

Place images in `static/img/` directory:

```markdown
![Architecture Diagram](img/architecture.png)
```

## Versioning

This documentation supports versioning:

### Create New Version

```bash
npm run docusaurus docs:version 1.0.0
```

### Version Structure

- `docs/` - Current development version
- `versioned_docs/version-1.0.0/` - Version 1.0.0
- `versions.json` - Version configuration

## Customization

### Styling

Edit `src/css/custom.css` for custom styles.

### Components

Add React components in `src/components/` for reusable elements.

### Configuration

Modify `docusaurus.config.ts` for site configuration.

## Search

### Algolia DocSearch

Configure search in `docusaurus.config.ts`:

```ts
algolia: {
  appId: 'YOUR_APP_ID',
  apiKey: 'YOUR_SEARCH_API_KEY',
  indexName: 'mcphub',
}
```

## Analytics

### Google Analytics

Add to `docusaurus.config.ts`:

```ts
gtag: {
  trackingID: 'G-XXXXXXXXXX',
  anonymizeIP: true,
}
```

## Contributing

We welcome contributions to improve the documentation:

1. **Report Issues**: Found an error or unclear section? [Open an issue](https://github.com/mahesh-rajamani/mcphub/issues)
2. **Suggest Improvements**: Have ideas for better examples or explanations? [Start a discussion](https://github.com/mahesh-rajamani/mcphub/discussions)
3. **Submit Changes**: For direct contributions, see our [contribution guidelines](https://github.com/mahesh-rajamani/mcphub/blob/main/CONTRIBUTING.md)

## Live Site

The documentation is available at:
- **Production**: https://mcphub.io
- **Staging**: https://mcphub-docs.netlify.app
- **GitHub Pages**: https://mahesh-rajamani.github.io/mcphub-docs

## Support

- **Issues**: [GitHub Issues](https://github.com/mahesh-rajamani/mcphub/issues)
- **Discussions**: [GitHub Discussions](https://github.com/mahesh-rajamani/mcphub/discussions)
- **Documentation**: This site!