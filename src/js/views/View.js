import icons from 'url:../../img/icons.svg'; // Parcel 2 syntax 

export default class View {
    _data;

    render(data) {
        if (!data || (Array.isArray(data) && data.length === 0)) return this.renderError(); //only for undefined or null - !data so we have to do second part of logic
        // console.log(data)
        this._data = data;
        const markup = this._generateMarkup();
        this._clear();
        this._parentElement.insertAdjacentHTML('afterbegin', markup);
    }

    update(data) {
        // if (!data || (Array.isArray(data) && data.length === 0)) return this.renderError(); //only for undefined or null - !data so we have to do second part of logic
        // console.log(data)
        this._data = data;
        const newMarkup = this._generateMarkup();
        // DOM node obj creation -> !IMPORTANT check more about it! 
        const newDom = document.createRange().createContextualFragment(newMarkup);
        const newElements = Array.from(newDom.querySelectorAll('*'));
        //curent elements + conversion to array like before
        const curElements = Array.from(this._parentElement.querySelectorAll('*'));
        console.log(newElements);
        console.log(curElements);

        newElements.forEach((newEl, i) => {
            const curEl = curElements[i];
            // console.log(curEl, newEl.isEqualNode(curEl));
            // console.log(curEl.firstChild);

            // this code bellow is only going to take place on elements which contain text as a firstChild in node element
            if (!newEl.isEqualNode(curEl) && newEl.firstChild?.nodeValue.trim() !== '') {
                //element with is currently on page
                // console.log(curEl.firstChild);
                curEl.textContent = newEl.textContent; // this way no work

            }
            //updates changes ATTRIBUTES
            if (!newEl.isEqualNode(curEl)) {
                // console.log(newEl.attributes)
                // console.log(Array.from(newEl.attributes));
                Array.from(newEl.attributes).forEach(attr =>
                    curEl.setAttribute(attr.name, attr.value)
                );
            }
        })

    }
    _clear() {
        this._parentElement.innerHTML = "";
    }

    renderSpinner() {
        const markup = `
        <div class="spinner">
          <svg>
            <use href="${icons}#icon-loader"></use>
          </svg>
        </div>
        `
        this._clear();
        this._parentElement.insertAdjacentHTML("afterbegin", markup);
    };

    renderError(message = this._errorMessage) {
        const markup = `
        <div class="error">
            <div>
                <svg>
                    <use href="${icons}#icon-alert-triangle"></use>
                </svg>
            </div>
            <p>${message}</p>
        </div>
    `
        this._clear();
        this._parentElement.insertAdjacentHTML("afterbegin", markup);
    };

    renderMessage(message = this._message) {
        const markup = `
        <div class="message">
            <div>
                <svg>
                    <use href="${icons}#icon-smile"></use>
                </svg>
            </div>
            <p>${message}</p>
        </div>
    `
        this._clear();
        this._parentElement.insertAdjacentHTML("afterbegin", markup);
    };
}