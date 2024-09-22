import {CustomHttp} from "../services/custom-http.js";
import config from "../../config/config.js";

export class Filters {
    constructor() {
        this.getButtons();
    }

    getButtons() {
        this.btnToday = document.getElementById('btnToday');
        this.btnWeek = document.getElementById('btnWeek');
        this.btnMonth = document.getElementById('btnMonth');
        this.btnYear = document.getElementById('btnYear');
        this.btnAll = document.getElementById('btnAll');
        this.btnInterval = document.getElementById('btnInterval');
        this.dateFrom = document.getElementById('dateFrom');
        this.dateTo = document.getElementById('dateTo');
    }

    async filterOperationToday() {
        this.btnClassClear();
        this.btnToday.classList.remove('btn-outline-secondary');
        this.btnToday.classList.add('btn-secondary');
        return await CustomHttp.request(config.host + '/operations?period=today', 'GET');
    }

    async filterOperationWeek() {
        this.btnClassClear();
        this.btnWeek.classList.remove('btn-outline-secondary');
        this.btnWeek.classList.add('btn-secondary');
        return await CustomHttp.request(config.host + '/operations?period=week', 'GET');
    }

    async filterOperationMonth() {
        this.btnClassClear();
        this.btnMonth.classList.remove('btn-outline-secondary');
        this.btnMonth.classList.add('btn-secondary');
        return await CustomHttp.request(config.host + '/operations?period=month', 'GET');
    }

    async filterOperationYear() {
        this.btnClassClear();
        this.btnYear.classList.remove('btn-outline-secondary');
        this.btnYear.classList.add('btn-secondary');
        return await CustomHttp.request(config.host + '/operations?period=year', 'GET');
    }

    async filterOperationAll() {
        this.btnClassClear();
        this.btnAll.classList.remove('btn-outline-secondary');
        this.btnAll.classList.add('btn-secondary');
        return await CustomHttp.request(config.host + '/operations?period=all', 'GET');
    }

    async filterOperationInterval() {
        this.btnClassClear();
        this.btnInterval.classList.remove('btn-outline-secondary');
        this.btnInterval.classList.add('btn-secondary');
        this.dateFrom.disabled = false;
        this.dateTo.disabled = false;
    }

    btnClassClear() {
        document.querySelectorAll('#filter button').forEach(item => {
            item.classList.remove('btn-secondary');
            item.classList.add('btn-outline-secondary');
        });
    }

}