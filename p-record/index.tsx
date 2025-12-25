

import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from './styles.module.css';

interface Item {
  name: string;
  price: string;
}

interface RecognitionResult {
  merchant: string;
  amount: string;
  category: string;
  items: Item[];
}

const RecordPage: React.FC = () => {
  const navigate = useNavigate();
  
  // 状态管理
  const [showRecognitionResult, setShowRecognitionResult] = useState(false);
  const [showManualForm, setShowManualForm] = useState(false);
  const [showLoadingModal, setShowLoadingModal] = useState(false);
  const [receiptImageSrc, setReceiptImageSrc] = useState('');
  const [isVoiceRecording, setIsVoiceRecording] = useState(false);
  const [voiceResult, setVoiceResult] = useState('');
  const [showVoiceActions, setShowVoiceActions] = useState(false);
  const [isFileDragOver, setIsFileDragOver] = useState(false);
  
  // 表单状态
  const [quickInputText, setQuickInputText] = useState('');
  const [merchantName, setMerchantName] = useState('识别中...');
  const [amount, setAmount] = useState('0.00');
  const [category, setCategory] = useState('');
  const [account, setAccount] = useState('');
  const [transactionDate, setTransactionDate] = useState('');
  const [transactionTime, setTransactionTime] = useState('');
  const [note, setNote] = useState('');
  const [itemsList, setItemsList] = useState<Item[]>([]);
  
  // 手动记账表单状态
  const [manualMerchant, setManualMerchant] = useState('');
  const [manualAmount, setManualAmount] = useState('');
  const [manualCategory, setManualCategory] = useState('');
  const [manualAccount, setManualAccount] = useState('');
  const [manualDate, setManualDate] = useState('');
  const [manualTime, setManualTime] = useState('');
  const [manualNote, setManualNote] = useState('');
  
  // Refs
  const fileInputRef = useRef<HTMLInputElement>(null);
  const recognitionRef = useRef<any>(null);
  
  // 模拟OCR识别结果
  const mockRecognitionResults: RecognitionResult[] = [
    {
      merchant: '肯德基',
      amount: '45.50',
      category: 'food',
      items: [
        { name: '香辣鸡腿堡', price: '25.00' },
        { name: '薯条(大)', price: '12.50' },
        { name: '可乐(中)', price: '8.00' }
      ]
    },
    {
      merchant: '沃尔玛超市',
      amount: '128.80',
      category: 'daily',
      items: [
        { name: '牛奶', price: '12.80' },
        { name: '面包', price: '8.50' },
        { name: '水果', price: '25.50' },
        { name: '蔬菜', price: '18.00' },
        { name: '日用品', price: '64.00' }
      ]
    },
    {
      merchant: '万达影城',
      amount: '78.00',
      category: 'entertainment',
      items: [
        { name: '电影票', price: '78.00' }
      ]
    }
  ];

  // 设置页面标题
  useEffect(() => {
    const originalTitle = document.title;
    document.title = '记账 - 省点';
    return () => { document.title = originalTitle; };
  }, []);

  // 初始化日期时间为当前时间
  useEffect(() => {
    const now = new Date();
    const dateStr = now.toISOString().split('T')[0];
    const timeStr = now.toTimeString().split(':').slice(0, 2).join(':');
    
    setTransactionDate(dateStr);
    setTransactionTime(timeStr);
    setManualDate(dateStr);
    setManualTime(timeStr);
  }, []);

  // 显示识别结果
  const showRecognitionResultHandler = (resultIndex: number = 0) => {
    const result = mockRecognitionResults[resultIndex];
    
    setMerchantName(result.merchant);
    setAmount(result.amount);
    setCategory(result.category);
    setAccount('alipay'); // 默认选择支付宝
    setItemsList(result.items);
    
    setShowRecognitionResult(true);
    setShowManualForm(false);
  };

  // 模拟OCR识别过程
  const simulateOCRRecognition = () => {
    setShowLoadingModal(true);
    
    setTimeout(() => {
      setShowLoadingModal(false);
      // 随机选择一个模拟结果
      const randomResultIndex = Math.floor(Math.random() * mockRecognitionResults.length);
      showRecognitionResultHandler(randomResultIndex);
    }, 2000);
  };

  // 相机按钮点击事件
  const handleCameraClick = () => {
    console.log('需要调用第三方接口实现相机拍照功能');
    // 注释：此功能需要调用设备相机API，在原型阶段仅做UI展示
    simulateOCRRecognition();
  };

  // 文件上传按钮点击事件
  const handleUploadClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // 文件选择事件
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // 显示文件预览
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          setReceiptImageSrc(e.target.result as string);
        }
      };
      reader.readAsDataURL(file);
      
      // 模拟OCR识别
      simulateOCRRecognition();
    }
  };

  // 拖拽事件处理
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsFileDragOver(true);
  };

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsFileDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsFileDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsFileDragOver(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      const file = files[0];
      if (file.type.startsWith('image/')) {
        // 显示文件预览
        const reader = new FileReader();
        reader.onload = (e) => {
          if (e.target?.result) {
            setReceiptImageSrc(e.target.result as string);
          }
        };
        reader.readAsDataURL(file);
        
        // 模拟OCR识别
        simulateOCRRecognition();
      }
    }
  };

  // 保存账单
  const handleSaveBill = () => {
    // 验证表单
    if (!merchantName.trim() || !amount.trim() || !category || !account || !transactionDate) {
      alert('请填写必填字段');
      return;
    }
    
    // 模拟保存过程
    setShowLoadingModal(true);
    
    setTimeout(() => {
      setShowLoadingModal(false);
      alert('账单保存成功！');
      navigate('/p-home');
    }, 1000);
  };

  // 重新识别
  const handleResetRecognition = () => {
    setShowRecognitionResult(false);
    setShowManualForm(false);
    setReceiptImageSrc('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // 手动记账保存
  const handleManualSave = () => {
    // 验证表单
    if (!manualMerchant.trim() || !manualAmount.trim() || !manualCategory || !manualAccount || !manualDate) {
      alert('请填写必填字段');
      return;
    }
    
    // 模拟保存过程
    setShowLoadingModal(true);
    
    setTimeout(() => {
      setShowLoadingModal(false);
      alert('账单保存成功！');
      navigate('/p-home');
    }, 1000);
  };

  // 返回识别
  const handleBackToRecognition = () => {
    setShowManualForm(false);
    setShowRecognitionResult(false);
  };

  // 快速输入记账
  const handleQuickInput = () => {
    const inputText = quickInputText.trim();
    if (!inputText) {
      alert('请输入记账信息');
      return;
    }
    
    // 简单解析输入文本
    const parts = inputText.split(/\s+/);
    let merchant = '';
    let amountValue = '';
    let categoryValue = '';
    let accountValue = '';
    
    // 尝试提取金额
    for (let i = 0; i < parts.length; i++) {
      if (!isNaN(parseFloat(parts[i])) && parts[i].indexOf('.') !== -1) {
        amountValue = parts[i];
        merchant = parts.slice(0, i).join(' ');
        
        // 尝试提取分类和支付方式
        if (parts.length > i + 1) {
          const remainingParts = parts.slice(i + 1);
          // 检查是否有已知的分类或支付方式
          const categories = ['餐饮', '食品', '日常', '交通', '住房', '娱乐', '购物', '医疗', '教育'];
          const accounts = ['现金', '支付宝', '微信', '银行卡'];
          
          for (let j = 0; j < remainingParts.length; j++) {
            const part = remainingParts[j];
            if (categories.some(cat => part.includes(cat)) && !categoryValue) {
              categoryValue = getCategoryValue(part);
            } else if (accounts.some(acc => part.includes(acc)) && !accountValue) {
              accountValue = getAccountValue(part);
            }
          }
        }
        break;
      }
    }
    
    if (!merchant || !amountValue) {
      alert('无法识别记账信息，请按照格式输入');
      return;
    }
    
    // 填充表单并显示识别结果
    setMerchantName(merchant);
    setAmount(amountValue);
    if (categoryValue) setCategory(categoryValue);
    if (accountValue) setAccount(accountValue);
    
    // 清空商品明细
    setItemsList([]);
    
    // 显示识别结果区域
    setShowRecognitionResult(true);
    setShowManualForm(false);
    
    // 清空输入框
    setQuickInputText('');
  };

  // 快速输入帮助
  const handleQuickInputHelp = () => {
    alert('快速输入格式说明：\n\n1. 基本格式：商家名称 金额\n   例如：肯德基 45.5\n\n2. 完整格式：商家名称 金额 分类 支付方式\n   例如：沃尔玛 128.8 日常 微信\n\n支持的分类：餐饮、食品、日常、交通、住房、娱乐、购物、医疗、教育\n支持的支付方式：现金、支付宝、微信、银行卡');
  };

  // 语音识别
  const handleVoiceInput = () => {
    if (isVoiceRecording) {
      stopVoiceRecognition();
    } else {
      startVoiceRecognition();
    }
  };

  const startVoiceRecognition = () => {
    // 检查浏览器是否支持语音识别
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || (window as any).webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.lang = 'zh-CN';
      recognitionRef.current.interimResults = false;
      
      recognitionRef.current.onresult = (event: any) => {
        const speechResult = event.results[0][0].transcript;
        setVoiceResult(speechResult);
        setShowVoiceActions(true);
        stopVoiceRecognition();
      };
      
      recognitionRef.current.onend = () => {
        if (isVoiceRecording) {
          stopVoiceRecognition();
          alert('语音识别超时，请重试');
        }
      };
      
      recognitionRef.current.onerror = (event: any) => {
        stopVoiceRecognition();
        alert('语音识别出错：' + event.error);
      };
      
      setIsVoiceRecording(true);
    } else {
      alert('您的浏览器不支持语音识别功能');
    }
  };

  const stopVoiceRecognition = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      recognitionRef.current = null;
    }
    setIsVoiceRecording(false);
  };

  const resetVoiceRecognition = () => {
    stopVoiceRecognition();
    setVoiceResult('');
    setShowVoiceActions(false);
  };

  const handleVoiceConfirm = () => {
    if (voiceResult.trim()) {
      // 使用语音识别结果填充快速输入框并触发记账
      setQuickInputText(voiceResult);
      handleQuickInput();
    }
    resetVoiceRecognition();
  };

  // 语音取消函数
  const handleVoiceCancel = () => {
    resetVoiceRecognition();
  };



  return (
    <div className={styles.pageWrapper}>
      {/* 顶部导航栏 */}
      <header className="fixed top-0 left-0 right-0 bg-white border-b border-border-light h-16 z-50">
        <div className="flex items-center justify-between h-full px-6">
          {/* Logo和品牌 */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-secondary rounded-lg flex items-center justify-center">
              <i className="fas fa-piggy-bank text-white text-lg"></i>
            </div>
            <h1 className="text-xl font-bold text-text-primary">省点</h1>
          </div>
          
          {/* 全局搜索 */}
          <div className="flex-1 max-w-md mx-8">
            <div className="relative">
              <input 
                type="text" 
                placeholder="搜索账单、商家..." 
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent"
              />
              <i className="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
            </div>
          </div>
          
          {/* 用户操作区 */}
          <div className="flex items-center space-x-4">
            {/* 消息通知 */}
            
            {/* 用户头像 */}
            <div className="flex items-center space-x-2 cursor-pointer">
              <img 
                src="https://s.coze.cn/image/9c0vg9EltC0/" 
                alt="用户头像" 
                className="w-8 h-8 rounded-full" 
              />
              <span className="text-sm font-medium text-text-primary">张三</span>
            </div>
          </div>
        </div>
      </header>

      {/* 主布局容器 */}
      <div className="flex pt-16">
        {/* 左侧菜单 */}
        <aside className={`fixed left-0 top-16 bottom-0 w-64 bg-white border-r border-border-light z-40 ${styles.sidebarTransition}`}>
          <nav className="p-4">
            <ul className="space-y-2">
              <li>
                <Link to="/home" className={`${styles.navItem} flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium text-gray-600`}>
                  <i className="fas fa-home text-lg"></i>
                  <span>首页</span>
                </Link>
              </li>
              <li>
                <Link to="/record" className={`${styles.navItem} ${styles.navItemActive} flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium`}>
                  <i className="fas fa-camera text-lg"></i>
                  <span>记账</span>
                </Link>
              </li>
              <li>
                <Link to="/analysis" className={`${styles.navItem} flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium text-gray-600`}>
                  <i className="fas fa-chart-pie text-lg"></i>
                  <span>消费分析</span>
                </Link>
              </li>
              <li>
                <Link to="/history" className={`${styles.navItem} flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium text-gray-600`}>
                  <i className="fas fa-history text-lg"></i>
                  <span>历史记录</span>
                </Link>
              </li>
              <li>
                <Link to="/recommend" className={`${styles.navItem} flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium text-gray-600`}>
                  <i className="fas fa-gift text-lg"></i>
                  <span>省钱推荐</span>
                </Link>
              </li>
              <li>
                <Link to="/budget" className={`${styles.navItem} flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium text-gray-600`}>
                  <i className="fas fa-wallet text-lg"></i>
                  <span>预算设置</span>
                </Link>
              </li>
              <li>
                <Link to="/account" className={`${styles.navItem} flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium text-gray-600`}>
                  <i className="fas fa-credit-card text-lg"></i>
                  <span>账户管理</span>
                </Link>
              </li>
              <li>
                <Link to="/settings" className={`${styles.navItem} flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium text-gray-600`}>
                  <i className="fas fa-cog text-lg"></i>
                  <span>设置</span>
                </Link>
              </li>
            </ul>
          </nav>
        </aside>

        {/* 主内容区 */}
        <main className="flex-1 ml-64 p-6 min-h-screen">
          {/* 页面头部 */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-text-primary mb-2">记账</h2>
                <nav className="text-sm text-text-secondary">
                  <Link to="/home" className="hover:text-secondary">首页</Link>
                  <span className="mx-2">{'>'}</span>
                  <span>记账</span>
                </nav>
              </div>
            </div>
          </div>

          {/* 主要内容区域 */}
          <div className="space-y-6">
            {/* 快速输入和语音记账模块合并为一行 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* 打字直接输入记账模块 */}
              <section className={`bg-white rounded-2xl shadow-card p-6 ${styles.cardHover}`}>
                <h3 className="text-lg font-semibold text-text-primary mb-4">快速输入记账</h3>
                <div className="space-y-4">
                  <div className="relative">
                    <input 
                      type="text" 
                      placeholder="例如：肯德基 45.5 餐饮 支付宝" 
                      value={quickInputText}
                      onChange={(e) => setQuickInputText(e.target.value)}
                      className={`w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg text-lg ${styles.formInputFocus}`}
                    />
                    <i className="fas fa-keyboard absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl"></i>
                  </div>
                  <p className="text-sm text-text-secondary">
                    <i className="fas fa-info-circle mr-1"></i>
                    支持格式：商家名称 金额 分类 支付方式（分类和支付方式可选）
                  </p>
                  <div className="flex space-x-4">
                    <button 
                      onClick={handleQuickInput}
                      className="flex-1 bg-green-500 text-white py-3 rounded-lg font-medium hover:bg-green-600 transition-colors flex items-center justify-center space-x-2"
                    >
                      <i className="fas fa-check"></i>
                      <span>确认记账</span>
                    </button>
                    <button 
                      onClick={handleQuickInputHelp}
                      className="px-6 bg-gray-200 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-300 transition-colors"
                    >
                      <i className="fas fa-question-circle"></i>
                    </button>
                  </div>
                </div>
              </section>
              
              {/* 语音识别记账模块 */}
              <section className={`bg-white rounded-2xl shadow-card p-6 ${styles.cardHover}`}>
                <h3 className="text-lg font-semibold text-text-primary mb-4">语音识别记账</h3>
                <div className="flex flex-col items-center justify-center py-8">
                  <button 
                    onClick={handleVoiceInput}
                    className={`w-24 h-24 rounded-full flex items-center justify-center text-white shadow-lg transition-colors mb-4 ${
                      isVoiceRecording 
                        ? 'bg-red-500 hover:bg-red-600 animate-pulse' 
                        : 'bg-purple-500 hover:bg-purple-600'
                    }`}
                  >
                    <i className="fas fa-microphone text-3xl"></i>
                  </button>
                  <p className="text-text-secondary mb-2">
                    {isVoiceRecording ? '正在聆听，请说话...' : '点击麦克风开始语音输入'}
                  </p>
                  {voiceResult && (
                    <p className="text-text-primary font-medium mb-2">{voiceResult}</p>
                  )}
                  {showVoiceActions && (
                    <div className="flex space-x-4 mt-4">
                      <button 
                        onClick={handleVoiceConfirm}
                        className="px-6 bg-green-500 text-white py-2 rounded-lg font-medium hover:bg-green-600 transition-colors"
                      >
                        确认
                      </button>
                      <button 
                        onClick={handleVoiceCancel}
                        className="px-6 bg-gray-200 text-gray-700 py-2 rounded-lg font-medium hover:bg-gray-300 transition-colors"
                      >
                        取消
                      </button>
                    </div>
                  )}
                </div>
              </section>
            </div>
            
            {/* 拍照/上传区域 */}
            <section className={`bg-white rounded-2xl shadow-card p-6 ${styles.cardHover}`}>
              <h3 className="text-lg font-semibold text-text-primary mb-4">小票识别</h3>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* 拍照区域 */}
                <div className="space-y-4">
                  <div 
                    className={`${styles.uploadArea} rounded-xl p-8 text-center cursor-pointer`}
                    onClick={handleCameraClick}
                  >
                    <div className="space-y-3">
                      <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center mx-auto">
                        <i className="fas fa-camera text-white text-2xl"></i>
                      </div>
                      <h4 className="font-medium text-text-primary">拍照识别</h4>
                      <p className="text-sm text-text-secondary">点击启动摄像头拍摄小票</p>
                    </div>
                  </div>
                  <button 
                    onClick={handleCameraClick}
                    className="w-full bg-secondary text-white py-3 rounded-lg font-medium hover:bg-yellow-500 transition-colors flex items-center justify-center space-x-2"
                  >
                    <i className="fas fa-camera"></i>
                    <span>启动摄像头</span>
                  </button>
                </div>

                {/* 上传区域 */}
                <div className="space-y-4">
                  <div 
                    className={`${styles.uploadArea} ${isFileDragOver ? styles.uploadAreaDragover : ''} rounded-xl p-8 text-center cursor-pointer`}
                    onDragOver={handleDragOver}
                    onDragEnter={handleDragEnter}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    onClick={handleUploadClick}
                  >
                    <div className="space-y-3">
                      <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto">
                        <i className="fas fa-upload text-white text-2xl"></i>
                      </div>
                      <h4 className="font-medium text-text-primary">上传图片</h4>
                      <p className="text-sm text-text-secondary">支持 JPG、PNG 格式，拖拽文件到此处或点击选择</p>
                    </div>
                  </div>
                  <button 
                    onClick={handleUploadClick}
                    className="w-full bg-blue-500 text-white py-3 rounded-lg font-medium hover:bg-blue-600 transition-colors flex items-center justify-center space-x-2"
                  >
                    <i className="fas fa-folder-open"></i>
                    <span>选择文件</span>
                  </button>
                  <input 
                    type="file" 
                    ref={fileInputRef}
                    accept="image/*" 
                    className="hidden"
                    onChange={handleFileChange}
                  />
                </div>
              </div>
            </section>

            {/* 识别结果展示区 */}
            {showRecognitionResult && (
              <section className={`bg-white rounded-2xl shadow-card p-6 ${styles.cardHover}`}>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-text-primary">识别结果</h3>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm text-green-600 font-medium">识别成功</span>
                  </div>
                </div>
                
                {/* 识别出的小票图片预览 */}
                {receiptImageSrc && (
                  <div className="mb-6">
                    <img 
                      src={receiptImageSrc} 
                      alt="小票预览" 
                      className="max-w-md mx-auto rounded-lg shadow-md"
                    />
                  </div>
                )}

                {/* 识别出的信息 */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-text-primary mb-2">商家名称</label>
                      <input 
                        type="text" 
                        value={merchantName}
                        onChange={(e) => setMerchantName(e.target.value)}
                        className={`w-full px-4 py-2 border border-gray-300 rounded-lg ${styles.formInputFocus}`}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-text-primary mb-2">消费金额</label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-secondary">¥</span>
                        <input 
                          type="number" 
                          value={amount}
                          onChange={(e) => setAmount(e.target.value)}
                          step="0.01" 
                          min="0" 
                          className={`w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg ${styles.formInputFocus}`}
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-text-primary mb-2">消费分类</label>
                      <select 
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className={`w-full px-4 py-2 border border-gray-300 rounded-lg ${styles.formInputFocus}`}
                      >
                        <option value="">请选择分类</option>
                        <option value="food">食品餐饮</option>
                        <option value="daily">日常用品</option>
                        <option value="transport">交通出行</option>
                        <option value="housing">住房缴费</option>
                        <option value="entertainment">休闲娱乐</option>
                        <option value="shopping">购物消费</option>
                        <option value="medical">医疗健康</option>
                        <option value="education">教育培训</option>
                      </select>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-text-primary mb-2">消费账户</label>
                      <select 
                        value={account}
                        onChange={(e) => setAccount(e.target.value)}
                        className={`w-full px-4 py-2 border border-gray-300 rounded-lg ${styles.formInputFocus}`}
                      >
                        <option value="">请选择账户</option>
                        <option value="cash">现金</option>
                        <option value="alipay">支付宝</option>
                        <option value="wechat">微信支付</option>
                        <option value="bank">银行卡</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-text-primary mb-2">消费日期</label>
                      <input 
                        type="date" 
                        value={transactionDate}
                        onChange={(e) => setTransactionDate(e.target.value)}
                        className={`w-full px-4 py-2 border border-gray-300 rounded-lg ${styles.formInputFocus}`}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-text-primary mb-2">消费时间</label>
                      <input 
                        type="time" 
                        value={transactionTime}
                        onChange={(e) => setTransactionTime(e.target.value)}
                        className={`w-full px-4 py-2 border border-gray-300 rounded-lg ${styles.formInputFocus}`}
                      />
                    </div>
                  </div>
                </div>

                {/* 商品明细 */}
                {itemsList.length > 0 && (
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-text-primary mb-3">商品明细</label>
                    <div className="space-y-2">
                      {itemsList.map((item, index) => (
                        <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                          <span className="text-sm text-text-primary">{item.name}</span>
                          <span className="text-sm font-medium text-text-primary">¥{item.price}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 备注 */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-text-primary mb-2">备注</label>
                  <textarea 
                    rows={3} 
                    placeholder="添加备注信息..." 
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    className={`w-full px-4 py-2 border border-gray-300 rounded-lg resize-none ${styles.formInputFocus}`}
                  />
                </div>

                {/* 操作按钮 */}
                <div className="flex space-x-4">
                  <button 
                    onClick={handleSaveBill}
                    className="flex-1 bg-secondary text-white py-3 rounded-lg font-medium hover:bg-yellow-500 transition-colors flex items-center justify-center space-x-2"
                  >
                    <i className="fas fa-save"></i>
                    <span>保存账单</span>
                  </button>
                  <button 
                    onClick={handleResetRecognition}
                    className="px-6 bg-gray-200 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-300 transition-colors"
                  >
                    重新识别
                  </button>
                </div>
              </section>
            )}

            {/* 手动记账表单 */}
            {showManualForm && (
              <section className={`bg-white rounded-2xl shadow-card p-6 ${styles.cardHover}`}>
                <h3 className="text-lg font-semibold text-text-primary mb-4">手动记账</h3>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-text-primary mb-2">商家名称 *</label>
                      <input 
                        type="text" 
                        placeholder="请输入商家名称" 
                        value={manualMerchant}
                        onChange={(e) => setManualMerchant(e.target.value)}
                        className={`w-full px-4 py-2 border border-gray-300 rounded-lg ${styles.formInputFocus}`}
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-text-primary mb-2">消费金额 *</label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-secondary">¥</span>
                        <input 
                          type="number" 
                          placeholder="0.00" 
                          step="0.01" 
                          min="0" 
                          value={manualAmount}
                          onChange={(e) => setManualAmount(e.target.value)}
                          className={`w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg ${styles.formInputFocus}`}
                          required
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-text-primary mb-2">消费分类 *</label>
                      <select 
                        value={manualCategory}
                        onChange={(e) => setManualCategory(e.target.value)}
                        className={`w-full px-4 py-2 border border-gray-300 rounded-lg ${styles.formInputFocus}`}
                        required
                      >
                        <option value="">请选择分类</option>
                        <option value="food">食品餐饮</option>
                        <option value="daily">日常用品</option>
                        <option value="transport">交通出行</option>
                        <option value="housing">住房缴费</option>
                        <option value="entertainment">休闲娱乐</option>
                        <option value="shopping">购物消费</option>
                        <option value="medical">医疗健康</option>
                        <option value="education">教育培训</option>
                      </select>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-text-primary mb-2">消费账户 *</label>
                      <select 
                        value={manualAccount}
                        onChange={(e) => setManualAccount(e.target.value)}
                        className={`w-full px-4 py-2 border border-gray-300 rounded-lg ${styles.formInputFocus}`}
                        required
                      >
                        <option value="">请选择账户</option>
                        <option value="cash">现金</option>
                        <option value="alipay">支付宝</option>
                        <option value="wechat">微信支付</option>
                        <option value="bank">银行卡</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-text-primary mb-2">消费日期 *</label>
                      <input 
                        type="date" 
                        value={manualDate}
                        onChange={(e) => setManualDate(e.target.value)}
                        className={`w-full px-4 py-2 border border-gray-300 rounded-lg ${styles.formInputFocus}`}
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-text-primary mb-2">消费时间</label>
                      <input 
                        type="time" 
                        value={manualTime}
                        onChange={(e) => setManualTime(e.target.value)}
                        className={`w-full px-4 py-2 border border-gray-300 rounded-lg ${styles.formInputFocus}`}
                      />
                    </div>
                  </div>
                </div>

                {/* 备注 */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-text-primary mb-2">备注</label>
                  <textarea 
                    rows={3} 
                    placeholder="添加备注信息..." 
                    value={manualNote}
                    onChange={(e) => setManualNote(e.target.value)}
                    className={`w-full px-4 py-2 border border-gray-300 rounded-lg resize-none ${styles.formInputFocus}`}
                  />
                </div>

                {/* 操作按钮 */}
                <div className="flex space-x-4">
                  <button 
                    onClick={handleManualSave}
                    className="flex-1 bg-secondary text-white py-3 rounded-lg font-medium hover:bg-yellow-500 transition-colors flex items-center justify-center space-x-2"
                  >
                    <i className="fas fa-save"></i>
                    <span>保存账单</span>
                  </button>
                  <button 
                    onClick={handleBackToRecognition}
                    className="px-6 bg-gray-200 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-300 transition-colors"
                  >
                    返回识别
                  </button>
                </div>
              </section>
            )}
          </div>
        </main>
      </div>

      {/* 识别中加载弹窗 */}
      {showLoadingModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-8 text-center">
            <div className={`w-16 h-16 border-4 border-secondary border-t-transparent rounded-full mx-auto mb-4 ${styles.loadingSpinner}`}></div>
            <h3 className="text-lg font-semibold text-text-primary mb-2">正在识别小票...</h3>
            <p className="text-sm text-text-secondary">请稍候，正在分析小票内容</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default RecordPage;

