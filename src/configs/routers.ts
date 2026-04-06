import LOGIN from '../pages/login.jsx';
import HOME from '../pages/home.jsx';
import LEAVE from '../pages/leave.jsx';
import BILL from '../pages/bill.jsx';
import BIND_SENIOR from '../pages/bind-senior.jsx';
import WECHAT_LOGIN from '../pages/wechat-login.jsx';
import CARE_HOME from '../pages/care-home.jsx';
import ADMIN_DASHBOARD from '../pages/admin-dashboard.jsx';
import ADMIN_ELDERS from '../pages/admin-elders.jsx';
import ADMIN_REPORTS from '../pages/admin-reports.jsx';
import ADMIN_LEAVES from '../pages/admin-leaves.jsx';
import ADMIN_BILLS from '../pages/admin-bills.jsx';
import ADMIN_UPLOAD from '../pages/admin-upload.jsx';
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
  id: "care-home",
  component: CARE_HOME
}, {
  id: "admin-dashboard",
  component: ADMIN_DASHBOARD
}, {
  id: "admin-elders",
  component: ADMIN_ELDERS
}, {
  id: "admin-reports",
  component: ADMIN_REPORTS
}, {
  id: "admin-leaves",
  component: ADMIN_LEAVES
}, {
  id: "admin-bills",
  component: ADMIN_BILLS
}, {
  id: "admin-upload",
  component: ADMIN_UPLOAD
}]