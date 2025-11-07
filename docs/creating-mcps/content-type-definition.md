# Content Type Definition

## Overview

The **Content Type Definition** feature in MCPHub allows you to control how API responses are formatted and delivered to AI models through the Model Context Protocol (MCP). By default, all responses are returned as JSON text, but you can configure endpoints to deliver multipart responses where structured data and binary content (images, PDFs, documents) are sent as separate, properly-formatted content blocks.

This enables AI models to:
- **Process** both text and binary data in a single tool call
- **Display** images inline in conversations
- **Access** documents, PDFs, and other files directly
- **Handle** complex responses with multiple content types

## Why Content Type Definition Matters

### The Problem with JSON-Only Responses

When API responses contain binary data (like images or PDFs), they're typically:
- Base64-encoded inside JSON strings
- Difficult for AI models to process and display
- Mixed with structured data, making parsing complex
- Not optimally formatted for visual or document content

### The Solution: Multipart Content

With Content Type Definition, you can:
1. **Separate** binary data from structured data
2. **Label** each content section with the correct MIME type
3. **Enable** AI models to display images, render documents, and process data appropriately
4. **Simplify** response handling for AI applications

## Default Behavior: JSON

By default, all endpoints use **JSON** format, which returns the entire API response as a single text block:

**Default Configuration:**
- Response Format: **JSON (Single Text Block)**
- Entire response converted to JSON text
- Suitable for most API responses

**When to Use JSON:**
- API returns only structured data (no binary content)
- Simple text-based responses
- Error messages and status information

## Configuring Content Type Definition

The Content Type Definition tab is available when editing any endpoint in your MCP configuration.

### Accessing the Tab

1. Navigate to your MCP configuration
2. Click on the **Endpoints** section
3. Select an endpoint to edit
4. Click the **Content Type Definition** tab

### Configuration Options by Protocol

The available options depend on your endpoint's protocol type:

#### REST Endpoints

REST endpoints have three response format options:

**1. JSON (Single Text Block)** - Default
- Entire response returned as JSON text
- Use for standard REST APIs returning JSON data

**2. Binary (Single Binary Block)**
- Entire response treated as binary content
- Requires you to specify the MIME type
- Use for endpoints that return images, PDFs, or other binary files directly

**3. Multipart (Text + Binary Blocks)**
- Response automatically parsed if it uses HTTP `multipart/form-data` format
- Multiple parts extracted and sent as separate content blocks
- Binary Field Mappings are informational (documents expected part names)

#### gRPC, GraphQL, and SOAP Endpoints

These protocols have two response format options:

**1. JSON (Single Text Block)** - Default
- Entire response serialized to JSON text
- Use for standard responses

**2. Multipart (Text + Binary Blocks)**
- Specific fields extracted from response and sent as separate binary content
- Requires Binary Field Mappings configuration
- Use when responses contain binary data in specific fields

## Configuring Multipart Responses

### REST Multipart Configuration

For REST endpoints returning HTTP `multipart/form-data` responses:

**Step 1: Select Response Format**
- Choose **Multipart (Text + Binary Blocks)** from the dropdown

**Step 2: Document Binary Fields (Optional)**
- Click "Add Binary Field Mapping"
- Enter the part name and MIME type for documentation purposes
- Example mappings:
  - Part Name: `image` → MIME Type: `image/png`
  - Part Name: `metadata` → MIME Type: `application/json`
  - Part Name: `document` → MIME Type: `application/pdf`

**Note:** For REST, the Binary Field Mappings are **informational only**. MCPHub automatically parses all parts from the HTTP multipart response. The mappings help document what to expect in the response.

### gRPC/GraphQL/SOAP Multipart Configuration

For gRPC, GraphQL, and SOAP endpoints with binary fields:

**Step 1: Select Response Format**
- Choose **Multipart (Text + Binary Blocks)** radio button

**Step 2: Configure Binary Field Mappings**
- Click "Add Binary Field Mapping"
- Enter the field path (supports nested fields with dot notation)
- Select or enter the MIME type

**Field Path Examples:**
- Simple field: `profilePicture`
- Nested field: `user.profilePicture`
- Deep nested: `user.spouse.picture`

**Common MIME Types:**
- Images: `image/png`, `image/jpeg`, `image/gif`, `image/webp`
- Documents: `application/pdf`, `application/msword`
- Audio: `audio/mpeg`, `audio/wav`
- Video: `video/mp4`, `video/webm`

**Step 3: How It Works at Runtime**
1. API response is received by MCPHub
2. Configured binary fields are extracted from the response
3. Binary data is base64-encoded
4. Fields are removed from the main JSON response
5. Response is converted to multipart MCP content
6. AI model receives separate content blocks

### REST Binary-Only Configuration

For REST endpoints that return only binary content (no text/JSON):

**Step 1: Select Response Format**
- Choose **Binary (Single Binary Block)** from the dropdown

**Step 2: Specify MIME Type**
- Enter the content type returned by the API
- Examples: `image/png`, `application/pdf`, `audio/mpeg`

**Use Cases:**
- Image generation APIs
- PDF export endpoints
- File download endpoints

## Binary Field Mappings

### Adding a Binary Field Mapping

1. In the Content Type Definition tab, locate "Binary Field Mappings"
2. Click **Add Binary Field Mapping**
3. Enter the field path
4. Select or type the MIME type
5. Click outside or press Enter to save

### Editing a Binary Field Mapping

1. Click on the field path or MIME type to edit
2. Make your changes
3. Click outside or press Enter to save

### Deleting a Binary Field Mapping

1. Click the **X** or delete button next to the mapping
2. Mapping is removed immediately

### Field Path Format

**Simple Fields:**
```
profilePicture
avatar
thumbnail
document
```

**Nested Fields:**
```
user.profilePicture
response.data.image
result.user.avatar
metadata.document.thumbnail
```

**Supported Nesting:**
- Unlimited depth supported
- Use dot notation for nested access
- Field names are case-sensitive

## How MCP Multiple Content Works

When you configure multipart responses, MCPHub converts the API response into multiple MCP content blocks. Here's what AI models receive:

### Content Block Types

**Text Content:**
- Contains the main JSON response (with binary fields removed if configured)
- Displayed as structured text data
- AI can parse and analyze the data

**Image Content:**
- Used for image MIME types (`image/*`)
- Displayed inline in AI conversations
- AI can see and analyze the image

**Resource Content:**
- Used for PDFs, documents, audio, video
- Provides downloadable/accessible resources
- AI can reference and describe the content

### Example MCP Response Structure

When an endpoint returns multipart content, the AI model receives:

```json
{
  "content": [
    {
      "type": "text",
      "text": "{\"userId\": \"123\", \"name\": \"John Doe\", \"email\": \"john@example.com\"}"
    },
    {
      "type": "image",
      "data": "base64-encoded-image-data",
      "mimeType": "image/jpeg"
    },
    {
      "type": "resource",
      "resource": {
        "blob": "base64-encoded-pdf-data",
        "mimeType": "application/pdf",
        "uri": "data:application/pdf;base64,..."
      }
    }
  ]
}
```

**What This Means:**
- First block: JSON data about the user
- Second block: Profile picture (displayed inline)
- Third block: PDF document (accessible as resource)

## Real-World Use Cases

### Use Case 1: User Profile with Photo

**Scenario:** User management API returns profile data with a profile picture

**Protocol:** gRPC

**Configuration:**
- Response Format: **Multipart**
- Binary Field Mappings:
  - `profilePicture` → `image/jpeg`

**Result:** AI receives structured user data as text and profile photo as an inline image

### Use Case 2: Document Management

**Scenario:** Document API returns metadata and PDF file

**Protocol:** REST (multipart/form-data)

**Configuration:**
- Response Format: **Multipart**
- Binary Field Mappings (informational):
  - `metadata` → `application/json`
  - `document` → `application/pdf`

**Result:** AI receives document metadata as text and PDF as a downloadable resource

### Use Case 3: Social Media Posts

**Scenario:** Social media API returns posts with images and videos

**Protocol:** GraphQL

**Configuration:**
- Response Format: **Multipart**
- Binary Field Mappings:
  - `posts.images` → `image/png`
  - `posts.videos` → `video/mp4`

**Result:** AI receives post data with embedded media content

### Use Case 4: Medical Imaging

**Scenario:** Healthcare API returns patient data with X-ray images

**Protocol:** SOAP

**Configuration:**
- Response Format: **Multipart**
- Binary Field Mappings:
  - `xrayImage` → `image/dicom`
  - `report` → `application/pdf`

**Result:** AI receives patient information, medical images, and reports in separate, properly-formatted blocks

### Use Case 5: Image Generation

**Scenario:** AI image generation API returns only an image

**Protocol:** REST

**Configuration:**
- Response Format: **Binary**
- Response MIME Type: `image/png`

**Result:** AI receives generated image as a single image content block

## Protocol-Specific Notes

### REST

**Multipart Detection:**
- Automatically detects HTTP `multipart/form-data` responses
- Parses all parts regardless of Binary Field Mappings
- Binary Field Mappings serve as documentation

**Binary Response:**
- Only protocol supporting binary-only mode
- Entire HTTP response treated as binary
- Requires MIME type specification

### gRPC

**Field Extraction:**
- Extracts fields from protobuf messages
- Supports nested message fields
- Binary data must be in `bytes` fields in proto definitions

**Automatic Detection:**
- UI can auto-detect BINARY fields from .proto definitions
- Suggests field mappings based on field types

### GraphQL

**Field Extraction:**
- Extracts fields from GraphQL response JSON
- Supports nested query results
- Works with any GraphQL schema

**Custom Scalars:**
- Binary fields typically returned as base64 strings in GraphQL
- Multipart configuration extracts and properly formats them

### SOAP

**Field Extraction:**
- Extracts fields from parsed SOAP XML responses
- Supports nested elements
- Works with WSDL-defined message types

**Base64 Content:**
- SOAP often includes base64-encoded binary in XML
- Multipart configuration extracts and reformats for MCP
