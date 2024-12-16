function formatDate(rawDate) {
  console.log("===reached here", rawDate);
  const dateMatch = /Date\((\d+),(\d+),(\d+)\)/.exec(rawDate);
  if (dateMatch) {
    const year = parseInt(dateMatch[1], 10);
    const month = parseInt(dateMatch[2], 10); // JavaScript months are 0-indexed
    const day = parseInt(dateMatch[3], 10);
    const formattedDate = new Date(year, month, day).toLocaleDateString(
      "en-US",
      {
        month: "short",
        day: "numeric",
        year: "numeric",
      }
    );
    return formattedDate;
  }
  return rawDate; // Return raw date if the format doesn't match
}
async function loadData(filter = "all") {
  console.log("====reached here");
  try {
    // Make the backend call to fetch data
    const dataArray = [];

    const SHEET_ID = "1X9MNBQpWpv8wlLJrmZ133TQ8REO9s1OHHiYS1_bzlvQ";
    const GID = "1606761809";
    let QUERY = `SELECT * `;
    if (filter !== "all") {
      QUERY = `SELECT * WHERE C="${filter}"`;
    }
    const res = await readGsheetData(SHEET_ID, GID, QUERY);
    const columns = [...res?.table?.cols];
    res?.table?.rows?.map((item) => {
      const productObj = {};
      columns?.map((header, i) => {
        productObj[header?.label] = item?.c?.[i]?.v;
        return "";
      });
      dataArray?.push(productObj);
      return "";
    });

    // Populate table with data
    const tableBody = document.querySelector("#data-table tbody");
    tableBody.innerHTML = "";

    dataArray.forEach((row) => {
      const tr = document.createElement("tr");

      // Add each column value to the row
      tr.innerHTML = `
          <td>${formatDate(row.Date) || ""}</td>
          <td>${row?.["Name"] || ""}</td>
          <td>${row?.["Task"] || ""}</td>
          <td>${row?.["Percentage Completion"] || ""}</td>
          `;
      //   <td>${row?.["Time Spent (minutes)"] || ""}</td>
      //   <td>${(row?.["HRS SPENT"] / 60).toFixed(2) || ""}</td>

      tableBody.appendChild(tr);
    });
  } catch (error) {
    console.error("Failed to load data:", error);
  }
}

// Load data when the page loads
loadData();

// Add event listener to dropdown
document.querySelector("#data-filter").addEventListener("change", (event) => {
  loadData(event.target.value);
});
