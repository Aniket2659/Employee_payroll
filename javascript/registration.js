const nameRef = document.getElementById("emp-name");
const nameErrorRef = document.getElementById("nameError");
const profileRef = document.getElementsByName("profile");
const genderRef = document.getElementsByName("gender");
const departmentRefs = document.getElementsByClassName("checkbox");
const salaryRef = document.getElementById("salary");
const dayRef = document.getElementById("day");
const monthRef = document.getElementById("month");
const yearRef = document.getElementById("year");
const notesRef = document.getElementById("notes");
const submitBtnRef = document.getElementById("submitButton");
const cancelBtnRef = document.getElementById("cancelBtn");
const resetBtnRef = document.getElementById("resetButton");
const formRef = document.getElementById("emp-form");
const namePattern = /^[a-zA-Z\s']{3,}$/;

function validateName(name){
    if(!namePattern.test(name)){
        nameErrorRef.style.display = "block";
        nameErrorRef.textContent = "Name must be at least 3 characters long and contain only letters, spaces";
        nameErrorRef.style.color = "red";
        return false;
    }
    else{
        nameErrorRef.style.display = "none";
        return true;
    }
}

function clearForm() {
    const formElements = formRef.elements;
    for (let i = 0; i < formElements.length; i++) {
        const field = formElements[i];

        if (field.type === "text" || field.tagName === "TEXTAREA") {
            field.value = "";
        }

        else if (field.type === "radio" || field.type === "checkbox") {
            field.checked = false;
        }

        else if (field.tagName === "SELECT") {
            field.selectedIndex = 0;
        }
    }
    nameErrorRef.style.display = "none";
}


submitBtnRef.addEventListener("click", (e) => {
    e.preventDefault();
    const nameVal = nameRef.value.trim();

    if(!validateName(nameVal)){
        return;
    }

    let selectedProfile = "";
    for (let element of profileRef) {

        if (element.checked) {
            selectedProfile = element.value;
        }
    }

    let selectedGender = "";
    for (let element of genderRef) {
        if (element.checked) {
            selectedGender = element.value;
        }
    }

    let selectedDepartments = [];
    for (let element of departmentRefs) {
        if (element.checked) {
            selectedDepartments.push(element.value);
        }
    }

    const selectedSalary = salaryRef.value;
    const selectedStartDate = `${dayRef.value}-${monthRef.value}-${yearRef.value}`;
    const notesVal = notesRef.value;
    const empDataObj = {
        name: nameVal,
        profile: selectedProfile,
        gender: selectedGender,
        departments: selectedDepartments,
        salary: selectedSalary,
        startDate: selectedStartDate,
        notes: notesVal,
    }
    const empRecordList = JSON.parse(localStorage.getItem("empDataList"));

    if (empRecordList?.length > 0) {
    localStorage.setItem("empDataList", JSON.stringify([...empRecordList, empDataObj]));
     } 
  else {
    localStorage.setItem("empDataList", JSON.stringify([empDataObj]));
  }
  clearForm();
  window.location.href = '../html/index.html';
});

cancelBtnRef.addEventListener("click", (e)=>{
    e.preventDefault();
    clearForm();
    window.location.href = '../html/index.html';
})

resetBtnRef.addEventListener("click", (e)=>{
    e.preventDefault();
    clearForm();
})

