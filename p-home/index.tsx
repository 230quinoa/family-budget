

import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from './styles.module.css';
import { Transaction, Recommendation } from './types';

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const [isTransactionDrawerOpen, setIsTransactionDrawerOpen] = useState(false);
  const [isRecommendationDrawerOpen, setIsRecommendationDrawerOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [selectedRecommendation, setSelectedRecommendation] = useState<Recommendation | null>(null);
  const [isFavorited, setIsFavorited] = useState(false);

  useEffect(() => {
    const originalTitle = document.title;
    document.title = '省点 - 智能记账助手';
    return () => { document.title = originalTitle; };
  }, []);

  const mockTransactions: Record<string, Transaction> = {
    "txn001": {
      id: "txn001",
      date: "2024-01-15",
      time: "12:30",
      merchant: "肯德基",
      amount: "¥45.50",
      category: "食品餐饮",
      account: "支付宝",
      note: "午餐",
      image: "https://s.coze.cn/image/i_h8MJc8Vjw/"
    },
    "txn002": {
      id: "txn002",
      date: "2024-01-14",
      time: "08:15",
      merchant: "地铁出行",
      amount: "¥6.00",
      category: "交通出行",
      account: "交通卡",
      note: "上班通勤",
      image: "https://s.coze.cn/image/_TSd5NQY6wU/"
    },
    "txn003": {
      id: "txn003",
      date: "2024-01-14",
      time: "19:20",
      merchant: "沃尔玛超市",
      amount: "¥128.80",
      category: "日常用品",
      account: "微信支付",
      note: "购买日用品",
      image: "https://s.coze.cn/image/rhV8SAFYbPQ/"
    },
    "txn004": {
      id: "txn004",
      date: "2024-01-13",
      time: "14:30",
      merchant: "万达影城",
      amount: "¥78.00",
      category: "休闲娱乐",
      account: "支付宝",
      note: "看电影",
      image: "https://s.coze.cn/image/D-FDHJlrrMQ/"
    }
  };

  const mockRecommendations: Record<string, Recommendation> = {
    "rec001": {
      id: "rec001",
      title: "麦当劳满30减10",
      description: "适用于所有套餐，满30元即可享受10元优惠，有效期至本月底。可在麦当劳APP或线下门店使用。",
      validUntil: "2024-01-31",
      category: "食品餐饮",
      link: "https://s.coze.cn/image/27fmSTgtgCw/",
      image: "https://s.coze.cn/image/7I-1lz1UrDw/"
    },
    "rec002": {
      id: "rec002",
      title: "永辉超市9.5折",
      description: "首次注册用户专享，全场商品9.5折优惠，不与其他优惠同享。",
      validUntil: "2024-02-15",
      category: "日常用品",
      link: "https://s.coze.cn/image/kIGI5Us7ntM/",
      image: "https://s.coze.cn/image/KQkqsMYWtcQ/"
    },
    "rec003": {
      id: "rec003",
      title: "地铁周卡8折",
      description: "购买地铁周卡享受8折优惠，节省通勤成本，适用于所有线路。",
      validUntil: "2024-01-20",
      category: "交通出行",
      link: "https://s.coze.cn/image/YWQrscQwDxA/",
      image: "https://s.coze.cn/image/fmFqtEGVt_4/"
    }
  };

  const handleQuickRecordClick = () => {
    navigate('/record');
  };

  const handleTransactionClick = (transactionId: string) => {
    const transaction = mockTransactions[transactionId];
    if (transaction) {
      navigate(`/transaction-edit?transactionId=${transaction.id}`);
    }
  };

  const handleRecommendationClick = (recommendId: string) => {
    const recommendation = mockRecommendations[recommendId];
    if (recommendation) {
      setSelectedRecommendation(recommendation);
      setIsRecommendationDrawerOpen(true);
      setIsFavorited(false);
    }
  };

  const handleCloseTransactionDrawer = () => {
    setIsTransactionDrawerOpen(false);
    setSelectedTransaction(null);
  };

  const handleCloseRecommendationDrawer = () => {
    setIsRecommendationDrawerOpen(false);
    setSelectedRecommendation(null);
  };

  const handleEditTransaction = () => {
    if (selectedTransaction) {
      navigate(`/transaction-edit?transactionId=${selectedTransaction.id}`);
    }
  };

  const handleDeleteTransaction = () => {
    if (selectedTransaction && confirm('确定要删除这笔账单吗？')) {
      console.log('删除账单:', selectedTransaction.id);
      handleCloseTransactionDrawer();
    }
  };

  const handleFavoriteToggle = () => {
    setIsFavorited(!isFavorited);
  };

  const handleUseRecommendation = () => {
    if (selectedRecommendation) {
      window.open(selectedRecommendation.link, '_blank');
    }
  };

  const handleSearchKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      const searchTerm = (e.target as HTMLInputElement).value.trim();
      if (searchTerm) {
        console.log('搜索:', searchTerm);
      }
    }
  };

  const handleUserProfileClick = () => {
    console.log('用户菜单');
  };

  const handleOverlayClick = () => {
    handleCloseTransactionDrawer();
    handleCloseRecommendationDrawer();
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
                onKeyPress={handleSearchKeyPress}
              />
              <i className="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
            </div>
          </div>
          
          {/* 用户操作区 */}
          <div className="flex items-center space-x-4">
            {/* 用户头像 */}
            <div className="flex items-center space-x-2 cursor-pointer" onClick={handleUserProfileClick}>
              <img 
                src="https://s.coze.cn/image/SbG1MyyrcNY/" 
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
                <Link to="/home" className={`${styles.navItem} ${styles.navItemActive} flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium`}>
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
                <h2 className="text-2xl font-bold text-text-primary mb-2">欢迎回来，张三！</h2>
                <nav className="text-sm text-text-secondary">
                  <span>首页</span>
                </nav>
              </div>
              <button 
                onClick={handleQuickRecordClick}
                className="bg-secondary text-white px-6 py-3 rounded-lg font-medium hover:bg-yellow-500 transition-colors flex items-center space-x-2"
              >
                <i className="fas fa-plus"></i>
                <span>快速记账</span>
              </button>
            </div>
          </div>

          {/* 预算使用进度区 */}
          <section className={`bg-white rounded-2xl shadow-card p-6 mb-6 cursor-pointer ${styles.cardHover}`}>
            <Link to="/budget" className="block">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-text-primary">本月预算</h3>
                <span className="text-secondary hover:text-yellow-500 text-sm font-medium">查看详情</span>
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-text-secondary">总预算</span>
                  <span className="font-semibold text-text-primary">¥3,000</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div className={`${styles.progressBar} h-3 rounded-full`} style={{width: '68%'}}></div>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-text-secondary">已用 ¥2,040</span>
                  <span className="text-accent font-medium">剩余 ¥960</span>
                </div>
              </div>
            </Link>
          </section>

          {/* 消费分类展示区 */}
          <section className={`bg-white rounded-2xl shadow-card p-6 mb-6 ${styles.cardHover}`}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-text-primary">消费分类</h3>
              <Link to="/analysis" className="text-secondary hover:text-yellow-500 text-sm font-medium">详细分析</Link>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {/* 食品餐饮 */}
              <div className="p-4 bg-red-50 rounded-xl">
                <div className="flex items-center space-x-2 mb-2">
                  <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                    <i className="fas fa-utensils text-red-500 text-sm"></i>
                  </div>
                  <span className="text-sm font-medium text-text-primary">食品餐饮</span>
                </div>
                <div className="text-lg font-semibold text-text-primary mb-1">¥850</div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-red-500 h-2 rounded-full" style={{width: '42%'}}></div>
                </div>
                <div className="text-xs text-text-secondary mt-1">42%</div>
              </div>
              
              {/* 交通出行 */}
              <div className="p-4 bg-blue-50 rounded-xl">
                <div className="flex items-center space-x-2 mb-2">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <i className="fas fa-bus text-blue-500 text-sm"></i>
                  </div>
                  <span className="text-sm font-medium text-text-primary">交通出行</span>
                </div>
                <div className="text-lg font-semibold text-text-primary mb-1">¥320</div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-blue-500 h-2 rounded-full" style={{width: '16%'}}></div>
                </div>
                <div className="text-xs text-text-secondary mt-1">16%</div>
              </div>
              
              {/* 日常用品 */}
              <div className="p-4 bg-green-50 rounded-xl">
                <div className="flex items-center space-x-2 mb-2">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <i className="fas fa-shopping-basket text-green-500 text-sm"></i>
                  </div>
                  <span className="text-sm font-medium text-text-primary">日常用品</span>
                </div>
                <div className="text-lg font-semibold text-text-primary mb-1">¥450</div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-green-500 h-2 rounded-full" style={{width: '22%'}}></div>
                </div>
                <div className="text-xs text-text-secondary mt-1">22%</div>
              </div>
              
              {/* 休闲娱乐 */}
              <div className="p-4 bg-purple-50 rounded-xl">
                <div className="flex items-center space-x-2 mb-2">
                  <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                    <i className="fas fa-gamepad text-purple-500 text-sm"></i>
                  </div>
                  <span className="text-sm font-medium text-text-primary">休闲娱乐</span>
                </div>
                <div className="text-lg font-semibold text-text-primary mb-1">¥420</div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-purple-500 h-2 rounded-full" style={{width: '14%'}}></div>
                </div>
                <div className="text-xs text-text-secondary mt-1">14%</div>
              </div>
            </div>
          </section>

          {/* 主要内容网格 */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            {/* 近期消费概览 */}
            <div className={`lg:col-span-2 bg-white rounded-2xl shadow-card p-6 ${styles.cardHover}`}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-text-primary">近期消费</h3>
                <Link to="/history" className="text-secondary hover:text-yellow-500 text-sm font-medium">查看全部</Link>
              </div>
              <div className="space-y-3">
                <div 
                  className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg cursor-pointer"
                  onClick={() => handleTransactionClick('txn001')}
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                      <i className="fas fa-utensils text-red-500"></i>
                    </div>
                    <div>
                      <div className="font-medium text-text-primary">肯德基</div>
                      <div className="text-sm text-text-secondary">今天 12:30</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-text-primary">-¥45.50</div>
                    <div className="text-xs text-text-secondary">食品餐饮</div>
                  </div>
                </div>
                
                <div 
                  className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg cursor-pointer"
                  onClick={() => handleTransactionClick('txn002')}
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <i className="fas fa-bus text-blue-500"></i>
                    </div>
                    <div>
                      <div className="font-medium text-text-primary">地铁出行</div>
                      <div className="text-sm text-text-secondary">昨天 08:15</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-text-primary">-¥6.00</div>
                    <div className="text-xs text-text-secondary">交通出行</div>
                  </div>
                </div>
                
                <div 
                  className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg cursor-pointer"
                  onClick={() => handleTransactionClick('txn003')}
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                      <i className="fas fa-shopping-cart text-green-500"></i>
                    </div>
                    <div>
                      <div className="font-medium text-text-primary">沃尔玛超市</div>
                      <div className="text-sm text-text-secondary">昨天 19:20</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-text-primary">-¥128.80</div>
                    <div className="text-xs text-text-secondary">日常用品</div>
                  </div>
                </div>
                
                <div 
                  className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg cursor-pointer"
                  onClick={() => handleTransactionClick('txn004')}
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                      <i className="fas fa-film text-purple-500"></i>
                    </div>
                    <div>
                      <div className="font-medium text-text-primary">万达影城</div>
                      <div className="text-sm text-text-secondary">2天前 14:30</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-text-primary">-¥78.00</div>
                    <div className="text-xs text-text-secondary">休闲娱乐</div>
                  </div>
                </div>
              </div>
            </div>

            {/* 省钱推荐卡片 */}
            <div className={`bg-white rounded-2xl shadow-card p-6 ${styles.cardHover}`}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-text-primary">为你推荐</h3>
                <Link to="/recommend" className="text-secondary hover:text-yellow-500 text-sm font-medium">更多优惠</Link>
              </div>
              <div className="space-y-4">
                <div 
                  className="p-4 bg-gradient-to-r from-secondary to-yellow-300 rounded-xl text-white cursor-pointer"
                  onClick={() => handleRecommendationClick('rec001')}
                >
                  <div className="flex items-center space-x-2 mb-2">
                    <i className="fas fa-percent"></i>
                    <span className="text-sm font-medium">限时优惠</span>
                  </div>
                  <h4 className="font-semibold mb-1">麦当劳满30减10</h4>
                  <p className="text-sm opacity-90 mb-3">适用于所有套餐，有效期至本月底</p>
                  <button className="bg-white text-secondary px-3 py-1 rounded-lg text-sm font-medium hover:bg-gray-100">
                    立即使用
                  </button>
                </div>
                
                <div 
                  className="p-4 bg-gradient-to-r from-green-400 to-green-500 rounded-xl text-white cursor-pointer"
                  onClick={() => handleRecommendationClick('rec002')}
                >
                  <div className="flex items-center space-x-2 mb-2">
                    <i className="fas fa-gift"></i>
                    <span className="text-sm font-medium">新人专享</span>
                  </div>
                  <h4 className="font-semibold mb-1">永辉超市9.5折</h4>
                  <p className="text-sm opacity-90 mb-3">首次注册用户专享，全场通用</p>
                  <button className="bg-white text-green-500 px-3 py-1 rounded-lg text-sm font-medium hover:bg-gray-100">
                    立即使用
                  </button>
                </div>
                
                <div 
                  className="p-4 bg-gradient-to-r from-blue-400 to-blue-500 rounded-xl text-white cursor-pointer"
                  onClick={() => handleRecommendationClick('rec003')}
                >
                  <div className="flex items-center space-x-2 mb-2">
                    <i className="fas fa-train"></i>
                    <span className="text-sm font-medium">交通优惠</span>
                  </div>
                  <h4 className="font-semibold mb-1">地铁周卡8折</h4>
                  <p className="text-sm opacity-90 mb-3">购买周卡享受8折优惠，节省通勤成本</p>
                  <button className="bg-white text-blue-500 px-3 py-1 rounded-lg text-sm font-medium hover:bg-gray-100">
                    立即使用
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* 快捷入口区 */}
          <section className={`bg-white rounded-2xl shadow-card p-6 ${styles.cardHover}`}>
            <h3 className="text-lg font-semibold text-text-primary mb-4">快捷操作</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <button 
                onClick={() => navigate('/record')}
                className="flex flex-col items-center p-4 border border-gray-200 rounded-xl hover:border-secondary hover:bg-primary transition-colors"
              >
                <div className="w-12 h-12 bg-secondary rounded-lg flex items-center justify-center mb-3">
                  <i className="fas fa-camera text-white text-xl"></i>
                </div>
                <span className="text-sm font-medium text-text-primary">拍照记账</span>
              </button>
              
              <button 
                onClick={() => navigate('/analysis')}
                className="flex flex-col items-center p-4 border border-gray-200 rounded-xl hover:border-secondary hover:bg-primary transition-colors"
              >
                <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center mb-3">
                  <i className="fas fa-chart-line text-white text-xl"></i>
                </div>
                <span className="text-sm font-medium text-text-primary">查看分析</span>
              </button>
              
              <button 
                onClick={() => navigate('/budget')}
                className="flex flex-col items-center p-4 border border-gray-200 rounded-xl hover:border-secondary hover:bg-primary transition-colors"
              >
                <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center mb-3">
                  <i className="fas fa-wallet text-white text-xl"></i>
                </div>
                <span className="text-sm font-medium text-text-primary">设置预算</span>
              </button>
              
              <button 
                onClick={() => navigate('/recommend')}
                className="flex flex-col items-center p-4 border border-gray-200 rounded-xl hover:border-secondary hover:bg-primary transition-colors"
              >
                <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center mb-3">
                  <i className="fas fa-gift text-white text-xl"></i>
                </div>
                <span className="text-sm font-medium text-text-primary">发现优惠</span>
              </button>
            </div>
          </section>
        </main>
      </div>

      {/* 抽屉遮罩层 */}
      <div 
        className={`${styles.drawerOverlay} ${(isTransactionDrawerOpen || isRecommendationDrawerOpen) ? 'active' : ''}`}
        onClick={handleOverlayClick}
      ></div>
      
      {/* 账单详情抽屉 */}
      <div className={`${styles.drawer} ${isTransactionDrawerOpen ? 'active' : ''}`}>
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-text-primary">账单详情</h3>
            <button onClick={handleCloseTransactionDrawer} className="text-gray-400 hover:text-gray-600">
              <i className="fas fa-times text-xl"></i>
            </button>
          </div>
          {selectedTransaction && (
            <div className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-text-secondary">日期时间</span>
                  <span className="font-medium">{selectedTransaction.date} {selectedTransaction.time}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-text-secondary">商家名称</span>
                  <span className="font-medium">{selectedTransaction.merchant}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-text-secondary">消费金额</span>
                  <span className="font-bold text-lg text-red-500">{selectedTransaction.amount}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-text-secondary">消费分类</span>
                  <span className="font-medium">{selectedTransaction.category}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-text-secondary">支付账户</span>
                  <span className="font-medium">{selectedTransaction.account}</span>
                </div>
                <div className="flex items-start justify-between">
                  <span className="text-text-secondary">备注</span>
                  <span className="font-medium">{selectedTransaction.note}</span>
                </div>
                <div>
                  <span className="text-text-secondary">小票图片</span>
                  <img 
                    src={selectedTransaction.image} 
                    alt="小票图片" 
                    className="mt-2 w-full rounded-lg"
                  />
                </div>
              </div>
              <div className="flex space-x-3 mt-6">
                <button 
                  onClick={handleEditTransaction}
                  className="flex-1 bg-secondary text-white py-2 px-4 rounded-lg hover:bg-yellow-500 transition-colors"
                >
                  编辑
                </button>
                <button 
                  onClick={handleDeleteTransaction}
                  className="flex-1 bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 transition-colors"
                >
                  删除
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 优惠详情抽屉 */}
      <div className={`${styles.drawer} ${isRecommendationDrawerOpen ? 'active' : ''}`}>
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-text-primary">优惠详情</h3>
            <button onClick={handleCloseRecommendationDrawer} className="text-gray-400 hover:text-gray-600">
              <i className="fas fa-times text-xl"></i>
            </button>
          </div>
          {selectedRecommendation && (
            <div className="space-y-4">
              <div className="space-y-4">
                <div>
                  <img 
                    src={selectedRecommendation.image} 
                    alt="优惠图片" 
                    className="w-full rounded-lg"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-text-secondary">优惠标题</span>
                  <span className="font-bold text-lg">{selectedRecommendation.title}</span>
                </div>
                <div className="flex items-start justify-between">
                  <span className="text-text-secondary">详细描述</span>
                  <span className="font-medium">{selectedRecommendation.description}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-text-secondary">有效期至</span>
                  <span className="font-medium">{selectedRecommendation.validUntil}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-text-secondary">适用分类</span>
                  <span className="font-medium">{selectedRecommendation.category}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-text-secondary">优惠链接</span>
                  <a 
                    href={selectedRecommendation.link} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-secondary hover:text-yellow-500 font-medium"
                  >
                    点击查看 <i className="fas fa-external-link-alt ml-1"></i>
                  </a>
                </div>
              </div>
              <div className="flex space-x-3 mt-6">
                <button 
                  onClick={handleFavoriteToggle}
                  className={`flex-1 py-2 px-4 rounded-lg transition-colors ${
                    isFavorited 
                      ? 'bg-gray-400 text-white hover:bg-gray-500' 
                      : 'bg-purple-500 text-white hover:bg-purple-600'
                  }`}
                >
                  <i className={`${isFavorited ? 'fas fa-heart-broken' : 'fas fa-heart'} mr-2`}></i>
                  {isFavorited ? '取消收藏' : '收藏'}
                </button>
                <button 
                  onClick={handleUseRecommendation}
                  className="flex-1 bg-secondary text-white py-2 px-4 rounded-lg hover:bg-yellow-500 transition-colors"
                >
                  立即使用
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HomePage;

