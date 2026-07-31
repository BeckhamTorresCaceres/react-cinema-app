import { createBrowserRouter } from "react-router";
import { HomePage } from "./features/auth/pages/home/HomePage";
import { LoginPage } from "./features/auth/pages/login/LoginPage";
import { RegisterPage } from "./features/auth/pages/register/RegisterPage";
import { AuthLayout } from "./features/auth/layouts/AuthLayout";

export const appRouter = createBrowserRouter([
  {
    path: "/",
    element: <AuthLayout/>,
    children : [
          { 
            index : true,
            element: < HomePage/> 
          },
          {
            path : "login",
            element: <LoginPage/>
          },
          {
            path : "register",
            element: <RegisterPage/>
          }
  ]
  }
  ,
  {
    path: "/",
    element: <AuthLayout/>,
  }
]);