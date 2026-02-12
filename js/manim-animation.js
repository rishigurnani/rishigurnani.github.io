// js/manim-animation.js

function initAnimation() {
  new p5(function(p) {
    let phrases = ["Deep Learning", "Chemistry", "Practical Execution"];
    let currentPhraseIdx = 0;
    let particles = [];
    let spotlight = { x: 0, y: 0, targetX: 0, targetY: 0 };
    let font;

    p.setup = function() {
      const container = document.getElementById("hero-canvas-container");
      if (!container) return;
      
      const canvas = p.createCanvas(container.offsetWidth, container.offsetHeight);
      canvas.parent(container);
      
      // Initialize background particles (Molecular/Neural look)
      for (let i = 0; i < 40; i++) {
        particles.push(new Particle(p));
      }
      
      p.textAlign(p.CENTER, p.CENTER);
      p.textFont('sans-serif'); // Or a custom geometric font like 'Inter' or 'Montserrat'
      p.frameRate(60);
    };

    p.draw = function() {
      p.background(10, 10, 15); // Deep Manim-style charcoal

      // 1. Draw Subtle Dynamic Background (The "Intersection")
      particles.forEach(part => {
        part.update();
        part.display();
      });

      // 2. Update Spotlight Position (Smooth Elliptical Path)
      let t = p.frameCount * 0.015;
      spotlight.x = p.width / 2 + p.cos(t) * (p.width * 0.3);
      spotlight.y = p.height / 2 + p.sin(t * 0.5) * (p.height * 0.2);

      // 4. Draw the Spotlight Glow (Optional Overlay)
      drawSpotlightGlow(p, spotlight);
      
      // Cycle through phrases every few seconds based on spotlight position
      if (p.frameCount % 300 === 0) {
        currentPhraseIdx = (currentPhraseIdx + 1) % phrases.length;
      }
    };

    function drawSpotlightGlow(p, spot) {
      p.push();
      p.noStroke();
      for (let r = 0; r < 150; r += 10) {
        p.fill(100, 150, 255, p.map(r, 0, 150, 15, 0));
        p.ellipse(spot.x, spot.y, r * 2);
      }
      p.pop();
    }

    // Background Particle Class
    class Particle {
      constructor(p) {
        this.p = p;
        this.pos = p.createVector(p.random(p.width), p.random(p.height));
        this.vel = p.createVector(p.random(-0.5, 0.5), p.random(-0.5, 0.5));
      }
      update() {
        this.pos.add(this.vel);
        if (this.pos.x < 0 || this.pos.x > this.p.width) this.vel.x *= -1;
        if (this.pos.y < 0 || this.pos.y > this.p.height) this.vel.y *= -1;
      }
      display() {
        this.p.stroke(255, 255, 255, 30);
        this.p.strokeWeight(1);
        this.p.point(this.pos.x, this.pos.y);
      }
    }

    p.windowResized = function() {
      const container = document.getElementById("hero-canvas-container");
      if (container) p.resizeCanvas(container.offsetWidth, container.offsetHeight);
    };
  });
}