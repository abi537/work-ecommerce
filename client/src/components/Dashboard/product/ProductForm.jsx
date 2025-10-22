import PropTypes from 'prop-types';
import {
    Autocomplete,
    Card,
    CardContent,
    Chip,
    Button,
    Unstable_Grid2 as Grid,
    Switch,
    TextField,
    Typography,
    Stack
} from "@mui/material";
import FileDropzone from "../../FileDropzone";
import { useNavigate } from "react-router-dom";
import { useCallback, useEffect, useState } from "react";
import { useFormik } from "formik";
import CustomButton from "../../ui/CustomButton";
import CustomInput from "../../ui/CustomInput";
import { ProductvalidationSchema } from './ProductFormValidation';
import { toast } from 'react-hot-toast';
import { useMounted } from '../../../hooks/use-mounted';
import { productApi } from '../../../api/productApi';
import { flattenCategories } from "../../../utils/flattenCategories"



const ProductForm = (props) => {
    const { initialData, options } = props
    const navigate = useNavigate();
    const isMounted = useMounted()
    const [files, setFiles] = useState([]);
    const [updatefiles, setUpdateFiles] = useState([]);
    const [errorMessage, setErrorMessage] = useState('');
    const [selectedBrand, setSelectedBrand] = useState(null);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [selectedSizes, setSelectedSizes] = useState([]);
if (!options || !options.categories?.length) {
    return <p>Loading form data...</p>;
  }

    const initialValues = initialData
        ? {
            ...initialData,
            images: [],
        }
        : {
            category: "",
            description: "",
            images: [],
            name: "",
            price: 0,
            sizes: [],
            brand: "",
            countInStock: 0,
            isFeatured: false,
            isArchived: false,
        };

    const initialBrandId = initialData ? initialData.brand : null;
    const initialCategoryId = initialData ? initialData.category : null;
    const initialSizesId = initialData ? initialData.sizes : null;

    useEffect(() => {
        console.log("Categories from props:", options?.categories);
        console.log("options from props:", options);
        if (initialBrandId) {
            const brand = options.brands?.find((item) => item._id === initialBrandId);
            setSelectedBrand(brand);
        }
        if (initialCategoryId) {
            const category = flattenCategories(options?.categories).find(option => option.childCategories.id === initialCategoryId)
            setSelectedCategory(category);
        }
        if (initialSizesId) {
            const sizes = options.sizes.filter(size => initialSizesId.includes(size._id));
            setSelectedSizes(sizes);
        }
        if (initialData?.images) {
            setUpdateFiles(initialData.images)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [initialBrandId, initialCategoryId, initialSizesId]);

    const handleDrop = (newFiles) => {
        const totalFiles = [...files, ...newFiles, ...updatefiles];
        const remainingSlots = 5 - totalFiles.length;
        if (remainingSlots < 0) {
            setErrorMessage('Maximum number of images exceeded. Please select up to 5 images.');
            newFiles.splice(remainingSlots);
        }
        else {
            setFiles((prevFiles) => [...prevFiles, ...newFiles]);
            formik.setFieldValue('images', [
                ...formik.values.images,
                ...newFiles,
            ]);
        }
    };


    const handleRemove = (file) => {
        setFiles((prevFiles) =>
            prevFiles.filter((_file) => _file.path !== file.path)
        );
        setUpdateFiles((prevFiles) =>
            prevFiles.filter((_file) => _file.url !== file.url)
        );
    };

    const handleRemoveAll = () => {
        setFiles([]);
    };

    // const onSubmitHandler = async (
    //     values,
    //     { setErrors, setStatus, setSubmitting }
    // ) => {
    //     try {
    //         let response;
    //         const formData = new FormData();
    //         formData.append('category', values.category);
    //         formData.append('description', values.description);
    //         values.images.forEach((image) => {
    //             formData.append("images", image);
    //         });
    //         formData.append('name', values.name);
    //         formData.append('price', values.price);
    //         values.sizes.forEach((size) => {
    //             formData.append("sizes", size);
    //         });
    //         formData.append('brand', values.brand);
    //         formData.append('countInStock', values.countInStock);
    //         formData.append('isFeatured', values.isFeatured);
    //         formData.append('isArchived', values.isArchived);
    //         formData.forEach((value, key) => {
    //             console.log(key + " " + value)
    //         });
    //         if (initialData) {
    //             response = productApi.UpdateProduct(initialData._id, formData)
    //         } else {
    //             response = productApi.AddProduct(formData);
    //         }
    //         console.log("Server response:", response);
    //         toast.promise(
    //             response,
    //             {
    //                 loading: 'Adding data',
    //                 error: 'Error while adding the data',
    //                 success: ' Product Added !'
    //             },
    //         );
    //         response
    //             .then(() => {
    //                 if (isMounted()) {
    //                     setStatus({ success: true });
    //                     setSubmitting(false);
    //                     navigate('/dashboard/products');
    //                 }
    //             })
    //             .catch((error) => {
    //                 if (isMounted()) {
    //                     setStatus({ success: false });
    //                     setErrors(error);
    //                     setSubmitting(false);
    //                 }
    //             });
    //     } catch (err) {
    //         console.error("Submit error:", err.response?.data || err.message);
    //         toast.error('Something went wrong!');
    //     }
    // };
const onSubmitHandler = async (values, { setErrors, setStatus, setSubmitting }) => {
  try {
    // Create FormData
    const formData = new FormData();
    formData.append('category', values.category);
    formData.append('description', values.description);
    formData.append('name', values.name);
    formData.append('price', values.price);
    formData.append('brand', values.brand);
    formData.append('countInStock', values.countInStock);
    formData.append('isFeatured', values.isFeatured);
    formData.append('isArchived', values.isArchived);

    // Append images
    values.images.forEach((image) => formData.append('images', image));

    // Append sizes as a JSON string (the backend will parse it)
   formData.append(
  'sizes',
  JSON.stringify(values.sizes.map(s => ({
            // actual size name like "Medium"
    sizeId: s.sizeId || s.size,        // or s._id if you're storing Mongo IDs
    stock: s.stock
  })))
);


    // Debug: Log all formData entries
    for (let [key, value] of formData.entries()) {
      console.log(`${key}:`, value);
    }

    // Send request
    let response;
    if (initialData) {
      response = await productApi.UpdateProduct(initialData._id, formData);
    } else {
      response = await productApi.AddProduct(formData);
    }

    console.log('Server response:', response.data);

    toast.success(initialData ? 'Product updated!' : 'Product added!');
    if (isMounted()) {
      setStatus({ success: true });
      setSubmitting(false);
      navigate('/dashboard/products');
    }
  } catch (err) {
    console.error('Submit error:', err.response?.data || err.message);
    toast.error('Failed to submit product!');
    if (isMounted()) {
      setStatus({ success: false });
      setErrors(err.response?.data || {});
      setSubmitting(false);
    }
  }
};



    const formik = useFormik({
        initialValues,
        validationSchema: ProductvalidationSchema,
        onSubmit: onSubmitHandler,
    });

    const {
        values,
        errors,
        touched,
        handleChange,
        handleBlur,
        handleSubmit,
        isSubmitting,
    } = formik;

    return (
        <>
            <form onSubmit={handleSubmit} noValidate>
                <Stack spacing={4}>
                    <Card>
                        <CardContent >
                            <Grid container
                                spacing={4}>
                                <Grid xs={12}
                                    md={4} mb={2}
                                >
                                    <Typography variant="h5" fontWeight="bold">
                                        Upload Images
                                    </Typography>
                                </Grid>
                                <Grid xs={12}
                                    md={8}>
                                    <FileDropzone
                                        caption="(SVG, JPG, PNG, or gif)"
                                        accept={{ "image/*": [] }}
                                        files={files}
                                        updatefiles={updatefiles}
                                        onDrop={handleDrop}
                                        onRemove={handleRemove}
                                        onRemoveAll={handleRemoveAll}
                                        error={touched.images && errors.images ? errors.images : errorMessage}
                                        id={initialData?._id}
                                    />
                                </Grid>
                            </Grid>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent >
                            <Grid
                                container
                                spacing={3}>
                                <Grid
                                    xs={12}
                                    md={6}
                                >
                                    <CustomInput
                                        required
                                        name="name"
                                        label="Product Name"
                                        value={values.name}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        error={touched.name && Boolean(errors.name)}
                                        helperText={touched.name && errors.name}
                                    />
                                </Grid>
                                <Grid
                                    xs={12}
                                    md={3}
                                >
                                    <CustomInput
                                        required
                                        name="countInStock"
                                        label="Stock"
                                        type="number"
                                        value={values.countInStock}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        error={touched.countInStock && Boolean(errors.countInStock)}
                                        helperText={touched.countInStock && errors.countInStock}
                                    />
                                </Grid>
                                <Grid
                                    xs={12}
                                    md={3}
                                >
                                    <CustomInput
                                        required
                                        name="price"
                                        label="Price"
                                        type="number"
                                        value={values.price}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        error={touched.price && Boolean(errors.price)}
                                        helperText={touched.price && errors.price}
                                    />
                                </Grid>
                                <Grid
                                    xs={12}
                                    md={6}
                                >

                                    <Autocomplete
                                        options={options.brands?.map((item) => ({ name: item.name, id: item._id }))}
                                        value={selectedBrand}
                                        onChange={(event, newValue) => {
                                            setSelectedBrand(newValue);
                                            formik.setFieldValue('brand', newValue ? newValue.id : '');
                                        }}
                                        isOptionEqualToValue={useCallback((option, value) => option?.id === value?._id, [])}
                                        onBlur={handleBlur}
                                        getOptionLabel={(option) => option.name}
                                        renderInput={(params) => (
                                            <TextField
                                                {...params}
                                                required
                                                name="brand"
                                                label="Brand Name"
                                                placeholder='Dior'
                                                error={touched.brand && Boolean(errors.brand)}
                                                helperText={touched.brand && errors.brand}
                                            />
                                        )}
                                    />

                                </Grid>
                                <Grid xs={12} md={6}>

                                    {/* <Autocomplete
                                        options={flattenCategories(options.categories)}
                                        groupBy={(option) => option.category}
                                        value={selectedCategory}
                                        getOptionLabel={(option) => option.childCategories ? option.childCategories.name : ''}
                                        onChange={(event, newValue) => {
                                            setSelectedCategory(newValue);
                                            formik.setFieldValue('category', newValue ? newValue?.childCategories?.id : '');
                                        }}
                                        isOptionEqualToValue={useCallback((option, value) => option?.childCategories && option?.childCategories?.id === value?.childCategories?.id, [])}
                                        renderInput={(params) => (
                                            <TextField
                                                {...params}
                                                required
                                                name="category"
                                                label="Category"
                                                error={formik.touched.category && Boolean(formik.errors.category)}
                                                helperText={formik.touched.category && formik.errors.category}
                                            />
                                        )}
                                    /> */}
                                    <Autocomplete
  options={flattenCategories(options.categories)}
  groupBy={(option) => option.category}
  value={selectedCategory}
  getOptionLabel={(option) => option.childCategories.name}
  onChange={(event, newValue) => {
      setSelectedCategory(newValue);
      formik.setFieldValue('category', newValue ? newValue.childCategories.id : '');
  }}
  isOptionEqualToValue={(option, value) =>
      option.childCategories.id === value.childCategories.id
  }
  renderInput={(params) => (
      <TextField
          {...params}
          required
          name="category"
          label="Category"
          error={formik.touched.category && Boolean(formik.errors.category)}
          helperText={formik.touched.category && formik.errors.category}
      />
  )}
/>

                                </Grid>
                                <Grid
                                    xs={12}
                                    md={6}
                                >
                                    {/* <Autocomplete
                                        multiple
                                        options={options.sizes.map((item) => ({ _id: item._id, name: item.name }))}
                                        value={selectedSizes}
                                        onChange={(event, newValue) => {
                                            const selectedSizes = newValue ? newValue.map(size => size._id) : [];
                                            setSelectedSizes(newValue)
                                            formik.setFieldValue('sizes', selectedSizes);
                                        }}
                                        isOptionEqualToValue={useCallback((option, value) => {
                                            return option?._id === value?._id;
                                        }, [])}
                                        onBlur={handleBlur}
                                        getOptionLabel={(option) => option.name}
                                        renderTags={(value, getTagProps) =>
                                            value
                                                .map((option, index) => (
                                                    <Chip
                                                        key={index}
                                                        variant="outlined"
                                                        label={option.name}
                                                        onDelete={() => {
                                                            const newSizes = values.sizes.filter((size) => size !== option._id);
                                                            formik.setFieldValue('sizes', newSizes);
                                                        }}
                                                        {...getTagProps({ index })}
                                                    />
                                                ))
                                        }
                                        renderInput={(params) => (
                                            <TextField
                                                {...params}
                                                required
                                                name="sizes"
                                                label="Size"
                                                error={touched.sizes && Boolean(errors.sizes)}
                                                helperText={touched.sizes && errors.sizes}
                                            />
                                        )}
                                    /> */}
{/* Select Sizes */}
<Autocomplete
  multiple
  options={options.sizes.map((item) => ({ _id: item._id, name: item.name }))}
  value={selectedSizes}
  onChange={(event, newValue) => {
    // When user selects sizes, add them with default stock = 0 if not present
    const updatedSizes = newValue.map((size) => {
      const existing = values.sizes.find((s) => s.size === size._id);
      return existing || { size: size._id, stock: 0 };
    });
    setSelectedSizes(newValue);
    formik.setFieldValue("sizes", updatedSizes);
  }}
  isOptionEqualToValue={(option, value) => option._id === value._id}
  onBlur={handleBlur}
  getOptionLabel={(option) => option.name}
  renderInput={(params) => (
    <TextField
      {...params}
      required
      name="sizes"
      label="Select Sizes"
      error={touched.sizes && Boolean(errors.sizes)}
      helperText={touched.sizes && errors.sizes}
    />
  )}
  sx={{ mt: 2 }}
/>

{/* Render Stock Inputs for Each Selected Size */}
{values.sizes.length > 0 && (
  <Card
    variant="outlined"
    sx={{
      mt: 2,
      p: 2,
      borderRadius: 2,
      borderColor: "divider",
      bgcolor: "background.paper",
    }}
  >
    <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 600 }}>
      Set Stock for Each Size
    </Typography>

    <Stack spacing={2}>
      {values.sizes.map((item, index) => {
        const sizeData = options.sizes.find((s) => s._id === item.size);
        return (
          <Stack
            key={item.size}
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            sx={{
              border: "1px solid",
              borderColor: "divider",
              borderRadius: 2,
              p: 1.5,
              bgcolor: "background.default",
            }}
          >
            {/* Size name */}
            <Typography sx={{ minWidth: 120, fontWeight: 500 }}>
              {sizeData?.name || "Size"}
            </Typography>

            {/* Stock input */}
            {/* <TextField
              type="number"
              label="Stock"
              size="small"
              sx={{ width: 120 }}
              value={item.stock}
              onChange={(e) => {
                const updated = [...values.sizes];
                updated[index].stock = Number(e.target.value);
                formik.setFieldValue("sizes", updated);
              }}
            /> */}<TextField
  type="number"
  label="Stock"
  size="small"
  sx={{ width: 120 }}
  value={item.stock === 0 ? "" : item.stock} // show blank instead of 0
  onChange={(e) => {
    const inputValue = e.target.value;

    const updated = [...values.sizes];
    updated[index].stock = inputValue === "" ? "" : Number(inputValue); // allow blank
    formik.setFieldValue("sizes", updated);
  }}
  onBlur={() => {
    // when user leaves the field, convert blank to 0
    const updated = [...values.sizes];
    if (updated[index].stock === "") updated[index].stock = 0;
    formik.setFieldValue("sizes", updated);
  }}
/>


            {/* Optional delete button */}
            <Button
              variant="outlined"
              color="error"
              size="small"
              onClick={() => {
                const updatedSizes = values.sizes.filter(
                  (s) => s.size !== item.size
                );
                const updatedSelected = selectedSizes.filter(
                  (s) => s._id !== item.size
                );
                setSelectedSizes(updatedSelected);
                formik.setFieldValue("sizes", updatedSizes);
              }}
            >
              Remove
            </Button>
          </Stack>
        );
      })}
    </Stack>
  </Card>
)}


                                </Grid>
                                <Grid
                                    xs={12}
                                    md={6}
                                >
                                    <TextField
                                        fullWidth
                                        required
                                        name="description"
                                        label="Product Description"
                                        value={values.description}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        error={touched.description && Boolean(errors.description)}
                                        helperText={touched.description && errors.description}
                                        multiline={true}
                                        maxRows={4}
                                    />
                                </Grid>
                            </Grid>


                            <Stack
                                spacing={3}
                                sx={{ mt: 3 }}
                            >
                                <Stack
                                    alignItems="center"
                                    direction="row"
                                    justifyContent="space-between"
                                    spacing={3}
                                >
                                    <Stack spacing={1}>
                                        <Typography
                                            gutterBottom
                                            variant="subtitle1"
                                        >
                                            Archived
                                        </Typography>
                                        <Typography
                                            color="text.secondary"
                                            variant="body2"
                                        >
                                            This product will not appear anywhere in the store.

                                        </Typography>
                                    </Stack>
                                    <Switch
                                        checked={formik.values.isArchived}
                                        color="primary"
                                        edge="start"
                                        name="isArchived"
                                        onChange={formik.handleChange}
                                        value={formik.values.isArchived}
                                    />
                                </Stack>
                                <Stack
                                    alignItems="center"
                                    direction="row"
                                    justifyContent="space-between"
                                    spacing={3}
                                >
                                    <Stack spacing={1}>
                                        <Typography
                                            gutterBottom
                                            variant="subtitle1"
                                        >
                                            Featured
                                        </Typography>
                                        <Typography
                                            color="text.secondary"
                                            variant="body2"
                                        >
                                            This product will appear on the home page
                                        </Typography>
                                    </Stack>
                                    <Switch
                                        checked={formik.values.isFeatured}
                                        color="primary"
                                        edge="start"
                                        name="isFeatured"
                                        onChange={formik.handleChange}
                                        value={formik.values.isFeatured}
                                    />
                                </Stack>
                            </Stack>
                        </CardContent>
                        <Stack sx={{ p: 3 }} >
                            <CustomButton
                                variant="contained"
                                type="submit"
                                disabled={isSubmitting}
                                size="large"
                            >
                                {isSubmitting ? "loading..." : initialData ? "Save changes" : "Create"}
                            </CustomButton>
                        </Stack>
                    </Card>
                </Stack >
            </form >
        </>
    );
};
ProductForm.propTypes = {
    initialData: PropTypes.object,
    options: PropTypes.object.isRequired,
};

export default ProductForm;
