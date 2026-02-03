import React, { useState } from 'react';
import { ArrowLeft, Clock, Plus, Minus, CreditCard, MapPin, User, Phone, MessageSquare } from 'lucide-react';
import { CartItem, PaymentMethod, ServiceType } from '../types';
import { usePaymentMethods } from '../hooks/usePaymentMethods';

interface CheckoutProps {
  cartItems: CartItem[];
  totalPrice: number;
  onBack: () => void;
}

const Checkout: React.FC<CheckoutProps> = ({ cartItems, totalPrice, onBack }) => {
  const { paymentMethods } = usePaymentMethods();
  const [step, setStep] = useState<'details' | 'payment'>('details');
  const [customerName, setCustomerName] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [serviceType, setServiceType] = useState<ServiceType>('dine-in');
  const [address, setAddress] = useState('');
  const [landmark, setLandmark] = useState('');
  const [pickupTime, setPickupTime] = useState('5-10');
  const [customTime, setCustomTime] = useState('');
  // Dine-in specific state
  const [partySize, setPartySize] = useState(1);
  const [dineInTime, setDineInTime] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod | ''>('');
  const [notes, setNotes] = useState('');

  React.useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [step]);

  // Set default payment method when payment methods are loaded
  React.useEffect(() => {
    if (paymentMethods.length > 0 && !paymentMethod) {
      setPaymentMethod(paymentMethods[0].id as PaymentMethod);
    }
  }, [paymentMethods, paymentMethod]);

  const selectedPaymentMethod = paymentMethods.find(method => method.id === paymentMethod);

  const handleProceedToPayment = () => {
    setStep('payment');
  };

  const handlePlaceOrder = () => {
    const timeInfo = serviceType === 'pickup'
      ? (pickupTime === 'custom' ? customTime : `${pickupTime} minutes`)
      : '';

    const dineInInfo = serviceType === 'dine-in'
      ? `👥 Party Size: ${partySize} person${partySize !== 1 ? 's' : ''}\n🕐 Preferred Time: ${dineInTime ? new Date(dineInTime).toLocaleString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }) : 'Not specified'}`
      : '';

    const orderDetails = `
📦 FIFTH SNACK BAR ORDER

👤 Customer: ${customerName}
📞 Contact: ${contactNumber}
📍 Service: ${serviceType.charAt(0).toUpperCase() + serviceType.slice(1)}
${serviceType === 'delivery' ? `🏠 Address: ${address}${landmark ? `\n🗺️ Landmark: ${landmark}` : ''}` : ''}
${serviceType === 'pickup' ? `⏰ Pickup Time: ${timeInfo}` : ''}
${serviceType === 'dine-in' ? dineInInfo : ''}


📋 ORDER DETAILS:
${cartItems.map(item => {
      let itemDetails = `• ${item.name}`;
      if (item.selectedVariation) {
        itemDetails += ` (${item.selectedVariation.name})`;
      }
      if (item.selectedAddOns && item.selectedAddOns.length > 0) {
        itemDetails += ` + ${item.selectedAddOns.map(addOn =>
          addOn.quantity && addOn.quantity > 1
            ? `${addOn.name} x${addOn.quantity}`
            : addOn.name
        ).join(', ')}`;
      }
      itemDetails += ` x${item.quantity} - ₱${item.totalPrice * item.quantity}`;
      return itemDetails;
    }).join('\n')}

💰 TOTAL: ₱${totalPrice.toFixed(2)}
${serviceType === 'delivery' ? `🛵 DELIVERY FEE:` : ''}

💳 Payment: ${selectedPaymentMethod?.name || paymentMethod}
📸 Payment Screenshot: Please attach your payment receipt screenshot

${notes ? `📝 Notes: ${notes}` : ''}

Please confirm this order to proceed. Thank you for choosing Fifth Snack Bar! 🍟
    `.trim();

    const encodedMessage = encodeURIComponent(orderDetails);
    const messengerUrl = `https://m.me/887605727771882?text=${encodedMessage}`;

    window.open(messengerUrl, '_blank');
  };

  const isDetailsValid = customerName && contactNumber &&
    (serviceType !== 'delivery' || address) &&
    (serviceType !== 'pickup' || (pickupTime !== 'custom' || customTime)) &&
    (serviceType !== 'dine-in' || (partySize > 0 && dineInTime));

  if (step === 'details') {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex items-center mb-6 sm:mb-10">
          <button
            onClick={onBack}
            className="flex items-center space-x-2 text-snack-blue hover:text-snack-dark transition-colors duration-200 font-outfit font-bold uppercase text-[10px] sm:text-xs tracking-widest"
          >
            <ArrowLeft className="h-4 w-4 stroke-[3]" />
            <span className="hidden sm:inline">Cart</span>
          </button>
          <h1 className="text-2xl sm:text-4xl font-outfit font-black text-snack-dark uppercase tracking-tighter ml-4 sm:ml-8">Confirm Details</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Order Summary Column */}
          <div className="space-y-8 order-2 lg:order-1">
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 sm:p-8">
              <h2 className="text-xl sm:text-2xl font-outfit font-black text-snack-dark uppercase tracking-tight mb-6 sm:mb-8">Summary</h2>

              <div className="space-y-3 sm:space-y-4 mb-6 sm:mb-8">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex items-center justify-between py-3 sm:py-4 border-b border-gray-50 last:border-0">
                    <div className="flex-1 pr-4">
                      <h4 className="font-outfit font-bold text-snack-dark uppercase text-xs sm:text-sm leading-tight">{item.name}</h4>
                      {item.selectedVariation && (
                        <span className="text-[10px] font-outfit font-black text-snack-blue uppercase tracking-widest">{item.selectedVariation.name}</span>
                      )}
                      <p className="text-[8px] sm:text-[10px] font-outfit font-medium text-gray-400 uppercase mt-1">₱{item.totalPrice.toFixed(2)} × {item.quantity}</p>
                    </div>
                    <span className="font-outfit font-black text-snack-dark text-base sm:text-lg tracking-tighter">₱{(item.totalPrice * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>

              <div className="bg-snack-accent rounded-2xl p-4 sm:p-6 border border-snack-blue/5">
                <div className="flex items-center justify-between">
                  <span className="font-outfit font-bold text-snack-blue uppercase tracking-widest text-[10px] sm:text-xs">Total to pay</span>
                  <span className="text-3xl sm:text-4xl font-outfit font-black text-snack-dark tracking-tighter">₱{totalPrice.toFixed(2)}</span>
                </div>
              </div>
            </div>

            <div className="bg-snack-dark rounded-3xl p-8 text-white">
              <div className="flex items-center space-x-4 mb-4">
                <div className="w-10 h-10 rounded-xl bg-snack-blue flex items-center justify-center">
                  <MessageSquare className="h-5 w-5 text-white" />
                </div>
                <h3 className="font-outfit font-black uppercase tracking-tight">Support</h3>
              </div>
              <p className="text-sm text-gray-400 font-medium">Need help with your order? Our team is available on Messenger for any special requests.</p>
            </div>
          </div>

          {/* Details Form Column */}
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 order-1 lg:order-2">
            <h2 className="text-2xl font-outfit font-black text-snack-dark uppercase tracking-tight mb-8">Personal Info</h2>

            <form className="space-y-8">
              {/* Customer Information */}
              <div className="space-y-4">
                <div>
                  <label className="flex items-center gap-2 text-[10px] font-outfit font-black text-gray-400 uppercase tracking-widest mb-2">
                    <User className="h-3 w-3" /> Full Name
                  </label>
                  <input
                    type="text"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full px-6 py-4 bg-gray-50 border-2 border-gray-50 rounded-2xl focus:bg-white focus:border-snack-blue focus:ring-0 transition-all duration-300 font-outfit font-bold text-snack-dark placeholder:text-gray-300"
                    placeholder="John Doe"
                    required
                  />
                </div>

                <div>
                  <label className="flex items-center gap-2 text-[10px] font-outfit font-black text-gray-400 uppercase tracking-widest mb-2">
                    <Phone className="h-3 w-3" /> Contact Number
                  </label>
                  <input
                    type="tel"
                    value={contactNumber}
                    onChange={(e) => setContactNumber(e.target.value)}
                    className="w-full px-6 py-4 bg-gray-50 border-2 border-gray-50 rounded-2xl focus:bg-white focus:border-snack-blue focus:ring-0 transition-all duration-300 font-outfit font-bold text-snack-dark placeholder:text-gray-300"
                    placeholder="09XX XXX XXXX"
                    required
                  />
                </div>
              </div>

              {/* Service Type */}
              <div>
                <label className="block text-[10px] font-outfit font-black text-gray-400 uppercase tracking-widest mb-4">Choose your vibe</label>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { value: 'dine-in', label: 'Dine In', icon: '🪑' },
                    { value: 'pickup', label: 'Pickup', icon: '🚶' },
                    { value: 'delivery', label: 'Delivery', icon: '🛵' }
                  ].map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => setServiceType(option.value as ServiceType)}
                      className={`p-4 rounded-2xl border-2 transition-all duration-300 flex flex-col items-center justify-center gap-2 ${serviceType === option.value
                        ? 'border-snack-blue bg-snack-blue text-white shadow-lg shadow-snack-blue/20'
                        : 'border-gray-50 bg-gray-50 text-gray-400 hover:border-snack-blue/30 hover:bg-white'
                        }`}
                    >
                      <span className="text-2xl">{option.icon}</span>
                      <span className="text-[10px] font-outfit font-black uppercase tracking-tight">{option.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Specific Details */}
              <div className="min-h-[140px]">
                {serviceType === 'dine-in' && (
                  <div className="space-y-6 animate-fade-in">
                    <div>
                      <label className="block text-[10px] font-outfit font-black text-gray-400 uppercase tracking-widest mb-4">How many people?</label>
                      <div className="flex items-center space-x-6 bg-gray-50 p-2 rounded-2xl w-fit">
                        <button
                          type="button"
                          onClick={() => setPartySize(Math.max(1, partySize - 1))}
                          className="w-12 h-12 rounded-xl bg-white flex items-center justify-center text-snack-blue hover:bg-snack-blue hover:text-white shadow-sm transition-all duration-300"
                        >
                          <Minus className="h-4 w-4 stroke-[3]" />
                        </button>
                        <span className="text-2xl font-outfit font-black text-snack-dark min-w-[2rem] text-center">{partySize}</span>
                        <button
                          type="button"
                          onClick={() => setPartySize(Math.min(20, partySize + 1))}
                          className="w-12 h-12 rounded-xl bg-white flex items-center justify-center text-snack-blue hover:bg-snack-blue hover:text-white shadow-sm transition-all duration-300"
                        >
                          <Plus className="h-4 w-4 stroke-[3]" />
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="flex items-center gap-2 text-[10px] font-outfit font-black text-gray-400 uppercase tracking-widest mb-2">
                        <Clock className="h-3 w-3" /> When are you coming?
                      </label>
                      <input
                        type="datetime-local"
                        value={dineInTime}
                        onChange={(e) => setDineInTime(e.target.value)}
                        className="w-full px-6 py-4 bg-gray-50 border-2 border-gray-50 rounded-2xl focus:bg-white focus:border-snack-blue focus:ring-0 transition-all duration-300 font-outfit font-bold text-snack-dark"
                        required
                      />
                    </div>
                  </div>
                )}

                {serviceType === 'pickup' && (
                  <div className="animate-fade-in">
                    <label className="block text-[10px] font-outfit font-black text-gray-400 uppercase tracking-widest mb-4">When will you grab it?</label>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-3">
                        {[
                          { value: '5-10', label: '5-10 MINS' },
                          { value: '15-20', label: '15-20 MINS' },
                          { value: '25-30', label: '25-30 MINS' },
                          { value: 'custom', label: 'CUSTOM' }
                        ].map((option) => (
                          <button
                            key={option.value}
                            type="button"
                            onClick={() => setPickupTime(option.value)}
                            className={`p-4 rounded-xl border-2 transition-all duration-300 flex items-center justify-center gap-2 ${pickupTime === option.value
                              ? 'border-snack-dark bg-snack-dark text-white'
                              : 'border-gray-50 bg-gray-50 text-gray-400 hover:bg-white hover:border-snack-blue/30'
                              }`}
                          >
                            <Clock className="h-3 w-3" />
                            <span className="text-[10px] font-outfit font-black tracking-widest">{option.label}</span>
                          </button>
                        ))}
                      </div>

                      {pickupTime === 'custom' && (
                        <input
                          type="text"
                          value={customTime}
                          onChange={(e) => setCustomTime(e.target.value)}
                          className="w-full px-6 py-4 bg-gray-50 border-2 border-gray-50 rounded-2xl focus:bg-white focus:border-snack-blue focus:ring-0 transition-all duration-300 font-outfit font-bold text-snack-dark"
                          placeholder="e.g., 2:30 PM"
                          required
                        />
                      )}
                    </div>
                  </div>
                )}

                {serviceType === 'delivery' && (
                  <div className="space-y-6 animate-fade-in">
                    <div>
                      <label className="flex items-center gap-2 text-[10px] font-outfit font-black text-gray-400 uppercase tracking-widest mb-2">
                        <MapPin className="h-3 w-3" /> Delivery Address
                      </label>
                      <textarea
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        className="w-full px-6 py-4 bg-gray-50 border-2 border-gray-50 rounded-2xl focus:bg-white focus:border-snack-blue focus:ring-0 transition-all duration-300 font-outfit font-bold text-snack-dark placeholder:text-gray-300"
                        placeholder="Street, Barangay, City..."
                        rows={3}
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-outfit font-black text-gray-400 uppercase tracking-widest mb-2">Landmark</label>
                      <input
                        type="text"
                        value={landmark}
                        onChange={(e) => setLandmark(e.target.value)}
                        className="w-full px-6 py-4 bg-gray-50 border-2 border-gray-50 rounded-2xl focus:bg-white focus:border-snack-blue focus:ring-0 transition-all duration-300 font-outfit font-bold text-snack-dark placeholder:text-gray-300"
                        placeholder="e.g., Near the Blue Gate"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Special Notes */}
              <div>
                <label className="block text-[10px] font-outfit font-black text-gray-400 uppercase tracking-widest mb-2">Special Requests</label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-6 py-4 bg-gray-50 border-2 border-gray-50 rounded-2xl focus:bg-white focus:border-snack-blue focus:ring-0 transition-all duration-300 font-outfit font-bold text-snack-dark placeholder:text-gray-300"
                  placeholder="Extra napkins, no ice, etc."
                  rows={2}
                />
              </div>

              <button
                type="button"
                onClick={handleProceedToPayment}
                disabled={!isDetailsValid}
                className={`w-full h-16 rounded-2xl font-outfit font-black uppercase tracking-widest text-lg transition-all duration-300 transform shadow-xl active:scale-95 ${isDetailsValid
                  ? 'bg-snack-dark text-white hover:bg-snack-blue hover:scale-[1.02] shadow-snack-blue/20'
                  : 'bg-gray-100 text-gray-300 cursor-not-allowed'
                  }`}
              >
                Proceed to Payment
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  // Payment Step
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex items-center mb-10">
        <button
          onClick={() => setStep('details')}
          className="flex items-center space-x-2 text-snack-blue hover:text-snack-dark transition-colors duration-200 font-outfit font-bold uppercase text-xs tracking-widest"
        >
          <ArrowLeft className="h-4 w-4 stroke-[3]" />
          <span>Back</span>
        </button>
        <h1 className="text-4xl font-outfit font-black text-snack-dark uppercase tracking-tighter ml-8">Payment</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Payment Method Selection */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
          <h2 className="text-2xl font-outfit font-black text-snack-dark uppercase tracking-tight mb-8">How to Pay</h2>

          <div className="grid grid-cols-1 gap-4 mb-8">
            {paymentMethods.map((method) => (
              <button
                key={method.id}
                type="button"
                onClick={() => setPaymentMethod(method.id as PaymentMethod)}
                className={`p-6 rounded-2xl border-2 transition-all duration-300 flex items-center justify-between ${paymentMethod === method.id
                  ? 'border-snack-blue bg-snack-accent text-snack-blue'
                  : 'border-gray-50 bg-gray-50 text-gray-400 hover:border-snack-blue/30 hover:bg-white'
                  }`}
              >
                <div className="flex items-center space-x-4">
                  <span className="text-2xl"><CreditCard className="h-6 w-6" /></span>
                  <span className="font-outfit font-black uppercase tracking-widest text-sm">{method.name}</span>
                </div>
                {paymentMethod === method.id && (
                  <div className="w-6 h-6 bg-snack-blue rounded-full flex items-center justify-center shadow-lg shadow-snack-blue/30">
                    <div className="w-2.5 h-2.5 bg-white rounded-full" />
                  </div>
                )}
              </button>
            ))}
          </div>

          {/* Payment Details with QR Code */}
          {selectedPaymentMethod && (
            <div className="bg-snack-dark rounded-3xl p-8 text-white mb-8 border-4 border-snack-blue/20">
              <h3 className="font-outfit font-bold text-snack-blue uppercase tracking-widest text-[10px] mb-6">Payment Info</h3>
              <div className="flex flex-col gap-8">
                <div className="space-y-4">
                  <div>
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1">Account Name</p>
                    <p className="font-outfit font-black text-xl uppercase leading-tight">{selectedPaymentMethod.account_name}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1">Account Number</p>
                    <p className="font-mono font-black text-2xl text-snack-blue leading-none">{selectedPaymentMethod.account_number}</p>
                  </div>
                  <div className="pt-6 border-t border-white/10">
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1">Total Due</p>
                    <p className="text-5xl font-outfit font-black tracking-tighter">₱{totalPrice.toFixed(2)}</p>
                  </div>
                </div>
                <div className="flex flex-col items-center p-8 bg-white rounded-2xl shadow-inner">
                  <img
                    src={selectedPaymentMethod.qr_code_url}
                    alt={`${selectedPaymentMethod.name} QR Code`}
                    className="w-full max-w-[200px] h-auto object-contain"
                    onError={(e) => {
                      e.currentTarget.src = 'https://images.pexels.com/photos/8867482/pexels-photo-8867482.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&fit=crop';
                    }}
                  />
                  <p className="text-[10px] font-outfit font-black text-gray-400 uppercase tracking-widest mt-6">Scan QR to pay</p>
                </div>
              </div>
            </div>
          )}

          <div className="bg-snack-accent border-2 border-snack-blue/10 rounded-2xl p-6">
            <h4 className="font-outfit font-black text-snack-blue uppercase tracking-widest text-[10px] mb-2 flex items-center gap-2">
              <span className="w-2 h-2 bg-snack-blue rounded-full" />
              Proof of Payment
            </h4>
            <p className="text-xs text-snack-dark font-medium leading-relaxed">
              Screenshot your receipt! You'll need to attach it in the next step when we redirect you to Messenger.
            </p>
          </div>
        </div>

        {/* Order Summary Column */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 h-fit">
          <h2 className="text-2xl font-outfit font-black text-snack-dark uppercase tracking-tight mb-8">Final Summary</h2>

          <div className="space-y-6 mb-10">
            <div className="bg-gray-50 rounded-2xl p-6 space-y-4">
              <h4 className="font-outfit font-black text-gray-400 uppercase tracking-widest text-[10px]">Recipient</h4>
              <div>
                <p className="text-sm font-outfit font-bold text-snack-dark uppercase">{customerName}</p>
                <p className="text-xs font-medium text-gray-500">{contactNumber}</p>
              </div>
              <div className="pt-4 border-t border-gray-200">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-1.5 h-1.5 bg-snack-blue rounded-full" />
                  <p className="text-[10px] font-outfit font-black text-snack-blue uppercase tracking-widest">{serviceType}</p>
                </div>
                {serviceType === 'delivery' && <p className="text-xs font-medium text-gray-500">{address}</p>}
                {serviceType === 'pickup' && <p className="text-xs font-medium text-gray-500">Approx. {pickupTime === 'custom' ? customTime : pickupTime} mins</p>}
                {serviceType === 'dine-in' && <p className="text-xs font-medium text-gray-500">Party of {partySize}</p>}
              </div>
            </div>

            <div className="max-h-60 overflow-y-auto pr-2 space-y-4">
              {cartItems.map((item) => (
                <div key={item.id} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                  <div className="flex-1 pr-4">
                    <h4 className="font-outfit font-bold text-snack-dark uppercase text-xs">{item.name}</h4>
                    <p className="text-[10px] font-medium text-gray-400 uppercase mt-0.5">QTY: {item.quantity}</p>
                  </div>
                  <span className="font-outfit font-black text-snack-dark text-sm">₱{(item.totalPrice * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <span className="font-outfit font-bold text-gray-400 uppercase tracking-widest text-[10px]">Total Amount</span>
              <span className="text-4xl font-outfit font-black text-snack-dark tracking-tighter">₱{totalPrice.toFixed(2)}</span>
            </div>
          </div>

          <button
            onClick={handlePlaceOrder}
            className="w-full h-16 bg-snack-blue text-white rounded-2xl hover:bg-snack-dark transition-all duration-300 transform scale-100 hover:scale-[1.02] font-outfit font-black uppercase tracking-widest text-lg shadow-xl shadow-snack-blue/20 flex items-center justify-center gap-3 active:scale-95"
          >
            <span>Confirm on Messenger</span>
          </button>

          <p className="text-[10px] text-gray-400 text-center mt-6 font-medium uppercase tracking-widest leading-relaxed">
            clicking confirm will open facebook messenger <br /> with your order details ready to send.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Checkout;