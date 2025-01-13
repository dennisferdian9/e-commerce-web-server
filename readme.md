# E-commerce-web-server

## how to run

- running migration.sql in posgresql
- npm i
- setup .env DATABASE_URL= like .env.example
- npm run dev
- get localhost:8080/

## Endpoint
### Products
- GET - /products
- GET - /product/:id
- GET - /product/local - get all transactions
- POST - /product - Post transaction
- POST - /product/save - save to local db
- PATCH - /product/:id - Update transaction by id
- DELETE - /product/:id - Delete transaction by id

### Transactions
- GET - /transaction/:id
- GET - /transactions - Get all transactions
- POST - /transactions - Post transaction
- PATCH - /transaction/:id - Update transaction by id
- DELETE - /transaction/:id - Delete transaction by id
