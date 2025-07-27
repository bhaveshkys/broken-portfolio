import React, { useRef, useEffect, useState } from 'react';

interface ParticleEffectProps {
  width?: number;
  height?: number;
  particleColor?: string;
  backgroundColor?: string;
  className?: string;
  heroWidth?: number;
  heroHeight?: number;
}

interface ParticleData {
  targetX: number;
  targetY: number;
}

class Particle {
  x: number;
  y: number;
  targetX: number;
  targetY: number;
  velocity: { x: number; y: number };
  size: number;
  isForming: boolean;
  heroWidth: number;
  heroHeight: number;
  opacity: number;

  constructor(targetX: number, targetY: number, heroWidth: number, heroHeight: number) {
    this.x = Math.random() * heroWidth;
    this.y = Math.random() * heroHeight;
    this.targetX = targetX;
    this.targetY = targetY;
    this.velocity = { x: 0, y: 0 };
    this.size = 2.5;
    this.isForming = false;
    this.heroWidth = heroWidth;
    this.heroHeight = heroHeight;
    this.opacity = 0.8;
  }

  update(shouldForm: boolean) {
    if (shouldForm) {
      const dx = this.targetX - this.x;
      const dy = this.targetY - this.y;
      
      this.velocity.x = dx * 0.08;
      this.velocity.y = dy * 0.08;
      this.isForming = true;
    } else {
      if (this.isForming) {
        this.velocity.x = (Math.random() - 0.5) * 12;
        this.velocity.y = (Math.random() - 0.5) * 12;
        this.isForming = false;
      }
      
      this.velocity.x += (Math.random() - 0.5) * 0.3;
      this.velocity.y += (Math.random() - 0.5) * 0.3;
      
      this.velocity.x *= 0.99;
      this.velocity.y *= 0.99;
    }

    this.x += this.velocity.x;
    this.y += this.velocity.y;

    if (this.x < 0) {
      this.x = 0;
      this.velocity.x *= -0.3;
    } else if (this.x > this.heroWidth) {
      this.x = this.heroWidth;
      this.velocity.x *= -0.3;
    }
    
    if (this.y < 0) {
      this.y = 0;
      this.velocity.y *= -0.3;
    } else if (this.y > this.heroHeight) {
      this.y = this.heroHeight;
      this.velocity.y *= -0.3;
    }
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.globalAlpha = this.opacity;
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 1;
  }
}

const ParticleEffect: React.FC<ParticleEffectProps> = ({
  width = 800,
  height = 400,
  particleColor = '#3b82f6',
  backgroundColor = 'transparent',
  className = '',
  heroWidth = 1200,
  heroHeight = 600
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const animationRef = useRef<number>();
  const isHoveringRef = useRef(false);
  const lastFrameTime = useRef(0);
  const targetFPS = 60;
  const frameInterval = 1000 / targetFPS;
  
  // Cycling text states
  const texts = ['Full Stack Dev', 'Hardware Tinkerer', 'UI/UX Enthusiast'];
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const [particleData, setParticleData] = useState<ParticleData[]>([]);

  // Function to create text particles
  const createTextParticles = (text: string): ParticleData[] => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d')!;
    
    // Set canvas size
    canvas.width = heroWidth * 0.5; // Left side width
    canvas.height = heroHeight;
    
    // Configure text style
    const fontSize = Math.min(canvas.width / text.length * 1.2, 48);
    ctx.font = `bold ${fontSize}px Arial, sans-serif`;
    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    
    // Draw text to canvas
    const x = canvas.width / 2;
    const y = canvas.height / 2;
    ctx.fillText(text, x, y);
    
    // Get image data
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    
    const particles: ParticleData[] = [];
    const step = 4; // Sampling step for performance
    
    // Extract particle positions from text pixels
    for (let y = 0; y < imageData.height; y += step) {
      for (let x = 0; x < imageData.width; x += step) {
        const pixelIndex = (y * 4 * imageData.width) + (x * 4);
        const alpha = data[pixelIndex + 3];
        
        if (alpha > 128) { // If pixel is not transparent
          particles.push({
            targetX: x,
            targetY: y
          });
        }
      }
    }
    
    return particles;
  };

  // Update particles when text changes
  useEffect(() => {
    const newParticleData = createTextParticles(texts[currentTextIndex]);
    setParticleData(newParticleData);
    
    // Create new particle instances
    particlesRef.current = newParticleData.map(({ targetX, targetY }) => 
      new Particle(targetX, targetY, heroWidth, heroHeight)
    );
  }, [currentTextIndex, heroWidth, heroHeight]);

  const animate = (currentTime: number) => {
    if (currentTime - lastFrameTime.current < frameInterval) {
      animationRef.current = requestAnimationFrame(animate);
      return;
    }
    
    lastFrameTime.current = currentTime;
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d')!;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Update and draw particles
    particlesRef.current.forEach(particle => {
      particle.update(isHoveringRef.current);
      particle.draw(ctx);
    });
    
    animationRef.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    canvas.width = heroWidth;
    canvas.height = heroHeight;
    
    // Start animation
    animationRef.current = requestAnimationFrame(animate);
    
    const handleMouseEnter = () => {
      isHoveringRef.current = true;
    };
    
    const handleMouseLeave = () => {
      isHoveringRef.current = false;
      // Cycle to next text on mouse leave
      setCurrentTextIndex((prev) => (prev + 1) % texts.length);
    };
    
    canvas.addEventListener('mouseenter', handleMouseEnter);
    canvas.addEventListener('mouseleave', handleMouseLeave);
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      canvas.removeEventListener('mouseenter', handleMouseEnter);
      canvas.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [heroWidth, heroHeight]);

  return (
    <canvas
      ref={canvasRef}
      className={className}
      style={{ backgroundColor }}
    />
  );
};

export default ParticleEffect;
