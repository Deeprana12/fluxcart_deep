# FluxKart

**Linking different orders made with different contact information to the same person.**


**Stack used:**

```markdown
- Backend framework: NodeJS (with JavaScript)
- Database: Amazon RDS for MySQL
- Deploy: Amazon Lambda - serverless
```

**Explore endpoint with JSON request containing:**

Endpoint: `https://foh9fg8r69.execute-api.us-east-1.amazonaws.com/dev/api/identify`

```json
{
    "email": "youremail",
    "phoneNumber": "yourphonenumber"
}
```

**Example 1:**

**Request:**

```json
{
    "email": "jon@gmail.com",
    "phoneNumber": 9857659842
}
```

**Response:**

```json
{
    "contact": {
        "primaryContactId": 5,
        "emails": [
            "jon@gmail.com"
        ],
        "phoneNumbers": [
            9857659842
        ],
        "secondaryContactIds": []
    }
}
```

**Example 2:**

**Request:**

```json
{
    "email": "aegon@gmail.com",
    "phoneNumber": 9857659842
}
```

**Response:**

```json
{
    "contact": {
        "primaryContactId": 5,
        "emails": [
            "jon@gmail.com",
            "aegon@gmail.com"
        ],
        "phoneNumbers": [
            "9857659842"
        ],
        "secondaryContactIds": [
            6
        ]
    }
}
```

In the above examples, both contacts are linked to the first person, who is the primary contact, while the other one becomes secondary.

**Additional Requests:**

The following requests will return the same response:

Request 1:

```json
{
    "email": "aegon@gmail.com"
}
```

Request 2:

```json
{
    "phoneNumber": 9857659842
}
```

Request 3:

```json
{
    "email": "jon@gmail.com"
}
```
