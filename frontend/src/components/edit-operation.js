import {UrlManager} from "../utils/url-manager.js";
import {CustomHttp} from "../services/custom-http.js";
import config from "../../config/config.js";

export class EditOperation {
    constructor() {
        this.incomeSelected = document.getElementById('incomeSelected');
        this.expenseSelected = document.getElementById('expenseSelected');
        this.records = document.getElementById('records');
        this.sumInputElement = document.getElementById('sumInput');
        this.dateInputElement = document.getElementById('dateInput');
        this.commentInputElement = document.getElementById('commentInput');
        document.getElementById('cancelButton').addEventListener('click', this.cancel.bind(this));

        this.routeParams = UrlManager.getQueryParams();
        if (!this.routeParams.id) {
            location.href = '/#/main';
        }

        this.getOperation().then();
    }

    async getOperation() {
        const operation = await CustomHttp.request(config.host + '/operations/' + this.routeParams.id, 'GET');
        console.log(operation);

        this.showOperation(operation);
    }

    showOperation(operation) {
        this.sumInputElement.value = operation.amount;
        this.dateInputElement.value = operation.date;
        this.commentInputElement.value = operation.comment;
        this.categoryTitle = operation.category;
        this.operationType = operation.type;
        if (this.operationType === 'income') {
            this.incomeSelected.setAttribute('selected', true);
        } else if (this.operationType === 'expense') {
            this.expenseSelected.setAttribute('selected', true);
        }

        this.getCategories().then();
        document.getElementById('updateOperation').addEventListener('click', this.updateOperation.bind(this));
    }

    async getCategories() {
        const result = await CustomHttp.request(config.host + `/categories/${this.operationType}`, 'GET');
        if (result) {
            if (result.error) {
                throw new Error(result.message);
            }
        }
        result.forEach((item) => {
            const categoryElement = document.createElement('option');
            categoryElement.setAttribute('value', item.id);
            categoryElement.innerText = item.title;
            this.records.appendChild(categoryElement);
            if (item.title === this.categoryTitle) {
                categoryElement.setAttribute('selected', true);
            }
        });
    }

    async updateOperation() {
        const createDataOperation = {
            type: this.operationType,
            amount: this.sumInputElement.value,
            date: this.dateInputElement.value,
            comment: this.commentInputElement.value,
            category_id: Number(this.records.value)
        }

        const result = await CustomHttp.request(config.host + '/operations/' + this.routeParams.id, 'PUT', createDataOperation);

        if (result) {
            if (result.error) {
                throw new Error(result.message);
            }
            return location.href = '/#/operations';
        }
    }

    cancel() {
        location.href = '/#/operations';
    }
}

