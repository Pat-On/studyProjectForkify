// import { render } from 'sass'; // not my code 'Parcel"? check more later in google. <-reason of error
import * as model from './model.js';
import recipeView from "./views/recipeView.js";


import 'core-js/stable';
import 'regenerator-runtime/runtime';


const recipeContainer = document.querySelector('.recipe');
// console.log("??" + recipeContainer);



// https://forkify-api.herokuapp.com/v2

///////////////////////////////////////




const controlRecipes = async function () {
  try {

    const id = window.location.hash.slice(1);
    console.log(id);

    if (!id) return // using guards closes is the modern way of performing this task 
    // old style is using if(id) what require to nest everything bellow. 
    recipeView.renderSpinner();

    //1) loading recipe

    //this is example async function calling another async function
    await model.loadRecipe(id); // we will just get accec to the state.recipe manipulated inside the 'mode'
    // const { recipe } = model.state;
    // console.log(recipe)


    // 2) rendering recipe
    // render is very common and self descriptive

    recipeView.render(model.state.recipe);

  } catch (err) {
    alert(err)
  }
}

controlRecipes();

fetch('https://forkify-api.herokuapp.com/api/v2/recipes/5ed6604591c37cdc054bc886');


const init = function () {
  recipeView.addHandlerRender(controlRecipes);
}
init();