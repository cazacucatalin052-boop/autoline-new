/* ================================================
   AutoLine Auto Services - script.js
   JavaScript principal: bule, navbar, formulare
   Autor: Cazacu Cătălin — DAW-251
================================================ */

// =============================================
// 1. BULE ANIMATE PE CANVAS (fundal)
// Desenăm cercuri care plutesc și se conectează
// =============================================
(function() {
  const canvas = document.getElementById('bubblesCanvas');
  if (!canvas) return; // Dacă nu există canvas, iese din funcție

  const ctx = canvas.getContext('2d'); // Contextul 2D pentru desen
  let bubbles = []; // Array cu toate bulele
  const BUBBLE_COUNT = 60; // Numărul de bule simultan

  // Setăm dimensiunea canvas la dimensiunea ferestrei
  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas); // Reia dimensiunea la resize

  // Clasa Bubble — fiecare bulă are proprietăți individuale
  class Bubble {
    constructor() {
      this.reset(); // Inițializare
    }

    reset() {
      // Poziție aleatorie
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      // Raza între 2 și 6 pixeli
      this.radius = Math.random() * 4 + 2;
      // Viteză mică (0.2 - 0.7) pe ambele axe
      this.vx = (Math.random() - 0.5) * 0.5;
      this.vy = (Math.random() - 0.5) * 0.5;
      // Opacitate aleatorie
      this.alpha = Math.random() * 0.4 + 0.1;
      // Culoare: roșu sau gri (proporție 30/70)
      this.color = Math.random() > 0.7
        ? `rgba(229,25,43,${this.alpha})`   // Roșu (30%)
        : `rgba(255,255,255,${this.alpha})`; // Alb/gri (70%)
    }

    // Mișcă bula
    update() {
      this.x += this.vx;
      this.y += this.vy;

      // Dacă iese din ecran, o repoziționăm
      if (this.x < 0 || this.x > canvas.width ||
          this.y < 0 || this.y > canvas.height) {
        this.reset();
      }
    }

    // Desenează bula pe canvas
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = this.color;
      ctx.fill();
    }
  }

  // Creăm toate bulele
  for (let i = 0; i < BUBBLE_COUNT; i++) {
    bubbles.push(new Bubble());
  }

  // Desenează linii de conexiune între bulele apropiate
  function drawConnections() {
    const maxDist = 120; // Distanța maximă pentru conexiune
    for (let i = 0; i < bubbles.length; i++) {
      for (let j = i + 1; j < bubbles.length; j++) {
        const dx = bubbles[i].x - bubbles[j].x;
        const dy = bubbles[i].y - bubbles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < maxDist) {
          // Opacitatea liniei scade cu distanța
          const alpha = (1 - dist / maxDist) * 0.08;
          ctx.beginPath();
          ctx.moveTo(bubbles[i].x, bubbles[i].y);
          ctx.lineTo(bubbles[j].x, bubbles[j].y);
          ctx.strokeStyle = `rgba(229,25,43,${alpha})`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }
    }
  }

  // Bucla principală de animație — apelată la fiecare frame (60fps)
  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Șterge frame-ul anterior

    // Actualizează și desenează fiecare bulă
    bubbles.forEach(b => {
      b.update();
      b.draw();
    });

    drawConnections(); // Desenează conexiunile
    requestAnimationFrame(animate); // Solicită următorul frame
  }

  animate(); // Pornește animația
})();


// =============================================
// 2. NAVBAR — scroll + hamburger mobil
// =============================================
(function() {
  const navbar = document.getElementById('navbar');
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('navLinks');

  // Adaugă clasa 'scrolled' după ce userul scrollează 50px
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });

  // Toggle meniu mobil la click pe hamburger
  if (hamburger) {
    hamburger.addEventListener('click', () => {
      navLinks.classList.toggle('open');
    });
  }

  // Închide meniul mobil la click pe un link
  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
    });
  });
})();


// =============================================
// 3. FORMULAR PROGRAMARE — salvare în localStorage
// Datele rămân stocate local pentru pagina Admin
// =============================================
(function() {
  const form = document.getElementById('bookingForm');
  if (!form) return; // Există doar pe pagina programare.html

  form.addEventListener('submit', function(e) {
    e.preventDefault(); // Previne refresh-ul paginii

    // Citim valorile câmpurilor
    const data = {
      id: Date.now(), // ID unic bazat pe timestamp
      name:    form.querySelector('#clientName').value.trim(),
      phone:   form.querySelector('#clientPhone').value.trim(),
      email:   form.querySelector('#clientEmail').value.trim(),
      car:     form.querySelector('#carBrand').value.trim(),
      plate:   form.querySelector('#carPlate').value.trim(),
      service: form.querySelector('#serviceType').value,
      date:    form.querySelector('#appointmentDate').value,
      time:    form.querySelector('#appointmentTime').value,
      notes:   form.querySelector('#notes').value.trim(),
      status:  'pending', // Status inițial: în așteptare
      createdAt: new Date().toLocaleString('ro-RO')
    };

    // Validare de bază — câmpuri obligatorii
    if (!data.name || !data.phone || !data.car || !data.service || !data.date || !data.time) {
      alert('Te rugăm să completezi toate câmpurile obligatorii!');
      return;
    }

    // Luăm programările existente din localStorage (sau array gol)
    const bookings = JSON.parse(localStorage.getItem('autoline_bookings') || '[]');
    bookings.push(data); // Adăugăm noua programare
    localStorage.setItem('autoline_bookings', JSON.stringify(bookings)); // Salvăm înapoi

    // Afișăm mesajul de succes
    const successMsg = document.getElementById('successMsg');
    if (successMsg) {
      successMsg.classList.add('show');
      successMsg.innerHTML = `<i class="fas fa-check-circle"></i> Programarea ta a fost înregistrată, ${data.name}! Te vom contacta la numărul ${data.phone}.`;
    }

    form.reset(); // Resetăm formularul

    // Scrollăm la mesajul de succes
    successMsg.scrollIntoView({ behavior: 'smooth', block: 'center' });
  });
})();


// =============================================
// 4. FORMULAR CONTACT — trimitere mesaj
// =============================================
(function() {
  const contactForm = document.getElementById('contactForm');
  if (!contactForm) return;

  contactForm.addEventListener('submit', function(e) {
    e.preventDefault();

    const name = document.getElementById('contactName').value.trim();

    // Mesaj de succes simplu
    const successMsg = document.getElementById('contactSuccess');
    if (successMsg) {
      successMsg.classList.add('show');
      successMsg.textContent = `Mulțumim, ${name}! Mesajul tău a fost trimis. Te vom contacta în curând.`;
    }
    contactForm.reset();
  });
})();


// =============================================
// 5. ANIMAȚII LA SCROLL (fade-in carduri)
// Cardurile apar treptat când intră în viewport
// =============================================
(function() {
  // Selectăm toate elementele cu atribut data-aos
  const elements = document.querySelectorAll('[data-aos]');
  if (!elements.length) return;

  // CSS inline pentru starea inițială (invizibil + deplasat în jos)
  elements.forEach((el, i) => {
    const delay = el.getAttribute('data-delay') || 0;
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = `opacity 0.6s ease ${delay}ms, transform 0.6s ease ${delay}ms`;
  });

  // Intersection Observer — observă când elementele intră în viewport
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // Animăm elementul când devine vizibil
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        observer.unobserve(entry.target); // Nu mai observăm după ce a apărut
      }
    });
  }, { threshold: 0.1 }); // Se declanșează când 10% din element e vizibil

  elements.forEach(el => observer.observe(el));
})();


// =============================================
// 6. COUNTER ANIMAT (pentru secțiunea statistici)
// Numerele cresc de la 0 la valoarea finală
// =============================================
(function() {
  const counters = document.querySelectorAll('.counter');
  if (!counters.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseInt(el.getAttribute('data-target')); // Valoarea finală
        const duration = 2000; // 2 secunde
        const step = target / (duration / 16); // Pasul per frame (60fps ≈ 16ms)
        let current = 0;

        const timer = setInterval(() => {
          current += step;
          if (current >= target) {
            current = target;
            clearInterval(timer);
          }
          el.textContent = Math.floor(current).toLocaleString();
        }, 16);

        observer.unobserve(el);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(c => observer.observe(c));
})();