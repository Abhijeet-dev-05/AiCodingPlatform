import { useState, useEffect, useRef, useCallback } from 'react';

/**
 * Core animation hook for DSA visualizers
 * Manages play/pause, step control, and speed
 */
const useAnimation = (steps = [], initialSpeed = 1) => {
    const [currentStep, setCurrentStep] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [speed, setSpeed] = useState(initialSpeed);
    const intervalRef = useRef(null);

    const totalSteps = steps.length;
    const isComplete = currentStep >= totalSteps - 1;
    const currentState = steps[currentStep] || null;

    // Play animation
    const play = useCallback(() => {
        if (!isComplete) {
            setIsPlaying(true);
        }
    }, [isComplete]);

    // Pause animation
    const pause = useCallback(() => {
        setIsPlaying(false);
    }, []);

    // Step forward
    const stepForward = useCallback(() => {
        setCurrentStep(prev => Math.min(prev + 1, totalSteps - 1));
    }, [totalSteps]);

    // Step backward
    const stepBack = useCallback(() => {
        setCurrentStep(prev => Math.max(prev - 1, 0));
    }, []);

    // Reset to beginning
    const reset = useCallback(() => {
        setCurrentStep(0);
        setIsPlaying(false);
    }, []);

    // Go to specific step
    const goToStep = useCallback((step) => {
        setCurrentStep(Math.max(0, Math.min(step, totalSteps - 1)));
    }, [totalSteps]);

    // Change speed
    const changeSpeed = useCallback((newSpeed) => {
        setSpeed(newSpeed);
    }, []);

    // Auto-play effect
    useEffect(() => {
        if (isPlaying && currentStep < totalSteps - 1) {
            intervalRef.current = setTimeout(() => {
                setCurrentStep(prev => prev + 1);
            }, 1000 / speed);
        } else if (currentStep >= totalSteps - 1) {
            setIsPlaying(false);
        }

        return () => {
            if (intervalRef.current) {
                clearTimeout(intervalRef.current);
            }
        };
    }, [isPlaying, currentStep, totalSteps, speed]);

    // Reset when steps change
    useEffect(() => {
        setCurrentStep(0);
        setIsPlaying(false);
    }, [steps.length]);

    return {
        // State
        currentStep,
        currentState,
        isPlaying,
        isComplete,
        speed,
        totalSteps,
        progress: totalSteps > 0 ? (currentStep / (totalSteps - 1)) * 100 : 0,

        // Actions
        play,
        pause,
        stepForward,
        stepBack,
        reset,
        goToStep,
        changeSpeed,
        togglePlay: () => isPlaying ? pause() : play()
    };
};

export default useAnimation;
