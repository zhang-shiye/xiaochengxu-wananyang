import LOGIN from '../pages/login.jsx';
import HOME from '../pages/home.jsx';
import LEAVE from '../pages/leave.jsx';
import BILL from '../pages/bill.jsx';
import BIND_SENIOR from '../pages/bind-senior.jsx';
import WECHAT_LOGIN from '../pages/wechat-login.jsx';
import CARE_HOME from '../pages/care-home.jsx';
import ADMIN_DASHBOARD from '../pages/admin-dashboard.jsx';
import DAILY_APPROVAL from '../pages/daily-approval.jsx';
import LEAVE_APPROVAL from '../pages/leave-approval.jsx';
import BILL_APPROVAL from '../pages/bill-approval.jsx';
import BATCH_UPDATE from '../pages/batch-update.jsx';
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
  id: "daily-approval",
  component: DAILY_APPROVAL
}, {
  id: "leave-approval",
  component: LEAVE_APPROVAL
}, {
  id: "bill-approval",
  component: BILL_APPROVAL
}, {
  id: "batch-update",
  component: BATCH_UPDATE
}]