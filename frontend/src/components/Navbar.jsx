import {
  AppBar,
  Toolbar,
  Box,
  Button,
  Avatar,
  Typography,
  IconButton,
  Badge,
} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import StorefrontIcon from "@mui/icons-material/Storefront";
import PersonIcon from "@mui/icons-material/Person";
import HistoryIcon from "@mui/icons-material/History";
import LogoutIcon from "@mui/icons-material/Logout";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import useBasket from "../hooks/useBasket";
import useAuthStore from "../store/useAuthStore";

const pages = [
  { label: "Products", path: "/products" },
  { label: "About", path: "/about" },
  { label: "Contact", path: "/contact" },
];

export default function Navbar() {
  const [showMenu, setShowMenu] = useState(false);
  const { totalCount } = useBasket();
  const redirect = useNavigate();

  const token = useAuthStore((state) => state.token);
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const isLoginedIn = Boolean(token && user);

  return (
    <AppBar position="static">
      <Toolbar sx={{ display: "flex", justifyContent: "space-between", px: 3 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <StorefrontIcon sx={{ height: 40, width: 40 }} />
          <Typography
            variant="h5"
            noWrap
            component={Link}
            to="/"
            sx={{
              display: { xs: "none", md: "flex" },
              fontFamily: "monospace",
              fontWeight: 700,
              color: "inherit",
              textDecoration: "none",
            }}
          >
            Store
          </Typography>
        </Box>

        {/* 中间导航 */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, ml: 6 }}>
          {pages.map((page) => (
            <Button
              key={page.label}
              component={Link}
              to={`${page.path}`}
              color="inherit"
            >
              <Typography variant="button" sx={{ fontSize: "1rem" }}>
                {page.label}
              </Typography>
            </Button>
          ))}
        </Box>

        {/* 右侧登录: 购物车icon + 用户菜单 */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 3, mr: 2 }}>
          {/* shopping cart */}
          <IconButton
            aria-label="cart"
            component={Link}
            to="/basket"
            sx={{ color: "inherit", mr: 3 }}
            size="large"
          >
            <Badge badgeContent={totalCount} color="secondary">
              <ShoppingCartIcon fontSize="large" />
            </Badge>
          </IconButton>
          {isLoginedIn ? (
            <Box
              sx={{
                position: "relative",
                display: "flex",
                alignItems: "center",
                gap: 2,
              }}
              onMouseEnter={() => setShowMenu(true)}
              onMouseLeave={() => setShowMenu(false)}
            >
              {/* user avatar */}
              <Avatar
                src={"/default-avatar.png"}
                alt={user?.userName}
                sx={{ cursor: "pointer" }}
              />
              {/*  username */}
              <Typography>{user?.userName}</Typography>

              {/* dropdown menu */}
              {showMenu && (
                <Box
                  sx={{
                    position: "absolute",
                    top: "100%",
                    right: 0,
                    bgcolor: "background.paper",
                    borderRadius: 1,
                    boxShadow: 3,
                    minWidth: 150,
                    zIndex: 1000,
                    overflow: "hidden",
                  }}
                >
                  <Button
                    component={Link}
                    to={`/profiles/${user.userName}`}
                    sx={{
                      justifyContent: "flex-start",
                      width: "100%",
                      px: 2,
                      py: 1.5,
                      color: "text.primary",
                      textTransform: "none",
                      "&:hover": {
                        bgcolor: "action.hover",
                      },
                    }}
                  >
                    <PersonIcon sx={{ mr: 1 }} /> My Profile
                  </Button>

                  <Button
                    component={Link}
                    to={`/orders`}
                    sx={{
                      justifyContent: "flex-start",
                      width: "100%",
                      px: 2,
                      py: 1.5,
                      color: "text.primary",
                      textTransform: "none",
                      "&:hover": {
                        bgcolor: "action.hover",
                      },
                    }}
                  >
                    <HistoryIcon sx={{ mr: 1 }} /> My Orders
                  </Button>

                  <Button
                    onClick={() => {
                      logout();
                      redirect("/login");
                    }}
                    sx={{
                      justifyContent: "flex-start",
                      width: "100%",
                      px: 2,
                      py: 1.5,
                      color: "text.primary",
                      textTransform: "none",
                      "&:hover": {
                        bgcolor: "action.hover",
                      },
                    }}
                  >
                    <LogoutIcon sx={{ mr: 1 }} />
                    Logout
                  </Button>
                </Box>
              )}
            </Box>
          ) : (
            <Box sx={{ display: "flex", gap: 1 }}>
              <Button component={Link} to="/login" color="inherit">
                Login
              </Button>
              <Button component={Link} to="/register" color="inherit">
                Register
              </Button>
            </Box>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
}
