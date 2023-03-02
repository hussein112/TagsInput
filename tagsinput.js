class inputFactory{

    /**
     * Construct the UI for the input
     *
     * @param {String} title
     * @param {String} inputPlaceHolder
     * @param {Integer} max
     */
    static create(title, inputPlaceHolder, max){
        const container = document.createElement("div");
        container.setAttribute("class", "container hk-wrapper");

        this.prototype.createHidden(container);

        this.prototype.createTitle(container, title);

        this.prototype.createContent(container, inputPlaceHolder);

        this.prototype.createDetails(container, max);
    }

    /**
     * Create the input that will hold the data for the backend.
     *
     * @param {HtmlDivElement} container
     */
    createHidden(container){
        const hidden = document.createElement("input");
        hidden.setAttribute("type", "hidden");
        hidden.setAttribute("id", "hk-csv-array");
        hidden.setAttribute("name", "hk-csv");

        container.appendChild(hidden);
    }


    /**
     * create the title
     *
     * @param {HTmlDivElement} container
     * @param {String} title
     */
    createTitle(container, title){
        const titleContainer = document.createElement("div");
        titleContainer.setAttribute("class", "hk-title d-flex align-items-center");

        const _title = document.createElement("h2");
        _title.innerText = title;
        titleContainer.appendChild(_title);

        container.appendChild(titleContainer);

        document.getElementById("hk-input-csv").append(container);
    }


    /**
     * Create the content
     *
     * @param {HtmlDivElement} container
     * @param {String} inputPlaceHolder
     */
    createContent(container, inputPlaceHolder){
        const contentContainer = document.createElement("div");
        contentContainer.setAttribute("class", "hk-content mx-1");

        this.createList(contentContainer);
        this.createInput(contentContainer, inputPlaceHolder);

        container.appendChild(contentContainer);
    }

    /**
     * Create the list to hold tags
     *
     * @param {HtmlDivElement} container
     */
    createList(container){
        const list = document.createElement("ul");
        list.setAttribute("class", "d-flex flex-wrap p-2 hk-csv-list border rounded");

        container.appendChild(list);
    }

    /**
     * Create the CSV input
     *
     * @param {HtmlDivElement} container
     * @param {String} placeholder
     */
    createInput(container, placeholder){
        const input = document.createElement("input");
        input.setAttribute("class", "p-2 form-control");
        input.setAttribute("id", "hk-input");
        input.setAttribute("type", "text");
        input.setAttribute("placeholder", placeholder);
        input.setAttribute("spellcheck", 'false');

        container.appendChild(input);
    }

    /**
     * Create the details section
     *
     * @param {HTmlDivElement} container
     * @param {Integer} max
     */
    createDetails(container, max){
        const detailsContainer = document.createElement("div");
        detailsContainer.setAttribute("class", "details d-flex flex-wrap align-items-center justify-content-between my-1");

        this.createCounter(max, detailsContainer);
        this.createRemoveAllButton(detailsContainer);

        container.appendChild(detailsContainer);

    }

    /**
     * Create the counter for the remaining tags
     *
     * @param {Integer} max
     * @param {HtmlDivElement} container
     */
    createCounter(max, container){
        const counter = document.createElement("p");
        const number = document.createElement("span");
        number.setAttribute("id", "hk-max");

        number.innerText = max;

        counter.appendChild(number);
        counter.appendChild(document.createTextNode(" Tags are remaining"));

        container.appendChild(counter);
    }

    /**
     * Create the remove all button
     *
     * @param {HtmlDivElement} container
     */
    createRemoveAllButton(container){
        const remove = document.createElement("button");
        remove.setAttribute("class", "btn btn-primary");
        remove.setAttribute("type","button");
        remove.innerText = "Remove All";

        container.appendChild(remove);
    }



    /**
     * Renew the form
     * 
     * @returns {Void}
     */
    static flush(){
        if(tagsinput.input.disabled){
            tagsinput.input.disabled = false;
        }
        tagsinput.countTags();
        tagsinput.addPlaceHolder();
        tagsinput.input.value = "";
        tagsinput.hidden.value = "";
        Errors.removePreviousErrors();
    }
}

class TagsInput{
    /**
     * Default configurations in case no configurations were placed by the user.
     */
    #defaults = {
        form_title: "Tags Input",
        input_place_holder: "Enter CSV Values",
        trigger: ",",
        max: 5,
        list_place_holder: "No Tags, Yet",
        axios: {
            on: false
        }
    }
    
    setConfigurations(config){
        (typeof(config) === "undefined" || config === null) ? this.config = this.#defaults : this.config = config
        for (let option in this.#defaults) {
            if (typeof(this.config[option]) === 'undefined')
                this.config[option] = this.#defaults[option];
        }
    }

    constructor(config = null){
        window.hk_that = this;
        this.tags = [];

        this.setConfigurations(config);

        // Configurations
        this.title = this.config.form_title;
        this.iph = this.config.input_place_holder;
        this.max = this.config.max;
        this.trigger = this.config.trigger;
        this.lph = this.config.list_place_holder;

        inputFactory.create(this.title, this.iph, this.max);

        /**
         * Wait for creating the UI then get the elements
         */
        setTimeout(function(){
            hk_that.container = document.querySelector(".hk-csv-list");
            hk_that.tagNumber = document.getElementById("hk-max");
            hk_that.input = document.getElementById("hk-input");
            hk_that.hidden = document.getElementById("hk-csv-array");
            hk_that.initialize();
            hk_that.countTags();
            hk_that.createTag();
        }, 500);



        if(this.config.axios.on){
            document.querySelector(this.config.axios.trigger).addEventListener("click", function(){
                hk_that.sendData();
            });
        }
    }



    /**
     * Add Placeholder and Event Listeners for Remove all, and trigger
     */
    initialize(){
        this.addPlaceHolder();
        this.input.addEventListener("keyup", this.addTag);
        const removeBtn = document.querySelector(".details button");
        removeBtn.addEventListener("click", () =>{
            this.tags.length = 0;
            this.container.querySelectorAll("li").forEach(li => li.remove());
            inputFactory.flush();
        });
    }

    /**
     * Render the text that should be displayed if no tags are inserted
     */
    addPlaceHolder(){
        if(this.container.childElementCount < 1){
            let span = `<span>${this.lph}</span>`;
            this.container.insertAdjacentHTML("afterbegin", span);
        }
    }

    /**
     * Update the number of remaining tags and Focus on the input
     */
    countTags(){
        this.tagNumber.innerText = this.max - this.tags.length;
    }

    /**
     * Remove all the prvious tags <ul> & insert them again with the new one
     *
     * @return {Void}
     */
    createTag(){
        this.container.querySelectorAll("li").forEach(li => li.remove());
        this.hidden.value = "";
        this.tags.slice().reverse().forEach(tag =>{
            const icon = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-x-circle-fill" viewBox="0 0 16 16"> <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM5.354 4.646a.5.5 0 1 0-.708.708L7.293 8l-2.647 2.646a.5.5 0 0 0 .708.708L8 8.707l2.646 2.647a.5.5 0 0 0 .708-.708L8.707 8l2.647-2.646a.5.5 0 0 0-.708-.708L8 7.293 5.354 4.646z"/> </svg>';
            let liTag = `<li class="hk-v m-1 border border-secondary p-1 rounded d-flex align-items-center justify-content-center">${tag} <i class="d-flex align-items-center mx-1" onclick="tagsinput.remove(this, '${tag}')">${icon}</i></li>`;
            this.container.insertAdjacentHTML("afterbegin", liTag);
            this.hidden.value += tag + this.trigger + ' ';
        });
        this.countTags();
    }

    /**
     * Remove the tag from the array, then from the UI.
     *
     * @param {HTMLElement} element
     * @param {String} tag
     * @returns {Void}
     */
    remove(element, tag){
        let index  = this.tags.indexOf(tag);
        this.tags = [...this.tags.slice(0, index), ...this.tags.slice(index + 1)];
        element.parentElement.remove();
        this.countTags();
        this.addPlaceHolder();

        if(this.input.disabled){
            this.input.disabled = false;
        }

        this.removeHidden(tag);
    }

    /**
     * Remove the element from the backend input (hidden input)
     *
     * @param {String} tag
     */
    removeHidden(tag){
        this.hidden.value = this.hidden.value.replace(tag, '');
    }

    /**
     * Event Listener for the input
     *
     * @param {Event} e
     */
    addTag(e){
        const that = window.hk_that;
        let firstElement = that.container.firstChild;
        if(that.tags.length >= that.max){
            Errors.limitReached();
        }
        if(e.key === that.trigger){
            let tag = e.target.value.replace(that.trigger, ' ');
            const empty = that.trigger + that.trigger;
            if(tag.length < 2 || e.target.value.match('^['+ empty +']')){
                Errors.emptyInput();
            }
            if(tag.match(/[\s]/) && ! tag.match(/[a-zA-Z]/)){
                Errors.emptyInput();
            }
            if(that.tags.includes(tag)){
                Errors.notUnique(tag);
            }else{
                tag.split(that.trigger).forEach(tag => {
                    tag.trim();
                    that.tags.push(tag);
                    that.createTag();
                });
            }
            e.target.value = "";
            Errors.removePreviousErrors();
            if(firstElement.innerText === that.lph){
                firstElement.remove();
            }
        }
    }


    /**
     * Add manual tag. i.e., from DB.
     *
     * @param {String} tag
     */
    manualTag(tag){
        let e = document.getElementById("hk-input");
        const that = window.hk_that;

        tag = tag.options[tag.selectedIndex].text;

        let firstElement = that.container.firstChild;
        if(that.tags.length >= that.max){
            Errors.limitReached();
        }

        let _tag = tag.replace(that.trigger, ' ');
        const empty = that.trigger + that.trigger;
        if(_tag.length < 2 || _tag.match('^[' + empty + ']')){
            Errors.emptyInput();
        }
        if(_tag.match(/[\s]/) && ! _tag.match(/[a-zA-Z]/)){
            Errors.emptyInput();
        }
        if(that.tags.includes(_tag)){
            Errors.notUnique(_tag);
        }else{
            _tag.split(that.trigger).forEach(tag => {
                tag.trim();
                that.tags.push(tag);
                that.createTag();
                that.hidden.value += tag + that.trigger + ' ';
            });
        }
        e.value = "";
        Errors.removePreviousErrors();
        if(firstElement.innerText === that.placeHolder){
            firstElement.remove();
        }
    }




    /**
     * Send Data Through POST axios HTTP Request (JSON)
     *
     */
    sendData(){
        const values = this.hidden.value.split('-');
        const jsonData = {};
        for(let i = 0; i < values.length; i++){
            if(values[i] == ' '){
                continue;
            }
            jsonData[i] = values[i].trim();
        }
        this.sendDataTo(jsonData);
    }

    /**
     * Send data to a backend enpoint through axios
     * @param {JSONString} jsonData
     */
    sendDataTo(jsonData){
        axios.post(this.config.axios.url, {
            data: jsonData
        },{
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(function (response) {
            console.log(response);
        })
        .catch(function (error) {
            console.log(error);
            Errors.httpError(error.response.data);
        });
    }

}

class Errors{

    /**
     * Max tags reached
     *
     * @throws {Erorr}
     */
    static limitReached(){
        tagsinput.input.value = "";
        tagsinput.input.disabled = true;
        let msg = `You cannot add more than ${tagsinput.max}`;
        this.prototype.createError(msg);
        throw new Error(msg);
    }


    /**
     * Input is empty
     *
     * @throws {Error}
     */
    static emptyInput(){
        let msg = `The Input Cannot Be Empty or Numeric`;
        this.prototype.createError(msg);
        throw new Error(msg);
    }


    /**
     * Tag already exists
     *
     * @param {String} tag
     * @throws {Error}
     */
    static notUnique(tag){
        let msg = `${tag.toUpperCase()} Already Exists!`;
        this.prototype.createError(msg);
        throw new Error(msg);
    }

    /**
     * Axios Error
     * 
     * @param {String} error 
     */
    static httpError(error){
        let msg = `${error.toUpperCase()}`;
        this.prototype.createError(msg);
        throw new Error(msg);
    }

    /**
     * Create an Error & Render it
     *
     * @param {String} msg
     */
    createError(msg){
        Errors.removePreviousErrors();

        const err = document.createElement("strong");
        err.setAttribute("class", "bg-danger p-2 my-2 text-light hk-error");
        err.innerText = '* ' + msg;

        document.querySelector(".details").after(err);
    }

    /**
     * Remove previously rendered errors
     */
    static removePreviousErrors(){
        let previousErrors = document.querySelectorAll(".hk-error");
        if(previousErrors != null){
            previousErrors.forEach(error => {
                error.remove();
            });
        }
    }


}