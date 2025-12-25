

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styles from './styles.module.css';

interface Budget {
  id: number;
  name: string;
  amount: number;
  used: number;
  period: 'monthly' | 'quarterly' | 'yearly';
}

type SortField = 'name' | 'amount' | 'used' | 'remaining' | 'period';
type SortOrder = 'asc' | 'desc';

const BudgetPage: React.FC = () => {
  const [budgets, setBudgets] = useState<Budget[]>([
    {
      id: 1,
      name: '月度总预算',
      amount: 3000,
      used: 2040,
      period: 'monthly'
    },
    {
      id: 2,
      name: '食品餐饮预算',
      amount: 1000,
      used: 850,
      period: 'monthly'
    },
    {
      id: 3,
      name: '交通出行预算',
      amount: 500,
      used: 320,
      period: 'monthly'
    },
    {
      id: 4,
      name: '日常用品预算',
      amount: 600,
      used: 450,
      period: 'monthly'
    },
    {
      id: 5,
      name: '休闲娱乐预算',
      amount: 400,
      used: 420,
      period: 'monthly'
    },
    {
      id: 6,
      name: '季度旅游预算',
      amount: 2000,
      used: 1200,
      period: 'quarterly'
    },
    {
      id: 7,
      name: '年度医疗预算',
      amount: 3000,
      used: 500,
      period: 'yearly'
    }
  ]);

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);
  const [sortField, setSortField] = useState<SortField>('');
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');
  const [showBudgetModal, setShowBudgetModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [editingBudgetId, setEditingBudgetId] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // 表单状态
  const [budgetName, setBudgetName] = useState('');
  const [budgetAmount, setBudgetAmount] = useState('');
  const [budgetPeriod, setBudgetPeriod] = useState('');

  // 设置页面标题
  useEffect(() => {
    const originalTitle = document.title;
    document.title = '预算设置 - 省点';
    return () => { document.title = originalTitle; };
  }, []);

  // 排序和分页逻辑
  const getSortedAndFilteredBudgets = (): Budget[] => {
    let filteredBudgets = budgets;

    // 搜索过滤
    if (searchQuery) {
      filteredBudgets = budgets.filter(budget => 
        budget.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // 排序
    if (sortField) {
      filteredBudgets.sort((a, b) => {
        let aValue: string | number;
        let bValue: string | number;

        if (sortField === 'remaining') {
          aValue = a.amount - a.used;
          bValue = b.amount - b.used;
        } else {
          aValue = a[sortField];
          bValue = b[sortField];
        }

        if (typeof aValue === 'string' && typeof bValue === 'string') {
          return sortOrder === 'asc' 
            ? aValue.localeCompare(bValue)
            : bValue.localeCompare(aValue);
        } else if (typeof aValue === 'number' && typeof bValue === 'number') {
          return sortOrder === 'asc' 
            ? aValue - bValue
            : bValue - aValue;
        }

        return 0;
      });
    }

    return filteredBudgets;
  };

  const sortedBudgets = getSortedAndFilteredBudgets();
  const totalPages = Math.ceil(sortedBudgets.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const currentPageBudgets = sortedBudgets.slice(startIndex, endIndex);

  // 事件处理函数
  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const openBudgetModal = (budget: Budget | null = null) => {
    setEditingBudgetId(budget ? budget.id : null);
    setBudgetName(budget ? budget.name : '');
    setBudgetAmount(budget ? budget.amount.toString() : '');
    setBudgetPeriod(budget ? budget.period : '');
    setShowBudgetModal(true);
  };

  const closeBudgetModal = () => {
    setShowBudgetModal(false);
    setEditingBudgetId(null);
    setBudgetName('');
    setBudgetAmount('');
    setBudgetPeriod('');
  };

  const handleBudgetSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!budgetName.trim() || !budgetAmount || !budgetPeriod) {
      alert('请填写完整的预算信息');
      return;
    }

    const amount = parseFloat(budgetAmount);

    if (editingBudgetId) {
      // 编辑预算
      setBudgets(prevBudgets => 
        prevBudgets.map(budget => 
          budget.id === editingBudgetId
            ? { ...budget, name: budgetName, amount, period: budgetPeriod as 'monthly' | 'quarterly' | 'yearly' }
            : budget
        )
      );
    } else {
      // 新增预算
      const newBudget: Budget = {
        id: Math.max(...budgets.map(b => b.id)) + 1,
        name: budgetName,
        amount,
        used: 0,
        period: budgetPeriod as 'monthly' | 'quarterly' | 'yearly'
      };
      setBudgets(prevBudgets => [...prevBudgets, newBudget]);
    }

    closeBudgetModal();
  };

  const openDeleteModal = (budgetId: number) => {
    setEditingBudgetId(budgetId);
    setShowDeleteModal(true);
  };

  const closeDeleteModal = () => {
    setShowDeleteModal(false);
    setEditingBudgetId(null);
  };

  const handleDeleteConfirm = () => {
    if (editingBudgetId) {
      setBudgets(prevBudgets => 
        prevBudgets.filter(budget => budget.id !== editingBudgetId)
      );
      closeDeleteModal();
    }
  };

  const getPeriodText = (period: string): string => {
    const periodMap: { [key: string]: string } = {
      'monthly': '月度',
      'quarterly': '季度',
      'yearly': '年度'
    };
    return periodMap[period] || period;
  };

  const getProgressClass = (progress: number): string => {
    if (progress > 90) return 'bg-red-500';
    if (progress > 70) return 'bg-yellow-500';
    return styles.progressBar;
  };

  const renderPageNumbers = () => {
    const pageNumbers = [];
    for (let i = 1; i <= totalPages; i++) {
      if (i === 1 || i === totalPages || (i >= currentPage - 1 && i <= currentPage + 1)) {
        pageNumbers.push(
          <button
            key={i}
            className={`${styles.paginationButton} px-3 py-1 border border-gray-300 rounded ${i === currentPage ? styles.active : ''}`}
            onClick={() => handlePageChange(i)}
          >
            {i}
          </button>
        );
      } else if (i === currentPage - 2 || i === currentPage + 2) {
        pageNumbers.push(
          <span key={`ellipsis-${i}`} className="px-2 text-gray-400">...</span>
        );
      }
    }
    return pageNumbers;
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
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
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
                src="https://s.coze.cn/image/Lg6Boa2EmSU/" 
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
        <aside className={`fixed left-0 top-16 bottom-0 w-64 bg-white border-r border-border-light ${styles.sidebarTransition} z-40`}>
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
                <Link to="/recommend" className={`${styles.navItem} flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium text-gray-600`}>
                  <i className="fas fa-gift text-lg"></i>
                  <span>省钱推荐</span>
                </Link>
              </li>
              <li>
                <Link to="/budget" className={`${styles.navItem} ${styles.navItemActive} flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium`}>
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
                <h2 className="text-2xl font-bold text-text-primary mb-2">预算设置</h2>
                <nav className="text-sm text-text-secondary">
                  <Link to="/home" className="hover:text-secondary">首页</Link>
                  <span className="mx-2">/</span>
                  <span>预算设置</span>
                </nav>
              </div>
              <button 
                onClick={() => openBudgetModal()}
                className="bg-secondary text-white px-6 py-3 rounded-lg font-medium hover:bg-yellow-500 transition-colors flex items-center space-x-2"
              >
                <i className="fas fa-plus"></i>
                <span>新增预算</span>
              </button>
            </div>
          </div>

          {/* 预算列表 */}
          <section className={`bg-white rounded-2xl shadow-card p-6 ${styles.cardHover}`}>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th 
                      className="text-left py-3 px-4 font-semibold text-text-primary cursor-pointer hover:text-secondary"
                      onClick={() => handleSort('name')}
                    >
                      预算名称 <i className="fas fa-sort ml-1 text-xs"></i>
                    </th>
                    <th 
                      className="text-left py-3 px-4 font-semibold text-text-primary cursor-pointer hover:text-secondary"
                      onClick={() => handleSort('amount')}
                    >
                      预算金额 <i className="fas fa-sort ml-1 text-xs"></i>
                    </th>
                    <th 
                      className="text-left py-3 px-4 font-semibold text-text-primary cursor-pointer hover:text-secondary"
                      onClick={() => handleSort('used')}
                    >
                      已用金额 <i className="fas fa-sort ml-1 text-xs"></i>
                    </th>
                    <th 
                      className="text-left py-3 px-4 font-semibold text-text-primary cursor-pointer hover:text-secondary"
                      onClick={() => handleSort('remaining')}
                    >
                      剩余金额 <i className="fas fa-sort ml-1 text-xs"></i>
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-text-primary">进度</th>
                    <th 
                      className="text-left py-3 px-4 font-semibold text-text-primary cursor-pointer hover:text-secondary"
                      onClick={() => handleSort('period')}
                    >
                      周期 <i className="fas fa-sort ml-1 text-xs"></i>
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-text-primary">操作</th>
                  </tr>
                </thead>
                <tbody>
                  {currentPageBudgets.map(budget => {
                    const remaining = budget.amount - budget.used;
                    const progress = Math.min((budget.used / budget.amount) * 100, 100);
                    
                    return (
                      <tr key={budget.id} className={`${styles.tableRow} border-b border-gray-100`}>
                        <td className="py-4 px-4">
                          <div className="font-medium text-text-primary">{budget.name}</div>
                        </td>
                        <td className="py-4 px-4">
                          <div className="text-text-primary">¥{budget.amount.toFixed(2)}</div>
                        </td>
                        <td className="py-4 px-4">
                          <div className="text-text-primary">¥{budget.used.toFixed(2)}</div>
                        </td>
                        <td className="py-4 px-4">
                          <div className="text-text-primary">¥{remaining.toFixed(2)}</div>
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center space-x-2">
                            <div className="w-24 bg-gray-200 rounded-full h-2">
                              <div 
                                className={`${getProgressClass(progress)} h-2 rounded-full`} 
                                style={{ width: `${progress}%` }}
                              ></div>
                            </div>
                            <span className="text-xs text-text-secondary">{Math.round(progress)}%</span>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <div className="text-text-primary">{getPeriodText(budget.period)}</div>
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex space-x-2">
                            <button 
                              onClick={() => openBudgetModal(budget)}
                              className="text-secondary hover:text-yellow-500 text-sm"
                            >
                              <i className="fas fa-edit"></i>
                            </button>
                            <button 
                              onClick={() => openDeleteModal(budget.id)}
                              className="text-red-500 hover:text-red-600 text-sm"
                            >
                              <i className="fas fa-trash"></i>
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* 分页区域 */}
            <div className="flex items-center justify-between mt-6">
              <div className="text-sm text-text-secondary">
                显示 <span>{startIndex + 1}</span> - <span>{Math.min(endIndex, sortedBudgets.length)}</span> 条，共 <span>{sortedBudgets.length}</span> 条记录
              </div>
              <div className="flex items-center space-x-2">
                <button 
                  onClick={handlePrevPage}
                  className={`${styles.paginationButton} px-3 py-1 border border-gray-300 rounded ${currentPage <= 1 ? styles.disabled : ''}`}
                  disabled={currentPage <= 1}
                >
                  <i className="fas fa-chevron-left"></i>
                </button>
                <div className="flex space-x-1">
                  {renderPageNumbers()}
                </div>
                <button 
                  onClick={handleNextPage}
                  className={`${styles.paginationButton} px-3 py-1 border border-gray-300 rounded ${currentPage >= totalPages ? styles.disabled : ''}`}
                  disabled={currentPage >= totalPages}
                >
                  <i className="fas fa-chevron-right"></i>
                </button>
              </div>
            </div>
          </section>
        </main>
      </div>

      {/* 新增/编辑预算模态弹窗 */}
      {showBudgetModal && (
        <div className="fixed inset-0 z-50">
          <div className={`${styles.modalBackdrop} absolute inset-0`} onClick={closeBudgetModal}></div>
          <div className="relative flex items-center justify-center min-h-screen p-4">
            <div 
              className={`bg-white rounded-2xl shadow-card max-w-md w-full ${styles.modalEnter}`}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-text-primary">
                    {editingBudgetId ? '编辑预算' : '新增预算'}
                  </h3>
                  <button onClick={closeBudgetModal} className="text-gray-400 hover:text-gray-600">
                    <i className="fas fa-times"></i>
                  </button>
                </div>
                
                <form onSubmit={handleBudgetSubmit} className="space-y-4">
                  <div>
                    <label htmlFor="budget-name" className="block text-sm font-medium text-text-primary mb-2">
                      预算名称
                    </label>
                    <input 
                      type="text" 
                      id="budget-name" 
                      value={budgetName}
                      onChange={(e) => setBudgetName(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent"
                      placeholder="请输入预算名称" 
                      required 
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="budget-amount" className="block text-sm font-medium text-text-primary mb-2">
                      预算金额
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-secondary">¥</span>
                      <input 
                        type="number" 
                        id="budget-amount" 
                        value={budgetAmount}
                        onChange={(e) => setBudgetAmount(e.target.value)}
                        className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent"
                        placeholder="0.00" 
                        step="0.01" 
                        min="0" 
                        required 
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="budget-period" className="block text-sm font-medium text-text-primary mb-2">
                      预算周期
                    </label>
                    <select 
                      id="budget-period" 
                      value={budgetPeriod}
                      onChange={(e) => setBudgetPeriod(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent" 
                      required
                    >
                      <option value="">请选择周期</option>
                      <option value="monthly">月度</option>
                      <option value="quarterly">季度</option>
                      <option value="yearly">年度</option>
                    </select>
                  </div>
                  
                  <div className="flex space-x-3 pt-4">
                    <button 
                      type="button" 
                      onClick={closeBudgetModal}
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-text-secondary hover:bg-gray-50 transition-colors"
                    >
                      取消
                    </button>
                    <button 
                      type="submit" 
                      className="flex-1 px-4 py-2 bg-secondary text-white rounded-lg hover:bg-yellow-500 transition-colors"
                    >
                      保存
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 删除确认模态弹窗 */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50">
          <div className={`${styles.modalBackdrop} absolute inset-0`} onClick={closeDeleteModal}></div>
          <div className="relative flex items-center justify-center min-h-screen p-4">
            <div 
              className={`bg-white rounded-2xl shadow-card max-w-sm w-full ${styles.modalEnter}`}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6">
                <div className="text-center">
                  <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <i className="fas fa-exclamation-triangle text-red-500 text-xl"></i>
                  </div>
                  <h3 className="text-lg font-semibold text-text-primary mb-2">确认删除</h3>
                  <p className="text-text-secondary mb-6">确定要删除这个预算吗？删除后无法恢复。</p>
                  <div className="flex space-x-3">
                    <button 
                      onClick={closeDeleteModal}
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-text-secondary hover:bg-gray-50 transition-colors"
                    >
                      取消
                    </button>
                    <button 
                      onClick={handleDeleteConfirm}
                      className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                    >
                      删除
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BudgetPage;

