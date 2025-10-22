// // ✅ SizeSelector.jsx
// import { Box, Button, Typography } from "@mui/material";
// import React from "react";

// const SizeSelector = ({ product, selectedSize, onSelect }) => {
//   console.log("this is sizeselector speakinggg")
//   if (!product?.sizes?.length) return null;

//   return (
//     <Box>
//       <Typography variant="h6" mb={1}>
//         Size: <strong>{selectedSize || "Select"}</strong>
//       </Typography>

//       <Box display="flex" gap={1} flexWrap="wrap">
//         {product.sizes.map((size) => (
//           <Button
//             key={size._id}
//             variant={selectedSize === size.name ? "contained" : "outlined"}
//             onClick={() => onSelect(size.name)}
//           >
//             {size.name}
//           </Button>
//         ))}
//       </Box>
//     </Box>
//   );
// };

// export default SizeSelector;
//2 good thing
import React, { useState } from "react";
import { Box, Button, Typography } from "@mui/material";

const SizeSelector = ({ product, onSizeChange }) => {
  const [selectedSize, setSelectedSize] = useState(product.size || product.sizes?.[0]?.name || null);

  const handleSizeSelect = (sizeName) => {
    setSelectedSize(sizeName);
    if (onSizeChange) onSizeChange(sizeName); // ✅ notify parent (CartItem)
  };

  return (
    <Box>
      <Typography variant="h6">
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
    </Box>
  );
};

export default SizeSelector;

// import React, { useState, useEffect } from "react";
// import { Box, Button, Typography } from "@mui/material";

// const SizeSelector = ({ product, selectedSize, onSelect }) => {
//   const [activeSize, setActiveSize] = useState(selectedSize || null);

//   useEffect(() => {
//     if (selectedSize) setActiveSize(selectedSize);
//   }, [selectedSize]);

//   const handleSelect = (sizeObj) => {
//     const sizeName = typeof sizeObj === "string" ? sizeObj : sizeObj.name;
//     setActiveSize(sizeName);
//     onSelect(sizeName);
//   };

//   const sizeOptions = product.sizes?.map((s) =>
//     typeof s === "object" ? s : { _id: s, name: s }
//   );

//   return (
//     <Box mt={2}>
//       <Typography variant="subtitle1">
//         Size: <strong>{activeSize || "Select"}</strong>
//       </Typography>
//       <Box display="flex" gap={1} flexWrap="wrap" mt={1}>
//         {sizeOptions?.map((size) => (
//           <Button
//             key={size._id}
//             variant={activeSize === size.name ? "contained" : "outlined"}
//             onClick={() => handleSelect(size)}
//           >
//             {size.name}
//           </Button>
//         ))}
//       </Box>
//     </Box>
//   );
// };

// export default SizeSelector;
