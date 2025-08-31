import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Navigation from '../ui/Navigation';

interface BlogViewProps {
    onNavigate: (view: string) => void;
}

const BlogView: React.FC<BlogViewProps> = ({ onNavigate }) => {
    const [selectedCategory, setSelectedCategory] = useState('all');

    const blogPosts = [
        {
            title: 'The Science Behind Time Visualization',
            excerpt: 'Discover how 3D visualization helps your brain understand time allocation better than traditional methods.',
            category: 'Research',
            date: 'January 15, 2025',
            readTime: '5 min read',
            image: 'https://images.pexels.com/photos/3861969/pexels-photo-3861969.jpeg?auto=compress&cs=tinysrgb&w=600',
            featured: true
        },
        {
            title: 'How Small Changes Create Massive Life Impact',
            excerpt: 'Learn why adjusting your routine by just 30 minutes per day can add years to your life expectancy.',
            category: 'Lifestyle',
            date: 'January 12, 2025',
            readTime: '7 min read',
            image: 'https://images.pexels.com/photos/1181677/pexels-photo-1181677.jpeg?auto=compress&cs=tinysrgb&w=600',
            featured: false
        },
        {
            title: 'Building the Future of Productivity Apps',
            excerpt: 'Behind the scenes look at how we created the world\'s first 3D life calendar using cutting-edge web technology.',
            category: 'Technology',
            date: 'January 10, 2025',
            readTime: '10 min read',
            image: 'https://images.pexels.com/photos/3861458/pexels-photo-3861458.jpeg?auto=compress&cs=tinysrgb&w=600',
            featured: false
        },
        {
            title: 'The Psychology of Time Perception',
            excerpt: 'Why humans are terrible at estimating time and how visualization can fix this fundamental flaw.',
            category: 'Psychology',
            date: 'January 8, 2025',
            readTime: '6 min read',
            image: 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=600',
            featured: false
        },
        {
            title: 'Case Study: How Sarah Added 5 Years to Her Life',
            excerpt: 'Real user story showing how simple habit changes led to dramatic life expectancy improvements.',
            category: 'Case Study',
            date: 'January 5, 2025',
            readTime: '8 min read',
            image: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=600',
            featured: false
        },
        {
            title: 'The Mathematics of Life Optimization',
            excerpt: 'Deep dive into the algorithms that power our life expectancy calculations and habit impact analysis.',
            category: 'Research',
            date: 'January 3, 2025',
            readTime: '12 min read',
            image: 'https://images.pexels.com/photos/3861969/pexels-photo-3861969.jpeg?auto=compress&cs=tinysrgb&w=600',
            featured: false
        }
    ];

    const categories = ['all', 'Research', 'Lifestyle', 'Technology', 'Psychology', 'Case Study'];

    const filteredPosts = selectedCategory === 'all' 
        ? blogPosts 
        : blogPosts.filter(post => post.category === selectedCategory);

    return (
        <div className="bg-[#0F172A] text-white min-h-screen">
            <Navigation onNavigate={onNavigate} currentView="blog" />
            
            {/* Hero Section */}
            <section className="pt-24 pb-16 bg-gradient-to-br from-gray-900 via-purple-900/30 to-black">
                <div className="container mx-auto px-4 text-center">
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-5xl font-extrabold text-white mb-6"
                    >
                        The <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500">Time Blog</span>
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-xl text-white/80 max-w-3xl mx-auto"
                    >
                        Insights, research, and stories about time optimization, productivity, and living a more intentional life.
                    </motion.p>
                </div>
            </section>

            {/* Category Filter */}
            <section className="py-8 bg-[#0F172A]">
                <div className="container mx-auto px-4">
                    <div className="flex flex-wrap justify-center gap-3">
                        {categories.map((category) => (
                            <button
                                key={category}
                                onClick={() => setSelectedCategory(category)}
                                className={`px-4 py-2 rounded-full font-medium transition-all ${
                                    selectedCategory === category
                                        ? 'bg-gradient-to-r from-cyan-400 to-purple-500 text-white'
                                        : 'bg-white/10 text-white/70 hover:bg-white/20 hover:text-white'
                                }`}
                            >
                                {category === 'all' ? 'All Posts' : category}
                            </button>
                        ))}
                    </div>
                </div>
            </section>

            {/* Featured Post */}
            {selectedCategory === 'all' && (
                <section className="py-16 bg-gradient-to-r from-purple-900/20 to-cyan-900/20">
                    <div className="container mx-auto px-4">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="bg-white/5 rounded-3xl overflow-hidden backdrop-blur-md border border-white/10 hover:border-white/20 transition-all duration-300"
                        >
                            <div className="grid lg:grid-cols-2">
                                <div className="p-8 lg:p-12 flex flex-col justify-center">
                                    <span className="inline-block px-3 py-1 bg-cyan-400/20 text-cyan-400 rounded-full text-sm font-medium mb-4">
                                        Featured Post
                                    </span>
                                    <h2 className="text-3xl font-bold text-white mb-4">{blogPosts[0].title}</h2>
                                    <p className="text-white/70 mb-6">{blogPosts[0].excerpt}</p>
                                    <div className="flex items-center space-x-4 text-sm text-white/60 mb-6">
                                        <span>{blogPosts[0].date}</span>
                                        <span>•</span>
                                        <span>{blogPosts[0].readTime}</span>
                                        <span>•</span>
                                        <span className="text-purple-400">{blogPosts[0].category}</span>
                                    </div>
                                    <button className="self-start px-6 py-3 bg-gradient-to-r from-cyan-400 to-purple-500 text-white font-bold rounded-full hover:scale-105 transition-transform">
                                        Read Article
                                    </button>
                                </div>
                                <div className="h-64 lg:h-auto">
                                    <img
                                        src={blogPosts[0].image}
                                        alt={blogPosts[0].title}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </section>
            )}

            {/* Blog Posts Grid */}
            <section className="py-16 bg-[#0F172A]">
                <div className="container mx-auto px-4">
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {filteredPosts.slice(selectedCategory === 'all' ? 1 : 0).map((post, index) => (
                            <motion.article
                                key={post.title}
                                initial={{ opacity: 0, y: 50 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                                className="bg-white/5 rounded-2xl overflow-hidden backdrop-blur-md border border-white/10 hover:border-white/20 transition-all duration-300 group cursor-pointer"
                            >
                                <div className="h-48 overflow-hidden">
                                    <img
                                        src={post.image}
                                        alt={post.title}
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                                    />
                                </div>
                                <div className="p-6">
                                    <div className="flex items-center space-x-2 mb-3">
                                        <span className="px-2 py-1 bg-purple-400/20 text-purple-400 rounded text-xs font-medium">
                                            {post.category}
                                        </span>
                                        <span className="text-white/60 text-xs">{post.readTime}</span>
                                    </div>
                                    <h3 className="text-lg font-bold text-white mb-3 group-hover:text-cyan-400 transition-colors">
                                        {post.title}
                                    </h3>
                                    <p className="text-white/70 text-sm mb-4">{post.excerpt}</p>
                                    <div className="flex items-center justify-between">
                                        <span className="text-white/60 text-xs">{post.date}</span>
                                        <button className="text-cyan-400 text-sm font-medium hover:text-cyan-300 transition-colors">
                                            Read More →
                                        </button>
                                    </div>
                                </div>
                            </motion.article>
                        ))}
                    </div>
                </div>
            </section>

            {/* Newsletter Signup */}
            <section className="py-16 bg-gradient-to-r from-cyan-900/20 to-purple-900/20">
                <div className="container mx-auto px-4 text-center">
                    <h2 className="text-3xl font-bold text-white mb-4">Stay Updated</h2>
                    <p className="text-white/70 mb-8 max-w-2xl mx-auto">
                        Get the latest insights on time optimization, productivity research, and product updates delivered to your inbox.
                    </p>
                    <div className="max-w-md mx-auto flex space-x-3">
                        <input
                            type="email"
                            placeholder="Enter your email"
                            className="flex-1 px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-400 transition-all"
                        />
                        <button className="px-6 py-3 bg-gradient-to-r from-cyan-400 to-purple-500 text-white font-bold rounded-lg hover:scale-105 transition-transform">
                            Subscribe
                        </button>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default BlogView;