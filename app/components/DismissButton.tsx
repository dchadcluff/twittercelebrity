interface DismissButtonProps {
  onDismiss: () => void;
}

export function DismissButton({ onDismiss }: DismissButtonProps) {
  return (
    <div className="absolute top-1 right-1 w-7 h-7 flex items-center justify-center">
      <button
        onClick={(e) => {
          e.stopPropagation();
          onDismiss();
        }}
        aria-label="Dismiss"
        className="w-5 h-5 rounded-full bg-cyber-black/80 flex items-center justify-center hover:border hover:border-neon-pink hover:shadow-[0_0_8px_rgba(255,0,110,0.5)] focus:outline focus:outline-2 focus:outline-neon-cyan focus:outline-offset-2 transition-all duration-150"
      >
        <span className="text-neon-pink" style={{ fontSize: "12px", lineHeight: 1 }}>
          &times;
        </span>
      </button>
    </div>
  );
}
