import View from './View.js';
import previewView from './previewView.js';
// import icons from 'url:../../img/icons.svg'; // Parcel 2 syntax 

class BookmarksView extends View {
    _parentElement = document.querySelector(".bookmarks__list");
    _errorMessage = 'No bookmarks yet. Find a nice recipe and bookmark it ;)';
    _message = '';

    _generateMarkup() {
        console.log("Im in generete markup")
        console.log(this._data)

        return this._data
            .map(bookmark => previewView.render(bookmark, false))
            .join('');

    }

    // _generateMarkupPreview(result) {
    //     const id = window.location.hash.slice(1);

    //     return `
    //     <li class="preview">
    //         <a class="preview__link ${result.id === id ? 'preview__link--active' : ''
    //         }" href="#${result.id}">
    //           <figure class="preview__fig">
    //             <img src="${result.image}" alt="${result.title}" />
    //           </figure>
    //           <div class="preview__data">
    //             <h4 class="preview__title">${result.title}</h4>
    //             <p class="preview__publisher">${result.publisher}</p>
    //           </div>
    //         </a>
    //     </li>
    //     `
    // }
}

export default new BookmarksView(); // to have like before only one results, without not needed multiplications