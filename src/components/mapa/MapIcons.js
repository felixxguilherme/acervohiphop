// AIDEV-NOTE: Icon components for map markers using simplified SVG designs
import React from 'react';

// Simplified fita (tape) icon component
export const FitaIcon = ({ size = 24, color = "#fae523" }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect x="2" y="8" width="20" height="8" fill={color} stroke="#000" strokeWidth="2"/>
    <rect x="4" y="10" width="2" height="4" fill="#000"/>
    <rect x="18" y="10" width="2" height="4" fill="#000"/>
    <rect x="11" y="10" width="2" height="4" fill="#000"/>
  </svg>
);

// Simplified sound system icon component
export const SoundSystemIcon = ({ size = 24, color = "#fae523" }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect x="3" y="4" width="18" height="16" fill={color} stroke="#000" strokeWidth="2" rx="2"/>
    <circle cx="8" cy="10" r="3" fill="#000"/>
    <circle cx="16" cy="10" r="3" fill="#000"/>
    <rect x="6" y="16" width="12" height="2" fill="#000" rx="1"/>
    <circle cx="8" cy="10" r="1" fill={color}/>
    <circle cx="16" cy="10" r="1" fill={color}/>
  </svg>
);

// Generic hip hop icon (microphone)
export const MicIcon = ({ size = 24, color = "#fae523" }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect x="9" y="2" width="6" height="12" fill={color} stroke="#000" strokeWidth="2" rx="3"/>
    <path d="M6 10v2a6 6 0 0012 0v-2" stroke="#000" strokeWidth="2" fill="none"/>
    <line x1="12" y1="18" x2="12" y2="22" stroke="#000" strokeWidth="2"/>
    <line x1="8" y1="22" x2="16" y2="22" stroke="#000" strokeWidth="2"/>
    <circle cx="12" cy="8" r="2" fill="#000"/>
  </svg>
);

// Graffiti spray can icon
export const SprayIcon = ({ size = 24, color = "#fae523" }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect x="8" y="6" width="8" height="14" fill={color} stroke="#000" strokeWidth="2" rx="4"/>
    <rect x="10" y="3" width="4" height="4" fill="#000" rx="1"/>
    <circle cx="12" cy="12" r="2" fill="#000"/>
    <rect x="16" y="8" width="2" height="1" fill="#000"/>
    <rect x="16" y="10" width="3" height="1" fill="#000"/>
    <rect x="16" y="12" width="2" height="1" fill="#000"/>
  </svg>
);

// Turntable icon
export const TurntableIcon = ({ size = 24, color = "#fae523" }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect x="2" y="8" width="20" height="12" fill={color} stroke="#000" strokeWidth="2" rx="2"/>
    <circle cx="8" cy="14" r="4" fill="#000"/>
    <circle cx="16" cy="14" r="4" fill="#000"/>
    <circle cx="8" cy="14" r="2" fill={color}/>
    <circle cx="16" cy="14" r="2" fill={color}/>
    <rect x="10" y="4" width="4" height="6" fill="#000" rx="1"/>
  </svg>
);

// Array of all available icons
export const iconTypes = [
  { name: 'fita', component: FitaIcon, label: 'Fita/Tape' },
  { name: 'soundsystem', component: SoundSystemIcon, label: 'Sound System' },
  { name: 'mic', component: MicIcon, label: 'Microphone' },
  { name: 'spray', component: SprayIcon, label: 'Spray Can' },
  { name: 'turntable', component: TurntableIcon, label: 'Turntable' }
];

// Helper function to get a random icon
export const getRandomIcon = () => {
  const randomIndex = Math.floor(Math.random() * iconTypes.length);
  return iconTypes[randomIndex];
};