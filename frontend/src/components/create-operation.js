import {UrlManager} from "../utils/url-manager.js";
import {CustomHttp} from "../services/custom-http.js";
import config from "../../config/config.js";

export class CreateOperation {
    constructor() {
        this.incomeSelected = document.getElementById('incomeSelected');
        this.expenseSelected = document.getElementById('expenseSelected');
        this.records = document.getElementById('records');
        this.sumInputElement = document.getElementById('sumInput');
        this.dateInputElement = document.getElementById('dateInput');
        this.commentInputElement = document.getElementById('commentInput');

        document.getElementById('cancelOperationButton').addEventListener('click', this.cancel.bind(this));

        this.routeParams = UrlManager.getQueryParams();
        if (!this.routeParams.type) {
            location.href = '/#/operations';
        }

        this.getCategory().then();
    }

    async getCategory() {
        const result = await CustomHttp.request(config.host + `/categories/${this.routeParams.type}`, 'GET');
        if (result) {
            if (result.error) {
                throw new Error(result.message);
            }
            this.createOperation(result);
        }
    }

    createOperation(result) {
        if (this.routeParams.type === 'income') {
            this.incomeSelected.setAttribute('selected', true);

        } else if (this.routeParams.type === 'expense') {
            this.expenseSelected.setAttribute('selected', true);
        }
        result.forEach((item) => {
            const categoryElement = document.createElement('option');
            categoryElement.setAttribute('value', item.id);
            categoryElement.innerText = item.title;
            this.records.appendChild(categoryElement);
        });

        document.getElementById('saveOperationButton').addEventListener('click', this.saveOperation.bind(this));
    }

    async saveOperation() {
        const createData = {
            type: this.routeParams.type,
            amount: this.sumInputElement.value,
            date: this.dateInputElement.value,
            comment: this.commentInputElement.value,
            category_id: Number(this.records.value)
        }

        const result = await CustomHttp.request(config.host + '/operations', 'POST', createData);
        console.log(result);
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