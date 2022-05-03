import EN from './layouts/en.js'
import RU from './layouts/ru.js'

class Keyboard {
    #filled
    constructor (node) {
        this.container = document.createElement('div');
        this.container.classList.add('keyboard__wrapper');
        this.#filled = false;
        node.append(this.container)
    }
    fill(data) {
        if (!this.#filled) {
            this.buttons = data.map(object => new Button(object, this.container))
        }
    }
}

class Button {
    constructor (object, node) {
        const {key, code, alt, extras } = object;
        this.container = document.createElement('div');
        const addition = extras ? extras.join(' ') : ''
        this.container.classList.add('keyboard__button');
        this.container.textContent = key;
        node.append(this.container)
        return this.container
    }
}

const kboard = new Keyboard(document.body);
kboard.fill(RU)