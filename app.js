// LocalStorage keys
const STORAGE_KEY = "eight_endance_data";

function loadData() {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : {};
}

function saveData(data) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

function getMonthKey(date) {
    return `${date.getFullYear()}-${date.getMonth() + 1}`;
}

function initMonth(data, monthKey) {
    if (!data[monthKey]) {
        data[monthKey] = {
            attended: [],
            holidays: 0,
            baseTarget: 8
        };
    }
}

function addAttendance(dateString) {
    const data = loadData();
    const date = new Date(dateString);
    const monthKey = getMonthKey(date);

    initMonth(data, monthKey);

    if (!data[monthKey].attended.includes(dateString)) {
        data[monthKey].attended.push(dateString);
    }

    saveData(data);
    render();
}

function addHolidays(count) {
    const data = loadData();
    const today = new Date();
    const monthKey = getMonthKey(today);

    initMonth(data, monthKey);
    data[monthKey].holidays += parseInt(count);

    saveData(data);
    render();
}

function render() {
    const data = loadData();
    const today = new Date();
    const monthKey = getMonthKey(today);

    initMonth(data, monthKey);

    const monthData = data[monthKey];
    const required = Math.max(0, monthData.baseTarget - monthData.holidays);
    const attended = monthData.attended.length;

    // Progress bar
    const progress = required === 0 ? 100 : Math.min(100, (attended / required) * 100);
    document.getElementById("progressBar").style.width = progress + "%";
    document.getElementById("progressText").textContent =
        `${attended} / ${required} days`;

    // Attendance list
    const list = document.getElementById("attendanceList");
    list.innerHTML = "";
    const sorted = monthData.attended.sort();
    sorted.forEach(d => {
        const li = document.createElement("li");
        li.textContent = d;
        list.appendChild(li);
    });
}

// Buttons
document.getElementById("checkInBtn").addEventListener("click", () => {
    const today = new Date().toISOString().split("T")[0];
    addAttendance(today);
});

document.getElementById("addPastDateBtn").addEventListener("click", () => {
    const date = document.getElementById("pastDateInput").value;
    if (date) addAttendance(date);
});

document.getElementById("addHolidayBtn").addEventListener("click", () => {
    const count = document.getElementById("holidayCount").value;
    if (count > 0) addHolidays(count);
});

document.getElementById("exportPdfBtn").addEventListener("click", () => {
    exportMonthlyPdf();
});

// Init
render();