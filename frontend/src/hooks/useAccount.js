import { Navigate } from "react-router-dom";
import { loginUser, registerUser } from "../api/http";
import { useMutation } from "@tanstack/react-query";
import useAuthStore from "../store/useAuthStore";
import toast from "react-hot-toast";

export default function useAccount() {
  const login = useAuthStore((state) => state.login);

  const loginMutation = useMutation({
    mutationFn: loginUser,

    onSuccess: (result) => {
      // console.log("Login successful:", result);
      const { token, userInfo, message } = result;
      // store the token and user info
      login(userInfo, token);
      // toast
      toast.success(message);
      // redirect to activities page
      Navigate("/activities");
    },
  });

  const registerMutation = useMutation({
    mutationFn: registerUser,
    onSuccess: (result) => {
      console.log(result);
      // toast
      Navigate("/login");
    },
  });

  return { loginMutation, registerMutation };
}
