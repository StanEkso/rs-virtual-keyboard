import EN from './layouts/en.js'
import RU from './layouts/ru.js'
const link = document.createElement('link')
link.rel = 'stylesheet';
link.href = './style.css';
document.head.append(link);
const textarea = document.createElement('textarea');
textarea.value = 'Привет, проверяющий! Эта клавиатура делалась под Windows. Язык переключается с помощью Shift + Alt. Спасибо!'
document.body.append(textarea)
textarea.addEventListener('keypress', () => event.preventDefault())
document.body.addEventListener('keydown', () => event.preventDefault())




class Keyboard {
    #filled;
    #locale;
    #node
    currow;
    constructor(node) {
        this.container = document.createElement('div');
        this.container.classList.add('keyboard__wrapper');
        this.#filled = false;
        this.#locale = localStorage.getItem('locale') || 'en';
        this.shifted = false;
        this.capsed = false;
        this.currow = document.createElement('div')
        this.currow.classList.add('keyboard__row')
        this.#node = node;
        this.container.append(this.currow);
        this.createKeyListeners();


        this.specialActions = {
            'Backspace': deletePrev,
            'Delete': deleteNext,
            'Enter': '\n',
            'Tab': '    ',
            'ArrowLeft': moveLeft,
            'ArrowRight': moveRight
        }
    }
    init() {
        this.#node.append(this.container)
        this.fill(this.#locale === 'ru' ? RU : EN);
    }
    changeLanguage() {
        this.#locale = this.#locale === 'ru' ? 'en' : 'ru';
        localStorage.setItem('locale',this.#locale)
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
            if (event.key != 'Shift') return;
            if (!button.shift) return;
            button.container.textContent = this.capsed ? button.shift : button.key;
            document.body.removeEventListener('keydown', listener)
        })
        this.buttons.forEach(button => {
            if (!button.shift) return;
            if (button.key.toUpperCase() != button.shift && this.capsed) button.container.textContent = button.shift
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
            const container = document.querySelector(`.${event.code}`);
            this.pressTheButton(container)
            if ((event.key == 'Shift' && event.altKey) || (event.key == 'Alt' && event.shiftKey)) this.changeLanguage();
            if (container.classList.contains('functional')) {
                const action = this.specialActions[event.key];
                if (typeof action == 'function') action();
                else if (!action) ;
                else textarea.value += action;
            } else {
                textarea.value += container.textContent;
            }
        })
    }
    pressTheButton(container) {
        const listener = () => {
            document.body.removeEventListener('keyup', listener)
            container.classList.remove('_press');
        }
        container.classList.add('_press');
        document.body.addEventListener('keyup', listener)
    }
}

class Button {
    constructor(object, parent) {
        this.parent = parent
        const { key, code, shift, extras, end } = object;
        this.container = document.createElement('div');
        this.code = code;
        this.key = key;
        this.shift = shift;
        const addition = extras ? extras : ''
        this.container.classList.add('keyboard__button', code, ...addition);
        this.fillKey();
        this.container.addEventListener('click', () => this.clickHandler())
        parent.currow.append(this.container)
        if (end) {
            parent.currow = kboard.currow.cloneNode();
            parent.container.append(kboard.currow)
        }
        return this;
    }
    fillKey() {
        if (this.key.match(/Arrow/)) {
            let className = this.key.split('Arrow')[1].toLowerCase();
            this.container.innerHTML = `<i class="arrow ${className}"></i>`

        } else if (this.key === 'Control') {
            this.container.textContent = 'ctrl';
        } else if (this.key === 'CapsLock') this.container.textContent = 'Caps';
        else if (this.key === 'Delete') this.container.textContent = 'Del'
        else {
            this.container.textContent = this.key;
        }  
    }
    updateWithData(object) {
        const { key, code, shift } = object;
        this.code = code;
        this.shift = shift;
        this.key = key;
        this.fillKey();
    }
    clickHandler() {
        this.container.classList.add('_press')
        setTimeout(() => this.container.classList.remove('_press'), 100)
        if (!this.container.classList.contains('functional')) {
            textarea.value += this.container.textContent;
        }
        if (this.container.classList.contains('CapsLock')) this.parent.capsHandler();
        else if (this.container.classList.contains('functional')) {
            const action = this.parent.specialActions[this.key];
            if (typeof action == 'function') action();
            else if (!action) ;
            else textarea.textContent += action;
        }
        else if (this.code == 'CapsLock') {
            this.parent.capsHandler()
        }
    }

}
function moveLeft() {
    textarea.selectionEnd--;
}
function moveRight() {
    textarea.selectionStart++;
}
function deletePrev() {
    const pos = textarea.selectionEnd;
    const last = textarea.value.slice(pos, textarea.value.length);
    textarea.value = textarea.value.slice(0, pos - 1) + last;
    textarea.selectionEnd = pos - 1;
}
function deleteNext() {
    const pos = textarea.selectionEnd;
    const last = textarea.value.slice(pos + 1, textarea.value.length);
    textarea.value = textarea.value.slice(0, pos) + last;
    textarea.selectionEnd = pos;
}
const kboard = new Keyboard(document.body);
kboard.init()