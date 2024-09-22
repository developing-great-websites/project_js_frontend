import {CustomHttp} from "../services/custom-http.js";
import {Auth} from "../services/auth.js";
import config from "../../config/config.js";

export class Form {

    constructor(page) {
        this.processElement = null;
        this.page = page;

        const accessToken = localStorage.getItem(Auth.accessTokenKey);
        if (accessToken) {
            location.href = '#/main';
            return;
        }

        this.fields = [
            {
                name: 'email',
                id: 'email',
                element: null,
                regex: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
                valid: false,
            },
            {
                name: 'password',
                id: 'password',
                element: null,
                regex: /^(?=.*\d)(?=.*[0-9])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/,
                valid: false,
            },
        ];

        if (this.page === 'signup') {

            this.fields.unshift({
                name: 'fullName',
                id: 'fullName',
                element: null,
                regex: /^([A-ZА-ЯЁ][a-zа-яё]{1,})\s([A-ZА-ЯЁ][a-zа-яё]{1,})\s([A-ZА-ЯЁ][a-zа-яё]{1,})*$/,
                valid: false,
            });

            this.fields.push({
                name: 'passwordRepeat',
                id: 'passwordRepeat',
                element: null,
                regex: null,
                valid: false,
            });

        }

        const that = this;
        this.fields.forEach(item => {
            item.element = document.getElementById(item.id);
            item.element.onchange = function () {
                that.validateField.call(that, item, this)
            }
        });

        this.processElement = document.getElementById('process');
        this.processElement.onclick = function (event) {
            event.preventDefault();
            that.processForm();
        }
    }

    validateField(field, element) {
        if (!element.value || !element.value.match(field.regex)) {
            element.classList.add('is-invalid');
            field.valid = false;
            element.nextElementSibling.classList.add('d-block');
        } else {
            element.classList.remove('is-invalid');
            field.valid = true;
            element.nextElementSibling.classList.remove('d-block');
        }
        if (this.page === 'signup') {
            this.validatePassword();
        }
        this.validateForm();
    }

    validatePassword() {
        const fieldRepeatPassword = this.fields.find(item => item.id === 'passwordRepeat');
        const validPassword = this.fields.find(item => item.id === 'password').element.value;
        const validRepeatPassword = fieldRepeatPassword.element.value;
        const repeatPasswordElement = fieldRepeatPassword.element;
        if (validPassword !== validRepeatPassword) {
            repeatPasswordElement.classList.add('is-invalid');
            fieldRepeatPassword.valid = false;
            repeatPasswordElement.nextElementSibling.classList.remove('d-block');
        } else {
            repeatPasswordElement.classList.remove('is-invalid');
            fieldRepeatPassword.valid = true;
            repeatPasswordElement.nextElementSibling.classList.remove('d-block');
        }
    }

    validateForm() {
        const validForm = this.fields.every(item => item.valid);
        if (validForm) {
            this.processElement.removeAttribute('disabled');
        } else {
            this.processElement.setAttribute('disabled', 'disabled');
        }
        return validForm;
    }

    async processForm() {
        if (this.validateForm()) {
            const email = this.fields.find(item => item.name === 'email').element.value;
            const password = this.fields.find(item => item.name === 'password').element.value;

            if (this.page === 'signup') {
                try {
                    const [lastName, name] = this.fields.find(item => item.name === 'fullName').element.value.split(' ');
                    const result = await CustomHttp.request(config.host + '/signup', 'POST', {
                        name: name,
                        lastName: lastName,
                        email: email,
                        password: password,
                        passwordRepeat: this.fields.find(item => item.name === 'passwordRepeat').element.value,
                    });

                    if (result) {
                        if (result.error || !result.user) {
                            throw new Error(result.message);
                        }
                    }
                } catch (error) {
                    return console.log(error);
                }

            }
            try {
                const result = await CustomHttp.request(config.host + '/login', 'POST', {
                    email: email,
                    password: password,
                    // rememberMe: false,
                });

                if (result) {
                    const tokens = result.tokens;
                    const user = result.user;
                    if (result.error || (tokens && (!tokens.accessToken || !tokens.refreshToken)) || (user && (!user.name || !user.lastName || !user.id))) {
                        throw new Error(result.message);
                    }

                    Auth.setTokens(tokens.accessToken, tokens.refreshToken);
                    Auth.setUserInfo({
                        name: user.name,
                        lastName: user.lastName,
                        email: email,
                        userId: user.id
                    })
                    location.href = '#/main';
                }
            } catch (error) {
                console.log(error);
            }

        }
    }

}

