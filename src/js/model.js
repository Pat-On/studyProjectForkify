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

};

// this function is going to change only state object
export const loadRecipe = async function (id) {
    try {
        const data = await getJSON(`${API_URL}/${id}`);

        const { recipe } = data.data;
        console.log(data)
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
}