const offsetMinutes = -new Date().getTimezoneOffset();
const startDate = '2026-04-19';
const endDate = '2026-04-19';

console.log("Current Offset Minutes:", offsetMinutes);
console.log("Searching range (Local):", `${startDate} 00:00:00`, "to", `${endDate} 23:59:59`);
console.log("MySQL DATE_SUB logic applied (UTC calculated):");

const startLocal = new Date(`${startDate} 00:00:00`);
const endLocal = new Date(`${endDate} 23:59:59`);

const startUTCString = new Date(startLocal.getTime() - (offsetMinutes * 60000)).toISOString();
const endUTCString = new Date(endLocal.getTime() - (offsetMinutes * 60000)).toISOString();

console.log("Effective Start (UTC):", startUTCString);
console.log("Effective End (UTC):", endUTCString);

const targetOrderUTC = "2026-04-18T21:53:50.000Z";
console.log("Target Order UTC:", targetOrderUTC);
console.log("Is target in range?", targetOrderUTC >= startUTCString && targetOrderUTC <= endUTCString);
