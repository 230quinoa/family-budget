

import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import styles from './styles.module.css';

interface RecommendationStore {
  name: string;
  address: string;
  status: string;
}

interface RecommendationData {
  title: string;
  description: string;
  validity: string;
  category: string;
  image: string;
  link: string;
  isFavorited: boolean;
  stores: RecommendationStore[];
}

const RecommendDetailPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [recommendationData, setRecommendationData] = useState<RecommendationData | null>(null);
  const [isDrawerVisible, setIsDrawerVisible] = useState(false);

  // 模拟优惠数据
  const mockRecommendations: Record<string, RecommendationData> = {
    'rec1': {
      title: '麦当劳满30减10优惠券',
      description: '• 消费满30元即可享受立减10元优惠\n• 适用于麦当劳所有门店及线上平台\n• 可与其他优惠活动叠加使用\n• 不包含礼品卡、充值卡购买\n• 单次消费限用一张优惠券',
      validity: '2024-03-31',
      category: '食品餐饮',
      image: 'https://s.coze.cn/image/zKaVLLNkt1Q/',
      link: 'https://s.coze.cn/image/BtcfZhKnMAc/',
      isFavorited: false,
      stores: [
        { name: '麦当劳中关村店', address: '海淀区中关村大街1号', status: '营业中' },
        { name: '麦当劳五道口店', address: '海淀区成府路35号', status: '营业中' },
        { name: '麦当劳三里屯店', address: '朝阳区三里屯路19号', status: '营业中' }
      ]
    },
    'rec2': {
      title: '永辉超市9.5折新人专享',
      description: '• 新用户首次注册专享9.5折优惠\n• 全场商品通用，不限制品类\n• 单次消费最高可省50元\n• 有效期为注册后30天\n• 每人限用一次',
      validity: '2024-04-15',
      category: '日常用品',
      image: 'https://s.coze.cn/image/ufD0T4xCzPg/',
      link: 'https://s.coze.cn/image/WIB2PDR2QQY/',
      isFavorited: true,
      stores: [
        { name: '永辉超市朝阳店', address: '朝阳区朝阳路123号', status: '营业中' },
        { name: '永辉超市海淀店', address: '海淀区海淀路45号', status: '营业中' },
        { name: '永辉超市丰台店', address: '丰台区丰台路67号', status: '营业中' }
      ]
    },
    'rec3': {
      title: '地铁周卡8折优惠',
      description: '• 购买地铁周卡享受8折优惠\n• 适用于北京所有地铁线路\n• 周卡有效期为7天\n• 不限次数乘坐\n• 支持实体卡和电子卡',
      validity: '2024-03-25',
      category: '交通出行',
      image: 'https://s.coze.cn/image/siwqF1Xz2Eo/',
      link: 'https://s.coze.cn/image/JU0ht41irSI/',
      isFavorited: false,
      stores: [
        { name: '地铁1号线', address: '全线各站点', status: '全线运营' },
        { name: '地铁2号线', address: '全线各站点', status: '全线运营' },
        { name: '地铁4号线', address: '全线各站点', status: '全线运营' }
      ]
    }
  };

  // 设置页面标题
  useEffect(() => {
    const originalTitle = document.title;
    document.title = '优惠详情 - 省点';
    return () => {
      document.title = originalTitle;
    };
  }, []);

  // 加载优惠详情
  useEffect(() => {
    const recommendId = searchParams.get('recommendId') || 'rec1';
    const data = mockRecommendations[recommendId] || mockRecommendations['rec1'];
    setRecommendationData(data);

    // 显示抽屉动画
    const timer = setTimeout(() => {
      setIsDrawerVisible(true);
    }, 10);

    return () => {
      clearTimeout(timer);
    };
  }, [searchParams]);

  // 关闭抽屉
  const handleCloseDrawer = () => {
    setIsDrawerVisible(false);
    setTimeout(() => {
      navigate(-1);
    }, 300);
  };

  // 切换收藏状态
  const handleToggleFavorite = () => {
    if (recommendationData) {
      const updatedData = {
        ...recommendationData,
        isFavorited: !recommendationData.isFavorited
      };
      setRecommendationData(updatedData);
      
      const message = updatedData.isFavorited ? '收藏成功' : '已取消收藏';
      console.log(message);
    }
  };

  // 处理优惠链接点击
  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    console.log('跳转到外部优惠链接:', e.currentTarget.href);
  };

  // 处理遮罩层点击
  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      handleCloseDrawer();
    }
  };

  // 处理键盘事件
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

  // 阻止抽屉内容区域的点击事件冒泡
  const handleDrawerClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
  };

  if (!recommendationData) {
    return null;
  }

  const descriptionParagraphs = recommendationData.description.split('\n').filter(line => line.trim());

  return (
    <div className={styles.pageWrapper}>
      {/* 抽屉遮罩层 */}
      <div 
        className={`fixed inset-0 ${styles.drawerOverlay} z-50 flex justify-end`}
        onClick={handleOverlayClick}
      >
        {/* 优惠详情抽屉 */}
        <div 
          className={`bg-white w-full max-w-md h-full shadow-drawer ${
            isDrawerVisible ? styles.drawerEnterActive : styles.drawerEnter
          } overflow-y-auto`}
          onClick={handleDrawerClick}
        >
          {/* 抽屉头部 */}
          <div className="sticky top-0 bg-white border-b border-border-light p-6 z-10">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-text-primary">优惠详情</h2>
              <button 
                onClick={handleCloseDrawer}
                className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <i className="fas fa-times text-lg"></i>
              </button>
            </div>
          </div>

          {/* 抽屉内容 */}
          <div className="p-6 space-y-6">
            {/* 优惠图片 */}
            <div className="rounded-xl overflow-hidden">
              <img 
                src={recommendationData.image}
                alt={recommendationData.title + '图片'}
                className="w-full h-48 object-cover"
              />
            </div>

            {/* 优惠标题 */}
            <div>
              <h3 className="text-2xl font-bold text-text-primary mb-2">
                {recommendationData.title}
              </h3>
              <div className="flex items-center space-x-4 text-sm text-text-secondary">
                <div className="flex items-center space-x-1">
                  <i className="fas fa-tag text-secondary"></i>
                  <span>{recommendationData.category}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <i className="fas fa-clock text-secondary"></i>
                  <span>有效期至 {recommendationData.validity}</span>
                </div>
              </div>
            </div>

            {/* 优惠详情 */}
            <div className="bg-gray-50 rounded-xl p-4">
              <h4 className="text-lg font-semibold text-text-primary mb-3">优惠详情</h4>
              <div className="text-text-secondary leading-relaxed space-y-3">
                {descriptionParagraphs.map((paragraph, index) => (
                  <p key={index}>{paragraph}</p>
                ))}
              </div>
            </div>

            {/* 使用说明 */}
            <div className="bg-blue-50 rounded-xl p-4">
              <h4 className="text-lg font-semibold text-blue-800 mb-3">使用说明</h4>
              <div className="text-blue-700 leading-relaxed space-y-2">
                <p>1. 点击下方"立即使用"按钮跳转到麦当劳官方页面</p>
                <p>2. 在支付页面选择使用此优惠券</p>
                <p>3. 确认订单金额满30元后自动减免10元</p>
                <p>4. 如有问题请联系麦当劳客服</p>
              </div>
            </div>

            {/* 适用门店 */}
            <div>
              <h4 className="text-lg font-semibold text-text-primary mb-3">适用门店</h4>
              <div className="space-y-2">
                {recommendationData.stores.map((store, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <i className="fas fa-map-marker-alt text-red-500"></i>
                      <div>
                        <div className="font-medium text-text-primary">{store.name}</div>
                        <div className="text-sm text-text-secondary">{store.address}</div>
                      </div>
                    </div>
                    <span className="text-sm text-green-600 font-medium">{store.status}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* 优惠链接 */}
            <div>
              <a 
                href={recommendationData.link}
                target="_blank"
                rel="noopener noreferrer"
                onClick={handleLinkClick}
                className={`${styles.linkButton} w-full block text-center py-4 rounded-xl font-semibold text-white`}
              >
                <i className="fas fa-external-link-alt mr-2"></i>
                立即使用优惠券
              </a>
            </div>
          </div>

          {/* 抽屉底部操作区 */}
          <div className="sticky bottom-0 bg-white border-t border-border-light p-6">
            <button 
              onClick={handleToggleFavorite}
              className={`${styles.favoriteButton} ${
                recommendationData.isFavorited ? styles.active : ''
              } w-full py-3 rounded-xl font-medium flex items-center justify-center space-x-2`}
            >
              <i className={recommendationData.isFavorited ? 'fas fa-heart' : 'far fa-heart'}></i>
              <span>{recommendationData.isFavorited ? '已收藏' : '收藏优惠'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecommendDetailPage;

