

import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import styles from './styles.module.css';

interface TransactionItem {
  name: string;
  price: string;
}

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
  items: TransactionItem[];
}

const TransactionDetailPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [isImageZoomVisible, setIsImageZoomVisible] = useState(false);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [transactionData, setTransactionData] = useState<TransactionData | null>(null);

  // 模拟账单数据
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
      receiptImage: 'https://s.coze.cn/image/goXaZger83g/',
      items: [
        { name: '香辣鸡腿堡', price: '¥25.00' },
        { name: '薯条(大)', price: '¥12.00' },
        { name: '可乐(中)', price: '¥8.50' }
      ]
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
      receiptImage: 'https://s.coze.cn/image/EOzmh3SqYlI/',
      items: [
        { name: '地铁票', price: '¥6.00' }
      ]
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
      receiptImage: 'https://s.coze.cn/image/d4P0sDFIItg/',
      items: [
        { name: '牛奶', price: '¥15.80' },
        { name: '面包', price: '¥8.50' },
        { name: '水果', price: '¥25.50' },
        { name: '蔬菜', price: '¥18.00' },
        { name: '其他日用品', price: '¥61.00' }
      ]
    }
  };

  // 设置页面标题
  useEffect(() => {
    const originalTitle = document.title;
    document.title = '账单详情 - 省点';
    return () => {
      document.title = originalTitle;
    };
  }, []);

  // 加载账单数据
  useEffect(() => {
    const transactionId = searchParams.get('transactionId') || 'txn1';
    const transaction = mockTransactions[transactionId];
    if (transaction) {
      setTransactionData(transaction);
    }
  }, [searchParams]);

  // 关闭抽屉
  const handleCloseDrawer = () => {
    navigate(-1);
  };

  // 编辑账单
  const handleEditTransaction = () => {
    const transactionId = searchParams.get('transactionId') || 'txn1';
    navigate(`/transaction-edit?transactionId=${transactionId}`);
  };

  // 删除账单
  const handleDeleteTransaction = () => {
    setIsDeleteModalVisible(true);
  };

  // 确认删除
  const handleConfirmDelete = () => {
    const transactionId = searchParams.get('transactionId') || 'txn1';
    console.log('删除账单:', transactionId);
    setIsDeleteModalVisible(false);
    alert('账单删除成功');
    handleCloseDrawer();
  };

  // 查看图片
  const handleViewImage = () => {
    setIsImageZoomVisible(true);
  };

  // 关闭图片放大
  const handleCloseImage = () => {
    setIsImageZoomVisible(false);
  };

  // 键盘事件处理
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleCloseDrawer();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  if (!transactionData) {
    return <div>加载中...</div>;
  }

  return (
    <div className={styles.pageWrapper}>
      {/* 抽屉遮罩层 */}
      <div 
        className={`fixed inset-0 ${styles.drawerOverlay} z-50 flex justify-end`}
        onClick={(e) => {
          if (e.target === e.currentTarget) {
            handleCloseDrawer();
          }
        }}
      >
        {/* 抽屉内容 */}
        <div className={`bg-white w-full max-w-md h-full shadow-drawer ${styles.drawerSlideIn} flex flex-col`}>
          {/* 抽屉头部 */}
          <div className="flex items-center justify-between p-6 border-b border-border-light">
            <h2 className="text-xl font-bold text-text-primary">账单详情</h2>
            <button 
              onClick={handleCloseDrawer}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <i className="fas fa-times text-lg"></i>
            </button>
          </div>

          {/* 抽屉内容区 */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* 基本信息 */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-text-secondary">消费金额</span>
                <span className="text-2xl font-bold text-red-500">{transactionData.amount}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-text-secondary">商家名称</span>
                <span className="font-medium text-text-primary">{transactionData.merchant}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-text-secondary">消费分类</span>
                <div className="flex items-center space-x-2">
                  <div className={`w-6 h-6 bg-${transactionData.categoryColor}-100 rounded-full flex items-center justify-center`}>
                    <i className={`${transactionData.categoryIcon} text-${transactionData.categoryColor}-500 text-xs`}></i>
                  </div>
                  <span className="font-medium text-text-primary">{transactionData.category}</span>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-text-secondary">消费时间</span>
                <span className="font-medium text-text-primary">{transactionData.time}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-text-secondary">支付账户</span>
                <span className="font-medium text-text-primary">{transactionData.account}</span>
              </div>
            </div>

            {/* 小票图片 */}
            <div className="space-y-3">
              <label className="block text-sm font-medium text-text-primary">小票图片</label>
              <div className="relative">
                <img 
                  src={transactionData.receiptImage}
                  alt="消费小票" 
                  className="w-full h-48 object-cover rounded-lg cursor-pointer hover:opacity-90 transition-opacity"
                  onClick={handleViewImage}
                />
                <button 
                  onClick={handleViewImage}
                  className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-40 text-white rounded-lg opacity-0 hover:opacity-100 transition-opacity"
                >
                  <i className="fas fa-search-plus mr-2"></i>
                  查看大图
                </button>
              </div>
            </div>

            {/* 商品明细 */}
            <div className="space-y-3">
              <label className="block text-sm font-medium text-text-primary">商品明细</label>
              <div className="space-y-2">
                {transactionData.items.map((item, index) => (
                  <div key={index} className="flex items-center justify-between py-2 border-b border-gray-100">
                    <span className="text-text-primary">{item.name}</span>
                    <span className="font-medium text-text-primary">{item.price}</span>
                  </div>
                ))}
                <div className="flex items-center justify-between py-2 font-semibold text-text-primary">
                  <span>总计</span>
                  <span>{transactionData.amount.replace('-', '')}</span>
                </div>
              </div>
            </div>

            {/* 备注信息 */}
            <div className="space-y-3">
              <label className="block text-sm font-medium text-text-primary">备注</label>
              <div className="p-3 bg-gray-50 rounded-lg text-text-primary">
                {transactionData.note}
              </div>
            </div>

            {/* OCR识别数据 */}
            <div className="space-y-3">
              <label className="block text-sm font-medium text-text-primary">识别信息</label>
              <div className="p-3 bg-gray-50 rounded-lg">
                <div className="text-xs text-text-secondary space-y-1">
                  <div><span className="font-medium">识别时间：</span>2024-01-15 12:35:20</div>
                  <div><span className="font-medium">识别置信度：</span>95%</div>
                  <div><span className="font-medium">识别引擎：</span>Tesseract OCR</div>
                </div>
              </div>
            </div>
          </div>

          {/* 抽屉底部操作区 */}
          <div className="p-6 border-t border-border-light bg-gray-50">
            <div className="flex space-x-3">
              <button 
                onClick={handleEditTransaction}
                className="flex-1 bg-secondary text-white py-3 px-4 rounded-lg font-medium hover:bg-yellow-500 transition-colors flex items-center justify-center space-x-2"
              >
                <i className="fas fa-edit"></i>
                <span>编辑</span>
              </button>
              <button 
                onClick={handleDeleteTransaction}
                className="flex-1 bg-red-500 text-white py-3 px-4 rounded-lg font-medium hover:bg-red-600 transition-colors flex items-center justify-center space-x-2"
              >
                <i className="fas fa-trash"></i>
                <span>删除</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 图片放大查看遮罩层 */}
      {isImageZoomVisible && (
        <div 
          className={`fixed inset-0 ${styles.imageZoomOverlay} z-60 flex items-center justify-center p-4`}
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              handleCloseImage();
            }
          }}
        >
          <button 
            onClick={handleCloseImage}
            className="absolute top-4 right-4 p-2 text-white hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors"
          >
            <i className="fas fa-times text-xl"></i>
          </button>
          <img 
            src={transactionData.receiptImage}
            alt="放大的小票图片" 
            className={`max-w-full max-h-full object-contain ${styles.imageZoomEnter} ${isImageZoomVisible ? styles.imageZoomEnterActive : ''}`}
          />
        </div>
      )}

      {/* 删除确认模态框 */}
      {isDeleteModalVisible && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-70 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl p-6 max-w-md w-full">
            <div className="text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="fas fa-exclamation-triangle text-red-500 text-2xl"></i>
              </div>
              <h3 className="text-lg font-semibold text-text-primary mb-2">确认删除</h3>
              <p className="text-text-secondary mb-6">删除后将无法恢复，确定要删除这笔账单吗？</p>
              <div className="flex space-x-3">
                <button 
                  onClick={() => setIsDeleteModalVisible(false)}
                  className="flex-1 bg-gray-200 text-gray-700 py-2 px-4 rounded-lg font-medium hover:bg-gray-300 transition-colors"
                >
                  取消
                </button>
                <button 
                  onClick={handleConfirmDelete}
                  className="flex-1 bg-red-500 text-white py-2 px-4 rounded-lg font-medium hover:bg-red-600 transition-colors"
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

export default TransactionDetailPage;

