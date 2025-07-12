import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import {
  Avatar,
  Box,
  Card,
  CardActions,
  CardContent,
  Chip,
  Collapse,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Tooltip,
  Typography,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";

const ExpandMore = styled((props: any) => {
  const { expand, ...other } = props;
  return <IconButton {...other} />;
})(({ theme, expand }: any) => ({
  transform: !expand ? "rotate(0deg)" : "rotate(180deg)",
  marginLeft: "auto",
  transition: theme.transitions.create("transform", {
    duration: theme.transitions.duration.shortest,
  }),
}));

const statusColors: Record<string, string> = {
  Processing: "warning",
  Confirmed: "info",
  Delivered: "success",
  Cancelled: "error",
};

const ProfileOrders = () => {
  const { user } = useAuth() as any;
  const [orderHistory, setOrderHistory] = useState<any[]>([]);
  const [expanded, setExpanded] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrderHistory = async () => {
      try {
        const token = localStorage.getItem("giftcraftToken");
        const res = await fetch("/api/products/orders", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Failed to fetch order history");
        const orders = await res.json();
        setOrderHistory(orders);
      } catch (e) {
        console.error("Fetch orders error:", e);
        setOrderHistory([]);
      }
    };
    fetchOrderHistory();
  }, [user]);

  const handleExpandClick = (orderId: string) => {
    setExpanded(expanded === orderId ? null : orderId);
  };

  return (
    <Box sx={{ maxWidth: 600, mx: "auto", mt: 2 }}>
      <Typography variant="h5" fontWeight={700} gutterBottom>
        Order History
      </Typography>
      {orderHistory.length === 0 ? (
        <Typography variant="body1" align="center">
          No orders found.
        </Typography>
      ) : (
        orderHistory.map((order: any) => (
          <Card
            key={order._id}
            sx={{
              mb: 3,
              borderRadius: 5,
              boxShadow: "0 4px 24px rgba(0,0,0,0.06)",
            }}
          >
            <CardContent>
              <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                <Typography variant="subtitle2" sx={{ flex: 1 }}>
                  Order #{order._id.slice(-6).toUpperCase()}
                </Typography>
                <Chip
                  label={order.status || "Confirmed"}
                  color={
                    (statusColors[order.status || "Confirmed"] as any) ||
                    "default"
                  }
                  size="small"
                  sx={{ fontWeight: 700 }}
                />
              </Box>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ mb: 0.5 }}
              >
                {new Date(order.createdAt).toLocaleString()}
              </Typography>
              <Typography variant="body2" sx={{ mb: 0.5 }}>
                <b>Address:</b> {order.address}
              </Typography>
              <Typography variant="body2" sx={{ mb: 0.5 }}>
                <b>Payment:</b> {order.paymentMethod}
              </Typography>
              <Typography variant="body2" sx={{ mb: 0.5 }}>
                <b>Total:</b> Rs {order.total?.toFixed(2)}
              </Typography>
            </CardContent>
            <CardActions disableSpacing>
              <ExpandMore
                expand={expanded === order._id}
                onClick={() => handleExpandClick(order._id)}
                aria-expanded={expanded === order._id}
                aria-label="show more"
              >
                <Tooltip
                  title={expanded === order._id ? "Hide Items" : "Show Items"}
                >
                  <ExpandMoreIcon />
                </Tooltip>
              </ExpandMore>
            </CardActions>
            <Collapse in={expanded === order._id} timeout="auto" unmountOnExit>
              <CardContent sx={{ pt: 0 }}>
                <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 1 }}>
                  Items
                </Typography>
                <List>
                  {order.items.map((item: any, idx: number) => (
                    <React.Fragment
                      key={item.customizationId || item.product || idx}
                    >
                      <ListItem alignItems="flex-start" sx={{ px: 0 }}>
                        <ListItemAvatar>
                          <Avatar
                            src={item.image}
                            variant="rounded"
                            sx={{ width: 56, height: 56, mr: 2 }}
                          />
                        </ListItemAvatar>
                        <ListItemText
                          primary={
                            <span style={{ fontWeight: 600 }}>
                              {item.name || "Product"}
                            </span>
                          }
                          secondary={
                            <>
                              <span>
                                Qty: {item.quantity} &nbsp;|&nbsp; Rs{" "}
                                {item.price?.toFixed(2)}
                              </span>
                              {item.customization && (
                                <>
                                  <br />
                                  <span style={{ color: "#888" }}>
                                    Custom: {JSON.stringify(item.customization)}
                                  </span>
                                </>
                              )}
                            </>
                          }
                        />
                      </ListItem>
                      {idx < order.items.length - 1 && (
                        <Divider component="li" />
                      )}
                    </React.Fragment>
                  ))}
                </List>
              </CardContent>
            </Collapse>
          </Card>
        ))
      )}
    </Box>
  );
};

export default ProfileOrders;
