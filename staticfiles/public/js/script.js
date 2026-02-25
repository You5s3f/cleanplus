// Menu mobile
document.addEventListener('DOMContentLoaded', function() {
    // Toggle menu mobile
    const menuToggle = document.querySelector('.menu-toggle');
    const navbar = document.querySelector('.navbar');
    
    if (menuToggle) {
        menuToggle.addEventListener('click', function() {
            navbar.classList.toggle('active');
            const icon = this.querySelector('i');
            if (navbar.classList.contains('active')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });
    }
    
    // Fermer le menu en cliquant sur un lien
    const navLinks = document.querySelectorAll('.navbar a');
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            if (navbar.classList.contains('active')) {
                navbar.classList.remove('active');
                const icon = menuToggle.querySelector('i');
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });
    });
    
    // Gestion du formulaire de devis
    const quoteForm = document.getElementById('quoteForm');
    if (quoteForm) {
        quoteForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Récupération des valeurs du formulaire
            const firstName = document.getElementById('firstName').value;
            const phone = document.getElementById('phone').value;
            
            // Affichage du message de confirmation
            document.getElementById('confirmName').textContent = firstName;
            document.getElementById('confirmPhone').textContent = phone;
            
            // Masquer le formulaire et afficher la confirmation
            quoteForm.style.display = 'none';
            document.getElementById('confirmationMessage').style.display = 'block';
            
            // Défilement vers le message de confirmation
            document.getElementById('confirmationMessage').scrollIntoView({ behavior: 'smooth' });
            
            // Ici, normalement, on enverrait les données au serveur
            console.log('Formulaire soumis:', {
                firstName: firstName,
                lastName: document.getElementById('lastName').value,
                email: document.getElementById('email').value,
                phone: phone,
                // ... autres champs
            });
        });
    }
    
    // Gestion du formulaire de contact
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Masquer le formulaire et afficher la confirmation
            contactForm.style.display = 'none';
            document.getElementById('contactConfirmation').style.display = 'block';
            
            // Défilement vers le message de confirmation
            document.getElementById('contactConfirmation').scrollIntoView({ behavior: 'smooth' });
            
            // Ici, normalement, on enverrait les données au serveur
            console.log('Formulaire de contact soumis');
        });
    }
    
    // Date minimale pour les champs date (demain)
    const dateInput = document.getElementById('preferredDate');
    if (dateInput) {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        const formattedDate = tomorrow.toISOString().split('T')[0];
        dateInput.min = formattedDate;
    }
    
    // Animation au défilement
    function animateOnScroll() {
        const elements = document.querySelectorAll('.service-card, .feature, .testimonial');
        
        elements.forEach(element => {
            const elementPosition = element.getBoundingClientRect().top;
            const screenPosition = window.innerHeight / 1.2;
            
            if (elementPosition < screenPosition) {
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }
        });
    }
    
    // Initialiser les animations
    const animatedElements = document.querySelectorAll('.service-card, .feature, .testimonial');
    animatedElements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';
        element.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    });
    
    window.addEventListener('scroll', animateOnScroll);
    // Déclencher une première fois au chargement
    animateOnScroll();
});