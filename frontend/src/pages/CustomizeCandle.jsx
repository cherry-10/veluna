import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useAuth } from '../context/AuthContext';
import { apiService } from '../utils/api';
import Button from '../components/UI/Button';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { FiCheck } from 'react-icons/fi';

const CustomizeCandle = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, watch, formState: { errors } } = useForm({
    defaultValues: {
      jar_size: '100ml',
      jar_type: 'Clear Glass',
      mold_type: 'None',
      candle_color: 'Natural',
      fragrance: 'Lavender',
      fragrance_intensity: 'Medium',
      quantity: 1,
      special_instructions: '',
      guest_email: '',
      guest_name: '',
      guest_phone: '',
    }
  });

  const formData = watch();

  const steps = [
    { number: 1, title: 'Jar Size' },
    { number: 2, title: 'Jar Type' },
    { number: 3, title: 'Mold & Color' },
    { number: 4, title: 'Fragrance' },
    { number: 5, title: 'Details' },
  ];

  const jarSizes = ['30ml', '50ml', '100ml', '150ml', '200ml'];
  const jarTypes = ['Clear Glass', 'Frosted Glass', 'Metal Tin', 'Ceramic', 'Amber Glass'];
  const moldTypes = ['None', 'Flower Mold', 'Geometric Mold', 'Classic Mold'];
  const colors = ['Natural', 'White', 'Cream', 'Pink', 'Lavender', 'Blue'];
  const fragrances = ['Unscented', 'Lavender', 'Rose', 'Vanilla', 'Sandalwood', 'Citrus', 'Eucalyptus'];

  const calculateEstimatedPrice = () => {
    const sizeMultiplier = { '30ml': 1, '50ml': 1.5, '100ml': 2, '150ml': 2.5, '200ml': 3 };
    return 400 * (sizeMultiplier[formData.jar_size] || 2) * formData.quantity;
  };

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await apiService.createCustomCandle({
        ...data,
        guest_email: !user ? data.guest_email : undefined,
        guest_name: !user ? data.guest_name : undefined,
        guest_phone: !user ? data.guest_phone : undefined,
      });
      toast.success('Custom candle request submitted!');
      navigate(user ? '/profile?tab=custom' : '/');
    } catch (error) {
      toast.error('Failed to submit request');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-16 bg-cream">
      <div className="container-custom max-w-6xl">
        <div className="text-center mb-12">
          <h1 className="font-playfair text-5xl font-bold text-brown mb-4">
            Customize Your Candle
          </h1>
          <p className="text-xl text-charcoal-light">
            Create a unique candle tailored to your preferences
          </p>
        </div>

        {/* Progress */}
        <div className="mb-12 flex justify-between items-center">
          {steps.map((step, index) => (
            <div key={step.number} className="flex items-center flex-1">
              <div className="flex flex-col items-center flex-1">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center font-semibold ${
                  currentStep >= step.number ? 'bg-brown text-white' : 'bg-beige text-charcoal-light'
                }`}>
                  {currentStep > step.number ? <FiCheck /> : step.number}
                </div>
                <span className="text-sm mt-2 hidden md:block">{step.title}</span>
              </div>
              {index < steps.length - 1 && (
                <div className={`h-1 flex-1 mx-2 ${currentStep > step.number ? 'bg-brown' : 'bg-beige'}`} />
              )}
            </div>
          ))}
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 bg-white rounded-veluna shadow-veluna p-8">
              <AnimatePresence mode="wait">
                {currentStep === 1 && (
                  <motion.div key="step1" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    <h2 className="font-playfair text-3xl font-semibold text-brown mb-6">Select Jar Size</h2>
                    <div className="grid grid-cols-3 gap-4">
                      {jarSizes.map((size) => (
                        <label key={size} className={`cursor-pointer border-2 rounded-veluna p-6 text-center ${
                          formData.jar_size === size ? 'border-brown bg-brown/5' : 'border-beige'
                        }`}>
                          <input type="radio" value={size} {...register('jar_size')} className="sr-only" />
                          <div className="text-4xl mb-2">🕯️</div>
                          <div className="font-semibold">{size}</div>
                        </label>
                      ))}
                    </div>
                  </motion.div>
                )}

                {currentStep === 2 && (
                  <motion.div key="step2" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    <h2 className="font-playfair text-3xl font-semibold text-brown mb-6">Choose Jar Type</h2>
                    <div className="grid grid-cols-2 gap-4">
                      {jarTypes.map((type) => (
                        <label key={type} className={`cursor-pointer border-2 rounded-veluna p-6 ${
                          formData.jar_type === type ? 'border-brown bg-brown/5' : 'border-beige'
                        }`}>
                          <input type="radio" value={type} {...register('jar_type')} className="sr-only" />
                          <div className="font-semibold mb-2">{type}</div>
                        </label>
                      ))}
                    </div>
                  </motion.div>
                )}

                {currentStep === 3 && (
                  <motion.div key="step3" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    <h2 className="font-playfair text-3xl font-semibold text-brown mb-6">Mold & Color</h2>
                    <div className="mb-6">
                      <label className="block text-sm font-medium mb-2">Mold Type</label>
                      <select {...register('mold_type')} className="input-field">
                        {moldTypes.map(m => <option key={m} value={m}>{m}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Color</label>
                      <div className="grid grid-cols-3 gap-3">
                        {colors.map((color) => (
                          <label key={color} className={`cursor-pointer border-2 rounded-lg p-3 text-center ${
                            formData.candle_color === color ? 'border-brown bg-brown/5' : 'border-beige'
                          }`}>
                            <input type="radio" value={color} {...register('candle_color')} className="sr-only" />
                            <div className="text-sm font-medium">{color}</div>
                          </label>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}

                {currentStep === 4 && (
                  <motion.div key="step4" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    <h2 className="font-playfair text-3xl font-semibold text-brown mb-6">Choose Fragrance</h2>
                    <div className="grid grid-cols-2 gap-4 mb-6">
                      {fragrances.map((frag) => (
                        <label key={frag} className={`cursor-pointer border-2 rounded-lg p-4 text-center ${
                          formData.fragrance === frag ? 'border-brown bg-brown/5' : 'border-beige'
                        }`}>
                          <input type="radio" value={frag} {...register('fragrance')} className="sr-only" />
                          <div className="font-medium">{frag}</div>
                        </label>
                      ))}
                    </div>
                    {formData.fragrance !== 'Unscented' && (
                      <div>
                        <label className="block text-sm font-medium mb-2">Intensity</label>
                        <div className="flex gap-4">
                          {['Light', 'Medium', 'Strong'].map((i) => (
                            <label key={i} className={`flex-1 cursor-pointer border-2 rounded-lg p-3 text-center ${
                              formData.fragrance_intensity === i ? 'border-brown bg-brown/5' : 'border-beige'
                            }`}>
                              <input type="radio" value={i} {...register('fragrance_intensity')} className="sr-only" />
                              {i}
                            </label>
                          ))}
                        </div>
                      </div>
                    )}
                  </motion.div>
                )}

                {currentStep === 5 && (
                  <motion.div key="step5" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    <h2 className="font-playfair text-3xl font-semibold text-brown mb-6">Final Details</h2>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">Quantity</label>
                        <input type="number" min="1" {...register('quantity')} className="input-field" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Special Instructions</label>
                        <textarea {...register('special_instructions')} rows="4" className="input-field" />
                      </div>
                      {!user && (
                        <>
                          <div>
                            <label className="block text-sm font-medium mb-2">Name *</label>
                            <input type="text" {...register('guest_name', { required: !user })} className="input-field" />
                          </div>
                          <div>
                            <label className="block text-sm font-medium mb-2">Email *</label>
                            <input type="email" {...register('guest_email', { required: !user })} className="input-field" />
                          </div>
                          <div>
                            <label className="block text-sm font-medium mb-2">Phone *</label>
                            <input type="tel" {...register('guest_phone', { required: !user })} className="input-field" />
                          </div>
                        </>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="flex justify-between mt-8">
                <Button type="button" variant="outline" onClick={() => setCurrentStep(Math.max(1, currentStep - 1))} disabled={currentStep === 1}>
                  Previous
                </Button>
                {currentStep < 5 ? (
                  <Button type="button" onClick={() => setCurrentStep(currentStep + 1)}>Next</Button>
                ) : (
                  <Button type="submit" loading={loading}>Submit Request</Button>
                )}
              </div>
            </div>

            {/* Preview */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-veluna shadow-veluna p-6 sticky top-24">
                <h3 className="font-playfair text-2xl font-semibold text-brown mb-6">Your Design</h3>
                <div className="space-y-3 text-sm">
                  <div><span className="font-medium">Size:</span> {formData.jar_size}</div>
                  <div><span className="font-medium">Jar:</span> {formData.jar_type}</div>
                  <div><span className="font-medium">Mold:</span> {formData.mold_type}</div>
                  <div><span className="font-medium">Color:</span> {formData.candle_color}</div>
                  <div><span className="font-medium">Fragrance:</span> {formData.fragrance}</div>
                  <div><span className="font-medium">Quantity:</span> {formData.quantity}</div>
                </div>
                <div className="mt-6 pt-6 border-t border-beige">
                  <div className="text-lg font-bold text-brown">
                    Estimated: ₹{calculateEstimatedPrice()}
                  </div>
                  <p className="text-xs text-charcoal-light mt-2">Final price will be confirmed by our team</p>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CustomizeCandle;
