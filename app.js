const productsContainer = document.getElementById('products-container');
const pagination = document.getElementById('pagination');

const productsPerPage = 8;

fetch('products.json')
  .then(res => res.json())
  .then(products => renderProducts(products));

function renderProducts(products) {
  const totalPages = Math.ceil(products.length / productsPerPage);
  const start = (currentPage - 1) * productsPerPage;
  const currentProducts = products.slice(start, start + productsPerPage);

  productsContainer.innerHTML = currentProducts.map(product => `
    <div class="col-md-3 col-sm-6 mb-4">
      <div class="card h-100">
        <img src="${product.image}" class="card-img-top" alt="${product.title}" />
        <div class="card-body d-flex flex-column justify-content-between">
          <h5 class="card-title">${product.title}</h5>
          <p class="fw-bold text-success">$${product.price}</p>
          <button class="btn btn-warning w-100">Add to Cart</button>
        </div>
      </div>
    </div>
  `).join('');

  pagination.innerHTML = Array.from({ length: totalPages }, (_, i) => `
    <li class="page-item ${currentPage === i + 1 ? 'active' : ''}">
      <button class="page-link" onclick="changePage(${i + 1})">${i + 1}</button>
    </li>
  `).join('');
}

function changePage(page) {
  currentPage = page;
  fetch('products.json').then(res => res.json()).then(renderProducts);
}




    // Global variables
    let allProducts = [];
    let currentList = [];
    const pageSize = 4;  // Change pageSize as desired
    let currentPage = 1;

    // Helper function to generate a product card
    function generateProductCard(product) {
      return `
        <div class="col-xl-3 col-lg-4 col-md-6 position-relative mb-4">
          <div class="card product-item">
            <i class="bi bi-heart-fill position-absolute liked"></i>
            <i class="bi bi-heart position-absolute like"></i>
            <img src="${product.image}" onclick="goToProductDetails(${product.id})"
                 class="card-img-top" alt="${product.title}" data-bs-toggle="tooltip"
                 data-bs-placement="top" title="Click to See Product Details" />
            <div class="card-body">
              <h6 class="card-subtitle mb-2 text-muted fw-light">${product.category}</h6>
              <h5 class="card-title">${product.title}</h5>
              <p class="card-text price">$${product.price}</p>
              <div class="text-center">
                <a class="btn btn-dark w-100" onclick="showToast()" role="button">Add To Cart</a>
              </div>
            </div>
          </div>
        </div>
      `;
    }

    // Render Featured Products for a given page
    function renderFeaturedPage(page, productList) {
      const container = document.getElementById("featured-products");
      // Preserve the section header
      container.innerHTML = `
        <div class="section-header">
          <h2>Featured Products</h2>
          <a href="#" class="view-all text-decoration-none">View All</a>
        </div>`;
      const startIndex = (page - 1) * pageSize;
      const endIndex = startIndex + pageSize;
      let html = '<div class="row">';
      productList.slice(startIndex, endIndex).forEach(product => {
        html += generateProductCard(product);
      });
      html += '</div>';
      container.innerHTML += html;
    }

    // Update Bootstrap pagination controls
    function updatePaginationControls(totalProducts) {
      const totalPages = Math.ceil(totalProducts / pageSize);
      const paginationContainer = document.getElementById("pagination");
      let html = "";
      html += `<li class="page-item ${currentPage === 1 ? "disabled" : ""}">
                 <a class="page-link" href="#" data-page="${currentPage - 1}">Previous</a>
               </li>`;
      for (let i = 1; i <= totalPages; i++) {
        html += `<li class="page-item ${currentPage === i ? "active" : ""}">
                   <a class="page-link" href="#" data-page="${i}">${i}</a>
                 </li>`;
      }
      html += `<li class="page-item ${currentPage === totalPages ? "disabled" : ""}">
                 <a class="page-link" href="#" data-page="${currentPage + 1}">Next</a>
               </li>`;
      paginationContainer.innerHTML = html;

      // Attach event listeners to pagination links
      document.querySelectorAll("#pagination a").forEach(link => {
        link.addEventListener("click", function (event) {
          event.preventDefault();
          const selectedPage = Number(this.getAttribute("data-page"));
          if (selectedPage >= 1 && selectedPage <= totalPages) {
            currentPage = selectedPage;
            renderFeaturedPage(currentPage, currentList);
            updatePaginationControls(currentList.length);
          }
        });
      });
    }

    // Render products into a container (for single-category sections)
    function renderProducts(containerId, products) {
      const container = document.getElementById(containerId);
      let html = '<div class="row">';
      products.forEach(product => {
        html += generateProductCard(product);
      });
      html += '</div>';
      container.innerHTML += html;
    }

    // Fetch products from API and initialize pagination and other sections
    fetch("products.json")
      .then(response => response.json())
      .then(data => {
        allProducts = data;
        currentList = data;
        currentPage = 1;
        renderFeaturedPage(currentPage, currentList);
        updatePaginationControls(currentList.length);

        // Render Spring and Summer Collections
        const spring = data.filter(p => p.category === "women's clothing");
        renderProducts("spring-collection", spring);
        const summer = data.filter(p => p.category === "electronics");
        renderProducts("summer-collection", summer);
      })
      .catch(error => console.error("Error fetching products:", error));

    // Search form event listener
    document.querySelector('form.search-form').addEventListener('submit', function (event) {
      event.preventDefault();
      const query = document.getElementById("searchInput").value.trim().toLowerCase();
      const filteredProducts = allProducts.filter(product =>
        product.title.toLowerCase().includes(query)
      );
      currentList = filteredProducts;
      currentPage = 1;
      renderFeaturedPage(currentPage, currentList);
      updatePaginationControls(currentList.length);
    });

    // Redirect to product details page
    function goToProductDetails(productId) {
      window.location.href = "product.html?id=" + productId;
    }
    // Show toast notification
    function showToast() {
      const toastEl = document.querySelector(".toast");
      const toast = new bootstrap.Toast(toastEl);
      toast.show();
    }