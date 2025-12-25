import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import styles from './styles.module.css';
import { TransactionFormData } from './types';

const ConsumeRecordEditPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const transactionId = new URLSearchParams(location.search).get('transactionId');
  
  // 表单状态
  const [formData, setFormData] = useState<TransactionFormData>({
    date: new Date().toISOString().split('T')[0],
    time: new Date().toTimeString().split(':').slice(0, 2).join(':'),
    merchant: '',
    category: '',
    amount: '',
    account: '',
    note: '',
    imageUrl: ''
  });
  
  // 分类选项
  const categories = [
    { value: 'food', label: '食品餐饮', icon: 'fas fa-utensils text-red-500' },
    { value: 'transport', label: '交通出行', icon: 'fas fa-bus text-blue-500' },
    { value: 'daily', label: '日常用品', icon: 'fas fa-shopping-basket text-green-500' },
    { value: 'entertainment', label: '休闲娱乐', icon: 'fas fa-film text-purple-500' },
    { value: 'shopping', label: '购物消费', icon: 'fas fa-shopping-cart text-orange-500' },
    { value: 'housing', label: '住房缴费', icon: 'fas fa-home text-yellow-500' },
    { value: 'medical', label: '医疗健康', icon: 'fas fa-heartbeat text-pink-500' },
    { value: 'education', label: '教育培训', icon: 'fas fa-graduation-cap text-indigo-500' }
  ];
  
  // 账户选项
  const accounts = [
    { value: 'cash', label: '现金' },
    { value: 'alipay', label: '支付宝' },
    { value: 'wechat', label: '微信支付' },
    { value: 'bank', label: '银行卡' },
    { value: 'transport_card', label: '交通卡' }
  ];
  
  // 设置页面标题
  useEffect(() => {
    const originalTitle = document.title;
    document.title = transactionId ? '编辑消费记录 - 省点' : '添加消费记录 - 省点';
    return () => { document.title = originalTitle; };
  }, [transactionId]);
  
  // 如果是编辑模式，加载数据
  useEffect(() => {
    if (transactionId) {
      // 在实际应用中，这里会调用API获取交易数据
      console.log('加载交易数据:', transactionId);
      // 模拟加载数据
      // 实际项目中应该从API获取数据并设置到formData中
    }
  }, [transactionId]);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // 表单验证
    if (!formData.merchant || !formData.category || !formData.amount || !formData.account) {
      alert('请填写必填字段');
      return;
    }
    
    // 转换金额为数字
    const amount = parseFloat(formData.amount);
    if (isNaN(amount) || amount <= 0) {
      alert('请输入有效的金额');
      return;
    }
    
    // 在实际应用中，这里会调用API保存数据
    console.log('保存交易数据:', {
      ...formData,
      amount: -Math.abs(amount) // 消费金额为负数
    });
    
    // 保存成功后返回历史记录页面
    navigate('/history');
  };
  
  const handleCancel = () => {
    navigate('/history');
  };
  
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // 在实际应用中，这里会上传图片到服务器并获取URL
      // 这里仅做模拟
      console.log('上传图片:', file.name);
      // 模拟图片URL
      setFormData(prev => ({
        ...prev,
        imageUrl: 'https://s.coze.cn/image/6hXWBqWV8MI/'
      }));
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
          
          {/* 页面标题 */}
          <div className="flex-1 max-w-md mx-8 flex justify-center">
            <h2 className="text-lg font-medium text-text-primary">
              {transactionId ? '编辑消费记录' : '添加消费记录'}
            </h2>
          </div>
          
          {/* 占位元素，保持标题居中 */}
          <div className="w-24"></div>
        </div>
      </header>
      
      {/* 主内容区 */}
      <main className="pt-24 pb-12 px-6 max-w-3xl mx-auto">
        <div className="bg-white rounded-2xl shadow-card p-6">
          <form onSubmit={handleSubmit}>
            {/* 基本信息 */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-text-primary mb-4">基本信息</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                {/* 日期 */}
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-2">
                    日期 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary"
                    required
                  />
                </div>
                
                {/* 时间 */}
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-2">
                    时间 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="time"
                    name="time"
                    value={formData.time}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary"
                    required
                  />
                </div>
              </div>
              
              {/* 商家名称 */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-text-secondary mb-2">
                  商家名称 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="merchant"
                  value={formData.merchant}
                  onChange={handleInputChange}
                  placeholder="请输入商家名称"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary"
                  required
                />
              </div>
              
              {/* 消费分类 */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-text-secondary mb-2">
                  消费分类 <span className="text-red-500">*</span>
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary"
                  required
                >
                  <option value="">请选择分类</option>
                  {categories.map(category => (
                    <option key={category.value} value={category.value}>
                      {category.label}
                    </option>
                  ))}
                </select>
              </div>
              
              {/* 消费金额 */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-text-secondary mb-2">
                  消费金额 <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-text-secondary">¥</span>
                  <input
                    type="number"
                    name="amount"
                    value={formData.amount}
                    onChange={handleInputChange}
                    placeholder="0.00"
                    min="0"
                    step="0.01"
                    className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary"
                    required
                  />
                </div>
              </div>
              
              {/* 支付账户 */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-text-secondary mb-2">
                  支付账户 <span className="text-red-500">*</span>
                </label>
                <select
                  name="account"
                  value={formData.account}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary"
                  required
                >
                  <option value="">请选择账户</option>
                  {accounts.map(account => (
                    <option key={account.value} value={account.value}>
                      {account.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            
            {/* 备注信息 */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-text-primary mb-4">备注信息</h3>
              <textarea
                name="note"
                value={formData.note}
                onChange={handleInputChange}
                placeholder="添加备注信息（可选）"
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary"
              />
            </div>
            
            {/* 小票图片 */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-text-primary mb-4">小票图片</h3>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-secondary transition-colors cursor-pointer">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  id="image-upload"
                />
                <label htmlFor="image-upload" className="cursor-pointer">
                  {formData.imageUrl ? (
                    <div className="relative">
                      <img
                        src={formData.imageUrl}
                        alt="已上传的小票"
                        className="max-w-full h-48 object-cover rounded-lg mx-auto"
                        data-category="商业科技"
                      />
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          setFormData(prev => ({ ...prev, imageUrl: '' }));
                        }}
                        className="absolute top-2 right-2 bg-white rounded-full p-1 shadow-md text-gray-500 hover:text-red-500"
                      >
                        <i className="fas fa-times"></i>
                      </button>
                    </div>
                  ) : (
                    <div>
                      <i className="fas fa-cloud-upload-alt text-4xl text-gray-400 mb-2"></i>
                      <p className="text-text-secondary">点击上传小票图片（可选）</p>
                      <p className="text-xs text-text-tertiary mt-1">支持 JPG、PNG 格式，最大 5MB</p>
                    </div>
                  )}
                </label>
              </div>
            </div>
            
            {/* 操作按钮 */}
            <div className="flex space-x-4">
              <button
                type="button"
                onClick={handleCancel}
                className={`flex-1 py-3 ${styles.btnSecondary} rounded-lg font-medium`}
              >
                取消
              </button>
              <button
                type="submit"
                className={`flex-1 py-3 ${styles.btnPrimary} rounded-lg font-medium`}
              >
                {transactionId ? '保存修改' : '添加记录'}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};

export default ConsumeRecordEditPage;
