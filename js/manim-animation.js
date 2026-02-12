// js/manim-animation.js

// js/manim-animation.js - Enhanced "Intersection" Engine

function initAnimation() {
  new p5(function(p) {
    let particles = [];
    const PARTICLE_COUNT = 55;
    const MAX_DIST = 120; // Distance for drawing "synapses"
    let canvas;

    p.setup = function() {
      const container = document.getElementById("hero-canvas-container");
      if (!container) return;
      
      canvas = p.createCanvas(container.offsetWidth, container.offsetHeight);
      canvas.parent(container);
      
      // Initialize nodes with random velocities
      for (let i = 0; i < PARTICLE_COUNT; i++) {
        particles.push(new Node(p));
      }
    };

    p.draw = function() {
      // Manim Charcoal Background
      p.background(12, 12, 15); 

      // Subtle Wave Function (The Chemistry/Physics layer)
      drawWave(p);

      // Update and draw connections
      for (let i = 0; i < particles.length; i++) {
        particles[i].update();
        particles[i].display();
        
        for (let j = i + 1; j < particles.length; j++) {
          let d = p.dist(particles[i].pos.x, particles[i].pos.y, particles[j].pos.x, particles[j].pos.y);
          if (d < MAX_DIST) {
            // Gradient lines based on proximity (Classic Manim look)
            let alpha = p.map(d, 0, MAX_DIST, 100, 0);
            p.stroke(100, 150, 255, alpha);
            p.strokeWeight(1);
            p.line(particles[i].pos.x, particles[i].pos.y, particles[j].pos.x, particles[j].pos.y);
          }
        }
      }

      // Mouse "Spotlight" Interaction
      drawInterference(p);
    };

    function drawWave(p) {
      p.noFill();
      p.stroke(255, 255, 255, 15);
      p.beginShape();
      for (let x = 0; x < p.width; x += 20) {
        let y = p.height * 0.8 + p.sin(x * 0.01 + p.frameCount * 0.02) * 30;
        p.vertex(x, y);
      }
      p.endShape();
    }

    function drawInterference(p) {
      let mX = p.mouseX;
      let mY = p.mouseY;
      
      p.noStroke();
      // Inner Glow
      for (let r = 0; r < 200; r += 20) {
        p.fill(63, 81, 181, p.map(r, 0, 200, 25, 0));
        p.ellipse(mX, mY, r);
      }
    }

    class Node {
      constructor(p) {
        this.p = p;
        this.pos = p.createVector(p.random(p.width), p.random(p.height));
        this.vel = p.createVector(p.random(-0.4, 0.4), p.random(-0.4, 0.4));
        this.size = p.random(2, 4);
      }

      update() {
        this.pos.add(this.vel);

        // Gentle Bounce
        if (this.pos.x < 0 || this.pos.x > this.p.width) this.vel.x *= -1;
        if (this.pos.y < 0 || this.pos.y > this.p.height) this.vel.y *= -1;

        // Interaction with mouse: nodes move away slightly
        let mouse = this.p.createVector(this.p.mouseX, this.p.mouseY);
        let dir = p5.Vector.sub(this.pos, mouse);
        let dist = dir.mag();
        if (dist < 150) {
          let force = this.p.map(dist, 0, 150, 1, 0);
          dir.setMag(force);
          this.pos.add(dir);
        }
      }

      display() {
        this.p.noStroke();
        this.p.fill(255, 255, 255, 180);
        this.p.ellipse(this.pos.x, this.pos.y, this.size);
      }
    }

    p.windowResized = function() {
      const container = document.getElementById("hero-canvas-container");
      if (container) p.resizeCanvas(container.offsetWidth, container.offsetHeight);
    };
  });
}