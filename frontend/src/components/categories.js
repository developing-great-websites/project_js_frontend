import {UrlManager} from "../utils/url-manager.js";
import {CustomHttp} from "../services/custom-http.js";
import config from "../../config/config.js";

export class Categories {
    constructor() {
        this.routeParams = UrlManager.getQueryParams();
        if (!this.routeParams.categoryType) {
            location.href = '/#/main';
        }

        this.getCategories().then();
    }

    async getCategories() {
        const result = await CustomHttp.request(config.host + `/categories/${this.routeParams.categoryType}`, 'GET');
        if (result) {
            if (result.error) {
                throw new Error(result.message);
            }
            this.showCategories(result);
        }
    }

    showCategories(result) {
        const categoriesElement = document.getElementById('categories');

        result.forEach((item) => {
            const categoryElement = document.createElement('div');
            categoryElement.classList.add('category-item', 'card', 'p-3');
            const titleElement = document.createElement('h2');
            titleElement.classList.add('card-title', 'fw-bold', 'mb-3');
            titleElement.innerHTML = item.title;
            categoryElement.appendChild(titleElement);

            const categoryAction = document.createElement('div');
            const categoryActionEdit = document.createElement('a');
            categoryActionEdit.classList.add('btn', 'btn-primary', 'me-2');
            categoryActionEdit.innerText = 'Редактировать';
            if(this.routeParams.categoryType === 'income') {
                categoryActionEdit.setAttribute("href", "/#/income/edit-category-income?id=" + item.id + "&title=" + item.title);
            }
            if(this.routeParams.categoryType === 'expense') {
                categoryActionEdit.setAttribute("href", "/#/expenses/edit-category-expenses?id=" + item.id + "&title=" + item.title);
            }
            categoryAction.appendChild(categoryActionEdit);

            const categoryActionDelete = document.createElement('button');
            categoryActionDelete.classList.add('btn', 'btn-danger');
            categoryActionDelete.innerText = 'Удалить';
            categoryActionDelete.setAttribute("data-category", item.id);
            categoryActionDelete.setAttribute("data-bs-toggle", "modal");
            categoryActionDelete.setAttribute("data-bs-target", "#staticBackdrop");
            categoryAction.appendChild(categoryActionDelete);

            categoryElement.appendChild(categoryAction);
            categoriesElement.appendChild(categoryElement);
        });

        const categoryCreateElement = document.createElement('a');
        categoryCreateElement.classList.add('category-item', 'card', 'p-3', 'd-flex', 'justify-content-center', 'align-items-center');
        const icon = '<svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">\n' + ' <path d="M14.5469 6.08984V9.05664H0.902344V6.08984H14.5469ZM9.32422 0.511719V15.0039H6.13867V0.511719H9.32422Z"\n' +
            'fill="#CED4DA"/>\n' + '</svg>';
        categoryCreateElement.innerHTML = icon;

        if(this.routeParams.categoryType === 'income') {
            categoryCreateElement.setAttribute("href", "/#/income/create-category-income");
        } else if(this.routeParams.categoryType === 'expense') {
            categoryCreateElement.setAttribute("href", "/#/expenses/create-category-expenses");
        }

        categoriesElement.appendChild(categoryCreateElement);

        categoriesElement.addEventListener('click', (e) => {
            const currentCategoryDelete = e.target.getAttribute('data-category');
            const buttonElement = e.target;
            if (currentCategoryDelete) {
                document.getElementById('deleteCategory').addEventListener('click', (e) => {
                    this.deleteCategory(currentCategoryDelete).then(() => {
                        buttonElement.parentElement.parentElement.remove();
                    });
                });
            }
        });
    }

    async deleteCategory(categoryId) {
        const result = await CustomHttp.request(config.host + `/categories/${this.routeParams.categoryType}/` + categoryId, 'DELETE');
        if (result.error) {
            throw new Error(result.message);
        }
    }

}