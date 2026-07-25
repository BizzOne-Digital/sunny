# API Quick Reference - DTdogs.ca

Base URL: `http://localhost:3001/api`

## 🔐 Authentication

### Login
```http
POST /auth/login
Content-Type: application/json

{
  "email": "admin@dtdogs.ca",
  "password": "Admin@12345"
}

Response: Sets admin_token cookie
```

### Logout
```http
POST /auth/logout

Response: Clears admin_token cookie
```

### Get Current User
```http
GET /auth/me
Cookie: admin_token=...

Response: {
  "success": true,
  "admin": {
    "id": "...",
    "email": "admin@dtdogs.ca",
    "name": "Admin",
    "role": "super-admin"
  }
}
```

---

## 🐕 Services

### Get All Services
```http
GET /services

Response: {
  "success": true,
  "services": [...]
}
```

### Get Single Service
```http
GET /services/dog-walking

Response: {
  "success": true,
  "service": {...}
}
```

### Create Service (Admin Only)
```http
POST /services
Cookie: admin_token=...
Content-Type: application/json

{
  "slug": "new-service",
  "name": "New Service",
  "eyebrow": "Premium care",
  "description": "...",
  "priceLabel": "$30",
  ...
}
```

### Update Service (Admin Only)
```http
PUT /services/dog-walking
Cookie: admin_token=...
Content-Type: application/json

{
  "priceLabel": "$25",
  "description": "Updated description"
}
```

### Delete Service (Admin Only)
```http
DELETE /services/dog-walking
Cookie: admin_token=...
```

---

## 📦 Bundles

Same pattern as Services:
- `GET /bundles` - Get all
- `GET /bundles/[slug]` - Get single
- `POST /bundles` - Create (admin)
- `PUT /bundles/[slug]` - Update (admin)
- `DELETE /bundles/[slug]` - Delete (admin)

---

## 🛍️ Products

Same pattern as Services:
- `GET /products` - Get all
- `GET /products/[slug]` - Get single
- `POST /products` - Create (admin)
- `PUT /products/[slug]` - Update (admin)
- `DELETE /products/[slug]` - Delete (admin)

**Example: Update Product Status**
```http
PUT /products/dog-dad-merch
Cookie: admin_token=...
Content-Type: application/json

{
  "status": "published",
  "priceLabel": "$33",
  "images": [
    {
      "id": "dog-dad-merch-1",
      "url": "https://res.cloudinary.com/...",
      "alt": "Dog Dad Merch",
      "title": "Dog Dad Long Sleeve Shirt",
      "order": 1
    }
  ]
}
```

---

## 👥 Team

Same pattern as Services:
- `GET /team` - Get all
- `GET /team/[slug]` - Get single
- `POST /team` - Create (admin)
- `PUT /team/[slug]` - Update (admin)
- `DELETE /team/[slug]` - Delete (admin)

---

## ❓ FAQs

Same pattern as Services:
- `GET /faqs` - Get all (grouped by category)
- `GET /faqs/[slug]` - Get single
- `POST /faqs` - Create (admin)
- `PUT /faqs/[slug]` - Update (admin)
- `DELETE /faqs/[slug]` - Delete (admin)

**Example: Update FAQ**
```http
PUT /faqs/how-to-get-started
Cookie: admin_token=...
Content-Type: application/json

{
  "question": "How do I get started?",
  "answer": "Updated answer here...",
  "category": "General Daycare and Boarding FAQs",
  "status": "published",
  "order": 1
}
```

---

## 🔧 Common Request Examples

### Add Images to Service
```http
PUT /services/dog-walking
Cookie: admin_token=...
Content-Type: application/json

{
  "images": [
    {
      "id": "dog-walking-1",
      "url": "https://res.cloudinary.com/dpp3nig3n/...",
      "alt": "Dog walking in Toronto",
      "title": "Professional dog walking service"
    }
  ]
}
```

### Update Product from Coming Soon to Published
```http
PUT /products/dog-mom-merch
Cookie: admin_token=...
Content-Type: application/json

{
  "status": "published",
  "priceLabel": "$33",
  "images": [
    {
      "id": "dog-mom-1",
      "url": "CLOUDINARY_URL",
      "alt": "Dog Mom Merch",
      "title": "Dog Mom Long Sleeve",
      "order": 1
    },
    {
      "id": "dog-mom-2",
      "url": "CLOUDINARY_URL_2",
      "alt": "Dog Mom Merch Detail",
      "title": "Dog Mom Shirt Detail",
      "order": 2
    }
  ]
}
```

---

## 📝 Error Responses

### 401 Unauthorized
```json
{
  "error": "Unauthorized"
}
```

### 404 Not Found
```json
{
  "error": "Service not found"
}
```

### 400 Bad Request
```json
{
  "error": "Email and password are required"
}
```

### 500 Server Error
```json
{
  "error": "Internal server error"
}
```

---

## 🧪 Testing with Postman

1. **Import Collection:**
   - Create a new collection
   - Add environment variable: `BASE_URL = http://localhost:3001/api`

2. **Login First:**
   - Make login request
   - Cookie will be automatically saved

3. **Test Other Endpoints:**
   - All subsequent requests will include the cookie
   - Try GET requests (public)
   - Try POST/PUT/DELETE (admin only)

---

## 💾 Database Direct Access

Connect to MongoDB:
```bash
mongosh mongodb://127.0.0.1:27017/dtdogs
```

View collections:
```javascript
show collections
db.services.find()
db.bundles.find()
db.products.find()
db.teams.find()
db.faqs.find()
```

---

**All endpoints follow REST conventions and return JSON responses.**
