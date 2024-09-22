import {UrlManager} from "../utils/url-manager.js";
import {CustomHttp} from "../services/custom-http.js";
import config from "../../config/config.js";

export class EditCategory {
    constructor(titleId, categoryType, urlSave, urlForReturn) {
        this.routeParams = UrlManager.getQueryParams();
        if (!this.routeParams.id) {
            location.href = '/#/main';
        }
        this.titleId = titleId;
        this.categoryType = categoryType;
        this.urlSave = urlSave;
        this.urlForReturn = urlForReturn;

        this.categoryTitle = document.getElementById(this.titleId);
        this.categoryTitle.value = this.routeParams.title;

        document.getElementById('updateButton').addEventListener('click', this.saveCategory.bind(this));
        document.getElementById('cancelButton').addEventListener('click', this.cancel.bind(this));

    }

    async saveCategory() {
        if (this.categoryTitle.value) {
            const createData = {
                title: this.categoryTitle.value
            };

            const result = await CustomHttp.request(config.host + this.urlSave + this.routeParams.id, 'PUT', createData);
            console.log(result);
            if (result) {
                if (result.error) {
                    throw new Error(result.message);
                }
                return location.href = this.urlForReturn + '?categoryType=' + this.categoryType;;
            }
        }
    }

    cancel() {
        location.href = this.urlForReturn;
    }
}