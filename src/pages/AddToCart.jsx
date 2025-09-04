

// caupon is disabled 
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaTrashAlt } from 'react-icons/fa';

const baseUrl = import.meta.env.VITE_API_BASE_URL;

const AddToCart = () => {
  const [cartData, setCartData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [couponCode, setCouponCode] = useState('');
  const [updatingCart, setUpdatingCart] = useState(false);
  const [deletingItems, setDeletingItems] = useState(new Set());
  const [updatingItems, setUpdatingItems] = useState(new Set());

  // Fetch cart items from API
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
   

      // ❌❌
      if (response.ok) {
        const data = await response.json();
        console.log('Cart data from API:', data);
        
        if (data.succeeded) {
          setCartData(data.data);
        } else {
          console.error('API error:', data.message);
          alert(`Failed to load cart: ${data.message}`);
        }
      } else {
        console.error('Failed to fetch cart');
        alert('Failed to load cart. Please try again.');
      }
    } catch (error) {
      console.error('Error fetching cart:', error);
      alert('Network error: Failed to load cart');
    } finally {
      setLoading(false);
    }
  };
//  ❌❌
  const updateQuantity = async (itemId, newQuantity) => {
    if (newQuantity < 1 || updatingItems.has(itemId)) return;
    
    try {
      // Add item to updating set
      setUpdatingItems(prev => new Set(prev).add(itemId));
      
      const token = localStorage.getItem("token");
      console.log('Updating quantity for cart item:', itemId, 'to:', newQuantity);

      const response = await fetch(`${baseUrl}/Cart/items/${itemId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          'Accept': '*/*',
        },
        body: JSON.stringify({ quantity: newQuantity })
      });

      const responseData = await response.json();

      // ❌❌
      console.log('Update quantity response:', responseData);
      // ❌❌

      if (response.ok && responseData.succeeded !== false) {
        // Update local state only if successful
        setCartData(prevData => ({
          ...prevData,
          items: prevData.items.map(item => 
            item.id === itemId ? { ...item, quantity: newQuantity } : item
          )
        }));
      } else {
        console.error('Failed to update quantity:', responseData);
        alert(`Failed to update quantity: ${responseData.message || 'Unknown error'}`);
        // Refresh cart data on failure
        await fetchCartItems();
      }
    } catch (error) {
      console.error('Error updating quantity:', error);
      alert('Network error: Failed to update quantity');
      await fetchCartItems();
    } finally {

      // Remove item from updating set
      setUpdatingItems(prev => {
        const newSet = new Set(prev);
        newSet.delete(itemId);
        return newSet;
      });
    }
  };
const removeItem = async (itemId) => {
  // Prevent multiple delete operations on the same item
  if (deletingItems.has(itemId)) {
    console.log('Already deleting this item');
    return;
  }

  // Confirm deletion
  if (!window.confirm('Are you sure you want to remove this item from your cart?')) {
    return;
  }

  try {
    // Add item to deleting set
    setDeletingItems(prev => new Set(prev).add(itemId));
    
    const token = localStorage.getItem("token");
    console.log('=== DELETE REQUEST DETAILS ===');
    console.log('Removing cart item with ID:', itemId);
    console.log('Full URL:', `${baseUrl}/Cart/items/${itemId}`);
    console.log('Token:', token ? 'Present' : 'Missing');

    const response = await fetch(`${baseUrl}/Cart/items/${itemId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': '*/*',
      }
    });

    console.log('Response status:', response.status);
    console.log('Response headers:', response.headers);

    // ❌❌
    // Check if response has content
    let responseData = {};
    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      try {
        responseData = await response.json();
        console.log('Remove item response data:', responseData);
      } catch (e) {
        console.log('No JSON response body');
      }
    }

    if (response.ok) {
      console.log('=== DELETE SUCCESSFUL ===');
      console.log('Item should be removed from backend');
      // ❌❌

      // Remove from local state
      setCartData(prevData => ({
        ...prevData,
        items: prevData.items.filter(item => item.id !== itemId)
      }));
      
      
    } else {
      console.error('HTTP error:', response.status, responseData);
      alert(`Failed to remove item: ${responseData.message || `Server error (${response.status})`}`);
      await fetchCartItems();
    }
  } catch (error) {
    console.error('Error removing item:', error);
    alert('Network error: Failed to remove item');
    await fetchCartItems();
  } finally {

    // Remove item from deleting set
    setDeletingItems(prev => {
      const newSet = new Set(prev);
      newSet.delete(itemId);
      return newSet;
    });
  }
};
  // const applyCoupon = async () => {
  //   if (!couponCode.trim()) return;

  //   try {
  //     setUpdatingCart(true);
  //     const token = localStorage.getItem("token");

  //     const response = await fetch(`${baseUrl}/Cart/apply-coupon`, {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json',
  //         'Authorization': `Bearer ${token}`,
  //       },
  //       body: JSON.stringify({ couponCode })
  //     });

  //     const responseData = await response.json();

  //     if (response.ok && responseData.succeeded) {
  //       alert('Coupon applied successfully!');
  //       await fetchCartItems(); // Refresh cart to show discount
  //       setCouponCode('');
  //     } else {
  //       alert(responseData.message || 'Invalid coupon code');
  //     }
  //   } catch (error) {
  //     console.error('Error applying coupon:', error);
  //     alert('Error applying coupon');
  //   } finally {
  //     setUpdatingCart(false);
  //   }
  // };

  const calculateCartTotal = () => {
    if (!cartData || !cartData.items) {
      return { subtotal: 0, total: 0, shipping: 0, discount: 0 };
    }
    
    const subtotal = cartData.items.reduce((sum, item) => {
      const price = parseFloat(item.productPrice || item.price || 0);
      const quantity = parseInt(item.quantity || 0);
      return sum + (price * quantity);
    }, 0);
    
    const shipping = 0; // Free shipping
    const discount = cartData.discount || 0;
    const total = subtotal - discount + shipping;
    
    return { subtotal, total, shipping, discount };
  };

  const handleUpdateCart = () => {
    fetchCartItems();
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-xl">Loading cart...</div>
      </div>
    );
  }

  const isCartEmpty = !cartData || !cartData.items || cartData.items.length === 0;
  const { subtotal, total, shipping, discount } = calculateCartTotal();

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6 mt-16 sm:mt-20">
      {/* Breadcrumb */}
      <div className="mb-4 sm:mb-6 text-xs sm:text-sm text-gray-600">
        <Link to="/" className="hover:text-gray-800">Home</Link>
        <span className="mx-2">/</span>
        <span className="text-gray-800">Cart</span>
      </div>

      {isCartEmpty ? (
        /* Empty Cart State */
        <div className="text-center py-8 sm:py-16">
          <div className="mb-6 sm:mb-8">
            <svg className="mx-auto h-16 w-16 sm:h-24 sm:w-24 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6-5v6a2 2 0 11-4 0v-6m4 0V9a2 2 0 10-4 0v4.01" />
            </svg>
          </div>
          <h2 className="text-xl sm:text-3xl font-semibold mb-3 sm:mb-4 text-gray-800">Your cart is empty</h2>
          <p className="text-sm sm:text-base text-gray-600 mb-6 sm:mb-8">Looks like you haven't added any items to your cart yet.</p>
          <Link 
            to="/" 
            className="bg-red-500 text-white px-6 sm:px-8 py-2 sm:py-3 rounded-lg hover:bg-red-600 transition-colors font-semibold text-sm sm:text-base"
          >
            Continue Shopping
          </Link>
        </div>
      ) : (
        /* Cart with Items */
        <div>
          {/* Cart Table - Desktop */}
          <div className="hidden md:block bg-white rounded-lg shadow-sm border overflow-hidden mb-6">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left py-3 px-4 lg:py-4 lg:px-6 font-medium text-gray-700 text-sm lg:text-base">Product</th>
                  <th className="text-left py-3 px-4 lg:py-4 lg:px-6 font-medium text-gray-700 text-sm lg:text-base">Price</th>
                  <th className="text-left py-3 px-4 lg:py-4 lg:px-6 font-medium text-gray-700 text-sm lg:text-base">Quantity</th>
                  <th className="text-left py-3 px-4 lg:py-4 lg:px-6 font-medium text-gray-700 text-sm lg:text-base">Subtotal</th>
                  <th className="py-3 px-4 lg:py-4 lg:px-6"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {cartData.items.map((item) => {
                  const itemId = item.id;
                  const itemPrice = parseFloat(item.productPrice || item.price || 0);
                  const itemQuantity = parseInt(item.quantity || 0);
                  const isDeleting = deletingItems.has(itemId);
                  const isUpdating = updatingItems.has(itemId);
                  
                  return (
                    <tr key={itemId} className={`hover:bg-gray-50 ${isDeleting ? 'opacity-50' : ''}`}>
                      <td className="py-3 px-4 lg:py-4 lg:px-6">
                        <div className="flex items-center gap-3 lg:gap-4">
                          <div className="relative">
                            <img 
                              src={item.productImage || item.image || '/default-product.jpg'} 
                              alt={item.productName || item.name}
                              className="w-12 h-12 lg:w-16 lg:h-16 object-cover rounded"
                              onError={(e) => {e.target.src = '/default-product.jpg'}}
                            />
                            <button 
                              onClick={() => removeItem(itemId)}
                              disabled={isDeleting}
                              className="absolute -top-1 -right-1 lg:-top-2 lg:-right-2 bg-red-500 text-white rounded-full w-4 h-4 lg:w-5 lg:h-5 flex items-center justify-center text-xs hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              ✕
                            </button>
                          </div>
                          <div>
                            <span className="font-medium text-gray-800 text-sm lg:text-base">
                              {item.productName || item.name}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4 lg:py-4 lg:px-6 text-gray-700 text-sm lg:text-base">${itemPrice.toFixed(2)}</td>
                      <td className="py-3 px-4 lg:py-4 lg:px-6">
                        <div className="flex items-center border border-gray-300 rounded w-20 lg:w-24">
                          <button 
                            onClick={() => updateQuantity(itemId, itemQuantity - 1)}
                            disabled={itemQuantity <= 1 || isUpdating || isDeleting}
                            className="px-1.5 lg:px-2 py-1 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed text-sm lg:text-base"
                          >
                            -
                          </button>
                          <span className="px-2 lg:px-3 py-1 border-x border-gray-300 text-center flex-1 text-sm lg:text-base">
                            {isUpdating ? '...' : itemQuantity}
                          </span>
                          <button 
                            onClick={() => updateQuantity(itemId, itemQuantity + 1)}
                            disabled={isUpdating || isDeleting}
                            className="px-1.5 lg:px-2 py-1 hover:bg-gray-100 disabled:opacity-50 text-sm lg:text-base"
                          >
                            +
                          </button>
                        </div>
                      </td>
                      <td className="py-3 px-4 lg:py-4 lg:px-6 font-semibold text-gray-800 text-sm lg:text-base">
                        ${(itemPrice * itemQuantity).toFixed(2)}
                      </td>
                      <td className="py-3 px-4 lg:py-4 lg:px-6">
                        <button 
                          onClick={() => removeItem(itemId)}
                          disabled={isDeleting}
                          className={`text-red-500 hover:text-red-700 p-1 ${
                            isDeleting ? 'opacity-50 cursor-not-allowed' : ''
                          }`}
                          title="Remove item"
                        >
                          {isDeleting ? (
                            <span className="inline-block animate-spin">⟳</span>
                          ) : (
                            <FaTrashAlt className="w-4 h-4 lg:w-5 lg:h-5" />
                          )}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Cart Items - Mobile */}
          <div className="md:hidden space-y-4 mb-6">
            {cartData.items.map((item) => {
              const itemId = item.id;
              const itemPrice = parseFloat(item.productPrice || item.price || 0);
              const itemQuantity = parseInt(item.quantity || 0);
              const isDeleting = deletingItems.has(itemId);
              const isUpdating = updatingItems.has(itemId);
              
              return (
                <div key={itemId} className={`bg-white rounded-lg shadow-sm border p-4 ${isDeleting ? 'opacity-50' : ''}`}>
                  <div className="flex gap-3 mb-3">
                    <div className="relative">
                      <img 
                        src={item.productImage || item.image || '/default-product.jpg'} 
                        alt={item.productName || item.name}
                        className="w-20 h-20 object-cover rounded"
                        onError={(e) => {e.target.src = '/default-product.jpg'}}
                      />
                      <button 
                        onClick={() => removeItem(itemId)}
                        disabled={isDeleting}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        ✕
                      </button>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-800 mb-1 text-sm">
                        {item.productName || item.name}
                      </h3>
                      <p className="text-gray-600 text-sm">${itemPrice.toFixed(2)}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center border border-gray-300 rounded">
                      <button 
                        onClick={() => updateQuantity(itemId, itemQuantity - 1)}
                        disabled={itemQuantity <= 1 || isUpdating || isDeleting}
                        className="px-2 py-1 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                      >
                        -
                      </button>
                      <span className="px-3 py-1 border-x border-gray-300 text-center min-w-[40px] text-sm">
                        {isUpdating ? '...' : itemQuantity}
                      </span>
                      <button 
                        onClick={() => updateQuantity(itemId, itemQuantity + 1)}
                        disabled={isUpdating || isDeleting}
                        className="px-2 py-1 hover:bg-gray-100 disabled:opacity-50 text-sm"
                      >
                        +
                      </button>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <span className="font-semibold text-gray-800">
                        ${(itemPrice * itemQuantity).toFixed(2)}
                      </span>
                      <button 
                        onClick={() => removeItem(itemId)}
                        disabled={isDeleting}
                        className={`text-red-500 hover:text-red-700 p-1 ${
                          isDeleting ? 'opacity-50 cursor-not-allowed' : ''
                        }`}
                        title="Remove item"
                      >
                        {isDeleting ? (
                          <span className="inline-block animate-spin">⟳</span>
                        ) : (
                          <FaTrashAlt className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 sm:justify-between mb-6 sm:mb-8">
            <Link 
              to="/"
              className="bg-white border border-gray-300 text-gray-700 px-4 sm:px-6 py-2 rounded hover:bg-gray-50 transition-colors text-center text-sm sm:text-base"
            >
              Return To Shop
            </Link>
            <button 
              onClick={handleUpdateCart}
              disabled={loading}
              className="bg-white border border-gray-300 text-gray-700 px-4 sm:px-6 py-2 rounded hover:bg-gray-50 transition-colors disabled:opacity-50 text-sm sm:text-base"
            >
              {loading ? 'Updating...' : 'Update Cart'}
            </button>
          </div>

          {/* Coupon and Cart Total Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
            {/* Coupon Section */}
            <div className="order-2 lg:order-1">
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                <input
                  type="text"
                  placeholder="Coupon Code"
                  // value={couponCode}
                  // onChange={(e) => setCouponCode(e.target.value)}
                  className="flex-1 border border-gray-300 px-3 sm:px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent text-sm sm:text-base"
                />

                <button 
                  // onClick={applyCoupon}
                  disabled={!couponCode.trim() || updatingCart}
                  className="bg-red-500 text-white px-4 sm:px-6 py-2 rounded hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
                >
                  {updatingCart ? 'Applying...' : 'Apply Coupon'}
                </button>
              </div>
            </div>

            {/* Cart Total */}
            <div className="bg-white border border-gray-300 rounded-lg p-4 sm:p-6 order-1 lg:order-2">
                          <h3 className="text-lg sm:text-xl font-semibold mb-4 sm:mb-6 text-gray-800">Cart Total</h3>
              
              <div className="space-y-3 sm:space-y-4">
                <div className="flex justify-between items-center py-2 border-b border-gray-200">
                  <span className="text-gray-600 text-sm sm:text-base">Subtotal:</span>
                  <span className="font-semibold text-gray-800 text-sm sm:text-base">${subtotal.toFixed(2)}</span>
                </div>
                
                {discount > 0 && (
                  <div className="flex justify-between items-center py-2 border-b border-gray-200">
                    <span className="text-gray-600 text-sm sm:text-base">Discount:</span>
                    <span className="text-green-600 font-medium text-sm sm:text-base">-${discount.toFixed(2)}</span>
                  </div>
                )}
                
                <div className="flex justify-between items-center py-2 border-b border-gray-200">
                  <span className="text-gray-600 text-sm sm:text-base">Shipping:</span>
                  <span className="text-green-600 font-medium text-sm sm:text-base">Free</span>
                </div>
                
                <div className="flex justify-between items-center py-2 sm:py-3 text-base sm:text-lg font-semibold text-gray-800">
                  <span>Total:</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>
             <Link to="/CheckOut">
              <button className="w-full bg-red-500 text-white py-2.5 sm:py-3 rounded-lg mt-4 sm:mt-6 hover:bg-red-600 transition-colors font-semibold text-sm sm:text-base">
                Proceed to checkout
              </button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddToCart;