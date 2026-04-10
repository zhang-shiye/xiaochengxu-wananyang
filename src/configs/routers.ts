import LOGIN from '../pages/login.jsx';
import HOME from '../pages/home.jsx';
import LEAVE from '../pages/leave.jsx';
import BILL from '../pages/bill.jsx';
import BIND_SENIOR from '../pages/bind-senior.jsx';
import WECHAT_LOGIN from '../pages/wechat-login.jsx';
import CARE_HOME from '../pages/care-home.jsx';
import ADMIN_DASHBOARD from '../pages/admin-dashboard.jsx';
import ADMIN_LEAVE-REVIEW from '../pages/admin-leave-review.jsx';
import ADMIN_BILL-REVIEW from '../pages/admin-bill-review.jsx';
import ADMIN_DAILY-REVIEW from '../pages/admin-daily-review.jsx';
import ADMIN_VERIFICATION-CODE from '../pages/admin-verification-code.jsx';
import ADMIN_DATA-IMPORT from '../pages/admin-data-import.jsx';
import ADMIN_HOME from '../pages/admin-home.jsx';
import ADMIN_DAILY from '../pages/admin-daily.jsx';
import ADMIN_LEAVE from '../pages/admin-leave.jsx';
import ADMIN_BILL from '../pages/admin-bill.jsx';
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
  id: "admin-leave-review",
  component: ADMIN_LEAVE-REVIEW
}, {
  id: "admin-bill-review",
  component: ADMIN_BILL-REVIEW
}, {
  id: "admin-daily-review",
  component: ADMIN_DAILY-REVIEW
}, {
  id: "admin-verification-code",
  component: ADMIN_VERIFICATION-CODE
}, {
  id: "admin-data-import",
  component: ADMIN_DATA-IMPORT
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
}]