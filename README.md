# 🌍 Travel Persona Explorer

Travel Persona Explorer is a full-stack online survey system developed for Assignment 2.  
It is built with Node.js, Express.js, MongoDB, Vue.js, Bootstrap, ApexCharts, amCharts, and AJAX.

The application allows users to submit travel preference data without refreshing the page, and dynamically updates the survey results through interactive charts and a searchable response table. This matches the Assignment 2 requirements for a Vue.js SPA frontend, Express.js backend, asynchronous form submission, MongoDB storage, at least three charts, and a searchable table. 

---

## 🛠 Technologies Used

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose

### Frontend
- Vue.js 3
- Bootstrap 5
- Axios
- ApexCharts.js
- amCharts v5
- Oruga UI

---

## 📊 Main Features

- Responsive survey interface built with Bootstrap
- Vue.js frontend with dynamic rendering
- Express.js backend with MongoDB storage
- AJAX form submission without page refresh
- Interactive Pie Chart for Travel Style Distribution
- Interactive Bar Chart for Travel Frequency Overview
- Interactive Line Chart for Budget Range Overview
- Interactive World Map for Dream Destinations by Continent
- Searchable and paginated response table
- Mock survey data support using `TravelData.json`

---

## 📂 Project Structure

```text
TRAVEL-SURVEY/
│
├── models/
│   └── Survey.js              # MongoDB schema
│
├── routes/
│   └── surveyRoutes.js        # Express route handlers / API routes
│
├── public/
│   ├── css/
│   │   └── style.css          # Main stylesheet
│   └── js/
│       ├── app.js             # Vue frontend logic
│       └── iso2ToContinent.js # Continent mapping for amCharts world map
│
├── views/
│   └── index.ejs              # Main single-page interface
│
├── app.js                     # Main server file
├── package.json
├── package-lock.json
├── README.md
└── TravelData.json            # Mock dataset for MongoDB import
```
---

## 🚀 How to Run the Application

**Note:** The `node_modules` folder is not included in the submission zip file, as required. Dependencies should be installed locally using `npm install`.

### 1. Install Node.js

Make sure Node.js is installed on your computer.

Check the installed version:

```bash
node -v
```

### 2. Install project dependencies

Open the project root folder in VS Code, then open a terminal and run:

```bash
npm install
```

### 3. Start MongoDB

Make sure MongoDB is running locally.

The application uses the following connection string:

```bash
mongodb://127.0.0.1:27017/surveyDB
```

If you use MongoDB Compass, import `TravelData.json` into the `surveys` collection under the `surveyDB` database.

If you prefer command line import, you can use:

```bash
mongoimport --db surveyDB --collection surveys --file TravelData.json --jsonArray
```


### 4. Run the server

Start the application with:

```bash
node app.js
```

If the server starts successfully, you should see:

```bash
Server running at http://localhost:3000
```

### 5. Open the application in browser

Open Google Chrome or Safari and visit:

```text
http://localhost:3000
```

The assignment will be tested in Google Chrome or Safari, so these browsers are recommended.

---

## 🔄 Application Workflow

1. The user selects survey answers and submits the form.
2. Vue.js sends the form data asynchronously to the Express backend using AJAX.
3. Express.js stores the response in MongoDB.
4. The backend aggregates survey data and returns updated statistics.
5. Vue.js updates the charts without refreshing the page.
6. The searchable response table also refreshes dynamically.

This satisfies the requirement that charts must be displayed next to the survey form after submission without page reload.

---

## 📈 Charts Included

This system includes at least three different interactive charts:

* **Pie Chart** – Travel Style Distribution
* **Bar Chart** – Travel Frequency Overview
* **Line Chart** – Budget Range Overview
* **World Map** – Dream Destinations by Continent

At least two of these charts are implemented using ApexCharts.js, which satisfies the assignment requirement.

---

## 🔍 Searchable Table

The system also includes a searchable response table.
Users can search and filter responses by:

* Travel Style
* Travel Frequency
* Dream Continent
* Budget Range

This satisfies the searchable table requirement in the assignment.

---

## 📱 Responsive Design

* Built with Bootstrap 5 responsive grid system
* Works on desktop and mobile screen sizes
* Charts resize with the layout
* Tested in Chrome

This satisfies the responsive layout requirement.

---

## 🧠 Use of Express.js and Vue.js

### Express.js is used for:

* Creating the server
* Defining API routes
* Handling survey submission
* Querying MongoDB
* Returning JSON data for charts and table updates
* Serving static files and rendering the main page

### Vue.js is used for:

* Managing form state
* Sending AJAX requests with Axios
* Updating charts dynamically
* Rendering the response table
* Handling pagination and search interaction

This satisfies the assignment requirement for a two-tier architecture with a Vue.js SPA frontend and an Express.js backend.

---

## ⚠ Requirements

* Node.js
* MongoDB running locally
* Internet connection for CDN libraries:

  * Bootstrap
  * Vue.js
  * Axios
  * ApexCharts
  * amCharts
  * Oruga UI

---

## 👨‍💻 Author

CHEN Ka Shing

## 👨‍💻 Github

https://github.com/dennyeer/travel-survey2.0
