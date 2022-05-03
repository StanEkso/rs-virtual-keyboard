import EN from './layouts/en.js'
import RU from './layouts/ru.js'
const link = document.createElement('link')
link.rel = 'stylesheet';
link.href = './style.css';
document.head.append(link);
const textarea = document.createElement('textarea');
document.body.append(textarea)
textarea.addEventListener('keypress', () => event.preventDefault())
class Keyboard {
    #filled;
    #locale;
    currow;
    constructor (node) {
        this.container = document.createElement('div');
        this.container.classList.add('keyboard__wrapper');
        this.#filled = false;
        this.#locale = localStorage.getItem('locale') || 'ru';
        this.shifted = false;
        this.capsed = false;
        this.currow = document.createElement('div')
        this.currow.classList.add('keyboard__row')
        node.append(this.container)
        this.container.append(this.currow);
        this.createKeyListeners();
    }
    changeLanguage() {
        this.#locale = this.#locale === 'ru' ? 'en' : 'ru';
        this.fill(this.#locale === 'ru' ? RU : EN);
    }
    fill(data) {
        if (!this.#filled) {
            this.buttons = data.map(object => new Button(object, this))
            this.#filled = true;
        } else {
            data.forEach(object => {
                const index = data.indexOf(object);
                this.buttons[index].updateWithData(object);
            })
        }
    }
    shiftHandler() {
        const listener = () => this.buttons.forEach(button => {
            if (!button.shift) return;
            button.container.textContent = this.capsed ? button.shift : button.key;
            document.body.removeEventListener('keydown',listener)
        })
        this.buttons.forEach(button => {
            if (!button.shift) return;
            button.container.textContent = this.capsed ? button.key : button.shift;
        })
        document.body.addEventListener('keyup', listener)
    }
    capsHandler() {
        this.capsed = !this.capsed
        this.buttons.forEach(button => {
            if (!button.shift) return;
            if (button.key.toUpperCase() != button.shift) return;
            button.container.textContent = this.capsed ? button.shift : button.key
        })
    }
    createKeyListeners() {
        document.body.addEventListener('keydown', (event) => {
            if (event.key == 'Shift') this.shiftHandler();
            else if (event.key == 'CapsLock') this.capsHandler();
        })
    }
}

class Button {
    constructor (object, parent) {
        this.parent = parent
        const {key, code, shift, extras, end } = object;
        this.container = document.createElement('div');
        this.code = code;
        this.key = key;
        this.shift = shift;
        const addition = extras ? extras : ''
        this.container.classList.add('keyboard__button', ...addition);
        this.container.textContent = this.key;
        this.container.addEventListener('click', () => this.clickHandler())
        parent.currow.append(this.container)
        if (end) {
            parent.currow = kboard.currow.cloneNode();
            parent.container.append(kboard.currow)
        }
        return this;
    }
    updateWithData(object) {
        const {key, code, shift} = object;
        this.code = code;
        this.shift = shift;
        this.key = key;
        this.container.textContent = this.key;
    }
    clickHandler() {
        if (!this.container.classList.contains('functional')) textarea.value+=this.container.textContent;
        else if (this.code == 'CapsLock') {
            this.parent.capsHandler()
        }
    }
}

const kboard = new Keyboard(document.body);
kboard.changeLanguage()
kboard.changeLanguage()