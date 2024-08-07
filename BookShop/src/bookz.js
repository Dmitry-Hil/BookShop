const btnCategory = document.querySelectorAll('.btn-category'); 
const loadMore = document.querySelector('.load_more'); 
let resultItog = []; 
let countBuy = 0; 
let buttonBuy = document.getElementsByClassName('buy'); 

const apiKey = 'AIzaSyDG3eXyKdcN4sQtHWCSRWeyKrrlTO_75F0';

let currentIndex = 0;
const maxResults = 6;
let selectedCategories = '';

document.addEventListener("DOMContentLoaded", function() {
    var categoryItems = document.querySelectorAll(".btn-category");

    categoryItems.forEach(function(item) {
        item.onclick = function(event) {
            getCategories(event);
        }
    });

    loadCartFromLocalStorage();
    updateCartCount();
});

function getCategories(event) {
    selectedCategories = event.currentTarget.textContent;
    console.log(selectedCategories);
    currentIndex = 0;
    fetchBooks(selectedCategories);
}

async function fetchBooks(categories) {
    const url = `https://www.googleapis.com/books/v1/volumes?q=subject:${categories}&key=${apiKey}&maxResults=${maxResults}&startIndex=${currentIndex}`;

    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('Ошибка сети: ' + response.statusText);
        }
        const data = await response.json();

        if (currentIndex === 0) {
            document.querySelector('.shelf_of_books').innerHTML = ''; 
        }

        if (data.items) {
            data.items.forEach(item => {
                const title = item.volumeInfo.title || 'Без названия';
                const authors = item.volumeInfo.authors ? item.volumeInfo.authors.join(', ') : 'Без автора';
                const imageUrl = item.volumeInfo.imageLinks ? item.volumeInfo.imageLinks.thumbnail : 'Изображение отсутствует';
                const averageRating = item.volumeInfo.averageRating ? item.volumeInfo.averageRating : 0;
                const description = item.volumeInfo.description || 'Описание отсутствует';

                const saleInfo = item.saleInfo;
                const price = saleInfo.saleability === 'FOR_SALE' && saleInfo.retailPrice ?
                    `${saleInfo.retailPrice.amount} ${saleInfo.retailPrice.currencyCode}` :
                    'Цена недоступна';

                const bookElement = document.createElement('div');
                bookElement.classList.add('book');

                const bookElementImage = document.createElement('div');
                const bookElementParameters = document.createElement('div');
                bookElementImage.classList.add('bookElementImage');
                bookElementParameters.classList.add('bookElementParameters');

                const imageElement = document.createElement('img');
                imageElement.src = imageUrl;
                bookElementImage.appendChild(imageElement);

                const titleElement = document.createElement('h3');
                titleElement.textContent = title;
                bookElementParameters.appendChild(titleElement);

                const authorsElement = document.createElement('p');
                authorsElement.textContent = `Автор(ы): ${authors}`;
                bookElementParameters.appendChild(authorsElement);

                const ratingElement = document.createElement('div');
                ratingElement.classList.add('rating');
                ratingElement.innerHTML = getStars(averageRating);
                bookElementParameters.appendChild(ratingElement);

                const priceElement = document.createElement('p');
                priceElement.textContent = `Цена: ${price}`;
                bookElementParameters.appendChild(priceElement);

                const descriptionElement = document.createElement('p');
                bookElementParameters.appendChild(descriptionElement);

                function truncateDescription(description, maxLength) {
                    if (description.length > maxLength) {
                        return description.substring(0, maxLength) + '...';
                    }
                    return description;
                }
                if (typeof description === 'string') {
                    const truncatedDescription = truncateDescription(description, 100);
                    descriptionElement.textContent = `Описание: ${truncatedDescription}`;
                } else {
                    console.error('Описание должно быть строкой');
                    return;
                }

                const buyButton = document.createElement('button');
                buyButton.classList.add('buy');
                buyButton.textContent = 'Buy now';

                const cartBooks = JSON.parse(localStorage.getItem('cartBooks')) || [];
                const inCart = cartBooks.find(book => book.title === title);
                if (inCart) {
                    buyButton.textContent = 'In the cart';
                    buyButton.dataset.inCart = 'true';
                    countBuy++;
                }

                buyButton.addEventListener('click', () => {
                    if (buyButton.dataset.inCart === 'true') {
                        countBuy--;
                        buyButton.textContent = 'Buy now';
                        buyButton.dataset.inCart = 'false';
                        removeFromLocalStorage(title);
                    } else {
                        countBuy++;
                        buyButton.textContent = 'In the cart';
                        buyButton.dataset.inCart = 'true';
                        addToLocalStorage({title, authors, price, imageUrl});
                    }
                    updateCartCount();
                });

                bookElementParameters.appendChild(buyButton); // Перемещаем кнопку внутрь bookElementParameters

                bookElement.appendChild(bookElementImage);
                bookElement.appendChild(bookElementParameters);

                document.querySelector('.shelf_of_books').appendChild(bookElement);
            });
        }
    } catch (error) {
        console.error('Ошибка при получении данных:', error);
    }
}

function updateCartCount() {
    const cartCountElement = document.getElementById('cart-count');
    cartCountElement.textContent = countBuy;
    cartCountElement.style.display = countBuy > 0 ? 'block' : 'none';
}

function getStars(rating) {
    let stars = '';
    const fullStar = '&#9733;';
    const emptyStar = '&#9734;';

    for (let i = 1; i <= 5; i++) {
        if (i <= rating) {
            stars += fullStar;
        } else {
            stars += emptyStar;
        }
    }
    return stars;
}

loadMore.addEventListener('click', () => {
    currentIndex += maxResults;
    fetchBooks(selectedCategories);
});

function addToLocalStorage(book) {
    const cartBooks = JSON.parse(localStorage.getItem('cartBooks')) || [];
    cartBooks.push(book);
    localStorage.setItem('cartBooks', JSON.stringify(cartBooks));
}

function removeFromLocalStorage(title) {
    let cartBooks = JSON.parse(localStorage.getItem('cartBooks')) || [];
    cartBooks = cartBooks.filter(book => book.title !== title);
    localStorage.setItem('cartBooks', JSON.stringify(cartBooks));
}

function loadCartFromLocalStorage() {
    const cartBooks = JSON.parse(localStorage.getItem('cartBooks')) || [];
    countBuy = cartBooks.length;
}

document.addEventListener('DOMContentLoaded', () => {
    const firstCategoryButton = document.querySelector('.btn-category');
    if (firstCategoryButton) {
        firstCategoryButton.click();
    }
});