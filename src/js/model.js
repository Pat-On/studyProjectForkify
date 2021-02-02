import { async } from 'regenerator-runtime';

export const state = {
    recipe: {},
};

// this function is going to change only state object
export const loadRecipe = async function (id) {
    try {
        const res = await fetch(
            `https://forkify-api.herokuapp.com/api/v2/recipes/${id}`
        );
        const data = await res.json();

        if (!res.ok) throw new Error(`${data.message} (${res.status})`)

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
        alert(err);
    }
}