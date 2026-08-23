RentNest Frontend API Integration

RentNest is a rental property marketplace where tenants can browse properties,
submit rental requests, make payments, and leave reviews. Landlords can manage
properties, handle rental requests, and view earnings. Admins can manage users,
properties, rental requests, and property categories.

---

# 1. API Base URL

The frontend communicates with the backend through:

```text
/api

The Next.js proxy forwards API requests to the deployed backend API.

Example:

Frontend:
GET /api/properties

Backend:
GET {BACKEND_API_URL}/properties
2. Authentication APIs
Register User

Method: POST

Endpoint:

/api/auth/register

Access: Public

Purpose:
Registers a new tenant or landlord account.

Frontend Service:

services/auth.ts

Request Body:

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "phone": "01700000000",
  "role": "TENANT"
}
Login User

Method: POST

Endpoint:

/api/auth/login

Access: Public

Purpose:
Authenticates a user and returns an access token.

Frontend Service:

services/auth.ts

Request Body:

{
  "email": "john@example.com",
  "password": "password123"
}

Response contains:

{
  "success": true,
  "message": "Login successful",
  "data": {
    "accessToken": "..."
  }
}

The frontend stores the access token and loads the authenticated user.

Get Current User

Method: GET

Endpoint:

/api/auth/me

Access: Authenticated

Purpose:
Returns the currently authenticated user's information.

Frontend Service:

services/auth.ts

Used By:

components/providers/auth-provider.tsx
Refresh Access Token

Method: POST

Endpoint:

/api/auth/refresh-token

Access: Authenticated session

Purpose:
Refreshes the access token using the refresh-token mechanism.

Frontend Service:

services/auth.ts
Logout

Method: POST

Endpoint:

/api/auth/logout

Access: Authenticated

Purpose:
Logs the current user out.

Frontend Service:

services/auth.ts
3. Category APIs
Get All Categories

Method: GET

Endpoint:

/api/categories

Access: Public

Purpose:
Retrieves all available property categories.

Frontend Service:

services/category.ts

Used By:

Property filters
Property forms
Admin category management
Create Category

Method: POST

Endpoint:

/api/categories

Access: ADMIN

Purpose:
Creates a new property category.

Frontend Service:

services/admin.ts

Request Body:

{
  "name": "Home",
  "slug": "home"
}
Update Category

Method: PATCH

Endpoint:

/api/categories/:id

Access: ADMIN

Purpose:
Updates an existing category.

Frontend Service:

services/admin.ts

Request Body:

{
  "name": "Apartment",
  "slug": "apartment"
}
Delete Category

Method: DELETE

Endpoint:

/api/categories/:id

Access: ADMIN

Purpose:
Deletes an unused category.

Frontend Service:

services/admin.ts
Category deletion protection

A category that is already being used by one or more properties cannot be
deleted.

Example response:

{
  "success": false,
  "message": "This category cannot be deleted because it is being used by one or more properties.",
  "errors": []
}
4. Property APIs
Get All Properties

Method: GET

Endpoint:

/api/properties

Access: Public

Purpose:
Retrieves available rental properties with filtering and search support.

Frontend Service:

services/property.ts

Used By:

/app/page.tsx
/app/properties
Get Property Details

Method: GET

Endpoint:

/api/properties/:id

Access: Public

Purpose:
Retrieves detailed information about a specific property.

Frontend Service:

services/property.ts

Used By:

/app/properties/[id]
Create Property

Method: POST

Endpoint:

/api/properties

Access: LANDLORD

Purpose:
Creates a new rental property listing.

Frontend Service:

services/property.ts

Used By:

/app/landlord/properties/create
Get My Properties

Method: GET

Endpoint:

/api/properties/my-properties

Access: LANDLORD

Purpose:
Retrieves properties owned by the authenticated landlord.

Frontend Service:

services/property.ts

Used By:

/app/landlord/properties
Update Property

Method: PATCH

Endpoint:

/api/properties/:id

Access: LANDLORD

Purpose:
Updates an existing property owned by the landlord.

Frontend Service:

services/property.ts

Used By:

/app/landlord/properties/[id]/edit
Delete Property

Method: DELETE

Endpoint:

/api/properties/:id

Access: LANDLORD

Purpose:
Deletes a property owned by the authenticated landlord.

Frontend Service:

services/property.ts
5. Rental Request APIs
Create Rental Request

Method: POST

Endpoint:

/api/rental-requests

Access: TENANT

Purpose:
Allows a tenant to request a rental property.

Frontend Service:

services/rental-request.ts
Get My Rental Requests

Method: GET

Endpoint:

/api/rental-requests/my-requests

Access: TENANT

Purpose:
Retrieves rental requests created by the authenticated tenant.

Frontend Service:

services/rental-request.ts

Used By:

/app/rental-requests
Cancel Rental Request

Method: DELETE

Endpoint:

/api/rental-requests/:requestId

Access: TENANT

Purpose:
Allows a tenant to cancel their rental request.

Frontend Service:

services/rental-request.ts
Get Landlord Rental Requests

Method: GET

Endpoint:

/api/rental-requests/landlord

Access: LANDLORD

Purpose:
Retrieves rental requests for the authenticated landlord's properties.

Frontend Service:

services/rental-request.ts

Used By:

/app/landlord/rental-requests

Note: This endpoint should match the actual deployed backend route. The older
documentation used /api/rental-requests/landlord-requests, but the current
backend route should be treated as the source of truth.

Approve Rental Request

Method: PATCH

Endpoint:

/api/rental-requests/:requestId/approve

Access: LANDLORD

Purpose:
Approves a pending rental request.

Frontend Service:

services/rental-request.ts
Reject Rental Request

Method: PATCH

Endpoint:

/api/rental-requests/:requestId/reject

Access: LANDLORD

Purpose:
Rejects a pending rental request.

Frontend Service:

services/rental-request.ts
6. Payment APIs

RentNest uses Stripe Checkout for rental payments.

Create Stripe Checkout Session

Method: POST

Endpoint:

/api/payments/checkout

Access: TENANT

Purpose:
Creates a Stripe Checkout session for an approved rental request.

Frontend Service:

services/payment.ts

Request Body:

{
  "rentalRequestId": "request-id"
}

Successful Response:

{
  "success": true,
  "message": "Checkout session created successfully",
  "data": {
    "sessionId": "cs_test_...",
    "checkoutUrl": "https://checkout.stripe.com/..."
  }
}
Get My Payments

Method: GET

Endpoint:

/api/payments/my-payments

Access: TENANT

Purpose:
Retrieves payment history for the authenticated tenant.

Frontend Service:

services/payment.ts

Used By:

/app/payments
Get Landlord Earnings

Method: GET

Endpoint:

/api/payments/earnings

Access: LANDLORD

Purpose:
Retrieves paid rental payments and total landlord earnings.

Frontend Service:

services/payment.ts

Used By:

/app/landlord/earnings
Stripe Webhook

Method: POST

Endpoint:

/api/payments/webhook

Access: Stripe

Purpose:
Handles successful Stripe Checkout events and updates:

Payment → PAID
Rental Request → ACTIVE
Property → RENTED

The webhook is handled by the backend.

7. Review APIs
Get Property Reviews

Method: GET

Endpoint:

/api/reviews/property/:propertyId

Access: Public

Purpose:
Retrieves reviews for a property.

Frontend Service:

services/review.ts
Create Review

Method: POST

Endpoint:

/api/reviews

Access: TENANT

Purpose:
Allows an eligible tenant to create a property review.

Frontend Service:

services/review.ts

A review is only allowed when the backend determines that the tenant has
completed/paid for the rental.

Update Review

Method: PATCH

Endpoint:

/api/reviews/:reviewId

Access: TENANT

Purpose:
Updates the tenant's existing review.

Frontend Service:

services/review.ts
Delete Review

Method: DELETE

Endpoint:

/api/reviews/:reviewId

Access: TENANT

Purpose:
Deletes the tenant's own review.

Frontend Service:

services/review.ts
8. Admin APIs

All admin endpoints require:

Role: ADMIN
Get All Users

Method: GET

Endpoint:

/api/admin/users

Access: ADMIN

Purpose:
Retrieves all users for administration.

Frontend Service:

services/admin.ts

Used By:

/app/admin/users
Update User Status

Method: PATCH

Endpoint:

/api/admin/users/:userId

Access: ADMIN

Purpose:
Blocks or activates a user.

Supported Statuses:

ACTIVE
BLOCKED

Frontend Service:

services/admin.ts
Get All Properties

Method: GET

Endpoint:

/api/admin/properties

Access: ADMIN

Purpose:
Retrieves all properties for admin management.

Frontend Service:

services/admin.ts

Used By:

/app/admin/properties
Get All Rental Requests

Method: GET

Endpoint:

/api/admin/rental-requests

Access: ADMIN

Purpose:
Retrieves rental requests across the platform.

Frontend Service:

services/admin.ts

Used By:

/app/admin/rental-requests
9. Authentication Handling

Protected frontend API requests use the authenticated user's access token.

Current frontend services send the token using:

Authorization: <accessToken>

The AuthProvider loads the current authenticated user and maintains
authentication state throughout the application.

Role-based UI access is handled through the application's authentication and
role-guard logic.

10. Role-Based Access
TENANT

Tenant users can:

Browse properties
View property details
Create rental requests
View rental requests
Cancel rental requests
Make Stripe payments
View payment history
Create reviews
Update reviews
Delete reviews
LANDLORD

Landlord users can:

Create properties
View their properties
Update their properties
Delete their properties
Manage property availability
View rental requests
Approve rental requests
Reject rental requests
View earnings
ADMIN

Admin users can:

View all users
Block / activate users
View all properties
View all rental requests
Create categories
Update categories
Delete categories
View categories
11. Error Handling

Frontend services check the HTTP response status.

Example:

if (!response.ok) {
  throw new Error(
    result.message || "Request failed",
  );
}

The UI catches these errors and displays user-friendly feedback using toast
notifications and inline error messages.

Example:

try {
  // API request
} catch (error) {
  const message =
    error instanceof Error
      ? error.message
      : "Something went wrong";

  toast.error(message);
}
12. Important Business Rules
Rental Request

A tenant cannot create duplicate active requests for the same property.

Request eligibility is checked against existing rental request/payment state.

Approved Rental

An approved rental request must be paid through Stripe before it becomes
active.

Payment

After successful Stripe payment:

Payment
   ↓
PAID

Rental Request
   ↓
ACTIVE

Property
   ↓
RENTED
Category Deletion

A category that is currently used by one or more properties cannot be deleted.

Example:

This category cannot be deleted because it is being used
by one or more properties.
Review

Reviews are restricted to eligible tenants.

The backend prevents unauthorized or duplicate reviews.

13. Frontend API Service Structure

All API requests are organized inside the services directory.

services/
├── admin.ts
├── auth.ts
├── category.ts
├── payment.ts
├── property.ts
├── rental-request.ts
└── review.ts

Keeping API calls inside service files separates API logic from UI components
and improves maintainability.

14. API Summary
Module	Method	Endpoint	Access
Auth	POST	/api/auth/register	Public
Auth	POST	/api/auth/login	Public
Auth	GET	/api/auth/me	Authenticated
Auth	POST	/api/auth/refresh-token	Authenticated
Auth	POST	/api/auth/logout	Authenticated
Category	GET	/api/categories	Public
Category	POST	/api/categories	ADMIN
Category	PATCH	/api/categories/:id	ADMIN
Category	DELETE	/api/categories/:id	ADMIN
Property	GET	/api/properties	Public
Property	GET	/api/properties/:id	Public
Property	POST	/api/properties	LANDLORD
Property	GET	/api/properties/my-properties	LANDLORD
Property	PATCH	/api/properties/:id	LANDLORD
Property	DELETE	/api/properties/:id	LANDLORD
Rental Request	POST	/api/rental-requests	TENANT
Rental Request	GET	/api/rental-requests/my-requests	TENANT
Rental Request	DELETE	/api/rental-requests/:requestId	TENANT
Rental Request	GET	/api/rental-requests/landlord	LANDLORD
Rental Request	PATCH	/api/rental-requests/:requestId/approve	LANDLORD
Rental Request	PATCH	/api/rental-requests/:requestId/reject	LANDLORD
Payment	POST	/api/payments/checkout	TENANT
Payment	GET	/api/payments/my-payments	TENANT
Payment	GET	/api/payments/earnings	LANDLORD
Review	GET	/api/reviews/property/:propertyId	Public
Review	POST	/api/reviews	TENANT
Review	PATCH	/api/reviews/:reviewId	TENANT
Review	DELETE	/api/reviews/:reviewId	TENANT
Admin	GET	/api/admin/users	ADMIN
Admin	PATCH	/api/admin/users/:userId	ADMIN
Admin	GET	/api/admin/properties	ADMIN
Admin	GET	/api/admin/rental-requests	ADMIN
15. Notes
The frontend uses /api for backend API communication.
Protected endpoints require authentication.
Role-based authorization is enforced by the backend.
Stripe Checkout is used for rental payments.
Payment status is handled by the backend payment flow.
API errors are converted into user-friendly frontend feedback.
Category management is available to ADMIN users.
```
