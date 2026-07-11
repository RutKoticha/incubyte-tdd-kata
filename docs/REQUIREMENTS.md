# User authentication

* User must be able to register
* User must be able to login
* Token based authentication must be used
* Routes should be protected

# Api endpoints to implement

## Auth Endpoints

| Endpoint                  | Purpose                  |
| ------------------------- | ------------------------ |
| `POST /api/auth/register` | Registering new user     |
| `POST /api/auth/login`    | Logging in to the system |

## Vehicles Endpoints (Protected)

| Endpoint                   | Purpose                                                       |
| -------------------------- | ------------------------------------------------------------- |
| `POST /api/vehicles`       | Add a new vehicle                                             |
| `GET /api/vehicles`        | View a list of all available vehicles.                        |
| `GET /api/vehicles/search` | Search for vehicles by make, model, category, or price range. |
| `PUT /api/vehicles/:id`    | Update a vehicle's details.                                   |
| `DELETE /api/vehicles/:id` | Delete a vehicle (Admin only).                                |

## Inventory Endpoints (Protected)

| Endpoint                          | Purpose                                                  |
| --------------------------------- | -------------------------------------------------------- |
| `POST /api/vehicles/:id/purchase` | Purchase a vehicle, decreasing its quantity.             |
| `POST /api/vehicles/:id/restock`  | Restock a vehicle, increasing its quantity (Admin only). |

# Frontend Application Requirements

* User registration and login forms.
* A dashboard or homepage to display all available vehicles.
* Functionality to search and filter vehicles.
* A "Purchase" button on each vehicle, which should be disabled if the quantity is zero.
* (For Admin Users) Forms/UI to add, update, and delete vehicles.
