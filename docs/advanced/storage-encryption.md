# Storage & Encryption

MCPHub provides enterprise-grade encryption for sensitive data with a simplified, secure key management system. This guide explains how your sensitive user variables and configuration data are protected.

## Overview

MCPHub automatically encrypts sensitive information to keep your credentials and secrets secure using industry-standard AES-256-GCM encryption with tenant isolation.

### What Gets Encrypted

- **Sensitive User Variables**: API keys, tokens, passwords marked as `sensitive: true`
- **OAuth Tokens**: Access tokens, refresh tokens from OAuth 2.0 flows
- **JWT Tokens**: Authentication tokens from JWT flows
- **Database Credentials**: Connection strings, passwords

### What Stays in Plain Text

- **Configuration Structure**: MCP schemas, endpoint definitions, parameter descriptions
- **Non-Sensitive Variables**: Public URLs, default values, numeric settings
- **Metadata**: Tags, descriptions, version information

## Encryption System

### Algorithm & Security

- **Algorithm**: AES-256-GCM (Advanced Encryption Standard with Galois Counter Mode)
- **Key Size**: 256 bits for maximum security
- **Key Derivation**: PBKDF2WithHmacSHA256 with 100,000 iterations
- **Authentication**: Built-in authentication to prevent tampering
- **Salt**: 32 bytes (256 bits) unique per encryption
- **IV**: 12 bytes (96 bits) generated per encryption

### Key Hierarchy

MCPHub uses a three-level key hierarchy for maximum security:

#### 1. Base Key (`MCP_ENCRYPTION_KEY`)
- **Purpose**: Root key for the entire system
- **Usage**: Never used directly - only for deriving tenant keys
- **Configuration**: Set via environment variable

#### 2. Tenant Keys
- **Purpose**: Unique key per tenant for complete isolation
- **Derivation**: `PBKDF2(MCP_ENCRYPTION_KEY, tenantId, 100000 iterations)`
- **Usage**: Never used directly - only for deriving variable keys

#### 3. Variable Keys
- **Purpose**: Unique key per variable per tenant
- **Derivation**: `PBKDF2(tenantKey, "variableName:randomSalt", 50000 iterations)`
- **Usage**: This is the actual key used for AES-256-GCM encryption

### Security Benefits

- **Tenant Isolation**: Each tenant gets cryptographically unique keys
- **Variable Isolation**: Each variable gets a unique key, even with the same name
- **Salt Randomness**: Each encryption uses a fresh random salt
- **Tamper Protection**: GCM provides authentication and integrity checking

## Configuration

### Setting Up Encryption

**Required Environment Variable:**
```bash
# Production deployment
export MCP_ENCRYPTION_KEY="your-secure-64-character-production-key-here"
```

**Key Requirements:**
- **Minimum Length**: 32 characters
- **Recommended**: 64+ characters for production
- **Format**: Any string (base64 recommended for strong entropy)

### Default Fallback (Development Only)

If `MCP_ENCRYPTION_KEY` is not set, MCPHub generates a deterministic fallback key:

```
Seed: "mcphub-dev-fallback-encryption-key"
Key: SHA256(seed) → base64 encoded
```

**⚠️ Warning**: The fallback key is only safe for development - never use in production!

### Example Configuration

```bash
# Strong production key (recommended)
export MCP_ENCRYPTION_KEY="abcd1234567890abcd1234567890abcd1234567890abcd1234567890abcd1234"

# Alternative: Generate a random key
export MCP_ENCRYPTION_KEY=$(openssl rand -base64 48)
```

## How Encryption Works

### Complete Flow Example

**Scenario**: Encrypting `apiKey="secret123"` for tenant `shop_rite`

1. **Base Key**: `MCP_ENCRYPTION_KEY` (from environment)
2. **Tenant Key**: `PBKDF2(baseKey, "shop_rite", 100000)` → `tenantKey_ShopRite`
3. **Random Salt**: Generated for this encryption → `"abc123def456"`
4. **Variable Key**: `PBKDF2(tenantKey_ShopRite, "apiKey:abc123def456", 50000)` → `variableKey_ApiKey`
5. **Encryption**: `AES-256-GCM(variableKey_ApiKey, "secret123")` → `encryptedValue`
6. **Storage**: `base64(encryptedValue):abc123def456`

### Multi-Tenant Example

For two tenants with the same variable name:

```bash
# Tenant: default
Base Key: MCP_ENCRYPTION_KEY
Tenant Key: PBKDF2(baseKey, "default", 100000) → unique key A
Variable Key: PBKDF2(keyA, "apiKey:salt1", 50000) → unique key A1

# Tenant: shop_rite  
Base Key: MCP_ENCRYPTION_KEY (same base key)
Tenant Key: PBKDF2(baseKey, "shop_rite", 100000) → unique key B
Variable Key: PBKDF2(keyB, "apiKey:salt2", 50000) → unique key B1
```

**Result**: Even with the same variable name, each tenant gets completely different encryption keys.

## Storage Format

### Database Storage

Encrypted values are stored with this format:
```
base64(iv+encryptedData):base64(salt)
```

### Example Storage

```sql
-- User Variables Table
CREATE TABLE user_variables (
    id UUID PRIMARY KEY,
    tenant_id VARCHAR(255) NOT NULL,
    variable_name VARCHAR(255) NOT NULL,
    variable_type VARCHAR(50) NOT NULL,
    encrypted_value TEXT,        -- For sensitive variables
    plain_value TEXT,           -- For non-sensitive variables
    is_sensitive BOOLEAN DEFAULT FALSE,
    salt VARCHAR(255),          -- Base64 encoded salt
    created_at TIMESTAMP DEFAULT NOW()
);

-- Example data
INSERT INTO user_variables VALUES (
    gen_random_uuid(),
    'shop_rite',
    'apiKey',
    'token',
    'SGVsbG8gV29ybGQ=:YWJjZGVmZ2hpams=',  -- encrypted_value:salt
    NULL,                                    -- plain_value (null for sensitive)
    TRUE,                                    -- is_sensitive
    'YWJjZGVmZ2hpams=',                     -- salt
    NOW()
);
```

## Security Features

### Tenant Isolation

Each tenant is completely isolated:
- **Separate Keys**: Each tenant gets unique derived keys
- **Cross-Tenant Protection**: Tenant A cannot decrypt Tenant B's data
- **Key Derivation**: Uses tenant ID as salt in PBKDF2

### Integrity Protection

- **Authentication**: GCM mode provides built-in authentication
- **Tamper Detection**: Modified ciphertext fails decryption
- **Validation**: System can verify data integrity without decryption

### Backward Compatibility

- **Detection**: System automatically detects encrypted vs plain text values
- **Graceful Fallback**: Non-encrypted values are returned as-is
- **Migration**: Can encrypt existing plain text values

## Key Management

### Production Deployment

```bash
# Production environment setup
export MCP_ENCRYPTION_KEY="your-production-key-here"
export MCP_ENVIRONMENT="production"

# Verify encryption is working
curl -X GET "http://localhost:8080/admin/default/test-mcp" \
  -H "Authorization: Bearer admin-token"
```

### Key Rotation (Future)

Key rotation infrastructure is in place but not fully implemented:

```java
// Future implementation
encryptionService.rotateKeysForTenant("shop_rite", oldKey, newKey);
```

**Process will involve:**
1. Generate new base key
2. Derive new tenant keys
3. Re-encrypt all sensitive data
4. Update database atomically

### Monitoring

Monitor these encryption metrics:
- **Encryption Performance**: Latency for encrypt/decrypt operations
- **Key Usage**: Access patterns and error rates
- **Storage Growth**: Encrypted data volume
- **Error Rates**: Failed decryption attempts

## Best Practices

### Security Recommendations

1. **Strong Keys**: Use 64+ character keys for production
2. **Key Storage**: Store keys in secure secret management systems
3. **Environment Separation**: Use different keys per environment
4. **Regular Rotation**: Plan for periodic key rotation
5. **Monitoring**: Monitor encryption/decryption performance and errors

### Compliance

MCPHub encryption supports:
- **GDPR**: Data encryption and tenant isolation
- **HIPAA**: PHI encryption with access controls
- **SOC 2**: Security controls and audit trails
- **PCI DSS**: Cardholder data protection

### Development vs Production

**Development:**
```bash
# Optional - uses fallback key if not set
export MCP_ENCRYPTION_KEY="dev-key-32-chars-minimum"
```

**Production:**
```bash
# Required - use strong key from secrets manager
export MCP_ENCRYPTION_KEY="${SECRET_MANAGER_KEY}"
```

## Troubleshooting

### Common Issues

**Encryption Key Too Short:**
```
Error: Encryption key too short. Key must be at least 32 characters.
```
**Solution**: Use a longer key (64+ characters recommended)

**Decryption Failures:**
```
Error: Failed to decrypt value for tenant default variable apiKey
```
**Solution**: Verify the same `MCP_ENCRYPTION_KEY` is used for encrypt/decrypt

**Missing Environment Key:**
```
Warning: No encryption key found. Using fallback key generation for development.
```
**Solution**: Set `MCP_ENCRYPTION_KEY` environment variable

### Verification

Test encryption is working:
```bash
# Check if encryption service is active
curl -X GET "http://localhost:8080/health" | grep encryption

# Test variable encryption/decryption
curl -X POST "http://localhost:8080/admin/default/test-mcp" \
  -H "Content-Type: application/json" \
  -d '{"userVariables": [{"name": "test", "value": "secret", "sensitive": true}]}'
```

## Related Topics

- [Authentication Configuration](../creating-mcps/authentication.md)
- [User Variables Overview](../creating-mcps/variables/overview.md)
- [Multi-Tenant Configuration](../configuration/multi-tenant.md)