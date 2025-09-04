
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const baseUrl = import.meta.env.VITE_API_BASE_URL;

const Admin = () => {
    const [productsCount, setProductsCount] = useState(0);
    const [categoriesCount, setCategoriesCount] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchCounts();
    }, []);

    const fetchCounts = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem("token");

            // Fetch Categories
            const categoriesResponse = await fetch(`${baseUrl}/Category`, {
                method: 'GET',
                headers: {
                    'Accept': '*/*',
                }
            });

            if (categoriesResponse.ok) {
                const categoriesData = await categoriesResponse.json();
                console.log('Categories data:', categoriesData);
                
                if (categoriesData.succeeded && categoriesData.data) {
                    // Check if data is an array
                    if (Array.isArray(categoriesData.data)) {
                        setCategoriesCount(categoriesData.data.length);
                    }
                }
            }

            // Fetch Products
            const productsResponse = await fetch(`${baseUrl}/Product`, {
                method: 'GET',
                headers: {
                    'Accept': '*/*',
                }
            });

            if (productsResponse.ok) {
                const productsData = await productsResponse.json();
                console.log('Products data:', productsData);
                
                if (productsData.succeeded && productsData.data) {
                    // Check if data contains items array
                    if (Array.isArray(productsData.data) && productsData.data.length > 0) {
                        // Get the items from the first element if it has an items property
                        const firstElement = productsData.data[0];
                        if (firstElement && Array.isArray(firstElement)) {
                            setProductsCount(firstElement.length);
                        } else if (firstElement && firstElement.items && Array.isArray(firstElement.items)) {
                            setProductsCount(firstElement.items.length);
                        } else {
                            // If data itself is the products array
                            setProductsCount(productsData.data.length);
                        }
                    } else if (productsData.data.items && Array.isArray(productsData.data.items)) {
                        // If items are directly in data.items
                        setProductsCount(productsData.data.items.length);
                    } else if (productsData.totalPages !== undefined) {
                        // If response has pagination info
                        setProductsCount(productsData.data.length);
                    }
                }
            }

        } catch (error) {
            console.error('Error fetching counts:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 my-16">
            <div className="max-w-6xl mx-auto px-4">
                {/* Modern Welcome Section */}
                <div className="mb-12">
                    <h1 className="text-5xl font-bold text-gray-900 mb-4">
                        Admin Dashboard
                    </h1>
                    <p className="text-xl text-gray-600">
                        Manage your store with ease
                    </p>
                </div>

                {/* Modern Action Cards */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Create Product Card */}
                    <Link 
                        to="/CreateProduct" 
                        className="group relative overflow-hidden bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300"
                    >
                        <div className="absolute inset-0 bg-gradient-to-br from-red-500 to-red-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        <div className="relative p-8">
                            <div className="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-white group-hover:bg-opacity-20 transition-colors duration-300">
                                <svg className="w-8 h-8 text-red-600 group-hover:text-white transition-colors duration-300" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                </svg>
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-2 group-hover:text-white transition-colors duration-300">
                                Create New Product
                            </h3>
                            <p className="text-gray-600 group-hover:text-white group-hover:text-opacity-90 transition-colors duration-300">
                                Add products to your inventory and manage stock levels
                            </p>
                            <div className="mt-6 flex items-center text-red-600 font-semibold group-hover:text-white transition-colors duration-300">
                                <span>Get Started</span>
                                <svg className="w-5 h-5 ml-2 group-hover:translate-x-2 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                </svg>
                            </div>
                        </div>
                    </Link>

                    {/* Create Categories Card */}
                    <Link 
                        to="/CreateCat" 
                        className="group relative overflow-hidden bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300"
                    >
                        <div className="absolute inset-0 bg-gradient-to-br from-red-500 to-red-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        <div className="relative p-8">
                            <div className="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-white group-hover:bg-opacity-20 transition-colors duration-300">
                                <svg className="w-8 h-8 text-red-600 group-hover:text-white transition-colors duration-300" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                                </svg>
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-2 group-hover:text-white transition-colors duration-300">
                                Manage Categories
                            </h3>
                            <p className="text-gray-600 group-hover:text-white group-hover:text-opacity-90 transition-colors duration-300">
                                Organize products into categories for better navigation
                            </p>
                            <div className="mt-6 flex items-center text-red-600 font-semibold group-hover:text-white transition-colors duration-300">
                                <span>Get Started</span>
                                <svg className="w-5 h-5 ml-2 group-hover:translate-x-2 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                </svg>
                            </div>
                        </div>
                    </Link>
                    {/*  */}
                     <Link 
                        to="/adv" 
                        className="group relative overflow-hidden bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300"
                    >
                        <div className="absolute inset-0 bg-gradient-to-br from-red-500 to-red-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        <div className="relative p-8">
                            <div className="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-white group-hover:bg-opacity-20 transition-colors duration-300">
                                <svg className="w-8 h-8 text-red-600 group-hover:text-white transition-colors duration-300" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                                </svg>
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-2 group-hover:text-white transition-colors duration-300">
                                Manage advertismensts 
                            </h3>
                            <p className="text-gray-600 group-hover:text-white group-hover:text-opacity-90 transition-colors duration-300">
                                Organize products into advertismensts 
                            </p>
                            <div className="mt-6 flex items-center text-red-600 font-semibold group-hover:text-white transition-colors duration-300">
                                <span>Get Started</span>
                                <svg className="w-5 h-5 ml-2 group-hover:translate-x-2 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                </svg>
                            </div>
                        </div>
                    </Link>
                </div>

                {/* Showing number of products and categories */}
                <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white rounded-xl p-6 shadow-sm">
                        <p className="text-gray-600 text-sm">Total Products</p>
                        {loading ? (
                            <div className="mt-2">
                                <div className="animate-pulse h-9 bg-gray-200 rounded w-16"></div>
                            </div>
                        ) : (
                            <p className="text-3xl font-bold text-gray-900 mt-2">{productsCount}</p>
                        )}
                    </div>
                    <div className="bg-white rounded-xl p-6 shadow-sm">
                        <p className="text-gray-600 text-sm">Categories</p>
                        {loading ? (
                            <div className="mt-2">
                                <div className="animate-pulse h-9 bg-gray-200 rounded w-fit"></div>
                            </div>
                        ) : (
                            <p className="text-3xl font-bold text-gray-900 mt-2">{categoriesCount}</p>
                        )}
                    </div>
                   
                </div>
            </div>
        </div>
    )
}

export default Admin;