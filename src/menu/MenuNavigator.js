export default class MenuNavigator {
    constructor(renderer, canEnterLevel) {
        this._renderer = renderer;
        this.canEnterLevel = canEnterLevel;

        this._menuChoices = Array.from(document.querySelectorAll(".menu-choice"));
        this._currentChoice = this._menuChoices[0];
        this._optionsMenu = document.getElementById("options-selection");
        this._tutorialSplash = document.getElementById("tutorial-splash");
        this._lastChoice = null;
        this._selectedClass = "selected";

        this._optionsMenu.style.display = "none";
        this._tutorialSplash.style.display = "none";

        document.addEventListener("keydown", e => {

            if (this._optionsMenu.style.display === "none") {
                this._selectedClass = "selected";
            } else {
                this._selectedClass = "option-selected";
            }

            switch (e.key.toLowerCase()) {
                case "arrowup":
                    this._currentChoice.classList.remove(this._selectedClass);
                    if (this._menuChoices.indexOf(this._currentChoice) - 1 === -1) {
                        this._currentChoice = this._menuChoices[this._menuChoices.length - 1];
                    } else this._currentChoice = this._menuChoices[this._menuChoices.indexOf(this._currentChoice) - 1];
                    this._currentChoice.classList.add(this._selectedClass);
                    break;
                case "arrowdown":
                    this._currentChoice.classList.remove(this._selectedClass);
                    if (this._menuChoices.indexOf(this._currentChoice) + 1 === this._menuChoices.length) {
                        this._currentChoice = this._menuChoices[0];
                    } else this._currentChoice = this._menuChoices[this._menuChoices.indexOf(this._currentChoice) + 1];
                    this._currentChoice.classList.add(this._selectedClass);
                    break;
                //harder to display 1.0 instead of 1 than coding the entire menu logic
                //TODO: Make little icon that shows you change the value with the arrow keys 
                case "arrowleft":
                    if (this._currentChoice.innerText.split(" _ ")[0] === "Resolution") {
                        if (parseFloat(localStorage.resolution) > 0.2) {
                            localStorage.resolution = (parseFloat(localStorage.resolution) - 0.1).toFixed(1);
                            this._currentChoice.children[0].innerText = `_ ${localStorage.resolution}`;
                            this._renderer.setPixelRatio(window.devicePixelRatio * (parseFloat(localStorage.resolution) ** 1.75));
                        } else {
                            localStorage.resolution = "1.0";
                            this._currentChoice.children[0].innerText = `_ ${localStorage.resolution}`;
                            this._renderer.setPixelRatio(window.devicePixelRatio * (parseFloat(localStorage.resolution) ** 1.75));
                        }
                    }
                    break;
                case "arrowright":
                    if (this._currentChoice.innerText.split(" _ ")[0] === "Resolution") {
                        if (parseFloat(localStorage.resolution) < 1.0) {
                            localStorage.resolution = (parseFloat(localStorage.resolution) + 0.1).toFixed(1);
                            if (parseFloat(localStorage.resolution) === "1") localStorage.resolution + ".0";
                            this._currentChoice.children[0].innerText = `_ ${localStorage.resolution}`;
                            this._renderer.setPixelRatio(window.devicePixelRatio * (parseFloat(localStorage.resolution) ** 1.75));
                        } else {
                            localStorage.resolution = 0.2;
                            this._currentChoice.children[0].innerText = `_ ${parseFloat(localStorage.resolution)}`;
                            this._renderer.setPixelRatio(window.devicePixelRatio * (parseFloat(localStorage.resolution) ** 1.75));
                        }
                    }
                    break;
                case "enter":
                    // let currentChoiceRef = this._menuChoices[this._menuChoices.indexOf(this._currentChoice)];
                    switch (this._currentChoice.innerText.split(" _ ")[0]) {
                        case "Play":
                            if (this.canEnterLevel) window.location.href = "./game.html";
                            break;
                        case "Options":
                            this._optionsMenu.style.display === "none" ? this._optionsMenu.style.display = "block" : this._optionsMenu.style.display = "none";
                            this._currentChoice.classList.remove(this._selectedClass);
                            this._lastChoice = this._currentChoice;
                            this._menuChoices = Array.from(document.querySelectorAll(".options-choice"));
                            this._currentChoice = this._menuChoices[0];
                            this._selectedClass = "option-selected";
                            this._currentChoice.classList.add(this._selectedClass);
                            Array.from(this._menuChoices)[0].children[0].innerText = `_ ${localStorage.postprocessing}`;
                            Array.from(this._menuChoices)[2].children[0].innerText = `_ ${localStorage.resolution}`;
                            break;
                        case "Tutorial":
                            this._currentChoice.classList.remove(this._selectedClass);
                            this._lastChoice = this._currentChoice;
                            this._menuChoices = [];
                            this._tutorialSplash.style.display = "flex";
                            break;
                        case "Post Processing":
                            if (localStorage.postprocessing === "true") {
                                localStorage.postprocessing = "false"
                                this._currentChoice.children[0].innerText = "_ false"
                            } else {
                                localStorage.postprocessing = "true";
                                this._currentChoice.children[0].innerText = "_ true"
                            }
                            break;
                    }
                    break;
                case "escape":
                    if (this._optionsMenu.style.display !== "none") {
                        this._currentChoice.classList.remove(this._selectedClass);
                        this._menuChoices = Array.from(document.querySelectorAll(".menu-choice"));
                        this._currentChoice = this._lastChoice;
                        this._selectedClass = "selected";
                        this._currentChoice.classList.add(this._selectedClass);
                        this._optionsMenu.style.animation = "smooth-out 0.3s cubic-bezier(0, 0, 0.2, 1) 0s 1 normal forwards";
                        setTimeout(() => {
                            this._optionsMenu.style.display = "none";
                            this._optionsMenu.style.animation = "smooth-in 0.3s cubic-bezier(0, 0, 0.2, 1) 0s 1 normal forwards";
                        }, 300);
                    } else if (this._tutorialSplash.style.display !== "none") {
                        this._menuChoices = Array.from(document.querySelectorAll(".menu-choice"));
                        this._currentChoice = this._lastChoice;
                        this._currentChoice.classList.add(this._selectedClass);
                        this._tutorialSplash.style.animation = "fade-out 0.3s ease 0s 1 normal forwards";
                        setTimeout(() => {
                            this._tutorialSplash.style.display = "none";
                            this._tutorialSplash.style.animation = "fade-in 0.3s ease 0s 1 normal forwards";
                        }, 300);
                    }
                    break;
            }
            // console.log(this._currentChoice, this._menuChoices);
        })
    }
}