// src/layouts/AuthLayout.tsx
import type { ReactNode } from "react";

export const AuthLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white w-full max-w-md rounded-xl shadow-lg p-8">
        {children}
      </div>
    </div>
  );
};
