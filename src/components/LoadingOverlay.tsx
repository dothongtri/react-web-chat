import React from "react";
import { useLoading } from "../context/LoadingContext";

const LoadingOverlay = () => {
    const { loading } = useLoading();
    if (!loading) return null;
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/60 backdrop-blur-sm">
            <div className="flex flex-col items-center bg-white rounded-2xl shadow-xl px-8 py-8 border border-blue-100">
                <svg
                    className="w-16 h-16 text-blue-400 animate-spin"
                    viewBox="0 0 50 50"
                >
                    <circle
                        className="opacity-20"
                        cx="25"
                        cy="25"
                        r="20"
                        stroke="currentColor"
                        strokeWidth="5"
                        fill="none"
                    />
                    <circle
                        className="opacity-80"
                        cx="25"
                        cy="25"
                        r="20"
                        stroke="url(#gradient)"
                        strokeWidth="5"
                        fill="none"
                        strokeDasharray="100"
                        strokeDashoffset="60"
                    />
                    <defs>
                        <linearGradient id="gradient" x1="0" y1="0" x2="50" y2="50">
                            <stop offset="0%" stopColor="#3b82f6" />
                            <stop offset="100%" stopColor="#06b6d4" />
                        </linearGradient>
                    </defs>
                </svg>
                <span className="mt-6 text-lg font-semibold text-blue-600 animate-pulse">
                    Đang tải dữ liệu...
                </span>
            </div>
        </div>
    );
};

export default LoadingOverlay;
