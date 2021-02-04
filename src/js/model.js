import { async } from 'regenerator-runtime';
import { API_URL, RES_PER_PAGE } from './config.js'
import { getJSON } from './helpers.js'

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

// this function is going to change only state object
export const loadRecipe = async function (id) {
    try {
        const data = await getJSON(`${API_URL}/${id}`);

        const { recipe } = data.data;
        // console.log(data)
        state.recipe = {
            id: recipe.id,
            title: recipe.title,
            publisher: recipe.publisher,
            sourceUrl: recipe.source_url,
            image: recipe.image_url,
            servings: recipe.servings,
            cookingTime: recipe.cooking_time,
            ingredients: recipe.ingredients,
        };
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
console.log(state.bookmark);

const clearBookmarks = function () {
    localStorage.clear('Bookmarks');
};