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
      toast.success(result.message || "Login successful");
      const { token, userInfo } = result;
      // store the token and user info
      login(userInfo, token);
      // redirect to activities page
      redirect("/products");
    },
  });

  const registerMutation = useMutation({
    mutationFn: registerUser,
    onSuccess: () => {
      redirect("/login");
    },
  });

  return { loginMutation, registerMutation };
}
