import React, { useState } from 'react';
import { Plus, Minus, ShoppingCart, X } from 'lucide-react';
import { MenuItem, Variation, AddOn, CartItem } from '../types';

interface MenuItemCardProps {
  item: MenuItem;
  onAddToCart: (item: CartItem) => void;
  cartItem?: CartItem;
  updateQuantity?: (id: string, quantity: number) => void;
}

const SHOW_IMAGES = true;

const MenuItemCard: React.FC<MenuItemCardProps> = ({
  item,
  onAddToCart,
  cartItem,
  updateQuantity
}) => {
  const [showCustomization, setShowCustomization] = useState(false);
  const [selectedVariation, setSelectedVariation] = useState<Variation | null>(
    item.variations && item.variations.length > 0 ? item.variations[0] : null
  );
  const [selectedAddOns, setSelectedAddOns] = useState<AddOn[]>([]);

  const quantity = cartItem?.quantity || 0;

  const handleAddToCart = () => {
    if ((item.variations && item.variations.length > 0) || (item.addOns && item.addOns.length > 0)) {
      setShowCustomization(true);
    } else {
      onAddToCart({
        ...item,
        quantity: 1,
        totalPrice: item.effectivePrice || item.basePrice
      });
    }
  };

  const calculatePrice = () => {
    let price = item.effectivePrice || item.basePrice;
    if (selectedVariation) {
      price += selectedVariation.price;
    }
    selectedAddOns.forEach(addOn => {
      price += addOn.price * (addOn.quantity || 1);
    });
    return price;
  };

  const handleCustomizedAddToCart = () => {
    onAddToCart({
      ...item,
      quantity: 1,
      selectedVariation: selectedVariation || undefined,
      selectedAddOns: selectedAddOns.length > 0 ? selectedAddOns : undefined,
      totalPrice: calculatePrice()
    });
    setShowCustomization(false);
    setSelectedAddOns([]);
  };

  const handleIncrement = () => {
    if (updateQuantity && cartItem) {
      updateQuantity(cartItem.id, cartItem.quantity + 1);
    }
  };

  const handleDecrement = () => {
    if (updateQuantity && cartItem) {
      updateQuantity(cartItem.id, Math.max(0, cartItem.quantity - 1));
    }
  };

  const updateAddOnQuantity = (addOn: AddOn, newQuantity: number) => {
    if (newQuantity <= 0) {
      setSelectedAddOns(selectedAddOns.filter(a => a.id !== addOn.id));
    } else {
      const existing = selectedAddOns.find(a => a.id === addOn.id);
      if (existing) {
        setSelectedAddOns(selectedAddOns.map(a =>
          a.id === addOn.id ? { ...a, quantity: newQuantity } : a
        ));
      } else {
        setSelectedAddOns([...selectedAddOns, { ...addOn, quantity: newQuantity }]);
      }
    }
  };

  // Group add-ons by category if they have one
  const groupedAddOns = item.addOns?.reduce((acc, addOn) => {
    const category = addOn.category || 'Extras';
    if (!acc[category]) acc[category] = [];
    acc[category].push(addOn);
    return acc;
  }, {} as Record<string, AddOn[]>);

  return (
    <>
      <div className={`bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden group animate-scale-in border border-gray-100 ${!item.available ? 'opacity-60' : ''}`}>
        {/* Image Container with Badges */}
        {SHOW_IMAGES && (
          <div className="relative aspect-square bg-gradient-to-br from-gray-50 to-snack-accent/30">
            {item.image ? (
              <img
                src={item.image}
                alt={item.name}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                loading="lazy"
                decoding="async"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                  e.currentTarget.nextElementSibling?.classList.remove('hidden');
                }}
              />
            ) : null}
            <div className={`absolute inset-0 flex items-center justify-center ${item.image ? 'hidden' : ''}`}>
              <div className="text-6xl opacity-20 text-snack-blue/30">🍔</div>
            </div>

            {/* Badges */}
            <div className="absolute top-3 left-3 flex flex-col gap-2">
              {item.isOnDiscount && item.discountPrice && (
                <div className="bg-snack-dark text-white text-[10px] font-black px-3 py-1.5 rounded-lg shadow-xl uppercase tracking-wider font-outfit">
                  Limited Offer
                </div>
              )}
              {item.popular && (
                <div className="bg-snack-blue text-white text-[10px] font-black px-3 py-1.5 rounded-lg shadow-xl uppercase tracking-wider font-outfit">
                  Best Seller
                </div>
              )}
            </div>

            {!item.available && (
              <div className="absolute inset-0 bg-white/60 backdrop-blur-[2px] flex items-center justify-center">
                <div className="bg-snack-dark text-white text-xs font-black px-4 py-2 rounded-lg shadow-xl uppercase tracking-widest font-outfit">
                  Sold Out
                </div>
              </div>
            )}
          </div>
        )}

        {/* Content */}
        <div className="p-3 sm:p-5 flex flex-col h-full">
          {/* Badges for Imageless Mode */}
          {!SHOW_IMAGES && (
            <div className="flex flex-wrap gap-2 mb-4">
              {item.isOnDiscount && item.discountPrice && (
                <div className="bg-snack-dark text-white text-[8px] font-black px-2 py-1 rounded-md uppercase tracking-wider font-outfit">
                  Limited Offer
                </div>
              )}
              {item.popular && (
                <div className="bg-snack-blue text-white text-[8px] font-black px-2 py-1 rounded-md uppercase tracking-wider font-outfit">
                  Best Seller
                </div>
              )}
              {!item.available && (
                <div className="bg-gray-200 text-gray-500 text-[8px] font-black px-2 py-1 rounded-md uppercase tracking-wider font-outfit">
                  Sold Out
                </div>
              )}
            </div>
          )}

          <div className="flex items-start justify-between mb-2">
            <h4 className="text-sm sm:text-lg font-outfit font-black text-snack-dark leading-tight uppercase tracking-tight line-clamp-2">{item.name}</h4>
          </div>

          <p className={`text-[10px] sm:text-sm mb-3 sm:mb-4 leading-relaxed line-clamp-2 ${!item.available ? 'text-gray-400' : 'text-gray-500'}`}>
            {item.description}
          </p>

          {/* Pricing Section */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex-1">
              {item.isOnDiscount && item.discountPrice ? (
                <div className="flex flex-col">
                  <span className="text-base sm:text-lg font-outfit font-black text-snack-blue uppercase leading-none">
                    ₱{item.discountPrice.toFixed(2)}
                  </span>
                  <span className="text-[10px] sm:text-xs text-gray-400 line-through font-bold">
                    ₱{item.basePrice.toFixed(2)}
                  </span>
                </div>
              ) : (
                <div className="text-base sm:text-lg font-outfit font-black text-snack-dark uppercase leading-none">
                  ₱{item.basePrice.toFixed(2)}
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex-shrink-0">
              {!item.available ? (
                <div className="h-8 sm:h-11 px-3 sm:px-6 flex items-center justify-center bg-gray-100 text-gray-400 rounded-lg sm:rounded-xl font-outfit font-bold text-[10px] sm:text-xs uppercase tracking-widest cursor-not-allowed">
                  Sold Out
                </div>
              ) : quantity === 0 ? (
                <button
                  onClick={handleAddToCart}
                  className="h-8 sm:h-11 px-4 sm:px-8 rounded-lg sm:rounded-xl bg-snack-blue text-white font-outfit font-bold text-[10px] sm:text-xs uppercase tracking-widest hover:bg-snack-dark transition-all duration-300 transform active:scale-95 shadow-lg shadow-snack-blue/20"
                >
                  {item.variations?.length || item.addOns?.length ? 'Options' : 'Order'}
                </button>
              ) : (
                <div className="h-8 sm:h-11 flex items-center bg-snack-accent rounded-lg sm:rounded-xl border border-snack-blue/10 px-1">
                  <button
                    onClick={handleDecrement}
                    className="p-1 sm:p-2 hover:bg-white rounded-md sm:rounded-lg transition-all duration-200 text-snack-blue"
                  >
                    <Minus className="h-3 w-3 sm:h-4 sm:w-4 stroke-[3]" />
                  </button>
                  <span className="font-outfit font-black text-snack-dark min-w-[24px] sm:min-w-[32px] text-center text-xs sm:text-sm">{quantity}</span>
                  <button
                    onClick={handleIncrement}
                    className="p-1 sm:p-2 hover:bg-white rounded-md sm:rounded-lg transition-all duration-200 text-snack-blue"
                  >
                    <Plus className="h-3 w-3 sm:h-4 sm:w-4 stroke-[3]" />
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Add-ons indicator */}
          {item.addOns && item.addOns.length > 0 && (
            <div className="flex items-center space-x-2 text-[10px] font-outfit font-bold uppercase tracking-widest text-snack-blue/60 mt-auto">
              <span>•</span>
              <span>Available Extras</span>
            </div>
          )}
        </div>
      </div>

      {/* Customization Modal */}
      {
        showCustomization && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-3xl max-w-md w-full max-h-[90vh] overflow-y-auto shadow-2xl border-4 border-snack-blue/20">
              <div className="sticky top-0 bg-white border-b border-gray-100 p-8 flex items-center justify-between rounded-t-2xl">
                <div>
                  <h3 className="text-2xl font-outfit font-black text-snack-dark uppercase tracking-tight">Customize</h3>
                  <p className="text-sm text-gray-400 font-medium">{item.name}</p>
                </div>
                <button
                  onClick={() => setShowCustomization(false)}
                  className="p-2 hover:bg-snack-accent text-snack-blue rounded-full transition-colors duration-200"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <div className="p-8">
                {/* Size Variations */}
                {item.variations && item.variations.length > 0 && (
                  <div className="mb-8">
                    <h4 className="font-outfit font-black text-snack-dark uppercase tracking-widest text-xs mb-4">Select Size</h4>
                    <div className="grid grid-cols-1 gap-2">
                      {item.variations.map((variation) => (
                        <label
                          key={variation.id}
                          className={`flex items-center justify-between p-4 border-2 rounded-2xl cursor-pointer transition-all duration-300 ${selectedVariation?.id === variation.id
                            ? 'border-snack-blue bg-snack-accent'
                            : 'border-gray-50 hover:border-snack-blue/30 hover:bg-gray-50'
                            }`}
                        >
                          <div className="flex items-center space-x-4">
                            <input
                              type="radio"
                              name="variation"
                              checked={selectedVariation?.id === variation.id}
                              onChange={() => setSelectedVariation(variation)}
                              className="w-5 h-5 text-snack-blue focus:ring-snack-blue bg-white border-gray-300"
                            />
                            <span className="font-outfit font-bold text-snack-dark uppercase">{variation.name}</span>
                          </div>
                          <span className="font-outfit font-black text-snack-blue">
                            ₱{((item.effectivePrice || item.basePrice) + (variation.price || 0)).toFixed(2)}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>
                )}

                {/* Add-ons */}
                {groupedAddOns && Object.keys(groupedAddOns).length > 0 && (
                  <div className="mb-8">
                    <h4 className="font-outfit font-black text-snack-dark uppercase tracking-widest text-xs mb-4">Add Extras</h4>
                    {Object.entries(groupedAddOns).map(([category, addOns]) => (
                      <div key={category} className="mb-6">
                        <h5 className="text-[10px] font-outfit font-black text-gray-400 uppercase tracking-[0.2em] mb-3">
                          {category.replace('-', ' ')}
                        </h5>
                        <div className="space-y-2">
                          {addOns.map((addOn) => (
                            <div
                              key={addOn.id}
                              className="flex items-center justify-between p-4 border border-gray-100 rounded-2xl hover:border-snack-blue/20 transition-all duration-200 bg-gray-50/50"
                            >
                              <div className="flex-1">
                                <span className="font-outfit font-bold text-snack-dark uppercase text-sm">{addOn.name}</span>
                                <div className="text-[10px] font-outfit font-black text-snack-blue/60 uppercase">
                                  {addOn.price > 0 ? `+ ₱${addOn.price.toFixed(2)}` : 'FREE'}
                                </div>
                              </div>

                              <div className="flex items-center space-x-2">
                                {selectedAddOns.find(a => a.id === addOn.id) ? (
                                  <div className="flex items-center bg-white rounded-xl p-1 border border-snack-blue/10">
                                    <button
                                      type="button"
                                      onClick={() => {
                                        const current = selectedAddOns.find(a => a.id === addOn.id);
                                        updateAddOnQuantity(addOn, (current?.quantity || 1) - 1);
                                      }}
                                      className="p-1.5 hover:bg-snack-accent text-snack-blue rounded-lg transition-colors duration-200"
                                    >
                                      <Minus className="h-3 w-3 stroke-[3]" />
                                    </button>
                                    <span className="font-outfit font-black text-snack-dark min-w-[24px] text-center text-xs">
                                      {selectedAddOns.find(a => a.id === addOn.id)?.quantity || 0}
                                    </span>
                                    <button
                                      type="button"
                                      onClick={() => {
                                        const current = selectedAddOns.find(a => a.id === addOn.id);
                                        updateAddOnQuantity(addOn, (current?.quantity || 0) + 1);
                                      }}
                                      className="p-1.5 hover:bg-snack-accent text-snack-blue rounded-lg transition-colors duration-200"
                                    >
                                      <Plus className="h-3 w-3 stroke-[3]" />
                                    </button>
                                  </div>
                                ) : (
                                  <button
                                    type="button"
                                    onClick={() => updateAddOnQuantity(addOn, 1)}
                                    className="h-9 px-4 bg-snack-blue text-white rounded-xl hover:bg-snack-dark transition-all duration-300 text-[10px] font-outfit font-black uppercase tracking-widest shadow-lg shadow-snack-blue/20"
                                  >
                                    ADD
                                  </button>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Price Summary */}
                <div className="border-t border-gray-100 pt-6 mb-8">
                  <div className="flex items-center justify-between">
                    <span className="font-outfit font-black text-gray-400 uppercase tracking-widest text-[10px]">Total Price</span>
                    <span className="text-3xl font-outfit font-black text-snack-blue">₱{calculatePrice().toFixed(2)}</span>
                  </div>
                </div>

                <button
                  onClick={handleCustomizedAddToCart}
                  className="w-full h-16 bg-snack-dark text-white rounded-2xl hover:bg-snack-blue hover:scale-[1.02] transition-all duration-300 font-outfit font-black uppercase tracking-widest flex items-center justify-center space-x-3 shadow-xl active:scale-95"
                >
                  <ShoppingCart className="h-5 w-5" />
                  <span>Add to Order</span>
                </button>
              </div>
            </div>
          </div>
        )
      }
    </>
  );
};

export default MenuItemCard;
