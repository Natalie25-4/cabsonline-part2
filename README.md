Name: Natalie Kanyuchi
Student ID: 23198994

CabsOnline is a web-based Taxi booking application built using React (Vite) and Supabase. It allows customers to book taxis, track and manage their bookings, estimate fares, and simulate payments, while also providing an admin interface for managing drivers and assignments.

This README provides an overview of the app's features and instructions on how to run the system. It includes:

Features overview

Installation Prerequisites

Running the Application Locally

Deployment Information

-------------------------------------------------------

1. Features Overs

Booking System:
Customers can create bookings by entering their personal and trip details. The system validates inputs, ensures no past bookings are made, and automatically generates a uniqure Booking Reference Number (BRN). Suburbs are selected from a predefined dropdown list to main data consistency.

Admin Panel 
Admins can search for bookings using the BRN and assign drivers from a list of available drivers. Only one driver can be assigned per booking. If a booking is cancelled or a driver is manually unassigned, the driver automatically becomes available again

Customer Tracking (My Booking)
customers can search for their bookings using their phone number. they can:
- View booking details
- Update booking information
- Cancel bookings
- Delete bookings

Once a booking is cancelled, it cannot be edited. 

Fare estimation
Users can estimate the cost of a trip before booking by selectin:
- Pickup suburb
- Destination suburb
- Vehicle type (Standard, Premium, Van)

The calculated fare is consistent acroos booking and payment. 

Payment System (Simulation)
Customers can:
- View unpaid bookings
- Select a booking to pay for
- Simulate a card payment

Once payment is completed, the booking status updates to "paid" and duplicate payments are prevented

Driver availability logic
- Driver can only be assigned if they are available
- Only one driver per booking is allowed
- Drivers become automatically available when:
 - A booking is cancelled
 - A driver is unassigned through Admin Panel

User Interface
The application features a clean and consistent UI across all pages, including:
- Booking form
- Admin dashboard
- Tracking Page
- Fare estimator
- Payment page

----------------------------------------------------------

2. Prerequisites
Ensure the following are installed:

- Node.js (V18 or higher recommended)
- npm (comes with node.js)
- A modern web browser (Chrome recommended)
- Internent connection (for supabase backend)

----------------------------------------------------------

3. Running the Application Locally

Clone the repository:
 - git clone https://github.com/Natalie25-4/cabsonline-part2.git

Navigate into the project folder:
cd cabsonline-part2

Install dependecies:
- npm install

Start the development server:
- npm run dev

Open the application in your browser

----------------------------------------------------------

4. Backend (Supabase)
This application uses Supabase as the backend database

Tables used:
 - bookings
 - drivers

Key features:
- Data storage and retrieval
- real-time updates for bookings and drivers
- Row Level Security (RLS) enabled for controlled access

Environment variables required:

VITE_SUPABASE_URL= 
VITE_SUPABASE_ANON_KEY=

these should be stored in a .env file in the root directoy.

----------------------------------------------------------

5. Deployment
Main deployed application:

- https://cabsonline-part2.vercel.app/

The application is deployed using vercel and can be accessed publicaly via the URL link above

----------------------------------------------------------

6. Testing

the application was tested using the following scenarios:

Booking:
- Valid and invalid inputs
- Same suburb validation
- Past date/time prevention

Admin:
- Assign driver
- Prevent multiple driver assignments
- Unassign driver
- Driver availability updates

Tracking:
- Update booking
- Cancel booking
- Delete booking
- Prevent editing cancelled bookings

Payment:
- Pay unpaid bookings
- Prevent payment on cancelled bookings
- Ensure payment status updates correctly

----------------------------------------------------------

7. Limitations

- Payment system is simulated (no real transactions)
- No authentication/Login system
- Suburbs are predefined (no external API integration)
- Limited styling enhancements for advanced UI interactions

----------------------------------------------------------

8. AI usage

AI tools were used to:
- Generate ideas for additional features
- Debug frontend and backend errors
- Improve validation logic and UI consistency

All AI-generated outputs were reviewed, tested, and modified where necessary

----------------------------------------------------------

Enjoy CabsOnline!!!