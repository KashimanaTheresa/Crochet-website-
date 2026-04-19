// Search functionality
const searchInput = document.getElementById('searchInput');
const productItems = document.querySelectorAll('.product-item');

if (searchInput) {
    searchInput.addEventListener('input', function() {
        const searchTerm = this.value.toLowerCase().trim();
        
        productItems.forEach(item => {
            const itemText = item.textContent.toLowerCase();
            
            // Show item if search term is empty or matches the item text
            if (searchTerm === '' || itemText.includes(searchTerm)) {
                item.style.display = 'list-item';
                // Highlight the matching text
                if (searchTerm !== '') {
                    const regex = new RegExp(`(${searchTerm})`, 'gi');
                    item.innerHTML = item.textContent.replace(regex, '<mark>$1</mark>');
                } else {
                    item.innerHTML = item.textContent;
                }
            } else {
                item.style.display = 'none';
            }
        });
        
        // Show no results message if all items are hidden
        const visibleItems = Array.from(productItems).filter(item => item.style.display !== 'none');
        let noResultsMsg = document.getElementById('noResults');
        
        if (visibleItems.length === 0 && searchTerm !== '') {
            if (!noResultsMsg) {
                noResultsMsg = document.createElement('div');
                noResultsMsg.id = 'noResults';
                noResultsMsg.textContent = 'No products found';
                noResultsMsg.style.textAlign = 'center';
                noResultsMsg.style.color = '#999';
                noResultsMsg.style.padding = '20px';
                noResultsMsg.style.fontSize = '1.1rem';
                document.getElementById('productList').parentNode.appendChild(noResultsMsg);
            }
        } else if (noResultsMsg) {
            noResultsMsg.remove();
        }
    });
}

var button = document.querySelector('button')

button.onclick = function makepayment(){
    
}