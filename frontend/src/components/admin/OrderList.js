import { Fragment, useEffect } from "react";
import { Button } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import {
  deleteOrder,
  adminOrders as adminOrdersAction,
} from "../../actions/orderActions";
import { clearError, clearOrderDeleted } from "../../slices/orderSlice";
import Loader from "../layouts/Loader";
import { MDBDataTable } from "mdbreact";
import { toast } from "react-toastify";
import Sidebar from "./Sidebar";

export default function OrderList() {
  const {
    adminOrders = [],
    loading = true,
    error,
    isOrderDeleted,
  } = useSelector((state) => state.orderState);
  const dispatch = useDispatch();

  const setOrders = () => {
    const currentDate = new Date();
    // const currentTime = currentDate.toLocaleTimeString();
    let orderId = 1;

    const data = {
      columns: [
        {
          label: "Order ID",
          field: "id",
          sort: "asc",
        },
        {
          label: "User ID",
          field: "userId",
          sort: "asc",
        },
        {
          label: "User Name",
          field: "userName",
          sort: "asc",
        },
        {
          label: "Product ID",
          field: "productId",
          sort: "asc",
        },
        {
          label: "Product Name",
          field: "productName",
          sort: "asc",
        },
        {
          label: "Booked Date",
          field: "todaysDate",
          sort: "asc",
        },
        {
          label: "Order Received Time",
          field: "orderReceivedTime",
          sort: "asc",
        },
      ],
      rows: [],
    };

    adminOrders.forEach((order) => {
      const { _id, user, userName, products, createdAt } = order;

      products.forEach((product) => {
        data.rows.push({
            id: _id, 
            userId: user,
            userName: userName,
            productId: product.productId,
            productName: product.productName,
            todaysDate: new Date(createdAt).toLocaleDateString(),
            orderReceivedTime: new Date(createdAt).toLocaleTimeString(),
          });
      });
    });

    return data;
  };

  const deleteHandler = (e, id) => {
    e.target.disabled = true;
    dispatch(deleteOrder(id));
  };

  useEffect(() => {
    if (error) {
      toast(error, {
        position: toast.POSITION.BOTTOM_CENTER,
        type: "error",
        onOpen: () => {
          dispatch(clearError());
        },
      });
      return;
    }
    if (isOrderDeleted) {
      toast("Order Deleted Succesfully!", {
        type: "success",
        position: toast.POSITION.BOTTOM_CENTER,
        onOpen: () => dispatch(clearOrderDeleted()),
      });
      return;
    }

    dispatch(adminOrdersAction);
  }, [dispatch, error, isOrderDeleted]);

  return (
    <div className="row">
      <div className="col-12 col-md-2">
        <Sidebar />
      </div>
      <div className="col-12 col-md-10">
        <h1 className="my-4">Order List</h1>
        <Fragment>
          {loading ? (
            <Loader />
          ) : (
            <MDBDataTable
              data={setOrders()}
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
