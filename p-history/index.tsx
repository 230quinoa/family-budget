

import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from './styles.module.css';
import { Transaction, FilterState } from './types';

const HistoryPage: React.FC = () => {
  const navigate = useNavigate();

  // 模拟账单数据
  const mockTransactions: Transaction[] = [
    {
      id: 'tx001',
      date: '2024-01-15',
      time: '12:30',
      merchant: '肯德基',
      category: '食品餐饮',
      categoryIcon: 'fas fa-utensils text-red-500',
      amount: -45.50,
      account: '支付宝',
      note: '午餐',
      imageUrl: 'https://s.coze.cn/image/lSQc3UXnqUw/'
    },
    {
      id: 'tx002',
      date: '2024-01-15',
      time: '08:15',
      merchant: '地铁出行',
      category: '交通出行',
      categoryIcon: 'fas fa-bus text-blue-500',
      amount: -6.00,
      account: '交通卡',
      note: '上班通勤',
      imageUrl: 'https://s.coze.cn/image/mkV8-JHPspE/'
    },
    {
      id: 'tx003',
      date: '2024-01-14',
      time: '19:20',
      merchant: '沃尔玛超市',
      category: '日常用品',
      categoryIcon: 'fas fa-shopping-basket text-green-500',
      amount: -128.80,
      account: '微信支付',
      note: '购买日用品',
      imageUrl: 'https://s.coze.cn/image/Xg9IjDM3g0Q/'
    },
    {
      id: 'tx004',
      date: '2024-01-14',
      time: '14:30',
      merchant: '万达影城',
      category: '休闲娱乐',
      categoryIcon: 'fas fa-film text-purple-500',
      amount: -78.00,
      account: '银行卡',
      note: '看电影',
      imageUrl: 'https://s.coze.cn/image/zLSUSkR_12Y/'
    },
    {
      id: 'tx005',
      date: '2024-01-13',
      time: '18:45',
      merchant: '海底捞',
      category: '食品餐饮',
      categoryIcon: 'fas fa-utensils text-red-500',
      amount: -238.00,
      account: '支付宝',
      note: '朋友聚餐',
      imageUrl: 'https://s.coze.cn/image/zSK1FjZOIO4/'
    },
    {
      id: 'tx006',
      date: '2024-01-13',
      time: '10:20',
      merchant: '星巴克',
      category: '食品餐饮',
      categoryIcon: 'fas fa-utensils text-red-500',
      amount: -35.00,
      account: '现金',
      note: '咖啡',
      imageUrl: 'https://s.coze.cn/image/fl5AhEFSh8o/'
    },
    {
      id: 'tx007',
      date: '2024-01-12',
      time: '16:15',
      merchant: '京东商城',
      category: '购物消费',
      categoryIcon: 'fas fa-shopping-cart text-orange-500',
      amount: -199.00,
      account: '微信支付',
      note: '购买电子产品',
      imageUrl: 'https://s.coze.cn/image/c-oSR4kLkkc/'
    },
    {
      id: 'tx008',
      date: '2024-01-12',
      time: '09:30',
      merchant: '滴滴出行',
      category: '交通出行',
      categoryIcon: 'fas fa-car text-blue-500',
      amount: -28.50,
      account: '支付宝',
      note: '打车',
      imageUrl: 'https://s.coze.cn/image/mCV_HRxmotA/'
    },
    {
      id: 'tx009',
      date: '2024-01-11',
      time: '20:10',
      merchant: '美团外卖',
      category: '食品餐饮',
      categoryIcon: 'fas fa-utensils text-red-500',
      amount: -68.00,
      account: '微信支付',
      note: '晚餐',
      imageUrl: 'https://s.coze.cn/image/J7GVGU8-S3U/'
    },
    {
      id: 'tx010',
      date: '2024-01-11',
      time: '15:45',
      merchant: '健身房',
      category: '休闲娱乐',
      categoryIcon: 'fas fa-dumbbell text-green-500',
      amount: -120.00,
      account: '银行卡',
      note: '月费',
      imageUrl: 'https://s.coze.cn/image/kRT8jETFw04/'
    },
    {
      id: 'tx011',
      date: '2024-01-10',
      time: '12:15',
      merchant: '全家便利店',
      category: '日常用品',
      categoryIcon: 'fas fa-shopping-basket text-green-500',
      amount: -25.50,
      account: '现金',
      note: '零食饮料',
      imageUrl: 'https://s.coze.cn/image/Vn4rYJ4CtFg/'
    },
    {
      id: 'tx012',
      date: '2024-01-10',
      time: '09:00',
      merchant: '瑞幸咖啡',
      category: '食品餐饮',
      categoryIcon: 'fas fa-utensils text-red-500',
      amount: -22.00,
      account: '支付宝',
      note: '早餐咖啡',
      imageUrl: 'https://s.coze.cn/image/NDWXwKgl0K0/'
    },
    {
      id: 'tx013',
      date: '2024-01-09',
      time: '18:30',
      merchant: '必胜客',
      category: '食品餐饮',
      categoryIcon: 'fas fa-utensils text-red-500',
      amount: -158.00,
      account: '微信支付',
      note: '晚餐',
      imageUrl: 'https://s.coze.cn/image/l24VqEzKKqk/'
    },
    {
      id: 'tx014',
      date: '2024-01-09',
      time: '14:00',
      merchant: '优衣库',
      category: '购物消费',
      categoryIcon: 'fas fa-shopping-cart text-orange-500',
      amount: -299.00,
      account: '银行卡',
      note: '购买衣物',
      imageUrl: 'https://s.coze.cn/image/c-GBbCrp6uo/'
    },
    {
      id: 'tx015',
      date: '2024-01-08',
      time: '20:00',
      merchant: '腾讯视频',
      category: '休闲娱乐',
      categoryIcon: 'fas fa-film text-purple-500',
      amount: -15.00,
      account: '微信支付',
      note: '会员续费',
      imageUrl: 'https://s.coze.cn/image/D0CVjWv54Kw/'
    },
    {
      id: 'tx016',
      date: '2024-01-08',
      time: '12:45',
      merchant: '真功夫',
      category: '食品餐饮',
      categoryIcon: 'fas fa-utensils text-red-500',
      amount: -38.00,
      account: '支付宝',
      note: '午餐',
      imageUrl: 'https://s.coze.cn/image/gWLG8U-v8Gk/'
    },
    {
      id: 'tx017',
      date: '2024-01-07',
      time: '16:30',
      merchant: '名创优品',
      category: '日常用品',
      categoryIcon: 'fas fa-shopping-basket text-green-500',
      amount: -89.90,
      account: '微信支付',
      note: '生活用品',
      imageUrl: 'https://s.coze.cn/image/k44zwEiC-Pk/'
    },
    {
      id: 'tx018',
      date: '2024-01-07',
      time: '10:15',
      merchant: '滴滴出行',
      category: '交通出行',
      categoryIcon: 'fas fa-car text-blue-500',
      amount: -35.50,
      account: '支付宝',
      note: '打车',
      imageUrl: 'https://s.coze.cn/image/q3rtbfuvxd4/'
    },
    {
      id: 'tx019',
      date: '2024-01-06',
      time: '19:00',
      merchant: '电影院',
      category: '休闲娱乐',
      categoryIcon: 'fas fa-film text-purple-500',
      amount: -98.00,
      account: '银行卡',
      note: '看电影',
      imageUrl: 'https://s.coze.cn/image/JYbx0u9u10A/'
    },
    {
      id: 'tx020',
      date: '2024-01-06',
      time: '13:20',
      merchant: '星巴克',
      category: '食品餐饮',
      categoryIcon: 'fas fa-utensils text-red-500',
      amount: -42.00,
      account: '现金',
      note: '下午茶',
      imageUrl: 'https://s.coze.cn/image/DrzENgRYlHw/'
    }
  ];

  // 状态管理
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [sortField, setSortField] = useState('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [filteredData, setFilteredData] = useState<Transaction[]>([...mockTransactions]);
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showTransactionDrawer, setShowTransactionDrawer] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [deleteTransactionId, setDeleteTransactionId] = useState<string | null>(null);
  const [globalSearchTerm, setGlobalSearchTerm] = useState('');
  const [billSearchTerm, setBillSearchTerm] = useState('');
  const [filterState, setFilterState] = useState<FilterState>({
    searchTerm: '',
    category: '',
    account: '',
    startDate: '',
    endDate: '',
    minAmount: '',
    maxAmount: ''
  });

  // 设置页面标题
  useEffect(() => {
    const originalTitle = document.title;
    document.title = '历史记录 - 省点';
    return () => { document.title = originalTitle; };
  }, []);

  // 初始化默认日期范围
  useEffect(() => {
    const today = new Date();
    const oneMonthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);
    
    setFilterState(prev => ({
      ...prev,
      endDate: today.toISOString().split('T')[0],
      startDate: oneMonthAgo.toISOString().split('T')[0]
    }));
  }, []);

  // 筛选和排序数据
  useEffect(() => {
    applyFilters();
  }, [filterState, sortField, sortOrder]);

  const getCategoryValue = (categoryName: string): string => {
    const categoryMap: Record<string, string> = {
      '食品餐饮': 'food',
      '交通出行': 'transport',
      '日常用品': 'daily',
      '休闲娱乐': 'entertainment',
      '购物消费': 'shopping',
      '住房缴费': 'housing',
      '医疗健康': 'medical',
      '教育培训': 'education'
    };
    return categoryMap[categoryName] || categoryName;
  };

  const getAccountValue = (accountName: string): string => {
    const accountMap: Record<string, string> = {
      '现金': 'cash',
      '支付宝': 'alipay',
      '微信支付': 'wechat',
      '银行卡': 'bank',
      '交通卡': 'transport_card'
    };
    return accountMap[accountName] || accountName;
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
  };

  const applyFilters = () => {
    let filtered = [...mockTransactions];

    // 搜索筛选
    if (filterState.searchTerm) {
      const searchTerm = filterState.searchTerm.toLowerCase();
      filtered = filtered.filter(transaction => 
        transaction.merchant.toLowerCase().includes(searchTerm) ||
        transaction.note.toLowerCase().includes(searchTerm)
      );
    }

    // 分类筛选
    if (filterState.category) {
      filtered = filtered.filter(transaction => 
        getCategoryValue(transaction.category) === filterState.category
      );
    }

    // 账户筛选
    if (filterState.account) {
      filtered = filtered.filter(transaction => 
        getAccountValue(transaction.account) === filterState.account
      );
    }

    // 日期筛选
    if (filterState.startDate) {
      filtered = filtered.filter(transaction => transaction.date >= filterState.startDate);
    }
    if (filterState.endDate) {
      filtered = filtered.filter(transaction => transaction.date <= filterState.endDate);
    }

    // 金额筛选
    if (filterState.minAmount) {
      const minAmount = parseFloat(filterState.minAmount);
      filtered = filtered.filter(transaction => Math.abs(transaction.amount) >= minAmount);
    }
    if (filterState.maxAmount) {
      const maxAmount = parseFloat(filterState.maxAmount);
      filtered = filtered.filter(transaction => Math.abs(transaction.amount) <= maxAmount);
    }

    // 排序
    filtered.sort((a, b) => {
      let aValue = a[sortField as keyof Transaction];
      let bValue = b[sortField as keyof Transaction];

      if (sortField === 'amount') {
        aValue = Math.abs(a.amount) as any;
        bValue = Math.abs(b.amount) as any;
      }

      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    setFilteredData(filtered);
    setCurrentPage(1);
  };

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('desc');
    }
  };

  const handleFilterChange = (key: keyof FilterState, value: string) => {
    setFilterState(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const resetFilters = () => {
    setFilterState({
      searchTerm: '',
      category: '',
      account: '',
      startDate: '',
      endDate: '',
      minAmount: '',
      maxAmount: ''
    });
    setBillSearchTerm('');
  };

  const applyFilterClick = () => {
    setFilterState(prev => ({
      ...prev,
      searchTerm: billSearchTerm
    }));
    setShowFilterDropdown(false);
  };

  const handleBillSearchChange = (value: string) => {
    setBillSearchTerm(value);
    setFilterState(prev => ({
      ...prev,
      searchTerm: value
    }));
  };

  const handlePageSizeChange = (size: number) => {
    setPageSize(size);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleGoToPage = (page: number) => {
    const totalPages = Math.ceil(filteredData.length / pageSize);
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const showTransactionDetail = (transactionId: string) => {
    const transaction = mockTransactions.find(tx => tx.id === transactionId);
    if (transaction) {
      setSelectedTransaction(transaction);
      setShowTransactionDrawer(true);
    }
  };

  const closeDrawer = () => {
    setShowTransactionDrawer(false);
    setSelectedTransaction(null);
  };

  const editTransaction = (transactionId: string) => {
    navigate(`/transaction-edit?transactionId=${transactionId}`);
  };

  const showDeleteModalHandler = (transactionId: string) => {
    setDeleteTransactionId(transactionId);
    setShowDeleteModal(true);
  };

  const closeDeleteModal = () => {
    setShowDeleteModal(false);
    setDeleteTransactionId(null);
  };

  const confirmDelete = () => {
    if (deleteTransactionId) {
      // 在实际应用中，这里会调用API删除数据
      const updatedTransactions = mockTransactions.filter(tx => tx.id !== deleteTransactionId);
      // 更新本地数据
      // 注意：这里只是模拟删除，实际应用中应该调用API
      console.log('删除交易:', deleteTransactionId);
      applyFilters();
      closeDrawer();
    }
    closeDeleteModal();
  };

  const exportData = () => {
    console.log('导出数据功能需要后端支持');
    alert('数据导出功能正在开发中...');
  };

  const handleGlobalSearch = (value: string) => {
    setGlobalSearchTerm(value);
    // 全局搜索逻辑可以在这里实现
  };

  const handleNotificationClick = () => {
    // 通知功能
    console.log('通知功能');
  };

  const handleUserProfileClick = () => {
    // 用户资料功能
    console.log('用户资料功能');
  };

  // 计算分页数据
  const totalItems = filteredData.length;
  const totalPages = Math.ceil(totalItems / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = Math.min(currentPage * pageSize, totalItems);
  const currentPageData = filteredData.slice(startIndex, endIndex);

  // 生成页码
  const generatePageNumbers = () => {
    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    const pages = [];
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    return pages;
  };

  // 处理点击其他地方关闭下拉菜单
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const filterBtn = document.querySelector('#filter-btn');
      const filterDropdown = document.querySelector('#filter-dropdown');
      if (filterBtn && filterDropdown && 
          !filterBtn.contains(event.target as Node) && 
          !filterDropdown.contains(event.target as Node)) {
        setShowFilterDropdown(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  // 处理ESC键
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setShowTransactionDrawer(false);
        setShowDeleteModal(false);
        setShowFilterDropdown(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

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
                value={globalSearchTerm}
                onChange={(e) => handleGlobalSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent"
              />
              <i className="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
            </div>
          </div>
          
          {/* 用户操作区 */}
          <div className="flex items-center space-x-4">
            {/* 消息通知 */}
            <button 
              onClick={handleNotificationClick}
              className="relative p-2 text-gray-600 hover:text-accent"
            >
            </button>
            
            {/* 用户头像 */}
            <div 
              onClick={handleUserProfileClick}
              className="flex items-center space-x-2 cursor-pointer"
            >
              <img 
                src="https://s.coze.cn/image/75PMplGSWFM/" 
                alt="用户头像" 
                className="w-8 h-8 rounded-full" 
                data-category="人物"
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
                <Link 
                  to="/home" 
                  className={`${styles.navItem} flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium text-gray-600`}
                >
                  <i className="fas fa-home text-lg"></i>
                  <span>首页</span>
                </Link>
              </li>
              <li>
                <Link 
                  to="/record" 
                  className={`${styles.navItem} flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium text-gray-600`}
                >
                  <i className="fas fa-camera text-lg"></i>
                  <span>记账</span>
                </Link>
              </li>
              <li>
                <Link 
                  to="/analysis" 
                  className={`${styles.navItem} flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium text-gray-600`}
                >
                  <i className="fas fa-chart-pie text-lg"></i>
                  <span>消费分析</span>
                </Link>
              </li>
              <li>
                <Link 
                  to="/history" 
                  className={`${styles.navItem} ${styles.navItemActive} flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium`}
                >
                  <i className="fas fa-history text-lg"></i>
                  <span>历史记录</span>
                </Link>
              </li>
              <li>
                <Link 
                  to="/recommend" 
                  className={`${styles.navItem} flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium text-gray-600`}
                >
                  <i className="fas fa-gift text-lg"></i>
                  <span>省钱推荐</span>
                </Link>
              </li>
              <li>
                <Link 
                  to="/budget" 
                  className={`${styles.navItem} flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium text-gray-600`}
                >
                  <i className="fas fa-wallet text-lg"></i>
                  <span>预算设置</span>
                </Link>
              </li>
              <li>
                <Link 
                  to="/account" 
                  className={`${styles.navItem} flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium text-gray-600`}
                >
                  <i className="fas fa-credit-card text-lg"></i>
                  <span>账户管理</span>
                </Link>
              </li>
              <li>
                <Link 
                  to="/settings" 
                  className={`${styles.navItem} flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium text-gray-600`}
                >
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
                <h2 className="text-2xl font-bold text-text-primary mb-2">历史记录</h2>
                <nav className="text-sm text-text-secondary">
                  <span>首页</span>
                  <i className="fas fa-chevron-right mx-2"></i>
                  <span>历史记录</span>
                </nav>
              </div>
            </div>
          </div>

          {/* 工具栏区域 */}
          <div className="bg-white rounded-2xl shadow-card p-4 mb-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
              {/* 搜索框 */}
              <div className="flex-1 max-w-md">
                <div className="relative">
                  <input 
                    type="text" 
                    placeholder="搜索商家、备注..." 
                    value={billSearchTerm}
                    onChange={(e) => handleBillSearchChange(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent"
                  />
                  <i className="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
                </div>
              </div>
              
              {/* 筛选和操作按钮 */}
              <div className="flex items-center space-x-3">
                {/* 高级筛选 */}
                <div className="relative">
                  <button 
                    id="filter-btn"
                    onClick={() => setShowFilterDropdown(!showFilterDropdown)}
                    className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:border-secondary hover:bg-primary transition-colors shadow-sm"
                  >
                    <i className="fas fa-filter"></i>
                    <span>筛选</span>
                    <i className="fas fa-chevron-down text-xs"></i>
                  </button>
                  {/* 筛选下拉菜单 */}
                  <div 
                    id="filter-dropdown"
                    className={`${styles.filterDropdown} ${showFilterDropdown ? styles.show : ''} absolute right-0 top-full mt-2 w-64 bg-white border border-gray-200 rounded-lg shadow-lg z-10`}
                  >
                    <div className="p-4">
                      <h4 className="font-medium text-text-primary mb-3">高级筛选</h4>
                      
                      {/* 分类筛选 */}
                      <div className="mb-4">
                        <label className="block text-sm font-medium text-text-secondary mb-2">消费分类</label>
                        <select 
                          value={filterState.category}
                          onChange={(e) => handleFilterChange('category', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary"
                        >
                          <option value="">全部分类</option>
                          <option value="food">食品餐饮</option>
                          <option value="transport">交通出行</option>
                          <option value="daily">日常用品</option>
                          <option value="entertainment">休闲娱乐</option>
                          <option value="shopping">购物消费</option>
                          <option value="housing">住房缴费</option>
                          <option value="medical">医疗健康</option>
                          <option value="education">教育培训</option>
                        </select>
                      </div>
                      
                      {/* 账户筛选 */}
                      <div className="mb-4">
                        <label className="block text-sm font-medium text-text-secondary mb-2">支付账户</label>
                        <select 
                          value={filterState.account}
                          onChange={(e) => handleFilterChange('account', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary"
                        >
                          <option value="">全部账户</option>
                          <option value="cash">现金</option>
                          <option value="alipay">支付宝</option>
                          <option value="wechat">微信支付</option>
                          <option value="bank">银行卡</option>
                        </select>
                      </div>
                      
                      {/* 日期范围 */}
                      <div className="mb-4">
                        <label className="block text-sm font-medium text-text-secondary mb-2">日期范围</label>
                        <div className="flex space-x-2">
                          <input 
                            type="date" 
                            value={filterState.startDate}
                            onChange={(e) => handleFilterChange('startDate', e.target.value)}
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary"
                          />
                          <input 
                            type="date" 
                            value={filterState.endDate}
                            onChange={(e) => handleFilterChange('endDate', e.target.value)}
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary"
                          />
                        </div>
                      </div>
                      
                      {/* 金额范围 */}
                      <div className="mb-4">
                        <label className="block text-sm font-medium text-text-secondary mb-2">金额范围</label>
                        <div className="flex space-x-2">
                          <input 
                            type="number" 
                            placeholder="最低金额" 
                            value={filterState.minAmount}
                            onChange={(e) => handleFilterChange('minAmount', e.target.value)}
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary"
                          />
                          <input 
                            type="number" 
                            placeholder="最高金额" 
                            value={filterState.maxAmount}
                            onChange={(e) => handleFilterChange('maxAmount', e.target.value)}
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-2 focus:ring-secondary"
                          />
                        </div>
                      </div>
                      
                      <div className="flex space-x-2">
                        <button 
                          onClick={applyFilterClick}
                          className={`flex-1 ${styles.btnPrimary} py-2 rounded-lg font-medium`}
                        >
                          应用筛选
                        </button>
                        <button 
                          onClick={resetFilters}
                          className={`flex-1 ${styles.btnSecondary} py-2 rounded-lg font-medium`}
                        >
                          重置
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* 添加记录按钮 */}
                <button 
                  onClick={() => navigate('/consume-record-edit')}
                  className={`flex items-center space-x-2 px-4 py-2 ${styles.btnPrimary} rounded-lg shadow-sm`}
                >
                  <i className="fas fa-plus"></i>
                  <span>添加记录</span>
                </button>
                
                {/* 导出按钮 */}
                <button 
                  onClick={exportData}
                  className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:border-secondary hover:bg-primary transition-colors shadow-sm"
                >
                  <i className="fas fa-download"></i>
                  <span>导出</span>
                </button>
              </div>
            </div>
          </div>

          {/* 数据展示区域 */}
          <div className="bg-white rounded-2xl shadow-card overflow-hidden mb-6">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th 
                      className={`px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider cursor-pointer ${styles.sortButton}`}
                      onClick={() => handleSort('date')}
                    >
                      <div className="flex items-center space-x-1">
                        <span>日期</span>
                        <i className={`fas ${sortField === 'date' ? (sortOrder === 'asc' ? 'fa-sort-up' : 'fa-sort-down') : 'fa-sort'} text-xs`}></i>
                      </div>
                    </th>
                    <th 
                      className={`px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider cursor-pointer ${styles.sortButton}`}
                      onClick={() => handleSort('merchant')}
                    >
                      <div className="flex items-center space-x-1">
                        <span>商家</span>
                        <i className={`fas ${sortField === 'merchant' ? (sortOrder === 'asc' ? 'fa-sort-up' : 'fa-sort-down') : 'fa-sort'} text-xs`}></i>
                      </div>
                    </th>
                    <th 
                      className={`px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider cursor-pointer ${styles.sortButton}`}
                      onClick={() => handleSort('category')}
                    >
                      <div className="flex items-center space-x-1">
                        <span>分类</span>
                        <i className={`fas ${sortField === 'category' ? (sortOrder === 'asc' ? 'fa-sort-up' : 'fa-sort-down') : 'fa-sort'} text-xs`}></i>
                      </div>
                    </th>
                    <th 
                      className={`px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider cursor-pointer ${styles.sortButton}`}
                      onClick={() => handleSort('amount')}
                    >
                      <div className="flex items-center space-x-1">
                        <span>金额</span>
                        <i className={`fas ${sortField === 'amount' ? (sortOrder === 'asc' ? 'fa-sort-up' : 'fa-sort-down') : 'fa-sort'} text-xs`}></i>
                      </div>
                    </th>
                    <th 
                      className={`px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider cursor-pointer ${styles.sortButton}`}
                      onClick={() => handleSort('account')}
                    >
                      <div className="flex items-center space-x-1">
                        <span>账户</span>
                        <i className={`fas ${sortField === 'account' ? (sortOrder === 'asc' ? 'fa-sort-up' : 'fa-sort-down') : 'fa-sort'} text-xs`}></i>
                      </div>
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">备注</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">操作</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {currentPageData.map(transaction => (
                    <tr key={transaction.id} className={styles.tableRow}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-text-primary">
                        {formatDate(transaction.date)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center mr-3">
                            <i className={`${transaction.categoryIcon} text-sm`}></i>
                          </div>
                          <span className="text-sm font-medium text-text-primary">{transaction.merchant}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                          {transaction.category}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-red-600">
                        ¥{Math.abs(transaction.amount).toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-text-secondary">
                        {transaction.account}
                      </td>
                      <td className="px-6 py-4 text-sm text-text-secondary max-w-xs truncate">
                        {transaction.note}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center space-x-2">
                          <button 
                            onClick={() => showTransactionDetail(transaction.id)}
                            className={`text-secondary hover:text-yellow-500 transition-colors ${styles.btnIcon} p-1.5 rounded-full hover:bg-secondary/10`}
                          >
                            <i className="fas fa-eye"></i>
                          </button>
                          <button 
                            onClick={() => editTransaction(transaction.id)}
                            className={`text-blue-500 hover:text-blue-700 transition-colors ${styles.btnIcon} p-1.5 rounded-full hover:bg-blue-500/10`}
                          >
                            <i className="fas fa-edit"></i>
                          </button>
                          <button 
                            onClick={() => showDeleteModalHandler(transaction.id)}
                            className={`text-red-500 hover:text-red-700 transition-colors ${styles.btnIcon} p-1.5 rounded-full hover:bg-red-500/10`}
                          >
                            <i className="fas fa-trash"></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* 分页区域 */}
          <div className="bg-white rounded-2xl shadow-card p-4">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
              {/* 显示信息 */}
              <div className="text-sm text-text-secondary">
                显示 <span>{totalItems > 0 ? startIndex + 1 : 0}</span> 到 <span>{endIndex}</span> 条，共 <span>{totalItems}</span> 条记录
              </div>
              
              {/* 分页控件 */}
              <div className="flex items-center space-x-2">
                {/* 每页条数选择 */}
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-text-secondary">每页</span>
                  <select 
                    value={pageSize}
                    onChange={(e) => handlePageSizeChange(parseInt(e.target.value))}
                    className="border border-gray-300 rounded-lg px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-secondary"
                  >
                    <option value="10">10</option>
                    <option value="20">20</option>
                    <option value="50">50</option>
                  </select>
                  <span className="text-sm text-text-secondary">条</span>
                </div>
                
                {/* 分页按钮 */}
                <div className="flex items-center space-x-1 ml-4">
                  <button 
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="px-3 py-1 border border-gray-300 rounded-lg text-sm hover:border-secondary hover:bg-primary transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
                  >
                    <i className="fas fa-chevron-left"></i>
                  </button>
                  <div className="flex items-center space-x-1">
                    {generatePageNumbers().map(page => (
                      <button
                        key={page}
                        onClick={() => handlePageChange(page)}
                        className={`px-3 py-1 border rounded-lg text-sm transition-colors shadow-sm ${
                          page === currentPage 
                            ? 'bg-secondary text-white border-secondary' 
                            : 'border-gray-300 hover:border-secondary hover:bg-primary'
                        }`}
                      >
                        {page}
                      </button>
                    ))}
                  </div>
                  <button 
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages || totalPages === 0}
                    className="px-3 py-1 border border-gray-300 rounded-lg text-sm hover:border-secondary hover:bg-primary transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
                  >
                    <i className="fas fa-chevron-right"></i>
                  </button>
                </div>
                
                {/* 跳转页码 */}
                <div className="flex items-center space-x-2 ml-4">
                  <span className="text-sm text-text-secondary">跳转到</span>
                  <input 
                    type="number" 
                    min="1" 
                    max={totalPages}
                    value={currentPage}
                    onChange={(e) => handleGoToPage(parseInt(e.target.value) || 1)}
                    className="w-16 border border-gray-300 rounded-lg px-2 py-1 text-sm text-center focus:outline-none focus:ring-2 focus:ring-secondary"
                  />
                  <button 
                    onClick={() => handleGoToPage(currentPage)}
                    className={`px-3 py-1 ${styles.btnPrimary} rounded-lg text-sm font-medium shadow-sm`}
                  >
                    跳转
                  </button>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* 删除确认模态框 */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50">
          <div className="flex items-center justify-center min-h-screen p-4">
            <div className="bg-white rounded-2xl shadow-lg max-w-md w-full">
              <div className="p-6">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mr-4">
                    <i className="fas fa-exclamation-triangle text-red-500 text-xl"></i>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-text-primary">确认删除</h3>
                    <p className="text-sm text-text-secondary">此操作不可撤销</p>
                  </div>
                </div>
                <p className="text-text-secondary mb-6">确定要删除这笔账单记录吗？删除后将无法恢复。</p>
                <div className="flex space-x-3">
                  <button 
                    onClick={closeDeleteModal}
                    className={`flex-1 py-2 ${styles.btnSecondary} rounded-lg font-medium`}
                  >
                    取消
                  </button>
                  <button 
                    onClick={confirmDelete}
                    className={`flex-1 py-2 ${styles.btnDanger} rounded-lg font-medium`}
                  >
                    删除
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 账单详情抽屉 */}
      {showTransactionDrawer && selectedTransaction && (
        <div className="fixed inset-y-0 right-0 w-96 bg-white shadow-xl transform transition-transform duration-300 ease-in-out z-50">
          <div className="flex flex-col h-full">
            {/* 抽屉头部 */}
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-text-primary">账单详情</h3>
              <button 
                onClick={closeDrawer}
                className="p-2 text-gray-400 hover:text-gray-600"
              >
                <i className="fas fa-times"></i>
              </button>
            </div>
            
            {/* 抽屉内容 */}
            <div className="flex-1 overflow-y-auto p-6">
              <div className="space-y-4">
                {/* 基本信息 */}
                <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
                  <h4 className="font-medium text-text-primary mb-4 flex items-center">
                    <i className="fas fa-info-circle text-secondary mr-2"></i>
                    基本信息
                  </h4>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center pb-2 border-b border-gray-100">
                      <span className="text-sm text-text-secondary">商家名称</span>
                      <span className="text-sm font-medium text-text-primary">{selectedTransaction.merchant}</span>
                    </div>
                    <div className="flex justify-between items-center pb-2 border-b border-gray-100">
                      <span className="text-sm text-text-secondary">消费金额</span>
                      <span className="text-lg font-semibold text-red-600">¥{Math.abs(selectedTransaction.amount).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-center pb-2 border-b border-gray-100">
                      <span className="text-sm text-text-secondary">消费时间</span>
                      <span className="text-sm text-text-primary">{formatDate(selectedTransaction.date)} {selectedTransaction.time}</span>
                    </div>
                    <div className="flex justify-between items-center pb-2 border-b border-gray-100">
                      <span className="text-sm text-text-secondary">消费分类</span>
                      <span className="text-sm text-text-primary">
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                          {selectedTransaction.category}
                        </span>
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-text-secondary">支付账户</span>
                      <span className="text-sm text-text-primary">{selectedTransaction.account}</span>
                    </div>
                  </div>
                </div>

                {/* 备注信息 */}
                <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
                  <h4 className="font-medium text-text-primary mb-3 flex items-center">
                    <i className="fas fa-sticky-note text-secondary mr-2"></i>
                    备注信息
                  </h4>
                  <p className="text-sm text-text-primary bg-gray-50 p-3 rounded-lg">{selectedTransaction.note}</p>
                </div>

                {/* 小票图片 */}
                <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
                  <h4 className="font-medium text-text-primary mb-3 flex items-center">
                    <i className="fas fa-receipt text-secondary mr-2"></i>
                    小票图片
                  </h4>
                  <div className="flex justify-center">
                    <img 
                      src={selectedTransaction.imageUrl} 
                      alt="消费小票" 
                      className="max-w-full h-48 object-cover rounded-lg cursor-pointer shadow-md hover:shadow-lg transition-shadow duration-300 transform hover:scale-[1.02]"
                      data-category="商业科技"
                      onClick={() => window.open(selectedTransaction.imageUrl, '_blank')}
                    />
                  </div>
                </div>
              </div>
            </div>
            
            {/* 抽屉底部操作按钮 */}
            <div className="px-6 py-4 border-t border-gray-200">
              <div className="flex space-x-3">
                <button 
                  onClick={() => editTransaction(selectedTransaction.id)}
                  className={`flex-1 py-2 ${styles.btnPrimary} rounded-lg font-medium`}
                >
                  编辑
                </button>
                <button 
                  onClick={() => showDeleteModalHandler(selectedTransaction.id)}
                  className={`flex-1 py-2 ${styles.btnDanger} rounded-lg font-medium`}
                >
                  删除
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HistoryPage;

