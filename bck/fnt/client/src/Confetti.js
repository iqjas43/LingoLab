import React, { useEffect, useRef } from 'react';

function Confetti({ duration = 3000, colors = ['#ffd700', '#ff6b6b', '#4ecdc4', '#45b7d1', '#f9ca24'] }) {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        const confettiPieces = [];
        const confettiCount = 150;

        class ConfettiPiece {
            constructor() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height - canvas.height;
                this.size = Math.random() * 10 + 5;
                this.speedY = Math.random() * 3 + 2;
                this.speedX = Math.random() * 2 - 1;
                this.color = colors[Math.floor(Math.random() * colors.length)];
                this.rotation = Math.random() * 360;
                this.rotationSpeed = Math.random() * 10 - 5;
                this.opacity = 1;
            }

            update() {
                this.y += this.speedY;
                this.x += this.speedX;
                this.rotation += this.rotationSpeed;

                if (this.y > canvas.height) {
                    this.opacity -= 0.02;
                }
            }

            draw() {
                ctx.save();
                ctx.translate(this.x, this.y);
                ctx.rotate((this.rotation * Math.PI) / 180);
                ctx.globalAlpha = this.opacity;
                ctx.fillStyle = this.color;
                ctx.fillRect(-this.size / 2, -this.size / 2, this.size, this.size);
                ctx.restore();
            }
        }

        // Initialize confetti
        for (let i = 0; i < confettiCount; i++) {
            confettiPieces.push(new ConfettiPiece());
        }

        let animationId;
        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            confettiPieces.forEach((piece) => {
                piece.update();
                piece.draw();
            });

            animationId = requestAnimationFrame(animate);
        };

        animate();

        // Auto-stop after duration
        const timer = setTimeout(() => {
            cancelAnimationFrame(animationId);
            if (canvas) {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
            }
        }, duration);

        return () => {
            clearTimeout(timer);
            cancelAnimationFrame(animationId);
        };
    }, [duration, colors]);

    return (
        <canvas
            ref={canvasRef}
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                pointerEvents: 'none',
                zIndex: 9999,
            }}
        />
    );
}

export default Confetti;
