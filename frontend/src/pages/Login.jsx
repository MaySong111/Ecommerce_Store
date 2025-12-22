import { Link } from "react-router-dom";
import {
  Button,
  TextField,
  Typography,
  Box,
  Container,
  Paper,
} from "@mui/material";
import LockOpenIcon from "@mui/icons-material/LockOpen";
import { useState } from "react";
import useAccount from "../hooks/useAccount";

export default function Login() {
  const { loginMutation } = useAccount();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prevData) => ({
      ...prevData,
      [name]: type === "checkbox" ? checked : value,
    }));
    
    if (errors[name]) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        [name]: "",
      }));
    }
  };

  // this function return boolean
  const validate = () => {
    const newErrors = {};
    // check for empty fields
    if (formData.email.trim() === "" || formData.password.trim() === "")
      alert("Email and Password are required.");

    // only check email format if email is not empty
    if (formData.email.trim() && !formData.email.includes("@"))
      newErrors.email = "Invalid email address";
    // only check password length if password is not empty
    if (formData.password.trim() && formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // only send login request if validation passes
    if (validate()) {
      loginMutation.mutate({
        email: formData.email,
        password: formData.password,
      });
    }
  };

  return (
    <Container
      component="main"
      maxWidth="xs"
      sx={{
        marginTop: 8,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <Paper elevation={3} sx={{ padding: 4, width: "100%" }}>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            mb: 3,
          }}
        >
          <LockOpenIcon sx={{ color: "secondary.main", fontSize: 40 }} />
          <Typography component="h1" variant="h5" sx={{ mt: 1 }}>
            Sign in
          </Typography>
        </Box>

        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
          <TextField
            fullWidth
            margin="normal"
            name="email"
            label="Email"
            autoComplete="email"
            autoFocus
            value={formData.email}
            onChange={handleChange}
          />
          <TextField
            fullWidth
            margin="normal"
            name="password"
            label="Password"
            type="password"
            autoComplete="current-password"
            value={formData.password}
            onChange={handleChange}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            LOGIN
          </Button>
          <Typography variant="body2" align="center">
            Don't have an account?
            <Link to="/register" variant="body2" sx={{ ml: 0.5 }}>
              Sign up
            </Link>
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
}
