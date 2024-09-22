import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.min.js';
import '../styles/login.css';
import '../styles/common.css';
import '../styles/adaptive.css';

import {Router} from "./router.js";

class App {
    constructor() {
        this.router = new Router();
        window.addEventListener('DOMContentLoaded', this.handleRouteChanging.bind(this));
        window.addEventListener('popstate', this.handleRouteChanging.bind(this));
    }

    handleRouteChanging() {
        this.router.openRoute();
    }

}

(new App());