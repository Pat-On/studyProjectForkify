import { async } from 'regenerator-runtime';
import { API_URL } from './config.js'
import { getJSON } from './helpers.js'

export const state = {
    recipe: {},
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
    }
}