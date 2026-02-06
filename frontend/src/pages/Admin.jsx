import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { FiPlus, FiEdit2, FiTrash2, FiImage, FiSave, FiX } from 'react-icons/fi';
import { apiService } from '../utils/api';

const Admin = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    sku: '',
    name: '',
    slug: '',
    description: '',
    short_description: '',
    price: '',
    original_price: '',
    stock_quantity: '',
    category_id: '',
    is_featured: false,
    fragrance_notes: '',
    burn_time_hours: '',
    weight_grams: '',
    image_url: ''
  });

  // Fetch products
  const { data: productsData, isLoading } = useQuery('admin-products', () =>
    apiService.getProducts({ limit: 100 })
  );

  // Fetch categories
  const { data: categoriesData } = useQuery('categories', apiService.getCategories);

  // Add product mutation
  const addProductMutation = useMutation(
    (productData) => apiService.createProduct(productData),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('admin-products');
        toast.success('Product added successfully!');
        setShowAddModal(false);
        resetForm();
      },
      onError: () => toast.error('Failed to add product')
    }
  );

  // Update product mutation
  const updateProductMutation = useMutation(
    ({ id, data }) => apiService.updateProduct(id, data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('admin-products');
        toast.success('Product updated successfully!');
        setEditingProduct(null);
        resetForm();
      },
      onError: () => toast.error('Failed to update product')
    }
  );

  // Delete product mutation
  const deleteProductMutation = useMutation(
    (id) => apiService.deleteProduct(id),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('admin-products');
        toast.success('Product deleted successfully!');
      },
      onError: () => toast.error('Failed to delete product')
    }
  );

  const resetForm = () => {
    setFormData({
      sku: '',
      name: '',
      slug: '',
      description: '',
      short_description: '',
      price: '',
      original_price: '',
      stock_quantity: '',
      category_id: '',
      is_featured: false,
      fragrance_notes: '',
      burn_time_hours: '',
      weight_grams: '',
      image_url: ''
    });
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const productData = {
      ...formData,
      price: parseFloat(formData.price),
      original_price: formData.original_price ? parseFloat(formData.original_price) : null,
      stock_quantity: parseInt(formData.stock_quantity),
      burn_time_hours: formData.burn_time_hours ? parseInt(formData.burn_time_hours) : null,
      weight_grams: formData.weight_grams ? parseInt(formData.weight_grams) : null,
    };

    if (editingProduct) {
      updateProductMutation.mutate({ id: editingProduct.id, data: productData });
    } else {
      addProductMutation.mutate(productData);
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setFormData({
      sku: product.sku,
      name: product.name,
      slug: product.slug,
      description: product.description || '',
      short_description: product.short_description || '',
      price: product.price,
      original_price: product.original_price || '',
      stock_quantity: product.stock_quantity,
      category_id: product.category_id,
      is_featured: product.is_featured,
      fragrance_notes: product.fragrance_notes || '',
      burn_time_hours: product.burn_time_hours || '',
      weight_grams: product.weight_grams || '',
      image_url: product.product_images?.[0]?.image_url || ''
    });
    setShowAddModal(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      deleteProductMutation.mutate(id);
    }
  };

  const products = productsData?.data?.products || [];
  const categories = categoriesData?.data?.categories || [];

  // Check if user is admin (you can add proper admin check)
  if (!user) {
    navigate('/login');
    return null;
  }

  return (
    <div className="min-h-screen pt-32 pb-16 bg-cream">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-playfair text-4xl font-semibold text-brown mb-2">Admin Panel</h1>
            <p className="text-charcoal-light">Manage your products and inventory</p>
          </div>
          <button
            onClick={() => {
              resetForm();
              setEditingProduct(null);
              setShowAddModal(true);
            }}
            className="flex items-center gap-2 px-6 py-3 bg-brown text-white rounded-full hover:bg-brown-dark transition-colors"
          >
            <FiPlus className="w-5 h-5" />
            Add Product
          </button>
        </div>

        {/* Products Table */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-beige">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-brown">Image</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-brown">Product</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-brown">SKU</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-brown">Price</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-brown">Stock</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-brown">Featured</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-brown">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-beige">
                {isLoading ? (
                  <tr>
                    <td colSpan="7" className="px-6 py-8 text-center text-charcoal-light">
                      Loading products...
                    </td>
                  </tr>
                ) : products.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="px-6 py-8 text-center text-charcoal-light">
                      No products found. Add your first product!
                    </td>
                  </tr>
                ) : (
                  products.map((product) => (
                    <tr key={product.id} className="hover:bg-cream/50 transition-colors">
                      <td className="px-6 py-4">
                        <img
                          src={product.product_images?.[0]?.image_url || 'https://via.placeholder.com/80'}
                          alt={product.name}
                          className="w-16 h-16 object-cover rounded-lg"
                        />
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-medium text-charcoal">{product.name}</div>
                        <div className="text-sm text-charcoal-light">{product.short_description}</div>
                      </td>
                      <td className="px-6 py-4 text-sm text-charcoal">{product.sku}</td>
                      <td className="px-6 py-4">
                        <div className="font-semibold text-brown">₹{product.price}</div>
                        {product.original_price && (
                          <div className="text-sm text-gray-400 line-through">₹{product.original_price}</div>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          product.stock_quantity > 10 ? 'bg-green-100 text-green-700' :
                          product.stock_quantity > 0 ? 'bg-yellow-100 text-yellow-700' :
                          'bg-red-100 text-red-700'
                        }`}>
                          {product.stock_quantity}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        {product.is_featured && (
                          <span className="px-3 py-1 bg-gold/20 text-gold rounded-full text-xs font-medium">
                            Featured
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleEdit(product)}
                            className="p-2 text-brown hover:bg-beige rounded-lg transition-colors"
                            title="Edit"
                          >
                            <FiEdit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(product.id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete"
                          >
                            <FiTrash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Add/Edit Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-white border-b border-beige px-6 py-4 flex items-center justify-between">
                <h2 className="font-playfair text-2xl font-semibold text-brown">
                  {editingProduct ? 'Edit Product' : 'Add New Product'}
                </h2>
                <button
                  onClick={() => {
                    setShowAddModal(false);
                    setEditingProduct(null);
                    resetForm();
                  }}
                  className="p-2 hover:bg-beige rounded-lg transition-colors"
                >
                  <FiX className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-charcoal mb-2">SKU *</label>
                    <input
                      type="text"
                      name="sku"
                      value={formData.sku}
                      onChange={handleInputChange}
                      required
                      className="input-field"
                      placeholder="CAN-LAV-001"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-charcoal mb-2">Product Name *</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className="input-field"
                      placeholder="Lavender Dreams Candle"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-charcoal mb-2">Slug *</label>
                    <input
                      type="text"
                      name="slug"
                      value={formData.slug}
                      onChange={handleInputChange}
                      required
                      className="input-field"
                      placeholder="lavender-dreams-candle"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-charcoal mb-2">Category *</label>
                    <select
                      name="category_id"
                      value={formData.category_id}
                      onChange={handleInputChange}
                      required
                      className="input-field"
                    >
                      <option value="">Select Category</option>
                      {categories.map(cat => (
                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-charcoal mb-2">Price (₹) *</label>
                    <input
                      type="number"
                      name="price"
                      value={formData.price}
                      onChange={handleInputChange}
                      required
                      min="0"
                      step="0.01"
                      className="input-field"
                      placeholder="599"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-charcoal mb-2">Original Price (₹)</label>
                    <input
                      type="number"
                      name="original_price"
                      value={formData.original_price}
                      onChange={handleInputChange}
                      min="0"
                      step="0.01"
                      className="input-field"
                      placeholder="799"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-charcoal mb-2">Stock Quantity *</label>
                    <input
                      type="number"
                      name="stock_quantity"
                      value={formData.stock_quantity}
                      onChange={handleInputChange}
                      required
                      min="0"
                      className="input-field"
                      placeholder="50"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-charcoal mb-2">Burn Time (hours)</label>
                    <input
                      type="number"
                      name="burn_time_hours"
                      value={formData.burn_time_hours}
                      onChange={handleInputChange}
                      min="0"
                      className="input-field"
                      placeholder="40"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-charcoal mb-2">Weight (grams)</label>
                    <input
                      type="number"
                      name="weight_grams"
                      value={formData.weight_grams}
                      onChange={handleInputChange}
                      min="0"
                      className="input-field"
                      placeholder="250"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-charcoal mb-2">Fragrance Notes</label>
                    <input
                      type="text"
                      name="fragrance_notes"
                      value={formData.fragrance_notes}
                      onChange={handleInputChange}
                      className="input-field"
                      placeholder="Lavender, Vanilla, Chamomile"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-charcoal mb-2">Short Description</label>
                  <input
                    type="text"
                    name="short_description"
                    value={formData.short_description}
                    onChange={handleInputChange}
                    className="input-field"
                    placeholder="Calming lavender scent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-charcoal mb-2">Description</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows="4"
                    className="input-field"
                    placeholder="Detailed product description..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-charcoal mb-2">Image URL</label>
                  <input
                    type="url"
                    name="image_url"
                    value={formData.image_url}
                    onChange={handleInputChange}
                    className="input-field"
                    placeholder="https://images.unsplash.com/photo-..."
                  />
                  <p className="text-xs text-charcoal-light mt-1">
                    Use Unsplash or upload to Supabase Storage
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="is_featured"
                    name="is_featured"
                    checked={formData.is_featured}
                    onChange={handleInputChange}
                    className="w-4 h-4 text-brown border-beige rounded focus:ring-brown"
                  />
                  <label htmlFor="is_featured" className="text-sm font-medium text-charcoal">
                    Mark as Featured Product
                  </label>
                </div>

                <div className="flex items-center gap-4 pt-4 border-t border-beige">
                  <button
                    type="submit"
                    disabled={addProductMutation.isLoading || updateProductMutation.isLoading}
                    className="flex items-center gap-2 px-6 py-3 bg-brown text-white rounded-full hover:bg-brown-dark transition-colors disabled:opacity-50"
                  >
                    <FiSave className="w-4 h-4" />
                    {editingProduct ? 'Update Product' : 'Add Product'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowAddModal(false);
                      setEditingProduct(null);
                      resetForm();
                    }}
                    className="px-6 py-3 border border-beige text-charcoal rounded-full hover:bg-beige transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Admin;
