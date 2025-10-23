"use client";

import { useTheme } from "@/contexts/ThemeContext";

// Componente para marca-texto
export function MarcaTexto({ 
  children, 
  color = "amarelo", // "amarelo", "azul", "verde", "laranja", "vermelho"
  variant = "image", // "image" ou "css"
  className = "",
  ...props 
}) {
  const baseClass = variant === "image" 
    ? `marca-texto-${color}` 
    : `marca-texto-css-${color}`;
  
  return (
    <span className={`${baseClass} ${className}`} {...props}>
      {children}
    </span>
  );
}

// Componente para elementos spray
export function SprayElement({ 
  color = "amarelo", // "amarelo", "azul", "verde", "vermelho", "preto"
  variant = 1, // número da variação (1-6 dependendo da cor)
  size = "md", // "sm", "md", "lg", "xl"
  className = "",
  style = {},
  ...props 
}) {
  const sprayClass = `spray-${color}-${variant}`;
  const sizeClass = `spray-${size}`;
  
  return (
    <div 
      className={`${sprayClass} ${sizeClass} ${className}`} 
      style={style}
      {...props}
    />
  );
}

// Componente para backgrounds temáticos
export function HipHopBackground({ 
  variant = "claro", // "claro", "escuro", "papel", "concreto"
  children,
  className = "",
  ...props 
}) {
  const { theme } = useTheme();
  
  // Se variant for "auto", escolher baseado no tema
  const bgVariant = variant === "auto" 
    ? (theme === 'light' ? 'claro' : 'escuro')
    : variant;
  
  const bgClass = `bg-hip-fundo-${bgVariant}`;
  
  return (
    <div className={`${bgClass} ${className}`} {...props}>
      {children}
    </div>
  );
}

// Componente para textos com cores Hip Hop
export function HipHopText({ 
  children,
  color = "amarelo", // cores da paleta
  variant = "escuro", // "claro" ou "escuro"
  className = "",
  ...props 
}) {
  const { theme } = useTheme();
  
  // Auto-escolher variante baseado no tema se não especificado
  const textVariant = variant === "auto" 
    ? (theme === 'light' ? 'escuro' : 'claro')
    : variant;
  
  const textClass = `text-hip-${color}-${textVariant}`;
  
  return (
    <span className={`${textClass} ${className}`} {...props}>
      {children}
    </span>
  );
}

// Componente para botões Hip Hop style
export function HipHopButton({ 
  children,
  color = "amarelo",
  variant = "escuro",
  size = "md",
  className = "",
  ...props 
}) {
  const bgClass = `bg-hip-${color}-${variant}`;
  const textColor = variant === "claro" ? "text-black" : "text-white";
  
  const sizeClasses = {
    sm: "px-2 py-1 text-sm",
    md: "px-4 py-2 text-base",
    lg: "px-6 py-3 text-lg"
  };
  
  return (
    <button 
      className={`
        ${bgClass} 
        ${textColor} 
        ${sizeClasses[size]}
        border-2 border-black 
        shadow-hip-hop 
        hover:shadow-hip-hop-lg 
        transition-all duration-200 
        font-sometype-mono font-bold
        ${className}
      `} 
      {...props}
    >
      {children}
    </button>
  );
}

// Componente para cards Hip Hop style
export function HipHopCard({ 
  children,
  backgroundColor = "auto",
  borderColor = "black",
  shadow = true,
  className = "",
  ...props 
}) {
  const { theme } = useTheme();
  
  const bgClass = backgroundColor === "auto" 
    ? (theme === 'light' ? 'bg-hip-fundo-claro' : 'bg-hip-fundo-escuro')
    : `bg-hip-${backgroundColor}`;
  
  const shadowClass = shadow ? "shadow-hip-hop" : "";
  
  return (
    <div 
      className={`
        ${bgClass}
        border-3 border-${borderColor}
        ${shadowClass}
        p-4
        ${className}
      `} 
      {...props}
    >
      {children}
    </div>
  );
}

// Componente para decorações aleatórias
export function HipHopDecoration({ 
  type = "spray", // "spray" ou "marca-texto"
  position = "absolute", // posição CSS
  top,
  left,
  right,
  bottom,
  className = "",
  ...props 
}) {
  // Arrays de variações disponíveis
  const sprayVariations = [
    { color: "amarelo", variant: 1 },
    { color: "amarelo", variant: 2 },
    { color: "azul", variant: 1 },
    { color: "azul", variant: 2 },
    { color: "verde", variant: 1 },
    { color: "verde", variant: 3 },
    { color: "vermelho", variant: 1 },
    { color: "vermelho", variant: 3 },
    { color: "preto", variant: 1 },
    { color: "preto", variant: 2 }
  ];
  
  // Escolher variação aleatória
  const randomSpray = sprayVariations[Math.floor(Math.random() * sprayVariations.length)];
  
  const positionStyle = {
    position,
    top,
    left,
    right,
    bottom
  };
  
  if (type === "spray") {
    return (
      <SprayElement
        color={randomSpray.color}
        variant={randomSpray.variant}
        size="md"
        className={className}
        style={positionStyle}
        {...props}
      />
    );
  }
  
  return null;
}

// Exportar todos os componentes
export default {
  MarcaTexto,
  SprayElement,
  HipHopBackground,
  HipHopText,
  HipHopButton,
  HipHopCard,
  HipHopDecoration
};