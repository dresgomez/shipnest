async function loadOrders(){

try{

const res = await fetch("/api/orders");
const data = await res.json();

const table = document.getElementById("orders");

table.innerHTML = "";

data.orders.forEach(order => {

const row = document.createElement("tr");

row.innerHTML = `
<td>${order.orderID}</td>
<td>${order.captureID}</td>
<td>${order.status}</td>
<td>${order.amount?.value || "?"}</td>
<td>${new Date(order.createdAt).toLocaleString()}</td>
`;

table.appendChild(row);

});

}catch(err){

console.error("Failed to load orders:", err);

}

}

loadOrders();