#!/bin/bash

# Configuration
DB_NAME="cors_management"
COLLECTION="corspolicies"

# Function to add/update origin
upsert_origin() {
    local origin=$1
    local credentials=$2
    local methods=$3
    local headers=$4

    echo "Upserting CORS policy for: $origin"
    
    # Use mongosh (or mongo for older versions) to update the database
    mongosh $DB_NAME --eval "
        db.$COLLECTION.updateOne(
            { origin: '$origin' },
            { 
                \$set: { 
                    origin: '$origin',
                    allowCredentials: $credentials,
                    allowedMethods: $methods,
                    allowedHeaders: $headers,
                    updatedAt: new Date()
                }
            },
            { upsert: true }
        )
    "
}

# Example Usage
if [ "$#" -lt 2 ]; then
    echo "Usage: $0 <origin> <allowCredentials(true|false)> [methods_json] [headers_json]"
    echo "Example: $0 http://localhost:8080 true '[\"GET\",\"POST\"]' '[\"Content-Type\"]'"
    exit 1
fi

upsert_origin "$1" "$2" "${3:-'["GET", "POST", "PUT", "DELETE", "OPTIONS"]'}" "${4:-'["Content-Type", "Authorization"]'}"
