import LOGIN from '../pages/login.jsx';
import HOME from '../pages/home.jsx';
import LEAVE from '../pages/leave.jsx';
import BILL from '../pages/bill.jsx';
import BIND_SENIOR from '../pages/bind-senior.jsx';
import WECHAT_LOGIN from '../pages/wechat-login.jsx';
import CARE_HOME from '../pages/care-home.jsx';
import BACKEND_LOGIN from '../pages/backend-login.jsx';
import STAFF_WORKSPACE from '../pages/staff-workspace.jsx';
import DIRECTOR_WORKSPACE from '../pages/director-workspace.jsx';
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
  id: "backend-login",
  component: BACKEND_LOGIN
}, {
  id: "staff-workspace",
  component: STAFF_WORKSPACE
}, {
  id: "director-workspace",
  component: DIRECTOR_WORKSPACE
}]