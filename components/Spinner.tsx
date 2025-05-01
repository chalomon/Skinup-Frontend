import React from "react";

interface SpinnerProps {
  size?: "sm" | "md" | "lg"; // Opciones de tamaño
  className?: string; // Clases personalizadas
}

const Spinner: React.FC<SpinnerProps> = ({
  size = "md", // Tamaño por defecto "md"
  className, // Clases adicionales personalizadas
}) => {
  // Clases de tamaño para el spinner
  const sizeClasses = {
    sm: "w-6 h-6 border-4",
    md: "w-8 h-8 border-4",
    lg: "w-12 h-12 border-8",
  };

  return (
    <div className={`flex justify-center items-center ${className}`}>
      <div
        className={`border-t-transparent border-solid rounded-full animate-spin ${sizeClasses[size]} border-t-blue-500 border-gray-200`}
      />
    </div>
  );
};

export default Spinner;
