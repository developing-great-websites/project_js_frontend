import {Form} from "./components/form.js";
import {Auth} from "./services/auth.js";
import {Sidebar} from "./components/sidebar.js";
import {Categories} from "./components/categories.js";
import {CreateCategory} from "./components/create-category.js";
import {EditCategory} from "./components/edit-category.js";
import {Operations} from "./components/operations.js";
import {CreateOperation} from "./components/create-operation.js";
import {EditOperation} from "./components/edit-operation.js";
import {Main} from "./components/main.js";

export class Router {
    constructor() {
        this.contentElement = document.getElementById('content');
        this.tytleElement = document.getElementById('page-title');

        this.routes = [
            {
                route: '#/',
                title: 'Вход в систему',
                template: 'templates/login.html',
                load: () => {
                    new Form('login');
                }
            },
            {
                route: '#/signup',
                title: 'Регистрация',
                template: 'templates/signup.html',
                load: () => {
                    new Form('signup');
                }
            },
            {
                route: '#/main',
                title: 'Главная',
                template: 'templates/main.html',
                load: () => {
                    new Main();
                }
            },
            {
                route: '#/income',
                title: 'Доходы',
                template: 'templates/income.html',
                load: () => {
                    new Categories();
                }
            },
            {
                route: '#/income/create-category-income',
                title: 'Создание категории доходов',
                template: 'templates/create-category-income.html',
                load: () => {
                    new CreateCategory('title-income', 'income', '/categories/income', '/#/income');
                }
            },
            {
                route: '#/income/edit-category-income',
                title: 'Редактирование категории доходов',
                template: 'templates/edit-category-income.html',
                load: () => {
                    new EditCategory('title-income', 'income', '/categories/income/', '/#/income');
                }
            },
            {
                route: '#/expenses',
                title: 'Расходы',
                template: 'templates/expenses.html',
                load: () => {
                    new Categories();
                }
            },
            {
                route: '#/expenses/create-category-expenses',
                title: 'Создание категории расходов',
                template: 'templates/create-category-expenses.html',
                load: () => {
                    new CreateCategory('title-expenses', 'expense', '/categories/expense', '/#/expenses');
                }
            },
            {
                route: '#/expenses/edit-category-expenses',
                title: 'Редактирование категории расходов',
                template: 'templates/edit-category-expenses.html',
                load: () => {
                    new EditCategory('title-expenses', 'expense', '/categories/expense/', '/#/expenses');
                }
            },
            {
                route: '#/operations',
                title: 'Доходы и расходы',
                template: 'templates/operations.html',
                load: () => {
                    new Operations();
                }
            },
            {
                route: '#/operations/create-operation',
                title: 'Создание дохода/расхода',
                template: 'templates/create-operation.html',
                load: () => {
                    new CreateOperation();
                }
            },
            {
                route: '#/operations/edit-operation',
                title: 'Редактирование дохода/расхода',
                template: 'templates/edit-operation.html',
                load: () => {
                    new EditOperation();
                }
            }
        ]
    }

    async openRoute() {
        const urlRoute = window.location.hash.split('?')[0];
        if (urlRoute === '#/logout') {
            await Auth.logout();
            window.location.href = '#/';
            this.sidebar = null;
            return;
        }

        const newRoute = this.routes.find(item => {
            return item.route === urlRoute;
        });

        if (!newRoute) {
            window.location.href = '#/';
            return;
        }

        this.contentElement.innerHTML = await fetch(newRoute.template).then(response => response.text());
        this.tytleElement.innerText = newRoute.title;

        const userInfo = Auth.getUserInfo();
        const accessToken = localStorage.getItem(Auth.accessTokenKey);
        if (userInfo && accessToken && (newRoute !== '#/login' || newRoute !== '#/signup')) {
            let sidebarTemplateUrl = 'templates/sidebar.html';
            const sidebarContent = await fetch(sidebarTemplateUrl).then(response => response.text());
            this.contentElement.innerHTML = `${sidebarContent}${this.contentElement.innerHTML}`;
            new Sidebar();
        }

        newRoute.load();
    }
}