import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ProductCard from "../components/ProductCard";
import { CartProvider, useCart } from "../context/CartContext";

const product = {
  id: 1,
  title: "Casque audio sans fil",
  price: 29.99,
  image: "https://example.com/img.png",
  category: "electronics",
};

function CartPeek() {
  const { totalItems } = useCart();
  return <span data-testid="total-items">{totalItems}</span>;
}

function renderWithCart(ui) {
  return render(
    <CartProvider>
      {ui}
      <CartPeek />
    </CartProvider>
  );
}

describe("ProductCard", () => {
  it("renders the product title, category and price", () => {
    renderWithCart(<ProductCard product={product} />);
    expect(screen.getByText(product.title)).toBeInTheDocument();
    expect(screen.getByText(product.category)).toBeInTheDocument();
    expect(screen.getByText("29.99 $")).toBeInTheDocument();
  });

  it("adds the product to the cart when clicking the button", async () => {
    const user = userEvent.setup();
    renderWithCart(<ProductCard product={product} />);
    await user.click(screen.getByRole("button", { name: /ajouter au panier/i }));
    expect(screen.getByTestId("total-items").textContent).toBe("1");
  });
});
