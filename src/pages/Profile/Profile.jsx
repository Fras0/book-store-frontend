import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import Dashboard from "./../../components/Dashboard/Dashboard";
import Navbar from "../../components/Navbar/Navbar";
import coverImg from "../../images/book_default_image.jpg";
import "./Profile.css";

const Profile = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [books, setBooks] = useState([]);
  const [error, setError] = useState("");
  const [categoryName, setCategoryName] = useState("");
  const [categoryLoading, setCategoryLoading] = useState(false);
  const [categoryError, setCategoryError] = useState("");

  const fetchUserProfile = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        setError("User not authenticated");
        setLoading(false);
        return;
      }

      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/users/myProfile`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );

      setUserData(response.data.data.data);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching profile:", err);
      setError("Failed to load profile. Please try again.");
      setLoading(false);
    }
  };

  const fetchBooks = async () => {
    let response;
    setLoading(true);
    try {
      const token = localStorage.getItem("token");

      if (userData.role === "seller" || userData.role === "admin") {
        response = await axios.get(
          `${process.env.REACT_APP_API_URL}/books/seller/${userData._id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            withCredentials: true,
          }
        );
      } else if (userData.role === "buyer") {
        response = await axios.get(
          `${process.env.REACT_APP_API_URL}/books/purchased/${userData._id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            withCredentials: true,
          }
        );
      }

      const docs = response.data.data.books;
      if (docs) {
        const newBooks = docs.map((bookSingle) => {
          const { _id, name, category, price, seller, cover } = bookSingle;
          return {
            id: _id,
            title: name,
            author: seller,
            price: price,
            category: category,
            imageUrl: cover ? "put the cover image link here" : coverImg,
          };
        });
        setBooks(newBooks);
      } else {
        setBooks([]);
      }
      setLoading(false);
    } catch (err) {
      console.error("Error fetching books:", err);
      setBooks([]);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserProfile();
  }, []);

  useEffect(() => {
    if (userData) {
      fetchBooks();
    }
  }, [userData]);

  const handleCategoryChange = (event) => {
    setCategoryName(event.target.value);
  };

  const handleAddCategory = async () => {
    if (!categoryName.trim()) {
      setCategoryError("Category name cannot be empty.");
      return;
    }

    setCategoryLoading(true);
    setCategoryError("");

    try {
      const token = localStorage.getItem("token");

      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/categories`,
        { name: categoryName },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 201) {
        alert("Category added successfully!");
        setCategoryName("");
      }
    } catch (err) {
      console.error("Error adding category:", err);
      setCategoryError("Failed to add category. Please try again.");
    } finally {
      setCategoryLoading(false);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <>
      <Navbar />
      <div className="profile-page">
        <div className="profile-container">
          <h2>Welcome, {userData.name}!</h2>
          <p>
            <strong>Email:</strong> {userData.email}
          </p>

          {(userData.role === "seller" || userData.role === "admin") && (
            <Link to="/add-book">
              <button className="add-book-btn">Add Book</button>
            </Link>
          )}

          {userData.role === "admin" && (
            <div className="add-category-section">
              <h3>Add New Category</h3>
              <input
                type="text"
                placeholder="Enter category name"
                value={categoryName}
                onChange={handleCategoryChange}
                disabled={categoryLoading}
              />
              <button
                onClick={handleAddCategory}
                disabled={categoryLoading}
                className="add-category-btn"
              >
                {categoryLoading ? "Adding..." : "Add Category"}
              </button>
              {categoryError && (
                <p className="error-message">{categoryError}</p>
              )}
            </div>
          )}
        </div>
        <div className="booklist">
          <h2>My Books</h2>
          <div className="booklist-content">
            {books.length > 0 ? (
              books.map((book) => (
                <Link key={book.id} to={`/books/${book.id}`}>
                  <div className="book-item">
                    <div className="book-item-img">
                      <img src={book.imageUrl} alt={book.title} />
                    </div>
                    <div className="book-item-info">
                      <h3>{book.title}</h3>
                      <p>Author: {book.author.name}</p>
                      <p>Price: ${book.price}</p>
                    </div>
                  </div>
                </Link>
              ))
            ) : (
              <p>No books available.</p>
            )}
          </div>
        </div>

        {(userData.role === "seller" || userData.role === "admin") && (
          <div className="dashboard-container">
            <h2>Your Sales Dashboard</h2>
            <Dashboard />
          </div>
        )}
      </div>
    </>
  );
};

export default Profile;
