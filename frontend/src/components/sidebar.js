import {Auth} from "../services/auth.js";
import {CustomHttp} from "../services/custom-http.js";
import config from "../../config/config.js";

export class Sidebar {
    constructor() {
        this.sidebar = document.getElementById('sidebar');
        this.closeSidebar = document.getElementById('close-sidebar');
        const userIconActive = document.getElementById('user-icon-active');
        const menuLogout = document.getElementById('menu-logout');
        const profile = document.getElementById('profile-full-name');
        const links = document.querySelector('.sidebar-content').querySelectorAll('a');
        this.balance = document.getElementById('balance');

        document.getElementById('to-income').setAttribute("href", "/#/income?categoryType=" + 'income');;
        document.getElementById('to-expenses').setAttribute("href", "/#/expenses?categoryType=" + 'expense');

        document.getElementById('burger').addEventListener("click", this.openSidebar.bind(this));
        this.closeSidebar.addEventListener("click", this.hideSidebar.bind(this));

        this.getBalance();

        userIconActive.onclick = function openMenuLogout(e) {
            e.preventDefault();
            menuLogout.style.display = 'block';
        }

        const userInfo = Auth.getUserInfo();
        const accessToken = localStorage.getItem(Auth.accessTokenKey);
        if (userInfo && accessToken) {
            if (profile) {
                profile.innerText = userInfo.name + ' ' + userInfo.lastName;
            }
        }

        const urlRoute = window.location.hash.split('?')[0];

        const linksArr = Array.from(links);
        linksArr.forEach(link => {
            link.classList.remove('active');
        });
        const linkActive = linksArr.find(link => {
            const linkId = link.getAttribute('href');

            return linkId?.indexOf(urlRoute) !== -1;
        })
        if (linkActive) {
            linkActive.classList.add('active');
        }
    }

    openSidebar(e) {
        e.preventDefault();
        this.closeSidebar.style.display = 'block';
        this.sidebar.style.left = '0';
    }

    hideSidebar(e) {
        e.preventDefault();
        this.closeSidebar.style.display = 'none';
        this.sidebar.style.left = '-250px';
    }

    async getBalance() {
        const result = await CustomHttp.request(config.host + '/balance', 'GET');
        if (result.error) {
            throw new Error(result.message);
        }
        this.balance.innerText = result.balance + ' $';
    }

}