let sem = new URLSearchParams(window.location.search).get("sem");
let storageKey = "gradewise_sem_" + sem;

let subjects = JSON.parse(localStorage.getItem(storageKey)) || [];

/* ---------------- ADD ---------------- */
function addSubject() {
  let name = document.getElementById("subject").value;
  let credits = Number(document.getElementById("credits").value);
  let grade = Number(document.getElementById("grade").value);

  if (!name || !credits || !grade) return;

  subjects.push({ name, credits, grade });

  save();
  render();
  calculate();

  clearInputs();
}

/* ---------------- RENDER ---------------- */
function render() {
  let table = document.getElementById("table");
  if (!table) return;

  table.innerHTML = "";

  subjects.forEach((s, index) => {
    table.innerHTML += `
      <tr>
        <td>${s.name}</td>
        <td>${s.credits}</td>
        <td>${s.grade}</td>
        <td>
          <button onclick="editSubject(${index})">Edit</button>
          <button onclick="deleteSubject(${index})">Delete</button>
        </td>
      </tr>
    `;
  });
}

/* ---------------- EDIT ---------------- */
function editSubject(index) {
  let s = subjects[index];

  document.getElementById("subject").value = s.name;
  document.getElementById("credits").value = s.credits;
  document.getElementById("grade").value = s.grade;

  subjects.splice(index, 1);

  save();
  render();
  calculate();
}

/* ---------------- DELETE ---------------- */
function deleteSubject(index) {
  subjects.splice(index, 1);

  save();
  render();
  calculate();
}

/* ---------------- CGPA CALC ---------------- */
function calculate() {
  let totalC = 0;
  let totalP = 0;

  subjects.forEach(s => {
    totalC += s.credits;
    totalP += s.credits * s.grade;
  });

  let cgpa = totalC ? (totalP / totalC).toFixed(2) : 0;

  let box = document.getElementById("cgpa");
  if (box) box.innerText = cgpa;

  updateOverallCGPA();
}

/* ---------------- SAVE ---------------- */
function save() {
  localStorage.setItem(storageKey, JSON.stringify(subjects));
}

/* ---------------- CLEAR INPUTS ---------------- */
function clearInputs() {
  document.getElementById("subject").value = "";
  document.getElementById("credits").value = "";
  document.getElementById("grade").value = "";
}

/* ---------------- OVERALL CGPA ---------------- */
function updateOverallCGPA() {
  let totalCredits = 0;
  let totalPoints = 0;

  let tableBody = document.getElementById("semesterSummary");
  if (tableBody) tableBody.innerHTML = "";

  for (let i = 1; i <= 8; i++) {
    let data = JSON.parse(localStorage.getItem("gradewise_sem_" + i)) || [];

    let semCredits = 0;
    let semPoints = 0;

    data.forEach(s => {
      semCredits += s.credits;
      semPoints += s.credits * s.grade;

      totalCredits += s.credits;
      totalPoints += s.credits * s.grade;
    });

    let cgpa = semCredits ? (semPoints / semCredits).toFixed(2) : "0.00";

    if (tableBody) {
      tableBody.innerHTML += `
        <tr>
          <td>Semester ${i}</td>
          <td>${cgpa}</td>
        </tr>
      `;
    }
  }

  let overall = totalCredits ? (totalPoints / totalCredits).toFixed(2) : 0;

  let box = document.getElementById("overallCGPA");
  if (box) box.innerText = overall;
}

/* INIT */
render();
calculate();