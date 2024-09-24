import { Fragment } from 'react'
import {useDispatch, useSelector} from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { decreaseCartItemQty, increaseCartItemQty,removeItemFromCart } from '../../slices/cartSlice';

export default function Cart() {
    const {items } = useSelector(state => state.cartState)
    const { user } = useSelector(state => state.userState); 
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const increaseQty = (item) => {
        const count = item.quantity;
        if(item.stock ==0 ||  count >= item.stock) return;
        dispatch(increaseCartItemQty(item.product))
    }
    const decreaseQty = (item) => {
        const count = item.quantity;
        if(count == 1) return;
        dispatch(decreaseCartItemQty(item.product))
    }
    const checkoutHandler = () =>{
        navigate('/login?redirect=shipping')
        const productDetails = items.map(item => `productId=${item.product}&productName=${item.name}`).join('&');
        navigate(`/shipping?${productDetails}`);
    }

    // const checkoutHandler = () => {
    //     if (!user || !user.isAuthenticated) {
    //         navigate('/login?redirect=shipping');
    //     } else {
    //         const productDetails = items.map(item => `productId=${item.product}&productName=${item.name}`).join('&');
    //         navigate(`/shipping?${productDetails}`);
    //     }
    // };
    
    return (
        <Fragment>
            {items.length==0 ? 
                <h2 className="mt-5">Your wishlist is Empty</h2> :
                <Fragment>
                     <h2 className="mt-5">Your Cart: <b>{items.length} items</b></h2>
                    <div className="row d-flex justify-content-between">
                        <div className="col-12 col-lg-8">
                            {items.map(item => (
                                <Fragment key={item.product}>
                                    <hr />
                                    <div className="cart-item">
                                        <div className="row">
                                            <div className="col-4 col-lg-3">
                                                <img src={item.image} alt={item.name} height="90" width="115"/>
                                            </div>

                                            <div className="col-5 col-lg-3">
                                                <Link to={`/product/${item.product}`} style={{fontSize:"30px", color:"rede"}}>{item.name}</Link>
                                            </div>
                                            
                                            {/* <div className="col-4 col-lg-2 mt-4 mt-lg-0">
                                                <p id="card_item_price">₹{item.price}</p>
                                            </div> */}

                                            

                                            <div className="col-4 col-lg-3 mt-4 mt-lg-0">
                                                <div className="stockCounter d-inline">
                                                    <span className="btn btn-danger minus" onClick={() => decreaseQty(item)}>-</span>
                                                    <input type="number" className="form-control count d-inline" value={item.quantity} readOnly />

                                                    <span className="btn btn-primary plus" onClick={() => increaseQty(item)}>+</span>
                                                </div>
                                            </div>

                                            <div className="col-4 col-lg-1 mt-4 mt-lg-0">
                                                <i id="delete_cart_item" onClick={() => dispatch(removeItemFromCart(item.product))} className="fa fa-trash btn btn-danger"></i>
                                            </div>

                                        </div>
                                    </div>
                                </Fragment>
                                )
                            )
                            }

                         
                            <hr />
                        </div>

                        <div className="col-12 col-lg-3 my-4">
                            <div id="order_summary">
                                <h4>Order Summary</h4>
                                <hr />
                                <p>Subtotal:  <span className="order-summary-values">{items.reduce((acc, item)=>(acc + item.quantity), 0)} (Units)</span></p>
                                {/* <p>Est. total: <span className="order-summary-values">₹{items.reduce((acc, item)=>(acc + item.quantity * item.price), 0)}</span></p> */}
                
                                <hr />
                                <button id="checkout_btn" onClick={checkoutHandler} className="btn btn-primary btn-block">Book now</button>
                            </div>
                        </div>
                    </div>
                </Fragment>
            }
           
        </Fragment>
    )
}