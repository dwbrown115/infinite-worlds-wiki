import React, { useState, useEffect } from "react";
import "./progress.css";

export default function ProgressBar({ percentage }) {
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setProgress((progress) => {
                if (progress >= percentage) {
                    clearInterval(interval);
                    return progress;
                }
                return progress + 1;
            });
        }, 10);
        return () => clearInterval(interval);
    }, [percentage]);

    useEffect(() => {
        if (progress >= 100) {
            setTimeout(() => {
                setProgress(0);
            }, 100);
        }
    }, [progress]);

    return (
        <div className="progress-bar">
            <div className="progress" style={{ width: `${progress}%` }}></div>
        </div>
    );
}
