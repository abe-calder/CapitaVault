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

### Frontend: React, TS, HTML/CSS/JS	
Building the interactive user interface.

### Backend:	 Node.js (Express)	
Handling business logic, routing, and server-side operations.

### Database: SQLite 	
Persistent storage for user and financial data.

### Styling/UI: Custom CSS 
Providing a responsive and modern design.

## Getting Started
Follow these instructions to set up and run a local copy of the project.

Prerequisites
You will need the following software installed on your machine:

### Node.js

### npm 

## Installation
Clone the repository:

Bash

```sh
git clone https://github.com/abe-calder/CapitaVault.git
cd CapitaVault

 <-- Install dependencies: Bash -->
 <!-- This is a comment that will not appear in the rendered Markdown. -->
 [comment]: # (This is another type of comment.)

npm install
```

### For the frontend 
cd Client

### For the backend 
cd Server  

### Configure environment variables:
Create a file named .env in the root directory and add your configuration details:  
Will need a Polygon API key added to a .env file ( free on their website - https://polygon.io/dashboard ) name it `POLY_API_KEY`  
Willl also need an fxrates API key added to the .env file aswell (free on their website too - https://fxratesapi.com/ ) name it `FX_RATE_API_KEY`

### To view in browser (localhost:5173 - this is important for Auth0 allowed login and redirect URLs) - Bash
`npm run dev`
Access the application:  
Open your web browser and navigate to:  
http://localhost:5173  |  http://localhost:3000 for server  
