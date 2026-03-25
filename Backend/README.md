# Shopping Platform Backend

A TypeScript-based Node.js backend for the shopping platform, built with Express, MongoDB, and TypeScript for type safety and scalability.

## Project Structure

```
Backend/
├── src/
│   ├── config/           # Configuration files
│   │   └── db.ts         # MongoDB connection
│   ├── controllers/       # Route controllers
│   │   ├── auth.controller.ts
│   │   ├── cart.controller.ts
│   │   ├── product.controller.ts
│   │   ├── order.controller.ts
│   │   ├── review.controller.ts
│   │   ├── wishlist.controller.ts
│   │   ├── address.controller.ts
│   │   ├── admin.controller.ts
│   │   ├── payment.controller.ts
│   │   └── cartMerge.controller.ts
│   ├── middlewares/       # Express middlewares
│   │   ├── auth.middleware.ts
│   │   └── error.middleware.ts
│   ├── models/           # Mongoose schemas
│   │   ├── user.schema.ts
│   │   ├── product.schema.ts
│   │   ├── cart.schema.ts
│   │   ├── order.schema.ts
│   │   ├── review.schema.ts
│   │   ├── wishlist.schema.ts
│   │   └── address.schema.ts
│   ├── routes/           # API routes
│   │   └── index.ts
│   ├── types/            # TypeScript type definitions
│   │   └── index.d.ts
│   ├── utils/            # Utility functions
│   │   ├── buildResponse.ts
│   │   ├── buildErrorObject.ts
│   │   ├── handleError.ts
│   │   ├── encrypt.ts
│   │   ├── decrypt.ts
│   │   ├── generateTokens.ts
│   │   ├── generate-forgot-token.ts
│   │   ├── isIDGood.ts
│   │   ├── validateRequest.ts
│   │   └── getSignedUrl.ts
│   └── server.ts         # Main server file
├── dist/                 # Compiled JavaScript (generated)
├── .env.example          # Environment variables template
├── .gitignore            # Git ignore file
├── tsconfig.json         # TypeScript configuration
├── nodemon.json          # Nodemon configuration
├── package.json          # Dependencies and scripts
└── README.md             # This file
```

## Prerequisites

- Node.js 16+ and npm
- MongoDB 4.4+
- TypeScript 5.3+

## Installation

### 1. Install dependencies

```bash
npm install
```

### 2. Setup environment variables

Copy `.env.example` to `.env` and configure:

```bash
cp .env.example .env
```

Update the `.env` file with your configuration:

```env
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb://localhost:27017/shopping_platform
AUTH_SECRET=your_secret_key_here
REFRESH_SECRET=your_refresh_key_here
# ... (other env variables)
```

### 3. Generate encryption keys (Optional but recommended)

For production, generate secure encryption keys:

```bash
node -e "console.log(require('crypto').randomBytes(16).toString('hex'))"  # IV
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"  # Key
```

## Running the Server

### Development Mode (with hot reload)

```bash
npm run dev
```

The server will automatically restart when you modify files in the `src` directory.

### Production Mode

Build and start:

```bash
npm run build
npm start
```

The compiled JavaScript will be in the `dist/` directory.

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Register a new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user
- `POST /api/auth/send-otp` - Send OTP for verification
- `POST /api/auth/verify-otp` - Verify OTP
- `GET /api/auth/me` - Get current user (requires auth)
- `POST /api/auth/refresh` - Refresh access token

### Cart
- `POST /api/cart/add` - Add item to cart
- `POST /api/cart/remove` - Remove item from cart
- `PUT /api/cart/update` - Update cart item quantity
- `GET /api/cart` - Get cart items
- `DELETE /api/cart/clear` - Clear cart
- `POST /api/cart/merge` - Merge guest and user carts

### Products
- `GET /api/products` - Get all products (paginated, filterable)
- `GET /api/products/:id` - Get single product
- `GET /api/products/featured` - Get featured products
- `GET /api/products/trending` - Get trending products
- `GET /api/search?q=query` - Search products

### Orders
- `POST /api/orders` - Create order (requires auth)
- `GET /api/orders` - Get user orders (requires auth)
- `GET /api/orders/:id` - Get order details (requires auth)
- `POST /api/orders/:id/cancel` - Cancel order (requires auth)
- `PUT /api/orders/:id/status` - Update order status (requires admin)

### Reviews
- `POST /api/reviews` - Create review (requires auth)
- `GET /api/reviews/product/:productId` - Get product reviews
- `GET /api/reviews` - Get user reviews (requires auth)
- `PUT /api/reviews/:id` - Update review (requires auth)
- `DELETE /api/reviews/:id` - Delete review (requires admin)

### Wishlist
- `POST /api/wishlist/add` - Add to wishlist (requires auth)
- `GET /api/wishlist` - Get wishlist (requires auth)
- `DELETE /api/wishlist/:productId` - Remove from wishlist (requires auth)
- `DELETE /api/wishlist/clear` - Clear wishlist (requires auth)

### Addresses
- `POST /api/addresses` - Add address (requires auth)
- `GET /api/addresses` - Get user addresses (requires auth)
- `PUT /api/addresses/:id` - Update address (requires auth)
- `DELETE /api/addresses/:id` - Delete address (requires auth)
- `POST /api/addresses/:id/default` - Set default address (requires auth)

### Payment
- `POST /api/payments/create` - Create Razorpay order (requires auth)
- `POST /api/payments/verify` - Verify payment (requires auth)

### Admin
- `GET /api/admin/dashboard` - Get dashboard stats (requires admin)
- `GET /api/admin/users` - Get all users (requires admin)
- `DELETE /api/admin/users/:id` - Delete user (requires admin)
- `POST /api/admin/products` - Create product (requires admin)
- `PUT /api/admin/products/:id` - Update product (requires admin)
- `DELETE /api/admin/products/:id` - Delete product (requires admin)

## Features

✅ **TypeScript** - Full type safety with strict mode
✅ **Authentication** - JWT-based with refresh tokens
✅ **Encryption** - Secure token encryption/decryption
✅ **MongoDB** - Document-based data storage
✅ **Middleware** - Auth, error handling, rate limiting
✅ **API Validation** - Express-validator integration
✅ **Error Handling** - Centralized error management
✅ **CORS** - Configured for frontend integration
✅ **Session Management** - MongoDB session store
✅ **Rate Limiting** - Request rate limiting
✅ **Helmet** - Security headers
✅ **Morgan** - HTTP request logging

## Technologies

- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB ODM
- **TypeScript** - Type-safe JavaScript
- **JWT** - Token authentication
- **bcrypt** - Password hashing
- **Nodemon** - Development hot reload
- **Razorpay** - Payment gateway
- **AWS S3** - File storage
- **Nodemailer** - Email service

## Scripts

```bash
# Build TypeScript to JavaScript
npm run build

# Start production server
npm start

# Start development server with hot reload
npm run dev
```

## Environment Variables

See `.env.example` for all available environment variables.

Key variables:
- `PORT` - Server port (default: 5000)
- `MONGO_URI` - MongoDB connection string
- `AUTH_SECRET` - JWT authentication secret
- `REFRESH_SECRET` - JWT refresh secret
- `ENCRYPTION_KEY` - Data encryption key (32 bytes hex)
- `ENCRYPTION_IV` - Encryption IV (16 bytes hex)
- `SESSION_SECRET` - Session secret
- `RAZORPAY_KEY_ID` - Razorpay API key
- `AWS_*` - AWS S3 credentials

## Error Handling

All errors are handled centrally in `src/middlewares/error.middleware.ts` and returned in a consistent format:

```json
{
  "success": false,
  "code": 400,
  "message": "Error message here"
}
```

## Middleware

### Authorization Middleware
Protects routes that require authentication:

```typescript
authMiddleware - Checks JWT token and sets req.user
adminMiddleware - Checks admin role
```

## TypeScript Configuration

The `tsconfig.json` is configured for:
- ES2020 target and module
- Strict mode enabled
- Strict property initialization disabled (for Mongoose)
- Source maps for debugging
- Declaration files for type checking

## Troubleshooting

### MongoDB Connection Issues
- Ensure MongoDB is running: `mongod`
- Check `MONGO_URI` in `.env`

### Port Already in Use
```bash
# Change PORT in .env or:
PORT=5001 npm run dev
```

### TypeScript Errors
```bash
# Clear and rebuild
rm -rf dist
npm run build
```

### Encryption Issues
- Generate new encryption keys in `.env`
- Use exact hex format (32 bytes for key, 16 for IV)

## Contributing

Follow these guidelines:
1. Create feature branches from `develop`
2. Use TypeScript with strict mode
3. Add proper type definitions
4. Update API documentation
5. Test endpoints before committing

## License

ISC

## Support

For issues or questions, please create an issue in the repository.
