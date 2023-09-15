# fluxcart_deep

Stack used:

Backend framework: NodeJS (with javascript)
Database: Amazon RDS for MySQL
Deploy: Amazon Lambda - serverless

Explore endpoint with JSON request containing: 

https://foh9fg8r69.execute-api.us-east-1.amazonaws.com/dev/api/identify
{
    email: youremail,
    phoneNumber: yourphonenumber
}

Linking different orders made with different contact information to the same person.

Ex: 1

Request:
{
    "email": "jon@gmail.com",
    "phoneNumber": 9857659842
}

Response:
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

Ex:

Request:
{
    "email": "aegon@gmail.com",
    "phoneNumber": 9857659842
}

Response:
{
    "contact": {
        "primaryContactid": 5,
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

above both are  linked to first person which is primary contact and other one becomes secondary.

Below all requests will return same response:

{
    "email": "aegon@gmail.com"
}

{    
    "phoneNumber": 9857659842
}

{
    "email": "jon@gmail.com"
}