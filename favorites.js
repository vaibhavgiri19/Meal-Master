document.addEventListener('DOMContentLoaded', function() {
    const favoritesDiv = document.getElementById('favorites-result');
    let favorites = JSON.parse(localStorage.getItem('favorites')) || [];

    if (favorites.length === 0) {
        favoritesDiv.innerHTML = `<p>No favorite recipes saved yet.</p>`;
    } else {
        let generatedHTML = '';
        favorites.map(recipe => {
            generatedHTML += `
            <div class="item">
                <img src="${recipe.image}" alt="Recipe Image">
                <div class="flex-container">
                    <h1 class="title">${recipe.label}</h1>
                    <a class="view-button" href="${recipe.url}" target="_blank">View Recipe</a>
                    <button class="remove-fav-button" data-recipe='${recipe.label}'>Remove from Favorites</button>
                </div>
                <p class="item-data">Calories: ${recipe.calories}</p>
                <p class="item-data">Diet Label: ${recipe.dietLabels.length > 0 ? recipe.dietLabels.join(', ') : "No Data Found"}</p>
                <p class="item-data">Health Label: ${recipe.healthLabels.join(', ')}</p>
            </div>
            `;
        });
        favoritesDiv.innerHTML = generatedHTML;
        activateRemoveButtons();
    }
});

function activateRemoveButtons() {
    const removeButtons = document.querySelectorAll('.remove-fav-button');
    removeButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            const recipeLabel = e.target.getAttribute('data-recipe');
            removeFromFavorites(recipeLabel);
        });
    });
}

function removeFromFavorites(recipeLabel) {
    let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    favorites = favorites.filter(recipe => recipe.label !== recipeLabel);
    localStorage.setItem('favorites', JSON.stringify(favorites));
    location.reload();  // Refresh to update UI
}