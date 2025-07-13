import {
  AccountCircle,
  DesignServices,
  Home,
  InfoOutlined,
  Menu as MenuIcon,
  PersonAdd,
  ShoppingCart,
  Storefront,
} from "@mui/icons-material";
import {
  AppBar,
  Avatar,
  Badge,
  Box,
  Button,
  Drawer,
  Grid,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  List as MuiList,
  ListItem as MuiListItem,
  Popover,
  Toolbar,
  Typography,
  useMediaQuery,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import React, { useState } from "react";
import { Link as RouterLink, useLocation } from "react-router-dom";
import logo from "../assets/logo.png";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

const Navbar: React.FC = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [productsAnchorEl, setProductsAnchorEl] = useState<null | HTMLElement>(
    null
  );
  const [drawerOpen, setDrawerOpen] = useState(false);
  const productsMenuOpen = Boolean(productsAnchorEl);
  const { user, logout } = useAuth();
  const { cartItems } = useCart();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    setShowLogoutDialog(true);
    handleClose();
  };

  const confirmLogout = () => {
    logout();
    setShowLogoutDialog(false);
  };
  const cancelLogout = () => {
    setShowLogoutDialog(false);
  };

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const handleProductsMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setProductsAnchorEl(event.currentTarget);
  };
  const handleProductsMenuClose = () => {
    setProductsAnchorEl(null);
  };

  // Drawer navigation items
  const drawerNav = (
    <Box
      sx={{ width: 260 }}
      role="presentation"
      onClick={() => setDrawerOpen(false)}
    >
      <MuiList>
        <MuiListItem button component={RouterLink} to="/">
          <ListItemIcon>
            <Home />
          </ListItemIcon>
          <ListItemText primary="Home" />
        </MuiListItem>
        <MuiListItem>
          <ListItemIcon>
            <Storefront />
          </ListItemIcon>
          <ListItemText primary="Products" />
        </MuiListItem>
        {/* Products mega menu as vertical list */}
        <Box sx={{ pl: 4 }}>
          <MuiListItem
            button
            component={RouterLink}
            to="/products?category=mugs"
          >
            <ListItemText primary="Mugs" />
          </MuiListItem>
          <MuiListItem
            button
            component={RouterLink}
            to="/products?category=tshirts"
          >
            <ListItemText primary="T-Shirts" />
          </MuiListItem>
          <MuiListItem
            button
            component={RouterLink}
            to="/products?category=phonecases"
          >
            <ListItemText primary="Phone Cases" />
          </MuiListItem>
          <MuiListItem
            button
            component={RouterLink}
            to="/products?category=frames"
          >
            <ListItemText primary="Photo Frames" />
          </MuiListItem>
          <MuiListItem
            button
            component={RouterLink}
            to="/products?category=pillowcases"
          >
            <ListItemText primary="Pillow Cases" />
          </MuiListItem>
          <MuiListItem
            button
            component={RouterLink}
            to="/products?category=waterbottles"
          >
            <ListItemText primary="Water Bottles" />
          </MuiListItem>
          <MuiListItem
            button
            component={RouterLink}
            to="/products?category=notebooks"
          >
            <ListItemText primary="Notebook" />
          </MuiListItem>
          <MuiListItem
            button
            component={RouterLink}
            to="/products?category=pens"
          >
            <ListItemText primary="Pen" />
          </MuiListItem>
          <MuiListItem
            button
            component={RouterLink}
            to="/products?category=bags"
          >
            <ListItemText primary="Bag" />
          </MuiListItem>
          <MuiListItem
            button
            component={RouterLink}
            to="/products?category=caps"
          >
            <ListItemText primary="Cap" />
          </MuiListItem>
          <MuiListItem
            button
            component={RouterLink}
            to="/products?category=calendars"
          >
            <ListItemText primary="Calendar" />
          </MuiListItem>
          <MuiListItem button component={RouterLink} to="/products">
            <ListItemText primary="All Products" />
          </MuiListItem>
        </Box>
        <MuiListItem button component={RouterLink} to="/customize">
          <ListItemIcon>
            <DesignServices />
          </ListItemIcon>
          <ListItemText primary="Customize" />
        </MuiListItem>
        <MuiListItem button component={RouterLink} to="/about">
          <ListItemIcon>
            <InfoOutlined />
          </ListItemIcon>
          <ListItemText primary="About Us" />
        </MuiListItem>
        {user && (
          <MuiListItem button component={RouterLink} to="/cart">
            <ListItemIcon>
              <ShoppingCart />
            </ListItemIcon>
            <ListItemText primary="Cart" />
          </MuiListItem>
        )}
        {user ? (
          <MuiListItem button component={RouterLink} to="/profile">
            <ListItemIcon>
              <Avatar src={user?.profileImage || undefined}>
                {!user?.profileImage && user?.name?.charAt(0)}
              </Avatar>
            </ListItemIcon>
            <ListItemText primary="Profile" />
          </MuiListItem>
        ) : (
          <>
            <MuiListItem button component={RouterLink} to="/login">
              <ListItemIcon>
                <AccountCircle />
              </ListItemIcon>
              <ListItemText primary="Login" />
            </MuiListItem>
            <MuiListItem button component={RouterLink} to="/register">
              <ListItemIcon>
                <PersonAdd />
              </ListItemIcon>
              <ListItemText primary="Register" />
            </MuiListItem>
          </>
        )}
      </MuiList>
    </Box>
  );

  return (
    <AppBar
      position="sticky"
      sx={{ bgcolor: "white", color: "black", boxShadow: 2 }}
    >
      <Toolbar>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Box
            sx={{
              width: 48,
              height: 48,
              bgcolor: "white",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: 2,
              mr: 2,
            }}
          >
            <img
              src={logo}
              alt="GiftCraft Logo"
              style={{ height: 32, width: 32, objectFit: "contain" }}
            />
          </Box>
          <Typography
            variant="h6"
            component={RouterLink}
            to="/"
            sx={{
              textDecoration: "none",
              color: "rgb(266,106,106)",
              fontWeight: 700,
              letterSpacing: 1,
              fontSize: "1.35rem",
            }}
          >
            GiftCraft
          </Typography>
        </Box>

        {isMobile ? (
          <Box
            sx={{ flexGrow: 1, display: "flex", justifyContent: "flex-end" }}
          >
            <IconButton
              color="inherit"
              edge="end"
              onClick={() => setDrawerOpen(true)}
            >
              <MenuIcon />
            </IconButton>
            <Drawer
              anchor="right"
              open={drawerOpen}
              onClose={() => setDrawerOpen(false)}
            >
              {drawerNav}
            </Drawer>
          </Box>
        ) : (
          <>
            <Box
              sx={{
                display: "flex",
                flexGrow: 1,
                justifyContent: "center",
                gap: 2,
                alignItems: "center",
              }}
            >
              <Button
                component={RouterLink}
                to="/"
                color="inherit"
                startIcon={<Home />}
                sx={{
                  borderBottom: isActive("/") ? "2px solid black" : "none",
                  borderRadius: 0,
                  "&:hover": {
                    backgroundColor: "rgba(0, 0, 0, 0.05)",
                  },
                }}
              >
                Home
              </Button>
              <Button
                component={RouterLink}
                to="/products"
                color="inherit"
                startIcon={<Storefront />}
                sx={{
                  borderBottom: isActive("/products")
                    ? "2px solid black"
                    : "none",
                  borderRadius: 0,
                  "&:hover": {
                    backgroundColor: "rgba(0, 0, 0, 0.05)",
                  },
                }}
                onMouseEnter={handleProductsMenuOpen}
                onClick={handleProductsMenuOpen}
                aria-owns={productsMenuOpen ? "products-mega-menu" : undefined}
                aria-haspopup="true"
              >
                Products
              </Button>
              <Button
                component={RouterLink}
                to="/customize"
                color="inherit"
                startIcon={<DesignServices />}
                sx={{
                  borderBottom: isActive("/customize") ? "2px solid black" : "none",
                  borderRadius: 0,
                  "&:hover": { backgroundColor: "rgba(0, 0, 0, 0.05)" },
                }}
              >
                Customize
              </Button>
              <Popover
                id="products-mega-menu"
                open={productsMenuOpen}
                anchorEl={productsAnchorEl}
                onClose={handleProductsMenuClose}
                anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
                transformOrigin={{ vertical: "top", horizontal: "center" }}
                PaperProps={{
                  onMouseEnter: () => setProductsAnchorEl(productsAnchorEl),
                  onMouseLeave: handleProductsMenuClose,
                  sx: { minWidth: 900, p: 3, boxShadow: 4 },
                }}
              >
                <Grid
                  container
                  spacing={2}
                  sx={{ minWidth: 900, px: 2, py: 2 }}
                >
                  {/* Column 1: Drinkware */}
                  <Grid item xs={12} sm={6} md={2}>
                    <Typography
                      variant="subtitle2"
                      fontWeight={700}
                      gutterBottom
                    >
                      Drinkware
                    </Typography>
                    <List dense disablePadding>
                      <ListItem
                        button
                        component={RouterLink}
                        to="/products?category=mugs"
                        onClick={handleProductsMenuClose}
                      >
                        <ListItemText primary="Mugs" />
                      </ListItem>
                      <ListItem
                        button
                        component={RouterLink}
                        to="/products?category=waterbottles"
                        onClick={handleProductsMenuClose}
                      >
                        <ListItemText primary="Water Bottles" />
                      </ListItem>
                    </List>
                  </Grid>

                  {/* Column 2: Apparel */}
                  <Grid item xs={12} sm={6} md={2}>
                    <Typography
                      variant="subtitle2"
                      fontWeight={700}
                      gutterBottom
                    >
                      Apparel
                    </Typography>
                    <List dense disablePadding>
                      <ListItem
                        button
                        component={RouterLink}
                        to="/products?category=tshirts"
                        onClick={handleProductsMenuClose}
                      >
                        <ListItemText primary="T-Shirts" />
                      </ListItem>
                      <ListItem
                        button
                        component={RouterLink}
                        to="/products?category=caps"
                        onClick={handleProductsMenuClose}
                      >
                        <ListItemText primary="Cap" />
                      </ListItem>
                    </List>
                  </Grid>

                  {/* Column 3: Stationery */}
                  <Grid item xs={12} sm={6} md={2}>
                    <Typography
                      variant="subtitle2"
                      fontWeight={700}
                      gutterBottom
                    >
                      Stationery
                    </Typography>
                    <List dense disablePadding>
                      <ListItem
                        button
                        component={RouterLink}
                        to="/products?category=notebooks"
                        onClick={handleProductsMenuClose}
                      >
                        <ListItemText primary="Notebook" />
                      </ListItem>
                      <ListItem
                        button
                        component={RouterLink}
                        to="/products?category=pens"
                        onClick={handleProductsMenuClose}
                      >
                        <ListItemText primary="Pen" />
                      </ListItem>
                    </List>
                  </Grid>

                  {/* Column 4: Accessories */}
                  <Grid item xs={12} sm={6} md={2}>
                    <Typography
                      variant="subtitle2"
                      fontWeight={700}
                      gutterBottom
                    >
                      Accessories
                    </Typography>
                    <List dense disablePadding>
                      <ListItem
                        button
                        component={RouterLink}
                        to="/products?category=phonecases"
                        onClick={handleProductsMenuClose}
                      >
                        <ListItemText primary="Phone Cases" />
                      </ListItem>
                      <ListItem
                        button
                        component={RouterLink}
                        to="/products?category=keychains"
                        onClick={handleProductsMenuClose}
                      >
                        <ListItemText primary="Keychain" />
                      </ListItem>
                    </List>
                  </Grid>

                  {/* Column 5: Home & Jewelry */}
                  <Grid item xs={12} sm={6} md={2}>
                    <Typography
                      variant="subtitle2"
                      fontWeight={700}
                      gutterBottom
                    >
                      Home & Jewelry
                    </Typography>
                    <List dense disablePadding>
                      <ListItem
                        button
                        component={RouterLink}
                        to="/products?category=frames"
                        onClick={handleProductsMenuClose}
                      >
                        <ListItemText primary="Photo Frames" />
                      </ListItem>
                      <ListItem
                        button
                        component={RouterLink}
                        to="/products?category=pillowcases"
                        onClick={handleProductsMenuClose}
                      >
                        <ListItemText primary="Pillow Cases" />
                      </ListItem>
                    </List>
                  </Grid>
                  {/* Column 6: All Products */}
                  <Grid item xs={12} sm={6} md={2}>
                    <Typography
                      variant="subtitle2"
                      fontWeight={700}
                      gutterBottom
                    >
                      All Products
                    </Typography>
                    <List dense disablePadding>
                      <ListItem
                        button
                        component={RouterLink}
                        to="/products"
                        onClick={handleProductsMenuClose}
                      >
                        <ListItemText primary="View All" />
                      </ListItem>
                    </List>
                  </Grid>
                </Grid>
              </Popover>
            </Box>
            <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
              {user && (
                <IconButton
                  component={RouterLink}
                  to="/cart"
                  color="inherit"
                  sx={{
                    borderBottom: isActive("/cart")
                      ? "2px solid black"
                      : "none",
                    borderRadius: 0,
                    "&:hover": {
                      backgroundColor: "rgba(0, 0, 0, 0.05)",
                    },
                  }}
                >
                  <Badge badgeContent={cartItems.length} color="error">
                    <ShoppingCart />
                  </Badge>
                </IconButton>
              )}
              {user ? (
                <>
                  <IconButton
                    size="large"
                    onClick={handleMenu}
                    color="inherit"
                    sx={{
                      borderBottom: isActive("/profile")
                        ? "2px solid black"
                        : "none",
                      borderRadius: 0,
                      "&:hover": {
                        backgroundColor: "rgba(0, 0, 0, 0.05)",
                      },
                    }}
                  >
                    <Avatar src={user?.profileImage || undefined}>
                      {!user?.profileImage && user?.name?.charAt(0)}
                    </Avatar>
                  </IconButton>
                  <Menu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={handleClose}
                  >
                    <MenuItem
                      component={RouterLink}
                      to="/profile"
                      onClick={handleClose}
                    >
                      Profile
                    </MenuItem>
                    <MenuItem onClick={handleLogout}>Logout</MenuItem>
                  </Menu>
                </>
              ) : (
                <Box sx={{ display: "flex", gap: 1 }}>
                  <Button
                    component={RouterLink}
                    to="/login"
                    color="inherit"
                    startIcon={<AccountCircle />}
                    sx={{
                      borderBottom: isActive("/login")
                        ? "2px solid black"
                        : "none",
                      borderRadius: 0,
                      "&:hover": {
                        backgroundColor: "rgba(0, 0, 0, 0.05)",
                      },
                    }}
                  >
                    Login
                  </Button>
                  <Button
                    component={RouterLink}
                    to="/register"
                    color="inherit"
                    startIcon={<PersonAdd />}
                    sx={{
                      borderBottom: isActive("/register")
                        ? "2px solid black"
                        : "none",
                      borderRadius: 0,
                      "&:hover": {
                        backgroundColor: "rgba(0, 0, 0, 0.05)",
                      },
                    }}
                  >
                    Register
                  </Button>
                </Box>
              )}
            </Box>
          </>
        )}
      </Toolbar>
      {/* Logout confirmation dialog */}
      <Dialog open={showLogoutDialog} onClose={cancelLogout}>
        <DialogTitle>Logout</DialogTitle>
        <DialogContent>
          <Typography>Do you want to logout?</Typography>
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'center', gap: 2 }}>
          <Button color="error" variant="contained" onClick={confirmLogout}>Yes</Button>
          <Button onClick={cancelLogout}>No</Button>
        </DialogActions>
      </Dialog>
    </AppBar>
  );
};

export default Navbar;
