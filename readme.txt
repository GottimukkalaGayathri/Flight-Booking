Flight Booking Web Application - Final Submission

This project is a flight booking web application developed using HTML, CSS, and JavaScript with JSON Server as the backend. It offers full functionality for both users and administrators to manage flights and bookings.

Features

• User registration and login with input validation
• Flight search using From, To, and Date fields (case-insensitive and typo-tolerant)
• Automatic removal of past flights based on current date and time
• Flight booking with real-time seat availability check
• Booked button turns maroon to indicate confirmed bookings
• Prevents double booking of overlapping flights
• Payment options include UPI, Credit Card, Debit Card, and Bank Transfer
• Ticket confirmation with preview popup after successful booking
• User bookings displayed in a sidebar
• Option to cancel bookings with confirmation prompt

• Admin login using passcode authentication (admin123)
• Add new flights with form validation
• Auto-fill of date field with tomorrow's date
• Restriction to avoid selecting past dates
• City selection using dropdown menus
• Admin dashboard displays all flights
• Visual separation of past and upcoming flights
• Live flight clock on admin dashboard
• Delete or mark flights as full
• View all bookings made by users
• Auto-removal of past flights from both admin and user views

Pages Included

• index.html – Login page for users and admin
• register.html – New user registration
• flights.html – User dashboard to search, view, and book flights
• payment.html – Payment processing and ticket confirmation
• addflight.html – Form to add new flights by admin
• admin.html – Admin dashboard for managing flights
• admin_bookings.html – Admin panel to view all user bookings

JavaScript Files

• auth.js – Handles login, registration, and admin authentication
• flights.js – Manages flight search, display, booking, and cancellations
• payment.js – Handles seat updates, payment processing, and ticket display
• addflight.js – Adds new flights with validation logic
• admin.js – Displays live clock, flight status, and admin controls
• admin_bookings.js – Displays all user bookings to admin

CSS Files

• auth.css – Styles for login and registration pages
• flights.css – User dashboard, search form, modals, and layout
• payment.css – Styling for the payment and ticket confirmation page
• addflight.css – Form styling for adding flights with dropdowns
• admin.css – Styling for the admin dashboard and flight cards

Database File

• db.json – Contains users, flights, and bookings
– Includes 30 total flights, with past, present, and future schedules for testing and demonstration

Setup Instructions

• Install JSON Server
npm install -g json-server

• Start the server
json-server --watch db.json --port 5000

Admin Access

To log in as admin, select "Login as Admin" on the login page and enter the passcode admin123. You will be redirected to the admin dashboard.