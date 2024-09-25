// document.addEventListener('DOMContentLoaded', (event) => {
//     displayEmployeeData();
// });

// function displayEmployeeData() {
//     const employeeTableBody = document.getElementById('display'); 
//     // Retrieve employee data from local storage
//     const empDataList = JSON.parse(localStorage.getItem('empDataList')) || [];
//     console.log(empDataList);

//     if (empDataList.length === 0) {
//         const emptyRow = document.createElement('tr');
//         emptyRow.innerHTML = '<td colspan="6">No Employee Data Found</td>';
//         employeeTableBody.appendChild(emptyRow);
//         return;
//     }

//     // Loop through employee data and populate the table
//     empDataList.forEach((employee, index) => {
//         const row = document.createElement('tr');
        
//         row.innerHTML = `
//             <td><img src="${employee.profile}" alt="Profile" class="emp-img"></td> 
//             <td>${employee.name}</td>
//             <td>${employee.gender}</td>
//             <td>${employee.departments.join(', ')}</td>
//             <td>${employee.salary}</td>
//             <td>${employee.startDate}</td>
//             <td>
//                 <button onclick="deleteEmployee(${index})">Delete</button>
//                 <button onclick="editEmployee(${index})">Edit</button>
//             </td>
//         `;

//         employeeTableBody.appendChild(row);
//     });
// }

// // Delete employee record
// function deleteEmployee(index) {
//     let empDataList = JSON.parse(localStorage.getItem('empDataList')) || [];
//     empDataList.splice(index, 1); 
//     localStorage.setItem('empDataList', JSON.stringify(empDataList)); 
//     location.reload();
// }


// using jquery 

$(document).ready(function () {
    fetchAndDisplayEmployees();

    $('#search-button').on('click', function () {
        const inputText = $('#search-input').val().trim().toLowerCase();
        searchEmployeeByName(inputText);
    });
});

function fetchAndDisplayEmployees() {
    $.ajax({
        url: 'http://localhost:3000/employees',
        method: 'GET',
        success: function (data) {
            populateEmployeeTable(data);
        },
        error: function (xhr, status, error) {
            console.error('Error fetching employees:', error);
        }
    });
}

function searchEmployeeByName(inputText) {
    $.ajax({
        url: 'http://localhost:3000/employees',
        method: 'GET',
        success: function (data) {
            if (!inputText) {
                populateEmployeeTable(data); 
                return;
            }

            const filteredEmployees = data.filter(function (employee) {
                return employee.name.toLowerCase().includes(inputText);
            });
            populateEmployeeTable(filteredEmployees);
        },
        error: function (xhr, status, error) {
            console.error('Error fetching employees:', error);
        }
    });
}


function populateEmployeeTable(employees) {
    const $tableBody = $('#display tbody');
    $tableBody.empty(); 

    employees.forEach(function (employee) {
        const $row = createEmployeeRow(employee);
        $tableBody.append($row);
    });
}

function createEmployeeRow(employee) {
    console.log(employee.id);
    let departmentLabels = '';
    employee.departments.forEach(function (dept) {
        departmentLabels += `<span class="dept-label">${dept}</span>`;
    });

    let formattedDate = employee.startDate;

    const $row = `
        <tr id="row-${employee.id}">
            <td class="emp-info">
                <img src="${employee.profile}" alt="Employee" class="emp-img" />
                <span>${employee.name}</span>
            </td>
            <td>${employee.gender}</td>
            <td>${departmentLabels}</td>
            <td>₹ ${employee.salary}</td>
            <td>${formattedDate}</td>
            <td class="action-buttons">
                <button onclick="deleteEmployee('${employee.id}')" class="action-btn"><img src="../assets/icons8-delete-30.png" alt="Delete" /></button>
                <button onclick="editEmployee('${employee.id}')" class="action-btn"><img src="../assets/icons8-edit-24.png" alt="Edit"/></button>
            </td>
        </tr>
    `;

    return $row;
}

function deleteEmployee(id) {
    $.ajax({
        url: `http://localhost:3000/employees/${id}`,
        method: 'DELETE',
        success: function () {
            $(`#row-${id}`).remove();
            console.log(`Employee with ID ${id} deleted successfully.`);
            refreshPage();
        },
        error: function (xhr, status, error) {
            console.error('Error deleting employee:', error);
        }
    });
}

function editEmployee(id) {
    localStorage.setItem('editEmployeeId', id);
    window.location.href = "../html/registeration.html";
}

function refreshPage() {
    location.reload();
}