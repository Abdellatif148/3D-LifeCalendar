import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Navigation from '../ui/Navigation';

interface PricingViewProps {
    onNavigate: (view: string) => void;
}

const PricingView: React.FC<PricingViewProps> = ({ onNavigate }) => {
    const [isAnnual, setIsAnnual] = useState(false);

    const plans = [
        {
            name: 'Free',
            price: 0,
            annualPrice: 0,
            description: 'Perfect for getting started',
            features: [
                'Basic 3D life visualization',
                'Up to 5 habit categories',
                'Weekly progress tracking',
                'Basic calendar export',
                'Community support'
            ],
            cta: 'Start Free',
            popular: false
        },
        {
            name: 'Pro',
            price: 9,
            annualPrice: 7,
            description: 'For serious life optimizers',
            features: [
                'Advanced 3D visualizations',
                'Unlimited habit categories',
                'Daily progress tracking',
                'Smart nudge system',
                'Advanced analytics',
                'Priority support',
                'Custom themes',
                'Data export'
            ],
            cta: 'Upgrade to Pro',
            popular: true
        },
        {
            name: 'Enterprise',
            price: 29,
            annualPrice: 24,
            description: 'For teams and organizations',
            features: [
                'Everything in Pro',
                'Team collaboration',
                'Admin dashboard',
                'Custom integrations',
                'API access',
                'White-label options',
                'Dedicated support',
                'Custom training'
            ],
            cta: 'Contact Sales',
            popular: false
        }
    ];

    return (
        <div className="bg-[#0F172A] text-white min-h-screen">
            <Navigation onNavigate={onNavigate} currentView="pricing" />
            
            {/* Hero Section */}
            <section className="pt-24 pb-16 bg-gradient-to-br from-gray-900 via-purple-900/30 to-black">
                <div className="container mx-auto px-4 text-center">
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-5xl font-extrabold text-white mb-6"
                    >
                        Simple, <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500">Transparent Pricing</span>
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-xl text-white/80 mb-8"
                    >
                        Choose the plan that fits your life optimization journey.
                    </motion.p>
                    
                    {/* Billing Toggle */}
                    <div className="flex items-center justify-center space-x-4 mb-12">
                        <span className={`text-sm ${!isAnnual ? 'text-white' : 'text-white/60'}`}>Monthly</span>
                        <button
                            onClick={() => setIsAnnual(!isAnnual)}
                            className={`relative w-14 h-7 rounded-full transition-colors ${isAnnual ? 'bg-cyan-400' : 'bg-gray-600'}`}
                        >
                            <div className={`absolute top-1 w-5 h-5 bg-white rounded-full transition-transform ${isAnnual ? 'translate-x-7' : 'translate-x-1'}`}></div>
                        </button>
                        <span className={`text-sm ${isAnnual ? 'text-white' : 'text-white/60'}`}>
                            Annual <span className="text-green-400 font-semibold">(Save 20%)</span>
                        </span>
                    </div>
                </div>
            </section>

            {/* Pricing Cards */}
            <section className="py-16 bg-[#0F172A]">
                <div className="container mx-auto px-4">
                    <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                        {plans.map((plan, index) => (
                            <motion.div
                                key={plan.name}
                                initial={{ opacity: 0, y: 50 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                                className={`relative bg-white/5 p-8 rounded-2xl backdrop-blur-md border transition-all duration-300 hover:scale-105 ${
                                    plan.popular 
                                        ? 'border-cyan-400/50 shadow-cyan-400/20 shadow-2xl' 
                                        : 'border-white/10 hover:border-white/20'
                                }`}
                            >
                                {plan.popular && (
                                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                                        <span className="bg-gradient-to-r from-cyan-400 to-purple-500 text-white px-4 py-1 rounded-full text-sm font-bold">
                                            Most Popular
                                        </span>
                                    </div>
                                )}
                                
                                <div className="text-center mb-6">
                                    <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
                                    <p className="text-white/70 mb-4">{plan.description}</p>
                                    <div className="mb-4">
                                        <span className="text-4xl font-bold text-white">
                                            ${isAnnual ? plan.annualPrice : plan.price}
                                        </span>
                                        <span className="text-white/60 ml-2">/month</span>
                                    </div>
                                    {isAnnual && plan.annualPrice < plan.price && (
                                        <p className="text-green-400 text-sm">
                                            Save ${(plan.price - plan.annualPrice) * 12}/year
                                        </p>
                                    )}
                                </div>

                                <ul className="space-y-3 mb-8">
                                    {plan.features.map((feature, i) => (
                                        <li key={i} className="flex items-center text-sm">
                                            <div className="w-2 h-2 bg-cyan-400 rounded-full mr-3 flex-shrink-0"></div>
                                            <span className="text-white/80">{feature}</span>
                                        </li>
                                    ))}
                                </ul>

                                <button
                                    onClick={() => onNavigate('app')}
                                    className={`w-full py-3 rounded-xl font-bold transition-all duration-300 ${
                                        plan.popular
                                            ? 'bg-gradient-to-r from-cyan-400 to-purple-500 text-white hover:scale-105'
                                            : 'bg-white/10 text-white hover:bg-white/20 border border-white/20'
                                    }`}
                                >
                                    {plan.cta}
                                </button>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* FAQ Section */}
            <section className="py-16 bg-gradient-to-r from-purple-900/20 to-cyan-900/20">
                <div className="container mx-auto px-4">
                    <h2 className="text-3xl font-bold text-center text-white mb-12">Frequently Asked Questions</h2>
                    <div className="max-w-3xl mx-auto space-y-6">
                        {[
                            {
                                q: "Can I change my plan anytime?",
                                a: "Yes! You can upgrade, downgrade, or cancel your subscription at any time. Changes take effect immediately."
                            },
                            {
                                q: "Is my data secure?",
                                a: "Absolutely. We use enterprise-grade encryption and follow strict privacy standards. Your data is never shared or sold."
                            },
                            {
                                q: "Do you offer refunds?",
                                a: "We offer a 30-day money-back guarantee for all paid plans. No questions asked."
                            },
                            {
                                q: "Can I export my data?",
                                a: "Yes, you can export all your data at any time in multiple formats including JSON, CSV, and calendar files."
                            }
                        ].map((faq, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                                className="bg-white/5 p-6 rounded-xl backdrop-blur-md border border-white/10"
                            >
                                <h3 className="text-lg font-bold text-white mb-2">{faq.q}</h3>
                                <p className="text-white/70">{faq.a}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
};

export default PricingView;