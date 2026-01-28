"use client";

import { useEffect } from "react";

export default function ClientCleaner() {
    useEffect(() => {
        console.log("🧹 Limpando cache local do navegador...");
        localStorage.clear();
        sessionStorage.clear();
        console.log("✅ Cache limpo!");
    }, []);

    return (
        <div className="fixed bottom-4 right-4 bg-red-500 text-white px-4 py-2 rounded-full text-xs font-bold z-50 pointer-events-none opacity-50">
            Cache Limpo
        </div>
    );
}
