import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import LoadingSpinner from "../componants/LoadingSpinner.jsx"
const baseUrl = import.meta.env.VITE_API_BASE_URL;

const Checkout = () => {
  const [cartData, setCartData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [couponCode, setCouponCode] = useState('');
  const [formData, setFormData] = useState({
    firstName: '',
    companyName: '',
    streetAddress: '',
    shippingCity: '',
    shippingState: '',
    shippingCountry: '',
    shippingZipCode: '',
    phoneNumber: '',
    emailAddress: '',
    saveInfo: false,
    paymentMethod: 'cash'
  });

  // Fetch cart items
  useEffect(() => {
    fetchCartItems();
  }, []);

  const fetchCartItems = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      
      const response = await fetch(`${baseUrl}/Cart`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': '*/*',
        }
      });

      if (response.ok) {
        const data = await response.json();
        if (data.succeeded) {
          setCartData(data.data);
        }
      }
    } catch (error) {
      console.error('Error fetching cart:', error);
    } finally {
      setLoading(false);
    }
  };

  const clearCart = async () => {
    try {
      const token = localStorage.getItem("token");
      
      const response = await fetch(`${baseUrl}/Cart`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': '*/*',
        }
      });

      if (response.ok) {
        console.log('Cart cleared successfully');
        setCartData(null);
      }
    } catch (error) {
      console.error('Error clearing cart:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

   
    setTimeout(async () => {
      // Clear the cart
      await clearCart();
      
      // Show success
      setOrderSuccess(true);
      setSubmitting(false);
    }, 1500);
  };

  const calculateSubtotal = () => {
    if (!cartData?.items) return 0;
    
    return cartData.items.reduce((sum, item) => {
      const price = parseFloat(item.productPrice || item.price || 0);
      const quantity = parseInt(item.quantity || 0);
      return sum + (price * quantity);
    }, 0);
  };

  const calculateTotal = () => {
    const subtotal = calculateSubtotal();
    const shipping = 0; // Free shipping
    return subtotal + shipping;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
       <LoadingSpinner/>
      </div>
    );
  }

  // Success Message Component
  if (orderSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center">
          <div className="mb-8">
            <svg className="mx-auto h-24 w-24 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold mb-4 text-gray-800">Order Placed Successfully!</h2>
          <p className="text-gray-600 mb-8">Thank you for your purchase. Your order has been confirmed.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              to="/" 
              className="bg-red-500 text-white px-8 py-3 rounded-lg hover:bg-red-600 transition-colors font-semibold"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const subtotal = calculateSubtotal();
  const total = calculateTotal();
  const isCartEmpty = !cartData || !cartData.items || cartData.items.length === 0;

  if (isCartEmpty) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-16">
        <div className="text-center">
          <p className="text-gray-600 mb-8">Your cart is empty</p>
          <Link 
            to="/" 
            className="bg-red-500 text-white px-8 py-3 rounded-lg hover:bg-red-600 transition-colors font-semibold"
          >
            Go Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 my-16">
      {/* Breadcrumb - Hide on mobile */}
      {/* <div className="hidden sm:block mb-6 text-sm text-gray-600">
        <Link to="/" className="hover:text-gray-800">Home</Link>
        <span className="mx-2">/</span>
        <Link to="/cart" className="hover:text-gray-800">Cart</Link>
        <span className="mx-2">/</span>
        <span className="text-gray-800">Checkout</span>
      </div> */}

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Billing Details -*/}
        <div className="lg:col-span-7">
          <h2 className="text-2xl font-semibold mb-8 text-gray-800">Billing Details</h2>
          
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                First Name*
              </label>
              <input
                type="text"
                name="firstName"
                required
                value={formData.firstName}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-gray-100 border-0 rounded focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Company Name
              </label>
              <input
                type="text"
                name="companyName"
                value={formData.companyName}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-gray-100 border-0 rounded focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Street Address*
              </label>
              <input
                type="text"
                name="streetAddress"
                required
                value={formData.streetAddress}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-gray-100 border-0 rounded focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  State*
                </label>
                <input
                  type="text"
                  name="shippingState"
                  required
                  value={formData.shippingState}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-gray-100 border-0 rounded focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  City*
                </label>
                <input
                  type="text"
                  name="shippingCity"
                  required
                  value={formData.shippingCity}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-gray-100 border-0 rounded focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Country*
                </label>
                <input
                  type="text"
                  name="shippingCountry"
                  required
                  value={formData.shippingCountry}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-gray-100 border-0 rounded focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Zip Code*
                </label>
                <input
                  type="text"
                  name="shippingZipCode"
                  required
                  value={formData.shippingZipCode}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-gray-100 border-0 rounded focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number*
              </label>
              <input
                type="tel"
                name="phoneNumber"
                required
                value={formData.phoneNumber}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-gray-100 border-0 rounded focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address*
              </label>
              <input
                type="email"
                name="emailAddress"
                required
                value={formData.emailAddress}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-gray-100 border-0 rounded focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                name="saveInfo"
                id="saveInfo"
                checked={formData.saveInfo}
                onChange={handleInputChange}
                className="w-4 h-4 text-red-500 border-gray-300 rounded focus:ring-red-500"
              />
              <label htmlFor="saveInfo" className="ml-2 text-sm text-gray-700">
                Save this information for faster check-out next time
              </label>
            </div>
          </div>
        </div>

        {/* Order Summary - */}
        <div className="lg:col-span-5">
          <div className="lg:sticky lg:top-4">
            {/* Cart Items */}
            <div className="mb-8">
              <h3 className="text-lg font-medium mb-6">Your Order</h3>

              <div className="space-y-4 mb-6 max-h-64 overflow-y-auto">
                {cartData?.items?.map((item) => {
                  const itemPrice = parseFloat(item.productPrice || item.price || 0);
                  const itemQuantity = parseInt(item.quantity || 0);
                  
                  return (
                    <div key={item.id} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <img 
                          src={item.productImage || '/default-product.jpg'} 
                          alt={item.productName}
                          className="w-12 h-12 object-cover rounded"
                          onError={(e) => {e.target.src = '/default-product.jpg'}}
                        />
                        <div>
                          <p className="text-sm text-gray-700 font-medium">{item.productName}</p>
                          <p className="text-xs text-gray-500">
                            Qty: {itemQuantity} × ${itemPrice.toFixed(2)}
                          </p>
                        </div>
                      </div>
                      <span className="font-medium">${(itemPrice * itemQuantity).toFixed(2)}</span>
                    </div>
                  );
                })}
              </div>

              {/* Order Summary */}
              <div className="border-t pt-4 space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal:</span>
                  <span className="font-medium">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping:</span>
                  <span className="text-gray-600">Free</span>
                </div>
                <div className="flex justify-between text-lg font-semibold border-t pt-3">
                  <span>Total:</span>
                  <span className="text-red-500">${total.toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Payment Methods */}
            <div className="mb-6">
              <h3 className="text-lg font-medium mb-4">Payment Method</h3>
              <div className="space-y-3">
                <div className="flex items-center">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="bank"
                    id="bank"
                    checked={formData.paymentMethod === 'bank'}
                    onChange={handleInputChange}
                    className="w-4 h-4 text-red-500 border-gray-300 focus:ring-red-500"
                  />
                  <label htmlFor="bank" className="ml-2 text-sm text-gray-700">Bank Transfer</label>
                </div>

                <div className="flex items-center">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="cash"
                    id="cash"
                    checked={formData.paymentMethod === 'cash'}
                    onChange={handleInputChange}
                    className="w-4 h-4 text-red-500 border-gray-300 focus:ring-red-500"
                  />
                  <label htmlFor="cash" className="ml-2 text-sm text-gray-700">Cash on delivery</label>
                </div>
              </div>
            </div>

            {/* Coupon */}
            <div className="mb-6">
              <div className="flex gap-3">
                <input
                  type="text"
                  placeholder="Coupon Code"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  className="flex-1 px-4 py-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-red-500"
                />
                <button
                  type="button"
                  className="bg-red-500 text-white px-6 py-3 rounded hover:bg-red-600 transition-colors"
                >
                  Apply
                </button>
              </div>
            </div>

            {/* Done Button */}
            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-red-500 text-white py-4 rounded-lg font-semibold hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </span>
              ) : (
                'Place Order'
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Checkout;