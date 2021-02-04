// import { render } from 'sass'; // not my code 'Parcel"? check more later in google. <-reason of error
import * as model from './model.js';
import recipeView from "./views/recipeView.js";
import searchView from "./views/searchView.js";
import resultsView from "./views/resultsView.js";

// why after importing paginationView everything is going crazy lol?
import paginationView from './views/paginationView.js'


import 'core-js/stable';
import 'regenerator-runtime/runtime';

//this is for parcel
if (module.hot) {
  module.hot.accept();
};


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

    //0) update results view to mark selected search results
    resultsView.update(model.getSearchResultsPage());

    //1) loading recipe

    //this is example async function calling another async function
    await model.loadRecipe(id); // we will just get accec to the state.recipe manipulated inside the 'mode'
    // const { recipe } = model.state;
    // console.log(recipe)


    // 2) rendering recipe


    recipeView.render(model.state.recipe);

    //TEST 
    // controlServings()


    // render is very common and self descriptive
    //by this we are going to as well pass the data to the view via parent class
    // paginationView.render(mode.state.search)
  } catch (err) {
    recipeView.renderError();
  }
}

controlRecipes();

// fetch('https://forkify-api.herokuapp.com/api/v2/recipes/5ed6604591c37cdc054bc886');

const controlSearchResults = async function () {
  try {
    resultsView.renderSpinner();
    // 1) Get search query
    const query = searchView.getQuery();
    // console.log(query)
    if (!query) return;


    //2) Load search
    await model.loadSearchResults(query);
    //3) Render results
    // console.log(model.state.search.results);

    // resultsView.render(model.state.search.results);
    // console.log(model.getSearchResultsPage(1));


    resultsView.render(model.getSearchResultsPage());
    // resultsView.render(model.state.search.results);
    //4 render initial pagination buttons
    paginationView.render(model.state.search);

  } catch (err) {
    console.log(err)
  }
}

const controlPagination = function (goToPage) {
  //3) Render new  results
  // console.log(model.state.search.results);

  // resultsView.render(model.state.search.results);
  // console.log(model.getSearchResultsPage(1));


  resultsView.render(model.getSearchResultsPage(goToPage));
  // resultsView.render(model.state.search.results);
  //4 render initial pagination buttons
  paginationView.render(model.state.search);
}


const controlServings = function (newServings) {
  // update the recipe servings (in state - underling data)
  model.updateServings(newServings);
  //update the recipe view - because servings are going to change -
  // recipeView.render(model.state.recipe);
  recipeView.update(model.state.recipe);
  // 
}

const controlAddBookmark = function () {
  if (!model.state.recipe.bookmarked) model.addBookmarks(model.state.recipe);
  else model.deleteBookmark(model.state.recipe.id);
  console.log(model.state.recipe);
  recipeView.update(model.state.recipe);
};


const init = function () {
  recipeView.addHandlerRender(controlRecipes);
  recipeView.addHandlerUpdateServings(controlServings);
  recipeView.addHandlerAddBookmark(controlAddBookmark);
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerClick(controlPagination);

  // controlServings(); // we can not do it here because the data coming from async! 
}
init();
