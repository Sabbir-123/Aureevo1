"use client";

import { useState } from "react";
import { Sparkles, X, CheckCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import styles from "./AISizeRecommender.module.css";

// Simple height/weight matrix to size
const sizeLogic = (heightStr, weightStr, fitPref) => {
    // Basic mapping logic
    // This is a simplified demo logic
    let tempSize = "M";

    // Height rules (approximate)
    if (heightStr === "Above 6'0\"") tempSize = "XL";
    else if (heightStr === "5'10\" – 6'0\"" && weightStr !== "Under 55 kg") tempSize = "L";

    // Weight rules (approximate overrides)
    if (weightStr === "85+ kg") tempSize = "XXL";
    else if (weightStr === "75 – 85 kg" && tempSize !== "XXL") tempSize = "XL";
    else if (weightStr === "Under 55 kg") tempSize = "S";

    // Handle specific prompt rule
    if (weightStr === "55 – 65 kg" && heightStr === "Under 5'4\"") tempSize = "S";
    if (weightStr === "65 – 75 kg" && heightStr === "5'4\" – 5'7\"") tempSize = "M";
    if (weightStr === "75 – 85 kg" && heightStr === "5'7\" – 5'10\"") tempSize = "L";

    // Fit preference tweaks
    if (fitPref === "Oversized Fit" && tempSize !== "XXL") {
        const sizes = ["S", "M", "L", "XL", "XXL"];
        const currIndex = sizes.indexOf(tempSize);
        if (currIndex < sizes.length - 1) tempSize = sizes[currIndex + 1];
    }
    if (fitPref === "Slim Fit" && tempSize !== "S") {
        const sizes = ["S", "M", "L", "XL", "XXL"];
        const currIndex = sizes.indexOf(tempSize);
        if (currIndex > 0) tempSize = sizes[currIndex - 1];
    }

    return tempSize;
};

export default function AISizeRecommender({ onApplyRecommendation }) {
    const [isOpen, setIsOpen] = useState(false);
    const [step, setStep] = useState(1); // 1 = form, 2 = loading, 3 = result

    // Form State
    const [height, setHeight] = useState("");
    const [weight, setWeight] = useState("");
    const [fitPref, setFitPref] = useState("");
    const [recommendedSize, setRecommendedSize] = useState("");

    const isFormValid = height && weight && fitPref;

    const handleOpen = () => {
        setIsOpen(true);
        setStep(1);
        setHeight("");
        setWeight("");
        setFitPref("");
        setRecommendedSize("");
    };

    const handleClose = () => {
        setIsOpen(false);
    };

    const handleCalculate = () => {
        if (!isFormValid) return;

        setStep(2);

        // Simulate thinking time
        setTimeout(() => {
            const size = sizeLogic(height, weight, fitPref);
            setRecommendedSize(size);
            setStep(3);
        }, 1200);
    };

    const handleApply = () => {
        if (onApplyRecommendation) {
            onApplyRecommendation(recommendedSize);
        }
        handleClose();
    };

    return (
        <>
            <div className={styles.container}>
                <div className={styles.title}>
                    <Sparkles size={16} />
                    <span>Find Your Perfect Size</span>
                </div>
                <button className={styles.triggerBtn} onClick={handleOpen}>
                    Get Size Recommendation
                </button>
            </div>

            <AnimatePresence>
                {isOpen && (
                    <div className={styles.overlay}>
                        <motion.div
                            className={styles.modal}
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            transition={{ duration: 0.2 }}
                        >
                            <button className={styles.closeBtn} onClick={handleClose}>
                                <X size={20} />
                            </button>

                            {step === 1 && (
                                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                                    <h3 className={styles.modalTitle}>Size Assistant</h3>
                                    <p className={styles.modalSubtitle}>Answer a few quick questions to find your tailored fit.</p>

                                    <div className={styles.formGroup}>
                                        <label className={styles.label}>1. Height</label>
                                        <select
                                            className={styles.select}
                                            value={height}
                                            onChange={(e) => setHeight(e.target.value)}
                                        >
                                            <option value="" disabled>Select Height</option>
                                            <option value="Under 5'4&quot;">Under 5'4"</option>
                                            <option value="5'4&quot; – 5'7&quot;">5'4" – 5'7"</option>
                                            <option value="5'7&quot; – 5'10&quot;">5'7" – 5'10"</option>
                                            <option value="5'10&quot; – 6'0&quot;">5'10" – 6'0"</option>
                                            <option value="Above 6'0&quot;">Above 6'0"</option>
                                        </select>
                                    </div>

                                    <div className={styles.formGroup}>
                                        <label className={styles.label}>2. Weight</label>
                                        <select
                                            className={styles.select}
                                            value={weight}
                                            onChange={(e) => setWeight(e.target.value)}
                                        >
                                            <option value="" disabled>Select Weight</option>
                                            <option value="Under 55 kg">Under 55 kg</option>
                                            <option value="55 – 65 kg">55 – 65 kg</option>
                                            <option value="65 – 75 kg">65 – 75 kg</option>
                                            <option value="75 – 85 kg">75 – 85 kg</option>
                                            <option value="85+ kg">85+ kg</option>
                                        </select>
                                    </div>

                                    <div className={styles.formGroup}>
                                        <label className={styles.label}>3. Fit Preference</label>
                                        <select
                                            className={styles.select}
                                            value={fitPref}
                                            onChange={(e) => setFitPref(e.target.value)}
                                        >
                                            <option value="" disabled>Select Preference</option>
                                            <option value="Slim Fit">Slim Fit</option>
                                            <option value="Regular Fit">Regular Fit</option>
                                            <option value="Oversized Fit">Oversized Fit</option>
                                        </select>
                                    </div>

                                    <button
                                        className={styles.submitBtn}
                                        disabled={!isFormValid}
                                        onClick={handleCalculate}
                                    >
                                        Find My Size
                                    </button>
                                </motion.div>
                            )}

                            {step === 2 && (
                                <motion.div
                                    className={styles.resultContainer}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                >
                                    <Sparkles size={40} className={styles.starIcon} style={{ animation: 'pulse 1.5s infinite' }} />
                                    <h3 className={styles.resultTitle}>Analyzing your measurements...</h3>
                                    <p className={styles.modalSubtitle}>Calculating the perfect fit based on thousands of similar profiles.</p>
                                </motion.div>
                            )}

                            {step === 3 && (
                                <motion.div
                                    className={styles.resultContainer}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                >
                                    <Sparkles size={32} className={styles.starIcon} />
                                    <h3 className={styles.resultTitle}>Recommended Size</h3>
                                    <div className={styles.resultSize}>{recommendedSize}</div>

                                    <p className={styles.resultDesc}>
                                        Based on your height, weight, and fit preference, we recommend size {recommendedSize} for the best fit.
                                    </p>

                                    <div className={styles.confidenceBadge}>
                                        <CheckCircle size={14} />
                                        <span>85% of customers with similar body type chose {recommendedSize}</span>
                                    </div>

                                    <button className={styles.applyBtn} onClick={handleApply}>
                                        Apply Size
                                    </button>
                                </motion.div>
                            )}
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </>
    );
}
