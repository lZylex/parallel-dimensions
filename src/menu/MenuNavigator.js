export default class MenuNavigator {
    constructor() {
        this._menuChoices = Array.from(document.querySelectorAll(".menu-choice"));
        this._currentChoice = this._menuChoices[0];

        document.addEventListener("keydown", e => {
            switch (e.key.toLowerCase()) {
                case "arrowup":
                    this._currentChoice.classList.remove("selected");
                    if (this._menuChoices.indexOf(this._currentChoice) - 1 === -1) {
                        this._currentChoice = this._menuChoices[this._menuChoices.length - 1];
                    } else this._currentChoice = this._menuChoices[this._menuChoices.indexOf(this._currentChoice) - 1];
                    this._currentChoice.classList.add("selected");
                    break;
                case "arrowdown":
                    this._currentChoice.classList.remove("selected");
                    if (this._menuChoices.indexOf(this._currentChoice) + 1 === this._menuChoices.length) {
                        this._currentChoice = this._menuChoices[0];
                    } else this._currentChoice = this._menuChoices[this._menuChoices.indexOf(this._currentChoice) + 1];
                    this._currentChoice.classList.add("selected");
                    break;
                case "enter":
                    let currentChoiceRef = this._menuChoices[this._menuChoices.indexOf(this._currentChoice)];
                    switch (currentChoiceRef.innerText) {
                        case "Play":
                            window.location.href = "./game.html"
                    }

            }
            // console.log(this._currentChoice);
        })
    }
}