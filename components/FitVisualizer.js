"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import styles from "./FitVisualizer.module.css";
import { Sparkles, ChevronDown, ChevronUp } from "lucide-react";

const BODY_TYPES = ["Slim", "Regular", "Athletic", "Heavy Build"];
const HEIGHTS = ["5'4\"", "5'7\"", "5'10\"", "6'0\"+"];
const FIT_TYPES = ["Slim Fit", "Regular Fit", "Oversized Fit"];

export default function FitVisualizer({ defaultRecommendedSize = "L" }) {
    const [bodyType, setBodyType] = useState("Regular");
    const [height, setHeight] = useState("5'10\"");
    const [fitType, setFitType] = useState("Regular Fit");
    const [isBackView, setIsBackView] = useState(false);
    const [isOpen, setIsOpen] = useState(false);

    // Calculate dimensions based on selections
    const getBodyScale = () => {
        let scX = 1;
        if (bodyType === "Slim") scX = 0.85;
        if (bodyType === "Athletic") scX = 1.1;
        if (bodyType === "Heavy Build") scX = 1.25;

        let scY = 1;
        if (height === "5'4\"") scY = 0.9;
        if (height === "5'7\"") scY = 0.95;
        if (height === "6'0\"+") scY = 1.05;

        return { scX, scY };
    };

    const getShirtStyles = () => {
        let widthScale = 1;
        let lengthScale = 1;

        if (fitType === "Slim Fit") {
            widthScale = 0.95;
            lengthScale = 0.95;
        } else if (fitType === "Oversized Fit") {
            widthScale = 1.25;
            lengthScale = 1.15;
        }

        return { widthScale, lengthScale };
    };

    const bodyScale = getBodyScale();
    const shirt = getShirtStyles();

    // Create a composite SVG transformation for the shirt
    // Shirt width is roughly based on body width, adjusted by FitType
    const finalShirtScaleX = bodyScale.scX * shirt.widthScale;
    const finalShirtScaleY = bodyScale.scY * shirt.lengthScale;

    return (
        <div className={styles.container}>
            <button
                className={styles.toggleSectionBtn}
                onClick={() => setIsOpen(!isOpen)}
                aria-expanded={isOpen}
            >
                <div className={styles.toggleSectionBtnLeft}>
                    <Sparkles size={16} />
                    <span>See How It Fits</span>
                </div>
                {isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        className={styles.contentWrapper}
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                    >
                        <div className={styles.innerContainer}>
                            <div className={styles.header}>
                                <p className={styles.subtitle}>Preview how this t-shirt fits on different body types.</p>
                            </div>

                            <div className={styles.card}>
                                <div className={styles.controls}>
                                    <div className={styles.controlGroup}>
                                        <span className={styles.controlLabel}>Body Type</span>
                                        <div className={styles.pillGroup}>
                                            {BODY_TYPES.map(bt => (
                                                <button
                                                    key={bt}
                                                    onClick={() => setBodyType(bt)}
                                                    className={`${styles.pillBtn} ${bodyType === bt ? styles.pillBtnActive : ''}`}
                                                >
                                                    {bt}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <div className={styles.controlGroup}>
                                        <span className={styles.controlLabel}>Height</span>
                                        <div className={styles.pillGroup}>
                                            {HEIGHTS.map(h => (
                                                <button
                                                    key={h}
                                                    onClick={() => setHeight(h)}
                                                    className={`${styles.pillBtn} ${height === h ? styles.pillBtnActive : ''}`}
                                                >
                                                    {h}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <div className={styles.controlGroup}>
                                        <span className={styles.controlLabel}>Fit Preference</span>
                                        <div className={styles.pillGroup}>
                                            {FIT_TYPES.map(ft => (
                                                <button
                                                    key={ft}
                                                    onClick={() => setFitType(ft)}
                                                    className={`${styles.pillBtn} ${fitType === ft ? styles.pillBtnActive : ''}`}
                                                >
                                                    {ft}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <div className={styles.infoFooter}>
                                        <div className={styles.recommendedSize}>
                                            <Sparkles size={16} /> Recommended Size: <span>{defaultRecommendedSize}</span>
                                        </div>
                                        <p className={styles.disclaimer}>
                                            This preview represents how the shirt may fit based on your body type.
                                        </p>
                                    </div>
                                </div>

                                <div className={styles.previewArea}>
                                    <button
                                        className={styles.toggleViewBtn}
                                        onClick={() => setIsBackView(!isBackView)}
                                    >
                                        {isBackView ? "Show Front" : "Show Back"}
                                    </button>

                                    <div className={styles.mannequinContainer}>
                                        {/* Body Silhouette */}
                                        <motion.svg
                                            viewBox="0 0 100 200"
                                            className={styles.svgIcon}
                                            animate={{ scaleX: bodyScale.scX, scaleY: bodyScale.scY, rotateY: isBackView ? 180 : 0 }}
                                            transition={{ type: "spring", stiffness: 120, damping: 20 }}
                                            style={{ position: "absolute", zIndex: 1, left: "-50%", width: "200%" }}
                                        >
                                            <path
                                                fill="#444"
                                                d="M 50 10 
                                   C 60 10 65 20 65 30 
                                   C 65 40 75 45 85 55 
                                   C 90 60 85 80 80 85 
                                   C 75 80 75 70 70 65 
                                   C 70 90 70 120 70 150 
                                   C 70 170 65 190 60 190
                                   C 55 190 55 120 50 120
                                   C 45 120 45 190 40 190
                                   C 35 190 30 170 30 150
                                   C 30 120 30 90 30 65
                                   C 25 70 25 80 20 85
                                   C 15 80 10 60 15 55
                                   C 25 45 35 40 35 30
                                   C 35 20 40 10 50 10 Z"
                                            />
                                        </motion.svg>

                                        {/* T-Shirt Overlay */}
                                        <motion.svg
                                            viewBox="0 0 100 200"
                                            className={styles.svgIcon}
                                            animate={{
                                                scaleX: finalShirtScaleX,
                                                scaleY: finalShirtScaleY,
                                                y: (finalShirtScaleY - 1) * -30, // Adjust vertical offset so shoulders align
                                                rotateY: isBackView ? 180 : 0
                                            }}
                                            transition={{ type: "spring", stiffness: 120, damping: 20 }}
                                            style={{ position: "absolute", zIndex: 2, left: "-50%", width: "200%", transformOrigin: "50% 15%" }}
                                        >
                                            <path
                                                fill="var(--color-white)"
                                                opacity={0.95}
                                                d={isBackView
                                                    ? "M 42 28 C 50 24 58 28 58 28 L 82 45 C 85 47 87 53 85 55 L 75 65 C 72 68 70 65 68 62 L 65 55 C 65 55 65 110 65 130 C 65 135 35 135 35 130 C 35 110 35 55 35 55 L 32 62 C 30 65 28 68 25 65 L 15 55 C 13 53 15 47 18 45 Z" // High back neck
                                                    : "M 40 28 C 45 35 55 35 60 28 L 82 45 C 85 47 87 53 85 55 L 75 65 C 72 68 70 65 68 62 L 65 55 C 65 55 65 110 65 130 C 65 135 35 135 35 130 C 35 110 35 55 35 55 L 32 62 C 30 65 28 68 25 65 L 15 55 C 13 53 15 47 18 45 Z" // Lower scoop front
                                                }
                                            />
                                        </motion.svg>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
