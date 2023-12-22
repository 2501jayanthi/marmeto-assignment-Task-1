document.addEventListener('DOMContentLoaded', () => {
    const searchBar = document.getElementById('search-input');
    const gridViewButton = document.getElementById('grid-view');
    const listViewButton = document.getElementById('list-view');
    const productList = document.getElementById('product-list');

    let productsData = []; // To store fetched data

    // Fetch data from the API
    const fetchProducts = async() => {
        try {
            const response = await fetch('https://mocki.io/v1/0934df88-6bf7-41fd-9e59-4fb7b8758093');
            if (!response.ok) {
                throw new Error('Failed to fetch data from the API');
            }
            const responseData = await response.json();

            if (Array.isArray(responseData.data)) {
                productsData = responseData.data; // Store the fetched data
                renderProducts(); // Display products
            } else {
                console.error('API response data is not an array:', responseData);
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    // Function to render products in the current view (grid or list)
    const renderProducts = () => {
        productList.innerHTML = ''; // Clear existing products

        productsData.forEach((product) => {
            const productCard = createProductCard(product);
            productList.appendChild(productCard);
        });
    };

    // Function to create a product card element
    const createProductCard = (product) => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';

        const productImage = document.createElement('img');
        productImage.src = product.product_image;

        
        const productBadge = document.createElement('h2');
        productBadge.className = 'badge';
        productBadge.innerText = product.product_badge;
        const productTitle = document.createElement('h3');
        productTitle.innerText = product.product_title.toUpperCase();



        const productVariants = document.createElement('div');

        productVariants.className = 'product-variants';
        product.product_variants.forEach((variant) => {
            const variantItem = document.createElement('h6');
            for (const key in variant) {
                if (variant.hasOwnProperty(key)) {
                    variantItem.innerText = ` ${variant[key]} \n \n`.toUpperCase();
                }
            }
            productVariants.appendChild(variantItem);
        });

        productCard.appendChild(productImage);
        productCard.appendChild(productTitle);
        productCard.appendChild(productBadge);
        productCard.appendChild(productVariants);

        return productCard;
    };

    // Function to handle search
    const handleSearch = () => {
        const searchValue = searchBar.value.toLowerCase();
        productList.innerHTML = ''; // Clear existing products

        productsData.forEach((product) => {
            if (isMatch(product, searchValue)) {
                const productCard = createProductCard(product);
                highlightSearchResult(productCard, searchValue);
                productList.appendChild(productCard);
            }
        });
    };

    const isMatch = (product, searchValue) => {
        // Check if the product title or any variant matches the search value
        return (
            product.product_title.toLowerCase().includes(searchValue) ||
            product.product_variants.some((variant) => {
                for (const key in variant) {
                    if (variant.hasOwnProperty(key) && variant[key].toLowerCase().includes(searchValue)) {
                        return true;
                    }
                }
                return false;
            })
        );
    };
    
    // Function to apply highlighting to matching text in a product card
    const highlightSearchResult = (productCard, searchValue) => {
        const productVariants = productCard.querySelector('.product-variants');
        const variantItems = productVariants.querySelectorAll('h6');
    
        variantItems.forEach((variantItem) => {
            const variantText = variantItem.innerText.toLowerCase();
            const index = variantText.indexOf(searchValue);
    
            if (index !== -1) {
                const highlightedText =
                    variantText.substring(0, index) +
                    `<span class="highlight">${variantText.substring(index, index + searchValue.length)}</span>` +
                    variantText.substring(index + searchValue.length);
                variantItem.innerHTML = highlightedText;
            }
        });
    };

    // Function to apply highlighting to matching text in a product card
    

    // Function to switch to grid view
    const switchToGridView = () => {
        productList.classList.remove('list-view');
    };

    // Function to switch to list view
    const switchToListView = () => {
        productList.classList.add('list-view');
    };

    // Add event listeners for search and layout switch
    searchBar.addEventListener('input', handleSearch);
    gridViewButton.addEventListener('click', switchToGridView);
    listViewButton.addEventListener('click', switchToListView);

    // Initial fetch of products
    fetchProducts();
});