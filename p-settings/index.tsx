

import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from './styles.module.css';

interface NotificationSettings {
  inapp: boolean;
  email: boolean;
  budget: boolean;
  deals: boolean;
}

interface PersonalInfo {
  username: string;
  email: string;
}

const SettingsPage: React.FC = () => {
  const navigate = useNavigate();
  
  // 页面标题设置
  useEffect(() => {
    const originalTitle = document.title;
    document.title = '设置 - 省点';
    return () => { document.title = originalTitle; };
  }, []);

  // 状态管理
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    personalInfo: true,
    notification: true,
    dataManagement: true,
    about: true
  });

  const [personalInfo, setPersonalInfo] = useState<PersonalInfo>({
    username: '张三',
    email: 'zhangsan@example.com'
  });

  const [tempPersonalInfo, setTempPersonalInfo] = useState<PersonalInfo>({
    username: '张三',
    email: 'zhangsan@example.com'
  });

  const [notificationSettings, setNotificationSettings] = useState<NotificationSettings>({
    inapp: true,
    email: true,
    budget: true,
    deals: true
  });

  const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [confirmMessage, setConfirmMessage] = useState('');
  const [confirmTitle, setConfirmTitle] = useState('');
  const [confirmCallback, setConfirmCallback] = useState<(() => void) | null>(null);
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [searchQuery, setSearchQuery] = useState('');

  // 处理设置项展开/收起
  const handleSectionToggle = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  // 处理个人信息表单提交
  const handlePersonalInfoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPersonalInfo(tempPersonalInfo);
    showSuccessToastMessage('个人信息保存成功');
  };

  // 取消个人信息修改
  const handlePersonalInfoCancel = () => {
    setTempPersonalInfo(personalInfo);
  };

  // 处理修改密码
  const handleChangePassword = () => {
    setShowChangePasswordModal(true);
  };

  // 关闭修改密码模态框
  const handleClosePasswordModal = () => {
    setShowChangePasswordModal(false);
    setPasswordForm({
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });
  };

  // 处理密码表单提交
  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      alert('新密码和确认密码不一致');
      return;
    }
    
    handleClosePasswordModal();
    showSuccessToastMessage('密码修改成功');
  };

  // 处理通知设置变化
  const handleNotificationChange = (key: keyof NotificationSettings) => {
    setNotificationSettings(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
    showSuccessToastMessage('通知设置已更新');
  };

  // 显示确认模态框
  const showConfirmDialog = (title: string, message: string, callback: () => void) => {
    setConfirmTitle(title);
    setConfirmMessage(message);
    setConfirmCallback(() => callback);
    setShowConfirmModal(true);
  };

  // 处理确认操作
  const handleConfirmOk = () => {
    setShowConfirmModal(false);
    if (confirmCallback) {
      confirmCallback();
    }
  };

  // 处理数据备份
  const handleBackupData = () => {
    showConfirmDialog('确认备份数据', '备份将保存您的所有账单和设置数据，此操作不可撤销。', () => {
      showSuccessToastMessage('数据备份成功');
    });
  };

  // 处理数据导出
  const handleExportData = () => {
    showSuccessToastMessage('数据导出成功');
  };

  // 处理账户注销
  const handleDeleteAccount = () => {
    showConfirmDialog('确认注销账户', '注销账户将删除您的所有数据，此操作不可撤销。', () => {
      showSuccessToastMessage('账户注销成功');
      setTimeout(() => {
        navigate('/login');
      }, 1500);
    });
  };

  // 显示成功提示
  const showSuccessToastMessage = (message: string) => {
    setSuccessMessage(message);
    setShowSuccessToast(true);
    setTimeout(() => {
      setShowSuccessToast(false);
    }, 3000);
  };

  // 处理搜索
  const handleSearchKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      const query = searchQuery.trim();
      if (query) {
        console.log('搜索:', query);
      }
    }
  };

  // 处理模态框背景点击
  const handleModalOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      setShowChangePasswordModal(false);
      setShowConfirmModal(false);
    }
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
                onKeyPress={handleSearchKeyPress}
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
                src="https://s.coze.cn/image/osvcHQdbBYI/" 
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
                <Link to="/settings" className={`${styles.navItem} ${styles.navItemActive} flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium`}>
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
                <h2 className="text-2xl font-bold text-text-primary mb-2">设置</h2>
                <nav className="text-sm text-text-secondary">
                  <span>首页</span>
                  <i className="fas fa-chevron-right mx-2"></i>
                  <span>设置</span>
                </nav>
              </div>
            </div>
          </div>

          {/* 设置项列表 */}
          <div className="space-y-6">
            {/* 个人信息设置 */}
            <section className={`bg-white rounded-2xl shadow-card p-6 ${styles.cardHover} ${styles.settingSection} ${!expandedSections.personalInfo ? 'collapsed' : ''}`}>
              <div 
                className="flex items-center justify-between cursor-pointer mb-4"
                onClick={() => handleSectionToggle('personalInfo')}
              >
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <i className="fas fa-user text-blue-500"></i>
                  </div>
                  <h3 className="text-lg font-semibold text-text-primary">个人信息</h3>
                </div>
                <i className={`fas fa-chevron-down text-gray-400 transition-transform duration-300 ${!expandedSections.personalInfo ? 'rotate-90' : ''}`}></i>
              </div>
              <div className={`${styles.settingContent} transition-all duration-300`}>
                <form onSubmit={handlePersonalInfoSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="username" className="block text-sm font-medium text-text-primary mb-2">用户名</label>
                      <input 
                        type="text" 
                        id="username" 
                        value={tempPersonalInfo.username}
                        onChange={(e) => setTempPersonalInfo(prev => ({ ...prev, username: e.target.value }))}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-text-primary mb-2">邮箱</label>
                      <input 
                        type="email" 
                        id="email" 
                        value={tempPersonalInfo.email}
                        onChange={(e) => setTempPersonalInfo(prev => ({ ...prev, email: e.target.value }))}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent"
                      />
                    </div>
                  </div>
                  <div className="flex justify-end space-x-3">
                    <button 
                      type="button" 
                      onClick={handlePersonalInfoCancel}
                      className="px-4 py-2 border border-gray-300 rounded-lg text-text-secondary hover:bg-gray-50"
                    >
                      取消
                    </button>
                    <button 
                      type="submit" 
                      className="px-4 py-2 bg-secondary text-white rounded-lg hover:bg-yellow-500"
                    >
                      保存
                    </button>
                  </div>
                </form>
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <button 
                    onClick={handleChangePassword}
                    className="text-secondary hover:text-yellow-500 text-sm font-medium"
                  >
                    <i className="fas fa-key mr-1"></i>修改密码
                  </button>
                </div>
              </div>
            </section>

            {/* 通知偏好设置 */}
            <section className={`bg-white rounded-2xl shadow-card p-6 ${styles.cardHover} ${styles.settingSection} ${!expandedSections.notification ? 'collapsed' : ''}`}>
              <div 
                className="flex items-center justify-between cursor-pointer mb-4"
                onClick={() => handleSectionToggle('notification')}
              >
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <i className="fas fa-bell text-green-500"></i>
                  </div>
                  <h3 className="text-lg font-semibold text-text-primary">通知偏好</h3>
                </div>
                <i className={`fas fa-chevron-down text-gray-400 transition-transform duration-300 ${!expandedSections.notification ? 'rotate-90' : ''}`}></i>
              </div>
              <div className={`${styles.settingContent} transition-all duration-300`}>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-text-primary">站内信通知</h4>
                      <p className="text-sm text-text-secondary">接收系统消息和优惠推荐</p>
                    </div>
                    <label className={styles.switch}>
                      <input 
                        type="checkbox" 
                        checked={notificationSettings.inapp}
                        onChange={() => handleNotificationChange('inapp')}
                      />
                      <span className={styles.slider}></span>
                    </label>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-text-primary">邮件通知</h4>
                      <p className="text-sm text-text-secondary">通过邮件接收重要提醒</p>
                    </div>
                    <label className={styles.switch}>
                      <input 
                        type="checkbox" 
                        checked={notificationSettings.email}
                        onChange={() => handleNotificationChange('email')}
                      />
                      <span className={styles.slider}></span>
                    </label>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-text-primary">预算提醒</h4>
                      <p className="text-sm text-text-secondary">预算即将用完时提醒</p>
                    </div>
                    <label className={styles.switch}>
                      <input 
                        type="checkbox" 
                        checked={notificationSettings.budget}
                        onChange={() => handleNotificationChange('budget')}
                      />
                      <span className={styles.slider}></span>
                    </label>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-text-primary">优惠推荐</h4>
                      <p className="text-sm text-text-secondary">接收个性化优惠信息</p>
                    </div>
                    <label className={styles.switch}>
                      <input 
                        type="checkbox" 
                        checked={notificationSettings.deals}
                        onChange={() => handleNotificationChange('deals')}
                      />
                      <span className={styles.slider}></span>
                    </label>
                  </div>
                </div>
              </div>
            </section>

            {/* 数据管理 */}
            <section className={`bg-white rounded-2xl shadow-card p-6 ${styles.cardHover} ${styles.settingSection} ${!expandedSections.dataManagement ? 'collapsed' : ''}`}>
              <div 
                className="flex items-center justify-between cursor-pointer mb-4"
                onClick={() => handleSectionToggle('dataManagement')}
              >
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                    <i className="fas fa-database text-purple-500"></i>
                  </div>
                  <h3 className="text-lg font-semibold text-text-primary">数据管理</h3>
                </div>
                <i className={`fas fa-chevron-down text-gray-400 transition-transform duration-300 ${!expandedSections.dataManagement ? 'rotate-90' : ''}`}></i>
              </div>
              <div className={`${styles.settingContent} transition-all duration-300`}>
                <div className="space-y-4">
                  <button 
                    onClick={handleBackupData}
                    className="w-full flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-secondary hover:bg-primary transition-colors"
                  >
                    <div className="flex items-center space-x-3">
                      <i className="fas fa-download text-green-500"></i>
                      <span className="font-medium text-text-primary">数据备份</span>
                    </div>
                    <i className="fas fa-chevron-right text-gray-400"></i>
                  </button>
                  
                  <button 
                    onClick={handleExportData}
                    className="w-full flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-secondary hover:bg-primary transition-colors"
                  >
                    <div className="flex items-center space-x-3">
                      <i className="fas fa-file-export text-blue-500"></i>
                      <span className="font-medium text-text-primary">数据导出</span>
                    </div>
                    <i className="fas fa-chevron-right text-gray-400"></i>
                  </button>
                  
                  <button 
                    onClick={handleDeleteAccount}
                    className="w-full flex items-center justify-between p-4 border border-red-200 rounded-lg hover:border-red-400 hover:bg-red-50 transition-colors"
                  >
                    <div className="flex items-center space-x-3">
                      <i className="fas fa-user-times text-red-500"></i>
                      <span className="font-medium text-red-600">账户注销</span>
                    </div>
                    <i className="fas fa-chevron-right text-gray-400"></i>
                  </button>
                </div>
              </div>
            </section>

            {/* 关于我们 */}
            <section className={`bg-white rounded-2xl shadow-card p-6 ${styles.cardHover} ${styles.settingSection} ${!expandedSections.about ? 'collapsed' : ''}`}>
              <div 
                className="flex items-center justify-between cursor-pointer mb-4"
                onClick={() => handleSectionToggle('about')}
              >
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                    <i className="fas fa-info-circle text-gray-500"></i>
                  </div>
                  <h3 className="text-lg font-semibold text-text-primary">关于我们</h3>
                </div>
                <i className={`fas fa-chevron-down text-gray-400 transition-transform duration-300 ${!expandedSections.about ? 'rotate-90' : ''}`}></i>
              </div>
              <div className={`${styles.settingContent} transition-all duration-300`}>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-text-secondary">版本</span>
                    <span className="font-medium text-text-primary">v1.0.0</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-text-secondary">隐私政策</span>
                    <button className="text-secondary hover:text-yellow-500 text-sm font-medium">
                      查看
                    </button>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-text-secondary">用户协议</span>
                    <button className="text-secondary hover:text-yellow-500 text-sm font-medium">
                      查看
                    </button>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-text-secondary">联系我们</span>
                    <button className="text-secondary hover:text-yellow-500 text-sm font-medium">
                      联系
                    </button>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </main>
      </div>

      {/* 修改密码模态框 */}
      {showChangePasswordModal && (
        <div className="fixed inset-0 z-50">
          <div className={styles.modalOverlay} onClick={handleModalOverlayClick}></div>
          <div className="relative flex items-center justify-center min-h-screen p-4">
            <div className={`${styles.modalContent} bg-white rounded-2xl shadow-xl max-w-md w-full`}>
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-text-primary">修改密码</h3>
                  <button 
                    onClick={handleClosePasswordModal}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <i className="fas fa-times"></i>
                  </button>
                </div>
                <form onSubmit={handlePasswordSubmit} className="space-y-4">
                  <div>
                    <label htmlFor="current-password" className="block text-sm font-medium text-text-primary mb-2">当前密码</label>
                    <input 
                      type="password" 
                      id="current-password" 
                      value={passwordForm.currentPassword}
                      onChange={(e) => setPasswordForm(prev => ({ ...prev, currentPassword: e.target.value }))}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent" 
                      required 
                    />
                  </div>
                  <div>
                    <label htmlFor="new-password" className="block text-sm font-medium text-text-primary mb-2">新密码</label>
                    <input 
                      type="password" 
                      id="new-password" 
                      value={passwordForm.newPassword}
                      onChange={(e) => setPasswordForm(prev => ({ ...prev, newPassword: e.target.value }))}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent" 
                      required 
                    />
                  </div>
                  <div>
                    <label htmlFor="confirm-password" className="block text-sm font-medium text-text-primary mb-2">确认新密码</label>
                    <input 
                      type="password" 
                      id="confirm-password" 
                      value={passwordForm.confirmPassword}
                      onChange={(e) => setPasswordForm(prev => ({ ...prev, confirmPassword: e.target.value }))}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent" 
                      required 
                    />
                  </div>
                  <div className="flex justify-end space-x-3 pt-4">
                    <button 
                      type="button" 
                      onClick={handleClosePasswordModal}
                      className="px-4 py-2 border border-gray-300 rounded-lg text-text-secondary hover:bg-gray-50"
                    >
                      取消
                    </button>
                    <button 
                      type="submit" 
                      className="px-4 py-2 bg-secondary text-white rounded-lg hover:bg-yellow-500"
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

      {/* 确认对话框 */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-50">
          <div className={styles.modalOverlay} onClick={handleModalOverlayClick}></div>
          <div className="relative flex items-center justify-center min-h-screen p-4">
            <div className={`${styles.modalContent} bg-white rounded-2xl shadow-xl max-w-md w-full`}>
              <div className="p-6">
                <div className="text-center">
                  <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <i className="fas fa-exclamation-triangle text-red-500 text-2xl"></i>
                  </div>
                  <h3 className="text-lg font-semibold text-text-primary mb-2">{confirmTitle}</h3>
                  <p className="text-text-secondary mb-6">{confirmMessage}</p>
                  <div className="flex justify-center space-x-3">
                    <button 
                      onClick={() => setShowConfirmModal(false)}
                      className="px-6 py-2 border border-gray-300 rounded-lg text-text-secondary hover:bg-gray-50"
                    >
                      取消
                    </button>
                    <button 
                      onClick={handleConfirmOk}
                      className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                    >
                      确认
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 成功提示 */}
      <div className={`fixed top-20 right-6 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 ${styles.successToast} ${showSuccessToast ? 'visible' : ''}`}>
        <div className="flex items-center space-x-2">
          <i className="fas fa-check-circle"></i>
          <span>{successMessage}</span>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;

