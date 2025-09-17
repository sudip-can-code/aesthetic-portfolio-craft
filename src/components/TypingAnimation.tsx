
import { useState, useEffect } from "react";

const TypingAnimation = () => {
  const words = [
    "Project Manager",
    "Video Editor", 
    "Graphics Design",
    "Motion Graphics",
    "Product Designer",
    "Web Developer",
    "Production Supervisor",
    "Content Creation"
  ];

  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [currentText, setCurrentText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [typingSpeed, setTypingSpeed] = useState(150);

  useEffect(() => {
    const currentWord = words[currentWordIndex];
    
    const timeout = setTimeout(() => {
      if (!isDeleting) {
        // Typing
        if (currentText.length < currentWord.length) {
          setCurrentText(currentWord.substring(0, currentText.length + 1));
        } else {
          // Finished typing, wait then start deleting
          setTypingSpeed(50);
          setTimeout(() => setIsDeleting(true), 2000);
        }
      } else {
        // Deleting
        if (currentText.length > 0) {
          setCurrentText(currentWord.substring(0, currentText.length - 1));
        } else {
          // Finished deleting, move to next word
          setIsDeleting(false);
          setCurrentWordIndex((prev) => (prev + 1) % words.length);
          setTypingSpeed(150);
        }
      }
    }, typingSpeed);

    return () => clearTimeout(timeout);
  }, [currentText, isDeleting, currentWordIndex, typingSpeed, words]);

  return (
    <div className="text-center">
      <span className="text-6xl md:text-8xl lg:text-9xl font-bold text-primary/20 tracking-wider whitespace-nowrap">
        {currentText}
        <span className="animate-pulse">|</span>
      </span>
    </div>
  );
};

export default TypingAnimation;
