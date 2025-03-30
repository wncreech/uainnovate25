const apiUrl = "http://localhost:5000/api/data";
const geminiUrl = "http://localhost:5000/api/prompt";

// Fetch data on page load
async function getUserData() {
    try {
        const response = await fetch(apiUrl);
        if (!response.ok) {
            console.error("Failed to fetch data:", response.statusText);
            return;
        }

        const data = await response.json();
        console.log("User data loaded:", data);
        // Optional: You can process and display the data here later
    } catch (error) {
        console.error("Error fetching data:", error);
    }
}

// Save updated data
async function saveUserData(updatedData) {
    try {
        const response = await fetch(apiUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(updatedData)
        });

        if (!response.ok) {
            console.error("Failed to save data:", response.statusText);
            return;
        }

        const result = await response.json();
        console.log("Data saved successfully:", result);
    } catch (error) {
        console.error("Error saving data:", error);
    }
}

// Example: Add new transaction
function addTransaction() {
    const newTransaction = {
        description: "Coffee",
        amount: 5.50,
        date: new Date().toISOString()
    };

    console.log("Adding transaction:", newTransaction);

    // Simulate getting existing user data and adding the transaction
    getUserData().then((data) => {
        if (!data) {
            console.error("No data found, can't add transaction.");
            return;
        }

        // Modify data (for now, just log it)
        data.IncomeCats[0].transactions.push(newTransaction);
        console.log("Updated data with new transaction:", data);

        // Save updated data
        saveUserData(data);
    });
}

// Function to send a prompt to the backend and get a response

// Load data when page loads
window.onload = () => {
    getGeminiResponse("best bars in tuscaloosa al?").then(answer => {
        // Display or process the answer
        console.log(answer);
    });
    console.log("Loading user data...");
    getUserData();
};