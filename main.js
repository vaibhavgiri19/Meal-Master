import appkey from './env.js';  // Ensure env.js exports a valid appkey

const searchForm = document.querySelector('form');
const searchResultDiv = document.querySelector('.search-result');
const container = document.querySelector('.container');
let searchQuery = '';
let APP_ID = '6ddf344c';  // Double-check the APP_ID if necessary

searchForm.addEventListener('submit', (e) => {
    e.preventDefault();
    searchQuery = e.target.querySelector('input').value.trim();

    // Log the search query to check if it's working
    console.log("Search Query:", searchQuery);
    
    if (searchQuery) {
        fetchApi();
    } else {
        console.log("Empty search query");
    }
});

async function fetchApi() {
    try {
        const url = `https://api.edamam.com/api/recipes/v2?type=public&q=${searchQuery}&app_id=${APP_ID}&app_key=${appkey}&ingr=0-8`;

        // Log the API URL to check if it's correctly formed
        console.log("Fetching API:", url);

        const response = await fetch(url);

        // Check if the response is OK
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        
        // Log the fetched data to see if we get the right response
        console.log("API Data:", data);

        if (data.hits.length === 0) {
            console.log("No results found");
            searchResultDiv.innerHTML = `<p>No recipes found. Please try another search.</p>`;
        } else {
            generateHTML(data.hits);
        }

    } catch (error) {
        console.error("Error fetching API:", error);
        searchResultDiv.innerHTML = `<p>There was an error fetching the recipes. Please try again later.</p>`;
    }
}

function generateHTML(results) {
    container.classList.remove('initial');
    let generatedHTML = '';

    results.map(result => {
        generatedHTML += `
         <div class="item">
             <img src="${result.recipe.image}" alt="Recipe Image">
             <div class="flex-container">
                 <h1 class="title">${result.recipe.label}</h1>
                 <a class="view-button" href="${result.recipe.url}" target="_blank">View Recipe</a>
             </div>
             <p class="item-data">Calories: ${result.recipe.calories.toFixed(2)}</p>
             <p class="item-data">Diet Label: ${result.recipe.dietLabels.length > 0 ? result.recipe.dietLabels.join(', ') : "No Data Found"}</p>
             <p class="item-data">Health Label: ${result.recipe.healthLabels.join(', ')}</p>
         </div>
        `;
    });
    searchResultDiv.innerHTML = generatedHTML;
}
