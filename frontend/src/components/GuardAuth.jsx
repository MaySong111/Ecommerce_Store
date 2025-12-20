import { Navigate, Outlet } from "react-router-dom";
import useAuthStore from "../store/useAuthStore";

export default function GuardAuth() {
  //   const user = useAuthStore((state) => state.user);
  //   console.log("GuardAuth - user:", user);
  //   console.log("GuardAuth - user type:", typeof user); // object(actually is UserInfo in backend)
  // so do not use user to check auth status, use token instead,because user is object type
  // and user does exists,it equals to token is null--becasue of zustand persist behavior

  const token = useAuthStore((state) => state.token);
  console.log("GuardAuth - token:", token);

  if (!token) return <Navigate to="/login" replace />;

  return (
    <div>
      <Outlet />
    </div>
  );
}
