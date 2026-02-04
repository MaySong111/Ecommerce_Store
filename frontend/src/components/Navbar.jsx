import {
  AppBar,
  Toolbar,
  Box,
  Button,
  Avatar,
  Typography,
  IconButton,
  Badge,
  Paper,
  InputBase,
} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import StorefrontIcon from "@mui/icons-material/Storefront";
import HistoryIcon from "@mui/icons-material/History";
import LogoutIcon from "@mui/icons-material/Logout";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import useBasket from "../hooks/useBasket";
import useAuthStore from "../store/useAuthStore";
import SearchIcon from "@mui/icons-material/Search";

const pages = [
  { label: "Home", path: "/" },
  { label: "Shop", path: "/products" },
  // { label: "About", path: "/about" },
  // { label: "Contact", path: "/contact" },
];

export default function Navbar() {
  const [showMenu, setShowMenu] = useState(false);
  // console.log("Navbar rendered,menu", showMenu);
  const { totalCount } = useBasket();
  const redirect = useNavigate();
  const token = useAuthStore((state) => state.token);
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const isLoginedIn = Boolean(token && user);

  const [searchInput, setSearchInput] = useState("");
  const navigate = useNavigate();

  const handleSearchInputChange = (e) => {
    // just update the local input state, not the filter yet,so it doesn't trigger api call
    setSearchInput(e.target.value);
    if (e.target.value === "") {
      // if input is cleared, then navigate to products page without searchTerm filter
      navigate(`/products`);
    }
  };

  const handleKeyDown = (e) => {
    // when user press enter key--then set the search term filter--then it triggers the api call
    if (e.key === "Enter") {
      navigate(`/products?searchTerm=${searchInput}`);
    }
  };
  const handleSearchClick = () => {
    // when user click search button--then set the search term filter--then it triggers the api call
    navigate(`/products?searchTerm=${searchInput}`);
  };

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
            Bay
          </Typography>
        </Box>

        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          {pages.map((page) => (
            <Button
              key={page.label}
              component={Link}
              to={`${page.path}`}
              sx={{ color: "inherit" }}
            >
              <Typography variant="button" sx={{ fontSize: "1rem" }}>
                {page.label}
              </Typography>
            </Button>
          ))}
        </Box>

        <Paper
          sx={{
            display: "flex",
            alignItems: "center",
            maxWidth: 600,
            width: "100%",
          }}
        >
          <InputBase
            sx={{ ml: 1, flex: 1 }}
            placeholder="Search Products"
            inputProps={{ "aria-label": "search products" }}
            value={searchInput}
            onChange={handleSearchInputChange}
            onKeyDown={handleKeyDown}
          />

          <IconButton
            type="button"
            sx={{ p: "10px" }}
            aria-label="search"
            onClick={handleSearchClick}
          >
            <SearchIcon />
          </IconButton>
        </Paper>

        {/* 右侧登录: 购物车icon + 用户菜单 */}

        <Box sx={{ display: "flex", alignItems: "center", gap: 3, mr: 1 }}>
          {/* shopping cart */}
          <IconButton
            aria-label="cart"
            component={Link}
            to="/basket"
            sx={{ color: "inherit" }}
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
              <Button
                component={Link}
                to="/login"
                sx={{ color: "text.primary" }}
              >
                Login
              </Button>
              <Button
                component={Link}
                to="/register"
                sx={{ color: "text.primary" }}
              >
                Register
              </Button>
            </Box>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
}
