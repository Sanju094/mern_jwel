import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { createOrder, userOrders  } from "../../actions/orderActions"; 
import { toast } from "react-toastify";
import Success from "./success";

const Shipping = () => {
  const [products, setProducts] = useState([]);
  const [userName, setUserName] = useState("");
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useSelector((state) => state.authState);

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const productParams = [];

    const productDetails = {};

    for (let [key, value] of searchParams) {
      if (key === "productId" || key === "productName") {
        if (key === "productId") {
          productDetails.productId = value;
        }
        if (key === "productName") {
          productDetails.productName = value;
        }
        if (productDetails.productId && productDetails.productName) {
          productParams.push({ ...productDetails });
          productDetails.productId = "";
          productDetails.productName = "";
        }
      }
    }

    setProducts(productParams);
  }, [location.search]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    // Prepare order data
    const orderData = {
      user: isAuthenticated ? user._id : null,
      userName: isAuthenticated ? user.name : userName,
      products: products,
    };

    try {
      const response = await dispatch(createOrder(orderData));
      if (response.success) {
        // sendConfirmationEmail(user.email);
        toast.success("Order placed successfully!");
          navigate('/success')
          dispatch(userOrders());
        } else {
        toast.error("Failed to place order. Please try again.");
      }
    } catch (error) {
      console.error("Error creating order:", error);
      toast.error("An error occurred. Please try again later.");
    }
  };

  // const sendConfirmationEmail = async (recipientEmail) => {
  //   // Create transporter
  //   const transporter = nodemailer.createTransport({
  //     host: "live.smtp.mailtrap.io",
  //     port: 587,
  //     secure: false,
  //     auth: {
  //       user: "api",
  //       pass: "55f4ca3cee0df03e582b7984f88b2a6c",
  //     },
  //   });

  //   try {
  //     // Send mail with defined transport object
  //     await transporter.sendMail({
  //       from: "rathnajewellery@gmail.com",
  //       to: recipientEmail,
  //       subject: "Confirmation mail",
  //       text: "Hello world",
  //     });
      
  //     console.log("Confirmation email sent successfully!");
  //   } catch (error) {
  //     console.error("Error sending confirmation email:", error);
  //   }
  // };

  return (
    <div className="row wrapper">
      <div className="col-10 col-lg-5">
        <form
          onSubmit={handleSubmit}
          className="shadow-lg"
          encType="multipart/form-data"
        >
          <h1 className="mb-3">Booking</h1>

          {/* If user is authenticated, display their name */}
          {isAuthenticated && (
            <div className="form-group">
              <label>User Name:</label>
              <input
                type="text"
                value={user.name}
                readOnly
                className="form-control"
              />
            </div>
          )}

          {/* If user is not authenticated, allow input for user name */}
          {!isAuthenticated && (
            <div className="form-group">
              <label htmlFor="userName">User Name:</label>
              <input
                type="text"
                id="userName"
                name="userName"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                className="form-control"
                required
              />
            </div>
          )}

          {products.map((product, index) => (
            <div key={index} className="form-group">
              <label htmlFor={`productId${index}`}>Product ID:</label>
              <input
                type="text"
                id={`productId${index}`}
                name="productId"
                value={product.productId}
                readOnly
                className="form-control"
              />
              <label htmlFor={`productName${index}`}>Product Name:</label>
              <input
                type="text"
                id={`productName${index}`}
                name="productName"
                value={product.productName}
                readOnly
                className="form-control"
              />
            </div>
          ))}

          <button type="submit" className="btn btn-block py-3">
            Confirm Order
          </button>
        </form>
      </div>
    </div>
  );
};

export default Shipping;
