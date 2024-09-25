// const nameRef = document.getElementById("emp-name");
// const nameErrorRef = document.getElementById("nameError");
// const profileRef = document.getElementsByName("profile");
// const genderRef = document.getElementsByName("gender");
// const departmentRefs = document.getElementsByClassName("checkbox");
// const salaryRef = document.getElementById("salary");
// const dayRef = document.getElementById("day");
// const monthRef = document.getElementById("month");
// const yearRef = document.getElementById("year");
// const notesRef = document.getElementById("notes");
// const submitBtnRef = document.getElementById("submitButton");
// const cancelBtnRef = document.getElementById("cancelBtn");
// const resetBtnRef = document.getElementById("resetButton");
// const formRef = document.getElementById("emp-form");
// const namePattern = /^[a-zA-Z\s']{3,}$/;

// function validateName(name){
//     if(!namePattern.test(name)){
//         nameErrorRef.style.display = "block";
//         nameErrorRef.textContent = "Name must be at least 3 characters long and contain only letters, spaces";
//         nameErrorRef.style.color = "red";
//         return false;
//     }
//     else{
//         nameErrorRef.style.display = "none";
//         return true;
//     }
// }

// function clearForm() {
//     const formElements = formRef.elements;
//     for (let i = 0; i < formElements.length; i++) {
//         const field = formElements[i];

//         if (field.type === "text" || field.tagName === "TEXTAREA") {
//             field.value = "";
//         }

//         else if (field.type === "radio" || field.type === "checkbox") {
//             field.checked = false;
//         }

//         else if (field.tagName === "SELECT") {
//             field.selectedIndex = 0;
//         }
//     }
//     nameErrorRef.style.display = "none";
// }


// submitBtnRef.addEventListener("click", (e) => {
//     e.preventDefault();
//     const nameVal = nameRef.value.trim();

//     if(!validateName(nameVal)){
//         return;
//     }

//     let selectedProfile = "";
//     for (let element of profileRef) {

//         if (element.checked) {
//             selectedProfile = element.value;
//         }
//     }

//     let selectedGender = "";
//     for (let element of genderRef) {
//         if (element.checked) {
//             selectedGender = element.value;
//         }
//     }

//     let selectedDepartments = [];
//     for (let element of departmentRefs) {
//         if (element.checked) {
//             selectedDepartments.push(element.value);
//         }
//     }

//     const selectedSalary = salaryRef.value;
//     const selectedStartDate = `${dayRef.value}-${monthRef.value}-${yearRef.value}`;
//     const notesVal = notesRef.value;
//     const empDataObj = {
//         name: nameVal,
//         profile: selectedProfile,
//         gender: selectedGender,
//         departments: selectedDepartments,
//         salary: selectedSalary,
//         startDate: selectedStartDate,
//         notes: notesVal,
//     }
//     const empRecordList = JSON.parse(localStorage.getItem("empDataList"));

//     if (empRecordList?.length > 0) {
//     localStorage.setItem("empDataList", JSON.stringify([...empRecordList, empDataObj]));
//      } 
//   else {
//     localStorage.setItem("empDataList", JSON.stringify([empDataObj]));
//   }
//   clearForm();
//   window.location.href = '../html/index.html';
// });

// cancelBtnRef.addEventListener("click", (e)=>{
//     e.preventDefault();
//     clearForm();
//     window.location.href = '../html/index.html';
// })

// resetBtnRef.addEventListener("click", (e)=>{
//     e.preventDefault();
//     clearForm();
// })



// using jquery
const namePattern = /^[a-zA-Z\s'-]{3,}$/;

$(document).ready(function () {
    const editEmployeeId = localStorage.getItem('editEmployeeId');
    if (editEmployeeId) {
        $.ajax({
            url: `http://localhost:3000/employees/${editEmployeeId}`,
            method: 'GET',
            success: function (data) {
                populateFormWithEmployeeData(data);
            },
            error: function (xhr, status, error) {
                console.error('Error fetching employee data:', error);
            }
        });
    }
});

function validateName(name) {
    if (!namePattern.test(name)) {
        $("#nameError").show();
        $("#nameError").text("Name must be at least 3 characters long and contain only letters, spaces");
        $("#nameError").css('color', 'red');
        return false;
    } else {
        $("#nameError").hide();
        return true;
    }
}

function populateFormWithEmployeeData(employee) {
    $("#emp-name").val(employee.name);
    $(`[name='profile'][value='${employee.profile}']`).prop('checked', true);
    $(`[name='gender'][value='${employee.gender}']`).prop('checked', true);

    employee.departments.forEach(function (dept) {
        $(`[name='${dept.toLowerCase()}']`).prop('checked', true);
    });

    $("#salary").val(employee.salary);
    const [day, month, year] = employee.startDate.split('-');
    $("#day").val(day);
    $("#month").val(month);
    $("#year").val(year);
    $("#notes").val(employee.notes);
}

function clearForm() {
    $("#emp-form")[0].reset();
    $("#nameError").hide();
}

$("#submitButton").on("click", function (e) {
    e.preventDefault();
    
    const nameVal = $("#emp-name").val().trim();
    const selectedProfile = $("[name='profile']:checked").val();
    const selectedGender = $("[name='gender']:checked").val();
    
    let selectedDepartments = [];
    $(".checkbox:checked").each(function () {
        selectedDepartments.push($(this).val());
    });

    const selectedSalary = $("#salary").val();
    const day = $("#day").val();
    const month = $("#month").val();
    const year = $("#year").val();
    const selectedStartDate = `${day}-${month}-${year}`;
    const notesVal = $("#notes").val();

    // Field validation
    if (!validateName(nameVal)) {
        alert("Please correct the name field.");
        return;
    }

    if (!selectedProfile) {
        alert("Please select a profile.");
        return;
    }

    if (!selectedGender) {
        alert("Please select a gender.");
        return;
    }

    if (selectedDepartments.length === 0) {
        alert("Please select at least one department.");
        return;
    }

    if (!selectedSalary) {
        alert("Please enter a salary.");
        return;
    }

    if (!day || !month || !year) {
        alert("Please select a valid start date.");
        return;
    }

    // If all validations pass, create the employee object
    const empDataObj = {
        name: nameVal,
        profile: selectedProfile,
        gender: selectedGender,
        departments: selectedDepartments,
        salary: selectedSalary,
        startDate: selectedStartDate,
        notes: notesVal,
    };

    const editEmployeeId = localStorage.getItem('editEmployeeId');
    if (editEmployeeId) {
        $.ajax({
            url: `http://localhost:3000/employees/${editEmployeeId}`,
            type: "PUT",
            contentType: "application/json",
            data: JSON.stringify(empDataObj),
            success: function (data) {
                alert("Employee updated successfully!");
                clearForm();
                localStorage.removeItem('editEmployeeId');
                window.location.href = '../html/index.html';
            },
            error: function (xhr, status, error) {
                console.error("Error updating employee:", error);
            }
        });
    } 
    else {
        $.ajax({
            url: "http://localhost:3000/employees",
            type: "POST",
            contentType: "application/json",
            data: JSON.stringify(empDataObj),
            success: function (data) {
                alert("Employee added successfully!");
                clearForm();
                window.location.href = "../html/index.html";
            },
            error: function (xhr, status, error) {
                console.error("Error adding employee:", error);
            }
        });
    }
});

$("#cancelBtn, #resetButton").on("click", function (e) {
    e.preventDefault();
    clearForm();
    localStorage.removeItem('editEmployeeId');
});
