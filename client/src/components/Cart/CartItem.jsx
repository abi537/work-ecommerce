import PropTypes from "prop-types";
import { Box, Divider, IconButton, Typography,Button } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import RemoveIcon from "@mui/icons-material/Remove";
import AddIcon from "@mui/icons-material/Add";
import { useDispatch } from "react-redux";
import { decreaseCount, increaseCount, removeFromCart } from "../../app/feature/cartSlice";
import { currencyFormatter } from "../../utils/currencyFormatter";
import { toTitleCase } from "../../utils/toTitleCase";
import { toast } from "react-hot-toast";
import useTheme from "../../hooks/useTheme";
import { tokens } from "../../theme/theme";
import { FlexBox } from ".";
import React, { useState } from "react"; 
import SizeSelector from "../../common/Sizeselector";
import { updateCartItemSize } from "../../app/feature/cartSlice";



import ActionSection from "../Product/ProductDetails/ActionSection";

const CartItem = (props) => {
  const { product } = props
  const [selectedSize, setSelectedSize] = useState("");
  // const { _id, name, images, category, quantity, price, countInStock, parentCategory } = product;
  const { _id, name, images, category, quantity, price, countInStock, parentCategory, size } = product;

  const { theme } = useTheme();
  const colors = tokens(theme.palette.mode);
  const dispatch = useDispatch();
  const handleSizeChange = (newSize) => {
    dispatch(updateCartItemSize({ id: product._id, size: newSize }));
  };
console.log("Product fetched:", product);
console.log("category in cartitem", Array.isArray(category) ? "Array" : typeof category, category);
console.log("size in cartitem", size);
  return (
    <Box key={`${name}-${_id}`} mb={2}>
      <FlexBox p="15px 0">
        <Box flex="1 1 40%" >
          <img
            alt={name}
            width="123px"
            height="160px"
            src={images[0].url}
            loading="lazy"
          />
        </Box>
        <Box flex="1 1 60%">
          <FlexBox mb="5px">
            <Typography fontWeight="bold" sx={{ color: colors.grey[100] }}>
              {toTitleCase(name)}
            </Typography>
            <IconButton
              onClick={() =>
                // dispatch(removeFromCart({ id: _id }))
                dispatch(removeFromCart({ id: _id, size }))
              }

            >
              <CloseIcon />
            </IconButton>
          </FlexBox>
          
          {category && (
  <Typography fontSize={11}>
    {category[0]?.name}
    {parentCategory && parentCategory[0]?.name
      ? ` / ${parentCategory[0]?.name}`
      : ''}
  </Typography>
)}
          <FlexBox m="15px 0">
            <Box
              display="flex"
              alignItems="center"
              border={`1.5px solid ${colors.grey[100]}`}
            >
              <IconButton
                onClick={() =>
                  // dispatch(decreaseCount({ id: _id }))
                  dispatch(decreaseCount({ id: _id, size }))
                }
              >
                <RemoveIcon />
              </IconButton>
              <Typography>{quantity}</Typography>
              
              <IconButton
                onClick={() => {
                  if (countInStock < quantity + 1) {
                    toast.error('Sorry. This much quantity in stock');
                  } else {
                    // dispatch(increaseCount({ id: _id }));
                    dispatch(increaseCount({ id: _id, size }));
                  }
                }}
              >
                <AddIcon />
                
              </IconButton>
            </Box>
            <Typography fontWeight="bold" sx={{ color: colors.grey[100] }}>
              {currencyFormatter.format(price)}
            </Typography>
            {/* <Box>
            <Typography variant="h5" mb={1}>
              Size: <strong>{selectedSize || "Select"}</strong>
            </Typography>

            <Box display="flex" gap={1} flexWrap="wrap">
              {product.sizes?.map((size) => (
                // <Button
                //   key={size._id}
                //   variant={selectedSize === size.name ? "contained" : "outlined"}
                //   onClick={() => handleSizeSelect(size.name)}
                // >
                //   {size.name}
                // </Button>
                
              ))}
            </Box>
          </Box> */}
          <SizeSelector
        product={product}
        selectedSize={selectedSize}
        onSelect={setSelectedSize}
        onSizeChange={handleSizeChange}
      />
          </FlexBox>
        </Box>
      </FlexBox>
      <Divider />
    </Box>
  );
};
CartItem.propTypes = {
  product: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    images: PropTypes.arrayOf(
      PropTypes.shape({
        url: PropTypes.string.isRequired,
      })
    ),
    category: PropTypes.arrayOf(
      PropTypes.shape({
        name: PropTypes.string.isRequired,
        parentCategory: PropTypes.string,
      })
    ),
    parentCategory: PropTypes.arrayOf(
      PropTypes.shape({
        name: PropTypes.string
      })
    ),
    quantity: PropTypes.number.isRequired,
    price: PropTypes.number.isRequired,
    countInStock: PropTypes.number.isRequired,
  }).isRequired,
};
export default CartItem;
