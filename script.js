// ================== Featured Products Auto-Rotation with Zoom Animation ==================

// Featured products for homepage rotation
const allProducts = [
  { image: "images/headphones.jpg", name: "Wireless Headphones", price: "$89.99" },
  { image: "images/watch.jpg", name: "Smart Watch", price: "$199.99" },
  { image: "images/speaker.jpg", name: "Bluetooth Speaker", price: "$49.99" },
  { image: "images/laptop.jpeg", name: "Laptop", price: "$899.99" },
  { image: "images/tablet.jpeg", name: "Tablet", price: "$299.99" },
  { image: "images/keyboard.jpeg", name: "Mechanical Keyboard", price: "$79.99" },
  { image: "images/mouse.jpeg", name: "Wireless Mouse", price: "$39.99" },
];

let currentIndex = 0;

// Function to update homepage featured products
function updateFeaturedProducts() {
  const container = document.querySelector(".featured-products");
  if (!container) return; // Stop if container not found (i.e., products.html)

  container.innerHTML = ""; // Clear old products

  // Show 3 products at a time
  for (let i = 0; i < 3; i++) {
    const product = allProducts[(currentIndex + i) % allProducts.length];

    const card = document.createElement("div");
    card.className = "product-card";

    card.innerHTML = `
      <img src="${product.image}" alt="${product.name}" />
      <h3>${product.name}</h3>
      <p class="price">${product.price}</p>
      <button>Add to Cart</button>
    `;

    container.appendChild(card);
  }

  currentIndex = (currentIndex + 3) % allProducts.length;

  animateProductCards();
}

// Function to animate products on scroll/appearance
function animateProductCards() {
  const cards = document.querySelectorAll(".product-card");

  const observer = new IntersectionObserver(
    (entries, observerInstance) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("animate-zoom");
          observerInstance.unobserve(entry.target); // Stop observing after animation
        }
      });
    },
    { threshold: 0.2 }
  );

  cards.forEach(card => {
    card.classList.remove("animate-zoom"); // Reset animation for reappearance
    observer.observe(card);
  });
}

// Run on DOM load
window.addEventListener("DOMContentLoaded", () => {
  const featuredContainer = document.querySelector(".featured-products");
  if (featuredContainer) {
    updateFeaturedProducts();              // Initial display
    setInterval(updateFeaturedProducts, 10000); // Rotate every 10 seconds
  }
});

function addToCart(product) {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    // Check if item already exists
    let existing = cart.find(item => item.name === product.name);

    if (existing) {
        existing.quantity += 1; // increase quantity
    } else {
        product.quantity = 1; // first time added
        cart.push(product);
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    alert("Added to cart!");

}
function updateCartCount() {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const count = cart.reduce((total, item) => total + item.quantity, 0);
  document.getElementById("cartCount").textContent = count;
}

updateCartCount();
