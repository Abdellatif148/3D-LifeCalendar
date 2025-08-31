import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Navigation from '../ui/Navigation';
import toast from 'react-hot-toast';

interface ContactViewProps {
    onNavigate: (view: string) => void;
}

const ContactView: React.FC<ContactViewProps> = ({ onNavigate }) => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        
        // Simulate form submission
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        toast.success('Message sent successfully! We\'ll get back to you within 24 hours.');
        setFormData({ name: '', email: '', subject: '', message: '' });
        setLoading(false);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    };

    const contactMethods = [
        {
            icon: '📧',
            title: 'Email Support',
            description: 'Get help with your account or technical questions',
            contact: 'support@3dtimeoptimizer.com',
            response: 'Response within 24 hours'
        },
        {
            icon: '💬',
            title: 'Live Chat',
            description: 'Chat with our team in real-time',
            contact: 'Available 9 AM - 6 PM PST',
            response: 'Instant response'
        },
        {
            icon: '📞',
            title: 'Phone Support',
            description: 'Speak directly with our experts',
            contact: '+1 (555) 123-4567',
            response: 'Pro & Enterprise only'
        }
    ];

    return (
        <div className="bg-[#0F172A] text-white min-h-screen">
            <Navigation onNavigate={onNavigate} currentView="contact" />
            
            {/* Hero Section */}
            <section className="pt-24 pb-16 bg-gradient-to-br from-gray-900 via-purple-900/30 to-black">
                <div className="container mx-auto px-4 text-center">
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-5xl font-extrabold text-white mb-6"
                    >
                        Get in <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500">Touch</span>
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-xl text-white/80 max-w-3xl mx-auto"
                    >
                        Have questions? Need support? Want to partner with us? We'd love to hear from you.
                    </motion.p>
                </div>
            </section>

            {/* Contact Methods */}
            <section className="py-16 bg-[#0F172A]">
                <div className="container mx-auto px-4">
                    <div className="grid md:grid-cols-3 gap-8 mb-16">
                        {contactMethods.map((method, index) => (
                            <motion.div
                                key={method.title}
                                initial={{ opacity: 0, y: 50 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                                className="bg-white/5 p-8 rounded-2xl backdrop-blur-md border border-white/10 text-center hover:border-white/20 transition-all duration-300"
                            >
                                <div className="text-4xl mb-4">{method.icon}</div>
                                <h3 className="text-xl font-bold text-white mb-3">{method.title}</h3>
                                <p className="text-white/70 mb-4">{method.description}</p>
                                <p className="text-cyan-400 font-semibold mb-2">{method.contact}</p>
                                <p className="text-sm text-white/60">{method.response}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Contact Form */}
            <section className="py-16 bg-gradient-to-r from-purple-900/20 to-cyan-900/20">
                <div className="container mx-auto px-4">
                    <div className="max-w-2xl mx-auto">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl font-bold text-white mb-4">Send Us a Message</h2>
                            <p className="text-white/70">
                                Fill out the form below and we'll get back to you as soon as possible.
                            </p>
                        </div>
                        
                        <motion.form
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            onSubmit={handleSubmit}
                            className="bg-white/5 p-8 rounded-2xl backdrop-blur-md border border-white/10 space-y-6"
                        >
                            <div className="grid md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">Name</label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-400 transition-all"
                                        placeholder="Your full name"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-400 transition-all"
                                        placeholder="your@email.com"
                                        required
                                    />
                                </div>
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Subject</label>
                                <select
                                    name="subject"
                                    value={formData.subject}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-400 transition-all"
                                    required
                                >
                                    <option value="">Select a subject</option>
                                    <option value="general">General Inquiry</option>
                                    <option value="support">Technical Support</option>
                                    <option value="sales">Sales Question</option>
                                    <option value="partnership">Partnership</option>
                                    <option value="careers">Career Opportunity</option>
                                    <option value="press">Press Inquiry</option>
                                </select>
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Message</label>
                                <textarea
                                    name="message"
                                    value={formData.message}
                                    onChange={handleChange}
                                    rows={6}
                                    className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-400 transition-all resize-none"
                                    placeholder="Tell us how we can help you..."
                                    required
                                />
                            </div>
                            
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full py-3 bg-gradient-to-r from-cyan-400 to-purple-500 text-white font-bold rounded-xl hover:scale-105 transition-transform disabled:opacity-50 disabled:hover:scale-100"
                            >
                                {loading ? 'Sending...' : 'Send Message'}
                            </button>
                        </motion.form>
                    </div>
                </div>
            </section>

            {/* Office Locations */}
            <section className="py-16 bg-[#0F172A]">
                <div className="container mx-auto px-4">
                    <h2 className="text-3xl font-bold text-center text-white mb-12">Our Locations</h2>
                    <div className="grid md:grid-cols-3 gap-8">
                        <div className="text-center">
                            <div className="text-3xl mb-4">🌉</div>
                            <h3 className="text-lg font-bold text-white mb-2">San Francisco</h3>
                            <p className="text-white/70 text-sm">
                                123 Innovation Drive<br/>
                                San Francisco, CA 94105<br/>
                                United States
                            </p>
                        </div>
                        <div className="text-center">
                            <div className="text-3xl mb-4">🗽</div>
                            <h3 className="text-lg font-bold text-white mb-2">New York</h3>
                            <p className="text-white/70 text-sm">
                                456 Tech Avenue<br/>
                                New York, NY 10001<br/>
                                United States
                            </p>
                        </div>
                        <div className="text-center">
                            <div className="text-3xl mb-4">🌍</div>
                            <h3 className="text-lg font-bold text-white mb-2">Remote</h3>
                            <p className="text-white/70 text-sm">
                                Work from anywhere<br/>
                                Global team<br/>
                                Flexible hours
                            </p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default ContactView;