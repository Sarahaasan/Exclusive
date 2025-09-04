import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const baseurl = import.meta.env.VITE_API_BASE_URL || "https://exclusive.runasp.net";

const CreateCat = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        description: ''
    });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
        // Clear messages when user starts typing
        if (message.text) {
            setMessage({ type: '', text: '' });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage({ type: '', text: '' });

        // Get the token from localStorage
        const token = localStorage.getItem('token');
        
        if (!token) {
            setMessage({ type: 'error', text: 'You must be logged in to create a category' });
            setLoading(false);
            return;
        }

        try {
            const response = await fetch(`${baseurl}/Category`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}` // Add this line
                },
                body: JSON.stringify(formData)
            });

            if (!response.ok) {
                // Get more details about the error
                const errorText = await response.text();
                console.error('Response status:', response.status);
                console.error('Error details:', errorText);
                
                if (response.status === 401) {
                    throw new Error('Unauthorized. Please login again.');
                } else if (response.status === 403) {
                    throw new Error('You do not have permission to create categories.');
                } else {
                    throw new Error(`Failed to create category: ${errorText || response.statusText}`);
                }
            }

            const data = await response.json();
            console.log('Category created:', data);
            
            // Show success message
            setMessage({ type: 'success', text: 'Category created successfully!' });
            
            // Clear form
            setFormData({ name: '', description: '' });
            
            // Redirect after a delay to show the success message
            setTimeout(() => {
                navigate('/admin');
            }, 2000);
            
        } catch (err) {
            setMessage({ type: 'error', text: err.message || 'Something went wrong!' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 my-16">
            <div className="max-w-2xl mx-auto px-4">
                {/* Header */}
                <div className="mb-8">
            <Link to="/Admin">
              <p className='text-lg text-gray-500 hover:text-black'> - Back</p>
            </Link>
                    <h1 className="text-4xl font-bold text-gray-900 mb-2">
                        Create New Category
                    </h1>
                    <p className="text-gray-600">
                        Add a new category to organize your products
                    </p>
                </div>

                {/* Form Card */}
                <div className="bg-white rounded-2xl shadow-xl p-8">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Category Name */}
                        <div>
                            <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">
                                Category Name
                            </label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200 outline-none"
                                placeholder="e.g. Electronics, Clothing, Books..."
                            />
                        </div>

                        {/* Description */}
                        <div>
                            <label htmlFor="description" className="block text-sm font-semibold text-gray-700 mb-2">
                                Description
                            </label>
                            <textarea
                                id="description"
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                required
                                rows={4}
                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200 outline-none resize-none"
                                placeholder="Provide a brief description of this category..."
                            />
                        </div>

                        {/* Success/Error Message */}
                        {message.text && (
                            <div className={`px-4 py-3 rounded-xl flex items-center gap-2 ${
                                message.type === 'success' 
                                    ? 'bg-green-50 border border-green-200 text-green-700' 
                                    : 'bg-red-50 border border-red-200 text-red-600'
                            }`}>
                                {message.type === 'success' ? (
                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                    </svg>
                                ) : (
                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                    </svg>
                                )}
                                <span>{message.text}</span>
                            </div>
                        )}

                        {/* Action Buttons */}
                        <div className="flex gap-4 pt-4">
                            <button
                                type="submit"
                                disabled={loading}
                                className="flex-1 bg-gradient-to-r from-red-500 to-red-600 text-white font-semibold py-3 px-6 rounded-xl hover:from-red-600 hover:to-red-700 transition-all duration-200 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? (
                                    <span className="flex items-center justify-center">
                                        <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                        </svg>
                                        Creating...
                                    </span>
                                ) : (
                                    'Create Category'
                                )}
                            </button>
                            <button
                                type="button"
                                onClick={() => navigate('/admin')}
                                className="px-6 py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-all duration-200"
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default CreateCat;