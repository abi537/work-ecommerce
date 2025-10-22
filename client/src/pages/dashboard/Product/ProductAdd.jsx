import Heading from "../../../components/ui/Heading"
import { Box, Container, Divider } from "@mui/material"
import { productApi } from "../../../api/productApi"
import { useCallback, useEffect, useState } from "react"
import ProductForm from '../../../components/Dashboard/product/ProductForm';


// function ProductAdd() {

//   const [options, setOptions] = useState({
//     categories: [],
//     sizes: [],
//     brands: []
// })
// const getOptions = useCallback(async () => {
//   try {
//     console.log("Options being passed to ProductForm productadd.jsx:", options);

//       const result = await productApi.Getoptions()
//       console.log("Fetched options from API:", result);
//       setOptions(result)
//   } catch (err) {
//       console.error(err);
//   }
// }, []);

// useEffect(() => {
//   getOptions();
//       // eslint-disable-next-line react-hooks/exhaustive-deps
// }, []);
//   return (
//     <>
//       <Container maxWidth='xl' >
//         <Box
//           sx={{
//             display: "flex",
//             alignItems: "center",
//             justifyContent: "space-between",
//             marginLeft: "1rem",
//             marginRight: "1rem",
//            }}
//         >
//           <Heading title="Create product" description="Add a new product" />
//         </Box>
//         <Divider
//           sx={{
//             marginY: 2,
//             marginLeft: "1rem",
//             marginRight: "1rem",
//           }}
//         />
//         <ProductForm options={options}/>
//       </Container >
//     </>
//   )
// }

// export default ProductAdd

export default function ProductAdd() {
  const [options, setOptions] = useState(null); // null instead of empty
  const [loading, setLoading] = useState(true);

  useEffect(() => {
  async function fetchOptions() {
    try {
      const res = await productApi.Getoptions(); // res is already response.data
      console.log("Fetched options from API:", res); // use res directly
      setOptions(res);
    } catch (err) {
      console.error("Error fetching options:", err);
    } finally {
      setLoading(false);
    }
  }
  fetchOptions();
}, []);


  if (loading) return <p>Loading options...</p>;

  if (!options) return <p>Failed to load product options</p>;

  console.log("Options being passed to ProductForm", options);

  return <ProductForm options={options} />;
}