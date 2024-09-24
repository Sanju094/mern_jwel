import { useEffect } from 'react';
import { Fragment } from 'react';
import MetaData from '../layouts/MetaData';
import { MDBDataTable } from 'mdbreact';
import { useDispatch, useSelector } from 'react-redux';
import { userOrders as userOrdersAction } from '../../actions/orderActions';
import { Link } from 'react-router-dom';

const UserOrders = () => {
    const { userOrders = [] } = useSelector(state => state.orderState);
    const dispatch = useDispatch();
    console.log(userOrders);
    useEffect(() => {
        // Dispatch the action to fetch user orders when the component mounts
        dispatch(userOrdersAction());
        console.log("tharun44456");
    }, [dispatch]);

    const setOrders = () => {
        const data = {
            columns: [
                {
                    label: 'Order ID',
                    field: 'id',
                    sort: 'asc',
                },
                {
                    label: 'Product ID',
                    field: 'productId',
                    sort: 'asc',
                },
                {
                    label: 'Product Name',
                    field: 'productName',
                    sort: 'asc',
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

        userOrders && userOrders.forEach(userOrder => {
            
            const { _id, user, userName, products, createdAt } = userOrder;
            // Iterate over each order item and add a row for each item
            products.forEach(orderItem => {
                data.rows.push({
                    id: userOrder._id,
                    productId: orderItem.productId,
                    productName: orderItem.productName,
                    todaysDate: new Date(createdAt).toLocaleDateString(),
                    orderReceivedTime: new Date(createdAt).toLocaleTimeString(),
                });
                
            });
        });
        

        return data;
    };

    return (
        <Fragment>
            <MetaData title="My Orders" />
            <h1 className='mt-5'>My Orders</h1>
            <MDBDataTable
                className='px-3'
                bordered
                striped
                hover
                data={setOrders()}
            />
        </Fragment>
    );
};

export default UserOrders;
