// GSAP Animations for Phantom Sight

document.addEventListener("DOMContentLoaded", () => {
    // 1. Initial Page Load Animation
    // We create a GSAP Timeline (a sequence of animations)
    const tl = gsap.timeline();

    // Set initial states before animating
    gsap.set(".logo-fixed", { opacity: 0, y: -20 });
    gsap.set("#screen-question .statement", { opacity: 0, y: 30, filter: "blur(10px)" });
    gsap.set("#screen-question .sep", { width: 0, opacity: 0 });
    gsap.set("#screen-question .q-field", { opacity: 0, y: 20 });
    gsap.set("#screen-question .btn", { opacity: 0, scale: 0.9 });

    // Build the timeline sequence
    tl.to(".logo-fixed", { opacity: 1, y: 0, duration: 1.5, ease: "power2.out" })
      .to("#screen-question .statement", { opacity: 0.75, y: 0, filter: "blur(0px)", duration: 2, ease: "power3.out" }, "-=0.5")
      .to("#screen-question .sep", { width: 44, opacity: 1, duration: 1, ease: "power2.inOut" }, "-=1")
      .to("#screen-question .q-field", { opacity: 1, y: 0, duration: 1, stagger: 0.2, ease: "power2.out" }, "-=0.5")
      .to("#screen-question .btn", { opacity: 0.85, scale: 1, duration: 1, ease: "back.out(1.7)" }, "-=0.2");

    // Generate Floating Objects in the background
    const floatingContainer = document.getElementById("floating-objects");
    for (let i = 0; i < 15; i++) {
        const obj = document.createElement("div");
        obj.className = "float-obj";
        
        // Randomize size, position, and duration
        const size = Math.random() * 40 + 10;
        const startX = Math.random() * window.innerWidth;
        const startY = Math.random() * window.innerHeight;
        
        obj.style.width = `${size}px`;
        obj.style.height = `${size}px`;
        obj.style.left = `${startX}px`;
        obj.style.top = `${startY}px`;
        // Randomly rotate some
        obj.style.transform = `rotate(${Math.random() * 360}deg)`;
        
        floatingContainer.appendChild(obj);

        // Animate them floating around indefinitely
        gsap.to(obj, {
            x: `+=${Math.random() * 100 - 50}`,
            y: `+=${Math.random() * 100 - 50}`,
            rotation: `+=${Math.random() * 90 - 45}`,
            opacity: Math.random() * 0.4 + 0.1,
            duration: Math.random() * 10 + 10,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut"
        });
    }
});

// We can export or attach a function to trigger animations for other screens when they become active.
window.animateScreenRitual = () => {
    const tl = gsap.timeline();
    gsap.set("#screen-ritual .eyebrow", { opacity: 0, x: -20 });
    gsap.set("#screen-ritual .sep", { width: 0, opacity: 0 });
    gsap.set("#screen-ritual .response-block", { opacity: 0, y: 20 });
    gsap.set("#screen-ritual .btn", { opacity: 0, scale: 0.9 });

    tl.to("#screen-ritual .eyebrow", { opacity: 1, x: 0, duration: 1, stagger: 0.3, ease: "power2.out", delay: 0.5 })
      .to("#screen-ritual .sep", { width: 44, opacity: 1, duration: 1, ease: "power2.inOut" }, "-=0.5")
      .to("#screen-ritual .response-block", { opacity: 1, y: 0, duration: 1, ease: "power2.out" }, "-=0.5")
      .to("#screen-ritual .btn", { opacity: 0.85, scale: 1, duration: 1, ease: "back.out(1.7)" }, "-=0.2");
};

window.animateScreenLoader = () => {
    const tl = gsap.timeline();
    gsap.set("#screen-loader .loader-dot", { opacity: 0, scale: 0 });
    gsap.set("#screen-loader .loader-text", { opacity: 0, y: 10 });

    // Fade in text
    tl.to("#screen-loader .loader-text", { opacity: 1, y: 0, duration: 1, ease: "power2.out" })
      // Stagger dots bouncing in
      .to("#screen-loader .loader-dot", { 
          opacity: 1, 
          scale: 1, 
          duration: 0.5, 
          stagger: 0.15, 
          ease: "back.out(2)" 
      }, "-=0.5");

    // Continuous pulsing loop for the dots
    gsap.to("#screen-loader .loader-dot", {
        y: -10,
        opacity: 0.5,
        duration: 0.6,
        stagger: 0.15,
        repeat: -1,
        yoyo: true,
        ease: "power1.inOut",
        delay: 1.5 // Wait for intro animation to finish
    });
};

window.animateScreenComplete = () => {
    const tl = gsap.timeline();
    gsap.set("#screen-complete .eyebrow", { opacity: 0, y: -10 });
    gsap.set("#screen-complete .c-message", { opacity: 0, y: 10 });
    gsap.set("#screen-complete .btn", { opacity: 0, scale: 0.9 });

    // Note: The sigil has a CSS animation already, so we let that play and stagger the rest
    tl.to("#screen-complete .eyebrow", { opacity: 1, y: 0, duration: 1, ease: "power2.out", delay: 1.5 })
      .to("#screen-complete .c-message", { opacity: 1, y: 0, duration: 1, ease: "power2.out" }, "-=0.5")
      .to("#screen-complete .btn", { opacity: 0.85, scale: 1, duration: 1, ease: "back.out(1.7)" }, "-=0.2");
};
