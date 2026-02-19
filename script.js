// Onrizo Shop - Static Frontend Logic
// --- Product grid, login, dashboard, cart, etc. ---

// Hardcoded demo user
const DEMO_USER = {
  username: "demo",
  password: "onrizo123",
  email: "demo@onrizo.com"
};

// Utility: get/set localStorage
function setUser(user) {
  localStorage.setItem("onrizo_user", JSON.stringify(user));
}
function getUser() {
  return JSON.parse(localStorage.getItem("onrizo_user"));
}
function clearUser() {
  localStorage.removeItem("onrizo_user");
}
function setCart(cart) {
  localStorage.setItem("onrizo_cart", JSON.stringify(cart));
}
function getCart() {
  return JSON.parse(localStorage.getItem("onrizo_cart")) || [];
}
function clearCart() {
  localStorage.removeItem("onrizo_cart");
}

// --- Product Grid Loader ---
async function loadProducts() {
  const grid = document.getElementById("products-grid");
  if (!grid) return;
  const res = await fetch("products.json");
  const products = await res.json();
  grid.innerHTML = products.map(prod => `
    <div class="product-card">
      <img src="${prod.image}" alt="${prod.title}">
      <h3>${prod.title}</h3>
      <div class="price">$${prod.price.toFixed(2)}</div>
      <button class="btn-main" onclick="addToCart(${prod.id})">Add to Cart</button>
    </div>
  `).join("");
}
window.addEventListener("DOMContentLoaded", loadProducts);

// --- Add to Cart ---
window.addToCart = function(id) {
  fetch("products.json").then(r => r.json()).then(products => {
    const prod = products.find(p => p.id === id);
    if (!prod) return;
    let cart = getCart();
    cart.push(prod);
    setCart(cart);
    alert("Added to cart!");
  });
};

// --- Login Logic ---
const loginForm = document.getElementById("login-form");
if (loginForm) {
  loginForm.addEventListener("submit", function(e) {
    e.preventDefault();
    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value;
    if (username === DEMO_USER.username && password === DEMO_USER.password) {
      setUser({ username: DEMO_USER.username, email: DEMO_USER.email });
      window.location.href = "dashboard.html";
    } else {
      document.getElementById("login-error").textContent = "Invalid username or password.";
    }
  });
}

// --- Dashboard Logic ---
if (window.location.pathname.endsWith("dashboard.html")) {
  const user = getUser();
  if (!user) {
    window.location.href = "login.html";
  } else {
    document.getElementById("dashboard-username").textContent = user.username;
    document.getElementById("user-info-username").textContent = user.username;
    document.getElementById("user-info-email").textContent = user.email;
    // Cart
    function renderCart() {
      const cart = getCart();
      const list = document.getElementById("cart-list");
      if (cart.length === 0) {
        list.innerHTML = "<li>Your cart is empty.</li>";
      } else {
        list.innerHTML = cart.map(item => `<li>${item.title} - $${item.price.toFixed(2)}</li>`).join("");
      }
    }
    renderCart();
    document.getElementById("clear-cart").onclick = function() {
      clearCart();
      renderCart();
    };
  }
}

// --- Placeholder Register Button ---
document.querySelectorAll('.btn-placeholder').forEach(btn => {
  btn.addEventListener('click', e => {
    e.preventDefault();
    alert('Registration is simulated in this demo.');
  });
});
