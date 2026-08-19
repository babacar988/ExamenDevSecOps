import { useCart } from "../context/CartContext";

export default function ProductCard({ product }) {
  const { addItem } = useCart();

  return (
    <div className="product-card">
      <img src={product.image} alt={product.title} loading="lazy" />
      <h3 title={product.title}>{product.title}</h3>
      <p className="product-category">{product.category}</p>
      <p className="product-price">{product.price.toFixed(2)} $</p>
      <button onClick={() => addItem(product)}>Ajouter au panier</button>
    </div>
  );
}
