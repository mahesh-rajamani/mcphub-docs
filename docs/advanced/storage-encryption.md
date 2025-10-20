# Storage & Encryption

MCPHub provides flexible storage options and enterprise-grade encryption for sensitive data. This guide explains how to configure storage backends and how your sensitive data is protected.

## Storage Configuration

MCPHub supports multiple storage backends for MCP configurations and runtime data.

### Storage Providers

#### In-Memory Storage

Lightweight storage for development and testing. Data is lost when the application restarts.

**Configuration:**
```bash
export MCP_STORAGE_PROVIDER=memory
```

**Use Cases:**
- Local development
- Testing and demos
- Temporary deployments

**Limitations:**
- No persistence across restarts
- Single instance only (no clustering)
- Limited by available RAM

#### PostgreSQL Database Storage

Production-ready storage with persistence and multi-instance support. Works with PostgreSQL and compatible databases (AWS RDS, Azure Database for PostgreSQL, Google Cloud SQL, etc.).

**Environment Variables:**
```bash
export MCP_STORAGE_PROVIDER=database
export DATABASE_URL=jdbc:postgresql://hostname:5432/database_name
export DATABASE_USERNAME=username
export DATABASE_PASSWORD=password
```

**Example Configurations:**

**Local PostgreSQL:**
```bash
export MCP_STORAGE_PROVIDER=database
export DATABASE_URL=jdbc:postgresql://localhost:5432/mcphub
export DATABASE_USERNAME=mcphub_user
export DATABASE_PASSWORD=your_secure_password
```

**AWS RDS PostgreSQL:**
```bash
export MCP_STORAGE_PROVIDER=database
export DATABASE_URL=jdbc:postgresql://mydb.abc123.us-east-1.rds.amazonaws.com:5432/mcphub
export DATABASE_USERNAME=admin
export DATABASE_PASSWORD=your_secure_password
```

**Azure Database for PostgreSQL:**
```bash
export MCP_STORAGE_PROVIDER=database
export DATABASE_URL=jdbc:postgresql://myserver.postgres.database.azure.com:5432/mcphub
export DATABASE_USERNAME=adminuser@myserver
export DATABASE_PASSWORD=your_secure_password
```

**Google Cloud SQL:**
```bash
export MCP_STORAGE_PROVIDER=database
export DATABASE_URL=jdbc:postgresql://your-instance-ip:5432/mcphub
export DATABASE_USERNAME=postgres
export DATABASE_PASSWORD=your_secure_password
```

**Features:**
- Automatic schema migrations via Flyway
- Connection pooling (2-16 connections)
- Health checks and monitoring
- Multi-instance clustering support
- Automatic deployment restoration on startup

**Connection Pool Settings:**
- Max connections: 16
- Min connections: 2
- Max lifetime: 30 minutes
- Acquisition timeout: 10 seconds
- Leak detection: 10 minutes

### Database Schema

Flyway automatically creates and manages the database schema when you use PostgreSQL storage. On first startup, it creates:

**Tables:**

1. **universal_schemas** - Stores complete MCP configurations as JSON
   - Primary key: `id` (UUID)
   - Unique constraint: `(mcp_name, version, tenant_id)`
   - Stores: Configuration JSON, metadata, deployment status, version tracking

2. **user_variables** - User-defined variables with encryption support
   - Primary key: `id` (UUID)
   - Foreign key: `mcp_configuration_id` references `universal_schemas(id)`
   - Unique constraint: `(mcp_configuration_id, variable_name, tenant_id)`
   - Stores: Variable values (encrypted if sensitive), salt, metadata

3. **oauth2_tokens** - Encrypted OAuth 2.0 tokens
   - Primary key: `id` (UUID)
   - Unique constraint: `(tenant_id, mcp_name, client_id)`
   - Stores: Encrypted access/refresh tokens, expiration times

4. **configuration_groups** - Groups of MCP configurations for deployment
   - Primary key: `id` (UUID)
   - Unique constraint: `(group_name, tenant_id)`
   - Stores: Group metadata, deployment order, configuration IDs

5. **flyway_schema_history** - Tracks applied database migrations

**Indexes:**

Flyway creates comprehensive indexes for query performance:

- **Tenant isolation**: `idx_mcp_name_tenant`, `idx_tenant_deployed`
- **Version queries**: `idx_version_tenant`, `idx_name_version_tenant`
- **Deployment status**: `idx_deployed`, `idx_universal_schemas_deployed_only`
- **Performance**: `idx_universal_schemas_tenant_deployed_name`
- **OAuth tokens**: `idx_oauth2_tenant_mcp_client`, `idx_oauth2_expires_at`
- **GIN indexes** for JSON columns: `idx_universal_schemas_tags_gin`

**Triggers:**

Automatic timestamp management:
- `update_updated_at_column()` - Updates `updated_at` on every row change
- `update_configuration_version_on_save()` - Manages configuration and deployment IDs

**Views:**

- `oauth2_token_status` - Non-sensitive OAuth token monitoring
- `configuration_versions` - Configuration version tracking

**Migration Process:**

1. **First startup**: Flyway runs `V1.0.0__Create_initial_schema.sql`
2. **Subsequent startups**: Flyway checks for new migration files
3. **Version tracking**: All migrations tracked in `flyway_schema_history`
4. **Baseline**: Automatically creates baseline if database has existing tables

### Switching Storage Providers

When switching from in-memory to database storage:

1. **Set environment variables** for database connection
2. **Set storage provider**: `export MCP_STORAGE_PROVIDER=database`
3. **Restart MCPHub** - Flyway will automatically create/update the schema
4. **Existing configurations** from in-memory storage will be lost (export before switching)

## Encryption Configuration

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

**Environment Variable (Default):**
```bash
# Strong production key (recommended)
export MCP_ENCRYPTION_KEY="abcd1234567890abcd1234567890abcd1234567890abcd1234567890abcd1234"

# Alternative: Generate a random key
export MCP_ENCRYPTION_KEY=$(openssl rand -base64 48)
```

### HashiCorp Vault Integration

MCPHub supports HashiCorp Vault for secure encryption key management as an alternative to environment variables.

**Enable Vault:**
```bash
# Enable Vault integration
export MCP_VAULT_ENABLED=true

# Vault connection settings
export MCP_VAULT_URL=https://vault.example.com:8200
export MCP_VAULT_TOKEN=your-vault-token
```

**Vault Configuration:**
- **KV Engine**: Version 2 (default)
- **Mount Path**: `secret` (default)
- **Key Paths**:
  - Global key: `secret/global`
  - Tenant-specific: `secret/tenants/{tenant}/shared`

**Key Storage Hierarchy:**

When Vault is enabled, MCPHub retrieves encryption keys from Vault using this hierarchy:

1. **Tenant-specific key**: `secret/tenants/{tenant}/shared`
2. **Global fallback**: `secret/global`
3. **Environment variable**: `MCP_ENCRYPTION_KEY` (if Vault lookup fails)

**Example Vault Setup:**

```bash
# Store global encryption key in Vault
vault kv put secret/global encryption_key="your-global-key-here"

# Store tenant-specific keys
vault kv put secret/tenants/production/shared encryption_key="prod-tenant-key"
vault kv put secret/tenants/staging/shared encryption_key="staging-tenant-key"
```

**When to Use Vault:**
- Production deployments requiring centralized secret management
- Multi-environment setups with different encryption keys
- Compliance requirements for secret rotation and auditing
- Integration with existing Vault infrastructure

**When to Use Environment Variables:**
- Development and testing environments
- Simple deployments without Vault infrastructure
- Container environments with built-in secret management (AWS Secrets Manager, Azure Key Vault via env injection)

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

## Related Topics

- [Authentication Configuration](../creating-mcps/authentication.md)
- [User Variables Overview](../creating-mcps/variables/overview.md)