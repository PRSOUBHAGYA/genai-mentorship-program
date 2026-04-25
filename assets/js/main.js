document.addEventListener('DOMContentLoaded', () => {
    console.log('GenAI Mentorship Page Loaded');

    // --- Interactive Dots Background ---
    const canvas = document.getElementById('dots-canvas');
    const ctx = canvas.getContext('2d');
    let particles = [];
    const particleCount = 100;
    const connectionDistance = 150;
    const mouseRepelRadius = 150;
    const mouseRepelStrength = 0.5;

    let mouse = { x: null, y: null };

    function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }

    window.addEventListener('resize', resize);
    window.addEventListener('mousemove', (e) => {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
    });

    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.vx = (Math.random() - 0.5) * 0.5;
            this.vy = (Math.random() - 0.5) * 0.5;
            this.radius = 2;
            this.baseX = this.x;
            this.baseY = this.y;
        }

        update() {
            // Gentle movement
            this.x += this.vx;
            this.y += this.vy;

            if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
            if (this.y < 0 || this.y > canvas.height) this.vy *= -1;

            // Mouse Repel Effect
            if (mouse.x !== null) {
                const dx = mouse.x - this.x;
                const dy = mouse.y - this.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                if (distance < mouseRepelRadius) {
                    const force = (mouseRepelRadius - distance) / mouseRepelRadius;
                    const angle = Math.atan2(dy, dx);
                    this.x -= Math.cos(angle) * force * 5;
                    this.y -= Math.sin(angle) * force * 5;
                }
            }
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(37, 99, 235, 0.5)'; // blue-600
            ctx.fill();
        }
    }

    function init() {
        resize();
        particles = [];
        for (let i = 0; i < particleCount; i++) {
            particles.push(new Particle());
        }
    }

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        for (let i = 0; i < particles.length; i++) {
            particles[i].update();
            particles[i].draw();

            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < connectionDistance) {
                    ctx.beginPath();
                    ctx.strokeStyle = `rgba(37, 99, 235, ${1 - distance / connectionDistance})`;
                    ctx.lineWidth = 0.5;
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.stroke();
                }
            }
        }
        requestAnimationFrame(animate);
    }

    init();
    animate();

    // --- Dynamic Form Fields for Professional Occupation ---
    const statusSelect = document.getElementById('status-select');
    const dynamicFieldsContainer = document.getElementById('dynamic-fields');

    if (statusSelect) {
        statusSelect.addEventListener('change', (e) => {
            const selected = e.target.value;
            dynamicFieldsContainer.innerHTML = '';

            if (selected === 'professional') {
                const div = document.createElement('div');
                div.className = 'flex flex-col';
                div.innerHTML = `
                    <label class="block text-sm font-semibold text-slate-700 mb-2">Current Occupation</label>
                    <input type="text" name="occupation" required placeholder="e.g. Marketing Manager, Software Engineer"
                           class="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition outline-none">
                `;
                dynamicFieldsContainer.appendChild(div);
            }
        });
    }

    const form = document.querySelector('form');
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();

            // --- Form Validation ---
            const formData = new FormData(form);
            const data = {};
            let isValid = true;
            let errorMessage = '';

            formData.forEach((value, key) => {
                data[key] = value;
            });

            // Name Validation: Non-empty and at least 2 characters
            if (!data.name || data.name.trim().length < 2) {
                isValid = false;
                errorMessage = 'Please enter a valid full name.';
            }
            // Email Validation: Basic email regex
            else if (!data.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
                isValid = false;
                errorMessage = 'Please enter a valid email address.';
            }
            // Phone Validation: Basic phone regex (minimum 10 digits)
            else if (!data.phone || !/^\+?[\d\s-]{10,}$/.test(data.phone)) {
                isValid = false;
                errorMessage = 'Please enter a valid phone number (min 10 digits).';
            }
            // Status Validation
            else if (!data.status) {
                isValid = false;
                errorMessage = 'Please select your professional status.';
            }
            // Occupation Validation (only if professional is selected)
            else if (data.status === 'professional' && (!data.occupation || data.occupation.trim().length < 2)) {
                isValid = false;
                errorMessage = 'Please enter your current occupation.';
            }

            if (!isValid) {
                alert(errorMessage);
                return;
            }

            const btn = form.querySelector('button');
            // Save enrollment data to localStorage
            localStorage.setItem('pending_enrollment', JSON.stringify(data));

            if (btn) {
                btn.innerText = 'Redirecting to Payment...';
                btn.disabled = true;
                btn.classList.add('opacity-70', 'cursor-not-allowed');
            }

            // Redirect directly to payment page without submitting to Formspree yet
            window.location.href = 'https://rzp.io/rzp/qXpPQjOx';
        });
    }

});
