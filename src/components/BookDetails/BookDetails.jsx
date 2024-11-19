import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Loading from "../Loader/Loader";
import coverImg from "../../images/book_default_image.jpg";
import Navbar from "../Navbar/Navbar";
import axios from "axios";
import "./BookDetail.css";
import CheckoutForm from "./CheckoutForm";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

import { jwtDecode } from "jwt-decode";

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLIC_KEY);
const URL = `${process.env.REACT_APP_API_URL}/books/`;

const BookDetails = () => {
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [book, setBook] = useState(null);
  const [hasAccess, setHasAccess] = useState(false);
  const [clientSecret, setClientSecret] = useState(null);

  const [couponCode, setCouponCode] = useState("");
  const [discountedPrice, setDiscountedPrice] = useState(null);
  const [isOwner, setIsOwner] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchBookDetails = async () => {
      setLoading(true);
      const token = localStorage.getItem("token");

      try {
        const response = await axios.get(`${URL}${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = response.data.data.data;

        if (data) {
          const { name, seller, price, covers, description } = data;
          setBook({
            name,
            seller,
            price,
            cover_img: covers || coverImg,
            description: description || "No description available",
          });

          const decodedToken = jwtDecode(token);
          const isOwnerCheck = decodedToken.id === seller._id;
          setIsOwner(isOwnerCheck);

          setHasAccess(isOwnerCheck);
        }

        const accessResponse = await axios.get(`${URL}${id}/hasAccess`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (accessResponse.data.data.hasAccess) {
          setHasAccess(true);
        }
      } catch (error) {
        console.error("Error fetching book details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBookDetails();
  }, [id, URL]);

  const openBookInBrowser = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await axios.get(`${URL}${id}/download`, {
        headers: { Authorization: `Bearer ${token}` },
        responseType: "blob",
        withCredentials: true,
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `${book.name}.pdf`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      navigate("/login");
    }
  };

  const handleCouponApply = async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/coupons/apply`,
        { bookId: id, couponCode },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const { discountedPrice } = response.data.data;
      setDiscountedPrice(discountedPrice);
    } catch (error) {
      console.error("Error applying coupon:", error.response || error.message);
      alert(error.response?.data.message || "Invalid coupon");
    }
  };

  const handleAddCoupon = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);

    const token = localStorage.getItem("token");
    const couponData = {
      code: formData.get("code"),
      discountPercentage: parseInt(formData.get("discountPercentage"), 10),
      expirationDate: formData.get("expirationDate"),
      bookId: id,
      sellerId: jwtDecode(token).id,
    };
    try {
      await axios.post(
        `${process.env.REACT_APP_API_URL}/coupons/add`,
        couponData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      alert("Coupon added successfully!");
      e.target.reset();
    } catch (error) {
      console.error("Error adding coupon:", error.response || error.message);
      alert(error.response?.data.message || "Failed to add coupon");
    }
  };

  const handlePurchase = async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/purchase/${id}`,
        { couponCode: couponCode },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setClientSecret(response.data.clientSecret);
    } catch (error) {
      console.error("Error purchasing book:", error.response || error.message);
    }
  };

  if (loading) return <Loading />;

  return (
    <>
      <Navbar />
      <section className="book-details">
        <div className="container">
          <div className="book-details-content grid">
            <div className="book-details-img">
              <img src={book?.cover_img} alt="Book cover" />
            </div>
            <div className="book-details-info">
              <div className="book-details-item title">
                <span>{book?.name}</span>
              </div>
              <div className="book-details-item description">
                <span>{book?.description}</span>
              </div>
              <div className="book-details-item price">
                <span>Price: ${discountedPrice ?? book?.price}</span>
              </div>

              {hasAccess ? (
                <button className="read-btn" onClick={openBookInBrowser}>
                  Read Book
                </button>
              ) : clientSecret ? (
                <div className="checkout-form">
                  <Elements stripe={stripePromise}>
                    <CheckoutForm
                      clientSecret={clientSecret}
                      bookDetails={{
                        name: book?.name,
                        price: discountedPrice ?? book?.price,
                      }}
                      onPurchaseSuccess={() => {
                        setClientSecret(null);
                        setHasAccess(true);
                      }}
                    />
                  </Elements>
                </div>
              ) : (
                <div className="apply-coupon-section">
                  <input
                    className="coupon-code-input"
                    type="text"
                    placeholder="Enter Coupon Code"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                  />
                  <button
                    className="apply-coupon-btn"
                    onClick={handleCouponApply}
                  >
                    Apply Coupon
                  </button>
                  <button className="purchase-btn" onClick={handlePurchase}>
                    Purchase Book
                  </button>
                </div>
              )}

              {isOwner && (
                <form className="add-coupon-form" onSubmit={handleAddCoupon}>
                  <h3 className="add-coupon-title">Add Coupon</h3>
                  <input
                    className="coupon-code-input-owner"
                    name="code"
                    type="text"
                    placeholder="Coupon Code"
                    required
                  />
                  <input
                    className="discount-percentage-input"
                    name="discountPercentage"
                    type="number"
                    placeholder="Discount (%)"
                    min="1"
                    max="100"
                    required
                  />
                  <input
                    className="expiration-date-input"
                    name="expirationDate"
                    type="date"
                    required
                  />
                  <button className="add-coupon-btn" type="submit">
                    Add Coupon
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default BookDetails;
