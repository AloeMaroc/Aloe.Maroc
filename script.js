/* ======================= Cart Functions ======================= */

function getCart() {
  return JSON.parse(localStorage.getItem("cart")) || [];
}

function saveCart(cart) {
  localStorage.setItem("cart", JSON.stringify(cart));
  updateCartCount();
}

function updateCartCount() {
  const cart = getCart();
  const count = cart.reduce((total, item) => total + item.quantity, 0);
  const cartCountEl = document.getElementById("cartCount");
  if (cartCountEl) cartCountEl.textContent = count;
}

function addToCart(product) {
  let cart = getCart();
  let existing = cart.find(item => 
    item.name === product.name && 
    item.size === product.size &&
    item.color === product.color
  );

  if (existing) {
    existing.quantity += product.quantity || 1;
  } else {
    product.quantity = product.quantity || 1;
    cart.push(product);
  }

  saveCart(cart);
  alert("Produit ajouté au panier !");
}

/* ======================= Checkout Summary ======================= */
function loadCartSummary() {
  const box = document.getElementById("summary-items");
  const totalBox = document.getElementById("summary-total");
  const cartDataInput = document.getElementById("cartData");

  if (!box || !totalBox || !cartDataInput) return;

  let cart = getCart();
  box.innerHTML = "";
  let total = 0;
  let cartText = "";

  cart.forEach(item => {
    let price = item.price * item.quantity;
    total += price;

    box.innerHTML += `
      <div class="summary-item">
        <img src="${item.image}" class="summary-img">
        <div class="summary-info">
          <span class="summary-title">${item.name}</span>
          <span class="summary-qty">Quantité: ${item.quantity}</span>
          <span class="summary-qty">Taille: ${item.size || '-'}</span>
          <span class="summary-qty">Couleur: ${item.color || '-'}</span>
        </div>
        <span class="summary-price">${price} MAD</span>
      </div>
    `;

    cartText += `${item.name} x${item.quantity} - Taille: ${item.size || '-'} - Couleur: ${item.color || '-'} - ${price} MAD\n`;
  });

  totalBox.innerHTML = `Total: ${total} MAD`;
  cartDataInput.value = cartText + `\nTOTAL: ${total} MAD`;
}

/* ======================= Checkout Form Validation ======================= */
const checkoutForm = document.getElementById("checkoutForm");
if (checkoutForm) {
  checkoutForm.addEventListener("submit", function(e) {
    const agree = document.getElementById("agree");
    if (!agree.checked) {
      e.preventDefault();
      alert("Vous devez accepter les Terms & Conditions pour continuer.");
      return;
    }

    // Optional: simple phone/email validation
    const email = document.getElementById("email");
    const phone = document.getElementById("phone");
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phonePattern = /^0\d{9}$/; // Moroccan format 06xxxxxxxx

    if (!emailPattern.test(email.value)) {
      e.preventDefault();
      alert("Veuillez entrer un email valide.");
      return;
    }

    if (!phonePattern.test(phone.value)) {
      e.preventDefault();
      alert("Veuillez entrer un numéro de téléphone valide (06xxxxxxxx).");
      return;
    }
  });

  loadCartSummary();
}

/* ======================= City Dropdown ======================= */
const cities = [
  "Casablanca","Rabat","Tanger","Marrakech","Fès","Agadir","Salé","Meknès","Oujda",
  "Kénitra","Tétouan","Temara","Safi","Mohammedia","Khouribga","Béni Mellal",
  "El Jadida","Nador","Berrechid","Taza","Settat","Larache","Ksar El Kebir",
  "Guelmim","Al Hoceima","Dakhla","Errachidia","Ouarzazate","Berkane","Taourirt",
  "Fnideq","Martil","Chefchaouen","Azrou","Ifrane","Midelt","Taroudant","Tiflet",
  "Youssoufia","Ouazzane","Jerada","Boujdour","Smara","Laâyoune","Tan-Tan",
  "El Aioun","Sidi Slimane","Sidi Kacem","Sidi Bennour","Chichaoua","Essaouira",
  "Khénifra","Tinghir","Zagora"
];

const cityInput = document.getElementById("city-input");
const cityList = document.getElementById("city-list");

if (cityInput && cityList) {
  cityInput.addEventListener("focus", () => {
    cityList.style.display = "block";
    renderCities(cities);
  });

  cityInput.addEventListener("input", () => {
    const value = cityInput.value.toLowerCase();
    const filtered = cities.filter(c => c.toLowerCase().includes(value));
    renderCities(filtered);
  });

  document.addEventListener("click", e => {
    if (!cityInput.contains(e.target) && !cityList.contains(e.target)) {
      cityList.style.display = "none";
    }
  });

  function renderCities(list) {
    cityList.innerHTML = "";
    list.forEach(city => {
      const div = document.createElement("div");
      div.className = "city-item";
      div.textContent = city;
      div.onclick = () => {
        cityInput.value = city;
        cityList.style.display = "none";
      };
      cityList.appendChild(div);
    });
  }
}

/* ======================= Featured Products Rotation ======================= */
const allProducts = [
  { image: "images/headphones.jpg", name: "Wireless Headphones", price: 89.99 },
  { image: "images/watch.jpg", name: "Smart Watch", price: 199.99 },
  { image: "images/speaker.jpg", name: "Bluetooth Speaker", price: 49.99 },
  { image: "images/laptop.jpeg", name: "Laptop", price: 899.99 },
  { image: "images/tablet.jpeg", name: "Tablet", price: 299.99 },
  { image: "images/keyboard.jpeg", name: "Mechanical Keyboard", price: 79.99 },
  { image: "images/mouse.jpeg", name: "Wireless Mouse", price: 39.99 }
];

let currentIndex = 0;

function updateFeaturedProducts() {
  const container = document.querySelector(".featured-products");
  if (!container) return;

  container.innerHTML = "";

  for (let i = 0; i < 3; i++) {
    const product = allProducts[(currentIndex + i) % allProducts.length];
    const card = document.createElement("div");
    card.className = "product-card";
    card.innerHTML = `
      <img src="${product.image}" alt="${product.name}">
      <h3>${product.name}</h3>
      <p class="price">${product.price} MAD</p>
      <button onclick='addToCart(${JSON.stringify(product)})'>Ajouter au panier</button>
    `;
    container.appendChild(card);
  }

  currentIndex = (currentIndex + 3) % allProducts.length;
  animateProductCards();
}

function animateProductCards() {
  const cards = document.querySelectorAll(".product-card");
  const observer = new IntersectionObserver((entries, observerInstance) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("animate-zoom");
        observerInstance.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });

  cards.forEach(card => {
    card.classList.remove("animate-zoom");
    observer.observe(card);
  });
}

/* ======================= DOMContentLoaded ======================= */
window.addEventListener("DOMContentLoaded", () => {
  updateCartCount();

  const featuredContainer = document.querySelector(".featured-products");
  if (featuredContainer) {
    updateFeaturedProducts();
    setInterval(updateFeaturedProducts, 10000);
  }
});
