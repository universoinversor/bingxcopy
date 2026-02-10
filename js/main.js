document.addEventListener('DOMContentLoaded', () => {
    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });

    // ---------------------------------------------------------
    // PROFIT CALCULATOR LOGIC
    // ---------------------------------------------------------
    function updateCalculator(desktop) {
        const idSuffix = desktop ? '' : '-mobile';
        const range = document.getElementById(`investment-range${idSuffix}`);
        const valDisplay = document.getElementById(`investment-val${idSuffix}`);
        const roiDisplay = document.getElementById(`roi-val${idSuffix}`);
        const totalDisplay = document.getElementById(desktop ? `roi-total` : `roi-annual-mobile`);

        if (!range) return;

        range.addEventListener('input', (e) => {
            const investment = parseInt(e.target.value);
            valDisplay.textContent = investment.toLocaleString();

            // Logic: 20% Monthly ROI
            const monthlyProfit = Math.floor(investment * 0.20);
            roiDisplay.textContent = monthlyProfit.toLocaleString();

            // Logic: Annual with Compound Interest (Simple estimation ~8.9x for 20% * 12 mos)
            // Using a conservative 8x multiplier for demo purposes to avoid unbelievable numbers
            const annualTotal = Math.floor(investment * 8.91);
            totalDisplay.textContent = annualTotal.toLocaleString();
        });
    }

    updateCalculator(true);  // Desktop
    updateCalculator(false); // Mobile

    // ---------------------------------------------------------
    // EMAIL FORM HANDLING
    // ---------------------------------------------------------
    // ---------------------------------------------------------
    // EMAIL FORM HANDLING (AJAX)
    // ---------------------------------------------------------
    const signupForm = document.querySelector('.signup-form');
    if (signupForm) {
        signupForm.addEventListener('submit', async function (e) {
            e.preventDefault();

            const form = e.target;
            const btn = form.querySelector('button');
            const emailInput = form.querySelector('input[name="email"]');
            const originalBtnText = btn.innerHTML;
            const statusMsg = form.querySelector('.form-note');

            // 1. Get the Formspree ID from the action attribute
            const formAction = form.getAttribute('action');

            // Check if user updated the ID
            if (formAction.includes('TU_ID_DE_FORMSPREE')) {
                alert('⚠️ ¡Atención! Necesitas poner tu ID de Formspree en el archivo index.html para que esto funcione.');
                return;
            }

            // 2. UI Loading State
            btn.innerHTML = '🔄 Enviando...';
            btn.style.opacity = '0.7';
            btn.disabled = true;

            // 3. Prepare Data
            const data = new FormData(event.target);

            try {
                // 4. Send to Formspree via AJAX
                const response = await fetch(formAction, {
                    method: form.method,
                    body: data,
                    headers: {
                        'Accept': 'application/json'
                    }
                });

                if (response.ok) {
                    // 5. Success State
                    btn.innerHTML = '✅ ¡Enviado Exitosamente!';
                    btn.style.background = '#00ff88';
                    btn.style.color = '#000';
                    btn.style.boxShadow = '0 0 20px #00ff88';
                    emailInput.value = ''; // Clear input
                    statusMsg.textContent = "¡Gracias! Revisa tu correo pronto.";
                    statusMsg.style.color = '#00ff88';

                    // Celebration effect
                    createConfetti(btn);
                } else {
                    // Error from Formspree
                    const errorData = await response.json();
                    btn.innerHTML = '❌ Error';
                    statusMsg.textContent = "Hubo un problema. Intenta de nuevo.";
                    console.error('Formspree Error:', errorData);

                    setTimeout(() => {
                        btn.innerHTML = originalBtnText;
                        btn.disabled = false;
                    }, 3000);
                }
            } catch (error) {
                // Network Error
                btn.innerHTML = '❌ Error de Conexión';
                statusMsg.textContent = "Revisa tu internet.";
                console.error('Network Error:', error);

                setTimeout(() => {
                    btn.innerHTML = originalBtnText;
                    btn.disabled = false;
                    btn.style.opacity = '1';
                }, 3000);
            }
        });
    }

    // Confetti Helper
    function createConfetti(element) {
        const rect = element.getBoundingClientRect();
        const center = { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };

        for (let i = 0; i < 30; i++) {
            const particle = document.createElement('span');
            particle.classList.add('cursor-particle'); // Reuse logic
            particle.innerText = ['🎉', '✉️', '🚀'][Math.floor(Math.random() * 3)];
            particle.style.left = center.x + 'px';
            particle.style.top = center.y + 'px';

            const tx = (Math.random() - 0.5) * 100;
            const ty = (Math.random() - 0.5) * 100;

            particle.style.setProperty('--tx', `${tx}px`);
            particle.style.setProperty('--ty', `${ty}px`);

            document.body.appendChild(particle);
            setTimeout(() => particle.remove(), 1000);
        }
    }

    // FAQ Accordion
    document.querySelectorAll('.faq-question').forEach(button => {
        button.addEventListener('click', () => {
            const answer = button.nextElementSibling;
            button.classList.toggle('active');

            if (button.classList.contains('active')) {
                answer.style.maxHeight = answer.scrollHeight + 'px';
            } else {
                answer.style.maxHeight = 0;
            }
        });
    });

    // Dynamic User Counter Simulation
    const userCountElement = document.getElementById('user-count');
    if (userCountElement) {
        let count = 5243;

        // Randomly increase count every few seconds
        setInterval(() => {
            if (Math.random() > 0.6) {
                const increase = Math.floor(Math.random() * 3) + 1;
                count += increase;
                userCountElement.textContent = count.toLocaleString();

                // Add quick highlight effect
                userCountElement.style.color = '#fff';
                setTimeout(() => {
                    userCountElement.style.color = ''; // Revert to CSS default (or inherit)
                }, 300);
            }
        }, 3000);
    }

    // Scroll Observer for Animations
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    });

    // ---------------------------------------------------------
    // CURSOR PARTICLE TRAIL
    // ---------------------------------------------------------
    const emojis = ['₿', '🚀', '💎', '🌙', '💰', 'Ξ', '📈'];
    let lastParticleTime = 0;

    document.addEventListener('mousemove', (e) => {
        const now = Date.now();
        // Throttle: Only create particle every 50ms
        if (now - lastParticleTime < 50) return;

        lastParticleTime = now;
        createParticle(e.pageX, e.pageY);
    });

    function createParticle(x, y) {
        const particle = document.createElement('span');
        particle.classList.add('cursor-particle');

        // Random emoji
        particle.innerText = emojis[Math.floor(Math.random() * emojis.length)];

        // Position
        particle.style.left = `${x}px`;
        particle.style.top = `${y}px`;

        // Random movement direction
        const tx = (Math.random() - 0.5) * 50; // -25px to +25px
        const ty = 20 + Math.random() * 50;    // +20px to +70px (Down/Gravity)

        particle.style.setProperty('--tx', `${tx}px`);
        particle.style.setProperty('--ty', `${ty}px`);

        document.body.appendChild(particle);

        // Cleanup
        setTimeout(() => {
            particle.remove();
        }, 1000);
    }

    document.querySelectorAll('.prop-card, .step-item, .float-card, .profit-calculator, .trader-card').forEach((el) => {
        observer.observe(el);
    });

    // ---------------------------------------------------------
    // COPY TRADER SIMULATION
    // ---------------------------------------------------------
    document.querySelectorAll('.copy-btn').forEach(btn => {
        btn.addEventListener('click', function (e) {
            e.preventDefault();
            const originalText = this.innerHTML;

            // Loading state
            this.innerHTML = 'Conectando...';
            this.style.opacity = '0.7';

            setTimeout(() => {
                // Redirect logic would go here
                // For demo, show success then revert or redirect
                this.innerHTML = '¡Redirigiendo!';
                this.style.background = '#00ff88';
                this.style.color = '#000';
                this.style.borderColor = '#00ff88';

                setTimeout(() => {
                    window.location.href = "https://bingxdao.com/invite/GZ1CEV";
                }, 800);
            }, 600);
        });
    });
});
