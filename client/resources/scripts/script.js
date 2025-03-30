document.addEventListener('DOMContentLoaded', function() {
    const data = [
        { label: 'Needs', value: 40 },
        { label: 'Wants', value: 35 },
        { label: 'Savings', value: 25 }
    ];

    const width = 300;
    const height = 300;
    const radius = Math.min(width, height) / 2;
    const margin = 40;

    // Define custom colors using the provided color scheme
    const colors = ["var(--color-1)", "var(--color-4)", "var(--color-5)"];

    // Color scale
    const color = d3.scaleOrdinal()
        .domain(data.map(d => d.label))
        .range(colors);

    // Create SVG element
    const svg = d3.select('#piechart')
        .append('svg')
        .attr('width', width)
        .attr('height', height)
        .append('g')
        .attr('transform', `translate(${width / 2},${height / 2})`);

    // Create pie layout
    const pie = d3.pie()
        .value(d => d.value)
        .sort(null);

    // Create arc generator
    const arc = d3.arc()
        .innerRadius(0)
        .outerRadius(radius - margin);

    // Create arcs
    const arcs = svg.selectAll('.arc')
        .data(pie(data))
        .enter()
        .append('g')
        .attr('class', 'arc');

    // Add colored segments
    arcs.append('path')
        .attr('d', arc)
        .attr('fill', d => color(d.data.label))
        .attr('stroke', 'white')
        .style('stroke-width', '2px');

    // Add labels
    arcs.append('text')
        .attr('transform', d => {
            const pos = arc.centroid(d);
            const midAngle = Math.atan2(pos[1], pos[0]);
            const x = Math.cos(midAngle) * (radius - margin/2);
            const y = Math.sin(midAngle) * (radius - margin/2);
            return `translate(${x},${y})`;
        })
        .attr('dy', '0.35em')
        .attr('text-anchor', 'middle')
        .text(d => d.data.label)
        .style('fill', 'var(--text-dark)')
        .style('font-size', '12px')
        .style('font-weight', 'bold');

    // Add percentage labels
    arcs.append('text')
        .attr('transform', d => `translate(${arc.centroid(d)})`)
        .attr('dy', '0.35em')
        .attr('text-anchor', 'middle')
        .text(d => `${Math.round(d.data.value)}%`)
        .style('fill', 'white')
        .style('font-size', '12px')
        .style('font-weight', 'bold');

    // Add event listener for the Add Transaction button
    const addTransactionBtn = document.querySelector('.add-transaction-btn');
    if (addTransactionBtn) {
        addTransactionBtn.addEventListener('click', function() {
            showTransactionForm();
        });
    }
});

// Function to add a new transaction
function addTransaction(transaction) {
    // Get transactions list element
    const transactionsList = document.querySelector('.transactions-list');
    if (!transactionsList) {
        console.error('Transaction list container not found');
        return;
    }
    
    // Create new transaction item
    const transactionItem = document.createElement('div');
    transactionItem.className = 'transaction-item';
    
    // Determine the appropriate icon class based on category
    let iconClass = '';
    let iconElement = '';
    
    // First handle category determination
    if (transaction.category.toLowerCase() === 'needs') {
        if (transaction.title.toLowerCase().includes('grocery')) {
            iconClass = 'grocery';
            iconElement = '<i class="fas fa-shopping-basket"></i>';
        } else if (transaction.title.toLowerCase().includes('bill') || 
                  transaction.title.toLowerCase().includes('utilities')) {
            iconClass = 'utilities';
            iconElement = '<i class="fas fa-bolt"></i>';
        } else {
            iconClass = 'needs';
            iconElement = '<i class="fas fa-house-user"></i>';
        }
    } else if (transaction.category.toLowerCase() === 'wants') {
        if (transaction.title.toLowerCase().includes('restaurant') || 
            transaction.title.toLowerCase().includes('food')) {
            iconClass = 'restaurant';
            iconElement = '<i class="fas fa-utensils"></i>';
        } else if (transaction.title.toLowerCase().includes('movie') || 
                  transaction.title.toLowerCase().includes('entertainment')) {
            iconClass = 'entertainment';
            iconElement = '<i class="fas fa-film"></i>';
        } else {
            iconClass = 'wants';
            iconElement = '<i class="fas fa-shopping-bag"></i>';
        }
    } else if (transaction.category.toLowerCase() === 'savings') {
        iconClass = 'savings';
        iconElement = '<i class="fas fa-piggy-bank"></i>';
    } else if (transaction.category.toLowerCase() === 'income') {
        iconClass = 'income';
        iconElement = '<i class="fas fa-dollar-sign"></i>';
    } else {
        iconClass = 'other';
        iconElement = '<i class="fas fa-receipt"></i>';
    }
    
    // Format amount
    const amount = parseFloat(transaction.amount);
    const formattedAmount = Math.abs(amount).toFixed(2);
    const amountPrefix = amount >= 0 ? '+$' : '-$';
    const amountClass = amount >= 0 ? 'transaction-amount income' : 'transaction-amount';
    
    // Get current date for new transactions
    let dateText = 'Today';
    if (transaction.date) {
        dateText = transaction.date;
    }
    
    // Build transaction HTML
    transactionItem.innerHTML = `
        <div class="transaction-icon ${iconClass}">
            ${iconElement}
        </div>
        <div class="transaction-details">
            <div class="transaction-title">${transaction.title}</div>
            <div class="transaction-category">${transaction.category}</div>
        </div>
        <div class="transaction-info">
            <div class="${amountClass}">${amountPrefix}${formattedAmount}</div>
            <div class="transaction-date">${dateText}</div>
        </div>
    `;
    
    // Add the new transaction to the top of the list
    transactionsList.insertBefore(transactionItem, transactionsList.firstChild);
    
    // Update budget categories based on the new transaction
    updateBudgetCategories(transaction);
}
  
// Function to update budget category amounts based on new transaction
function updateBudgetCategories(transaction) {
    const amount = Math.abs(parseFloat(transaction.amount));
    
    // If it's an expense (negative amount)
    if (parseFloat(transaction.amount) < 0) {
        // Find the relevant category card
        const categoryCard = document.querySelector(`.${transaction.category.toLowerCase()}-card`);
        if (categoryCard) {
            // Update the amount
            const amountElement = categoryCard.querySelector('.category-amount');
            if (amountElement) {
                const currentAmount = parseFloat(amountElement.textContent.replace('$', ''));
                const newAmount = currentAmount + amount;
                amountElement.textContent = '$' + newAmount.toFixed(0);
                
                // Update the progress bar
                const limitElement = categoryCard.querySelector('.category-limit');
                if (limitElement) {
                    const limitText = limitElement.textContent;
                    const limitMatch = limitText.match(/\$([0-9,]+)/);
                    if (limitMatch) {
                        const limit = parseFloat(limitMatch[1].replace(',', ''));
                        const progressBar = categoryCard.querySelector('.progress-bar');
                        if (progressBar) {
                            const newWidth = (newAmount / limit * 100).toFixed(0) + '%';
                            progressBar.style.width = newWidth;
                        }
                    }
                }
            }
        }
    }
    
    // If it's income (positive amount), could update savings or other metrics
    if (parseFloat(transaction.amount) > 0) {
        // Update savings or other relevant metrics if needed
    }
    
    // Update pie chart if it exists
    if (typeof updatePieChart === 'function') {
        updatePieChart();
    }
}
  

document.addEventListener('DOMContentLoaded', function() {
    // Event listener for the "Add Transaction" button
    const addTransactionBtn = document.querySelector('.add-transaction-btn');
    if (addTransactionBtn) {
        addTransactionBtn.addEventListener('click', showTransactionForm);
    }
});

// Function to show the transaction form modal
function showTransactionForm() {
    // Get modal container
    const modal = document.querySelector('.transaction-modal');
    modal.classList.remove('hidden'); // Show the modal

    // Close the modal when clicking outside of it
    modal.addEventListener('click', function(e) {
        if (e.target === modal) { // Check if the click is on the modal background
            modal.classList.add('hidden'); // Close the modal
        }
    });

    // Cancel button functionality
    document.getElementById('cancel-transaction').addEventListener('click', function() {
        modal.classList.add('hidden'); // Close the modal
    });

    // Transaction form submission handling
    document.getElementById('transaction-form').addEventListener('submit', function(e) {
        e.preventDefault(); // Prevent the default form submission

        // Create the new transaction object from the form values
        const newTransaction = {
            title: document.getElementById('transaction-description').value,
            amount: document.getElementById('transaction-amount').value
        };

        // Process the transaction (this could log it, display it, etc.)
        console.log(newTransaction); // Example placeholder logic

        // Close the modal after processing the transaction
        modal.classList.add('hidden');
    });
}

document.addEventListener('DOMContentLoaded', function() {
    // Add event listener for the "Add Transaction" button
    const addTransactionBtn = document.querySelector('.add-transaction-btn');
    if (addTransactionBtn) {
        addTransactionBtn.addEventListener('click', showTransactionForm);
    }
    
    // Event listener for the Advice link
    const adviceLink = document.querySelector('.advice-link');
    if (adviceLink) {
        adviceLink.addEventListener('click', function() {
            window.location.href = 'advice.html'; // Navigate to Advice page
        });
    }
});