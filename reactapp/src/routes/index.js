import Home from '~/pages/Home/home.component';
import Account from '~/pages/Account/account.component';

// public routes
const publicRoutes = [
    { path : '/', component: Home},
    { path : '/account', component: Account}
];

// private routes
const privateRoutes = [];

export {privateRoutes, publicRoutes}