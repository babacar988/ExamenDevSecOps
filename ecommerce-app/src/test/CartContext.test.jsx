import { describe, it, expect } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { CartProvider, useCart } from "../context/CartContext";

const product = { id: 1, title: "T-shirt", price: 10, image: "x.png" };
const product2 = { id: 2, title: "Sneakers", price: 50, image: "y.png" };

function wrapper({ children }) {
  return <CartProvider>{children}</CartProvider>;
}

describe("CartContext", () => {
  it("starts empty", () => {
    const { result } = renderHook(() => useCart(), { wrapper });
    expect(result.current.items).toHaveLength(0);
    expect(result.current.totalItems).toBe(0);
    expect(result.current.totalPrice).toBe(0);
  });

  it("adds a new product with quantity 1", () => {
    const { result } = renderHook(() => useCart(), { wrapper });
    act(() => result.current.addItem(product));
    expect(result.current.items).toHaveLength(1);
    expect(result.current.items[0].qty).toBe(1);
    expect(result.current.totalPrice).toBe(10);
  });

  it("increments quantity when the same product is added twice", () => {
    const { result } = renderHook(() => useCart(), { wrapper });
    act(() => {
      result.current.addItem(product);
      result.current.addItem(product);
    });
    expect(result.current.items).toHaveLength(1);
    expect(result.current.items[0].qty).toBe(2);
    expect(result.current.totalItems).toBe(2);
    expect(result.current.totalPrice).toBe(20);
  });

  it("removes an item from the cart", () => {
    const { result } = renderHook(() => useCart(), { wrapper });
    act(() => {
      result.current.addItem(product);
      result.current.addItem(product2);
      result.current.removeItem(product.id);
    });
    expect(result.current.items).toHaveLength(1);
    expect(result.current.items[0].id).toBe(product2.id);
  });

  it("drops an item when its quantity is set to 0", () => {
    const { result } = renderHook(() => useCart(), { wrapper });
    act(() => {
      result.current.addItem(product);
      result.current.setQty(product.id, 0);
    });
    expect(result.current.items).toHaveLength(0);
  });

  it("clears the cart", () => {
    const { result } = renderHook(() => useCart(), { wrapper });
    act(() => {
      result.current.addItem(product);
      result.current.addItem(product2);
      result.current.clearCart();
    });
    expect(result.current.items).toHaveLength(0);
  });

  it("computes total price across multiple quantities", () => {
    const { result } = renderHook(() => useCart(), { wrapper });
    act(() => {
      result.current.addItem(product); // 10
      result.current.addItem(product2); // 50
      result.current.setQty(product.id, 3); // 30
    });
    expect(result.current.totalPrice).toBe(80);
    expect(result.current.totalItems).toBe(4);
  });
});
