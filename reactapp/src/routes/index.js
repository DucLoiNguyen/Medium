import Home from '~/pages/Home/home.component';
import Account from '~/pages/Account/account.component';
import Start from '~/pages/Start/Start.component'
import { DefaultLayout, Startlayout } from '~/components/layouts';

// public routes
const publicRoutes = [
    { path : '/', component: Home, layout: DefaultLayout},
    { path : '/account', component: Account, layout: DefaultLayout},
    { path : '/getstart', component: Start, layout: Startlayout}
];

// private routes
const privateRoutes = [];

export {privateRoutes, publicRoutes}