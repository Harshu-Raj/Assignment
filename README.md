React Data Table Assignment
This project is a React application built with Vite and TypeScript, designed to display and manage data from the Art Institute of Chicago API in a PrimeReact DataTable. It implements server-side pagination and a robust, persistent row selection mechanism across different pages, fulfilling the requirements of a React internship assignment.

✨ Features
Server-Side Pagination: Efficiently loads data page by page from the API, preventing "out of memory" issues by not storing all records in memory.

Persistent Row Selection: Selected and deselected rows persist across page changes. If you select rows on Page 1, navigate to Page 2, and then return to Page 1, your previous selections will be retained.

Global "Select N Rows" Functionality: A custom feature allowing users to specify a total number of rows to select. The application will then mark the first 'N' available rows as selected, even if they span multiple pages. When navigating to subsequent pages, the corresponding rows will appear pre-selected.

Dynamic Data Display: Fetches and displays artwork data including title, place_of_origin, artist_display, inscriptions, date_start, and date_end.

User Feedback: Utilizes PrimeReact's Toast component for informative messages (e.g., data fetching errors, invalid input for row selection).

Clean UI: A simple and straightforward user interface using basic PrimeReact components.

🚀 Technologies Used
React: Frontend JavaScript library for building user interfaces.

TypeScript: Superset of JavaScript that adds static typing, enhancing code quality and maintainability.

Vite: A fast build tool that provides a rapid development environment for React projects.

PrimeReact: A rich set of UI components for React, used here for the DataTable, InputText, Button, Checkbox, OverlayPanel, and Toast.

Fetch API: For making asynchronous HTTP requests to the Art Institute of Chicago API.

JavaScript Map: Used for efficient storage and retrieval of persistently selected items across pages.

✅ Assignment Requirements Met
This project specifically addresses the core requirements outlined in the internship assignment:

React App with Vite & TypeScript: The project is initialized using Vite with the TypeScript template.

PrimeReact DataTable: Utilizes the primereact/datatable component for data display.

Server-Side Pagination: API calls are made on every page change (onPage event), fetching only the data for the respective page (?page={page}&limit={limit}).

No Storing All Rows: There is no single variable holding all fetched rows from different pages, adhering to the memory efficiency requirement.

Persistent Row Selection: Row selections and deselections are maintained across different pages using a Map to store the state of selected items globally.

Custom Row Selection Panel: An OverlayPanel with an input field and submit button allows users to specify a number of rows to select, which then applies globally across pages.

📦 Setup and Installation
Follow these steps to get the project up and running on your local machine:

Clone the repository:

git clone https://github.com/Harshu-Raj/Assignment.git
cd Assignment

Install dependencies:

npm install

This will install all required packages, including React, Vite, PrimeReact, and PrimeIcons.

Run the development server:

npm run dev

The application will typically open in your browser at http://localhost:5173 (or another available port).

💡 Usage
View Data: The table will automatically load and display the first page of artwork data.

Navigate Pages: Use the pagination controls at the bottom of the table to move between pages. Observe new API calls in your browser's network tab.

Select/Deselect Rows:

Click the checkboxes next to individual rows to select or deselect them.

Use the checkbox in the column header to select/deselect all rows on the current page.

Test Persistence: Select some rows on one page, navigate to another page, and then return to the first page. Your selections should still be active.

Global "Select N Rows":

Click the chevron-down icon next to the "Code" column header.

An overlay panel will appear with an input field.

Enter the total number of rows you wish to select (e.g., 20).

Click the "submit" button.

The application will mark the first 'N' items from the entire dataset as selected (by making sequential API calls internally).

Navigate to subsequent pages to see the remaining selected rows automatically marked. Check your browser's console for logs of the submitted items.

🌐 Deployment
This application is designed for deployment on platforms like Netlify or Cloudflare Pages.

Build the project:

npm run build

This will create a dist folder containing the optimized production build.

Deploy: Upload the contents of the dist folder to your chosen hosting provider (e.g., Netlify, Cloudflare Pages).

⚠️ Important Notes
Video Explanations: This project was developed based on specific video explanations (react assignment explaination.mp4 and checks before submission.mp4). These videos provide crucial context and detailed requirements not fully captured in the written document.

API Rate Limits: While the global "Select N Rows" feature fetches data sequentially, be mindful of potential API rate limits if attempting to select a very large number of records.
