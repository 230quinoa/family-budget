

import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import styles from './styles.module.css';

interface TransactionData {
  id: string;
  amount: string;
  merchant: string;
  category: string;
  categoryIcon: string;
  categoryColor: string;
  time: string;
  account: string;
  note: string;
  receiptImage: string;
}

interface CategoryData {
  name: string;
  icon: string;
  color: string;
}

const TransactionEditPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const receiptImageInputRef = useRef<HTMLInputElement>(null);

  // 表单状态
  const [formData, setFormData] = useState({
    amount: '',
    merchant: '',
    category: '',
    time: '',
    account: '支付宝',
    note: '',
    receiptImage: ''
  });

  const [showSaveSuccessToast, setShowSaveSuccessToast] = useState(false);

  // 模拟数据
  const mockTransactions: Record<string, TransactionData> = {
    'txn1': {
      id: 'txn1',
      amount: '-¥45.50',
      merchant: '肯德基',
      category: '食品餐饮',
      categoryIcon: 'fas fa-utensils',
      categoryColor: 'red',
      time: '2024年1月15日 12:30',
      account: '支付宝',
      note: '午餐时间，和同事一起用餐',
      receiptImage: 'https://s.coze.cn/image/H_uTUM0YVFs/'
    },
    'txn2': {
      id: 'txn2',
      amount: '-¥6.00',
      merchant: '地铁出行',
      category: '交通出行',
      categoryIcon: 'fas fa-bus',
      categoryColor: 'blue',
      time: '2024年1月14日 08:15',
      account: '交通卡',
      note: '上班通勤',
      receiptImage: 'https://s.coze.cn/image/HaYpMRfpUoA/'
    },
    'txn3': {
      id: 'txn3',
      amount: '-¥128.80',
      merchant: '沃尔玛超市',
      category: '日常用品',
      categoryIcon: 'fas fa-shopping-cart',
      categoryColor: 'green',
      time: '2024年1月14日 19:20',
      account: '微信支付',
      note: '周末采购',
      receiptImage: 'https://s.coze.cn/image/yxlEPQEjTZU/'
    }
  };

  const categories: CategoryData[] = [
    { name: '食品餐饮', icon: 'fas fa-utensils', color: 'red' },
    { name: '交通出行', icon: 'fas fa-bus', color: 'blue' },
    { name: '日常用品', icon: 'fas fa-shopping-cart', color: 'green' },
    { name: '娱乐休闲', icon: 'fas fa-film', color: 'purple' },
    { name: '医疗健康', icon: 'fas fa-heartbeat', color: 'pink' },
    { name: '教育学习', icon: 'fas fa-book', color: 'indigo' },
    { name: '服饰鞋包', icon: 'fas fa-tshirt', color: 'orange' },
    { name: '住房缴费', icon: 'fas fa-home', color: 'teal' }
  ];

  // 设置页面标题
  useEffect(() => {
    const originalTitle = document.title;
    document.title = '编辑账单 - 省点';
    return () => {
      document.title = originalTitle;
    };
  }, []);

  // 加载账单数据
  useEffect(() => {
    const transactionId = searchParams.get('transactionId') || 'txn1';
    const transaction = mockTransactions[transactionId];
    
    if (transaction) {
      setFormData({
        amount: transaction.amount.replace('-¥', ''),
        merchant: transaction.merchant,
        category: transaction.category,
        time: formatDateTimeForInput(transaction.time),
        account: transaction.account,
        note: transaction.note,
        receiptImage: transaction.receiptImage
      });
    }
  }, [searchParams]);

  // 格式化日期时间为input元素所需格式
  const formatDateTimeForInput = (dateTimeStr: string): string => {
    const parts = dateTimeStr.split(/年|月|日|\s/);
    const year = parts[0];
    const month = parts[1].padStart(2, '0');
    const day = parts[2].padStart(2, '0');
    const time = parts[3];
    
    return `${year}-${month}-${day}T${time}`;
  };

  // 格式化日期时间为显示格式
  const formatDateTimeForDisplay = (dateTimeStr: string): string => {
    const date = new Date(dateTimeStr);
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    
    return `${year}年${month}月${day}日 ${hours}:${minutes}`;
  };

  // 处理表单输入变化
  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // 处理分类选择
  const handleCategorySelect = (categoryName: string) => {
    setFormData(prev => ({
      ...prev,
      category: categoryName
    }));
  };

  // 处理图片上传
  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        if (e.target?.result) {
          setFormData(prev => ({
            ...prev,
            receiptImage: e.target!.result as string
          }));
        }
      };
      
      reader.readAsDataURL(event.target.files[0]);
    }
  };

  // 触发文件选择
  const handleImageClick = () => {
    receiptImageInputRef.current?.click();
  };

  // 处理返回
  const handleBackClick = () => {
    navigate(-1);
  };

  // 处理保存
  const handleSaveClick = () => {
    const transactionId = searchParams.get('transactionId') || 'txn1';
    
    const saveData = {
      id: transactionId,
      amount: `-${formData.amount}`,
      merchant: formData.merchant,
      category: formData.category,
      time: formatDateTimeForDisplay(formData.time),
      account: formData.account,
      note: formData.note,
      receiptImage: formData.receiptImage
    };

    console.log('保存账单数据:', saveData);

    // 显示保存成功提示
    setShowSaveSuccessToast(true);
    
    // 1.5秒后隐藏提示并返回上一页
    setTimeout(() => {
      setShowSaveSuccessToast(false);
      navigate(-1);
    }, 1500);
  };

  return (
    <div className={styles.pageWrapper}>
      <div className="min-h-screen flex flex-col">
        {/* 顶部导航栏 */}
        <header className="bg-white border-b border-border-light sticky top-0 z-10">
          <div className="flex items-center justify-between p-4">
            <button 
              onClick={handleBackClick}
              className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <i className="fas fa-arrow-left"></i>
            </button>
            <h1 className="text-lg font-semibold text-text-primary">编辑账单</h1>
            <button 
              onClick={handleSaveClick}
              className="px-4 py-2 bg-secondary text-white rounded-lg font-medium hover:bg-yellow-500 transition-colors"
            >
              保存
            </button>
          </div>
        </header>

        {/* 表单内容区 */}
        <main className="flex-1 p-4 overflow-y-auto">
          <form className="space-y-6">
            {/* 消费金额 */}
            <div className="space-y-2">
              <label htmlFor="transaction-amount" className="block text-sm font-medium text-text-primary">
                消费金额
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-secondary">
                  ¥
                </span>
                <input 
                  type="number" 
                  id="transaction-amount" 
                  className={`${styles.formInput} w-full pl-8 pr-3 py-3 border border-border-light rounded-lg text-xl font-bold text-red-500`}
                  placeholder="0.00" 
                  step="0.01" 
                  min="0"
                  value={formData.amount}
                  onChange={(e) => handleInputChange('amount', e.target.value)}
                />
              </div>
            </div>

            {/* 商家名称 */}
            <div className="space-y-2">
              <label htmlFor="transaction-merchant" className="block text-sm font-medium text-text-primary">
                商家名称
              </label>
              <input 
                type="text" 
                id="transaction-merchant" 
                className={`${styles.formInput} w-full px-3 py-3 border border-border-light rounded-lg text-text-primary`}
                placeholder="请输入商家名称"
                value={formData.merchant}
                onChange={(e) => handleInputChange('merchant', e.target.value)}
              />
            </div>

            {/* 消费分类 */}
            <div className="space-y-3">
              <label className="block text-sm font-medium text-text-primary">消费分类</label>
              <div className="grid grid-cols-4 gap-3">
                {categories.map((category) => (
                  <div
                    key={category.name}
                    className={`${styles.categoryItem} flex flex-col items-center p-3 border rounded-lg cursor-pointer ${
                      formData.category === category.name 
                        ? `${styles.selected} border-secondary bg-yellow-50` 
                        : 'border-border-light'
                    }`}
                    onClick={() => handleCategorySelect(category.name)}
                  >
                    <div className={`w-10 h-10 bg-${category.color}-100 rounded-full flex items-center justify-center mb-2`}>
                      <i className={`${category.icon} text-${category.color}-500`}></i>
                    </div>
                    <span className="text-xs text-text-primary">{category.name}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* 消费时间 */}
            <div className="space-y-2">
              <label htmlFor="transaction-time" className="block text-sm font-medium text-text-primary">
                消费时间
              </label>
              <input 
                type="datetime-local" 
                id="transaction-time" 
                className={`${styles.formInput} w-full px-3 py-3 border border-border-light rounded-lg text-text-primary`}
                value={formData.time}
                onChange={(e) => handleInputChange('time', e.target.value)}
              />
            </div>

            {/* 支付账户 */}
            <div className="space-y-2">
              <label htmlFor="transaction-account" className="block text-sm font-medium text-text-primary">
                支付账户
              </label>
              <select 
                id="transaction-account" 
                className={`${styles.formInput} w-full px-3 py-3 border border-border-light rounded-lg text-text-primary appearance-none bg-white`}
                value={formData.account}
                onChange={(e) => handleInputChange('account', e.target.value)}
              >
                <option value="支付宝">支付宝</option>
                <option value="微信支付">微信支付</option>
                <option value="银行卡">银行卡</option>
                <option value="现金">现金</option>
                <option value="交通卡">交通卡</option>
                <option value="其他">其他</option>
              </select>
            </div>

            {/* 备注信息 */}
            <div className="space-y-2">
              <label htmlFor="transaction-note" className="block text-sm font-medium text-text-primary">
                备注
              </label>
              <textarea 
                id="transaction-note" 
                className={`${styles.formInput} w-full px-3 py-3 border border-border-light rounded-lg text-text-primary min-h-[100px]`}
                placeholder="添加备注信息（可选）"
                value={formData.note}
                onChange={(e) => handleInputChange('note', e.target.value)}
              />
            </div>

            {/* 小票图片 */}
            <div className="space-y-3">
              <label className="block text-sm font-medium text-text-primary">小票图片</label>
              <div className="relative">
                <img 
                  src={formData.receiptImage || ''} 
                  alt="小票图片" 
                  className="w-full h-48 object-cover rounded-lg border border-dashed border-border-light"
                  onClick={handleImageClick}
                  style={{ cursor: 'pointer' }}
                />
                {!formData.receiptImage && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-50 rounded-lg">
                    <i className="fas fa-camera text-gray-400 text-2xl mb-2"></i>
                    <span className="text-sm text-text-secondary">点击上传小票图片</span>
                  </div>
                )}
                <input 
                  type="file" 
                  ref={receiptImageInputRef}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
                  accept="image/*"
                  onChange={handleImageUpload}
                />
              </div>
            </div>
          </form>
        </main>
      </div>

      {/* 保存成功提示 */}
      {showSaveSuccessToast && (
        <div className="fixed top-20 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg z-50">
          保存成功
        </div>
      )}
    </div>
  );
};

export default TransactionEditPage;

