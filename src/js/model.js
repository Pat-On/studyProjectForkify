import { async } from 'regenerator-runtime';
import { API_URL, RES_PER_PAGE, KEY } from './config.js'
import { getJSON, sendJSON } from './helpers.js'
import recipeView from './views/recipeView.js';

export const state = {
    recipe: {},
    search: {
        query: '',
        results: [],
        page: 1,
        resultsPerPage: RES_PER_PAGE,
    },
    bookmarks: [],

};

const createRecipeObject = function (data) {
    const { recipe } = data.data
    return state.recipe = {
        id: recipe.id,
        title: recipe.title,
        publisher: recipe.publisher,
        sourceUrl: recipe.source_url,
        image: recipe.image_url,
        servings: recipe.servings,
        cookingTime: recipe.cooking_time,
        ingredients: recipe.ingredients,
        ...(recipe.key && { key: recipe.key }),
    };
}

// this function is going to change only state object
export const loadRecipe = async function (id) {
    try {
        const data = await getJSON(`${API_URL}/${id}`);
        state.recipe = createRecipeObject(data);
        const { recipe } = data.data;
        // console.log(data)

        // this is if-else statement which is going to add state.recipe.bookmarked to the recipe, and by this we are
        // not have to render it from api and to lose the 'bookrmarked' 
        if (state.bookmarks.some(bookmark => bookmark.id === id))
            state.recipe.bookmarked = true;
        else state.recipe.bookmarked = false;

        console.log("29 model.js" + state.recipe.title)
    } catch (err) {
        //temp error handling
        console.error(`${err} xD xD xD xD`);
        throw err;
    }
}

export const loadSearchResults = async function (query) {
    try {

        state.search.query = query;
        const data = await getJSON(`${API_URL}?search=${query}&key=523506ae-f785-4722-b41e-bd263ffff64b`)
        // console.log(data);

        state.search.results = data.data.recipes.map(rec => {
            return {
                id: rec.id,
                title: rec.title,
                publisher: rec.publisher,
                image: rec.image_url,

            }
        })
        // console.log(state.search.results)
        state.search.page = 1;
    } catch (err) {
        console.error(`${err} xD xD xD xD`);
        throw err;
    }
};
// this is not going to be async because we already have the data
export const getSearchResultsPage = function (page = state.search.page) {

    state.search.page = page;

    const start = (page - 1) * state.search.resultsPerPage //0;
    const end = page * state.search.resultsPerPage //9;

    return state.search.results.slice(start, end);
};

export const updateServings = function (newServings) {
    state.recipe.ingredients.forEach(ing => {
        ing.quantity = (ing.quantity * newServings) / state.recipe.servings;
        //newQt = oldQt * newServings / oldServings // 2 * 8 / 4 = 4

    });
    state.recipe.servings = newServings; // at the end because we are going to need them to make calc - old one
};

const persistBookmarks = function () {
    localStorage.setItem('bookmarks', JSON.stringify(state.bookmarks));
}


export const addBookmarks = function (recipe) {
    //Add bookmark 
    state.bookmarks.push(recipe);

    //mark current recipe as bookmarks
    if (recipe.id === state.recipe.id) state.recipe.bookmarked = true;
    persistBookmarks();
};
//this is common pattern in programming, when we are adding something we want to use entire data, but 
//when we delete something, we use only ID 
export const deleteBookmark = function (id) {
    //DELETE BOOKMARKS
    const index = state.bookmarks.findIndex(el => el.id === id);
    state.bookmarks.splice(index, 1);

    //mark current recipe as NOT bookmarks
    if (id === state.recipe.id) state.recipe.bookmarked = false;
    persistBookmarks();
};

const init = function () {
    const storage = localStorage.getItem('bookmarks');
    if (storage) state.bookmarks = JSON.parse(storage);
};

init();
// console.log(state.bookmark);


//function dev f.
const clearBookmarks = function () {
    localStorage.clear('Bookmarks');
};


//uploading recipe to the API
//it is going to send data across net so has to be async 
export const uploadRecipe = async function (newRecipe) {
    try {
        const ingredients = Object.entries(newRecipe)
            .filter(entry => entry[0].startsWith('ingredient') && entry[1] !== "")
            .map(ing => {
                const ingArr = ing[1].replaceAll(" ", "").split(','); //nice logic
                if (ingArr.length !== 3)
                    throw new Error("Wrong ingredient format! Please use the correct one!");

                const [quantity, unit, description] = ingArr;

                return { quantity: quantity ? +quantity : null, unit, description }; //nice!
            });
        console.log(newRecipe);
        const recipe = {
            title: newRecipe.title,
            source_url: newRecipe.sourceUrl,
            image_url: newRecipe.image,
            publisher: newRecipe.publisher,
            cooking_time: +newRecipe.cookingTime,
            servings: +newRecipe.servings,
            ingredients,
        };
        console.log(recipe)
        const data = await sendJSON(`${API_URL}?key=${KEY}`, recipe);
        console.log(data);
        state.recipe = createRecipeObject(data);
        addBookmarks(state.recipe);

    } catch (err) {
        throw err;

    }
    //reformating object to the way that API is going to accept it

}