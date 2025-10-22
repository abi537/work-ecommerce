import { Box, IconButton, Typography } from "@mui/material";
import { useSelector, useDispatch } from "react-redux";
import CloseIcon from "@mui/icons-material/Close";
import styled from "@emotion/styled";
import { setIsCartOpen } from "../../app/feature/cartSlice";
import { useNavigate } from "react-router-dom";
import CustomButton from "../ui/CustomButton";
import { tokens } from "../../theme/theme";
import useTheme from "../../hooks/useTheme";
import CartItem from "./CartItem";
import CartSubtotal from "./CartSubtotal";
import { useRef } from "react";
import useOnClickOutside from "../../hooks/useOnClickOutside";
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import { toast } from 'react-hot-toast';

export const FlexBox = styled(Box)`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const CartMenu = () => {
  
  const { theme } = useTheme();
  const colors = tokens(theme.palette.mode);
  const cartRef = useRef(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const cart = useSelector((state) => state.cart.cart);
  const isCartOpen = useSelector((state) => state.cart.isCartOpen);

  const totalPrice = cart.reduce((total, item) => {
    console.log("the cartitem for debb",cart)
    return total + Number(item.quantity) * Number(item.price);
  }, 0);
    const handleCheckout = () => {
  // Loop through the cart and validate stock
  for (const item of cart) {
    if (item.quantity > item.countInStock) {
      // alert(`Not enough stock for "${item.name}". Only ${item.countInStock} left.`);
      toast.error(`Not enough stock for "${item.name}". Only ${item.countInStock} left.`)
      return; // stop the checkout process
    }
  }

  // ✅ If everything is valid (no stock issues)
  navigate("/checkout");         // Go to the checkout page
  dispatch(setIsCartOpen({}));   // Close the cart sidebar
};
  const itemCount = cart.reduce(
    (total, item) => total + Number(item.quantity),
    0
  )
  useOnClickOutside(cartRef, isCartOpen, () =>
    
    dispatch(setIsCartOpen({}))
  );
  return (
    <Box
      display={isCartOpen ? "block" : "none"}
      backgroundColor="rgba(0, 0, 0, 0.4)"
      position="fixed"
      zIndex={10}
      width="100%"
      height="100%"
      left="0"
      top="0"
      overflow="auto"
    >
      <Box
        ref={cartRef}
        position="fixed"
        right="0"
        bottom="0"
        width={{ xs: "100%", sm: "100%", md: "400px", lg: "30%" }}
        height="100%"
        backgroundColor='background.paper'
      >
        <Box
          padding="30px"
          overflow="auto"
          height="100%"
        >
          <FlexBox mb="15px">
            <Typography variant="h3" sx={{ color: colors.grey[500] }}> SHOPPING BAG  ({itemCount})</Typography>
            <IconButton
              onClick={() => dispatch(setIsCartOpen({}))}
              size="large"
              aria-haspopup="true"
              sx={{ color: colors.grey[500] }}>
              <CloseIcon />
            </IconButton>
          </FlexBox>
          <Box>
            {cart?.map((product) => (
              <CartItem key={product._id} product={product} />
            ))}
          </Box>
          <Box m="20px 0">
            {cart.length > 0 ? (
              <>
                <CartSubtotal totalPrice={totalPrice} />
                {/* <CustomButton
  disabled={cart.some(item => item.countInStock === 0 || item.quantity > item.countInStock)}
  sx={{
    borderRadius: 0,
    minWidth: "100%",
    padding: "20px 40px",
    m: "20px 0",
  }}
  onClick={() => {
    const outOfStockItems = cart.filter(
      (item) => item.countInStock === 0 || item.quantity > item.countInStock
    );

    if (outOfStockItems.length > 0) {
      const names = outOfStockItems.map((i) => i.name).join(", ");
      toast.error(`Cannot checkout. Out of stock: ${names}`);
      return;
    }

    navigate("/checkout");
    dispatch(setIsCartOpen({}));
  }}
>
  CHECKOUT
</CustomButton> */}
{/* last working code 2 */}
{/* <CustomButton
                  sx={{
                    borderRadius: 0,
                    minWidth: "100%",
                    padding: "20px 40px",
                    m: "20px 0",
                  }}
                  onClick={() => {
                    navigate("/checkout");
                    dispatch(setIsCartOpen({}))
                  }}
                >
                  CHECKOUT
                </CustomButton> */}
                <CustomButton
  sx={{
    borderRadius: 0,
    minWidth: "100%",
    padding: "20px 40px",
    m: "20px 0",
  }}
  onClick={handleCheckout} // 👈 this links the button to the function above
>
  CHECKOUT
</CustomButton>
                {/* <CustomButton
  sx={{
    borderRadius: 0,
    minWidth: "100%",
    padding: "20px 40px",
    m: "20px 0",
  }}
 onClick={async () => {
    if (!cart || cart.length === 0) {
      toast.error("Your cart is empty!");
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/api/orders/validate-cart", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ cart }),
      });
      const data = await res.json();

      if (res.ok) {
        navigate("/checkout");
        dispatch(setIsCartOpen({}));
      } else {
        toast.error(data.message || "Unable to validate stock. Please try again.");
      }
    } catch (err) {
      toast.error("Error validating stock. Please try again.");
    }
  }}
>
  CHECKOUT
</CustomButton> */}

              </>

            ) : (
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: theme.spacing(2),
                  height: '100%',
                }}
                color={colors.grey[500]}
              >
                <IconButton
                  aria-label="Shopping Cart"
                  color={colors.grey[500]}
                >
                  <ShoppingCartOutlinedIcon sx={{ height: '48px', width: '48px' }} />
                </IconButton>
                <Typography variant="h5" color={colors.grey[500]} >Your cart is empty.</Typography>
              </Box>
            )}
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default CartMenu;
{/* <CustomButton
                  sx={{
                    borderRadius: 0,
                    minWidth: "100%",
                    padding: "20px 40px",
                    m: "20px 0",
                  }}
                  onClick={() => {
                    navigate("/checkout");
                    dispatch(setIsCartOpen({}))
                  }}
                >
                  CHECKOUT
                </CustomButton> */}