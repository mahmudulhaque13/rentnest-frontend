# API Integration Documentation

## RentNest Frontend

This document describes the API integrations used by the RentNest
Next.js frontend.

The frontend communicates with the backend through the Next.js
API proxy using the `/api` base path.

---

## Base URL

The frontend uses:

```text
/api
1. Authentication APIs
Register User

Method: POST

Endpoint:

/api/auth/register

Purpose: Creates a new user account.

Request Body:

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "12345678",
  "phone": "01700000000",
  "role": "TENANT"
}

Roles available for registration:

TENANT
LANDLORD

Admin accounts are not created through public registration.

Frontend Service:

services/auth.ts

Frontend Page:

/app/auth/register
Login

Method: POST

Endpoint:

/api/auth/login

Purpose: Authenticates a user and returns an access token.

Request Body:

{
  "email": "john@example.com",
  "password": "12345678"
}

Frontend Service:

services/auth.ts

Frontend Page:

/app/auth/login
Get Current User

Method: GET

Endpoint:

/api/auth/me

Purpose: Gets the currently authenticated user.

Authentication:

Authorization: <accessToken>

Frontend Service:

services/auth.ts

Used By:

components/providers/auth-provider.tsx
Refresh Token

Method: POST

Endpoint:

/api/auth/refresh-token

Purpose: Refreshes the authentication session.

Frontend Service:

services/auth.ts
Logout

Method: POST

Endpoint:

/api/auth/logout

Purpose: Logs out the authenticated user.

Frontend Service:

services/auth.ts
2. Category APIs
Get Categories

Method: GET

Endpoint:

/api/categories

Purpose: Retrieves property categories.

Frontend Service:

services/category.ts
3. Property APIs
Get All Properties

Method: GET

Endpoint:

/api/properties

Purpose: Retrieves available properties for public users.

Frontend Service:

services/property.ts

Used By:

/app/page.tsx
/app/properties
Get Property Details

Method: GET

Endpoint:

/api/properties/:id

Purpose: Retrieves details of a specific property.

Frontend Service:

services/property.ts

Used By:

/app/properties/[id]
Create Property

Method: POST

Endpoint:

/api/properties

Purpose: Creates a new property listing.

Authentication: Required

Role: LANDLORD

Frontend Service:

services/property.ts

Used By:

/app/landlord/properties/create
Get My Properties

Method: GET

Endpoint:

/api/properties/my-properties

Purpose: Retrieves properties owned by the authenticated landlord.

Authentication: Required

Role: LANDLORD

Frontend Service:

services/property.ts

Used By:

/app/landlord/properties
Update Property

Method: PATCH

Endpoint:

/api/properties/:id

Purpose: Updates an existing property.

Authentication: Required

Role: LANDLORD

Frontend Service:

services/property.ts

Used By:

/app/landlord/properties/[id]/edit
Delete Property

Method: DELETE

Endpoint:

/api/properties/:id

Purpose: Deletes a property.

Authentication: Required

Role: LANDLORD

Frontend Service:

services/property.ts
4. Rental Request APIs
Create Rental Request

Method: POST

Endpoint:

/api/rental-requests

Purpose: Allows a tenant to request a property.

Authentication: Required

Role: TENANT

Frontend Service:

services/rental-request.ts
Get My Rental Requests

Method: GET

Endpoint:

/api/rental-requests/my-requests

Purpose: Retrieves rental requests created by the authenticated tenant.

Authentication: Required

Role: TENANT

Frontend Service:

services/rental-request.ts

Used By:

/app/rental-requests
Cancel Rental Request

Method: DELETE

Endpoint:

/api/rental-requests/:requestId

Purpose: Allows a tenant to cancel a rental request.

Authentication: Required

Role: TENANT

Frontend Service:

services/rental-request.ts
Get Landlord Rental Requests

Method: GET

Endpoint:

/api/rental-requests/landlord-requests

Purpose: Retrieves rental requests for the authenticated landlord's properties.

Authentication: Required

Role: LANDLORD

Frontend Service:

services/rental-request.ts

Used By:

/app/landlord/rental-requests
Approve Rental Request

Method: PATCH

Endpoint:

/api/rental-requests/:requestId/approve

Purpose: Approves a rental request.

Authentication: Required

Role: LANDLORD

Frontend Service:

services/rental-request.ts
Reject Rental Request

Method: PATCH

Endpoint:

/api/rental-requests/:requestId/reject

Purpose: Rejects a rental request.

Authentication: Required

Role: LANDLORD

Frontend Service:

services/rental-request.ts
5. Payment APIs
Create Stripe Checkout Session

Method: POST

Endpoint:

/api/payments/checkout

Purpose: Creates a Stripe checkout session for an approved rental request.

Authentication: Required

Role: TENANT

Request Body:

{
  "rentalRequestId": "request-id"
}

Frontend Service:

services/payment.ts
Get My Payments

Method: GET

Endpoint:

/api/payments/my-payments

Purpose: Retrieves payment history for the authenticated tenant.

Authentication: Required

Role: TENANT

Frontend Service:

services/payment.ts

Used By:

/app/payments
Get Landlord Earnings

Method: GET

Endpoint:

/api/payments/earnings

Purpose: Retrieves landlord earnings and payment history.

Authentication: Required

Role: LANDLORD

Frontend Service:

services/payment.ts

Used By:

/app/landlord/earnings
6. Review APIs
Get Property Reviews

Method: GET

Endpoint:

/api/reviews/property/:propertyId

Purpose: Retrieves reviews for a property.

Frontend Service:

services/review.ts
Create Review

Method: POST

Endpoint:

/api/reviews

Purpose: Creates a property review.

Authentication: Required

Role: TENANT

Frontend Service:

services/review.ts
Update Review

Method: PATCH

Endpoint:

/api/reviews/:reviewId

Purpose: Updates an existing review.

Authentication: Required

Role: TENANT

Frontend Service:

services/review.ts
Delete Review

Method: DELETE

Endpoint:

/api/reviews/:reviewId

Purpose: Deletes an existing review.

Authentication: Required

Role: TENANT

Frontend Service:

services/review.ts
7. Admin APIs
Get Users

Method: GET

Endpoint:

/api/admin/users

Purpose: Retrieves users for administration.

Authentication: Required

Role: ADMIN

Frontend Service:

services/admin.ts

Used By:

/app/admin/users
Update User Status

Method: PATCH

Endpoint:

/api/admin/users/:userId

Purpose: Updates a user's account status.

Authentication: Required

Role: ADMIN

Supported Statuses:

ACTIVE
BLOCKED

Frontend Service:

services/admin.ts

Used For:

Ban / Unban
Get All Properties

Method: GET

Endpoint:

/api/admin/properties

Purpose: Retrieves properties for admin moderation.

Authentication: Required

Role: ADMIN

Frontend Service:

services/admin.ts

Used By:

/app/admin/properties
Get All Rental Requests

Method: GET

Endpoint:

/api/admin/rental-requests

Purpose: Retrieves rental requests across the platform.

Authentication: Required

Role: ADMIN

Frontend Service:

services/admin.ts

Used By:

/app/admin/rental-requests
8. Authentication Handling

Authenticated requests send the access token through the Authorization header.

Example:

Authorization: <accessToken>

The frontend AuthProvider loads the authenticated user and
controls authentication state across the application.

9. Error Handling

Frontend services check the HTTP response status.

Example:

if (!response.ok) {
  throw new Error(
    result.message || "Request failed"
  );
}

The UI catches these errors and displays user-friendly feedback.

10. Frontend API Service Structure

All API requests are organized inside the services directory.

services/
├── admin.ts
├── auth.ts
├── category.ts
├── payment.ts
├── property.ts
├── rental-request.ts
└── review.ts

Keeping API calls inside service files separates API logic from
UI components and improves maintainability.

11. API Summary
Module	Method	Endpoint	Access
Auth	POST	/api/auth/register	Public
Auth	POST	/api/auth/login	Public
Auth	GET	/api/auth/me	Authenticated
Auth	POST	/api/auth/refresh-token	Authenticated
Auth	POST	/api/auth/logout	Authenticated
Category	GET	/api/categories	Public
Property	GET	/api/properties	Public
Property	GET	/api/properties/:id	Public
Property	POST	/api/properties	Landlord
Property	GET	/api/properties/my-properties	Landlord
Property	PATCH	/api/properties/:id	Landlord
Property	DELETE	/api/properties/:id	Landlord
Rental Request	POST	/api/rental-requests	Tenant
Rental Request	GET	/api/rental-requests/my-requests	Tenant
Rental Request	DELETE	/api/rental-requests/:requestId	Tenant
Rental Request	GET	/api/rental-requests/landlord-requests	Landlord
Rental Request	PATCH	/api/rental-requests/:requestId/approve	Landlord
Rental Request	PATCH	/api/rental-requests/:requestId/reject	Landlord
Payment	POST	/api/payments/checkout	Tenant
Payment	GET	/api/payments/my-payments	Tenant
Payment	GET	/api/payments/earnings	Landlord
Review	GET	/api/reviews/property/:propertyId	Public
Review	POST	/api/reviews	Tenant
Review	PATCH	/api/reviews/:reviewId	Tenant
Review	DELETE	/api/reviews/:reviewId	Tenant
Admin	GET	/api/admin/users	Admin
Admin	PATCH	/api/admin/users/:userId	Admin
Admin	GET	/api/admin/properties	Admin
Admin	GET	/api/admin/rental-requests	Admin
Notes
The frontend uses the /api path for API communication.
Protected endpoints require authentication.
Role-based authorization is enforced by the backend.
Stripe Checkout is used for rental payments.
Payment status is handled by the backend payment flow.
```
