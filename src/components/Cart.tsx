import React from 'react';
import { Trash2, Plus, Minus, ArrowLeft } from 'lucide-react';
import { CartItem } from '../types';

interface CartProps {
  cartItems: CartItem[];
  updateQuantity: (id: string, quantity: number) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
  getTotalPrice: () => number;
  onContinueShopping: () => void;
  onCheckout: () => void;
}

const Cart: React.FC<CartProps> = ({
  cartItems,
  updateQuantity,
  removeFromCart,
  clearCart,
  getTotalPrice,
  onContinueShopping,
  onCheckout
}) => {
  if (cartItems.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8 sm:py-12">
        <div className="text-center py-10 sm:py-16 bg-white rounded-3xl border-2 border-dashed border-gray-100">
          <div className="text-6xl sm:text-8xl mb-4 sm:mb-6">🍿</div>
          <h2 className="text-2xl sm:text-3xl font-outfit font-black text-snack-dark uppercase tracking-tight mb-2">Your cart is empty</h2>
          <p className="text-xs sm:text-gray-400 font-medium mb-6 sm:mb-8">hungry? let's grab some snacks!</p>
          <button
            onClick={onContinueShopping}
            className="bg-snack-blue text-white px-8 sm:px-10 py-3 sm:py-4 rounded-xl sm:rounded-2xl hover:bg-snack-dark transition-all duration-300 font-outfit font-black uppercase tracking-widest text-xs sm:text-sm shadow-xl shadow-snack-blue/20"
          >
            Explore Menu
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 sm:py-8">
      <div className="flex items-center justify-between mb-6 sm:mb-10">
        <button
          onClick={onContinueShopping}
          className="flex items-center space-x-2 text-snack-blue hover:text-snack-dark transition-colors duration-200 font-outfit font-bold uppercase text-[10px] sm:text-xs tracking-widest"
        >
          <ArrowLeft className="h-4 w-4 stroke-[3]" />
          <span className="hidden sm:inline">Go Back</span>
        </button>
        <h1 className="text-2xl sm:text-4xl font-outfit font-black text-snack-dark uppercase tracking-tighter">Your Order</h1>
        <button
          onClick={clearCart}
          className="text-gray-400 hover:text-red-500 transition-colors duration-200 font-outfit font-bold uppercase text-[8px] sm:text-[10px] tracking-widest"
        >
          Reset Cart
        </button>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden mb-8">
        {cartItems.map((item, index) => (
          <div key={item.id} className={`p-4 sm:p-8 ${index !== cartItems.length - 1 ? 'border-b border-gray-50' : ''}`}>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 sm:gap-6">
              <div className="flex-1">
                <h3 className="text-base sm:text-xl font-outfit font-black text-snack-dark uppercase tracking-tight mb-1 sm:mb-2">{item.name}</h3>
                <div className="space-y-1">
                  {item.selectedVariation && (
                    <div className="inline-block bg-snack-accent text-snack-blue px-3 py-1 rounded-lg text-xs font-outfit font-bold uppercase mr-2">
                      {item.selectedVariation.name}
                    </div>
                  )}
                  {item.selectedAddOns && item.selectedAddOns.length > 0 && (
                    <p className="text-xs text-gray-400 font-medium uppercase tracking-wider">
                      Extras: {item.selectedAddOns.map(addOn =>
                        addOn.quantity && addOn.quantity > 1
                          ? `${addOn.name} x${addOn.quantity}`
                          : addOn.name
                      ).join(', ')}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between md:justify-end gap-3 sm:gap-6">
                <div className="flex items-center bg-gray-50 rounded-lg sm:rounded-xl p-1 border border-gray-100">
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    className="p-1.5 sm:p-2 hover:bg-white text-snack-blue rounded-md sm:rounded-lg transition-all duration-200"
                  >
                    <Minus className="h-3 w-3 sm:h-4 sm:w-4 stroke-[3]" />
                  </button>
                  <span className="font-outfit font-black text-snack-dark min-w-[24px] sm:min-w-[32px] text-center text-sm">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    className="p-1.5 sm:p-2 hover:bg-white text-snack-blue rounded-md sm:rounded-lg transition-all duration-200"
                  >
                    <Plus className="h-3 w-3 sm:h-4 sm:w-4 stroke-[3]" />
                  </button>
                </div>

                <div className="text-right min-w-[80px] sm:min-w-[100px]">
                  <p className="text-base sm:text-xl font-outfit font-black text-snack-dark">₱{(item.totalPrice * item.quantity).toFixed(2)}</p>
                  <p className="text-[8px] sm:text-[10px] font-outfit font-bold text-gray-400 uppercase">₱{item.totalPrice} ea</p>
                </div>

                <button
                  onClick={() => removeFromCart(item.id)}
                  className="p-2 sm:p-3 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg sm:rounded-xl transition-all duration-200"
                >
                  <Trash2 className="h-4 w-4 sm:h-5 sm:w-5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-snack-dark rounded-3xl p-6 sm:p-8 shadow-2xl text-white">
        <div className="flex items-center justify-between mb-6 sm:mb-8">
          <div>
            <p className="font-outfit font-bold text-gray-400 uppercase tracking-[0.2em] text-[8px] sm:text-[10px] mb-1">Total Amount</p>
            <span className="text-3xl sm:text-4xl font-outfit font-black tracking-tighter">₱{(getTotalPrice() || 0).toFixed(2)}</span>
          </div>
        </div>

        <button
          onClick={onCheckout}
          className="w-full h-14 sm:h-16 bg-snack-blue text-white rounded-xl sm:rounded-2xl hover:bg-white hover:text-snack-dark transition-all duration-300 transform hover:scale-[1.02] font-outfit font-black uppercase tracking-widest text-base sm:text-lg shadow-xl active:scale-95"
        >
          Checkout Now
        </button>
      </div>
    </div>
  );
};

export default Cart;