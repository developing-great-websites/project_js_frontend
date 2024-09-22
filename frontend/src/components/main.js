import Chart from 'chart.js/auto';
import {CustomHttp} from "../services/custom-http.js";
import config from "../../config/config.js";
import {Filters} from "./filters.js";

export class Main extends Filters {
    constructor() {
        super();

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
        this.destroyCharts();

        super.filterOperationToday().then(operations => {
            if(operations) {
                this.expensesChart = this.showChart(operations, 'expense', 'expensesChart');
                this.incomeChart = this.showChart(operations, 'income', 'incomeChart');
            }
        });
    }

    async filterOperationWeek() {
        this.destroyCharts();

        super.filterOperationWeek().then(operations => {
            this.expensesChart = this.showChart(operations, 'expense', 'expensesChart');
            this.incomeChart = this.showChart(operations, 'income', 'incomeChart');
        });
    }

    async filterOperationMonth() {
        this.destroyCharts();

        super.filterOperationMonth().then(operations => {
            this.expensesChart = this.showChart(operations, 'expense', 'expensesChart');
            this.incomeChart = this.showChart(operations, 'income', 'incomeChart');
        });
    }

    async filterOperationYear() {
        this.destroyCharts();

        super.filterOperationYear().then(operations => {
            this.expensesChart = this.showChart(operations, 'expense', 'expensesChart');
            this.incomeChart = this.showChart(operations, 'income', 'incomeChart');
        });
    }

    async filterOperationAll() {
        this.destroyCharts();

        super.filterOperationAll().then(operations => {
            this.expensesChart = this.showChart(operations, 'expense', 'expensesChart');
            this.incomeChart = this.showChart(operations, 'income', 'incomeChart');
        });
    }

    async filterOperationInterval() {
        this.destroyCharts();

        super.filterOperationInterval().then();
        const dateFrom = this.dateFrom.value;
        const dateTo = this.dateTo.value;
        if (dateFrom && dateTo) {
            const operations = await CustomHttp.request(config.host + '/operations?period=interval' + '&dateFrom=' + dateFrom + '&dateTo=' + dateTo, 'GET');
            this.expensesChart = this.showChart(operations, 'expense', 'expensesChart');
            this.incomeChart = this.showChart(operations, 'income', 'incomeChart');
        }
    }

    destroyCharts() {
        if (this.incomeChart) {
            this.incomeChart.destroy();
        }
        if (this.expensesChart) {
            this.expensesChart.destroy();
        }
    }

    showChart(operations, operationType, chartId) {
        const canvas = document.getElementById(chartId);
        const operationsType = operations.filter(operation => operation.type === operationType);
        const categories = operationsType.map(function (categoryTitle) {
            return categoryTitle.category;
        });
        const categoriesArray = Array.from(new Set(categories));

        const operationsAmounts = [];
        categoriesArray.forEach(category => {
            const amounts = operationsType.filter(operation => operation.category === category)
                               .map(operation => operation.amount)
                                   .reduce((acc, value) => { return acc + value }, 0);
            operationsAmounts.push(amounts);
        });

        let labels = [];
        let colors = [];
        let dynamicColors = function () {
            const r = Math.floor(Math.random() * 255);
            const g = Math.floor(Math.random() * 255);
            const b = Math.floor(Math.random() * 255);
            return "rgb(" + r + "," + g + "," + b + ")";
        };

        for (let i = 0; i < categoriesArray.length; i++) {
            colors.push(dynamicColors());
            labels.push(categoriesArray[i]);
        }

        let data = {
            labels: labels,
            datasets: [
                {
                    data: operationsAmounts,
                    backgroundColor: colors
                }]
        };

        return new Chart(canvas, {
            type: 'pie',
            data: data
        });
    }
}