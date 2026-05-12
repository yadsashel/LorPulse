(function() {
    // 1. جلب المعلومات الأساسية
    const script = document.currentScript;
    const apiKey = script.getAttribute('data-key') || script.getAttribute('data-api-key');
    const botUrl = "https://lorpulse.vercel.app/embed/chat";
    
    if (!apiKey) {
        console.error("LorPulse: Missing API Key! Neural Bridge connection failed.");
        return;
    }

    // 2. تكييف الـ UI بلمسة عصرية
    const injectStyles = () => {
        const style = document.createElement('style');
        style.innerHTML = `
            #lorpulse-bubble { 
                position:fixed; bottom:20px; right:20px; width:64px; height:64px; 
                background:#000; border-radius:50%; cursor:pointer; 
                display:flex; align-items:center; justify-content:center; 
                box-shadow:0 8px 32px rgba(0,255,204,0.2); z-index:2147483647; 
                transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275); 
                border: 1px solid rgba(0,255,204,0.3);
            }
            #lorpulse-bubble:hover { transform: scale(1.1) rotate(5deg); box-shadow: 0 12px 40px rgba(0,255,204,0.4); }
            #lorpulse-bubble svg { width: 30px; height: 30px; transition: all 0.3s ease; }
            
            #lorpulse-container { 
                display:none; position:fixed; bottom:100px; right:20px; 
                width:420px; height:650px; background:#fff; border-radius:24px; 
                box-shadow:0 24px 60px rgba(0,0,0,0.3); z-index:2147483647; 
                overflow:hidden; border:1px solid rgba(0,255,204,0.1); 
                transition: all 0.4s ease;
                transform: translateY(30px) scale(0.95); opacity: 0;
                pointer-events: none;
            }
            #lorpulse-container.open { 
                display:block; transform: translateY(0) scale(1); opacity: 1; 
                pointer-events: auto;
            }
            
            @media (max-width: 480px) { 
                #lorpulse-container { width:92vw; height:80vh; bottom:90px; right:4vw; border-radius:20px; } 
            }
        `;
        document.head.appendChild(style);
    };

    const injectHTML = async () => {
        // --- CHECK STATUS BEFORE LOADING ---
        // كنصيفطو الـ API Key للـ Chatbot وهو كيتكلف يشيك الـ Status من الداتابيز
        // إيلا كان Locked، الـ Chatbot نفسه هو اللي غايطلع الـ Lock screen
        
        const div = document.createElement('div');
        div.id = "lorpulse-widget-root";
        div.innerHTML = `
            <div id="lorpulse-bubble" title="LorPulse Neural Bridge Active">
                <svg viewBox="0 0 24 24" fill="none" stroke="#00ffcc" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                    <circle cx="12" cy="10" r="2" fill="#00ffcc"></circle>
                </svg>
            </div>
            <div id="lorpulse-container">
                <iframe id="lorpulse-iframe" src="${botUrl}?key=${apiKey}" 
                        style="width:100%; height:100%; border:none;" 
                        allow="clipboard-write; microphone"></iframe>
            </div>
        `;
        document.body.appendChild(div);

        const bubble = document.getElementById('lorpulse-bubble');
        const container = document.getElementById('lorpulse-container');
        const svg = bubble.querySelector('svg');

        // Toggle Chat
        bubble.onclick = () => {
            const isOpen = container.classList.contains('open');
            if (!isOpen) {
                container.style.display = 'block';
                setTimeout(() => container.classList.add('open'), 10);
                svg.innerHTML = '<path d="M18 6L6 18M6 6l12 12" stroke="#ff4444"></path>';
            } else {
                container.classList.remove('open');
                setTimeout(() => { container.style.display = 'none'; }, 400);
                svg.innerHTML = '<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" stroke="#00ffcc"></path><circle cx="12" cy="10" r="2" fill="#00ffcc"></circle>';
            }
        };
    };

    // 3. LISTEN FOR LEAD CAPTURE (The New Logic)
    window.addEventListener('message', (event) => {
        if (!event.origin.includes('lorpulse.vercel.app')) return;

        if (event.data.type === 'LEAD_CAPTURED') {
            console.log("LorPulse: Lead detected and synchronized.", event.data.details);
        }
    });

    // Initialize
    if (document.readyState === 'complete') {
        injectStyles(); injectHTML();
    } else {
        window.addEventListener('load', () => { injectStyles(); injectHTML(); });
    }
})();