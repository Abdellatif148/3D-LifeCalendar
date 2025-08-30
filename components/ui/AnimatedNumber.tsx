import React, { useEffect, useRef } from 'react';
import { animate } from 'framer-motion';

interface AnimatedNumberProps {
    from?: number;
    to: number;
    duration?: number;
    className?: string;
}

const AnimatedNumber: React.FC<AnimatedNumberProps> = ({ from = 0, to, duration = 1.5, className }) => {
    const nodeRef = useRef<HTMLSpanElement>(null);

    useEffect(() => {
        const node = nodeRef.current;
        if (!node) return;

        const controls = animate(from, to, {
            duration,
            onUpdate(value) {
                node.textContent = Math.round(value).toString();
            }
        });

        return () => controls.stop();
    }, [from, to, duration]);

    return <span ref={nodeRef} className={className} />;
};

export default AnimatedNumber;
