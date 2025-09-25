import { useNavigate, useParams } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import AppContext from "../Context/Context";
import axios from "../axios";

const Product = () => {
  const { id } = useParams();
  const { addToCart, removeFromCart, refreshData } = useContext(AppContext);
  const [product, setProduct] = useState(null);
  const [imageUrl, setImageUrl] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(
          `https://spring-boot-project-2.onrender.com/api/product/${id}`
        );
        setProduct(response.data);
        if (response.data.imageName) {
          fetchImage();
        }
      } catch (error) {
        console.error("Error fetching product:", error);
      }
    };

    const fetchImage = async () => {
      const response = await axios.get(
        `https://spring-boot-project-2.onrender.com/api/product/${id}/image`,
        { responseType: "blob" }
      );
      setImageUrl(URL.createObjectURL(response.data));
    };

    fetchProduct();
  }, [id]);

  const deleteProduct = async () => {
    try {
      await axios.delete(`https://spring-boot-project-2.onrender.com/api/product/${id}`);
      removeFromCart(id);
      alert("Product deleted successfully");
      refreshData();
      navigate("/");
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  const handleEditClick = () => {
    navigate(`/product/update/${id}`);
  };

  const handlAddToCart = () => {
    addToCart(product);
    alert("Product added to cart");
  };

  if (!product) {
    return (
      <h2 className="text-center" style={{ padding: "10rem" }}>
        Loading...
      </h2>
    );
  }

  return (
    <div
      style={{
        fontFamily: "Poppins, sans-serif",
        maxWidth: "1200px",
        margin: "2rem auto",
        padding: "2rem",
        backgroundColor: "#f8f5f0",
        borderRadius: "20px",
        boxShadow: "0 10px 25px rgba(0, 0, 0, 0.08)",
        display: "flex",
        gap: "2rem",
      }}
    >
      <img
        src={imageUrl}
        alt={product.imageName}
        style={{
          width: "50%",
          height: "auto",
          objectFit: "cover",
          borderRadius: "20px",
          border: "3px solid #cfe9c2",
          boxShadow: "0 6px 12px rgba(0,0,0,0.1)",
        }}
      />

      <div style={{ width: "50%", display: "flex", flexDirection: "column" }}>
        <div style={{ marginBottom: "1rem" }}>
          <span
            style={{
              fontSize: "1rem",
              fontWeight: "bold",
              color: "#7d9d4c",
              textTransform: "uppercase",
              letterSpacing: "1px",
            }}
          >
            {product.category}
          </span>
          <div style={{ fontSize: "0.85rem", color: "#888", marginTop: "0.5rem" }}>
            <div>Listed: <i>{product.listedDate}</i></div>
            <div>Expiry: <i>{product.expiryDate}</i></div>
          </div>
        </div>

        <h1 style={{ fontSize: "2.2rem", marginBottom: "0.5rem", color: "#4c5c2d" }}>
          {product.name}
        </h1>
        <i style={{ marginBottom: "1rem", color: "#a57f54", fontSize: "1rem" }}>
          {product.brand}
        </i>

        <p
          style={{
            fontWeight: "600",
            fontSize: "1.1rem",
            marginTop: "1rem",
            marginBottom: "0.5rem",
            color: "#333",
          }}
        >
          Product Description
        </p>
        <p style={{ marginBottom: "1rem", color: "#555", lineHeight: "1.6" }}>
          {product.description}
        </p>

        <div style={{ marginTop: "auto" }}>
          <h2 style={{ color: "#386641", fontSize: "2rem", fontWeight: "bold" }}>
            ₹{product.price}
          </h2>

          <h6 style={{ margin: "1rem 0", fontSize: "1rem" }}>
            Stock Available:
            <i style={{ color: "green", fontWeight: "bold", marginLeft: "5px" }}>
              {product.stockQuantity}
            </i>
          </h6>

          <button
            onClick={handlAddToCart}
            disabled={!product.available}
            style={{
              padding: "1rem 2rem",
              fontSize: "1rem",
              backgroundColor: product.available ? "#6a994e" : "#ccc",
              color: "white",
              border: "none",
              borderRadius: "10px",
              cursor: product.available ? "pointer" : "not-allowed",
              marginBottom: "1rem",
              transition: "background 0.3s",
            }}
          >
            {product.available ? "Add to Cart" : "Out of Stock"}
          </button>

          <div style={{ display: "flex", gap: "1rem" }}>
            <button
              onClick={handleEditClick}
              style={{
                padding: "0.8rem 1.5rem",
                backgroundColor: "#52b788",
                color: "white",
                border: "none",
                borderRadius: "10px",
                cursor: "pointer",
              }}
            >
              Update
            </button>
            <button
              onClick={deleteProduct}
              style={{
                padding: "0.8rem 1.5rem",
                backgroundColor: "#e76f51",
                color: "white",
                border: "none",
                borderRadius: "10px",
                cursor: "pointer",
              }}
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Product;
