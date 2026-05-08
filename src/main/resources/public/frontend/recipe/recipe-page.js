/**
 * This script defines the CRUD operations for Recipe objects in the Recipe Management Application.
 */

const BASE_URL = "http://localhost:8081"; // backend URL

let recipes = [];

// Wait for DOM to fully load before accessing elements
window.addEventListener("DOMContentLoaded", () => {

    /* 
     * TODO: Get references to various DOM elements
     * - Recipe name and instructions fields (add, update, delete)
     * - Recipe list container
     * - Admin link and logout button
     * - Search input
    */
    const addRecipeNameInput = document.getElementById("add-recipe-name-input");
    const addRecipeInstructionsInput = document.getElementById("add-recipe-instructions-input");
    const updateRecipeNameInput = document.getElementById("update-recipe-name-input");
    const updateRecipeInstructionsInput = document.getElementById("update-recipe-instructions-input");
    const deleteRecipeNameInput = document.getElementById("delete-recipe-name-input");
    const recipeList = document.getElementById("recipe-list");
    const adminLink = document.getElementById("admin-link");
    const logoutButton = document.getElementById("logout-button");
    const searchInput = document.getElementById("search-input");
    const addRecipeButton = document.getElementById("add-recipe-submit-input");
    const updateRecipeButton = document.getElementById("update-recipe-submit-input");
    const deleteRecipeButton = document.getElementById("delete-recipe-submit-input");
    const searchButton = document.getElementById("search-button");

    /*
     * TODO: Show logout button if auth-token exists in sessionStorage
     */
    if (sessionStorage.getItem("auth-token")) {
        logoutButton.hidden = false;
    }

    /*
     * TODO: Show admin link if is-admin flag in sessionStorage is "true"
     */
    if (sessionStorage.getItem("is-admin") === "true") {
        adminLink.hidden = false;
    }

    /*
     * TODO: Attach event handlers
     * - Add recipe button → addRecipe()
     * - Update recipe button → updateRecipe()
     * - Delete recipe button → deleteRecipe()
     * - Search button → searchRecipes()
     * - Logout button → processLogout()
     */
    addRecipeButton.addEventListener("click", addRecipe);
    updateRecipeButton.addEventListener("click", updateRecipe);
    deleteRecipeButton.addEventListener("click", deleteRecipe);
    searchButton.addEventListener("click", searchRecipes);
    logoutButton.addEventListener("click", processLogout);

    /*
     * TODO: On page load, call getRecipes() to populate the list
     */
    getRecipes();


    /**
     * TODO: Search Recipes Function
     * - Read search term from input field
     * - Send GET request with name query param
     * - Update the recipe list using refreshRecipeList()
     * - Handle fetch errors and alert user
     */
    async function searchRecipes() {
        // Implement search logic here
        const searchTerm = searchInput.value.trim().toLowerCase();

        if (!searchTerm) {
            refreshRecipeList();
            return;
        }

        const filteredRecipes = recipes.filter(recipe =>
            recipe.name.toLowerCase().includes(searchTerm)
        );

        refreshRecipeList(filteredRecipes);
    }

    /**
     * TODO: Add Recipe Function
     * - Get values from add form inputs
     * - Validate both name and instructions
     * - Send POST request to /recipes
     * - Use Bearer token from sessionStorage
     * - On success: clear inputs, fetch latest recipes, refresh the list
     */
    async function addRecipe() {
        // Implement add logic here
        const name = addRecipeNameInput.value.trim();
        const instructions = addRecipeInstructionsInput.value.trim();

        if (!name || !instructions) {
            alert("Fill in all fields");
            return;
        }

        const response = await fetch(`${BASE_URL}/recipes`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + sessionStorage.getItem("auth-token")
            },
            body: JSON.stringify({ name, instructions })
        });

        if (response.ok) {
            addRecipeNameInput.value = "";
            addRecipeInstructionsInput.value = "";
            await getRecipes();
        }
    }

    /**
     * TODO: Update Recipe Function
     * - Get values from update form inputs
     * - Validate both name and updated instructions
     * - Fetch current recipes to locate the recipe by name
     * - Send PUT request to update it by ID
     * - On success: clear inputs, fetch latest recipes, refresh the list
     */
    async function updateRecipe() {
        // Implement update logic here
        const name = updateRecipeNameInput.value.trim();
        const instructions = updateRecipeInstructionsInput.value.trim();

        if (!name || !instructions) {
            alert("Fill in all fields");
            return;
        }

        const recipe = recipes.find(r => r.name === name);

        if (!recipe) {
            alert("Recipe not found");
            return;
        }

        const response = await fetch(`${BASE_URL}/recipes/${recipe.id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + sessionStorage.getItem("auth-token")
            },
            body: JSON.stringify({
                name: recipe.name,
                instructions: instructions
            })
        });

        if (response.ok) {
            updateRecipeNameInput.value = "";
            updateRecipeInstructionsInput.value = "";
            await getRecipes();
        }
    }

    /**
     * TODO: Delete Recipe Function
     * - Get recipe name from delete input
     * - Find matching recipe in list to get its ID
     * - Send DELETE request using recipe ID
     * - On success: refresh the list
     */
    async function deleteRecipe() {
        // Implement delete logic here
        const name = deleteRecipeNameInput.value.trim();
        const recipe = recipes.find(r => r.name === name);

        if (!recipe) {
            alert("Recipe not found");
            return;
        }

        const response = await fetch(`${BASE_URL}/recipes/${recipe.id}`, {
            method: "DELETE",
            headers: {
                "Authorization": "Bearer " + sessionStorage.getItem("auth-token")
            }
        });

        if (response.ok) {
            deleteRecipeNameInput.value = "";
            await getRecipes();
        }
    }

    /**
     * TODO: Get Recipes Function
     * - Fetch all recipes from backend
     * - Store in recipes array
     * - Call refreshRecipeList() to display
     */
    async function getRecipes() {
        // Implement get logic here
        const response = await fetch(`${BASE_URL}/recipes`);
        recipes = await response.json();
        refreshRecipeList();
    }

    /**
     * TODO: Refresh Recipe List Function
     * - Clear current list in DOM
     * - Create <li> elements for each recipe with name + instructions
     * - Append to list container
     */
    function refreshRecipeList(recipeArray = recipes) {
        // Implement refresh logic here
        recipeList.innerHTML = "";

        recipeArray.forEach(recipe => {
            const li = document.createElement("li");
            li.textContent = `${recipe.name} - ${recipe.instructions}`;
            recipeList.appendChild(li);
        });
    }

    /**
     * TODO: Logout Function
     * - Send POST request to /logout
     * - Use Bearer token from sessionStorage
     * - On success: clear sessionStorage and redirect to login
     * - On failure: alert the user
     */
    async function processLogout() {
        // Implement logout logic here
        const response = await fetch(`${BASE_URL}/logout`, {
            method: "POST",
            headers: {
                "Authorization": "Bearer " + sessionStorage.getItem("auth-token")
            }
        });

        if (response.ok) {
            sessionStorage.clear();
            window.location.href = "../login/login-page.html";
        } else {
            alert("Logout failed");
        }
    }

});