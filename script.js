document.addEventListener('DOMContentLoaded', () => {
    // Inicialização dos ícones Lucide
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }

    // Menu Mobile
    const menuBtn = document.getElementById('menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    const mobileLinks = document.querySelectorAll('.mobile-link');

    if (menuBtn && mobileMenu) {
        menuBtn.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden');
        });

        mobileLinks.forEach(link => {
            link.addEventListener('click', () => {
                mobileMenu.classList.add('hidden');
            });
        });
    }

    // Accordion FAQ
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        item.addEventListener('click', () => {
            const answer = item.querySelector('.faq-answer');
            const icon = item.querySelector('.faq-icon');
            if (answer) answer.classList.toggle('hidden');
            if (icon) icon.classList.toggle('rotate-180');
        });
    });

    // Envio do Formulário Web3Forms via Fetch API
    const contactForm = document.getElementById('contact-form');
    const formResult = document.getElementById('form-result');
    const submitBtn = document.getElementById('submit-btn');

    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();

            // Altera estado do botão
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<span>Enviando...</span>';

            // Prepara os dados
            const formData = new FormData(contactForm);

            fetch('https://api.web3forms.com/submit', {
                method: 'POST',
                body: formData
            })
            .then(async (response) => {
                let json = await response.json();
                formResult.classList.remove('hidden');

                if (response.status === 200) {
                    formResult.className = "text-center text-sm font-medium py-3 px-4 rounded-lg text-emerald-400 bg-emerald-500/10";
                    formResult.innerHTML = "✨ Mensagem enviada com sucesso! Entraremos em contato.";
                    contactForm.reset();
                } else {
                    formResult.className = "text-center text-sm font-medium py-3 px-4 rounded-lg text-red-400 bg-red-500/10";
                    formResult.innerHTML = json.message || "Erro ao enviar mensagem.";
                }
            })
            .catch(error => {
                console.error(error);
                formResult.classList.remove('hidden');
                formResult.className = "text-center text-sm font-medium py-3 px-4 rounded-lg text-red-400 bg-red-500/10";
                formResult.innerHTML = "Algo deu errado! Verifique sua conexão e tente novamente.";
            })
            .then(() => {
                // Restaura o botão
                submitBtn.disabled = false;
                submitBtn.innerHTML = '<span>Solicitar Orçamento</span>';

                // Oculta a mensagem após 6 segundos
                setTimeout(() => {
                    formResult.classList.add('hidden');
                }, 6000);
            });
        });
    }
});
