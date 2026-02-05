function exportMonthlyPdf() {
    const data = JSON.parse(localStorage.getItem("eight_endance_data") || "{}");
    const today = new Date();
    const monthKey = `${today.getFullYear()}-${today.getMonth() + 1}`;
    const monthData = data[monthKey];

    if (!monthData) return alert("No data for this month.");

    const required = Math.max(0, monthData.baseTarget - monthData.holidays);
    const attended = monthData.attended.length;

    let content = `
Eight-endance Monthly Summary
Month: ${monthKey}

Required days: ${required}
Attended days: ${attended}
Holidays/Vacations: ${monthData.holidays}

Attendance List:
${monthData.attended.sort().join("\n")}
`;

    const blob = new Blob([content], { type: "text/plain" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `Eight-endance-${monthKey}.txt`;
    link.click();
}