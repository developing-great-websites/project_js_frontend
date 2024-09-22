import {CustomHttp} from "../services/custom-http.js";
import config from "../../config/config.js";
import {Filters} from "./filters.js";

export class Operations extends Filters {
    constructor() {
        super();
        this.createIncomeButton = document.getElementById('createIncome');
        this.createExpenseButton = document.getElementById('createExpense');
        this.recordsElement = document.getElementById('records');

        this.createIncomeButton.addEventListener('click', this.createIncome.bind(this));
        this.createExpenseButton.addEventListener('click', this.createExpense.bind(this));
        this.btnToday.addEventListener('click', this.filterOperationToday.bind(this));
        this.btnWeek.addEventListener('click', this.filterOperationWeek.bind(this));
        this.btnMonth.addEventListener('click', this.filterOperationMonth.bind(this));
        this.btnYear.addEventListener('click', this.filterOperationYear.bind(this));
        this.btnAll.addEventListener('click', this.filterOperationAll.bind(this));
        this.btnInterval.addEventListener('click', this.filterOperationInterval.bind(this));
        this.dateFrom.addEventListener('change', this.filterOperationInterval.bind(this));
        this.dateTo.addEventListener('change', this.filterOperationInterval.bind(this));

        this.filterOperationToday().then();
    }

    async filterOperationToday() {
        this.recordsElement.innerHTML = '';

        super.filterOperationToday().then(operations => {
            this.showRecords(operations);
        });
    }

    async filterOperationWeek() {
        this.recordsElement.innerHTML = '';

        super.filterOperationWeek().then(operations => {
            this.showRecords(operations);
        });
    }

    async filterOperationMonth() {
        this.recordsElement.innerHTML = '';

        super.filterOperationMonth().then(operations => {
            this.showRecords(operations);
        });
    }

    async filterOperationYear() {
        this.recordsElement.innerHTML = '';

        super.filterOperationYear().then(operations => {
            this.showRecords(operations);
        });
    }

    async filterOperationAll() {
        this.recordsElement.innerHTML = '';

        super.filterOperationAll().then(operations => {
            this.showRecords(operations);
        });
    }

    async filterOperationInterval() {
        this.recordsElement.innerHTML = '';
        super.filterOperationInterval().then();
        const dateFrom = this.dateFrom.value;
        const dateTo = this.dateTo.value;
        if (dateFrom && dateTo) {
            const operations = await CustomHttp.request(config.host + '/operations?period=interval' + '&dateFrom=' + dateFrom + '&dateTo=' + dateTo, 'GET');
            console.log(operations);

            this.showRecords(operations);
        }
    }

    showRecords(operations) {
        for (let i = 0; i < operations.length; i++) {
            const trElement = document.createElement('tr');

            this.dateForTable = new Date(operations[i].date);

            const tdOperation = document.createElement('td');
            tdOperation.innerText = i + 1;
            trElement.appendChild(tdOperation);

            const tdCategoryType = document.createElement('td');
            if (operations[i].type === 'expense') {
                tdCategoryType.innerText = 'расход';
                tdCategoryType.classList.add('text-danger');
            }
            if (operations[i].type === 'income') {
                tdCategoryType.innerText = 'доход';
                tdCategoryType.classList.add('text-success');
            }
            trElement.appendChild(tdCategoryType);

            const tdCategoryTitle = document.createElement('td');
            tdCategoryTitle.innerText = operations[i].category.toLowerCase();
            trElement.appendChild(tdCategoryTitle);

            const tdAmount = document.createElement('td');
            tdAmount.innerText = operations[i].amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ") + '$';
            trElement.appendChild(tdAmount);

            const tdDate = document.createElement('td');
            tdDate.innerText = this.dateForTable.toLocaleDateString();
            trElement.appendChild(tdDate);

            const tdComment = document.createElement('td');
            tdComment.innerText = operations[i].comment;
            trElement.appendChild(tdComment);

            const tdIcons = document.createElement('td');
            tdIcons.classList.add('d-flex');
            const deleteIconElement = document.createElement('div');
            deleteIconElement.classList.add('me-2');

            const deleteIcon = document.createElement('img');
            deleteIcon.setAttribute('src', 'images/trash-icon.png');
            deleteIcon.setAttribute('data-operation', operations[i].id);
            deleteIcon.setAttribute("data-bs-toggle", "modal");
            deleteIcon.setAttribute("data-bs-target", "#staticBackdrop");
            deleteIconElement.appendChild(deleteIcon);
            tdIcons.appendChild(deleteIconElement);

            const editIconElement = document.createElement('a');
            editIconElement.setAttribute('href', '/#/operations/edit-operation?id=' + operations[i].id);
            const editIcon = document.createElement('img');
            editIcon.setAttribute('src', 'images/pen-icon.png');
            editIconElement.appendChild(editIcon);
            tdIcons.appendChild(editIconElement);

            trElement.appendChild(tdIcons);

            this.recordsElement.appendChild(trElement);

            deleteIconElement.addEventListener('click', (e) => {
                const currentOperationDelete = e.target.getAttribute('data-operation');
                const buttonElement = e.target;
                if (currentOperationDelete) {
                    document.getElementById('deleteOperation').addEventListener('click', (e) => {
                        this.deleteOperation(currentOperationDelete).then(() => {
                            buttonElement.parentElement.parentElement.parentElement.remove();
                        });
                    });
                }
            });
        }
    }

    async deleteOperation(operationId) {
        const result = await CustomHttp.request(config.host + '/operations/' + operationId, 'DELETE');
        if (result.error) {
            throw new Error(result.message);
        }
    }

    createIncome() {
        this.createIncomeButton.setAttribute("href", "/#/operations/create-operation?type=income");
    }

    createExpense() {
        this.createExpenseButton.setAttribute("href", "/#/operations/create-operation?type=expense");
    }
}
