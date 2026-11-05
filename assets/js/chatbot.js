  // ============================================
  // AI Chatbot Widget — N. Bernard Portfolio
  // Integrated with Google Gemini API
  // ============================================

  // CONFIGURATION: Add your Gemini API key here
  // Get your free API key from: https://aistudio.google.com/app/apikey
  // NOTE: For production, use a backend proxy to protect your API key
  const GEMINI_API_KEY = 'YOUR_GEMINI_API_KEY_HERE';
  const GEMINI_MODEL = 'gemini-2.0-flash';
  const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${GEMINI_API_KEY}`;

  // System prompt for the AI assistant
  const SYSTEM_PROMPT = `You are a helpful AI assistant for N. Bernard's portfolio website. N. Bernard is a final-year Bachelor of Information Technology student at the University of Rwanda. 

Website sections: Home (hero), About Me, Skills, Projects, Experience, Contact.

Projects:
1. Chartboard AI - AI-powered analytics dashboard (Python, AI/ML, Chart.js, Flask)
2. Healthcare Portal System - Java healthcare management (Java, JavaFX, MySQL)
3. BI Retail Analytics Dashboard - Python/pandas data analysis
4. Hotel Website - HTML/CSS/JS hotel booking site
5. Smart Agriculture System - IoT farming solution (Python, Arduino, MQTT)

Skills: Java, JavaScript, Python, HTML & CSS, Git & GitHub, VS Code, Figma, Responsive Design, Frontend Development, Problem Solving

Experience: BSc IT at University of Rwanda (2023-Present), Healthcare Portal System as Final Year Project (2025)

Contact: ndagijimanabernard11@gmail.com

Be friendly, professional, helpful, and patient. Answer questions about the website, projects, skills, and experience. If you don't know something, politely explain and direct to contact form or email. Keep responses concise and helpful.`;

  // Knowledge base for website-specific questions (fallback)
  const knowledgeBase = {
    "about": "N. Bernard is a final-year Bachelor of Information Technology student at the University of Rwanda. He's passionate about turning ideas into reality through clean code and thoughtful design.",
    "projects": "The portfolio features 5 projects: Chartboard AI (AI-powered analytics dashboard), Healthcare Portal System (Java healthcare management), BI Retail Analytics Dashboard (Python/pandas data analysis), Hotel Website (HTML/CSS/JS), and Smart Agriculture System (IoT farming solution).",
    "skills": "Skills include Java, JavaScript, Python, HTML & CSS, Git & GitHub, VS Code, Figma, Responsive Design, Frontend Development, and Problem Solving.",
    "contact": "You can reach N. Bernard via email at ndagijimanabernard11@gmail.com or use the contact form on the website.",
    "experience": "Currently studying BSc Information Technology at University of Rwanda (2023-Present) and completed a Healthcare Portal System as a Final Year Project (2025).",
    "chartboard": "Chartboard AI is an intelligent data visualization platform that uses AI to automatically generate charts and insights from raw data. It supports CSV, Excel, JSON, and SQL connections.",
    "healthcare": "Healthcare Portal System is a Java-based healthcare management system for patient registration, appointment scheduling, and medical record management.",
    "bi retail": "BI Retail Analytics Dashboard is a Python/pandas project that calculates KPIs like Gross Profit, Net Sales, and Profit Margin from retail sales data.",
    "hotel": "Hotel Website is a responsive hotel booking website built as a web programming project for the University of Rwanda.",
    "agriculture": "Smart Agriculture System is an IoT-based smart farming solution that monitors soil moisture, temperature, and humidity to automate irrigation.",
    "how it works": "The portfolio is a single-page website with sections: Home (hero), About Me, Skills, Projects, Experience, and Contact. Navigate using the top menu or scroll down.",
    "get started": "Start by exploring the Projects section to see N. Bernard's work. Use the Contact section to get in touch for collaborations or opportunities.",
    "github": "N. Bernard's GitHub profile is at github.com/bernard52196. Each project has a 'View on GitHub' link for more details.",
  };

  // Quick question buttons
  const quickQuestions = [
    "How does this website work?",
    "What projects do you have?",
    "What skills do you know?",
    "How can I contact you?",
    "Tell me about Smart Agriculture",
  ];

  // Conversation history for Gemini
  let conversationHistory = [];

  // Create chatbot HTML
  function createChatbot() {
    // Floating button
    const btn = document.createElement('button');
    btn.className = 'chatbot-btn';
    btn.setAttribute('aria-label', 'Open AI Chat Assistant');
    btn.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>';
    document.body.appendChild(btn);

    // Chat window
    const window = document.createElement('div');
    window.className = 'chatbot-window';
    window.innerHTML = `
      <div class="chatbot-header">
        <div class="chatbot-header-info">
          <div class="chatbot-avatar">🤖</div>
          <div class="chatbot-header-text">
            <h4>AI Assistant (Gemini)</h4>
            <span>Online • Powered by AI</span>
          </div>
        </div>
        <button class="chatbot-close" aria-label="Close chat">&times;</button>
      </div>
      <div class="chatbot-messages" id="chatbotMessages"></div>
      <div class="chatbot-quick" id="chatbotQuick"></div>
      <div class="chatbot-input">
        <input type="text" id="chatbotInput" placeholder="Type your message..." autocomplete="off" />
        <button id="chatbotSend" aria-label="Send message">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
        </button>
      </div>
    `;
    document.body.appendChild(window);

    // Add quick question buttons
    const quickContainer = window.querySelector('#chatbotQuick');
    quickQuestions.forEach(q => {
      const btn = document.createElement('button');
      btn.className = 'chatbot-quick-btn';
      btn.textContent = q;
      btn.addEventListener('click', () => sendMessage(q));
      quickContainer.appendChild(btn);
    });

    // Event listeners
    btn.addEventListener('click', toggleChat);
    window.querySelector('.chatbot-close').addEventListener('click', closeChat);
    window.querySelector('#chatbotSend').addEventListener('click', handleSend);
    window.querySelector('#chatbotInput').addEventListener('keypress', function(e) {
      if (e.key === 'Enter') handleSend();
    });

    // Show welcome message
    addBotMessage("Hello! Welcome to our website. I'm your AI Assistant powered by Google Gemini. How can I help you today?");
  }

  function toggleChat() {
    const chatWindow = document.querySelector('.chatbot-window');
    chatWindow.classList.toggle('open');
    if (chatWindow.classList.contains('open')) {
      document.querySelector('#chatbotInput').focus();
    }
  }

  function closeChat() {
    document.querySelector('.chatbot-window').classList.remove('open');
  }

  function handleSend() {
    const input = document.querySelector('#chatbotInput');
    const message = input.value.trim();
    if (!message) return;
    input.value = '';
    sendMessage(message);
  }

  function sendMessage(message) {
    addUserMessage(message);
    showTyping();
    // Hide quick buttons after first message
    const quick = document.querySelector('#chatbotQuick');
    if (quick) quick.style.display = 'none';

    // Add to conversation history
    conversationHistory.push({ role: "user", parts: [{ text: message }] });

    // Get AI response from Gemini
    getGeminiResponse(message).then(response => {
      hideTyping();
      addBotMessage(response);
      conversationHistory.push({ role: "model", parts: [{ text: response }] });
    }).catch(error => {
      hideTyping();
      // Fallback to knowledge base
      const fallback = getFallbackResponse(message);
      addBotMessage(fallback);
      conversationHistory.push({ role: "model", parts: [{ text: fallback }] });
    });
  }

  function addUserMessage(text) {
    const messages = document.querySelector('#chatbotMessages');
    const msg = document.createElement('div');
    msg.className = 'chatbot-msg user';
    msg.textContent = text;
    messages.appendChild(msg);
    scrollToBottom();
  }

  function addBotMessage(text) {
    const messages = document.querySelector('#chatbotMessages');
    const msg = document.createElement('div');
    msg.className = 'chatbot-msg bot';
    msg.textContent = text;
    messages.appendChild(msg);
    scrollToBottom();
  }

  function showTyping() {
    const messages = document.querySelector('#chatbotMessages');
    const typing = document.createElement('div');
    typing.className = 'chatbot-msg bot typing';
    typing.id = 'chatbotTyping';
    typing.innerHTML = '<span></span><span></span><span></span>';
    messages.appendChild(typing);
    scrollToBottom();
  }

  function hideTyping() {
    const typing = document.querySelector('#chatbotTyping');
    if (typing) typing.remove();
  }

  function scrollToBottom() {
    const messages = document.querySelector('#chatbotMessages');
    messages.scrollTop = messages.scrollHeight;
  }

  // Gemini API call
  async function getGeminiResponse(message) {
    if (GEMINI_API_KEY === 'YOUR_GEMINI_API_KEY_HERE') {
      throw new Error('API key not configured');
    }

    const requestBody = {
      contents: [
        { role: "user", parts: [{ text: SYSTEM_PROMPT }] },
        ...conversationHistory
      ],
      generationConfig: {
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 500,
      },
      safetySettings: [
        { category: "HARM_CATEGORY_HARASSMENT", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
        { category: "HARM_CATEGORY_HATE_SPEECH", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
        { category: "HARM_CATEGORY_SEXUALLY_EXPLICIT", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
        { category: "HARM_CATEGORY_DANGEROUS_CONTENT", threshold: "BLOCK_MEDIUM_AND_ABOVE" }
      ]
    };

    const response = await fetch(GEMINI_API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.status}`);
    }

    const data = await response.json();
    
    if (data.candidates && data.candidates[0] && data.candidates[0].content) {
      return data.candidates[0].content.parts[0].text;
    }
    
    throw new Error('No response from Gemini');
  }

  // Fallback response using knowledge base
  function getFallbackResponse(message) {
    const lower = message.toLowerCase();

    for (const [key, value] of Object.entries(knowledgeBase)) {
      if (lower.includes(key)) {
        return value;
      }
    }

    if (lower.includes('hello') || lower.includes('hi') || lower.includes('hey')) {
      return "Hello! Welcome to our website. I'm your AI Assistant. How can I help you today?";
    }

    if (lower.includes('thank')) {
      return "You're welcome! Is there anything else I can help you with?";
    }

    if (lower.includes('help') || lower.includes('confused') || lower.includes('don\'t understand')) {
      return "I'm here to help! Here are some things you can ask me about:\n\n• How this website works\n• What projects are available\n• N. Bernard's skills and experience\n• How to contact N. Bernard\n• Details about any specific project\n\nJust type your question and I'll do my best to assist you!";
    }

    if (lower.includes('how') && lower.includes('work')) {
      return knowledgeBase["how it works"];
    }

    if (lower.includes('get started') || lower.includes('start')) {
      return knowledgeBase["get started"];
    }

    if (lower.includes('where') && (lower.includes('find') || lower.includes('information'))) {
      return "You can find information in these sections:\n\n• About Me — N. Bernard's background\n• Skills — Technical skills and tools\n• Projects — Portfolio projects with details\n• Experience — Education and work history\n• Contact — Get in touch via email or form\n\nUse the navigation menu at the top to jump to any section!";
    }

    if (lower.includes('feature') || lower.includes('use this')) {
      return "The website features: a space-themed design, responsive navigation, project showcase with GitHub links, an experience timeline, and a contact form. Each project has its own detailed page with features, tech stack, and contact form. Click 'View Project' on any project card to learn more!";
    }

    return "That's a great question! I'm here to help with information about N. Bernard's portfolio website, projects, skills, and experience. You can ask me about:\n\n• The website and how it works\n• Projects (Chartboard AI, Healthcare Portal, BI Retail, Hotel Website, Smart Agriculture)\n• Skills and technologies\n• Experience and education\n• Contact information\n\nIs there anything specific you'd like to know?";
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', createChatbot);
  } else {
    createChatbot();
  }
})();

    "about": "N. Bernard is a final-year Bachelor of Information Technology student at the University of Rwanda. He's passionate about turning ideas into reality through clean code and thoughtful design.",
    "projects": "The portfolio features 5 projects: Chartboard AI (AI-powered analytics dashboard), Healthcare Portal System (Java healthcare management), BI Retail Analytics Dashboard (Python/pandas data analysis), Hotel Website (HTML/CSS/JS), and Smart Agriculture System (IoT farming solution).",
    "skills": "Skills include Java, JavaScript, Python, HTML & CSS, Git & GitHub, VS Code, Figma, Responsive Design, Frontend Development, and Problem Solving.",
    "contact": "You can reach N. Bernard via email at ndagijimanabernard11@gmail.com or use the contact form on the website.",
    "experience": "Currently studying BSc Information Technology at University of Rwanda (2023-Present) and completed a Healthcare Portal System as a Final Year Project (2025).",
    "chartboard": "Chartboard AI is an intelligent data visualization platform that uses AI to automatically generate charts and insights from raw data. It supports CSV, Excel, JSON, and SQL connections.",
    "healthcare": "Healthcare Portal System is a Java-based healthcare management system for patient registration, appointment scheduling, and medical record management.",
    "bi retail": "BI Retail Analytics Dashboard is a Python/pandas project that calculates KPIs like Gross Profit, Net Sales, and Profit Margin from retail sales data.",
    "hotel": "Hotel Website is a responsive hotel booking website built as a web programming project for the University of Rwanda.",
    "agriculture": "Smart Agriculture System is an IoT-based smart farming solution that monitors soil moisture, temperature, and humidity to automate irrigation.",
    "how it works": "The portfolio is a single-page website with sections: Home (hero), About Me, Skills, Projects, Experience, and Contact. Navigate using the top menu or scroll down.",
    "get started": "Start by exploring the Projects section to see N. Bernard's work. Use the Contact section to get in touch for collaborations or opportunities.",
    "github": "N. Bernard's GitHub profile is at github.com/bernard52196. Each project has a 'View on GitHub' link for more details.",
  };

  // Quick question buttons
  const quickQuestions = [
    "How does this website work?",
    "What projects do you have?",
    "What skills do you know?",
    "How can I contact you?",
    "Tell me about Smart Agriculture",
  ];

  // Create chatbot HTML
  function createChatbot() {
    // Floating button
    const btn = document.createElement('button');
    btn.className = 'chatbot-btn';
    btn.setAttribute('aria-label', 'Open AI Chat Assistant');
    btn.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>';
    document.body.appendChild(btn);

    // Chat window
    const window = document.createElement('div');
    window.className = 'chatbot-window';
    window.innerHTML = `
      <div class="chatbot-header">
        <div class="chatbot-header-info">
          <div class="chatbot-avatar">🤖</div>
          <div class="chatbot-header-text">
            <h4>AI Assistant</h4>
            <span>Online • Ready to help</span>
          </div>
        </div>
        <button class="chatbot-close" aria-label="Close chat">&times;</button>
      </div>
      <div class="chatbot-messages" id="chatbotMessages"></div>
      <div class="chatbot-quick" id="chatbotQuick"></div>
      <div class="chatbot-input">
        <input type="text" id="chatbotInput" placeholder="Type your message..." autocomplete="off" />
        <button id="chatbotSend" aria-label="Send message">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
        </button>
      </div>
    `;
    document.body.appendChild(window);

    // Add quick question buttons
    const quickContainer = window.querySelector('#chatbotQuick');
    quickQuestions.forEach(q => {
      const btn = document.createElement('button');
      btn.className = 'chatbot-quick-btn';
      btn.textContent = q;
      btn.addEventListener('click', () => sendMessage(q));
      quickContainer.appendChild(btn);
    });

    // Event listeners
    btn.addEventListener('click', toggleChat);
    window.querySelector('.chatbot-close').addEventListener('click', closeChat);
    window.querySelector('#chatbotSend').addEventListener('click', handleSend);
    window.querySelector('#chatbotInput').addEventListener('keypress', function(e) {
      if (e.key === 'Enter') handleSend();
    });

    // Show welcome message
    addBotMessage("Hello! Welcome to our website. I'm your AI Assistant. How can I help you today?");
  }

  function toggleChat() {
    const chatWindow = document.querySelector('.chatbot-window');
    chatWindow.classList.toggle('open');
    if (chatWindow.classList.contains('open')) {
      document.querySelector('#chatbotInput').focus();
    }
  }

  function closeChat() {
    document.querySelector('.chatbot-window').classList.remove('open');
  }

  function handleSend() {
    const input = document.querySelector('#chatbotInput');
    const message = input.value.trim();
    if (!message) return;
    input.value = '';
    sendMessage(message);
  }

  function sendMessage(message) {
    addUserMessage(message);
    showTyping();
    // Hide quick buttons after first message
    const quick = document.querySelector('#chatbotQuick');
    if (quick) quick.style.display = 'none';

    // Get AI response
    setTimeout(() => {
      const response = getAIResponse(message);
      hideTyping();
      addBotMessage(response);
    }, 800 + Math.random() * 700);
  }

  function addUserMessage(text) {
    const messages = document.querySelector('#chatbotMessages');
    const msg = document.createElement('div');
    msg.className = 'chatbot-msg user';
    msg.textContent = text;
    messages.appendChild(msg);
    scrollToBottom();
  }

  function addBotMessage(text) {
    const messages = document.querySelector('#chatbotMessages');
    const msg = document.createElement('div');
    msg.className = 'chatbot-msg bot';
    msg.textContent = text;
    messages.appendChild(msg);
    scrollToBottom();
  }

  function showTyping() {
    const messages = document.querySelector('#chatbotMessages');
    const typing = document.createElement('div');
    typing.className = 'chatbot-msg bot typing';
    typing.id = 'chatbotTyping';
    typing.innerHTML = '<span></span><span></span><span></span>';
    messages.appendChild(typing);
    scrollToBottom();
  }

  function hideTyping() {
    const typing = document.querySelector('#chatbotTyping');
    if (typing) typing.remove();
  }

  function scrollToBottom() {
    const messages = document.querySelector('#chatbotMessages');
    messages.scrollTop = messages.scrollHeight;
  }

  // AI Response logic using knowledge base
  function getAIResponse(message) {
    const lower = message.toLowerCase();

    // Check knowledge base for matching keywords
    for (const [key, value] of Object.entries(knowledgeBase)) {
      if (lower.includes(key)) {
        return value;
      }
    }

    // Specific question patterns
    if (lower.includes('hello') || lower.includes('hi') || lower.includes('hey')) {
      return "Hello! Welcome to our website. I'm your AI Assistant. How can I help you today?";
    }

    if (lower.includes('thank')) {
      return "You're welcome! Is there anything else I can help you with?";
    }

    if (lower.includes('help') || lower.includes('confused') || lower.includes('don\'t understand')) {
      return "I'm here to help! Here are some things you can ask me about:\n\n• How this website works\n• What projects are available\n• N. Bernard's skills and experience\n• How to contact N. Bernard\n• Details about any specific project\n\nJust type your question and I'll do my best to assist you!";
    }

    if (lower.includes('how') && lower.includes('work')) {
      return knowledgeBase["how it works"];
    }

    if (lower.includes('get started') || lower.includes('start')) {
      return knowledgeBase["get started"];
    }

    if (lower.includes('where') && (lower.includes('find') || lower.includes('information'))) {
      return "You can find information in these sections:\n\n• About Me — N. Bernard's background\n• Skills — Technical skills and tools\n• Projects — Portfolio projects with details\n• Experience — Education and work history\n• Contact — Get in touch via email or form\n\nUse the navigation menu at the top to jump to any section!";
    }

    if (lower.includes('feature') || lower.includes('use this')) {
      return "The website features: a space-themed design, responsive navigation, project showcase with GitHub links, an experience timeline, and a contact form. Each project has its own detailed page with features, tech stack, and contact form. Click 'View Project' on any project card to learn more!";
    }

    // Default response
    return "That's a great question! I'm here to help with information about N. Bernard's portfolio website, projects, skills, and experience. You can ask me about:\n\n• The website and how it works\n• Projects (Chartboard AI, Healthcare Portal, BI Retail, Hotel Website, Smart Agriculture)\n• Skills and technologies\n• Experience and education\n• Contact information\n\nIs there anything specific you'd like to know?";
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', createChatbot);
  } else {
    createChatbot();
  }
})();
