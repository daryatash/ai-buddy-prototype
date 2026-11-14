import { Routes, Route } from "react-router-dom";
import { LoginPage } from "../pages/LoginPage";
import DashboardPage from "../pages/DashboardPage";
import PrivateRoute from "./PrivateRoute";

export default function AppRouter() {
  return (
    <Routes>
      <Route path='/' element={<LoginPage/>}/>
      <Route path='/dashboard' element={
        <PrivateRoute>
          <DashboardPage />
        </PrivateRoute>
      } 
      /> 
    </Routes>
  )
}