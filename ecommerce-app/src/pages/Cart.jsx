import { useCart } from "../context/CartContext";

export default function Cart() {
  const { items, removeItem, setQty, clearCart, totalPrice } = useCart();

  if (items.length === 0) {
    return <p className="status">Votre panier est vide.</p>;
  }

  return (
    <div className="cart-page">
      <table>
        <thead>
          <tr>
            <th>Produit</th>
            <th>Prix</th>
            <th>Quantité</th>
            <th>Sous-total</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.id}>
              <td>{item.title}</td>
              <td>{item.price.toFixed(2)} $</td>
              <td>
                <input
                  type="number"
                  min="1"
                  value={item.qty}
                  onChange={(e) => setQty(item.id, Number(e.target.value))}
                />
              </td>
              <td>{(item.price * item.qty).toFixed(2)} $</td>
              <td>
                <button onClick={() => removeItem(item.id)}>Retirer</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="cart-summary">
        <p>Total : {totalPrice.toFixed(2)} $</p>
        <button onClick={clearCart}>Vider le panier</button>
        <button className="checkout" onClick={() => alert("Commande simulée avec succès !")}>
          Passer la commande
        </button>
      </div>
    </div>
  );
}
