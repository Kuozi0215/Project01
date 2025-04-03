// 移除打字效果，直接顯示文字
const words = ["創新科技解決方案", "智能系統整合", "企業數位轉型"];
const typewriter = document.getElementById("typewriter");

// 直接設置顯示文字
function setupText() {
  if (typewriter) {
    typewriter.textContent = "創新科技解決方案｜智能系統整合｜企業數位轉型";
  }
}

// 移动菜单功能
function setupMobileMenu() {
  const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
  const navLinks = document.querySelector('.nav-links');
  
  if (mobileMenuBtn && navLinks) {
    mobileMenuBtn.addEventListener('click', () => {
      navLinks.classList.toggle('active');
    });
    
    // 点击导航链接时关闭菜单
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('active');
      });
    });
  }
}

// 滚动动画
function setupScrollAnimation() {
  const sections = document.querySelectorAll('.section');
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, {
    threshold: 0.1
  });
  
  sections.forEach(section => {
    observer.observe(section);
  });
}

// AI助手設置
document.addEventListener('DOMContentLoaded', function() {
  // 導航交互
  setupNavigation();
  
  // AI小助手設置
  setupAIWidget();
});

// 設置導航交互
function setupNavigation() {
  const mobileToggle = document.querySelector('.mobile-toggle');
  const mainNav = document.querySelector('.main-nav');
  
  if (mobileToggle && mainNav) {
    mobileToggle.addEventListener('click', function() {
      mainNav.classList.toggle('active');
    });
  }
  
  // 平滑滾動到錨點
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        window.scrollTo({
          top: targetElement.offsetTop - 80,
          behavior: 'smooth'
        });
        
        // 如果在移動設備上，點擊後關閉導航
        if (window.innerWidth < 768 && mainNav.classList.contains('active')) {
          mainNav.classList.remove('active');
        }
      }
    });
  });
}

// 等待DOM完全加載後執行
window.addEventListener('load', function() {
  setupAIWidget();
});

// 設置AI小助手
function setupAIWidget() {
  console.log('初始化AI助手...'); // 添加調試日誌
  
  const aiToggle = document.querySelector('.AIToggle');
  const aiContainer = document.querySelector('.AIContainer');
  const aiMinimize = document.querySelector('.ai-minimize');
  const aiMessageInput = document.querySelector('.AIMessageInput');
  const sendBtn = document.querySelector('.sendBtn');
  const messageList = document.querySelector('.AIMessage');
  const navItems = document.querySelectorAll('.ai-nav-item');
  const aiPages = document.querySelectorAll('.ai-page');
  const backButtons = document.querySelectorAll('.ai-page-back');
  const toolItems = document.querySelectorAll('.ai-tool-item');
  
  // 檢查元素是否存在
  if (!aiToggle || !aiContainer) {
    console.error('找不到AI助手按鈕或容器元素');
    return;
  }
  
  // 打開/關閉AI小助手
  aiToggle.addEventListener('click', function(e) {
    console.log('點擊AI按鈕'); // 添加調試日誌
    e.preventDefault();
    aiContainer.classList.toggle('active');
  });
  
  // 最小化AI小助手
  if (aiMinimize) {
    aiMinimize.addEventListener('click', function() {
      aiContainer.classList.remove('active');
    });
  }
  
  // 切換頁面
  if (navItems.length > 0 && aiPages.length > 0) {
    navItems.forEach(item => {
      item.addEventListener('click', function() {
        const targetPage = this.getAttribute('data-page');
        
        // 移除所有頁面和導航項的active類
        aiPages.forEach(page => page.classList.remove('active'));
        navItems.forEach(nav => nav.classList.remove('active'));
        
        // 添加active類到目標頁面和當前導航項
        document.getElementById(targetPage).classList.add('active');
        this.classList.add('active');
      });
    });
  }
  
  // 返回按鈕
  if (backButtons.length > 0) {
    backButtons.forEach(button => {
      button.addEventListener('click', function() {
        const targetPage = this.getAttribute('data-target');
        
        // 移除所有頁面的active類
        aiPages.forEach(page => page.classList.remove('active'));
        
        // 添加active類到目標頁面
        document.getElementById(targetPage).classList.add('active');
        
        // 更新導航項的active狀態
        navItems.forEach(nav => {
          if (nav.getAttribute('data-page') === targetPage) {
            nav.classList.add('active');
          } else {
            nav.classList.remove('active');
          }
        });
      });
    });
  }
  
  // 發送消息
  if (sendBtn && aiMessageInput && messageList) {
    sendBtn.addEventListener('click', sendMessage);
    aiMessageInput.addEventListener('keypress', function(e) {
      if (e.key === 'Enter') {
        sendMessage();
      }
    });
  }
  
  // 工具項點擊
  if (toolItems.length > 0 && messageList) {
    toolItems.forEach(tool => {
      tool.addEventListener('click', function() {
        const toolType = this.getAttribute('data-tool');
        simulateUserMessage(getToolTitle(this) + ' 功能');
        let response = respondToTool(toolType);
        addMessageToList(response, 'chatbot-message');
      });
    });
  }
  
  // 發送消息的函數
  function sendMessage() {
    const message = aiMessageInput.value.trim();
    if (message === '') return;
    
    // 添加用戶消息到列表
    addMessageToList(message, 'user-message');
    
    // 清空輸入框
    aiMessageInput.value = '';
    
    // 模擬AI回覆
    setTimeout(() => {
      const response = getAIResponse(message);
      addMessageToList(response, 'chatbot-message');
    }, 500);
  }
  
  // 添加消息到列表
  function addMessageToList(message, className) {
    const li = document.createElement('li');
    const div = document.createElement('div');
    div.className = className;
    div.textContent = message;
    li.appendChild(div);
    messageList.appendChild(li);
    
    // 滾動到底部
    scrollToBottom();
  }
  
  // 滾動到底部
  function scrollToBottom() {
    const messageField = document.querySelector('.messageField');
    if (messageField) {
      messageField.scrollTop = messageField.scrollHeight;
    }
  }
  
  // 模擬用戶消息
  function simulateUserMessage(message) {
    // 切換到消息頁面
    aiPages.forEach(page => page.classList.remove('active'));
    document.getElementById('messagePage').classList.add('active');
    
    // 更新導航項
    navItems.forEach(nav => {
      if (nav.getAttribute('data-page') === 'messagePage') {
        nav.classList.add('active');
      } else {
        nav.classList.remove('active');
      }
    });
    
    // 添加用戶消息
    addMessageToList(message, 'user-message');
  }
  
  // 獲取工具標題
  function getToolTitle(element) {
    const titleEl = element.querySelector('.ai-tool-title');
    return titleEl ? titleEl.textContent : '未知工具';
  }
  
  // 回應工具點擊
  function respondToTool(tool) {
    let response = '';
    
    switch(tool) {
      case 'meeting':
        response = '會議提醒功能可以幫助您設置會議通知、發送會議邀請給參與者，以及管理會議室預訂。您需要安排新會議還是查看現有會議？';
        break;
      case 'team':
        response = '團隊協作功能可以幫助您管理專案團隊、分配工作職責，以及促進團隊成員之間的溝通。您需要創建新團隊還是管理現有團隊？';
        break;
      case 'docs':
        response = '共享文檔功能可以幫助您與團隊成員協作編輯文件、管理文件版本，以及設置訪問權限。您需要創建新文檔還是共享現有文檔？';
        break;
      case 'tasks':
        response = '任務分配功能可以幫助您創建任務清單、分配任務給團隊成員，以及追蹤任務完成情況。您需要創建新任務還是查看現有任務？';
        break;
      case 'erp':
        response = '我可以幫助您了解ERP系統的使用方法、功能模塊和常見問題解決。您有具體的ERP系統問題嗎？';
        break;
      case 'crm':
        response = '我可以幫助您了解CRM系統的客戶管理功能、銷售流程和報表分析。您需要關於CRM系統的哪方面指導？';
        break;
      case 'hr':
        response = '我可以幫助您了解人資系統的考勤管理、績效評估和培訓發展等功能。您需要人資系統的哪方面支援？';
        break;
      case 'help':
        response = '如果您遇到IT設備或系統問題，我可以提供基本的故障排除步驟。您也可以通過我向IT部門提交支援請求。請描述您遇到的問題。';
        break;
      case 'storage':
        response = '雲端儲存功能可以幫助您存儲和分享大文件，並在任何設備上訪問。您需要了解如何上傳文件還是管理現有文件？';
        break;
      case 'ocr':
        response = '文字識別功能可以從圖像或掃描的PDF文件中提取文本。您需要從什麼類型的文件中提取文本？';
        break;
      case 'pdf':
        response = 'PDF處理功能可以幫助您合併、分割、壓縮PDF文件，或將PDF轉換為其他格式。您需要執行哪種PDF操作？';
        break;
      case 'translate':
        response = '文件翻譯功能可以幫助您將文檔翻譯成不同的語言。目前支持中文、英文、日文和韓文之間的互譯。您需要將什麼文件翻譯成什麼語言？';
        break;
      case 'todo':
        response = '待辦事項功能可以幫助您記錄和管理個人工作任務。您需要創建新的待辦事項還是查看現有事項？';
        break;
      case 'note':
        response = '便利貼功能可以幫您記錄臨時筆記和重要信息。您需要創建新的便利貼還是查看現有便利貼？';
        break;
      case 'calc':
        response = '計算器功能可以執行基本和進階的數學計算。您可以直接輸入算式，如「2+2*5」，我會為您計算結果。';
        break;
      case 'weather':
        response = '天氣查詢功能可以顯示指定城市的天氣狀況和預報。您想查詢哪個城市的天氣？';
        break;
      default:
        response = '請告訴我您對這個工具有什麼疑問？';
    }
    
    return response;
  }
  
  // 獲取AI回應
  function getAIResponse(message) {
    // 簡單的回應邏輯，實際應用中可能使用更複雜的NLP或API調用
    if (message.toLowerCase().includes('你好') || message.toLowerCase().includes('嗨')) {
      return '您好！我是小明企業的內部助手。有什麼我可以幫助您的嗎？';
    } else if (message.toLowerCase().includes('幫助') || message.toLowerCase().includes('功能')) {
      return '我可以協助您處理：\n- 公司政策和規章制度查詢\n- 申請表單填寫指南\n- 時程和行事曆管理\n- 檔案壓縮和處理\n- 會議提醒設置\n- 團隊協作工具使用\n- 系統操作指南\n\n請選擇或直接詢問您需要的幫助。';
    } else if (message.toLowerCase().includes('請假') || message.toLowerCase().includes('假單')) {
      return '請假申請流程：\n1. 登入人資系統\n2. 選擇"請假申請"\n3. 填寫請假類型、時間和原因\n4. 提交給您的直屬主管審批\n\n請假規定可參考員工手冊第12-15頁。需要我提供請假單填寫範例嗎？';
    } else if (message.toLowerCase().includes('會議室') || message.toLowerCase().includes('預訂')) {
      return '會議室預訂步驟：\n1. 登入內部系統\n2. 選擇"設施預訂"\n3. 選擇日期、時間和人數\n4. 系統將顯示可用的會議室\n5. 選擇合適的會議室並確認預訂\n\n需要我幫您預訂會議室嗎？';
    } else if (message.toLowerCase().includes('密碼') || message.toLowerCase().includes('忘記密碼')) {
      return '如果您忘記了系統密碼，請：\n1. 點擊登入頁面的"忘記密碼"\n2. 輸入您的公司郵箱\n3. 系統將發送重置連結到您的郵箱\n4. 按照郵件中的指示重置密碼\n\n如有問題，請聯繫IT部門（分機：6688）。';
    } else {
      return '感謝您的詢問。我正在處理您的請求，如果您有具體的問題，請直接告訴我，我會盡力提供幫助。您也可以點擊下方的"功能"按鈕，瀏覽所有可用服務。';
    }
  }
}

// 視差效果
function setupParallaxEffect() {
  const hero = document.querySelector('.hero');
  const circles = document.querySelectorAll('.circle-1, .circle-2, .circle-3');
  
  if (hero && circles.length > 0) {
  hero.addEventListener('mousemove', (e) => {
    const x = e.clientX / window.innerWidth;
    const y = e.clientY / window.innerHeight;
    
    circles.forEach((circle, index) => {
        const speed = (index + 1) * 0.05;
        const xOffset = (x - 0.5) * 80 * speed;
        const yOffset = (y - 0.5) * 80 * speed;
      
      circle.style.transform = `translate(${xOffset}px, ${yOffset}px)`;
    });
  });
  }
}
  
// 處理聯繫表單提交
function setupContactForm() {
  const contactForm = document.querySelector('.contact-form');
  
  if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      // 獲取表單數據
      const company = this.querySelector('#company').value;
      const email = this.querySelector('#email').value;
      const message = this.querySelector('#message').value;
      
      // 簡單的表單驗證
      if (!company || !email || !message) {
        alert('請填寫所有必填字段');
        return;
      }
      
      // 在實際應用中，這裡應該發送數據到服務器
      alert(`謝謝您的訊息，${company}！我們會盡快回覆。`);
      
      // 清空表單
      this.reset();
    });
  }
}

// 平滑滚动到指定部分
function scrollToSection(sectionId) {
  const section = document.getElementById(sectionId);
  if (section) {
    window.scrollTo({
      top: section.offsetTop - 80,
      behavior: 'smooth'
    });
  }
}

// 導航欄滾動效果
function setupScrollEffect() {
  const header = document.querySelector('header');
  
  if (header) {
    window.addEventListener('scroll', function() {
      if (window.scrollY > 50) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    });
  }
}

// 頁面加載完成後執行
window.addEventListener('DOMContentLoaded', function() {
  setupText();
  setupMobileMenu();
  setupScrollAnimation();
  setupAIWidget();
  setupParallaxEffect();
  setupContactForm();
  setupScrollEffect();
  
  // 為所有帶有滾動功能的按鈕添加事件監聽器
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      const targetId = this.getAttribute('href').substring(1);
      scrollToSection(targetId);
    });
  });
});
