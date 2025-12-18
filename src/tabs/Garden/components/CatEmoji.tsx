const CatEmoji = () => {
  return (
    <svg viewBox="0 0 100 100" className="w-12 h-12 transition-transform duration-300 ease-out group-hover:-translate-y-1">
      {/* Fur / Head Base */}
      <circle cx="50" cy="50" r="38" fill="#fbbf24" stroke="#b45309" strokeWidth="2.5" />
      
      {/* Ears */}
      <path d="M18,35 L12,12 L40,22 Z" fill="#fbbf24" stroke="#b45309" strokeWidth="2.5" strokeLinejoin="round" />
      <path d="M82,35 L88,12 L60,22 Z" fill="#fbbf24" stroke="#b45309" strokeWidth="2.5" strokeLinejoin="round" />
      {/* Inner Ears */}
      <path d="M22,32 L19,19 L35,25 Z" fill="#fca5a5" />
      <path d="M78,32 L81,19 L65,25 Z" fill="#fca5a5" />

      {/* Face Patches (Calico/Tabby markings) */}
      <path d="M50,14 Q65,14 70,25 Q50,30 30,25 Q35,14 50,14" fill="#fff7ed" opacity="0.6" />

      {/* Eyes */}
      {/* Left (Wink) */}
      <path d="M30,48 Q38,55 46,48" fill="none" stroke="#78350f" strokeWidth="3.5" strokeLinecap="round" />
      {/* Right (Open & Sparkly) */}
      <circle cx="68" cy="48" r="5" fill="#78350f" />
      <circle cx="70" cy="46" r="2" fill="white" />

      {/* Nose */}
      <path d="M48,58 Q50,60 52,58 L50,61 Z" fill="#ec4899" />

      {/* Mouth */}
      <path d="M48,61 Q42,68 38,62" fill="none" stroke="#78350f" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M52,61 Q58,68 62,62" fill="none" stroke="#78350f" strokeWidth="2.5" strokeLinecap="round" />

      {/* Cheeks */}
      <ellipse cx="28" cy="62" rx="6" ry="4" fill="#fbcfe8" opacity="0.6" />
      <ellipse cx="72" cy="62" rx="6" ry="4" fill="#fbcfe8" opacity="0.6" />

      {/* Whiskers */}
      <path d="M15,55 L25,52" stroke="#78350f" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M15,62 L25,60" stroke="#78350f" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M85,55 L75,52" stroke="#78350f" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M85,62 L75,60" stroke="#78350f" strokeWidth="1.5" strokeLinecap="round" />

      {/* Paw Thumbs Up */}
      <g transform="translate(65, 75) rotate(-15)">
          <circle cx="0" cy="0" r="10" fill="#fff" stroke="#b45309" strokeWidth="2" />
          <ellipse cx="-4" cy="-2" rx="4" ry="3" fill="#fca5a5" />
          {/* Thumb */}
          <path d="M5,-5 Q12,-10 10,0 Q8,5 5,2" fill="#fff" stroke="#b45309" strokeWidth="2" />
      </g>
      
      {/* Collar */}
      <path d="M30,80 Q50,90 70,80" fill="none" stroke="#ef4444" strokeWidth="4" strokeLinecap="round" />
      <circle cx="50" cy="85" r="4" fill="#facc15" stroke="#b45309" strokeWidth="1" />
  </svg>
  )
}

export default CatEmoji;