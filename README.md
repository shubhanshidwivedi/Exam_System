📘 Tejas-Prahari — Secure Online Examination Browser

📌 Overview

Tejas-Prahari is a secure online examination system designed to ensure fairness, transparency, and integrity in digital assessments.
It provides a controlled exam environment with browser lockdown features, real-time activity monitoring, and automated evaluation.

The system reduces manual effort, prevents cheating, and supports large-scale online exams.

⚙️ Tech Stack
Backend

Java 17

Spring Boot

Maven

Frontend

React.js

HTML, CSS

Database

MySQL

Server

Apache Tomcat

✨ Key Features
🔐 Secure Browser Environment

Prevents tab switching

Blocks external websites

Disables screenshots & screen recording

Restricts keyboard shortcuts

👥 Role-Based Authentication

Admin

Student

📝 Exam Management

Create/manage exams

Manage question bank

Set time limits

Auto-submit when time ends

📊 Evaluation

Automated checking for objective questions

Instant results

Real-time logs

🧩 Modules

User Authentication Module

Admin Module

Exam Module

Secure Browser Module

Evaluation Module

🗄️ Dataset(s) Used

No external dataset is used.
The system works with internal MySQL datasets, including:

Users

Exams

Questions

Student responses

Activity logs

These can be exported as .sql from phpMyAdmin or MySQL Workbench.

🚀 How to Run the Project

📌 Backend (Spring Boot)
mvn clean install
mvn spring-boot:run

📌 Frontend (React)
cd frontend
npm install
npm start

📌 Database Setup

Create a MySQL database

Import the provided SQL file

Update credentials in application.properties

📁 Project Structure
Tejas-Prahari/
│── backend/
│   ├── src/main/java/
│   ├── resources/application.properties
│── frontend/
│   ├── src/
│   ├── package.json
│── database/
│   └── tejas_prahari_db.sql
│── README.md
📈 Future Enhancements

AI-based cheating detection

Webcam monitoring / proctoring

Advanced reporting & analytics

Support for subjective answers

LMS integration

👨‍💻 Project Contributors

Shubhanshi Dwivedi

Lucky Tirole

Saurav

📄 License

This project is developed for academic and educational purposes under CDAC Delhi.
