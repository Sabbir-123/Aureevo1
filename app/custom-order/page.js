'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, CheckCircle, ChevronRight, ChevronLeft } from 'lucide-react';
import { submitCustomOrder, uploadCustomDesign } from '@/lib/api';
import toast from 'react-hot-toast';
import styles from './page.module.css';

export default function CustomOrderPage() {
    const [step, setStep] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        description: '',
    });
    const [designFile, setDesignFile] = useState(null);
    const [isSuccess, setIsSuccess] = useState(false);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setDesignFile(e.target.files[0]);
        }
    };

    const nextStep = () => {
        if (step === 1) {
            if (!formData.name || !formData.email || !formData.phone) {
                toast.error('Please fill in all contact details');
                return;
            }
        }
        setStep(s => Math.min(s + 1, 3));
    };

    const prevStep = () => setStep(s => Math.max(s - 1, 1));

    const handleSubmit = async () => {
        if (!formData.description) {
            toast.error('Please provide a design description');
            return;
        }

        setIsLoading(true);
        let designUrl = '';

        try {
            if (designFile) {
                const uploadRes = await uploadCustomDesign(designFile);
                if (uploadRes.error) throw new Error(uploadRes.error);
                designUrl = uploadRes.url;
            }

            const orderRes = await submitCustomOrder({
                ...formData,
                designUrl
            });

            if (orderRes.success) {
                setIsSuccess(true);
            } else {
                throw new Error(orderRes.error);
            }
        } catch (error) {
            toast.error(error.message || 'Failed to submit custom order');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.inner}>
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <h1 className={styles.title}>Bespoke Creation</h1>
                    <p className={styles.subtitle}>Let us bring your unique vision to reality. AUREEVO Custom provides tailored designs and exclusive fits.</p>
                </motion.div>

                <div className={styles.formCard}>
                    {!isSuccess ? (
                        <>
                            <div className={styles.stepIndicator}>
                                {[1, 2, 3].map((num) => (
                                    <div
                                        key={num}
                                        className={`${styles.step} ${step === num ? styles.stepActive : ''} ${step > num ? styles.stepCompleted : ''}`}
                                    >
                                        {step > num ? <CheckCircle size={16} /> : num}
                                    </div>
                                ))}
                            </div>

                            <AnimatePresence mode="wait">
                                {step === 1 && (
                                    <motion.div
                                        key="step1"
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -20 }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        <div className={styles.formGroup}>
                                            <label>Full Name</label>
                                            <input
                                                type="text"
                                                name="name"
                                                value={formData.name}
                                                onChange={handleInputChange}
                                                className={styles.input}
                                                placeholder="John Doe"
                                            />
                                        </div>
                                        <div className={styles.formGroup}>
                                            <label>Email Address</label>
                                            <input
                                                type="email"
                                                name="email"
                                                value={formData.email}
                                                onChange={handleInputChange}
                                                className={styles.input}
                                                placeholder="john@example.com"
                                            />
                                        </div>
                                        <div className={styles.formGroup}>
                                            <label>Phone Number</label>
                                            <input
                                                type="tel"
                                                name="phone"
                                                value={formData.phone}
                                                onChange={handleInputChange}
                                                className={styles.input}
                                                placeholder="+880 1XXX XXXXXX"
                                            />
                                        </div>
                                    </motion.div>
                                )}

                                {step === 2 && (
                                    <motion.div
                                        key="step2"
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -20 }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        <div className={styles.formGroup}>
                                            <label>Design Requirements & Vision</label>
                                            <textarea
                                                name="description"
                                                value={formData.description}
                                                onChange={handleInputChange}
                                                className={styles.textarea}
                                                placeholder="Describe your design, preferred materials, color palette, and any inspiration..."
                                            />
                                        </div>
                                    </motion.div>
                                )}

                                {step === 3 && (
                                    <motion.div
                                        key="step3"
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -20 }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        <div className={styles.formGroup}>
                                            <label>Upload Reference Design (Optional)</label>
                                            <label className={styles.fileInputWrapper}>
                                                <Upload size={32} className={styles.uploadIcon} />
                                                <p>Click to browse or drag and drop</p>
                                                <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginTop: '0.5rem' }}>PNG, JPG, or PDF (Max 10MB)</p>
                                                <input type="file" onChange={handleFileChange} accept="image/*,.pdf" />
                                                {designFile && (
                                                    <div className={styles.fileSelected}>
                                                        Selected: {designFile.name}
                                                    </div>
                                                )}
                                            </label>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            <div className={styles.actions}>
                                {step > 1 ? (
                                    <button onClick={prevStep} className={`${styles.btn} ${styles.btnPrev}`}>
                                        <ChevronLeft size={18} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '4px' }} />
                                        Back
                                    </button>
                                ) : <div></div>}

                                {step < 3 ? (
                                    <button onClick={nextStep} className={`${styles.btn} ${styles.btnNext}`}>
                                        Next
                                        <ChevronRight size={18} style={{ display: 'inline', verticalAlign: 'middle', marginLeft: '4px' }} />
                                    </button>
                                ) : (
                                    <button onClick={handleSubmit} disabled={isLoading} className={`${styles.btn} ${styles.btnNext}`}>
                                        {isLoading ? 'Submitting...' : 'Submit Request'}
                                    </button>
                                )}
                            </div>
                        </>
                    ) : (
                        <motion.div
                            className={styles.successMessage}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                        >
                            <CheckCircle size={64} className={styles.successIcon} />
                            <h3>Request Received</h3>
                            <p>Our bespoke team will review your requirements and get back to you within 24-48 hours with a customized quotation and timeline.</p>
                            <button onClick={() => window.location.href = '/'} className={styles.btn} style={{ background: '#c9a96e', color: '#000', border: 'none' }}>
                                Return Home
                            </button>
                        </motion.div>
                    )}
                </div>
            </div>
        </div>
    );
}
