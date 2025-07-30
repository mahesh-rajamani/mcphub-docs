# Deployment Management

MCPHub provides comprehensive deployment management capabilities that allow you to deploy, undeploy, and manage MCP configurations across different environments.

## Overview

Deployment management in MCPHub includes:
- **Version-Specific Deployment**: Deploy specific versions of MCP configurations
- **Deployment Variables**: Configure environment-specific variables during deployment
- **Deployment Status Tracking**: Monitor which versions are currently deployed
- **Conflict Resolution**: Handle deployment conflicts when multiple versions exist

## Version-Specific Deployment

MCPHub supports deploying specific versions of MCP configurations:

### Deployment Process

1. **Select Version**: Choose the version you want to deploy from the MCP list
2. **Click Deploy**: Click **Deploy** from the actions menu
3. **Configure Variables**: Set up deployment-specific variables
4. **Confirm Deployment**: Review settings and confirm deployment

### Deployment Variables

When deploying an MCP, you can configure environment-specific variables:

#### Variable Configuration Dialog
- **User Variables**: Set values for `{{variableName}}` placeholders
- **Environment-Specific Values**: Configure different values for different environments
- **Sensitive Variables**: Securely configure API keys and tokens
- **Required Variables**: Ensure all required variables have values

#### Variable Types
- **String Variables**: Text values for configuration
- **Token Variables**: Sensitive values like API keys (masked in UI)
- **URL Variables**: Endpoint URLs and service addresses
- **Boolean Variables**: True/false configuration flags

### Deployment Restrictions

- **Single Version Deployment**: Only one version of an MCP can be deployed at a time
- **Version Replacement**: Deploying a different version replaces the currently deployed one
- **Edit Restrictions**: Cannot edit deployed versions (must undeploy first)

### Deployment Conflicts

When attempting to deploy a different version of an already deployed MCP:

1. **Conflict Detection**: MCPHub detects the deployment conflict
2. **Confirmation Dialog**: Shows which version is currently deployed
3. **Replacement Warning**: Warns about version replacement behavior
4. **Explicit Confirmation**: Requires explicit confirmation to proceed

## Deployment Status Tracking

### Status Indicators

MCPHub provides clear deployment status indicators:

- **Deployed Badge**: Green badge indicating successful deployment
- **Version Information**: Shows which specific version is deployed
- **Deployment Time**: When the deployment occurred
- **Saved Status**: Gray badge for configurations that are saved but not deployed

### Multi-Version Display

When multiple versions of the same MCP exist:
- **Version Badges**: Each version shows its deployment status
- **Conflict Indicators**: Visual indicators when different versions exist
- **Deployment History**: Track which versions have been deployed

## Authentication Integration

### OAuth2 Flow Integration

For MCPs with OAuth2 authentication:

1. **Deploy MCP First**: MCP is deployed with user variables
2. **OAuth2 Authentication**: Automatic OAuth2 flow initiation
3. **Token Storage**: Secure token storage in the backend
4. **Ready for Use**: MCP is fully configured and ready

### Authentication Status

- **Authentication Required**: Clear indicators when authentication is needed
- **Authentication Complete**: Confirmation when OAuth2 flow is successful
- **Token Management**: Automatic token refresh and management

## Deployment Environments

### Environment Management

MCPHub supports deployment to different environments:

#### Development Environment
- **Local Testing**: Deploy to local development environment
- **Rapid Iteration**: Quick deployment for testing changes
- **Debug Mode**: Enhanced logging and error reporting

#### Staging Environment
- **Pre-Production Testing**: Validate configurations before production
- **Integration Testing**: Test with staging data and services
- **Performance Testing**: Validate performance characteristics

#### Production Environment
- **Production Deployment**: Deploy to live production environment
- **Security Considerations**: Enhanced security and monitoring
- **Monitoring**: Production monitoring and alerting

### Environment-Specific Configuration

#### Variable Substitution
- **Development**: `{{devApiKey}}`, `{{devBaseUrl}}`
- **Staging**: `{{stagingApiKey}}`, `{{stagingBaseUrl}}`
- **Production**: `{{prodApiKey}}`, `{{prodBaseUrl}}`

#### Tenant Isolation
- **Tenant-Specific Deployments**: Each tenant has isolated deployments
- **Cross-Tenant Security**: No cross-tenant access to deployed MCPs
- **Tenant Configuration**: Tenant-specific variable values

## Undeployment

### Undeploy Process

1. **Select Deployed MCP**: Choose the MCP to undeploy
2. **Click Undeploy**: Click **Undeploy** from the actions menu
3. **Confirm Action**: Confirm the undeploy operation
4. **Status Update**: MCP status changes to "Saved" (not deployed)

### Undeploy Effects

- **Service Shutdown**: MCP endpoint becomes unavailable
- **Status Change**: Deployment status updates to "Saved"
- **Edit Enabled**: Configuration becomes editable again
- **Resource Cleanup**: Backend resources are freed

## Error Handling

### Deployment Errors

Common deployment errors and solutions:

#### Variable Validation Errors
- **Missing Required Variables**: Ensure all required variables have values
- **Invalid Variable Values**: Check variable formats and types
- **Authentication Failures**: Verify authentication credentials

#### Resource Conflicts
- **Port Conflicts**: Ensure ports are available for deployment
- **Resource Limits**: Check system resource availability
- **Permission Issues**: Verify deployment permissions

#### Network Issues
- **Backend Connectivity**: Ensure backend is accessible
- **External API Access**: Verify external API connectivity
- **Firewall Rules**: Check firewall and security settings

### Error Recovery

#### Deployment Rollback
- **Undeploy Failed Version**: Undeploy the problematic version
- **Deploy Previous Version**: Deploy a known working version
- **Investigate Issues**: Review logs and error messages

#### Configuration Fixes
- **Update Variables**: Fix variable configuration issues
- **Correct Endpoints**: Fix endpoint configuration problems
- **Validate Settings**: Ensure all settings are correct

## Monitoring and Logs

### Deployment Monitoring

- **Health Checks**: Automatic health checking of deployed MCPs
- **Performance Metrics**: Monitor response times and success rates
- **Error Tracking**: Track and alert on deployment errors

### Logging

- **Deployment Logs**: Detailed logs of deployment operations
- **Runtime Logs**: Logs of MCP execution and API calls
- **Error Logs**: Detailed error information for troubleshooting

## Security Considerations

### Deployment Security

- **Variable Encryption**: Sensitive variables are encrypted
- **Access Control**: Only authorized users can deploy MCPs
- **Audit Logging**: All deployment operations are logged
- **Secure Communication**: Encrypted communication with backend services

### Production Security

- **Authentication Required**: All production deployments require authentication
- **Variable Masking**: Sensitive variables are masked in logs and UI
- **Secure Storage**: Encrypted storage of configuration and variables
- **Access Monitoring**: Monitor and log all access to deployed MCPs