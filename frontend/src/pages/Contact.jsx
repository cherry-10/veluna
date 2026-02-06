import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { apiService } from '../utils/api';
import Button from '../components/UI/Button';
import toast from 'react-hot-toast';
import { FiMail, FiPhone, FiMapPin, FiInstagram } from 'react-icons/fi';

const Contact = () => {
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, formState: { errors }, reset } = useForm();

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await apiService.submitContactForm(data);
      toast.success('Message sent successfully! We\'ll get back to you soon.');
      reset();
    } catch (error) {
      toast.error('Failed to send message. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-32 pb-16 bg-cream">
      <div className="container-custom">
        <div className="text-center mb-12">
          <h1 className="font-playfair text-5xl font-bold text-brown mb-4">
            Get in Touch
          </h1>
          <p className="text-xl text-charcoal-light">
            Have questions? We'd love to hear from you
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div className="bg-white rounded-veluna shadow-veluna p-8">
            <h2 className="font-playfair text-2xl font-semibold text-brown mb-6">
              Send us a Message
            </h2>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-charcoal mb-2">
                  Your Name *
                </label>
                <input
                  type="text"
                  {...register('name', { required: 'Name is required' })}
                  className="input-field"
                  placeholder="John Doe"
                />
                {errors.name && (
                  <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-charcoal mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  {...register('email', { 
                    required: 'Email is required',
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: 'Invalid email address'
                    }
                  })}
                  className="input-field"
                  placeholder="your@email.com"
                />
                {errors.email && (
                  <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-charcoal mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  {...register('phone')}
                  className="input-field"
                  placeholder="9876543210"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-charcoal mb-2">
                  Subject *
                </label>
                <select
                  {...register('subject', { required: 'Subject is required' })}
                  className="input-field"
                >
                  <option value="">Select a subject</option>
                  <option value="General Inquiry">General Inquiry</option>
                  <option value="Custom Order">Custom Order</option>
                  <option value="Support">Support</option>
                  <option value="Collaboration">Collaboration</option>
                  <option value="Feedback">Feedback</option>
                </select>
                {errors.subject && (
                  <p className="text-red-500 text-sm mt-1">{errors.subject.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-charcoal mb-2">
                  Message *
                </label>
                <textarea
                  {...register('message', { required: 'Message is required' })}
                  rows="6"
                  className="input-field"
                  placeholder="Tell us how we can help you..."
                />
                {errors.message && (
                  <p className="text-red-500 text-sm mt-1">{errors.message.message}</p>
                )}
              </div>

              <Button type="submit" loading={loading} fullWidth size="lg">
                Send Message
              </Button>
            </form>
          </div>

          {/* Contact Information */}
          <div>
            <div className="bg-white rounded-veluna shadow-veluna p-8 mb-8">
              <h2 className="font-playfair text-2xl font-semibold text-brown mb-6">
                Contact Information
              </h2>

              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-beige rounded-full flex items-center justify-center flex-shrink-0">
                    <FiMail className="w-6 h-6 text-brown" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-charcoal mb-1">Email</h3>
                    <a
                      href="mailto:hello@velunaskf.com"
                      className="text-charcoal-light hover:text-brown transition-colors"
                    >
                      hello@velunaskf.com
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-beige rounded-full flex items-center justify-center flex-shrink-0">
                    <FiPhone className="w-6 h-6 text-brown" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-charcoal mb-1">Phone</h3>
                    <a
                      href="tel:+919876543210"
                      className="text-charcoal-light hover:text-brown transition-colors"
                    >
                      +91 98765 43210
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-beige rounded-full flex items-center justify-center flex-shrink-0">
                    <FiInstagram className="w-6 h-6 text-brown" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-charcoal mb-1">Instagram</h3>
                    <a
                      href="https://instagram.com/velunaskf"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-charcoal-light hover:text-brown transition-colors"
                    >
                      @velunaskf
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-beige rounded-full flex items-center justify-center flex-shrink-0">
                    <FiMapPin className="w-6 h-6 text-brown" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-charcoal mb-1">Location</h3>
                    <p className="text-charcoal-light">
                      Home Studio<br />
                      India
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Business Hours */}
            <div className="bg-beige rounded-veluna p-8">
              <h3 className="font-playfair text-xl font-semibold text-brown mb-4">
                Response Time
              </h3>
              <p className="text-charcoal-light mb-4">
                We typically respond to all inquiries within 24-48 hours during business days.
              </p>
              <p className="text-sm text-charcoal-light">
                For urgent custom orders or special requests, please mention it in your message.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
