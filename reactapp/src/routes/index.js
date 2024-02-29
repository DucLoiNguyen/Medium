import Home from '~/pages/Home/home.component';
import Account from '~/pages/Account/account.component';
import Start from '~/pages/Start/Start.component'
import Notification from '~/pages/Notifi/notification.component';
import { DefaultLayout, Startlayout } from '~/components/layouts';

// public routes
const publicRoutes = [
    { path : '/home/notifications', component: Notification, layout: DefaultLayout},
    { path : '/home', component: Home, layout: DefaultLayout},
    { path : '/account', component: Account, layout: DefaultLayout},
    { path : '/', component: Start, layout: Startlayout}
];

// private routes
const privateRoutes = [];

export {privateRoutes, publicRoutes}