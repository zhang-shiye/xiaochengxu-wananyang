import LOGIN from '../pages/login.jsx';
import HOME from '../pages/home.jsx';
import LEAVE from '../pages/leave.jsx';
import BILL from '../pages/bill.jsx';
import BIND_SENIOR from '../pages/bind-senior.jsx';
import WECHAT_LOGIN from '../pages/wechat-login.jsx';
import ADMIN_HOME from '../pages/admin-home.jsx';
import ADMIN_DAILY from '../pages/admin-daily.jsx';
import ADMIN_LEAVE from '../pages/admin-leave.jsx';
import ADMIN_BILL from '../pages/admin-bill.jsx';
import ADMIN_ELDER from '../pages/admin-elder.jsx';
import ADMIN_DATA from '../pages/admin-data.jsx';
import CARE from '../pages/care.jsx';
import ADMIN_BRAND from '../pages/admin-brand.jsx';
export const routers = [{
  id: "login",
  component: LOGIN
}, {
  id: "home",
  component: HOME
}, {
  id: "leave",
  component: LEAVE
}, {
  id: "bill",
  component: BILL
}, {
  id: "bind-senior",
  component: BIND_SENIOR
}, {
  id: "wechat-login",
  component: WECHAT_LOGIN
}, {
  id: "admin-home",
  component: ADMIN_HOME
}, {
  id: "admin-daily",
  component: ADMIN_DAILY
}, {
  id: "admin-leave",
  component: ADMIN_LEAVE
}, {
  id: "admin-bill",
  component: ADMIN_BILL
}, {
  id: "admin-elder",
  component: ADMIN_ELDER
}, {
  id: "admin-data",
  component: ADMIN_DATA
}, {
  id: "care",
  component: CARE
}, {
  id: "admin-brand",
  component: ADMIN_BRAND
}]