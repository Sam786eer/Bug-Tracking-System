🐞 BugView – Full-Stack Bug & Ticket Tracking System
BugView is a complete MERN-based issue management platform designed to help software teams report, track, and resolve bugs efficiently.
It provides structured workflows, role-based access, and an intuitive interface for seamless collaboration between testers and developers.

BugView acts as a central hub where users can create tickets, update progress, assign tasks, and maintain clear visibility of project activities.

⭐ Key Features
🔐 Secure Authentication
User registration & login

Password hashing with bcrypt

JWT-based session validation

Protected backend routes

Role-based UI access (Tester / Developer)

🐛 Advanced Ticket Management
Create, edit, and delete bug reports

Add severity, status, due dates, and descriptions

Assign tickets to team members

Track updates in real-time

Filter & search tickets by multiple fields

Attach GitHub/Project links for debugging context

👥 User Profiles & Collaboration
View personal activity & created tickets

Update profile info

Comment on bug updates

Maintain discussion history for each ticket

Improve communication between team members

📡 Robust Backend API (Express + MongoDB)
RESTful API endpoints

Authentication middleware

Mongoose models for structured data

Error handling & validation

Scalable architecture for future enhancements

🧰 Tech Stack
Frontend
React.js

Materialize CSS / Custom Styles

React Hooks & Context API

Backend
Node.js

Express.js

MongoDB Atlas

bcrypt

JSON Web Tokens (JWT)

Other Tools
Nodemon

Git & GitHub

Cloud-based MongoDB

📂 Project Structure
csharp
Copy code
BugView/
 ├── client/               # React frontend
 │    ├── src/
 │    ├── public/
 │    └── package.json
 ├── config/               # App configuration
 ├── middleware/           # Authentication middleware
 ├── models/               # Mongoose schemas
 ├── routes/               # API routes (auth, post, user)
 ├── server.js             # Backend entry point
 ├── package.json          # Root package file
 └── README.md
⚙️ Setup Instructions (Very Important)
1️⃣ Install Backend Dependencies
Run this in the main project folder:

nginx
Copy code
npm install
2️⃣ Install Frontend Dependencies
bash
Copy code
cd client
npm install
Then return to the root:

bash
Copy code
cd ..
3️⃣ Create Environment Variables
Create a .env file in the project root (NOT inside client):

ini
Copy code
MONGO_URL=your_mongodb_connection_string
JWT_SECRET=your_secret_key_here
⚠️ .env is already in .gitignore, so it will NOT upload to GitHub.

4️⃣ Start the Application (Backend + Frontend Together)
Simply run:

arduino
Copy code
npm run start
This will:

Start backend → http://localhost:5000

Start frontend → http://localhost:3000

Both will run simultaneously using concurrently.

5️⃣ MongoDB Setup (Atlas Cloud)
Create a free cluster

Create a Database User

Copy connection string like:

perl
Copy code
mongodb+srv://<username>:<password>@cluster.mongodb.net/BugView
Paste it into your .env:

ini
Copy code
MONGO_URL=YOUR_URL_HERE
Ensure IP Allow Access = “Allow from Anywhere”

🎯 Purpose of BugView
BugView was developed as an academic + practical learning project to demonstrate:

Full MERN stack development

Authentication security & JWT handling

Handling CRUD operations

Structuring scalable APIs

Real-world ticket management system

Collaboration workflow for software teams

This project showcases full-stack engineering, database design, and UI development.

👨‍💻 Author
Sameer
Full-Stack MERN Developer
GitHub: https://github.com/Sam786eer

📝 License
This project does not use any external or inherited license.
It is free for academic and learning purposes.