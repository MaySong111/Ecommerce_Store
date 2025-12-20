import { loginUser, registerUser } from "../api/http";
import { useMutation } from "@tanstack/react-query";
import useAuthStore from "../store/useAuthStore";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export default function useAccount() {
  const login = useAuthStore((state) => state.login);

  const redirect = useNavigate();

  const loginMutation = useMutation({
    mutationFn: loginUser,
    onSuccess: (result) => {
      // console.log("Login successful:", result);
      const { token, userInfo } = result;
      // store the token and user info
      login(userInfo, token);
      // redirect to activities page
      redirect("/products");
    },
    onError: (error) => {
      console.error("Login failed:", error);
      toast.error(error.message || "Login failed");
    },
  });

  const registerMutation = useMutation({
    mutationFn: registerUser,
    onSuccess: () => {
      redirect("/login");
    },
    onError: (error) => {
      toast.error(error.message || "Registration failed");
    },
  });

  return { loginMutation, registerMutation };
}
