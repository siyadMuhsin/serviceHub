# ServiceHub – Online Service Booking Platform 🚀

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![Node.js](https://img.shields.io/badge/Node.js-v18-blue)]()
[![React](https://img.shields.io/badge/React-v18-blue)]()
[![MongoDB](https://img.shields.io/badge/MongoDB-v6-green)]()
[![Status](https://img.shields.io/badge/Status-Active-brightgreen)]()

ServiceHub is a full-stack **Online Service Booking Platform** that connects users with skilled Experts for home and professional services. Users can browse, book, and review experts, while Experts can manage jobs and subscriptions. Admins control platform operations, subscriptions, and revenue.

---

## 🌟 Target Audience

- **Users (Customers):** People needing services like plumbing, electrical work, cleaning, etc.  
- **Experts (Service Providers):** Skilled professionals looking for job opportunities.  
- **Admin (Platform Owner):** Manages users, Experts, Subscription, Services, and overall platform operations.  

---

## 🔹 Core Objectives

- Simplify booking of skilled Experts.
- Ensure transparency in ratings, reviews.
- Provide Experts a structured workflow.
- Enable admin revenue through Expert subscriptions.

---
## 🛠 Platform Workflow

### 👤 User Side (Customers)
1. **Signup & Authentication:** Users register via OTP or Google authentication for security and convenience.  
2. **Browsing & Booking Services:**  
   - Search for experts by service category.  
   - View expert profiles with experience, ratings, and nearest location.  
   - Location-based search ensures users see experts **closest to them**.  
3. **Booking & Payment:** Book services and **real-time chat with the expert** for coordination.  
4. **Service Completion & Review:** Rate and review experts after service completion.  

### 🛠 Expert Side (Service Providers)
1. **Expert Registration:** Experts create a profile with skill details and set their service location. 
2. **Subscription System:** After the trial, experts choose from **Monthly, Quarterly, or Yearly** subscription plans to continue receiving requests.  
3. **Job Management:** Accept or reject booking requests, **chat with users in real-time**, complete jobs, and receive reviews.  
4. **Profile & Earnings:** Customize profile, upload images, and manage active subscriptions.  
  

### 🔧 Admin Side (Platform Owner)
1. **Dashboard & Overview:** Track users, Experts, revenue ,and Pending Request for Expert.  
2. **User & Expert Management:** Block/unlist users/Experts, verify credentials.  
3. **Category & Service Management:** Add/edit/remove service categories.  
4. **Subscription Management:** Approve/reject Expert subscriptions.  
5. **Earnigs** Manage subscription revenue.  


---

## ✅ Features Implemented

### User Features
- OTP-based secure login system and Google authentication.
- Service browsing and home page with **location-based expert search**.
- Expert profile viewing before booking (experience, ratings, location).
- Booking system.
- **Real-time chat with experts** for service coordination.
- Review & rating system for completed services.
- Profile management and booking history.

### Expert Features
- **Set service location** so users nearby can find them.
- Job requests management (accept/reject).
- **Real-time chat with users** for coordination and updates.
- Profile editing and media uploads.
- Booking management

### Admin Features
- Dashboard with real-time statistics.
- User and Expert management (block/unlist, verify credentials).
- Subscription control and approval.
- Wallet and refund system tracking user refunds and subscription revenue.
- Notifications and alerts for users and experts.
- Monitor platform activities, including **chat interactions** if needed.

## 💰 Revenue Model

1. **Expert Subscriptions:** Monthly, Quarterly, Yearly subscription plans.  
2. **Profile Boosting:** Experts pay ₹50 for higher visibility.  

---

## 🛠 Technologies Used

### Frontend
- **React.js** for building dynamic user interfaces  
- **Tailwind CSS** for responsive and modern styling  
- JavaScript for interactivity and form handling  
- Axios & Fetch API for communication with backend  

### Backend
- **Node.js** and **Express.js** for server-side logic and RESTful APIs  
- **MongoDB** with **Mongoose** for database management  
- Real-time chat implemented with **Socket.IO** (or similar library)  
- OTP Authentication for secure user login  
- Payment Gateway Integration for worker subscriptions and user bookings  

### Additional Features
- Location-based service matching (users see nearby experts, experts set service locations)  

## 🏗 Architecture & Design Principles

ServiceHub is designed with **clean architecture** and **scalable patterns** in mind to ensure maintainability and extensibility.

- **Repository Pattern:**  
  Separates data access logic from business logic, making the code easier to maintain and test. All database interactions (MongoDB queries) are handled through repositories.

- **OOP (Object-Oriented Programming):**  
  Core entities like Users, Experts, Bookings, and Services are modeled as classes with properties and methods, following encapsulation and modular design.

- **SOLID Principles:**  
  - **Single Responsibility:** Each module/class has one clear responsibility.  
  - **Open/Closed Principle:** Modules are open for extension, closed for modification.  
  - **Liskov Substitution:** Subclasses can replace parent classes without breaking functionality.  
  - **Interface Segregation:** Interfaces are specific to the required functionality.  
  - **Dependency Inversion:** High-level modules do not depend on low-level modules directly; dependencies are injected.

- **Layered Architecture:**  
  - **Controllers:** Handle HTTP requests and responses.  
  - **Services / Business Logic:** Contains core logic for booking, subscriptions, and notifications.  
  - **Repositories / Data Access:** Encapsulates all database operations with MongoDB.  
  - **Models:** Defines data structures and schema for Users, Experts, Bookings, etc.

This architecture ensures that ServiceHub is **scalable, maintainable, and testable**, following best practices in software engineering.


## ⚙️ Backend & Frontend Setup

Follow these steps to get **ServiceHub** running locally.

---

### 1. Prerequisites
- Node.js >= 18
- MongoDB (local or cloud)
- Git
- npm or yarn

---

## ⚙️ Setup

Follow these steps to get **ServiceHub** running locally.

---

### 1. Prerequisites
- Node.js >= 18
- MongoDB (local or cloud)
- Git
- npm or yarn

---

### 2. Clone the Repository
```bash
git clone https://github.com/siyadMuhsin/serviceHub.git
cd servicehub

