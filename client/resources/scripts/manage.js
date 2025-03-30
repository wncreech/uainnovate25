document.addEventListener('DOMContentLoaded', function() {
    // Data structure to hold all financial entries
    let financialData = {
        income: [
            { id: 1, source: "Salary", amount: "3500", date: "2023-05-01"},
            { id: 2, source: "Freelance", amount: "800", date: "2023-05-15"}
        ],
        wants: [
            { id: 1, item: "Dining Out", amount: "75", date: "2023-05-10", category: "Entertainment" },
            { id: 2, item: "New Shoes", amount: "120", date: "2023-05-18", category: "Clothing" }
        ],
        needs: [
            { id: 1, item: "Rent", amount: "1200", date: "2023-05-01", category: "Housing" },
            { id: 2, item: "Groceries", amount: "350", date: "2023-05-05", category: "Food" }
        ],
        savings: [
            { id: 1, goal: "Emergency Fund", amount: "1000", targetDate: "2023-12-31", progress: "65" },
            { id: 2, goal: "Vacation", amount: "2500", targetDate: "2024-06-30", progress: "20" }
        ]
    };

    // Current state
    let currentCategory = 'income';
    let editMode = false;
    let currentEditId = null;

    // Initialize with Income table
    populateTable(currentCategory, financialData[currentCategory]);

    // Category selector functionality
    const categoryBtns = document.querySelectorAll('.category-btn');
    categoryBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            // Remove active class from all buttons
            categoryBtns.forEach(b => b.classList.remove('active'));
            // Add active class to clicked button
            this.classList.add('active');
            
            // Get the category
            currentCategory = this.dataset.category;
            
            // Hide all tables
            document.querySelectorAll('.category-table').forEach(table => {
                table.classList.remove('active');
            });
            
            // Show selected table
            document.getElementById(`${currentCategory}-table`).classList.add('active');
            
            // Populate the table
            populateTable(currentCategory, financialData[currentCategory]);
        });
    });

    // Function to populate a table with data
    function populateTable(category, data) {
        const tableBody = document.querySelector(`#${category}-table tbody`);
        tableBody.innerHTML = '';
        
        data.forEach(item => {
            const row = document.createElement('tr');
            row.dataset.id = item.id;
            
            // Create cells based on category
            if (category === 'income') {
                row.innerHTML = `
                    <td>${item.source}</td>
                    <td>$${parseFloat(item.amount).toLocaleString()}</td>
                    <td>${formatDate(item.date)}</td>
                    <td>
                        <button class="btn btn-outline-primary edit-btn">Edit</button>
                        <button class="btn btn-outline-danger delete-btn">Delete</button>
                    </td>
                `;
            } else if (category === 'wants' || category === 'needs') {
                row.innerHTML = `
                    <td>${item.item}</td>
                    <td>$${parseFloat(item.amount).toLocaleString()}</td>
                    <td>${formatDate(item.date)}</td>
                    <td>${item.category}</td>
                    <td>
                        <button class="btn btn-outline-primary edit-btn">Edit</button>
                        <button class="btn btn-outline-danger delete-btn">Delete</button>
                    </td>
                `;
            } else if (category === 'savings') {
                row.innerHTML = `
                    <td>${item.goal}</td>
                    <td>$${parseFloat(item.amount).toLocaleString()}</td>
                    <td>${formatDate(item.targetDate)}</td>
                    <td>
                        <div class="progress">
                            <div class="progress-bar" style="width: ${item.progress}%">
                                ${item.progress}%
                            </div>
                        </div>
                    </td>
                    <td>
                        <button class="btn btn-outline-primary edit-btn">Edit</button>
                        <button class="btn btn-outline-danger delete-btn">Delete</button>
                    </td>
                `;
            }
            
            tableBody.appendChild(row);
        });
    }

    // Format date for display
    function formatDate(dateString) {
        const options = { year: 'numeric', month: 'short', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    }

    // Add entry button functionality
    document.querySelectorAll('.add-entry').forEach(btn => {
        btn.addEventListener('click', function() {
            showEntryForm('add', currentCategory);
        });
    });

    // Edit/Delete button functionality (using event delegation)
    document.addEventListener('click', function(e) {
        // Edit button clicked
        if (e.target.classList.contains('edit-btn')) {
            const row = e.target.closest('tr');
            const id = parseInt(row.dataset.id);
            showEntryForm('edit', currentCategory, id);
        }
        
        // Delete button clicked
        if (e.target.classList.contains('delete-btn')) {
            const row = e.target.closest('tr');
            const id = parseInt(row.dataset.id);
            
            if (confirm('Are you sure you want to delete this entry?')) {
                // Remove from data
                financialData[currentCategory] = financialData[currentCategory].filter(item => item.id !== id);
                
                // Re-render table
                populateTable(currentCategory, financialData[currentCategory]);
            }
        }
    });

    // Show entry form (for both add and edit)
    function showEntryForm(mode, category, id = null) {
        // Create or find modal container
        let modal = document.getElementById('entry-modal');
        if (!modal) {
            modal = document.createElement('div');
            modal.id = 'entry-modal';
            modal.className = 'modal';
            modal.innerHTML = `
                <div class="modal-content">
                    <span class="close-btn">&times;</span>
                    <h3>${mode === 'add' ? 'Add New' : 'Edit'} ${capitalizeFirstLetter(category)}</h3>
                    <form id="entry-form">
                        <div id="form-fields"></div>
                        <button type="submit" class="submit-btn">${mode === 'add' ? 'Add' : 'Update'} Entry</button>
                    </form>
                </div>
            `;
            document.body.appendChild(modal);
            
            // Close modal when X is clicked
            modal.querySelector('.close-btn').addEventListener('click', () => {
                modal.style.display = 'none';
            });
            
            // Close modal when clicking outside
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    modal.style.display = 'none';
                }
            });
        }
        
        // Set up form based on category and mode
        const formFields = modal.querySelector('#form-fields');
        formFields.innerHTML = '';
        
        let entryData = {};
        if (mode === 'edit' && id) {
            entryData = financialData[category].find(item => item.id === id);
            currentEditId = id;
        } else {
            currentEditId = null;
        }
        
        editMode = mode === 'edit';
        
        // Generate form fields based on category
        if (category === 'income') {
            formFields.innerHTML = `
                <div class="form-group">
                    <label for="source">Income Source</label>
                    <input type="text" id="source" name="source" value="${entryData.source || ''}" required>
                </div>
                <div class="form-group">
                    <label for="amount">Amount ($)</label>
                    <input type="number" id="amount" name="amount" value="${entryData.amount || ''}" step="0.01" required>
                </div>
                <div class="form-group">
                    <label for="date">Date</label>
                    <input type="date" id="date" name="date" value="${entryData.date || ''}" required>
                </div>
                <div class="form-group">
                    <label for="frequency">Frequency</label>
                    <select id="frequency" name="frequency" required>
                        <option value="Weekly" ${entryData.frequency === 'Weekly' ? 'selected' : ''}>Weekly</option>
                        <option value="Bi-weekly" ${entryData.frequency === 'Bi-weekly' ? 'selected' : ''}>Bi-weekly</option>
                        <option value="Monthly" ${entryData.frequency === 'Monthly' ? 'selected' : ''}>Monthly</option>
                        <option value="Yearly" ${entryData.frequency === 'Yearly' ? 'selected' : ''}>Yearly</option>
                    </select>
                </div>
            `;
        } else if (category === 'wants' || category === 'needs') {
            formFields.innerHTML = `
                <div class="form-group">
                    <label for="item">Item</label>
                    <input type="text" id="item" name="item" value="${entryData.item || ''}" required>
                </div>
                <div class="form-group">
                    <label for="amount">Amount ($)</label>
                    <input type="number" id="amount" name="amount" value="${entryData.amount || ''}" step="0.01" required>
                </div>
                <div class="form-group">
                    <label for="date">Date</label>
                    <input type="date" id="date" name="date" value="${entryData.date || ''}" required>
                </div>
                <div class="form-group">
                    <label for="category">Category</label>
                    <input type="text" id="category" name="category" value="${entryData.category || ''}" required>
                </div>
            `;
        } else if (category === 'savings') {
            formFields.innerHTML = `
                <div class="form-group">
                    <label for="goal">Goal</label>
                    <input type="text" id="goal" name="goal" value="${entryData.goal || ''}" required>
                </div>
                <div class="form-group">
                    <label for="amount">Target Amount ($)</label>
                    <input type="number" id="amount" name="amount" value="${entryData.amount || ''}" step="0.01" required>
                </div>
                <div class="form-group">
                    <label for="targetDate">Target Date</label>
                    <input type="date" id="targetDate" name="targetDate" value="${entryData.targetDate || ''}" required>
                </div>
                <div class="form-group">
                    <label for="progress">Current Progress (%)</label>
                    <input type="number" id="progress" name="progress" value="${entryData.progress || '0'}" min="0" max="100" required>
                </div>
            `;
        }
        
        // Handle form submission
        const form = modal.querySelector('#entry-form');
        form.onsubmit = (e) => {
            e.preventDefault();
            handleFormSubmit(category, mode);
        };
        
        // Show modal
        modal.style.display = 'block';
    }

    // Handle form submission
    function handleFormSubmit(category, mode) {
        const form = document.getElementById('entry-form');
        const formData = new FormData(form);
        const newEntry = {};
        
        // Convert FormData to object
        for (let [key, value] of formData.entries()) {
            newEntry[key] = value;
        }
        
        if (mode === 'add') {
            // Add new entry
            newEntry.id = financialData[category].length > 0 
                ? Math.max(...financialData[category].map(item => item.id)) + 1 
                : 1;
            financialData[category].push(newEntry);
        } else {
            // Update existing entry
            const index = financialData[category].findIndex(item => item.id === currentEditId);
            if (index !== -1) {
                newEntry.id = currentEditId;
                financialData[category][index] = newEntry;
            }
        }
        
        // Re-render table
        populateTable(category, financialData[category]);
        
        // Close modal
        document.getElementById('entry-modal').style.display = 'none';
    }

    // Helper function to capitalize first letter
    function capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }
});

// Add modal styles to the head
document.addEventListener('DOMContentLoaded', function() {
    const style = document.createElement('style');
    style.textContent = `
        /* Modal Styles */
        .modal {
            display: none;
            position: fixed;
            z-index: 100;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0,0,0,0.4);
        }
        
        .modal-content {
            background-color: #fefefe;
            margin: 10% auto;
            padding: 20px;
            border-radius: 8px;
            width: 90%;
            max-width: 500px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.2);
            position: relative;
        }
        
        .close-btn {
            position: absolute;
            right: 20px;
            top: 15px;
            font-size: 24px;
            font-weight: bold;
            color: #aaa;
            cursor: pointer;
        }
        
        .close-btn:hover {
            color: #333;
        }
        
        .form-group {
            margin-bottom: 15px;
        }
        
        .form-group label {
            display: block;
            margin-bottom: 5px;
            font-weight: 500;
        }
        
        .form-group input,
        .form-group select {
            width: 100%;
            padding: 8px 12px;
            border: 1px solid #ddd;
            border-radius: 4px;
            font-size: 14px;
        }
        
        .submit-btn {
            background-color: #4cae4f;
            color: white;
            border: none;
            padding: 10px 20px;
            border-radius: 4px;
            cursor: pointer;
            font-size: 14px;
            margin-top: 10px;
        }
        
        .submit-btn:hover {
            background-color: #3d8b40;
        }
    `;
    document.head.appendChild(style);
});