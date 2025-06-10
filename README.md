# E-commerce Application Backend

This is the backend for an e-commerce application, designed to handle various aspects of an online store, including user authentication, product management, and discount handling. It's built with a focus on modularity and common best practices.

## Technologies Used

This project leverages the following key technologies and libraries:

**Backend Framework:**

  * **Node.js**: Asynchronous event-driven JavaScript runtime environment.
  * **Express.js**: Fast, unopinionated, minimalist web framework for Node.js.

**Database:**

  * **MongoDB**: A NoSQL document database used for storing application data.
  * **Mongoose**: An ODM (Object Data Modeling) library for MongoDB and Node.js, providing a schema-based solution to model application data.

**Authentication & Security:**

  * **bcrypt**: Library to help hash passwords.
  * **jsonwebtoken**: JSON Web Token implementation for Node.js, used for secure authentication.
  * **helmet**: Helps secure Express apps by setting various HTTP headers.
  * **compression**: Node.js compression middleware.
  * **morgan**: HTTP request logger middleware for Node.js.

**Utilities:**

  * **dotenv**: Loads environment variables from a `.env` file.
  * **lodash**: A modern JavaScript utility library delivering modularity, performance, & extras.
  * **slugify**: Generates URL-friendly slugs from strings.
  * **prettier**: An opinionated code formatter used for maintaining consistent code style.

## Project Structure

The project follows a modular structure to ensure maintainability and scalability:

  * **`server.js`**: The entry point of the application, responsible for starting the server and connecting to the database.
  * **`src/app.js`**: Configures the Express application, applies middleware (morgan, helmet, compression, express.json, express.urlencoded), initializes the database connection, and registers API routes. It also includes global error handling.
  * **`src/configs/config.mongodb.js`**: Manages development and production database configurations, including port, username, password, and cluster details.
  * **`src/dbs/init.db.js`**: Handles the MongoDB connection using Mongoose, including debug mode for development and a singleton pattern for the database instance.
  * **`src/helpers/check.connect.js`**: Provides utility functions to check database connection status and monitor server overload.
  * **`src/models/`**: Defines Mongoose schemas for various entities like `Shop`, `Product`, `ApiKey`, `KeyToken`, `Discount`, and `Inventory`.
      * `product.model.js` also defines sub-schemas for `Clothing`, `Electronic`, and `Furniture` products, demonstrating a design pattern for product variations.
  * **`src/models/repositories/`**: Contains repository files (`discount.repo.js`, `inventory.repo.js`, `product.repo.js`) that abstract database interactions, keeping services clean from direct Mongoose calls.
  * **`src/services/`**: Implements the business logic for different modules (e.g., `access.service.js` for authentication, `product.service.js` for product management, `discount.service.js` for discount operations, `keyToken.service.js` for JWT key management).
  * **`src/routes/`**: Defines API routes and links them to the corresponding controller functions.
      * `src/routes/index.js` acts as the main router, applying API key and permission checks globally.
  * **`src/auth/`**: Contains authentication-related utilities and middleware (`authUtils.js` for token creation and authentication, `checkAuth.js` for API key and permission checks).
  * **`src/controllers/`**: Houses the controllers (`access.controller.js`, `product.controller.js`) that handle incoming requests, interact with services, and send responses.
  * **`src/core/`**: Defines custom error and success response classes (`error.response.js`, `success.response.js`) for consistent API responses.
  * **`src/utils/`**: Contains general utility functions (`index.js` for data manipulation, `createKeyPair.js` for key generation, `httpStatusCode.js`, `reasonPhrases.js`, `statusCodes.js` for HTTP status handling).

## Features

### Authentication & Authorization

  * **Shop Registration (`/v1/api/shop/signup`)**: Allows new shops to register with a name, email, and password. Passwords are BCRYPT hashed.
  * **Shop Login (`/v1/api/shop/login`)**: Authenticates existing shops and generates an access token and a refresh token for subsequent API calls. Public and private keys are used for JWT signing and verification.
  * **Logout (`/v1/api/shop/logout`)**: Invalidates the current session's tokens, removing the key store entry from the database.
  * **Refresh Token Handling (`/v1/api/shop/handleRefreshToken`)**: Allows clients to obtain a new access token and refresh token pair using an existing refresh token, with checks for token reuse.
  * **API Key Verification**: All API routes are protected by an API key check (`x-api-key` header).
  * **Permission Control**: Routes are protected by a permission middleware that checks if the `x-api-key` has the required permissions (e.g., '0000' for product management).
  * **Role-Based Access**: Shops can have roles such as `SHOP`, `WRITER`, `EDITOR`, and `ADMIN`.

### Product Management

  * **Create Product (`/v1/api/product`)**: Allows authenticated shops to create new products. Supports different product types: `Electronic`, `Clothing`, and `Furniture`, using a Factory and Strategy design pattern.
  * **Update Product (`/v1/api/product/:productId`)**: Enables shops to update product details.
  * **Publish/Unpublish Product (`/v1/api/product/publish/:id`, `/v1/api/product/unpublish/:id`)**: Shops can change the `isDraft` and `isPublish` status of their products.
  * **Get Draft Products (`/v1/api/product/drafts/all`)**: Retrieves a list of all products in draft status for a given shop.
  * **Get Published Products (`/v1/api/product/published/all`)**: Retrieves a list of all published products for a given shop.
  * **Search Products (`/v1/api/product/search/:keySearch`)**: Allows users to search for products by keywords in product name and description.
  * **Get All Products (`/v1/api/product`)**: Fetches a paginated list of all published products, with options for sorting and filtering.
  * **Get Single Product (`/v1/api/product/:product_id`)**: Retrieves details for a specific product by its ID.

### Discount Management

  * **Create Discount Code**: Allows shops to generate various types of discount codes (fixed amount or percentage), with configurable start/end dates, max uses, min order value, and product applicability.
  * **Update Discount Code**: Enables modification of existing discount codes.
  * **Get All Discount Codes by Shop**: Retrieves a list of active discount codes available for a specific shop.
  * **Get All Products by Discount Code**: Fetches products to which a specific discount code can be applied.
  * **Calculate Discount Amount**: Determines the actual discount value for a given set of products and discount code, considering minimum order value and usage limits.

### Inventory Management

  * **Insert Inventory**: Automatically adds product stock to the inventory collection upon product creation.

## Prerequisites

Before running this application, ensure you have the following installed on your machine:

  * **Node.js**: v18 or later.
  * **npm**: v10 or later.
  * **MongoDB**: Installed and running locally, or access to a MongoDB Atlas cluster.

## Installation

Follow these steps to set up and run the application:

1.  **Clone the repository**:

    ```bash
    git clone https://github.com/Tao242dn/ecommerce-app.git
    ```

2.  **Navigate to the project directory**:

    ```bash
    cd ecommerce-app
    ```

3.  **Install dependencies**:

    ```bash
    npm install
    ```

4.  **Configure environment variables**:
    Rename `.env-example` to `.env` in the root directory of the project and add the necessary environment variables for your MongoDB connection (e.g., `DEV_MONGODB_USERNAME`, `DEV_MONGODB_PASSWORD`, `DEV_MONGODB_CLUSTER`).

5.  **Start the server**:

    ```bash
    npm run dev
    ```

    The server will start running on the port configured in your `.env` file (defaulting to 4000 for development).

## Scripts

  * `npm run dev`: Starts the server with `--watch` for development, automatically restarting on file changes.
  * `npm run format`: Formats the code using Prettier.

## Code Formatting

This project uses [Prettier](https://prettier.io/) for code formatting. The configuration is defined in `.prettierrc.json`. You can run `npm run format` to automatically format your code.

## Environment Variables

The application relies on environment variables for configuration. A `.env-example` file is provided as a template. You should create a `.env` file based on this example and fill in your specific values.

Example `.env` content:

```
DEV_APP_PORT=4000
DEV_MONGODB_USERNAME=your_dev_username
DEV_MONGODB_PASSWORD=your_dev_password
DEV_MONGODB_CLUSTER=your_dev_cluster_name

PRO_APP_PORT=3000
PRO_MONGODB_USERNAME=your_pro_username
PRO_MONGODB_PASSWORD=your_pro_password
PRO_MONGODB_CLUSTER=your_pro_cluster_name

NODE_ENV=dev
```

Replace `your_dev_username`, `your_dev_password`, `your_dev_cluster_name`, etc., with your actual MongoDB credentials and cluster details.
