# Import gRPC Proto

MCPHub can automatically import gRPC service definitions from Protocol Buffer (.proto) files to create MCP configurations for gRPC APIs quickly and accurately.

## Sample gRPC Service Definition

Here's a complete Person service example that demonstrates common gRPC patterns:

```protobuf
syntax = "proto3";

package person;

// PersonService provides CRUD operations for managing persons
service PersonService {
  // Create a new person in the system
  rpc CreatePerson(CreatePersonRequest) returns (CreatePersonResponse);
  
  // Get a person by their unique name
  rpc GetPersonByName(GetPersonByNameRequest) returns (GetPersonByNameResponse);
  
  // Get a person by their unique ID
  rpc GetPersonById(GetPersonByIdRequest) returns (GetPersonByIdResponse);
  
  // Get all persons with optional pagination
  rpc GetAllPersons(GetAllPersonsRequest) returns (GetAllPersonsResponse);
  
  // Update an existing person's information
  rpc UpdatePerson(UpdatePersonRequest) returns (UpdatePersonResponse);
  
  // Delete a person by name
  rpc DeletePerson(DeletePersonRequest) returns (DeletePersonResponse);
}

// Person represents an individual in the system
message Person {
  // Unique identifier for the person (auto-generated if not provided)
  string id = 1;
  
  // Full name of the person (required)
  string name = 2;
  
  // Age of the person in years
  int32 age = 3;
  
  // Email address for contact (must be unique)
  string email = 4;
  
  // Country of residence using ISO country codes
  string country = 5;
}

// Request message for creating a new person
message CreatePersonRequest {
  // Person data to create (id will be auto-generated if not provided)
  Person person = 1;
}

// Response message for person creation
message CreatePersonResponse {
  // The created person with generated ID
  Person person = 1;
  
  // Success message
  string message = 2;
}

// Request message for getting a person by name
message GetPersonByNameRequest {
  // The name to search for (case-sensitive)
  string name = 1;
}

// Response message for get person by name
message GetPersonByNameResponse {
  // The found person, or null if not found
  Person person = 1;
  
  // Whether the person was found
  bool found = 2;
}

// Request message for getting a person by ID
message GetPersonByIdRequest {
  // The unique ID to search for
  string id = 1;
}

// Response message for get person by ID
message GetPersonByIdResponse {
  // The found person, or null if not found
  Person person = 1;
  
  // Whether the person was found
  bool found = 2;
}

// Request message for getting all persons
message GetAllPersonsRequest {
  // Maximum number of persons to return (default: 100)
  int32 limit = 1;
  
  // Number of persons to skip for pagination
  int32 offset = 2;
  
  // Optional country filter
  string country_filter = 3;
}

// Response message for get all persons
message GetAllPersonsResponse {
  // List of persons matching the criteria
  repeated Person persons = 1;
  
  // Total number of persons available
  int32 total_count = 2;
  
  // Whether there are more results available
  bool has_more = 3;
}

// Request message for updating a person
message UpdatePersonRequest {
  // The person data to update (id is required for identification)
  Person person = 1;
}

// Response message for person update
message UpdatePersonResponse {
  // The updated person
  Person person = 1;
  
  // Success message
  string message = 2;
}

// Request message for deleting a person
message DeletePersonRequest {
  // The name of the person to delete
  string name = 1;
}

// Response message for person deletion
message DeletePersonResponse {
  // Whether the deletion was successful
  bool success = 1;
  
  // Success or error message
  string message = 2;
}
```

## Import Process Overview

1. **Open MCP Studio**
2. **Click "Create New MCP"**
3. **Click "Import gRPC"**
4. **Copy/paste your Protocol Buffer specification**
5. **Configure gRPC server settings (URL and TLS)**
6. **Review and enhance the imported configuration**
7. **Create and deploy your MCP**

## Step-by-Step Import Instructions

### Step 1: Access MCP Studio

1. **Open your web browser**
2. **Navigate to your MCP Studio instance**
3. **Verify**: You see the MCPHub Studio homepage with available MCPs

### Step 2: Import gRPC Protocol Buffer Definition

1. **Click** the **"Create New MCP"** button
2. **Click** **"Import gRPC"** button
3. **Select** **"Proto Format"** tab (should be selected by default)
4. **Copy** the Person service proto definition from above
5. **Paste** the proto content into the **"Or Paste Proto Content"** textarea
6. **Click** **"Configure Import"** button

### Step 3: Configure gRPC Server Settings

After clicking "Configure Import", you'll see the gRPC configuration step:

#### Server Configuration
1. **gRPC Server URL**: Enter your gRPC server URL (e.g., `localhost:50051` or `grpc.example.com:443`)
2. **TLS Enabled**: 
   - ✅ **Important**: Set to `false` for local development servers
   - ✅ Set to `true` for production servers with TLS certificates
   - ⚠️ **Known Issue**: Currently defaults to `true` - make sure to change this for local servers
3. **Click** **"Import & Preview"** to proceed

*Note: The TLS setting is crucial - local gRPC servers typically run without TLS, while production servers use TLS.*

### Step 4: Review Imported Configuration

After configuration, you'll see the MCP configuration form pre-filled:

#### Basic Information Tab
Review the automatically filled fields:
- **MCP Name**: `person-service` (auto-generated from service name)
- **Description**: `PersonService provides CRUD operations for managing persons` (from proto comments)
- **Version**: `1.0.0` (default)

#### Protocol Configuration Tab
1. **Click** the **"Protocol Basic Info"** tab
2. **Verify** the gRPC server URL and TLS settings
3. **Check** any additional headers if needed

### Step 5: Explore Imported Endpoints

1. **Click** the **"Endpoints"** tab
2. **Review** the imported RPC methods (you should see 6 person service methods):
   - **CreatePerson**: Create a new person
   - **GetPersonByName**: Get person by name
   - **GetPersonById**: Get person by unique ID
   - **GetAllPersons**: Get all persons with pagination
   - **UpdatePerson**: Update person information
   - **DeletePerson**: Delete person by name

3. **Click** on **"CreatePerson"** method to examine it
4. **Notice** the following details:
   - **Method**: `CreatePerson`
   - **Package**: `person.PersonService`
   - **Description**: Create a new person in the system
   - **Request Message**: `CreatePersonRequest` with Person object
   - **Response Message**: `CreatePersonResponse` with created Person

### Step 6: Enhance Descriptions with AI Assist

MCPHub includes AI-powered features to improve gRPC method descriptions:

1. **Click** on any RPC method in the **"Endpoints"** tab
2. **Look** for the **✨✨ (double sparkle)** icon next to description fields
3. **Click** the **✨✨** button to get AI-generated suggestions
4. **Review** and apply suggestions for better tool calling performance

### Step 7: Create Your MCP Configuration

1. **Review** your configuration one final time
2. **Click** the **"Create MCP"** button
3. **Wait** for the success confirmation
4. **Verify**: You're redirected to the MCP list with your new gRPC configuration

### Step 8: Deploy Your MCP

1. **Click** the **"Deploy"** button
2. **Configure deployment settings**:
   - **Environment**: Select `Development`
   - **Target**: Keep default bridge URL
3. **Click** **"Deploy Now"**
4. **Note**: Your MCP is now live and ready for testing

### Step 9: Test Your gRPC MCP

1. **Click** the **"Test MCP"** button
2. **In the test interface**, verify:
   - **Available Tools**: Shows list of 6 gRPC methods
   - **Tool count**: 6 tools available
3. **Test a method**:
   - Select **"CreatePerson"** tool
   - Fill in person data (name, age, email, country)
   - Execute and see the gRPC response

## Sample gRPC Server Implementation

Here's a complete Node.js/TypeScript implementation of the Person service for local testing:

### Prerequisites

Install required dependencies:

```bash
npm init -y
npm install @grpc/grpc-js @grpc/proto-loader typescript @types/node
npm install -D ts-node nodemon
```

### Project Structure

```
person-grpc-server/
├── package.json
├── tsconfig.json
├── proto/
│   └── person.proto
├── src/
│   ├── server.ts
│   ├── service.ts
│   └── types.ts
└── README.md
```

### tsconfig.json

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
```

### src/types.ts

```typescript
// TypeScript interfaces for our Person service
export interface Person {
  id: string;
  name: string;
  age: number;
  email: string;
  country: string;
}

export interface CreatePersonRequest {
  person: Omit<Person, 'id'>;
}

export interface CreatePersonResponse {
  person: Person;
  message: string;
}

export interface GetPersonByNameRequest {
  name: string;
}

export interface GetPersonByNameResponse {
  person?: Person;
  found: boolean;
}

export interface GetPersonByIdRequest {
  id: string;
}

export interface GetPersonByIdResponse {
  person?: Person;
  found: boolean;
}

export interface GetAllPersonsRequest {
  limit?: number;
  offset?: number;
  country_filter?: string;
}

export interface GetAllPersonsResponse {
  persons: Person[];
  total_count: number;
  has_more: boolean;
}

export interface UpdatePersonRequest {
  person: Person;
}

export interface UpdatePersonResponse {
  person: Person;
  message: string;
}

export interface DeletePersonRequest {
  name: string;
}

export interface DeletePersonResponse {
  success: boolean;
  message: string;
}
```

### src/service.ts

```typescript
import { Person, CreatePersonRequest, CreatePersonResponse, GetPersonByNameRequest, GetPersonByNameResponse, GetPersonByIdRequest, GetPersonByIdResponse, GetAllPersonsRequest, GetAllPersonsResponse, UpdatePersonRequest, UpdatePersonResponse, DeletePersonRequest, DeletePersonResponse } from './types';

// In-memory storage for demo purposes
const persons: Map<string, Person> = new Map();

// Sample data
const samplePersons: Person[] = [
  {
    id: '1',
    name: 'John Doe',
    age: 30,
    email: 'john.doe@example.com',
    country: 'US'
  },
  {
    id: '2', 
    name: 'Jane Smith',
    age: 25,
    email: 'jane.smith@example.com',
    country: 'CA'
  },
  {
    id: '3',
    name: 'Bob Johnson',
    age: 35,
    email: 'bob.johnson@example.com', 
    country: 'UK'
  }
];

// Initialize with sample data
samplePersons.forEach(person => {
  persons.set(person.id, person);
});

// Service implementation
export const PersonService = {
  CreatePerson: (call: any, callback: any) => {
    try {
      const request: CreatePersonRequest = call.request;
      
      // Validate required fields
      if (!request.person?.name || !request.person?.email) {
        return callback({
          code: 3, // INVALID_ARGUMENT
          message: 'Name and email are required'
        });
      }
      
      // Check for duplicate email
      const existingPerson = Array.from(persons.values()).find(p => p.email === request.person.email);
      if (existingPerson) {
        return callback({
          code: 6, // ALREADY_EXISTS
          message: 'Person with this email already exists'
        });
      }
      
      // Create new person
      const newPerson: Person = {
        id: request.person.id || Date.now().toString(),
        name: request.person.name,
        age: request.person.age || 0,
        email: request.person.email,
        country: request.person.country || ''
      };
      
      persons.set(newPerson.id, newPerson);
      
      const response: CreatePersonResponse = {
        person: newPerson,
        message: 'Person created successfully'
      };
      
      callback(null, response);
    } catch (error) {
      callback({
        code: 13, // INTERNAL
        message: 'Internal server error'
      });
    }
  },

  GetPersonByName: (call: any, callback: any) => {
    try {
      const request: GetPersonByNameRequest = call.request;
      const person = Array.from(persons.values()).find(p => p.name === request.name);
      
      const response: GetPersonByNameResponse = {
        person: person || undefined,
        found: !!person
      };
      
      callback(null, response);
    } catch (error) {
      callback({
        code: 13,
        message: 'Internal server error'
      });
    }
  },

  GetPersonById: (call: any, callback: any) => {
    try {
      const request: GetPersonByIdRequest = call.request;
      const person = persons.get(request.id);
      
      const response: GetPersonByIdResponse = {
        person: person || undefined,
        found: !!person
      };
      
      callback(null, response);
    } catch (error) {
      callback({
        code: 13,
        message: 'Internal server error'
      });
    }
  },

  GetAllPersons: (call: any, callback: any) => {
    try {
      const request: GetAllPersonsRequest = call.request;
      const limit = request.limit || 100;
      const offset = request.offset || 0;
      const countryFilter = request.country_filter;
      
      let allPersons = Array.from(persons.values());
      
      // Apply country filter if provided
      if (countryFilter) {
        allPersons = allPersons.filter(p => p.country.toLowerCase() === countryFilter.toLowerCase());
      }
      
      // Sort by name for consistent ordering
      allPersons.sort((a, b) => a.name.localeCompare(b.name));
      
      const total = allPersons.length;
      const paginatedPersons = allPersons.slice(offset, offset + limit);
      
      const response: GetAllPersonsResponse = {
        persons: paginatedPersons,
        total_count: total,
        has_more: offset + limit < total
      };
      
      callback(null, response);
    } catch (error) {
      callback({
        code: 13,
        message: 'Internal server error'
      });
    }
  },

  UpdatePerson: (call: any, callback: any) => {
    try {
      const request: UpdatePersonRequest = call.request;
      
      if (!request.person?.id) {
        return callback({
          code: 3,
          message: 'Person ID is required for update'
        });
      }
      
      const existingPerson = persons.get(request.person.id);
      if (!existingPerson) {
        return callback({
          code: 5, // NOT_FOUND
          message: 'Person not found'
        });
      }
      
      // Update person
      const updatedPerson: Person = {
        ...existingPerson,
        ...request.person,
        id: existingPerson.id // Ensure ID doesn't change
      };
      
      persons.set(updatedPerson.id, updatedPerson);
      
      const response: UpdatePersonResponse = {
        person: updatedPerson,
        message: 'Person updated successfully'
      };
      
      callback(null, response);
    } catch (error) {
      callback({
        code: 13,
        message: 'Internal server error'
      });
    }
  },

  DeletePerson: (call: any, callback: any) => {
    try {
      const request: DeletePersonRequest = call.request;
      const person = Array.from(persons.values()).find(p => p.name === request.name);
      
      if (!person) {
        const response: DeletePersonResponse = {
          success: false,
          message: 'Person not found'
        };
        return callback(null, response);
      }
      
      persons.delete(person.id);
      
      const response: DeletePersonResponse = {
        success: true,
        message: 'Person deleted successfully'
      };
      
      callback(null, response);
    } catch (error) {
      callback({
        code: 13,
        message: 'Internal server error'
      });
    }
  }
};
```

### src/server.ts

```typescript
import * as grpc from '@grpc/grpc-js';
import * as protoLoader from '@grpc/proto-loader';
import { PersonService } from './service';
import path from 'path';

// Load the protobuf definition
const PROTO_PATH = path.join(__dirname, '../proto/person.proto');

const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});

const personProto = grpc.loadPackageDefinition(packageDefinition).person as any;

// Create and start the server
function startServer() {
  const server = new grpc.Server();
  
  // Add the PersonService implementation
  server.addService(personProto.PersonService.service, PersonService);
  
  const serverAddress = '0.0.0.0:50051';
  
  server.bindAsync(
    serverAddress,
    grpc.ServerCredentials.createInsecure(), // No TLS for local development
    (error, port) => {
      if (error) {
        console.error('Failed to start server:', error);
        return;
      }
      
      console.log(`🚀 gRPC Server started successfully!`);
      console.log(`📡 Server listening on ${serverAddress}`);
      console.log(`🔧 TLS: Disabled (perfect for MCPHub testing)`);
      console.log(`📝 Available services:`);
      console.log(`   - person.PersonService`);
      console.log(`📋 Available methods:`);
      console.log(`   - CreatePerson`);
      console.log(`   - GetPersonByName`);
      console.log(`   - GetPersonById`);
      console.log(`   - GetAllPersons`);
      console.log(`   - UpdatePerson`);
      console.log(`   - DeletePerson`);
      console.log(`\n🎯 Ready for MCPHub import!`);
      console.log(`   Server URL: localhost:50051`);
      console.log(`   TLS Enabled: false`);
      
      server.start();
    }
  );
}

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log('\n🛑 Shutting down gRPC server...');
  process.exit(0);
});

// Start the server
startServer();
```

### package.json scripts

Add these scripts to your `package.json`:

```json
{
  "scripts": {
    "dev": "ts-node src/server.ts",
    "build": "tsc",
    "start": "node dist/server.js",
    "watch": "nodemon --exec ts-node src/server.ts"
  }
}
```

### Running the gRPC Server

1. **Save the proto file**: Create `proto/person.proto` with the proto definition from above
2. **Install dependencies**: 
   ```bash
   npm install
   ```
3. **Start the server**:
   ```bash
   npm run dev
   ```
4. **Verify server is running**: You should see:
   ```
   🚀 gRPC Server started successfully!
   📡 Server listening on 0.0.0.0:50051
   🔧 TLS: Disabled (perfect for MCPHub testing)
   ```

### Testing with MCPHub

Once your gRPC server is running:

1. **Import into MCPHub** using the proto definition above
2. **Configure server settings**:
   - **Server URL**: `localhost:50051`
   - **TLS Enabled**: `false` ⚠️ **Important!**
3. **Test the methods**:
   - **CreatePerson**: Create new persons
   - **GetAllPersons**: See the 3 sample persons
   - **GetPersonByName**: Find "John Doe", "Jane Smith", or "Bob Johnson"
   - **GetPersonById**: Search by ID "1", "2", or "3"

### Sample Test Queries

Try these in MCPHub's test interface:

```
"Create a new person named Alice Cooper, age 28, email alice@example.com, from Australia"

"Find the person named John Doe"

"Get all persons from the US"

"Find the person with ID 1"

"Update John Doe's age to 31"

"Delete the person named Bob Johnson"
```

## Pro Tips

### TLS Configuration
When configuring your gRPC server settings during import:
- ✅ Set TLS to `false` for local development servers
- ✅ Set TLS to `true` for production servers with proper certificates
- ⚠️ Double-check the TLS setting if you encounter connection errors

### Server URL Format
Use these URL formats for best results:
- **Local**: `localhost:50051` or `127.0.0.1:50051`
- **Remote**: `grpc.example.com:443` or `api.example.com:9090`