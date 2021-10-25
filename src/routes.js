// import Dashboard from "views/Dashboard.js";
import Quiz from "views/Quiz.js";
import QuizDetail from "views/QuizDetail.js";
import AddQuiz from "views/AddQuiz.js";
import Login from "views/Login.js";
import Register from "views/Register.js";
import Proctor from "views/Proctor.js";
import Completed from "views/Completed.js";
import LeaderBoard from "views/Leaderboard.js";
import Settings from "views/Settings";
import Error from "views/Error";
import PublicQuiz from "views/PubicQuiz";
import Contact from "views/Contact";

var routes = [
  
  {
    path: "/home",
    name: "Public quizzes",
    rtlName: "قائمة الجدول",
    icon: "tim-icons icon-watch-time",
    component: PublicQuiz,
    layout: "/auth"
  },
  {
    path: "/contact",
    name: "Contact",
    rtlName: "قائمة الجدول",
    icon: "tim-icons icon-watch-time",
    component: Contact,
    layout: "/auth"
  },
  {
    path: "/quiz",
    name: "Your quizzes",
    rtlName: "قائمة الجدول",
    icon: "tim-icons icon-watch-time",
    component: Quiz,
    layout: "/admin"
  },
  {
    path: "/leaderboard/:id",
    name: "Leaderboard",
    rtlName: "قائمة الجدول",
    icon: "tim-icons icon-watch-time",
    component: LeaderBoard,
    layout: "/admin"
  },
  {
    path: "/settings/:id",
    name: "Settings",
    rtlName: "قائمة الجدول",
    icon: "tim-icons icon-watch-time",
    component: Settings,
    layout: "/admin"
  },
  
  {
    path: "/quiz-detail/:id",
    name: "Quiz Detail",
    rtlName: "قائمة الجدول",
    icon: "tim-icons icon-watch-time",
    component: QuizDetail,
    layout: "/admin"
  },
  {
    path: "/add-quiz",
    name: "New Quiz",
    rtlName: "قائمة الجدول",
    icon: "tim-icons icon-watch-time",
    component: AddQuiz,
    layout: "/admin"
  },
  {
    path: "/proctor/:id",
    name: "Proctor",
    rtlName: "قائمة الجدول",
    icon: "tim-icons icon-bulb-63",
    component: Proctor,
    layout: "/auth"
  },
  {
    path: "/completed/:id/:user",
    name: "Completed",
    rtlName: "قائمة الجدول",
    icon: "tim-icons icon-bulb-63",
    component: Completed,
    layout: "/auth"
  },
  {
    path: "/register",
    name: "Register",
    rtlName: "قائمة الجدول",
    icon: "tim-icons icon-bulb-63",
    component: Register,
    layout: "/auth"
  },
  
  {
    path: "/error",
    name: "Error",
    rtlName: "قائمة الجدول",
    icon: "tim-icons icon-bulb-63",
    component: Error,
    layout: "/auth"
  },
  {
    path: "/login",
    name: "Login",
    rtlName: "قائمة الجدول",
    icon: "tim-icons icon-bulb-63",
    component: Login,
    layout: "/auth"
  }
];
export default routes;
