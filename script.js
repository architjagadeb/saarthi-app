// Voice generation functionality (only for start-campaign page)
const generateVoiceBtn = document.getElementById("generate-voice-btn");
if (generateVoiceBtn) {
  generateVoiceBtn.addEventListener("click", async () => {
    const script = document.getElementById("voice-script").value.trim();
    const gender = document.getElementById("voice-gender").value;
    const language = document.getElementById("voice-language").value;
    const speed = document.getElementById("voice-speed").value;

    if (!script) return alert("Please enter a voice script.");

    const btn = document.getElementById("generate-voice-btn");
    btn.disabled = true;
    btn.textContent = "Generating...";

    try {
      const res = await fetch("/api/murf-generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ script, gender, language, speed })
      });

      const data = await res.json();
      if (data.audioUrl) {
        document.getElementById("audio-source").src = data.audioUrl;
        document.querySelector(".audio-player").load();
        document.getElementById("audio-preview").style.display = "block";
      } else {
        alert("No audio returned from server.");
      }
    } catch (err) {
      console.error(err);
      alert("Failed to generate voice.");
    } finally {
      btn.disabled = false;
      btn.textContent = "Generate Voice with Murf AI";
    }
  });
}

document.addEventListener('DOMContentLoaded', () => {
    // Slider
    const slides = document.querySelectorAll('.slide');
    const dots = document.querySelectorAll('.dot');
    let currentSlide = 0;
    const slideInterval = 3000; // 3 seconds

    function showSlide(index) {
        slides.forEach((slide, i) => {
            slide.style.opacity = i === index ? '1' : '0';
        });
        dots.forEach((dot, i) => {
            if (i === index) {
                dot.classList.add('bg-white');
                dot.classList.remove('bg-gray-400');
            } else {
                dot.classList.add('bg-gray-400');
                dot.classList.remove('bg-white');
            }
        });
        currentSlide = index;
    }

    function nextSlide() {
        const next = (currentSlide + 1) % slides.length;
        showSlide(next);
    }

    dots.forEach((dot, i) => {
        dot.addEventListener('click', () => {
            showSlide(i);
        });
    });

    setInterval(nextSlide, slideInterval);

  // Tooltip
  const tooltip = document.getElementById('tooltip');
  const paths = document.querySelectorAll("svg path");

  const stateData = {
    "Andhra Pradesh": "Andhra Pradesh – 8 campaigns",
    "Arunachal Pradesh": "Arunachal Pradesh – 2 campaigns",
    "Assam": "Assam – 6 campaigns",
    "Bihar": "Bihar – 12 campaigns",
    "Chhattisgarh": "Chhattisgarh – 4 campaigns",
    "Goa": "Goa – 1 campaign",
    "Gujarat": "Gujarat – 9 campaigns",
    "Haryana": "Haryana – 5 campaigns",
    "Himachal Pradesh": "Himachal Pradesh – 3 campaigns",
    "Jharkhand": "Jharkhand – 7 campaigns",
    "Karnataka": "Karnataka – 10 campaigns",
    "Kerala": "Kerala – 6 campaigns",
    "Madhya Pradesh": "Madhya Pradesh – 11 campaigns",
    "Maharashtra": "Maharashtra – 24 campaigns",
    "Manipur": "Manipur – 2 campaigns",
    "Meghalaya": "Meghalaya – 1 campaign",
    "Mizoram": "Mizoram – 1 campaign",
    "Nagaland": "Nagaland – 1 campaign",
    "Odisha": "Odisha – 8 campaigns",
    "Punjab": "Punjab – 5 campaigns",
    "Rajasthan": "Rajasthan – 9 campaigns",
    "Sikkim": "Sikkim – 1 campaign",
    "Tamil Nadu": "Tamil Nadu – 14 campaigns",
    "Telangana": "Telangana – 6 campaigns",
    "Tripura": "Tripura – 2 campaigns",
    "Uttar Pradesh": "Uttar Pradesh – 19 campaigns",
    "Uttarakhand": "Uttarakhand – 5 campaigns",
    "West Bengal": "West Bengal – 13 campaigns",
    "Delhi": "Delhi – 7 campaigns",
    "Jammu and Kashmir": "Jammu and Kashmir – 4 campaigns",
    "Ladakh": "Ladakh – 1 campaign",
    "Puducherry": "Puducherry – 1 campaign",
  };

  paths.forEach((path) => {
    const stateName = path.id;

    path.addEventListener('mouseover', (e) => {
      if (!tooltip) return;
      const info = stateData[stateName] || `${stateName} – No campaigns yet`;
      tooltip.innerText = info;
      tooltip.style.display = 'block';
    });

    path.addEventListener('mousemove', (e) => {
      if (!tooltip) return;
      tooltip.style.left = `${e.pageX + 15}px`;
      tooltip.style.top = `${e.pageY + 15}px`;
    });

    path.addEventListener('mouseout', () => {
      if (!tooltip) return;
      tooltip.style.display = 'none';
    });
  });

  // Other DOM-ready logic
  animateStats();
  initStatCardEffects();
});

// Stats Counter Animation
function animateStats() {
    const statNumbers = document.querySelectorAll('.stat-number');
    const statsSection = document.querySelector('.stats-section');

    const observerOptions = {
        threshold: 0.5,
        rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                statNumbers.forEach(stat => {
                    const target = parseInt(stat.getAttribute('data-target'));
                    const duration = 2000; // 2 seconds
                    const increment = target / (duration / 16); // 60fps
                    let current = 0;

                    const timer = setInterval(() => {
                        current += increment;
                        if (current >= target) {
                            current = target;
                            clearInterval(timer);
                        }
                        stat.textContent = Math.floor(current).toLocaleString();
                    }, 16);
                });

                // Trigger progress bar animations
                const progressBars = document.querySelectorAll('.progress-bar');
                progressBars.forEach((bar, index) => {
                    setTimeout(() => {
                        bar.style.width = '100%';
                    }, index * 200);
                });

                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    if (statsSection) {
        observer.observe(statsSection);
    }
}

// Enhanced hover effects for stat cards
function initStatCardEffects() {
    const statCards = document.querySelectorAll('.stat-card');

    statCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            // Add ripple effect
            const ripple = document.createElement('div');
            ripple.classList.add('ripple');
            card.appendChild(ripple);

            // Remove ripple after animation
            setTimeout(() => {
                if (ripple.parentNode) {
                    ripple.parentNode.removeChild(ripple);
                }
            }, 600);
        });

        // Add parallax effect on mouse move
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const rotateX = (y - centerY) / 10;
            const rotateY = (centerX - x) / 10;

            card.style.transform = `translateY(-15px) scale(1.05) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0) scale(1) rotateX(0deg) rotateY(0deg)';
        });
    });
}


