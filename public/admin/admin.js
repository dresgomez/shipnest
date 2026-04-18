const token = localStorage.getItem("admin_token");

if (!token) {
  window.location.href = "/admin/login.html";
}

let editingProductId = null;
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

async function setupProductForm() {
  const form = document.getElementById("productForm");

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

    // 🔥 AQUI LA MAGIA
    if (editingProductId) {
      // UPDATE
      await fetch(`/api/products/update?id=${editingProductId}`, {
  method: "PUT",
  headers: {
    "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
  },
        body: JSON.stringify(product)
      });

      alert("Product updated");
      editingProductId = null;

    } else {
      // CREATE
      await fetch("/api/products/create", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
     Authorization: `Bearer ${token}`
  },
        body: JSON.stringify(product)
      });

      alert("Product created");
    }

    form.reset();
    loadProducts();
  });
}

function editProduct(id) {
  const product = window.products.find(p => p._id === id);
  if (!product) return;

  document.getElementById("name").value = product.name;
  document.getElementById("price").value = product.price;
  document.getElementById("image").value = product.image;
  document.getElementById("category").value = product.category;
  document.getElementById("description").value = product.description;
  document.getElementById("stock").value = product.stock;

  editingProductId = id;

  window.scrollTo({ top: 0, behavior: "smooth" });
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

async function loadProducts() {
  const res = await fetch("/api/products");
  const data = await res.json();

   window.products = data.products;

  const table = document.getElementById("products");
  if (!table) return;

  table.innerHTML = "";

  data.products.forEach(product => {
    const row = document.createElement("tr");

    row.innerHTML = `
  <td>${product.name}</td>
  <td>${product.price}</td>
  <td>${product.stock}</td>
  <td>
    <button onclick="editProduct('${product._id}')">✏️ Edit</button>
    <button onclick="deleteProduct('${product._id}')">🗑 Delete</button>
  </td>
`;

    table.appendChild(row);
  });
}

async function deleteProduct(id) {
  if (!confirm("Delete this product?")) return;

 await fetch(`/api/products/delete?id=${id}`, {
  method: "DELETE",
  headers: {
      Authorization: `Bearer ${token}`
  },
});

  const data = await res.json();

  if (data.success) {
    alert("Product deleted");
    loadProducts(); // recargar tabla
  } else {
    alert("Error deleting product");
  }
}

loadProducts();