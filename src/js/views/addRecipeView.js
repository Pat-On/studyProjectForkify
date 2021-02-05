import View from './View.js';
import icons from 'url:../../img/icons.svg'; // Parcel 2 syntax

// let parentElement = document.querySelector('.pagination');
// console.log(parentElement)
class AddRecipeView extends View {
    _parentElement = document.querySelector('.upload');
    _overlay = document.querySelector(".overlay");
    _window = document.querySelector('.add-recipe-window');
    _btnOpen = document.querySelector('.nav__btn--add-recipe');
    _btnClose = document.querySelector('.btn--close-modal');


    //because controller is not going to have nothing common with that function we can just run it
    // after creation of the addRecipeView object
    constructor() {
        super();
        this._addHandlerShowWindow();
        this._addHandlerHideWindow(); //instant call
    }


    // do not forget about the the this inside the call back function and the .bind()
    toggleWindow() {
        this._overlay.classList.toggle('hidden');
        this._window.classList.toggle('hidden');
        console.log("lol?");
    }

    _addHandlerShowWindow() {
        this._btnOpen.addEventListener('click', this.toggleWindow.bind(this));
    }

    _addHandlerHideWindow() {
        this._btnClose.addEventListener('click', this.toggleWindow.bind(this));
        this._overlay.addEventListener('click', this.toggleWindow.bind(this));
    }

    addHandlerUpload(handler) {
        this._parentElement.addEventListener('submit', function (e) {
            e.preventDefault();
            const dataArr = [...new FormData(this)]; // this is form element because we are in the parent element.
            // console.log(data);
            //ES 2019 - converting data array to data object !IMPORTANT
            const data = Object.fromEntries(dataArr);
            handler(data);
        })
    }

    _generateMarkup() {


    }
}

export default new AddRecipeView();

