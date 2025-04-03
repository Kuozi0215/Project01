// AI Widget 配置
let aiConfig = {
  name: "智能助手",
  theme: "blue",
  fontSize: "medium",
  autoSave: true,
  soundNotification: true
};

// 每個工具的示例回應
const toolResponses = {
  weather: "目前台北市天氣晴朗，溫度26°C，濕度65%。今日天氣預報：白天晴到多雲，最高溫28°C；夜間多雲，最低溫22°C。",
  translate: "請輸入您要翻譯的文字和目標語言。例如：「你好」翻譯成英文 → Hello",
  calculator: "請輸入您要計算的數學表達式。例如：125 * 7 = 875",
  notes: "已啟動筆記助手。您可以說「記錄：」開頭來保存筆記，或說「顯示筆記」查看已保存的內容。",
  schedule: "已啟動日程提醒助手。您可以說「提醒我：」開頭來設置提醒事項，時間格式為「今天下午3點」或「明天早上9點」等。",
  search: "請輸入您要搜索的問題或關鍵詞。我將為您查找相關信息。"
};

// 切換AI助手顯示/隱藏
function toggleAIWidget() {
  const chatWidget = document.getElementById('aiWidgetChat');
  chatWidget.classList.toggle('show');
}

// 切換不同標籤頁
function switchTab(tabName) {
  // 隱藏所有標籤內容
  const tabContents = document.querySelectorAll('.tab-content');
  tabContents.forEach(tab => tab.classList.remove('active'));
  
  // 移除所有標籤按鈕的激活狀態
  const tabButtons = document.querySelectorAll('.tab-btn');
  tabButtons.forEach(btn => btn.classList.remove('active'));
  
  // 顯示選定的標籤內容
  document.getElementById(tabName + 'Tab').classList.add('active');
  
  // 激活對應的標籤按鈕
  const activeButton = document.querySelector(`.tab-btn[onclick="switchTab('${tabName}')"]`);
  activeButton.classList.add('active');
}

// 發送聊天消息
function sendMessage() {
  const inputElement = document.getElementById('chatInput');
  const messagesElement = document.getElementById('chatMessages');
  
  if (inputElement.value.trim() === '') return;
  
  const userMessage = inputElement.value.trim();
  
  // 添加用戶消息
  addMessage('user', userMessage);
  
  // 清空輸入框
  inputElement.value = '';
  
  // 處理用戶消息並生成回應
  processUserMessage(userMessage);
  
  // 如果啟用了聲音提醒
  if (aiConfig.soundNotification) {
    playNotificationSound('sent');
  }
}

// 處理用戶消息
function processUserMessage(message) {
  // 根據消息內容進行簡單的智能回應
  let response = "";
  
  if (message.includes("你好") || message.includes("嗨") || message.includes("哈囉")) {
    response = `您好！我是${aiConfig.name}，很高興為您服務。`;
  }
  else if (message.includes("天氣")) {
    response = toolResponses.weather;
  }
  else if (message.includes("翻譯")) {
    response = handleTranslation(message);
  }
  else if (message.includes("計算") || /[\d\+\-\*\/\(\)=]/.test(message)) {
    response = handleCalculation(message);
  }
  else if (message.startsWith("記錄：")) {
    response = "已為您記錄筆記：" + message.substring(3);
  }
  else if (message.startsWith("提醒我：")) {
    response = "已設置提醒：" + message.substring(4);
  }
  else if (message.includes("感謝") || message.includes("謝謝")) {
    response = "不客氣！有任何其他問題，隨時告訴我。";
  }
  else {
    response = "我理解您的問題，讓我思考一下...";
    // 在實際應用中，這裡可以連接到真正的AI服務
  }
  
  // 模擬AI思考時間
  setTimeout(() => {
    addMessage('ai', response);
    
    // 如果啟用了聲音提醒
    if (aiConfig.soundNotification) {
      playNotificationSound('received');
    }
  }, 800);
}

// 添加消息到聊天窗口
function addMessage(sender, text) {
  const messagesElement = document.getElementById('chatMessages');
  
  // 創建消息容器
  const messageContainer = document.createElement('div');
  messageContainer.className = `message-container ${sender === 'user' ? 'user' : 'ai'}`;
  
  // 創建消息元素
  const messageDiv = document.createElement('div');
  messageDiv.className = 'message';
  
  if (sender === 'user') {
    messageDiv.innerHTML = `<strong>您:</strong> ${text}`;
  } else {
    messageDiv.innerHTML = `<strong>${aiConfig.name}:</strong> ${text}`;
  }
  
  // 將消息元素添加到容器中
  messageContainer.appendChild(messageDiv);
  
  // 將容器添加到聊天窗口
  messagesElement.appendChild(messageContainer);
  
  // 滾動到底部
  messagesElement.scrollTop = messagesElement.scrollHeight;
}

// 使用AI工具
function useAITool(toolName) {
  // 顯示工具點擊效果
  showToolClickEffect(toolName);
  
  // 切換到聊天標籤
  switchTab('chat');
  
  // 添加工具啟動消息
  addMessage('user', `請啟動${getTooNameInChinese(toolName)}工具`);
  
  // 添加工具回應
  setTimeout(() => {
    addMessage('ai', toolResponses[toolName]);
    
    // 如果啟用了聲音提醒
    if (aiConfig.soundNotification) {
      playNotificationSound('received');
    }
    
    // 顯示工具啟動成功提示
    showToolSuccess(toolName);
  }, 800);
}

// 顯示工具點擊效果
function showToolClickEffect(toolName) {
  // 找到被點擊的工具卡
  const toolCard = document.querySelector(`.tool-card[onclick="useAITool('${toolName}')"]`);
  
  if (!toolCard) return;
  
  // 添加點擊效果類
  toolCard.classList.add('tool-clicked');
  
  // 顯示工具啟動提示
  const toolFeedback = document.createElement('div');
  toolFeedback.className = 'tool-feedback';
  toolFeedback.textContent = '啟動中...';
  toolCard.appendChild(toolFeedback);
  
  // 圖標放大效果
  const iconBg = toolCard.querySelector('.tool-icon-bg');
  if (iconBg) {
    iconBg.style.transform = 'scale(1.2)';
    iconBg.style.background = 'rgba(44, 83, 100, 0.3)';
  }
  
  // 移除效果
  setTimeout(() => {
    toolCard.classList.remove('tool-clicked');
    if (toolFeedback.parentNode) {
      toolFeedback.parentNode.removeChild(toolFeedback);
    }
    
    // 恢復圖標樣式
    if (iconBg) {
      iconBg.style.transform = '';
      iconBg.style.background = '';
    }
  }, 800);
}

// 顯示工具啟動成功提示
function showToolSuccess(toolName) {
  // 找到對應的工具卡
  const toolCard = document.querySelector(`.tool-card[onclick="useAITool('${toolName}')"]`);
  if (!toolCard) return;
  
  // 創建成功提示元素
  const successElement = document.createElement('div');
  successElement.className = 'tool-success';
  
  // 添加打勾動畫
  successElement.innerHTML = `
    <svg class="checkmark" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52">
      <circle class="checkmark-circle" cx="26" cy="26" r="25" fill="none"/>
      <path class="checkmark-check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8"/>
    </svg>
    <span>已啟動</span>
  `;
  
  // 添加到工具卡
  toolCard.appendChild(successElement);
  
  // 移除成功提示
  setTimeout(() => {
    if (successElement.parentNode) {
      successElement.parentNode.removeChild(successElement);
    }
  }, 1500);
}

// 獲取工具中文名稱
function getTooNameInChinese(toolName) {
  const toolNames = {
    weather: "天氣查詢",
    translate: "翻譯助手",
    calculator: "智能計算",
    notes: "筆記助手",
    schedule: "日程提醒",
    search: "智能搜索"
  };
  return toolNames[toolName] || toolName;
}

// 處理翻譯功能
function handleTranslation(message) {
  if (message.includes("英文")) {
    if (message.includes("你好")) return "'你好' 翻譯成英文是：Hello";
    if (message.includes("謝謝")) return "'謝謝' 翻譯成英文是：Thank you";
    return "請告訴我您要翻譯的具體內容";
  }
  if (message.includes("日文")) {
    if (message.includes("你好")) return "'你好' 翻譯成日文是：こんにちは (Konnichiwa)";
    if (message.includes("謝謝")) return "'謝謝' 翻譯成日文是：ありがとう (Arigatou)";
    return "請告訴我您要翻譯的具體內容";
  }
  return "請指定您要翻譯的目標語言，例如：'你好'翻譯成英文";
}

// 處理計算功能
function handleCalculation(message) {
  // 從消息中提取數學表達式
  const expression = message.replace(/[^0-9+\-*/().]/g, '');
  
  if (!expression) {
    return "請提供有效的數學表達式";
  }
  
  try {
    // 使用 eval 計算結果（注意：在生產環境中應該使用更安全的方法）
    const result = eval(expression);
    return `計算結果：${expression} = ${result}`;
  } catch (error) {
    return "抱歉，無法計算該表達式。請確保格式正確。";
  }
}

// 更新AI設置
function updateAISettings() {
  aiConfig.name = document.getElementById('aiName').value;
  aiConfig.fontSize = document.getElementById('fontSize').value;
  aiConfig.autoSave = document.getElementById('autoSave').checked;
  aiConfig.soundNotification = document.getElementById('soundNotification').checked;
  
  // 如果啟用了自動保存
  if (aiConfig.autoSave) {
    saveSettingsToLocalStorage();
  }
  
  // 應用字體大小
  applyFontSize();
  
  // 顯示設置成功提示
  showSettingSuccess();
  
  // 添加設置更新消息
  addMessage('ai', "設置已更新！");
}

// 顯示設置更新成功提示
function showSettingSuccess() {
  // 檢查是否已有成功提示
  let successElement = document.querySelector('.setting-success');
  
  // 如果沒有，創建一個
  if (!successElement) {
    successElement = document.createElement('div');
    successElement.className = 'setting-success';
    successElement.textContent = '設置已成功更新';
    document.body.appendChild(successElement);
  }
  
  // 設置自動消失
  setTimeout(() => {
    if (successElement.parentNode) {
      successElement.style.opacity = '0';
      successElement.style.transform = 'translate(-50%, -20px)';
      
      // 完全移除元素
      setTimeout(() => {
        if (successElement.parentNode) {
          successElement.parentNode.removeChild(successElement);
        }
      }, 300);
    }
  }, 2000);
}

// 切換主題顏色
function changeTheme(color) {
  // 移除所有顏色選項的激活狀態
  const colorOptions = document.querySelectorAll('.color-option');
  colorOptions.forEach(option => option.classList.remove('active'));
  
  // 激活選定的顏色選項
  document.querySelector(`.color-option.${color}`).classList.add('active');
  
  // 更新配置
  aiConfig.theme = color;
  
  // 應用主題顏色
  applyThemeColor();
  
  // 如果啟用了自動保存
  if (aiConfig.autoSave) {
    saveSettingsToLocalStorage();
  }
}

// 應用主題顏色
function applyThemeColor() {
  const root = document.documentElement;
  const themeColors = {
    blue: '#2c5364',
    green: '#2d8879',
    purple: '#6b4e91',
    orange: '#d66853'
  };
  
  root.style.setProperty('--ai-theme-color', themeColors[aiConfig.theme]);
  
  // 更新相關元素顏色
  const elementsToUpdate = [
    '.ai-widget-btn',
    '.ai-widget-header',
    '.tab-btn.active',
    '.chat-input-container button',
    '.tool-card i'
  ];
  
  elementsToUpdate.forEach(selector => {
    const elements = document.querySelectorAll(selector);
    elements.forEach(el => {
      if (selector === '.tool-card i') {
        el.style.color = themeColors[aiConfig.theme];
      } else if (selector === '.tab-btn.active') {
        el.style.color = themeColors[aiConfig.theme];
        el.style.borderBottomColor = themeColors[aiConfig.theme];
      } else {
        el.style.background = themeColors[aiConfig.theme];
      }
    });
  });
}

// 應用字體大小
function applyFontSize() {
  const chatMessages = document.getElementById('chatMessages');
  const fontSizes = {
    small: '12px',
    medium: '14px',
    large: '16px'
  };
  
  chatMessages.style.fontSize = fontSizes[aiConfig.fontSize];
}

// 清除聊天記錄
function clearChatHistory() {
  const messagesElement = document.getElementById('chatMessages');
  messagesElement.innerHTML = '';
  
  // 添加系統消息
  addMessage('ai', "聊天記錄已清除！");
}

// 保存設置到本地存儲
function saveSettingsToLocalStorage() {
  localStorage.setItem('aiWidgetConfig', JSON.stringify(aiConfig));
}

// 從本地存儲加載設置
function loadSettingsFromLocalStorage() {
  const savedConfig = localStorage.getItem('aiWidgetConfig');
  
  if (savedConfig) {
    aiConfig = JSON.parse(savedConfig);
    
    // 應用加載的設置
    document.getElementById('aiName').value = aiConfig.name;
    document.getElementById('fontSize').value = aiConfig.fontSize;
    document.getElementById('autoSave').checked = aiConfig.autoSave;
    document.getElementById('soundNotification').checked = aiConfig.soundNotification;
    
    // 應用主題顏色
    changeTheme(aiConfig.theme);
    
    // 應用字體大小
    applyFontSize();
  }
}

// 播放通知聲音
function playNotificationSound(type) {
  // 在實際應用中，可以創建和播放聲音
  // const sound = new Audio(type === 'sent' ? 'sent.mp3' : 'received.mp3');
  // sound.play();
  
  // 這裡僅用於示範，不實際播放聲音
  console.log(`播放${type === 'sent' ? '發送' : '接收'}消息聲音`);
}

// 頁面加載完成後初始化
document.addEventListener('DOMContentLoaded', function() {
  // 從本地存儲加載設置
  loadSettingsFromLocalStorage();
  
  // 添加歡迎消息
  setTimeout(() => {
    addMessage('ai', `您好！我是${aiConfig.name}，很高興為您服務。您可以通過標籤頁使用不同功能，或直接開始聊天。`);
  }, 500);
});
