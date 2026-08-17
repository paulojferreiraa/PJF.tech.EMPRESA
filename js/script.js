// Inicializa ícones Lucide
lucide.createIcons();

// Menu Mobile Toggle
const menuBtn = document.getElementById('menu-btn');
const mobileMenu = document.getElementById('mobile-menu');
const mobileLinks = document.querySelectorAll('.mobile-link');

if (menuBtn) {
    menuBtn.addEventListener('click', () => {
        mobileMenu.classList.toggle('hidden');
    });
}

mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
        mobileMenu.classList.add('hidden');
    });
});

// Toggle Accordion FAQ
document.querySelectorAll('.faq-item').forEach(item => {
    item.addEventListener('click', () => {
        const answer = item.querySelector('.faq-answer');
        const icon = item.querySelector('.faq-icon');
        
        // Toggle resposta visível/oculta
        answer.classList.toggle('hidden');
        
        // Rotaciona o ícone
        if (icon) {
            icon.style.transform = answer.classList.contains('hidden') ? 'rotate(0deg)' : 'rotate(180deg)';
        }
    });
});

// Form Submission Handler (Web3Forms)
const contactForm = document.getElementById('contact-form');
const formResult = document.getElementById('form-result');
const submitBtn = document.getElementById('submit-btn');

if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        // Disable button e mostrar loading
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<span>Enviando...</span>';
        
        // Limpar mensagem anterior
        formResult.classList.add('hidden');
        
        try {
            // Converter FormData para JSON
            const formDataObj = new FormData(contactForm);
            const jsonData = Object.fromEntries(formDataObj);
            
            // Enviar para Web3Forms com JSON
            const response = await fetch('https://api.web3forms.com/submit', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(jsonData)
            });
            
            const data = await response.json();
            
            if (data.success) {
                // Sucesso!
                formResult.innerHTML = '✅ Orçamento recebido com sucesso! Entraremos em contato em breve.';
                formResult.className = 'text-center text-sm font-medium py-3 px-4 rounded-lg bg-green-500/20 text-green-400 border border-green-500/30';
                formResult.classList.remove('hidden');
                
                // Limpar formulário
                contactForm.reset();
                
                // Reabilitar botão após 3 segundos
                setTimeout(() => {
                    submitBtn.disabled = false;
                    submitBtn.innerHTML = '<span>Solicitar Orçamento</span>';
                }, 3000);
            } else {
                throw new Error(data.message || 'Erro ao enviar formulário');
            }
        } catch (error) {
            // Erro
            formResult.innerHTML = '❌ Erro ao enviar. Tente novamente ou entre em contato via WhatsApp.';
            formResult.className = 'text-center text-sm font-medium py-3 px-4 rounded-lg bg-red-500/20 text-red-400 border border-red-500/30';
            formResult.classList.remove('hidden');
            
            // Reabilitar botão
            submitBtn.disabled = false;
            submitBtn.innerHTML = '<span>Solicitar Orçamento</span>';
            
            console.error('Erro no formulário:', error);
        }
    });
}
