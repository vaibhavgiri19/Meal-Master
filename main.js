import appkey from './env.js';  

// Select elements
const searchForm = document.querySelector('form');
const searchResultDiv = document.querySelector('.search-result');
const container = document.querySelector('.container');
const logoutBtn = document.getElementById('logout-btn');
let searchQuery = '';
let APP_ID = '6ddf344c';  // Use your actual APP_ID

// Handle search form submit
searchForm.addEventListener('submit', (e) => {
    e.preventDefault();
    searchQuery = e.target.querySelector('input').value.trim();
    
    if (searchQuery) {
        fetchApi();
    } else {
        console.log("Empty search query");
    }
});

// Fetch recipes from API
async function fetchApi() {
    try {
        const url = `https://api.edamam.com/api/recipes/v2?type=public&q=${searchQuery}&app_id=${APP_ID}&app_key=${appkey}&ingr=0-8`;

        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        if (data.hits.length === 0) {
            searchResultDiv.innerHTML = `<p>No recipes found. Please try another search.</p>`;
        } else {
            generateHTML(data.hits);
        }
    } catch (error) {
        console.error("Error fetching API:", error);
        searchResultDiv.innerHTML = `<p>There was an error fetching the recipes. Please try again later.</p>`;
    }
}

// Generate HTML to display the search results
function generateHTML(results) {
    container.classList.remove('initial');
    let generatedHTML = '';

    results.map(result => {
        const isFavorited = checkFavorite(result.recipe.uri);  // Check if this recipe is favorited
        generatedHTML += `
         <div class="item">
             <img src="${result.recipe.image}" alt="Recipe Image">
             <div class="flex-container">
                 <h1 class="title">${result.recipe.label}</h1>
                 <a class="view-button" href="${result.recipe.url}" target="_blank">View Recipe</a>
                 <button class="favorite-button" data-uri="${result.recipe.uri}">
                    ${isFavorited ? 'Remove from Favorites' : 'Add to Favorites'}
                 </button>
             </div>
             <p class="item-data">Calories: ${result.recipe.calories.toFixed(2)}</p>
             <p class="item-data">Diet Label: ${result.recipe.dietLabels.length > 0 ? result.recipe.dietLabels.join(', ') : "No Data Found"}</p>
             <p class="item-data">Health Label: ${result.recipe.healthLabels.join(', ')}</p>
         </div>
        `;
    });
    searchResultDiv.innerHTML = generatedHTML;

    // Add event listeners to favorite buttons
    document.querySelectorAll('.favorite-button').forEach(button => {
        button.addEventListener('click', handleFavoriteClick);
    });
}

// Handle click on favorite button
function handleFavoriteClick(e) {
    const recipeUri = e.target.getAttribute('data-uri');
    const favorites = JSON.parse(localStorage.getItem('favorites')) || [];

    if (favorites.includes(recipeUri)) {
        // Remove from favorites
        const updatedFavorites = favorites.filter(uri => uri !== recipeUri);
        localStorage.setItem('favorites', JSON.stringify(updatedFavorites));
        e.target.textContent = 'Add to Favorites';
    } else {
        // Add to favorites
        favorites.push(recipeUri);
        localStorage.setItem('favorites', JSON.stringify(favorites));
        e.target.textContent = 'Remove from Favorites';
    }
}

// Check if a recipe is favorited
function checkFavorite(uri) {
    const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    return favorites.includes(uri);
}

// Logout functionality
logoutBtn.addEventListener('click', () => {
    // Clear session storage or localStorage if using them
    localStorage.removeItem('loggedInUser');  // Example
    alert('You have successfully logged out.');
    window.location.href = 'login.html'; // Redirect to login page
});
