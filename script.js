document.addEventListener('DOMContentLoaded', () => {
    // 1. Inicializa os ícones do Lucide
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }

    // 2. Menu Mobile Toggle
    const menuBtn = document.getElementById('menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    const mobileLinks = document.querySelectorAll('.mobile-link');

    if (menuBtn && mobileMenu) {
        menuBtn.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden');
        });

        // Esconde o menu mobile ao clicar em um link
        mobileLinks.forEach(link => {
            link.addEventListener('click', () => {
                mobileMenu.classList.add('hidden');
            });
        });
    }

    // 3. Accordion FAQ
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(item => {
        item.addEventListener('click', () => {
            const answer = item.querySelector('.faq-answer');
            const icon = item.querySelector('.faq-icon');

            if (answer) {
                answer.classList.toggle('hidden');
            }

            if (icon) {
                icon.classList.toggle('rotate-180');
            }
        });
    });

    // 4. Tratamento do Formulário de Contato via API Web3Forms (AJAX)
    const contactForm = document.getElementById('contact-form');
    const formResult = document.getElementById('form-result');
    const submitBtn = document.getElementById('submit-btn');

    if (contactForm) {
        contactForm.addEventListener('submit', async function(e) {
            e.preventDefault(); // Impede o envio tradicional e o redirecionamento
            
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<span>Enviando mensagem...</span>';
            formResult.classList.add('hidden');

            const formData = new FormData(contactForm);
            const object = Object.fromEntries(formData);
            
            // Chaves do Web3Forms
            object.access_key = "bcb0569a-20e0-414e-97b6-e32cbe993a9e";
            object.subject = "Novo Contato via Site PJF.tech";

            try {
                const response = await fetch('https://api.web3forms.com/submit', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                    body: JSON.stringify(object)
                });

                const res = await response.json();

                if (response.status === 200 || res.success) {
                    formResult.className = "text-center text-sm font-medium py-3 px-4 rounded-lg text-emerald-400 bg-emerald-500/10";
                    formResult.innerHTML = "✨ Solicitação enviada com sucesso! Entraremos em contato em breve.";
                    contactForm.reset();
                } else {
                    formResult.className = "text-center text-sm font-medium py-3 px-4 rounded-lg text-red-400 bg-red-500/10";
                    formResult.innerHTML = res.message || "Ocorreu um erro ao enviar. Tente novamente.";
                }
            } catch (error) {
                console.error("Erro no envio:", error);
                formResult.className = "text-center text-sm font-medium py-3 px-4 rounded-lg text-red-400 bg-red-500/10";
                formResult.innerHTML = "Algo deu errado. Verifique sua conexão e tente novamente.";
            } finally {
                submitBtn.disabled = false;
                submitBtn.innerHTML = '<span>Solicitar Orçamento</span>';
                
                // Oculta a mensagem após 6 segundos
                setTimeout(() => {
                    formResult.classList.add('hidden');
                }, 6000);
            }
        });
    }

    // 5. Filtro Interativo do Portfólio
    const filterBtns = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');

    if (filterBtns.length > 0) {
        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                // Remove estado ativo de todos os botões
                filterBtns.forEach(b => {
                    b.classList.remove('active', 'bg-gradient-to-r', 'from-brandPrimary', 'to-brandSecondary', 'text-white');
                    b.classList.add('bg-darkCard', 'text-gray-400');
                });
                
                // Ativa o botão selecionado
                btn.classList.add('active', 'bg-gradient-to-r', 'from-brandPrimary', 'to-brandSecondary', 'text-white');
                btn.classList.remove('bg-darkCard', 'text-gray-400');

                const filter = btn.getAttribute('data-filter');

                // Exibe/oculta os cards
                projectCards.forEach(card => {
                    if (filter === 'todos' || card.getAttribute('data-category') === filter) {
                        card.style.display = 'block';
                    } else {
                        card.style.display = 'none';
                    }
                });

                // Atualiza os ícones do Lucide caso haja ícones carregados dinamicamente
                if (typeof lucide !== 'undefined') {
                    lucide.createIcons();
                }
            });
        });
    }
});
