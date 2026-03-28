async function loadOrders(){

const res = await fetch("/api/orders");
const data = await res.json();

const table = document.getElementById("orders");

data.orders.forEach(order => {

const row = document.createElement("tr");

row.innerHTML = `
<td>${order.orderID}</td>
<td>${order.captureID}</td>
<td>${order.status}</td>
<td>${order.amount?.value || "?"}</td>
<td>${new Date(order.createdAt).toLocaleString()}</td>
<td>${order.stock ?? "-"}</td>
`;

table.appendChild(row);

});

}

function setupProductForm(){

const form = document.getElementById("productForm");

if(!form) return;

form.addEventListener("submit", async (e) => {

e.preventDefault();

const product = {
  name: document.getElementById("name").value,
  price: parseInt(document.getElementById("price").value),
  image: document.getElementById("image").value,
  category: document.getElementById("category").value,
  description: document.getElementById("description").value,
  stock: parseInt(document.getElementById("stock").value) || 0
};

await fetch("/api/products/create", {

method: "POST",

headers: {
"Content-Type": "application/json"
},

body: JSON.stringify(product)

});

alert("Product created");

});

}

loadOrders();
setupProductForm();

const logoutBtn = document.getElementById("logoutBtn");

if(logoutBtn){

logoutBtn.addEventListener("click", () => {

localStorage.removeItem("admin_token");

window.location.href = "/admin/login.html";

});

}