const urlApi = "./data/products.json";

fetch(urlApi)
	.then((response) => response.json())
	.then((products) => {
		window.products = products;
		showProducts(products);
		setupFilters();
	})
	.catch((error) => console.error(error));

let products = [];

// Exibir as informações dos produtos na página
function showProducts(products) {
	let productsDiv = document.getElementById("products-container");
	productsDiv.innerHTML = ""; // limpar os produtos exibidos anteriormente
	let productsHTML = products.map((product) => {
		const priceWithFactor = (product.price * 5.5).toFixed(2);

		// Criar o elemento HTML para exibir as informações do produto
		return `
      <div class="product" data-id="${product.id}" data-name="${product.name}" data-brand="${product.brand}" data-type="${product.product_type}">
        <figure class="product-figure">
          <img src="${product.image_link}" width="215" height="215" alt="" onerror="javascript:this.src='img/unavailable.png'">
        </figure>
        <div class="product-description">
          <h1 class="product-name">${product.name}</h1>
          <div class="product-brands">
            <span class="product-brand background-brand">${product.brand}</span>
            <span class="product-brand background-price">R$ ${priceWithFactor}</span>
          </div>
        </div>
      </div>
    `;
	});
	productsDiv.innerHTML = productsHTML.join(""); // juntar os elementos HTML e adicioná-los à página

	// adicionar um evento de clique a cada produto
	const productElements = document.querySelectorAll(".product");
	productElements.forEach((product) => {
		product.addEventListener("click", () => {
			const productId = product.getAttribute("data-id");
			showProductDetails(productId);
		});
	});
}

function showProductDetails(productId) {
	const product = window.products.find((product) => product.id == productId);
	const priceWithFactor = (product.price * 5.5).toFixed(2);
	// cria um elemento modal
	const modal = document.createElement("div");
	modal.classList.add("modal");

	// cria o conteúdo do modal
	const content = document.createElement("div");
	content.classList.add("modal-content");
	content.innerHTML = `
  <span class="close">&times;</span>
  <figure class="product-figure">
    <img
      src="${product.image_link}"
      width="215"
      height="215"
      alt=""
      onerror="javascript:this.src='img/unavailable.png'" />
  </figure>
  <div class="product-description">
    <h1 class="product-name">${product.name}</h1>
    <div class="product-brands">
      <span class="product-brand background-brand">${product.brand}</span>
      <span class="product-brand background-price">R$ ${priceWithFactor}</span>
    </div>
  </div>
  
  <div class="product-details">
    <div class="details-row">
      <div>Brand</div>
      <div class="details-bar">
        <div class="details-bar-bg" style="width= 250">${product.brand}</div>
      </div>
    </div>
    <div class="details-row">
      <div>Price</div>
      <div class="details-bar">
        <div class="details-bar-bg" style="width= 250">R$ ${product.price}</div>
      </div>
    </div>
    <div class="details-row">
      <div>Rating</div>
      <div class="details-bar">
        <div class="details-bar-bg" style="width= 250">${product.rating}</div>
      </div>
    </div>
    <div class="details-row">
      <div>Category</div>
      <div class="details-bar">
        <div class="details-bar-bg" style="width= 250">${product.category}</div>
      </div>
    </div>
    <div class="details-row">
      <div>Product_type</div>
      <div class="details-bar">
        <div class="details-bar-bg" style="width= 250">
          ${product.product_type}
        </div>
      </div>
    </div>
  </div>  
  `;

	const closeBtn = content.querySelector(".close");
	closeBtn.addEventListener("click", () => {
		modal.remove();
	});

	// adiciona o conteúdo ao modal
	modal.appendChild(content);

	// adiciona o modal à página
	document.body.appendChild(modal);

	// exibe o modal quando a função é chamada
	modal.style.display = "block";
}

const filterBrandSelect = document.getElementById("filter-brand");
const filterTypeSelect = document.getElementById("filter-type");
const filterNameInput = document.getElementById("filter-name");
const sortTypeSelect = document.getElementById("sort-type");

function setupFilters() {
	//MARCA
	// criar uma lista de marcas sem duplicatas
	const brands = [...new Set(window.products.map((product) => product.brand))];
	// adicionar as opções de marca ao elemento HTML do filtro de marca
	brands.forEach((brand) => {
		const option = document.createElement("option");
		option.textContent = brand;
		filterBrandSelect.appendChild(option);
	});

	// adicionar um evento de mudança ao filtro de marca
	filterBrandSelect.addEventListener("change", () => {
		applyFilters();
	});

	//TIPOS
	// criar uma lista de tipos sem duplicatas
	const categories = [
		...new Set(window.products.map((product) => product.product_type)),
	];
	// adicionar as opções de marca ao elemento HTML do filtro de marca
	categories.forEach((product_type) => {
		const option = document.createElement("option");
		option.textContent = product_type;
		filterTypeSelect.appendChild(option);
	});

	// adicionar um evento de mudança ao filtro de tipo
	filterTypeSelect.addEventListener("change", () => {
		applyFilters();
	});

	//NOME
	// adicionar um evento de mudança ao campo de entrada de nome
	filterNameInput.addEventListener("change", () => {
		applyFilters();
	});

	// adicionar um evento de mudança ao filtro de ordenação
	sortTypeSelect.addEventListener("change", () => {
		applyFilters();
	});

	function applyFilters() {
		let filteredProducts = window.products;

		// aplicar filtro de marca
		if (filterBrandSelect.value !== "") {
			filteredProducts = filterProductsByBrand(
				filteredProducts,
				filterBrandSelect.value
			);
		}

		// aplicar filtro de tipo
		if (filterTypeSelect.value !== "") {
			filteredProducts = filterProductsByType(
				filteredProducts,
				filterTypeSelect.value
			);
		}

		// aplicar filtro de nome
		filteredProducts = filterProductsByName(
			filteredProducts,
			filterNameInput.value
		);

		// aplicar filtro de ordenação
		filteredProducts = sortProducts(filteredProducts, sortTypeSelect.value);

		showProducts(filteredProducts);
	}

	function sortProducts(products, sortBy) {
		switch (sortBy) {
			case "rating":
				return products.sort((a, b) => b.rating - a.rating);
			case "price-low-to-high":
				return products.sort((a, b) => a.price - b.price);
			case "price-high-to-low":
				return products.sort((a, b) => b.price - a.price);
			case "name-a-to-z":
				return products.sort((a, b) => a.name.localeCompare(b.name));
			case "name-z-to-a":
				return products.sort((a, b) => b.name.localeCompare(a.name));
			default:
				return products;
		}
	}
}

// filtrar os produtos pela marca
function filterProductsByBrand(products, brand) {
	return products.filter((product) => product.brand === brand);
}

// filtrar os produtos pelo type
function filterProductsByType(products, product_type) {
	return products.filter((product) => product.product_type === product_type);
}

// filtrar os produtos pelo nome
function filterProductsByName(products, name) {
	return products.filter((product) =>
		product.name.toLowerCase().includes(name.toLowerCase())
	);
}
