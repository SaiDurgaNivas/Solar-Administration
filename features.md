# Solar Administration Portal - Key Features

This project is a comprehensive end-to-end web application consisting of a React Vite frontend and a Django REST Framework backend.

## 1. Core End-to-End Workflows ⚙️
- **Customer Registration & Onboarding:** Dynamic registration that automatically provisions customer profiles and seeds demo data (installations, bills, telemetry) for rapid demonstration.
- **Role-Based Access Control (RBAC):** Distinct dashboards and interfaces securely separated for Customers, Agents, Sub-workers, and Administrators.
- **Solar Loan & Billing Workflow:** End-to-end pipeline from applying for loans, paying bills (with subsidy/downpayment logic), and dynamic tracking of payment statuses.

## 2. Advanced Administration Dashboard 🛡️
- **Centralized Data Hub:** Real-time metrics overview, aggregating total energy generated, active installations, worker attendance, and pending bookings.
- **Worker Management:** Ability to assign agents to customer installations, create team tasks, and review worker attendance logic.
- **Dynamic Hardware Catalog & Reviews:** Modern interfaces to browse and update solar modules and view synchronized customer satisfaction reviews.
- **Secure Admin Authentication:** Secret code access ("0000") implementation to discreetly partition administrative entry from regular customer login flows.

## 3. Agent & Worker Portals 🧑‍🔧
- **Agent Submissions:** Dedicated panels for agents to confirm booking appointments, upload installation documents, and coordinate with administrators.
- **Sub-worker Ticketing:** Live update ticket systems (`WorkerUpdate`) tied to installation assignments and site surveys.
- **Consistent UI/UX:** Unified sidebar-based navigation layout synchronized with the main customer dashboard design language.

## 4. Modern, Premium UI/UX 🎨
- **Vibrant & Glassmorphic Aesthetics:** Built using modern CSS/Tailwind rules emphasizing responsive layouts, dynamic hover micro-animations, and polished transitions.
- **Floating Global Navigation:** Omnipresent floating "Home" button integrated on authentication pages and unauthenticated routes for seamless user experience.
- **Real-time Notifications Menu:** Animated notification popovers to alert users of billing due dates, installation status changes, and administrator flags.
- **Component Reusability:** Modular React architecture separating Auth, Dashboard, and generic User views effectively.

## 5. Robust Backend Architecture 🔌
- **Django REST Framework (DRF):** Scalable API endpoints managing distinct Models (`User`, `Installation`, `Booking`, `Bill`, `UsageTelemetry`, `BookingDocument`, `WorkerUpdate`).
- **RESTful Best Practices:** Consistent `ViewSets` mapping to serializable backend data, minimizing integration friction with the frontend.
- **Email Notifications Logic:** Initial structure in place to send real-time welcome and notification emails via Django's core mail systems (Settings update ready).
- **SQLite Database Integration:** Perfectly structured relational databases with foreign keys seamlessly mapped across users and assignments.
