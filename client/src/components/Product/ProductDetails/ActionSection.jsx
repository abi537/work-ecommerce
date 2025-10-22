// import {  Box, Stack, Typography } from "@mui/material";
// import PropTypes from "prop-types";
// import { toTitleCase } from "../../../utils/toTitleCase";
// import { currencyFormatter } from "../../../utils/currencyFormatter";
// import { addToCart } from "../../../app/feature/cartSlice";
// import CustomButton from "../../ui/CustomButton";
// import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";
// import { useDispatch } from "react-redux";
// import { useState } from "react";
//  import ProductSizeBox from "./ProductSizes";
 

// const ActionSection = (props) => {
//     const { product } = props
//      const {description, name,  category, quantity="1", price   } = product;

//       const dispatch = useDispatch();
//     const [selectedSize, setSelectedSize] = useState(product.sizes[0]?.value);
//     const handleSizeSelect = (size) => {
//         setSelectedSize(size);
//     };
 
//     const handleAddToCart = () => {
//     //     dispatch(addToCart({ item: { ...product, quantity } }));
//     // }; // 🧩 Send selected size to Redux
//     dispatch(addToCart({
//       item: {
//         ...product,
//         quantity: 1,
//         size: selectedSize,
//       },
//     }));
//   };
 
//     return (
//         <Box flex="1 1 50%" mb="40px">
//                <Box>
//                 <Typography>CATEGORIES:  {`${category?.name} ${category?.parentCategory ? `/ ${category?.parentCategory.name}` : ""
//                     }`}
//                 </Typography>
//                 <Box m="10px 0 5px 0" display="flex">
//                     <FavoriteBorderOutlinedIcon />
//                     <Typography sx={{ ml: "5px" }}>ADD TO WISHLIST</Typography>
//                 </Box>
//             </Box>
//             <Box m="40px 0 25px 0">
//                 <Stack spacing={2}>
//                     <Typography variant="h3" fontWeight="bold">{toTitleCase(name)}</Typography>
//                     <Typography variant="h4" fontWeight="bold">{currencyFormatter.format(price)}</Typography>
//                     <Box>
//                         <Typography variant="h4" style={{ display: 'flex', alignItems: 'center' }}>
//                             <span style={{ fontWeight: 'bold' }}>Size:</span>
//                             <Typography variant="h4" style={{ marginLeft: '8px' }}>
//                                 {selectedSize}
//                             </Typography>
//                         </Typography>
//                         <Box display="flex" flexWrap="wrap">
//                             {product.sizes.map((size, index) => (
//                                 <ProductSizeBox
//                                     key={index}
//                                     size={size}
//                                     selectedSize={selectedSize}
//                                     handleSizeSelect={() => handleSizeSelect(size.value)}
//                                 />
//                             ))}
//                         </Box>
//                     </Box>
//                     <Typography sx={{ mt: "20px" }}>
//                         {description}
//                     </Typography>
//                 </Stack>
//             </Box>

//             <Box display="flex" alignItems="center" minHeight="50px">
                
//                 <CustomButton
//                     sx={{ borderRadius: 0, padding: "10px 40px" }}
//                     onClick={handleAddToCart}
//                     fullwidh
//                 >
//                     ADD TO CART
//                 </CustomButton>
//             </Box>
         
//         </Box>
//     );
// };

// ActionSection.propTypes = {
//     product: PropTypes.object.isRequired,
// };

// export default ActionSection
import { Box, Stack, Typography, Button } from "@mui/material";
import PropTypes from "prop-types";
import { toTitleCase } from "../../../utils/toTitleCase";
import { currencyFormatter } from "../../../utils/currencyFormatter";
import { addToCart } from "../../../app/feature/cartSlice";
import CustomButton from "../../ui/CustomButton";
import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";
import { useDispatch } from "react-redux";
import { useState } from "react";
import SizeSelector from "../../../common/Sizeselector";
import { updateCartItemSize } from "../../../app/feature/cartSlice.jsx";



const ActionSection = ({ product }) => {
  const dispatch = useDispatch();
  const {description, name,  category, quantity="1", price   } = product;
  console.log('Raw data of actionsection',product)
  const handleSizeChange = (newSize) => {
      dispatch(updateCartItemSize({ id: product._id, size: newSize }));
    };
  // ✅ default select first size (like MEDIUM)
  // const [selectedSize, setSelectedSize] = useState(product.sizes?.[0]?.name || null);
  //   const [selectedSize, setSelectedSize] = useState(
  //   product.sizes?.[0]?.sizeId?.name || "N/A"
  // );
  // Normalize sizes
const normalizedSizes = (product.sizes || []).map(s => ({
  _id: s._id || s.sizeId?._id,
  name: s.name || s.sizeId?.name,
  stock: s.stock ?? product.countInStock ?? 0,
}));
//   const [selectedSize, setSelectedSize] = useState(
//   product.sizes?.[0]?.sizeId?.name || "N/A7"
// );
const [selectedSize, setSelectedSize] = useState(
  normalizedSizes[0]?.name || null
);
// const [selectedSize, setSelectedSize] = useState(normalizedSizes?.[0]?.name || null);

console.log("Initial selectedSize:", selectedSize);
console.log("Product sizes:", product.sizes);
  const handleSizeSelect = (sizeName) => {
    
    setSelectedSize(sizeName);
  };

  const handleAddToCart = () => {
    console.log("Adding to cart with size:", selectedSize); 
    if (!selectedSize) {
      alert("Please select a size before adding to cart");
      return;
    }

    // ✅ include size in the payload
    dispatch(
      addToCart({
        item: {
          ...product,
          quantity: 1,
          size: selectedSize,
        },
      })
    );
  };

  const categoryName = product?.category?.[0]?.name || "Uncategorized";
  const parentCategory = product?.category?.[0]?.parentCategory || "";

  return (
    <Box flex="1 1 50%" mb="40px">
      {/* --- Category and Wishlist --- */}
      <Box>
        <Typography>CATEGORIES:  {`${category?.name} ${category?.parentCategory ? `/ ${category?.parentCategory.name}` : ""
                     }`}
                 </Typography>
        <Box m="10px 0 5px 0" display="flex" alignItems="center">
          <FavoriteBorderOutlinedIcon />
          <Typography sx={{ ml: "5px" }}>ADD TO WISHLIST</Typography>
        </Box>
      </Box>

      {/* --- Product Info --- */}
      <Box m="40px 0 25px 0">
        <Stack spacing={2}>
          <Typography variant="h3" fontWeight="bold">
            {toTitleCase(product.name)}
          </Typography>
          <Typography variant="h4" fontWeight="bold">
            {currencyFormatter.format(product.price)}
          </Typography>

          {/* --- Size Selector --- */}
          {/* <Box>
            <Typography variant="h5" mb={1}>
              Size: <strong>{selectedSize || "Select"}</strong>
            </Typography>

            <Box display="flex" gap={1} flexWrap="wrap">
              {product.sizes?.map((size) => (
                <Button
                  key={size._id}
                  variant={selectedSize === size.name ? "contained" : "outlined"}
                  onClick={() => handleSizeSelect(size.name)}
                >
                  {size.name}
                </Button>
              ))}
            </Box>
          </Box> */}

      {/* <SizeSelector
        product={product}
        selectedSize={selectedSize}
        onSelect={setSelectedSize}
      /> */}
       <SizeSelector
              product={product}
              selectedSize={selectedSize}
              onSelect={setSelectedSize}
              onSizeChange={handleSizeChange}
            />

          <Typography sx={{ mt: "20px" }}>{product.description}</Typography>
        </Stack>
      </Box>

      {/* --- Add to Cart Button --- */}
      <Box display="flex" alignItems="center" minHeight="50px">
        {/* <CustomButton
          sx={{ borderRadius: 0, padding: "10px 40px" }}
          onClick={handleAddToCart}
        >
          ADD TO CART
        </CustomButton> */}
        <CustomButton
  onClick={() => {
    // Normalize category
    const safeCategoryArray = Array.isArray(product.category)
      ? product.category
      : product.category
      ? [product.category]
      : [];

    // Ensure parentCategory inside category is a string
    const normalizedCategory = safeCategoryArray.map((cat) => ({
      ...cat,
      parentCategory:
        typeof cat.parentCategory === "object"
          ? cat.parentCategory?.name || ""
          : cat.parentCategory || "",
    }));

    // Normalize top-level parentCategory as well
    const safeParentCategoryArray = Array.isArray(product.parentCategory)
      ? product.parentCategory
      : product.parentCategory
      ? [product.parentCategory]
      : [];

    const normalizedParentCategory = safeParentCategoryArray.map((pc) =>
      typeof pc === "object" ? pc.name || "" : pc
    );

    // const safeProduct = {
    //   ...product,
    //   category: normalizedCategory,
    //   parentCategory: normalizedParentCategory,
    //   quantity: 1,
    //   size: selectedSize,
    // };

    // console.log("🧾 Final Safe Product:", safeProduct);
const selectedSizeObj = product.sizes?.find(
    (s) => s.sizeId?.name === selectedSize
  );
  const stock = selectedSizeObj?.stock ?? product.countInStock;
    // dispatch(addToCart({ item: safeProduct }));
    console.log("✅ Normalized Sizes:", normalizedSizes);
console.log("✅ Selected Size:", selectedSize);

    dispatch(addToCart({ item: { ...product, quantity: 1, size: selectedSize,countInStock: stock,   } })); 
  }}
>
  Add to Cart
</CustomButton>



      </Box>
    </Box>
  );
};

ActionSection.propTypes = {
  product: PropTypes.object.isRequired,
};

export default ActionSection;
