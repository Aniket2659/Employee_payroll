document.addEventListener('DOMContentLoaded', (event) => {
    displayEmployeeData();
});

function displayEmployeeData() {
    const employeeTableBody = document.getElementById('display'); 
    // Retrieve employee data from local storage
    const empDataList = JSON.parse(localStorage.getItem('empDataList')) || [];
    console.log(empDataList);

    if (empDataList.length === 0) {
        const emptyRow = document.createElement('tr');
        emptyRow.innerHTML = '<td colspan="6">No Employee Data Found</td>';
        employeeTableBody.appendChild(emptyRow);
        return;
    }

    // Loop through employee data and populate the table
    empDataList.forEach((employee, index) => {
        const row = document.createElement('tr');
        
        row.innerHTML = `
            <td><img src="${employee.profile}" alt="Profile" class="emp-img"></td> 
            <td>${employee.name}</td>
            <td>${employee.gender}</td>
            <td>${employee.departments.join(', ')}</td>
            <td>${employee.salary}</td>
            <td>${employee.startDate}</td>
            <td>
                <button onclick="deleteEmployee(${index})">Delete</button>
                <button onclick="editEmployee(${index})">Edit</button>
            </td>
        `;

        employeeTableBody.appendChild(row);
    });
}

// Delete employee record
function deleteEmployee(index) {
    let empDataList = JSON.parse(localStorage.getItem('empDataList')) || [];
    empDataList.splice(index, 1); 
    localStorage.setItem('empDataList', JSON.stringify(empDataList)); 
    location.reload();
}


