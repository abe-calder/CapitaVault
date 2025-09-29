# CapitaVault
Secure & Scalable Financial Data Management
CapitaVault is an application designed to provide users with a secure and intuitive platform for managing personal or small-business financial assets. It focuses on real-time asset analysis, integrated authentication, and a clean, accessible user interface.

## Features
### Real-time Portfolio Tracking 
View the current value and performance of all managed assets in a consolidated dashboard. This is acheived through the Polygon api where the asset is seached though the provided ticker, and data is displayed.

### Integrated Authentication 
Know that your assets will only be viewed by you due to Auth0 integrated login.

## Technology Stack
This project is built using the following core technologies:

Frontend ### React, HTML/CSS/JS	
Building the interactive user interface.

Backend/API	### Node.js (Express)	
Handling business logic, routing, and server-side operations.

Database ### SQLite 	
Persistent storage for user and financial data.

Styling/UI ### Custom CSS 
Providing a responsive and modern design.

## Getting Started
Follow these instructions to set up and run a local copy of the project.

Prerequisites
You will need the following software installed on your machine:

[ Node.js] (Version X.X or higher)

[ npm ]

Installation
Clone the repository:

Bash

git clone https://github.com/abe-calder/CapitaVault.git
cd CapitaVault
Install dependencies:

Bash

### `npm install`

# For the frontend (if applicable, usually in a /client directory)
# cd client
# npm install
Configure environment variables:
Create a file named .env in the root directory and add your configuration details:
Will need a Polygon API key added to a .env file

Bash

npm run dev
Access the application:
Open your web browser and navigate to:
http://localhost:3000
