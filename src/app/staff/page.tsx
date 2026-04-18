"use client";
import { useEffect } from "react";

export default function Page() {
    useEffect(() => {
        window.location.href = "/";
    }, []);
    return (
        <div>
            <h1>Redirecting to Dashboard</h1>
        </div>
    )
}