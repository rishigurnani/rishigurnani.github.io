// js/manim-animation.js

function initAnimation() {
  new p5(function(p) {
    // Use local variables inside the instance instead of globals.
    let angle = 0;
    const sides = 6; // Number of sides for the polygon

    p.setup = function() {
      // Get the container element from the DOM.
      const container = document.getElementById('hero-canvas-container');
      if (!container) {
        console.error("Hero canvas container not found!");
        return;
      }
      const w = container.offsetWidth;
      const h = container.offsetHeight;
      // Create a canvas that fills the container and attach it.
      const canvas = p.createCanvas(w, h);
      canvas.parent(container);
      p.angleMode(p.RADIANS);
      p.noFill();
      p.frameRate(30); // Cap the frame rate for smoother performance
    };

    p.draw = function() {
      // Clear background.
      p.background(20, 20, 30, 50); // Add some transparency for trails
      // Translate to the center of the canvas.
      p.translate(p.width / 2, p.height / 2);

      // Use a base radius relative to the canvas size (20% of the smaller dimension).
      const baseRadius = p.min(p.width, p.height) * 0.2;
      // Create a pulsating effect.
      const radius = baseRadius + 30 * p.sin(p.frameCount * 0.02);

      // Draw a rotating polygon.
      p.strokeWeight(2);
      p.stroke(100, 200, 255);
      p.beginShape();
      for (let i = 0; i < sides; i++) {
        const a = angle + p.TWO_PI * i / sides;
        const x = radius * p.cos(a);
        const y = radius * p.sin(a);
        p.vertex(x, y);
      }
      p.endShape(p.CLOSE);

      // Draw dynamic lines from the center to each vertex.
      p.strokeWeight(1);
      for (let i = 0; i < sides; i++) {
        const a = angle + p.TWO_PI * i / sides;
        const x = radius * p.cos(a);
        const y = radius * p.sin(a);
        p.stroke(200, 100, 255, 150);
        p.line(0, 0, x, y);
      }

      // Draw an animated outer circle with changing color.
      p.strokeWeight(3);
      const outerRadius = radius + 50 + 10 * p.cos(p.frameCount * 0.05);
      const r = p.map(p.sin(p.frameCount * 0.03), -1, 1, 100, 255);
      const g = p.map(p.cos(p.frameCount * 0.04), -1, 1, 100, 255);
      p.stroke(r, g, 200);
      p.ellipse(0, 0, outerRadius * 2);

      // Update the rotation angle.
      angle += 0.01;
    };

    // Ensure the canvas resizes when the window is resized.
    p.windowResized = function() {
      const container = document.getElementById('hero-canvas-container');
      if (container) {
        p.resizeCanvas(container.offsetWidth, container.offsetHeight);
      }
    };
  });
}
