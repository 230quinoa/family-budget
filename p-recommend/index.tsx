

import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from './styles.module.css';
import { RecommendationItem, RecommendationDetail } from './types';

const RecommendPage: React.FC = () => {
  const navigate = useNavigate();
  
  // 状态管理
  const [searchInputValue, setSearchInputValue] = useState('');
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);
  const [isTimeDropdownOpen, setIsTimeDropdownOpen] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<string[]>(['all']);
  const [selectedTimeFilter, setSelectedTimeFilter] = useState('all');
  const [sortBy, setSortBy] = useState('relevance');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(6);
  const [isDetailDrawerOpen, setIsDetailDrawerOpen] = useState(false);
  const [selectedRecommendationId, setSelectedRecommendationId] = useState<string>('');
  const [recommendationsList, setRecommendationsList] = useState<RecommendationItem[]>([
    {
      id: 'rec001',
      title: '麦当劳满30减10',
      description: '适用于所有套餐，新用户专享优惠，错过等一年！',
      category: 'food',
      tag: '限时',
      validUntil: '2024-03-31',
      usedCount: '1.2k',
      isFavorited: false,
      image: 'https://s.coze.cn/image/_WJWF-g6BNA/',
      link: 'https://s.coze.cn/image/uepABFJ4c1Q/'
    },
    {
      id: 'rec002',
      title: '地铁周卡8折',
      description: '购买周卡享受8折优惠，通勤族必备省钱神器',
      category: 'transport',
      tag: '热门',
      validUntil: '2024-04-15',
      usedCount: '3.5k',
      isFavorited: false,
      image: 'https://s.coze.cn/image/ME7pXcbcYO8/',
      link: 'https://s.coze.cn/image/XzjFsvpMQhU/'
    },
    {
      id: 'rec003',
      title: '永辉超市9.5折',
      description: '首次注册用户专享，全场通用，线上线下均可使用',
      category: 'shopping',
      tag: '新人',
      validUntil: '2024-04-30',
      usedCount: '856',
      isFavorited: true,
      image: 'https://s.coze.cn/image/3DYahG1mjds/',
      link: 'https://s.coze.cn/image/M1NCxhrTq1w/'
    },
    {
      id: 'rec004',
      title: '万达影城特价票',
      description: '热门电影特价票，周二周四专享，数量有限先到先得',
      category: 'entertainment',
      tag: '限量',
      validUntil: '2024-03-25',
      usedCount: '2.1k',
      isFavorited: false,
      image: 'https://s.coze.cn/image/89YRdvt3x3U/',
      link: 'https://s.coze.cn/image/EE684C7SIj0/'
    },
    {
      id: 'rec005',
      title: '星巴克买二送一',
      description: '指定饮品买二送一，周末专享，和朋友一起享受',
      category: 'food',
      tag: '满减',
      validUntil: '2024-04-07',
      usedCount: '1.8k',
      isFavorited: false,
      image: 'https://s.coze.cn/image/QhTzou1V3ng/',
      link: 'https://s.coze.cn/image/g85F6uMmOiE/'
    },
    {
      id: 'rec006',
      title: '共享单车月卡优惠',
      description: '月卡8折优惠，不限次数骑行，绿色出行更省钱',
      category: 'transport',
      tag: '长期',
      validUntil: '长期有效',
      usedCount: '4.2k',
      isFavorited: false,
      image: 'https://s.coze.cn/image/l88cfBmr34s/',
      link: 'https://s.coze.cn/image/tfq_FmYCy6E/'
    }
  ]);

  // 设置页面标题
  useEffect(() => {
    const originalTitle = document.title;
    document.title = '省钱推荐 - 省点';
    return () => { document.title = originalTitle; };
  }, []);

  // 点击外部关闭下拉菜单
  useEffect(() => {
    const handleClickOutside = () => {
      setIsCategoryDropdownOpen(false);
      setIsTimeDropdownOpen(false);
    };

    if (isCategoryDropdownOpen || isTimeDropdownOpen) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [isCategoryDropdownOpen, isTimeDropdownOpen]);

  // ESC键关闭抽屉
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isDetailDrawerOpen) {
        setIsDetailDrawerOpen(false);
      }
    };

    if (isDetailDrawerOpen) {
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }
  }, [isDetailDrawerOpen]);

  // 处理分类筛选
  const handleCategoryFilterChange = (category: string, checked: boolean) => {
    if (category === 'all') {
      setSelectedCategories(checked ? ['all'] : []);
    } else {
      if (checked) {
        setSelectedCategories(prev => [...prev.filter(c => c !== 'all'), category]);
      } else {
        setSelectedCategories(prev => prev.filter(c => c !== category));
      }
    }
    setIsCategoryDropdownOpen(false);
  };

  // 处理时间筛选
  const handleTimeFilterChange = (timeFilter: string) => {
    setSelectedTimeFilter(timeFilter);
    setIsTimeDropdownOpen(false);
  };

  // 处理收藏
  const handleToggleFavorite = (recommendationId: string) => {
    setRecommendationsList(prev => 
      prev.map(item => 
        item.id === recommendationId 
          ? { ...item, isFavorited: !item.isFavorited }
          : item
      )
    );
  };

  // 打开优惠详情
  const handleOpenRecommendationDetail = (recommendationId: string) => {
    setSelectedRecommendationId(recommendationId);
    setIsDetailDrawerOpen(true);
  };

  // 使用优惠
  const handleUseCoupon = (recommendationId: string) => {
    const recommendation = recommendationsList.find(item => item.id === recommendationId);
    if (recommendation?.link) {
      window.open(recommendation.link, '_blank');
    }
  };

  // 关闭抽屉
  const handleCloseDrawer = () => {
    setIsDetailDrawerOpen(false);
  };

  // 分页处理
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handlePageSizeChange = (newPageSize: number) => {
    setPageSize(newPageSize);
    setCurrentPage(1);
  };

  // 获取筛选后的推荐列表
  const getFilteredRecommendations = () => {
    let filtered = recommendationsList;

    // 分类筛选
    if (selectedCategories.length > 0 && selectedCategories[0] !== 'all') {
      filtered = filtered.filter(item => selectedCategories.includes(item.category));
    }

    // 时间筛选（简化处理）
    if (selectedTimeFilter !== 'all') {
      // 这里可以添加时间筛选逻辑
    }

    // 排序
    if (sortBy === 'time' || sortBy === 'expiry') {
      filtered = [...filtered].sort(() => Math.random() - 0.5);
    }

    return filtered;
  };

  // 获取推荐详情数据
  const getSelectedRecommendationDetail = (): RecommendationDetail | null => {
    const recommendation = recommendationsList.find(item => item.id === selectedRecommendationId);
    if (!recommendation) return null;

    const categoryMap: Record<string, string> = {
      'food': '食品餐饮',
      'transport': '交通出行',
      'shopping': '购物消费',
      'entertainment': '休闲娱乐'
    };

    return {
      title: recommendation.title,
      description: recommendation.description,
      category: categoryMap[recommendation.category] || recommendation.category,
      validUntil: recommendation.validUntil,
      link: recommendation.link,
      image: recommendation.image
    };
  };

  // 获取分类显示名称
  const getCategoryDisplayName = (category: string): string => {
    const categoryMap: Record<string, string> = {
      'food': '食品餐饮',
      'transport': '交通出行',
      'shopping': '购物消费',
      'entertainment': '休闲娱乐'
    };
    return categoryMap[category] || category;
  };

  // 获取分类样式类
  const getCategoryStyleClass = (category: string): string => {
    const categoryStyleMap: Record<string, string> = {
      'food': 'bg-red-100 text-red-600',
      'transport': 'bg-blue-100 text-blue-600',
      'shopping': 'bg-green-100 text-green-600',
      'entertainment': 'bg-purple-100 text-purple-600'
    };
    return categoryStyleMap[category] || 'bg-gray-100 text-gray-600';
  };

  // 获取标签样式类
  const getTagStyleClass = (tag: string): string => {
    const tagStyleMap: Record<string, string> = {
      '限时': 'bg-green-100 text-green-600',
      '热门': 'bg-orange-100 text-orange-600',
      '新人': 'bg-purple-100 text-purple-600',
      '限量': 'bg-red-100 text-red-600',
      '满减': 'bg-blue-100 text-blue-600',
      '长期': 'bg-green-100 text-green-600'
    };
    return tagStyleMap[tag] || 'bg-gray-100 text-gray-600';
  };

  const filteredRecommendations = getFilteredRecommendations();
  const selectedRecommendationDetail = getSelectedRecommendationDetail();

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
                value={searchInputValue}
                onChange={(e) => setSearchInputValue(e.target.value)}
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
                src="https://s.coze.cn/image/flfIjCxrgjM/" 
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
                <Link to="/recommend" className={`${styles.navItem} ${styles.navItemActive} flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium`}>
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
                <h2 className="text-2xl font-bold text-text-primary mb-2">省钱推荐</h2>
                <nav className="text-sm text-text-secondary">
                  <span>首页</span>
                  <i className="fas fa-chevron-right mx-2"></i>
                  <span>省钱推荐</span>
                </nav>
              </div>
            </div>
          </div>

          {/* 工具栏区域 */}
          <div className="bg-white rounded-2xl shadow-card p-4 mb-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              {/* 筛选按钮组 */}
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsCategoryDropdownOpen(!isCategoryDropdownOpen);
                      setIsTimeDropdownOpen(false);
                    }}
                    className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:border-secondary hover:bg-primary transition-colors"
                  >
                    <i className="fas fa-filter"></i>
                    <span>分类</span>
                    <i className="fas fa-chevron-down text-xs"></i>
                  </button>
                  
                  {/* 分类筛选下拉菜单 */}
                  <div className={`absolute z-10 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg ${isCategoryDropdownOpen ? styles.filterDropdownShow : styles.filterDropdown}`}>
                    <div className="p-2">
                      <label className="flex items-center space-x-2 p-2 hover:bg-gray-50 rounded cursor-pointer">
                        <input 
                          type="checkbox" 
                          checked={selectedCategories.includes('all')}
                          onChange={(e) => handleCategoryFilterChange('all', e.target.checked)}
                        />
                        <span>全部</span>
                      </label>
                      <label className="flex items-center space-x-2 p-2 hover:bg-gray-50 rounded cursor-pointer">
                        <input 
                          type="checkbox" 
                          checked={selectedCategories.includes('food')}
                          onChange={(e) => handleCategoryFilterChange('food', e.target.checked)}
                        />
                        <span>食品餐饮</span>
                      </label>
                      <label className="flex items-center space-x-2 p-2 hover:bg-gray-50 rounded cursor-pointer">
                        <input 
                          type="checkbox" 
                          checked={selectedCategories.includes('transport')}
                          onChange={(e) => handleCategoryFilterChange('transport', e.target.checked)}
                        />
                        <span>交通出行</span>
                      </label>
                      <label className="flex items-center space-x-2 p-2 hover:bg-gray-50 rounded cursor-pointer">
                        <input 
                          type="checkbox" 
                          checked={selectedCategories.includes('shopping')}
                          onChange={(e) => handleCategoryFilterChange('shopping', e.target.checked)}
                        />
                        <span>购物消费</span>
                      </label>
                      <label className="flex items-center space-x-2 p-2 hover:bg-gray-50 rounded cursor-pointer">
                        <input 
                          type="checkbox" 
                          checked={selectedCategories.includes('entertainment')}
                          onChange={(e) => handleCategoryFilterChange('entertainment', e.target.checked)}
                        />
                        <span>休闲娱乐</span>
                      </label>
                    </div>
                  </div>
                </div>
                
                <div className="relative">
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsTimeDropdownOpen(!isTimeDropdownOpen);
                      setIsCategoryDropdownOpen(false);
                    }}
                    className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:border-secondary hover:bg-primary transition-colors"
                  >
                    <i className="fas fa-clock"></i>
                    <span>有效期</span>
                    <i className="fas fa-chevron-down text-xs"></i>
                  </button>
                  
                  {/* 时间筛选下拉菜单 */}
                  <div className={`absolute z-10 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg ${isTimeDropdownOpen ? styles.filterDropdownShow : styles.filterDropdown}`}>
                    <div className="p-2">
                      <label className="flex items-center space-x-2 p-2 hover:bg-gray-50 rounded cursor-pointer">
                        <input 
                          type="radio" 
                          name="time-filter" 
                          value="all" 
                          checked={selectedTimeFilter === 'all'}
                          onChange={(e) => handleTimeFilterChange(e.target.value)}
                        />
                        <span>全部</span>
                      </label>
                      <label className="flex items-center space-x-2 p-2 hover:bg-gray-50 rounded cursor-pointer">
                        <input 
                          type="radio" 
                          name="time-filter" 
                          value="today" 
                          checked={selectedTimeFilter === 'today'}
                          onChange={(e) => handleTimeFilterChange(e.target.value)}
                        />
                        <span>今天</span>
                      </label>
                      <label className="flex items-center space-x-2 p-2 hover:bg-gray-50 rounded cursor-pointer">
                        <input 
                          type="radio" 
                          name="time-filter" 
                          value="week" 
                          checked={selectedTimeFilter === 'week'}
                          onChange={(e) => handleTimeFilterChange(e.target.value)}
                        />
                        <span>本周</span>
                      </label>
                      <label className="flex items-center space-x-2 p-2 hover:bg-gray-50 rounded cursor-pointer">
                        <input 
                          type="radio" 
                          name="time-filter" 
                          value="month" 
                          checked={selectedTimeFilter === 'month'}
                          onChange={(e) => handleTimeFilterChange(e.target.value)}
                        />
                        <span>本月</span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* 排序选择 */}
              <div className="flex items-center space-x-3">
                <span className="text-sm text-text-secondary">排序：</span>
                <select 
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary"
                >
                  <option value="relevance">相关度</option>
                  <option value="time">时间</option>
                  <option value="expiry">有效期</option>
                </select>
              </div>
            </div>
          </div>

          {/* 推荐列表 */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {filteredRecommendations.map((recommendation) => (
              <div key={recommendation.id} className={`${styles.recommendationCard} bg-white rounded-2xl shadow-card p-6`}>
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <span className={`${getCategoryStyleClass(recommendation.category)} text-xs px-2 py-1 rounded-full`}>
                      {getCategoryDisplayName(recommendation.category)}
                    </span>
                    <span className={`${getTagStyleClass(recommendation.tag)} text-xs px-2 py-1 rounded-full`}>
                      {recommendation.tag}
                    </span>
                  </div>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      handleToggleFavorite(recommendation.id);
                    }}
                    className={`text-gray-400 hover:text-secondary transition-colors ${recommendation.isFavorited ? styles.favoriteBtnActive : ''}`}
                  >
                    <i className={`${recommendation.isFavorited ? 'fas' : 'far'} fa-heart`}></i>
                  </button>
                </div>
                
                <div className="mb-4">
                  <h3 className="text-lg font-semibold text-text-primary mb-2">{recommendation.title}</h3>
                  <p className="text-sm text-text-secondary">{recommendation.description}</p>
                </div>
                
                <div className="flex items-center justify-between text-sm text-text-secondary mb-4">
                  <span><i className="fas fa-clock mr-1"></i>有效期至 {recommendation.validUntil}</span>
                  <span><i className="fas fa-eye mr-1"></i>已使用 {recommendation.usedCount} 次</span>
                </div>
                
                <div className="flex items-center space-x-3">
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      handleOpenRecommendationDetail(recommendation.id);
                    }}
                    className="flex-1 bg-secondary text-white py-2 px-4 rounded-lg text-sm font-medium hover:bg-yellow-500 transition-colors"
                  >
                    查看详情
                  </button>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      handleUseCoupon(recommendation.id);
                    }}
                    className="bg-green-500 text-white py-2 px-4 rounded-lg text-sm font-medium hover:bg-green-600 transition-colors"
                  >
                    <i className="fas fa-external-link-alt"></i>
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* 分页区域 */}
          <div className="flex items-center justify-between bg-white rounded-2xl shadow-card p-4">
            <div className="flex items-center space-x-4">
              <span className="text-sm text-text-secondary">共 <span className="font-medium text-text-primary">156</span> 条推荐</span>
              <select 
                value={pageSize}
                onChange={(e) => handlePageSizeChange(Number(e.target.value))}
                className="px-3 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-secondary"
              >
                <option value="6">每页 6 条</option>
                <option value="12">每页 12 条</option>
                <option value="24">每页 24 条</option>
              </select>
            </div>
            
            <div className="flex items-center space-x-2">
              <button 
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-3 py-1 border border-gray-300 rounded text-sm hover:border-secondary hover:bg-primary transition-colors disabled:opacity-50"
              >
                <i className="fas fa-chevron-left"></i>
              </button>
              
              <div className="flex items-center space-x-1">
                <button 
                  onClick={() => handlePageChange(1)}
                  className={`px-3 py-1 rounded text-sm ${currentPage === 1 ? 'bg-secondary text-white' : 'border border-gray-300 hover:border-secondary hover:bg-primary transition-colors'}`}
                >
                  1
                </button>
                <button 
                  onClick={() => handlePageChange(2)}
                  className={`px-3 py-1 rounded text-sm ${currentPage === 2 ? 'bg-secondary text-white' : 'border border-gray-300 hover:border-secondary hover:bg-primary transition-colors'}`}
                >
                  2
                </button>
                <button 
                  onClick={() => handlePageChange(3)}
                  className={`px-3 py-1 rounded text-sm ${currentPage === 3 ? 'bg-secondary text-white' : 'border border-gray-300 hover:border-secondary hover:bg-primary transition-colors'}`}
                >
                  3
                </button>
                <span className="px-2 text-gray-400">...</span>
                <button 
                  onClick={() => handlePageChange(26)}
                  className={`px-3 py-1 rounded text-sm ${currentPage === 26 ? 'bg-secondary text-white' : 'border border-gray-300 hover:border-secondary hover:bg-primary transition-colors'}`}
                >
                  26
                </button>
              </div>
              
              <button 
                onClick={() => handlePageChange(currentPage + 1)}
                className="px-3 py-1 border border-gray-300 rounded text-sm hover:border-secondary hover:bg-primary transition-colors"
              >
                <i className="fas fa-chevron-right"></i>
              </button>
            </div>
          </div>
        </main>
      </div>

      {/* 优惠详情抽屉 */}
      {isDetailDrawerOpen && (
        <div className="fixed inset-0 z-50">
          <div 
            className="absolute inset-0 bg-black bg-opacity-50" 
            onClick={handleCloseDrawer}
          ></div>
          <div className="absolute right-0 top-0 bottom-0 w-full max-w-md bg-white shadow-2xl transform transition-transform duration-300">
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-text-primary">优惠详情</h3>
              <button 
                onClick={handleCloseDrawer}
                className="p-2 text-gray-400 hover:text-gray-600"
              >
                <i className="fas fa-times"></i>
              </button>
            </div>
            
            <div className="p-4 overflow-y-auto h-full pb-20">
              {selectedRecommendationDetail && (
                <div className="space-y-4">
                  <img 
                    src={selectedRecommendationDetail.image} 
                    alt={selectedRecommendationDetail.title} 
                    className="w-full h-48 object-cover rounded-lg"
                  />
                  <div>
                    <h4 className="text-xl font-semibold text-text-primary mb-2">{selectedRecommendationDetail.title}</h4>
                    <div className="flex items-center space-x-2 mb-3">
                      <span className="bg-red-100 text-red-600 text-xs px-2 py-1 rounded-full">
                        {selectedRecommendationDetail.category}
                      </span>
                    </div>
                    <p className="text-text-secondary mb-4">{selectedRecommendationDetail.description}</p>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-text-secondary">有效期：</span>
                        <span className="text-text-primary">{selectedRecommendationDetail.validUntil}</span>
                      </div>
                    </div>
                  </div>
                  <div className="pt-4 border-t border-gray-200">
                    <button 
                      onClick={() => {
                        if (selectedRecommendationDetail.link) {
                          window.open(selectedRecommendationDetail.link, '_blank');
                        }
                      }}
                      className="w-full bg-green-500 text-white py-3 px-4 rounded-lg font-medium hover:bg-green-600 transition-colors"
                    >
                      <i className="fas fa-external-link-alt mr-2"></i>
                      立即使用
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RecommendPage;

