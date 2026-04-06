import LOGIN from '../pages/login.jsx';
import HOME from '../pages/home.jsx';
import LEAVE from '../pages/leave.jsx';
import BILL from '../pages/bill.jsx';
import BIND_SENIOR from '../pages/bind-senior.jsx';
import WECHAT_LOGIN from '../pages/wechat-login.jsx';
import CARE_HOME from '../pages/care-home.jsx';
import ADMIN_LOGIN from '../pages/admin-login.jsx';
import ADMIN_DASHBOARD from '../pages/admin-dashboard.jsx';
import CAREGIVER_TASKS from '../pages/caregiver-tasks.jsx';
import SENIOR_MANAGEMENT from '../pages/senior-management.jsx';
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
  id: "admin-login",
  component: ADMIN_LOGIN
}, {
  id: "admin-dashboard",
  component: ADMIN_DASHBOARD
}, {
  id: "caregiver-tasks",
  component: CAREGIVER_TASKS
}, {
  id: "senior-management",
  component: SENIOR_MANAGEMENT
}]