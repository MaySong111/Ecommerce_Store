import {
  Button,
  TextField,
  Typography,
  Box,
  Container,
  Paper,
  Link,
} from "@mui/material";
import LockOpenIcon from "@mui/icons-material/LockOpen";
import useAccount from "../hooks/useAccount";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

export default function Register() {
  const { registerMutation } = useAccount();
  const navigate = useNavigate();
  const [errors, setErrors] = useState({});

  const validation = (data) => {
    const newErrors = {};
    if (!data.email) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(data.email))
      newErrors.email = "Email is invalid";

    if (!data.password) {
      newErrors.password = "Password is required";
    } else if (data.password.length < 6) {
      newErrors.password = "At least 6 characters";
    } else if (!/[A-Z]/.test(data.password)) {
      newErrors.password = "Must contain uppercase letter";
    } else if (!/[a-z]/.test(data.password)) {
      newErrors.password = "Must contain lowercase letter";
    } else if (!/[0-9]/.test(data.password)) {
      newErrors.password = "Must contain number";
    } else if (!/[^A-Za-z0-9]/.test(data.password)) {
      newErrors.password = "Must contain special character";
    }

    if (!data.userName) newErrors.userName = "User name is required";
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);

    const data = {
      email: formData.get("email"),
      password: formData.get("password"),
      userName: formData.get("userName"),
    };

    const validationErrors = validation(data);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});

    registerMutation.mutate(data, {
      onError: (error) => {
        // 后端错误显示
        setErrors({
          general: error.message || "Registration failed",
        });
      },
    });
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
            Register
          </Typography>
        </Box>

        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
          {/* Display name 字段 */}
          <TextField
            fullWidth
            margin="normal"
            name="userName"
            label="User name"
            autoComplete="username"
            error={!!errors.userName}
            helperText={errors.userName}
          />
          {/* Email 字段 */}
          <TextField
            fullWidth
            margin="normal"
            name="email"
            label="Email"
            autoComplete="email"
            autoFocus
            error={!!errors.email}
            helperText={errors.email}
          />
          {/* Password 字段 */}
          <TextField
            fullWidth
            margin="normal"
            name="password"
            label="Password"
            type="password"
            autoComplete="new-password"
            error={!!errors.password}
            helperText={errors.password}
          />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            disabled={registerMutation.isPending}
            sx={{ mt: 3, mb: 2 }}
          >
            {registerMutation.isPending ? "Registering..." : "REGISTER"}
          </Button>

          {/* Already have an account? Sign in 链接 */}
          <Typography variant="body2" align="center">
            Already have an account?
            <Link
              component="button"
              variant="body2"
              onClick={() => navigate("/login")}
              sx={{ ml: 0.5 }}
            >
              Sign in
            </Link>
          </Typography>

          {/* 错误信息 */}
          {registerMutation.isError && (
            <Typography color="error" align="center" sx={{ mt: 1 }}>
              {errors.general}
            </Typography>
          )}
        </Box>
      </Paper>
    </Container>
  );
}
