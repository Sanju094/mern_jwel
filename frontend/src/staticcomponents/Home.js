import React, { useState } from "react";
//import { Link, NavLink } from "react-router-dom";
import {Carousel} from 'react-bootstrap';

import "./Home.css";
// import "bootstrap/dist/css/bootstrap.min.css";
// import Layout from "./Layout/Layout";

function Home() {
  return (
    <div>
      <br></br>
      <br></br>

      <div className="img">
      <Carousel>
        <Carousel.Item>
          <img
            className="d-block w-100"
            src="./walpp.png"
            alt="First slide"
            style={{ width: "100%", height: "50%" }}
          />
        </Carousel.Item>
        <Carousel.Item>
          <img
            className="d-block w-100"
            src="./walpp.png"
            alt="First slide"
            style={{ width: "100%", height: "50%" }}
          />
        </Carousel.Item>
        <Carousel.Item>
          <img
            className="d-block w-100"
            src="./walpp.png"
            alt="First slide"
            style={{ width: "100%", height: "50%" }}
          />
        </Carousel.Item>
        {/* Add more Carousel.Item components with additional images */}
      </Carousel>
    </div>

      <div className="container mt-5">
        <h3>Explore us!!</h3>
        <div className="row">
          <div className="col-md-4">
            <div className="card">
              <a href="./products">
                <img
                  src="./l3.webp"
                  className="card-img-top"
                  alt="Image 1"
                  style={{ height: 300, width: 325 }}
                />
              </a>
              <div className="card-body">
                <h5 className="card-title">
                  <b>Shop here</b>
                </h5>
                <p className="card-text">Click me to visit Ur favourables</p>
              </div>
            </div>
          </div>

          <div className="col-md-4">
            <div className="card">
              <a href="./about">
                <img
                  src="./l4.jpg"
                  className="card-img-top"
                  alt="Image 2"
                  style={{ height: 300, width: 335 }}
                />
              </a>
              <div className="card-body">
                <h5 className="card-title">
                  <b>Wanna know about us</b>
                </h5>
                <p className="card-text">Just pinch me....</p>
              </div>
            </div>
          </div>

          <div className="col-md-4">
            <div className="card">
              <img
                src="./c1.png"
                className="card-img-top"
                alt="Image 3"
                style={{ height: 300, width: 335 }}
              />
              <div className="card-body">
                <h5 className="card-title">
                  <b>Connect with us</b>
                </h5>
                <p className="card-text">
                  Awaiting to clear your Queries and do some serives
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <hr></hr>
      <br></br>
      <br></br>
      <div className="img">
        <a href="/products">
          <img
            src="./gg.gif"
            alt="MyImage"
            style={{ width: "100%", height: "auto" }} // Adjusted height to maintain aspect ratio
          />
        </a>
      </div>

      <br></br>
      <br></br>
      <br></br>

      <br></br>
      <br></br>

      {/* Legacy */}
      
    </div>
  );
}

export default Home;
