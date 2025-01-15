import { useState, useRef } from 'react';
import clsx from 'clsx'

type HoldButtonProps = {
  text: string
  className?: string
  handleOnClick: () => void
}

const HoldButton = ({text, className, handleOnClick}: HoldButtonProps) => {
  const [isHolding, setIsHolding] = useState(false);
  const [progress, setProgress] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const handleMouseDown = () => {
    setIsHolding(true);
    let start = 0;

    timerRef.current = setInterval(() => {
      start += 10; // обновление каждые 100 мс
      setProgress((start / 2000) * 100); // 2000 мс - 100%

      if (start >= 2000) {
        clearInterval(timerRef.current!);
        timerRef.current = null;
        setProgress(0);
        setIsHolding(false);
        handleOnClick(); // Здесь можно добавить любое действие
      }
    }, 10);
  };

  const handleMouseUp = () => {
    setIsHolding(false);
    clearInterval(timerRef.current!);
    timerRef.current = null;
    setProgress(0);
  };

  return (
    <button
      className={clsx('relative w-40 h-12 text-white rounded-xl overflow-hidden bg-red-300', className)}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      <div
        className="absolute top-0 left-0 h-full bg-red-600"
        style={{ width: `${progress}%`, transition: isHolding ? 'none' : 'width 0.2s' }}
      ></div>
      <span className="relative z-10">{text}</span>
    </button>
  );
};

export default HoldButton;
