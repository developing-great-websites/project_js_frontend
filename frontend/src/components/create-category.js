import {CustomHttp} from "../services/custom-http.js";
import config from "../../config/config.js";

export class CreateCategory {
    constructor(titleId, categoryType, urlSave, urlForReturn) {
        this.titleId = titleId;
        this.categoryType = categoryType;
        this.urlSave = urlSave;
        this.urlForReturn = urlForReturn;
        document.getElementById('saveButton').addEventListener('click', this.saveCategory.bind(this));
        document.getElementById('cancelButton').addEventListener('click', this.cancel.bind(this));

    }

    async saveCategory() {
        this.categoryTitle = document.getElementById(this.titleId);
        if (this.categoryTitle.value) {
            const createData = {
                title: this.categoryTitle.value
            };

            const result = await CustomHttp.request(config.host + this.urlSave, 'POST', createData);
            console.log(result);
            if (result) {
                if (result.error) {
                    throw new Error(result.message);
                }
                return location.href = this.urlForReturn + '?categoryType=' + this.categoryType;
            }
        }
    }

    cancel() {
        location.href = this.urlForReturn;
    }
}