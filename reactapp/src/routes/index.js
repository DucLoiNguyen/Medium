import Home from "~/pages/Home/home.component";
import Account from "~/pages/Account/account.component";
import Start from "~/pages/Start/Start.component";
import Notification from "~/pages/Notifi/notification.component";
import Profile from "~/pages/Profile/profile.component";
import Library from "~/pages/Library/library.component";
import Story from "~/pages/Stories/stories.component";
import Setting from "~/pages/Setting/setting.component";
import Refine from "~/pages/Refine/refine.component";
import Explore from "~/pages/Topic/explore.component";
import Tag from "~/pages/Tag/tag.component";
import Login from "~/pages/Authen/login";
import Register from "~/pages/Authen/register";
import CreatePost from "~/pages/Create/createpost.component";
import {
  DefaultLayout,
  Startlayout,
  ProfileLayout,
  SettingLayout,
  TopicLayout,
  AuthenLayout,
  CreatePostLayout,
} from "~/components/layouts";

// public routes
const publicRoutes = [
  { path: "/register", component: Register, layout: AuthenLayout },
  { path: "/signin", component: Login, layout: AuthenLayout },
  { path: "/home/tag/:id", component: Tag, layout: TopicLayout },
  { path: "/home/explore", component: Explore, layout: TopicLayout },
  { path: "/home/new-story", component: CreatePost, layout: CreatePostLayout },
  { path: "/home/refine/:id", component: Refine, layout: SettingLayout },
  { path: "/home/refine/", component: Refine, layout: SettingLayout },
  { path: "/home/setting", component: Setting, layout: SettingLayout },
  { path: "/home/story", component: Story, layout: DefaultLayout },
  { path: "/home/library", component: Library, layout: DefaultLayout },
  { path: "/home/profile", component: Profile, layout: ProfileLayout },
  {
    path: "/home/notifications",
    component: Notification,
    layout: DefaultLayout,
  },
  { path: "/home", component: Home, layout: DefaultLayout },
  { path: "/account", component: Account, layout: DefaultLayout },
  { path: "/", component: Start, layout: Startlayout },
];

// private routes
const privateRoutes = [];

export { privateRoutes, publicRoutes };
