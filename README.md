# Museum Visitors API
This is a simple Express server on **NodeJS** with a single API.

## Prerequisites
- NodeJS
- npm

## Setup
1. Clone the repository.
2. Install dependencies
```
npm install
```
3. Start the server
```
npm run start-server
```
Note: The server starts at the port **3000**.

## API Routes
### Get Visitors
Description: Gets the highest, lowest and total footfalls of various museums in LA. 

Request Method: `GET`

Request URL: `http://localhost:3000/api/visitors`

Query Parameters:

| Name  | Description | isRequired | Example value |
| ------------- | ------------- | ------------- | ------------- |
| `date`  | time in milliseconds  | `true` | 1404198000000 |
| `ignore`  | museum to be ignored  | `false` | avila_adobe |

Sample Response: 
```json
{
    "attendance": {
        "month": "Jul",
        "year": 2014,
        "highest": { "museum": "avila_adobe", "visitors": 32378 },
        "lowest": { "museum": "hellman_quon", "visitors": 120 },
        "ignored": { "museum": "visitor_center_avila_adobe", "visitors": 3527 },
        "total": 57008
    }
}
``` 
*Data source*: [LA City](https://data.lacity.org/Arts-Culture/Museum-Visitors/trxm-jn3c)              

## Run tests
Tests have been written using [Jest](https://www.npmjs.com/package/jest) and [SuperTest](https://www.npmjs.com/package/supertest).

To run the test suite simply execute the command
```
npm run test
```

