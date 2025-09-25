// Function to set active menu item based on current page
function setActiveMenuItem() {
  // Get current page URL
  const currentPage = window.location.pathname.split("/").pop();

  // If we're on the root, set dashboard as active
  if (currentPage === "" || currentPage === "index.html") {
    document.querySelectorAll(".menu-item").forEach((item) => {
      item.classList.remove("active");
      if (item.querySelector("a").getAttribute("href") === "index.html") {
        item.classList.add("active");
      }
    });
    return;
  }

  // Find and activate the menu item that matches the current page
  document.querySelectorAll(".menu-item").forEach((item) => {
    const link = item.querySelector("a");
    if (link.getAttribute("href") === currentPage) {
      item.classList.add("active");
    } else {
      item.classList.remove("active");
    }
  });
}

// Call the function when the page loads
document.addEventListener("DOMContentLoaded", setActiveMenuItem);

// Also add click handlers to update active state when navigating
document.querySelectorAll(".menu-item a").forEach((link) => {
  link.addEventListener("click", function () {
    document.querySelectorAll(".menu-item").forEach((item) => {
      item.classList.remove("active");
    });
    this.parentElement.classList.add("active");
  });
});

// Modal functions
function openModal() {
  document.getElementById("addProductModal").style.display = "flex";
}

function closeModal() {
  document.getElementById("addProductModal").style.display = "none";
}

// Close modal when clicking outside
window.onclick = function (event) {
  const modal = document.getElementById("addProductModal");
  if (event.target === modal) {
    closeModal();
  }
};

// Menu item activation
const menuItems = document.querySelectorAll(".menu-item");
menuItems.forEach((item) => {
  item.addEventListener("click", function () {
    menuItems.forEach((i) => i.classList.remove("active"));
    this.classList.add("active");
  });
});

// Tab functionality
const settingsTabs = document.querySelectorAll(".settings-tab");
const settingsContents = document.querySelectorAll(".settings-content");

settingsTabs.forEach((tab) => {
  tab.addEventListener("click", function () {
    const tabId = this.getAttribute("data-tab");

    // Update active tab
    settingsTabs.forEach((t) => t.classList.remove("active"));
    this.classList.add("active");

    // Show corresponding content
    settingsContents.forEach((content) => {
      content.classList.remove("active");
      if (content.id === `${tabId}-settings`) {
        content.classList.add("active");
      }
    });
  });
});

// Toggle between grid and table view
const gridViewBtn = document.getElementById("gridViewBtn");
const tableViewBtn = document.getElementById("tableViewBtn");
const productsGrid = document.getElementById("productsGrid");
const productsTable = document.getElementById("productsTable");

gridViewBtn.addEventListener("click", () => {
  productsGrid.style.display = "grid";
  productsTable.style.display = "none";
  gridViewBtn.classList.add("active");
  tableViewBtn.classList.remove("active");
});

tableViewBtn.addEventListener("click", () => {
  productsGrid.style.display = "none";
  productsTable.style.display = "block";
  tableViewBtn.classList.add("active");
  gridViewBtn.classList.remove("active");
});

// Set today's date as default for the date field
document.addEventListener("DOMContentLoaded", function () {
  const today = new Date();
  const yyyy = today.getFullYear();
  let mm = today.getMonth() + 1;
  let dd = today.getDate();

  if (dd < 10) dd = "0" + dd;
  if (mm < 10) mm = "0" + mm;

  const formattedToday = `${yyyy}-${mm}-${dd}`;
  document.getElementById("date").value = formattedToday;
});

// Set up sales chart
const salesCtx = document.getElementById("salesChart").getContext("2d");
const salesChart = new Chart(salesCtx, {
  type: "line",
  data: {
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    datasets: [
      {
        label: "Sales ($)",
        data: [3200, 4500, 3800, 5200, 6100, 7500, 6900],
        borderColor: "#4361ee",
        backgroundColor: "rgba(67, 97, 238, 0.1)",
        tension: 0.4,
        fill: true,
      },
    ],
  },
  options: {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          drawBorder: false,
        },
      },
      x: {
        grid: {
          display: false,
        },
      },
    },
  },
});

// Set up category chart
const categoryCtx = document.getElementById("categoryChart").getContext("2d");
const categoryChart = new Chart(categoryCtx, {
  type: "doughnut",
  data: {
    labels: ["Electronics", "Sports", "Home Appliances", "Fashion"],
    datasets: [
      {
        data: [45, 25, 20, 10],
        backgroundColor: ["#4361ee", "#4cc9f0", "#f8961e", "#f72585"],
        borderWidth: 0,
      },
    ],
  },
  options: {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom",
      },
    },
  },
});

// Set default date range to this week
document.addEventListener("DOMContentLoaded", function () {
  document.getElementById("date-range").value = "this-week";
});

// Set default date range to this week
document.addEventListener("DOMContentLoaded", function () {
  document.getElementById("date-range").value = "this-week";
});

// Set today's date as default for the date field
document.addEventListener("DOMContentLoaded", function () {
  const today = new Date();
  const yyyy = today.getFullYear();
  let mm = today.getMonth() + 1;
  let dd = today.getDate();

  if (dd < 10) dd = "0" + dd;
  if (mm < 10) mm = "0" + mm;

  const formattedToday = `${yyyy}-${mm}-${dd}`;
  document.getElementById("date").value = formattedToday;
});

// Tab functionality
const tabs = document.querySelectorAll(".tab");
tabs.forEach((tab) => {
  tab.addEventListener("click", function () {
    tabs.forEach((t) => t.classList.remove("active"));
    this.classList.add("active");
  });
});

// Calculate total based on quantity and price
const quantityInput = document.getElementById("quantity");
const priceInput = document.getElementById("price");
const discountInput = document.getElementById("discount");

function calculateTotal() {
  const quantity = parseFloat(quantityInput.value) || 0;
  const price = parseFloat(priceInput.value) || 0;
  const discount = parseFloat(discountInput.value) || 0;

  const discountAmount = (price * discount) / 100;
  const finalPrice = price - discountAmount;
  const total = quantity * finalPrice;

  // In a real application, we would display this somewhere
  console.log("Total:", total);
}

quantityInput.addEventListener("input", calculateTotal);
priceInput.addEventListener("input", calculateTotal);
discountInput.addEventListener("input", calculateTotal);

