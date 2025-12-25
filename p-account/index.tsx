

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styles from './styles.module.css';

interface Account {
  id: number;
  name: string;
  initialBalance: number;
  currentBalance: number;
}

interface SortConfig {
  field: keyof Account | '';
  direction: 'asc' | 'desc' | '';
}

const AccountPage: React.FC = () => {
  // 模拟账户数据
  const [accounts, setAccounts] = useState<Account[]>([
    { id: 1, name: '现金', initialBalance: 1000.00, currentBalance: 850.50 },
    { id: 2, name: '支付宝', initialBalance: 5000.00, currentBalance: 3200.80 },
    { id: 3, name: '微信支付', initialBalance: 2000.00, currentBalance: 1500.25 },
    { id: 4, name: '招商银行', initialBalance: 10000.00, currentBalance: 8900.00 },
    { id: 5, name: '工商银行', initialBalance: 8000.00, currentBalance: 6700.30 }
  ]);

  const [showAccountModal, setShowAccountModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [currentEditingAccount, setCurrentEditingAccount] = useState<Account | null>(null);
  const [accountToDelete, setAccountToDelete] = useState<Account | null>(null);
  const [accountSearchTerm, setAccountSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState<SortConfig>({ field: '', direction: '' });
  const [formData, setFormData] = useState({
    accountName: '',
    initialBalance: ''
  });

  // 设置页面标题
  useEffect(() => {
    const originalTitle = document.title;
    document.title = '账户管理 - 省点';
    return () => { document.title = originalTitle; };
  }, []);

  // 过滤和排序账户数据
  const getFilteredAndSortedAccounts = (): Account[] => {
    let filteredAccounts = accounts.filter(account => 
      account.name.toLowerCase().includes(accountSearchTerm.toLowerCase())
    );

    if (sortConfig.field) {
      filteredAccounts.sort((a, b) => {
        const aValue = a[sortConfig.field];
        const bValue = b[sortConfig.field];
        
        if (sortConfig.field === 'name') {
          return sortConfig.direction === 'asc' 
            ? aValue.localeCompare(bValue) 
            : bValue.localeCompare(aValue);
        } else {
          return sortConfig.direction === 'asc' 
            ? aValue - bValue 
            : bValue - aValue;
        }
      });
    }

    return filteredAccounts;
  };

  const handleSort = (field: keyof Account) => {
    const newDirection = sortConfig.field === field && sortConfig.direction === 'asc' ? 'desc' : 'asc';
    setSortConfig({ field, direction: newDirection });
  };

  const handleOpenAccountModal = (account: Account | null = null) => {
    setCurrentEditingAccount(account);
    if (account) {
      setFormData({
        accountName: account.name,
        initialBalance: account.initialBalance.toFixed(2)
      });
    } else {
      setFormData({
        accountName: '',
        initialBalance: ''
      });
    }
    setShowAccountModal(true);
  };

  const handleCloseAccountModal = () => {
    setShowAccountModal(false);
    setCurrentEditingAccount(null);
    setFormData({ accountName: '', initialBalance: '' });
  };

  const handleSaveAccount = (e: React.FormEvent) => {
    e.preventDefault();
    
    const name = formData.accountName.trim();
    const initialBalance = parseFloat(formData.initialBalance);
    
    if (!name || isNaN(initialBalance)) {
      alert('请填写完整的账户信息');
      return;
    }
    
    if (currentEditingAccount) {
      // 编辑账户
      setAccounts(prevAccounts => 
        prevAccounts.map(account => 
          account.id === currentEditingAccount.id 
            ? { ...account, name }
            : account
        )
      );
    } else {
      // 新增账户
      const newAccount: Account = {
        id: Math.max(...accounts.map(a => a.id)) + 1,
        name,
        initialBalance,
        currentBalance: initialBalance
      };
      setAccounts(prevAccounts => [...prevAccounts, newAccount]);
    }
    
    handleCloseAccountModal();
  };

  const handleDeleteAccount = (account: Account) => {
    setAccountToDelete(account);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = () => {
    if (accountToDelete) {
      setAccounts(prevAccounts => 
        prevAccounts.filter(account => account.id !== accountToDelete.id)
      );
    }
    setShowDeleteModal(false);
    setAccountToDelete(null);
  };

  const handleCloseDeleteModal = () => {
    setShowDeleteModal(false);
    setAccountToDelete(null);
  };

  const handleModalBackdropClick = (e: React.MouseEvent, closeModal: () => void) => {
    if (e.target === e.currentTarget) {
      closeModal();
    }
  };

  const filteredAndSortedAccounts = getFilteredAndSortedAccounts();

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
                src="https://s.coze.cn/image/2Ra9xKshjx8/" 
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
                <Link to="/account" className={`${styles.navItem} ${styles.navItemActive} flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium`}>
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
                <h2 className="text-2xl font-bold text-text-primary mb-2">账户管理</h2>
                <nav className="text-sm text-text-secondary">
                  <span>首页</span>
                  <i className="fas fa-chevron-right mx-2"></i>
                  <span>账户管理</span>
                </nav>
              </div>
              <button 
                onClick={() => handleOpenAccountModal()}
                className="bg-secondary text-white px-6 py-3 rounded-lg font-medium hover:bg-yellow-500 transition-colors flex items-center space-x-2"
              >
                <i className="fas fa-plus"></i>
                <span>新增账户</span>
              </button>
            </div>
          </div>

          {/* 账户列表 */}
          <section className={`bg-white rounded-2xl shadow-card p-6 ${styles.cardHover}`}>
            {/* 工具栏 */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <input 
                    type="text" 
                    placeholder="搜索账户名称..." 
                    value={accountSearchTerm}
                    onChange={(e) => setAccountSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent"
                  />
                  <i className="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
                </div>
              </div>
              <div className="text-sm text-text-secondary">
                共 <span className="font-semibold text-text-primary">{filteredAndSortedAccounts.length}</span> 个账户
              </div>
            </div>

            {/* 账户表格 */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-semibold text-text-primary">
                      <div className="flex items-center space-x-2">
                        <span>账户名称</span>
                        <button 
                          onClick={() => handleSort('name')}
                          className={`${styles.sortButton} text-gray-400 hover:text-secondary ${sortConfig.field === 'name' ? styles.sortActive : ''}`}
                        >
                          <i className={`fas ${sortConfig.field === 'name' ? (sortConfig.direction === 'asc' ? 'fa-sort-up' : 'fa-sort-down') : 'fa-sort'} text-xs`}></i>
                        </button>
                      </div>
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-text-primary">
                      <div className="flex items-center space-x-2">
                        <span>初始金额</span>
                        <button 
                          onClick={() => handleSort('initialBalance')}
                          className={`${styles.sortButton} text-gray-400 hover:text-secondary ${sortConfig.field === 'initialBalance' ? styles.sortActive : ''}`}
                        >
                          <i className={`fas ${sortConfig.field === 'initialBalance' ? (sortConfig.direction === 'asc' ? 'fa-sort-up' : 'fa-sort-down') : 'fa-sort'} text-xs`}></i>
                        </button>
                      </div>
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-text-primary">
                      <div className="flex items-center space-x-2">
                        <span>当前余额</span>
                        <button 
                          onClick={() => handleSort('currentBalance')}
                          className={`${styles.sortButton} text-gray-400 hover:text-secondary ${sortConfig.field === 'currentBalance' ? styles.sortActive : ''}`}
                        >
                          <i className={`fas ${sortConfig.field === 'currentBalance' ? (sortConfig.direction === 'asc' ? 'fa-sort-up' : 'fa-sort-down') : 'fa-sort'} text-xs`}></i>
                        </button>
                      </div>
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-text-primary">操作</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAndSortedAccounts.map(account => (
                    <tr key={account.id} className={`${styles.tableRow} border-b border-gray-100`}>
                      <td className="py-3 px-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                            <i className="fas fa-wallet text-blue-500"></i>
                          </div>
                          <span className="font-medium text-text-primary">{account.name}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className="text-text-primary">¥{account.initialBalance.toFixed(2)}</span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="font-semibold text-text-primary">¥{account.currentBalance.toFixed(2)}</span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center space-x-2">
                          <button 
                            onClick={() => handleOpenAccountModal(account)}
                            className="text-secondary hover:text-yellow-500 text-sm font-medium"
                          >
                            <i className="fas fa-edit mr-1"></i>编辑
                          </button>
                          <button 
                            onClick={() => handleDeleteAccount(account)}
                            className="text-red-500 hover:text-red-600 text-sm font-medium"
                          >
                            <i className="fas fa-trash mr-1"></i>删除
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* 分页 */}
            <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-200">
              <div className="text-sm text-text-secondary">
                显示第 <span className="font-semibold">1</span> 到 <span className="font-semibold">{filteredAndSortedAccounts.length}</span> 条，共 <span className="font-semibold">{filteredAndSortedAccounts.length}</span> 条记录
              </div>
              <div className="flex items-center space-x-2">
                <button className="px-3 py-1 border border-gray-300 rounded text-sm hover:bg-gray-50 disabled:opacity-50" disabled>
                  <i className="fas fa-chevron-left"></i>
                </button>
                <button className="px-3 py-1 bg-secondary text-white rounded text-sm">1</button>
                <button className="px-3 py-1 border border-gray-300 rounded text-sm hover:bg-gray-50 disabled:opacity-50" disabled>
                  <i className="fas fa-chevron-right"></i>
                </button>
              </div>
            </div>
          </section>
        </main>
      </div>

      {/* 新增/编辑账户模态框 */}
      {showAccountModal && (
        <div 
          className="fixed inset-0 z-50"
          onClick={(e) => handleModalBackdropClick(e, handleCloseAccountModal)}
        >
          <div className={`${styles.modalBackdrop} absolute inset-0`}></div>
          <div className="relative flex items-center justify-center min-h-screen p-4">
            <div className={`bg-white rounded-2xl shadow-xl w-full max-w-md ${styles.modalEnter}`}>
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-text-primary">
                    {currentEditingAccount ? '编辑账户' : '新增账户'}
                  </h3>
                  <button 
                    onClick={handleCloseAccountModal}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <i className="fas fa-times"></i>
                  </button>
                </div>
                
                <form onSubmit={handleSaveAccount} className="space-y-4">
                  <div>
                    <label htmlFor="account-name" className="block text-sm font-medium text-text-primary mb-2">
                      账户名称 *
                    </label>
                    <input 
                      type="text" 
                      id="account-name"
                      value={formData.accountName}
                      onChange={(e) => setFormData(prev => ({ ...prev, accountName: e.target.value }))}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent" 
                      placeholder="请输入账户名称" 
                      required 
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="initial-balance" className="block text-sm font-medium text-text-primary mb-2">
                      初始金额 *
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-secondary">¥</span>
                      <input 
                        type="number" 
                        id="initial-balance"
                        step="0.01" 
                        min="0"
                        value={formData.initialBalance}
                        onChange={(e) => setFormData(prev => ({ ...prev, initialBalance: e.target.value }))}
                        className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent" 
                        placeholder="0.00" 
                        required 
                      />
                    </div>
                  </div>
                  
                  <div className="flex space-x-3 pt-4">
                    <button 
                      type="button"
                      onClick={handleCloseAccountModal}
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

      {/* 删除确认模态框 */}
      {showDeleteModal && (
        <div 
          className="fixed inset-0 z-50"
          onClick={(e) => handleModalBackdropClick(e, handleCloseDeleteModal)}
        >
          <div className={`${styles.modalBackdrop} absolute inset-0`}></div>
          <div className="relative flex items-center justify-center min-h-screen p-4">
            <div className={`bg-white rounded-2xl shadow-xl w-full max-w-sm ${styles.modalEnter}`}>
              <div className="p-6">
                <div className="text-center">
                  <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <i className="fas fa-exclamation-triangle text-red-500 text-2xl"></i>
                  </div>
                  <h3 className="text-lg font-semibold text-text-primary mb-2">确认删除</h3>
                  <p className="text-text-secondary mb-6">
                    确定要删除账户 "<span className="font-medium">{accountToDelete?.name}</span>" 吗？此操作不可撤销。
                  </p>
                  
                  <div className="flex space-x-3">
                    <button 
                      onClick={handleCloseDeleteModal}
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-text-secondary hover:bg-gray-50 transition-colors"
                    >
                      取消
                    </button>
                    <button 
                      onClick={handleConfirmDelete}
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

export default AccountPage;

