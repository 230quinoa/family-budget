

import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Chart, registerables } from 'chart.js';
import styles from './styles.module.css';

Chart.register(...registerables);

interface ChatMessage {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
}

interface ExpenseItem {
  id: string;
  merchant: string;
  amount: number;
  category: string;
  paymentMethod: string;
  time: string;
  icon: string;
  iconBg: string;
}

const AnalysisPage: React.FC = () => {
  const navigate = useNavigate();
  const [selectedTimeRange, setSelectedTimeRange] = useState('month');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [aiInputValue, setAiInputValue] = useState('');
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([
    {
      id: 'initial',
      type: 'ai',
      content: '你好！我是你的智能消费助手。我已经分析了你的消费数据，发现你本月的食品餐饮支出占比较高。需要我为你提供更详细的消费建议或规划吗？',
      timestamp: new Date()
    }
  ]);
  const [isAiTyping, setIsAiTyping] = useState(false);
  const chatHistoryRef = useRef<HTMLDivElement>(null);
  const pieChartRef = useRef<HTMLCanvasElement>(null);
  const lineChartRef = useRef<HTMLCanvasElement>(null);
  const pieChartInstanceRef = useRef<Chart | null>(null);
  const lineChartInstanceRef = useRef<Chart | null>(null);

  const expenseData: ExpenseItem[] = [
    {
      id: 'txn1',
      merchant: '肯德基',
      amount: 45.50,
      category: 'food',
      paymentMethod: '支付宝',
      time: '今天 12:30 · 食品餐饮',
      icon: 'fas fa-utensils',
      iconBg: 'bg-red-100 text-red-500'
    },
    {
      id: 'txn2',
      merchant: '地铁出行',
      amount: 6.00,
      category: 'transport',
      paymentMethod: '交通卡',
      time: '昨天 08:15 · 交通出行',
      icon: 'fas fa-bus',
      iconBg: 'bg-blue-100 text-blue-500'
    },
    {
      id: 'txn3',
      merchant: '沃尔玛超市',
      amount: 128.80,
      category: 'daily',
      paymentMethod: '微信支付',
      time: '昨天 19:20 · 日常用品',
      icon: 'fas fa-shopping-cart',
      iconBg: 'bg-green-100 text-green-500'
    },
    {
      id: 'txn4',
      merchant: '万达影城',
      amount: 78.00,
      category: 'entertainment',
      paymentMethod: '支付宝',
      time: '2天前 14:30 · 休闲娱乐',
      icon: 'fas fa-film',
      iconBg: 'bg-purple-100 text-purple-500'
    },
    {
      id: 'txn5',
      merchant: '星巴克',
      amount: 32.00,
      category: 'food',
      paymentMethod: '信用卡',
      time: '3天前 15:45 · 食品餐饮',
      icon: 'fas fa-coffee',
      iconBg: 'bg-red-100 text-red-500'
    }
  ];

  const categories = [
    { id: 'all', name: '全部', amount: 2040, color: '' },
    { id: 'food', name: '食品餐饮', amount: 850, percentage: 42, color: 'bg-red-500' },
    { id: 'transport', name: '交通出行', amount: 320, percentage: 16, color: 'bg-blue-500' },
    { id: 'daily', name: '日常用品', amount: 450, percentage: 22, color: 'bg-green-500' },
    { id: 'entertainment', name: '休闲娱乐', amount: 420, percentage: 14, color: 'bg-purple-500' }
  ];

  useEffect(() => {
    const originalTitle = document.title;
    document.title = '消费分析 - 省点';
    return () => { document.title = originalTitle; };
  }, []);

  useEffect(() => {
    initializeCharts();
    return () => {
      if (pieChartInstanceRef.current) {
        pieChartInstanceRef.current.destroy();
        pieChartInstanceRef.current = null;
      }
      if (lineChartInstanceRef.current) {
        lineChartInstanceRef.current.destroy();
        lineChartInstanceRef.current = null;
      }
    };
  }, []);

  const initializeCharts = () => {
    // 饼图数据
    if (pieChartRef.current) {
      const pieCtx = pieChartRef.current.getContext('2d');
      if (pieCtx) {
        pieChartInstanceRef.current = new Chart(pieCtx, {
          type: 'doughnut',
          data: {
            labels: ['食品餐饮', '交通出行', '日常用品', '休闲娱乐'],
            datasets: [{
              data: [850, 320, 450, 420],
              backgroundColor: ['#ef4444', '#3b82f6', '#10b981', '#8b5cf6'],
              borderWidth: 0
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                display: false
              }
            }
          }
        });
      }
    }

    // 折线图数据
    if (lineChartRef.current) {
      const lineCtx = lineChartRef.current.getContext('2d');
      if (lineCtx) {
        lineChartInstanceRef.current = new Chart(lineCtx, {
          type: 'line',
          data: {
            labels: ['1日', '5日', '10日', '15日', '20日', '25日', '今天'],
            datasets: [{
              label: '消费金额',
              data: [150, 320, 280, 450, 380, 220, 45.5],
              borderColor: '#F1D151',
              backgroundColor: 'rgba(241, 209, 81, 0.1)',
              borderWidth: 3,
              fill: true,
              tension: 0.4
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                display: false
              }
            },
            scales: {
              y: {
                beginAtZero: true,
                grid: {
                  color: '#f3f4f6'
                }
              },
              x: {
                grid: {
                  display: false
                }
              }
            }
          }
        });
      }
    }
  };

  const handleTimeRangeChange = (range: string) => {
    setSelectedTimeRange(range);
    console.log('时间范围切换到:', range);
  };

  const handleCategoryChange = (categoryId: string) => {
    setSelectedCategory(categoryId);
  };

  const handleExpenseItemClick = (transactionId: string) => {
    console.log('打开账单详情:', transactionId);
    navigate(`/transaction-edit?transactionId=${transactionId}`);
  };

  const scrollToBottom = () => {
    if (chatHistoryRef.current) {
      chatHistoryRef.current.scrollTop = chatHistoryRef.current.scrollHeight;
    }
  };

  const generateAIResponse = (question: string): string => {
    const lowerQuestion = question.toLowerCase();
    
    if (lowerQuestion.includes('餐饮') || lowerQuestion.includes('吃')) {
      return '根据你的消费数据，食品餐饮占总支出的42%，确实偏高。建议你可以：1) 每周在家做饭3-4次，减少外卖次数；2) 制定每周采购计划，避免冲动购买；3) 选择性价比更高的餐厅或时段就餐。这样每月预计可以节省约200-300元。';
    } else if (lowerQuestion.includes('预算') || lowerQuestion.includes('支撑')) {
      return '你本月总预算为3000元，已使用2040元，剩余960元。按照你最近的消费趋势，平均每天消费约127.5元。如果保持当前消费水平，剩余预算大约还能支撑7-8天。建议适当控制接下来的支出。';
    } else if (lowerQuestion.includes('优化') || lowerQuestion.includes('结构')) {
      return '你的消费结构中，食品餐饮(42%)和日常用品(22%)占比较高。建议优化方案：1) 减少外出就餐频率，增加自制餐食；2) 制定购物清单，避免不必要的日常用品购买；3) 考虑使用优惠券和比价工具。这样可以将食品支出控制在30%以内，整体消费结构会更加健康。';
    } else if (lowerQuestion.includes('省钱') || lowerQuestion.includes('计划')) {
      return '为你定制的省钱计划：\n1. 每日餐饮预算控制在50元以内\n2. 每周设置1-2天"零消费日"\n3. 购物前等待24小时，避免冲动消费\n4. 优先使用现金或借记卡，减少信用卡使用\n5. 记录每一笔支出，每周回顾分析\n按照这个计划执行，预计每月可节省500-800元。';
    } else {
      return '感谢你的提问！根据你的消费数据分析，我发现你在食品餐饮方面的支出占比较高。如果你有具体的问题，比如如何减少某类支出、如何制定预算计划等，我可以为你提供更有针对性的建议。';
    }
  };

  const sendMessage = () => {
    const message = aiInputValue.trim();
    if (message === '') return;
    
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: message,
      timestamp: new Date()
    };
    
    setChatHistory(prev => [...prev, userMessage]);
    setAiInputValue('');
    setIsAiTyping(true);
    scrollToBottom();
    
    setTimeout(() => {
      const aiResponse: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: generateAIResponse(message),
        timestamp: new Date()
      };
      
      setChatHistory(prev => [...prev, aiResponse]);
      setIsAiTyping(false);
      scrollToBottom();
    }, 1500);
  };

  const handleQuickQuestion = (question: string) => {
    setAiInputValue(question);
    sendMessage();
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      sendMessage();
    }
  };

  const getCurrentCategoryName = () => {
    const category = categories.find(c => c.id === selectedCategory);
    return category ? category.name : '全部消费';
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
            <button className="relative p-2 text-gray-600 hover:text-accent">
            </button>
            
            {/* 用户头像 */}
            <div className="flex items-center space-x-2 cursor-pointer">
              <img 
                src="https://s.coze.cn/image/Su8MccW5mZE/" 
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
                <Link to="/record" className={`${styles.navItem} flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium text-gray-600`}>
                  <i className="fas fa-camera text-lg"></i>
                  <span>记账</span>
                </Link>
              </li>
              <li>
                <Link to="/analysis" className={`${styles.navItem} ${styles.navItemActive} flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium`}>
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
                <h2 className="text-2xl font-bold text-text-primary mb-2">消费分析</h2>
                <nav className="text-sm text-text-secondary">
                  <Link to="/home" className="hover:text-secondary">首页</Link>
                  <span className="mx-2">{'>'}</span>
                  <span>消费分析</span>
                </nav>
              </div>
            </div>
          </div>

          {/* 时间选择器 */}
          <section className="bg-white rounded-2xl shadow-card p-6 mb-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-text-primary">时间范围</h3>
              <div className="flex space-x-2">
                <button 
                  onClick={() => handleTimeRangeChange('week')}
                  className={`${styles.timeSelectorBtn} px-4 py-2 rounded-lg text-sm font-medium border border-gray-300 ${selectedTimeRange === 'week' ? styles.timeSelectorBtnActive : ''}`}
                >
                  本周
                </button>
                <button 
                  onClick={() => handleTimeRangeChange('month')}
                  className={`${styles.timeSelectorBtn} px-4 py-2 rounded-lg text-sm font-medium border border-gray-300 ${selectedTimeRange === 'month' ? styles.timeSelectorBtnActive : ''}`}
                >
                  本月
                </button>
                <button 
                  onClick={() => handleTimeRangeChange('quarter')}
                  className={`${styles.timeSelectorBtn} px-4 py-2 rounded-lg text-sm font-medium border border-gray-300 ${selectedTimeRange === 'quarter' ? styles.timeSelectorBtnActive : ''}`}
                >
                  本季度
                </button>
                <button 
                  onClick={() => handleTimeRangeChange('year')}
                  className={`${styles.timeSelectorBtn} px-4 py-2 rounded-lg text-sm font-medium border border-gray-300 ${selectedTimeRange === 'year' ? styles.timeSelectorBtnActive : ''}`}
                >
                  本年
                </button>
              </div>
            </div>
          </section>

          {/* 主要图表区域 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {/* 消费占比饼图 */}
            <section className={`bg-white rounded-2xl shadow-card p-6 ${styles.cardHover}`}>
              <h3 className="text-lg font-semibold text-text-primary mb-4">消费占比</h3>
              <div className={styles.chartContainer}>
                <canvas ref={pieChartRef}></canvas>
              </div>
              <div className="mt-4 space-y-2">
                {categories.map((category) => (
                  <div 
                    key={category.id}
                    onClick={() => handleCategoryChange(category.id)}
                    className={`${styles.categoryItem} p-3 rounded-lg ${selectedCategory === category.id ? styles.categoryItemActive : ''}`}
                  >
                    <div className="flex items-center justify-between">
                      {category.id === 'all' ? (
                        <>
                          <span className="font-medium text-text-primary">{category.name}</span>
                          <span className="text-text-secondary">¥{category.amount.toLocaleString()}</span>
                        </>
                      ) : (
                        <div className="flex items-center space-x-2">
                          <div className={`w-3 h-3 ${category.color} rounded-full`}></div>
                          <span className="font-medium text-text-primary">{category.name}</span>
                          <span className="text-text-secondary ml-auto">¥{category.amount.toLocaleString()} ({category.percentage}%)</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* 消费趋势折线图 */}
            <section className={`bg-white rounded-2xl shadow-card p-6 ${styles.cardHover}`}>
              <h3 className="text-lg font-semibold text-text-primary mb-4">消费趋势</h3>
              <div className={styles.chartContainer}>
                <canvas ref={lineChartRef}></canvas>
              </div>
            </section>
          </div>

          {/* 文字总结与超支提醒 */}
          <section className={`bg-white rounded-2xl shadow-card p-6 mb-6 ${styles.cardHover}`}>
            <h3 className="text-lg font-semibold text-text-primary mb-4">消费总结</h3>
            <div className="space-y-4">
              <div className="p-4 bg-green-50 border-l-4 border-green-400 rounded">
                <div className="flex items-center space-x-2 mb-2">
                  <i className="fas fa-check-circle text-green-500"></i>
                  <span className="font-medium text-green-800">预算控制良好</span>
                </div>
                <p className="text-green-700 text-sm">本月消费¥2,040，控制在预算范围内，还有¥960的剩余空间。</p>
              </div>
              
              <div className="p-4 bg-yellow-50 border-l-4 border-yellow-400 rounded">
                <div className="flex items-center space-x-2 mb-2">
                  <i className="fas fa-info-circle text-yellow-500"></i>
                  <span className="font-medium text-yellow-800">消费建议</span>
                </div>
                <p className="text-yellow-700 text-sm">食品餐饮占比较高（42%），可以考虑在家做饭来节省开支。</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-text-primary">¥2,040</div>
                  <div className="text-sm text-text-secondary">总消费</div>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">¥960</div>
                  <div className="text-sm text-text-secondary">剩余预算</div>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-red-600">42%</div>
                  <div className="text-sm text-text-secondary">食品占比</div>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">16天</div>
                  <div className="text-sm text-text-secondary">本月剩余</div>
                </div>
              </div>
            </div>
          </section>
          
          {/* AI智能助手区域 */}
          <section className={`bg-white rounded-2xl shadow-card p-6 mb-6 ${styles.cardHover}`}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-text-primary flex items-center">
                <i className="fas fa-robot text-blue-500 mr-2"></i>
                智能消费助手
              </h3>
              <span className="text-xs px-2 py-1 bg-green-100 text-green-800 rounded-full">
                <i className="fas fa-circle text-green-500 text-[8px] mr-1"></i>在线
              </span>
            </div>
            
            {/* AI对话区域 */}
            <div className="h-80 flex flex-col">
              {/* 对话历史 */}
              <div ref={chatHistoryRef} className="flex-1 overflow-y-auto p-4 bg-gray-50 rounded-lg mb-4 space-y-4">
                {chatHistory.map((message) => (
                  <div key={message.id} className={`flex items-start ${message.type === 'user' ? 'justify-end' : ''}`}>
                    {message.type === 'ai' && (
                      <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mr-3">
                        <i className="fas fa-robot text-blue-500 text-sm"></i>
                      </div>
                    )}
                    <div className={`p-3 rounded-lg max-w-[80%] ${message.type === 'ai' ? 'bg-blue-50 rounded-tl-none' : 'bg-secondary/10 rounded-tr-none'}`}>
                      <p className="text-sm text-text-primary whitespace-pre-line">{message.content}</p>
                    </div>
                    {message.type === 'user' && (
                      <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0 ml-3">
                        <i className="fas fa-user text-gray-500 text-sm"></i>
                      </div>
                    )}
                  </div>
                ))}
                
                {isAiTyping && (
                  <div className={styles.typingIndicator}>
                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mr-3">
                      <i className="fas fa-robot text-blue-500 text-sm"></i>
                    </div>
                    <div className="bg-blue-50 p-3 rounded-lg rounded-tl-none">
                      <div className="flex space-x-1">
                        <div className={`${styles.typingDot}`}></div>
                        <div className={`${styles.typingDot}`}></div>
                        <div className={`${styles.typingDot}`}></div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              
              {/* 输入区域 */}
              <div className="flex items-center space-x-2">
                <input 
                  type="text" 
                  value={aiInputValue}
                  onChange={(e) => setAiInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="向AI助手提问，例如：如何减少餐饮支出？" 
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent"
                />
                <button 
                  onClick={sendMessage}
                  className="w-10 h-10 bg-secondary rounded-lg flex items-center justify-center text-white hover:bg-yellow-500 transition-colors"
                >
                  <i className="fas fa-paper-plane"></i>
                </button>
              </div>
            </div>
            
            {/* 快捷问题 */}
            <div className="mt-4 flex flex-wrap gap-2">
              <button 
                onClick={() => handleQuickQuestion('如何优化我的消费结构？')}
                className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded-full text-text-secondary"
              >
                如何优化我的消费结构？
              </button>
              <button 
                onClick={() => handleQuickQuestion('本月预算还能支撑多久？')}
                className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded-full text-text-secondary"
              >
                本月预算还能支撑多久？
              </button>
              <button 
                onClick={() => handleQuickQuestion('推荐一个适合我的省钱计划')}
                className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded-full text-text-secondary"
              >
                推荐一个适合我的省钱计划
              </button>
            </div>
          </section>

          {/* 分类消费列表 */}
          <section className={`bg-white rounded-2xl shadow-card p-6 ${styles.cardHover}`}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-text-primary">消费明细</h3>
              <span className="text-sm text-text-secondary">{getCurrentCategoryName()}</span>
            </div>
            <div className="space-y-3">
              {expenseData.map((expense) => (
                <div 
                  key={expense.id}
                  onClick={() => handleExpenseItemClick(expense.id)}
                  className={`${styles.expenseListItem} flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg`}
                >
                  <div className="flex items-center space-x-3">
                    <div className={`w-10 h-10 ${expense.iconBg} rounded-lg flex items-center justify-center`}>
                      <i className={expense.icon}></i>
                    </div>
                    <div>
                      <div className="font-medium text-text-primary">{expense.merchant}</div>
                      <div className="text-sm text-text-secondary">{expense.time}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-text-primary">-¥{expense.amount.toFixed(2)}</div>
                    <div className="text-xs text-text-secondary">{expense.paymentMethod}</div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-6 text-center">
              <Link to="/history" className="text-secondary hover:text-yellow-500 text-sm font-medium">查看更多记录 →</Link>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
};

export default AnalysisPage;

