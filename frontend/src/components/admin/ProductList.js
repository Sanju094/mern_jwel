import { Fragment, useEffect, useState } from "react";
import { Button, Form } from "react-bootstrap"; // Added Form from react-bootstrap
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import {
  deleteProduct,
  getAdminProducts,
  updateProductPrice,
} from "../../actions/productActions"; // Assuming updateProductPrice action is available
import { clearError, clearProductDeleted } from "../../slices/productSlice";
import Loader from "../layouts/Loader";
import { MDBDataTable } from "mdbreact";
import { toast } from "react-toastify";
import Sidebar from "./Sidebar";

export default function ProductList() {
  const {
    products = [],
    loading = true,
    error,
  } = useSelector((state) => state.productsState);
  const { isProductDeleted, error: productError } = useSelector(
    (state) => state.productState
  );
  const dispatch = useDispatch();
  const [multiplier, setMultiplier] = useState(1); // State to store multiplier value
  const [selectedProduct, setSelectedProduct] = useState("gold");

  useEffect(() => {
    const storedPrices =
      JSON.parse(localStorage.getItem("updatedPrices")) || {};
    setUpdatedPrices(storedPrices);
  }, []);

  const [updatedPrices, setUpdatedPrices] = useState({});
  const handleMultiplierChange = (e) => {
    setMultiplier(parseFloat(e.target.value)); // Parse the value to float
  };

  const setProducts = () => {
    const data = {
      columns: [
        {
          label: "ID",
          field: "id",
          sort: "asc",
        },
        {
          label: "Name",
          field: "name",
          sort: "asc",
        },
        {
          label: "Weight(in grams)",
          field: "gram",
        },
        {
          label: "Price",
          field: "price",
          sort: "asc",
        },
        {
          label: "Our Price",
          field: "rtprice",
          sort: "asc",
        },
        {
          label: "category",
          field: "category",
        },
        {
          label: "Stock",
          field: "stock",
          sort: "asc",
        },
        {
          label: "Actions",
          field: "actions",
          sort: "asc",
        },
      ],
      rows: [],
    };

    products.forEach((product) => {
      const updatedPrice =
        updatedPrices[product._id] || parseFloat(product.gram) * multiplier;
      data.rows.push({
        id: product._id,
        name: product.name,
        gram: product.gram,
        category: product.category,
        price: `₹${updatedPrice}`, // Use updated price if available, otherwise calculate based on multiplier
        rtprice: product.rtprice,
        stock: product.stock,
        actions: (
          <Fragment>
            <Link
              to={`/admin/product/${product._id}`}
              className="btn btn-primary"
            >
              {" "}
              <i className="fa fa-pencil"></i>
            </Link>
            <Button
              onClick={(e) => deleteHandler(e, product._id)}
              className="btn btn-danger py-1 px-2 ml-2"
            >
              <i className="fa fa-trash"></i>
            </Button>
          </Fragment>
        ),
      });
    });

    return data;
  };

  const deleteHandler = (e, id) => {
    e.target.disabled = true;
    dispatch(deleteProduct(id));
  };

  useEffect(() => {
    if (error || productError) {
      toast(error || productError, {
        position: toast.POSITION.BOTTOM_CENTER,
        type: "error",
        onOpen: () => {
          dispatch(clearError());
        },
      });
      return;
    }
    if (isProductDeleted) {
      toast("Product Deleted Succesfully!", {
        type: "success",
        position: toast.POSITION.BOTTOM_CENTER,
        onOpen: () => dispatch(clearProductDeleted()),
      });
      return;
    }

    dispatch(getAdminProducts);
  }, [dispatch, error, isProductDeleted]);

  // Function to update price in database

  //  const updatePriceInDB = () => {
  //   const updatedPricesCopy = { ...updatedPrices };
  //   products.forEach((product) => {
  //     const updatedPrice = parseFloat(product.gram) * multiplier;
  //     updatedPricesCopy[product._id] = updatedPrice;
  //     dispatch(updateProductPrice(product._id, updatedPrice));
  //   });
  //   setUpdatedPrices(updatedPricesCopy);

  //   // Store updated prices in localStorage
  //   localStorage.setItem("updatedPrices", JSON.stringify(updatedPricesCopy));
  // };

  const updatePriceInDB = () => {
    const updatedPricesCopy = { ...updatedPrices };
    // Filter products based on the selected category
    const filteredProducts = products.filter(
      (product) => product.category === selectedProduct
    );

    filteredProducts.forEach((product) => {
      const updatedPrice = parseFloat(product.gram) * multiplier;
      updatedPricesCopy[product._id] = updatedPrice;
      dispatch(updateProductPrice(product._id, updatedPrice));
    });
    setUpdatedPrices(updatedPricesCopy);

    // Store updated prices in localStorage
    localStorage.setItem("updatedPrices", JSON.stringify(updatedPricesCopy));
  };

  const handleProductChange = (e) => {
    setSelectedProduct(e.target.value);
  };

  return (
    <div className="row">
      <div className="col-12 col-md-2">
        <Sidebar />
      </div>
      <div className="col-12 col-md-10">
        <h1 className="my-4">Product List</h1>
        <div>
          <label htmlFor="product">Select Category:</label>
          <select
            id="product"
            value={selectedProduct}
            onChange={handleProductChange}
            className="form-control"
            style={{ width: "300px" }}
          >
            <option>--Select--</option>
            <option value="Gold">Gold</option>
            <option value="Diamond">Diamond</option>
            <option value="Silver">Silver</option>
          </select>
        </div>
        <br></br>

        <Form.Group controlId="multiplier">
          <Form.Label>Today's Rate</Form.Label>
          <Form.Control
            type="number"
            placeholder="Enter Today's rate"
            value={multiplier}
            onChange={handleMultiplierChange}
            className="form-control"
            style={{ width: "100px" }}
          />
          <br></br>
          <Button style={{}} onClick={updatePriceInDB}>
            Update Prices
          </Button>{" "}
          {/* Button to update prices in database */}
        </Form.Group>
        <Fragment>
          {loading ? (
            <Loader />
          ) : (
            <MDBDataTable
              data={setProducts()}
              bordered
              striped
              hover
              className="px-3"
            />
          )}
        </Fragment>
      </div>
    </div>
  );
}
