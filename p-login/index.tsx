

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './styles.module.css';

interface FormErrors {
  username?: string;
  phone?: string;
  password?: string;
  confirmPassword?: string;
  newPassword?: string;
}

type AuthFormType = 'login' | 'register' | 'forgotPassword';

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  
  // 表单状态
  const [currentForm, setCurrentForm] = useState<AuthFormType>('login');
  const [isLoading, setIsLoading] = useState(false);
  const [countdown, setCountdown] = useState(0);
  
  // 登录表单
  const [loginForm, setLoginForm] = useState({
    username: '',
    password: '',
    rememberMe: false
  });
  
  // 注册表单
  const [registerForm, setRegisterForm] = useState({
    username: '',
    phone: '',
    password: '',
    confirmPassword: '',
    agreeTerms: false
  });
  
  // 忘记密码表单
  const [forgotForm, setForgotForm] = useState({
    phone: '',
    code: '',
    newPassword: ''
  });
  
  // 密码可见性
  const [passwordVisibility, setPasswordVisibility] = useState({
    login: false,
    register: false,
    confirm: false,
    new: false
  });
  
  // 错误状态
  const [errors, setErrors] = useState<FormErrors>({});

  // 设置页面标题
  useEffect(() => {
    const originalTitle = document.title;
    document.title = '省点 - 智能记账助手 - 登录注册';
    return () => { 
      document.title = originalTitle; 
    };
  }, []);

  // 倒计时效果
  useEffect(() => {
    let timer: number | null = null;
    if (countdown > 0) {
      timer = window.setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
    }
    return () => {
      if (timer) {
        clearTimeout(timer);
      }
    };
  }, [countdown]);

  // 验证函数
  const validateEmailOrPhone = (value: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^1[3-9]\d{9}$/;
    return emailRegex.test(value) || phoneRegex.test(value);
  };

  const validatePhone = (value: string): boolean => {
    const phoneRegex = /^1[3-9]\d{9}$/;
    return phoneRegex.test(value);
  };

  const validatePassword = (value: string): boolean => {
    return value.length >= 6;
  };

  // 显示错误
  const showError = (field: keyof FormErrors, message: string) => {
    setErrors(prev => ({ ...prev, [field]: message }));
  };

  // 隐藏错误
  const hideError = (field: keyof FormErrors) => {
    setErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[field];
      return newErrors;
    });
  };

  // 切换密码可见性
  const togglePasswordVisibility = (field: 'login' | 'register' | 'confirm' | 'new') => {
    setPasswordVisibility(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  // 切换表单
  const switchToLogin = () => {
    setCurrentForm('login');
    setErrors({});
  };

  const switchToRegister = () => {
    setCurrentForm('register');
    setErrors({});
  };

  const switchToForgotPassword = () => {
    setCurrentForm('forgotPassword');
    setErrors({});
  };

  // 登录表单提交
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const { username, password } = loginForm;
    
    // 清除之前的错误
    setErrors({});
    
    let hasError = false;
    
    if (!username.trim()) {
      showError('username', '请输入用户名或手机号');
      hasError = true;
    } else if (!validateEmailOrPhone(username.trim())) {
      showError('username', '请输入正确的邮箱或手机号格式');
      hasError = true;
    }
    
    if (!password) {
      showError('password', '请输入密码');
      hasError = true;
    }
    
    if (!hasError) {
      setIsLoading(true);
      
      // 模拟登录过程
      setTimeout(() => {
        setIsLoading(false);
        navigate('/home');
      }, 1500);
    }
  };

  // 注册表单提交
  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const { username, phone, password, confirmPassword, agreeTerms } = registerForm;
    
    // 清除之前的错误
    setErrors({});
    
    let hasError = false;
    
    if (!username.trim()) {
      showError('username', '请输入用户名');
      hasError = true;
    } else if (username.trim().length < 2) {
      showError('username', '用户名至少需要2个字符');
      hasError = true;
    }
    
    if (!phone.trim()) {
      showError('phone', '请输入手机号');
      hasError = true;
    } else if (!validatePhone(phone.trim())) {
      showError('phone', '请输入正确的手机号格式');
      hasError = true;
    }
    
    if (!password) {
      showError('password', '请输入密码');
      hasError = true;
    } else if (!validatePassword(password)) {
      showError('password', '密码至少需要6位');
      hasError = true;
    }
    
    if (!confirmPassword) {
      showError('confirmPassword', '请确认密码');
      hasError = true;
    } else if (password !== confirmPassword) {
      showError('confirmPassword', '两次输入的密码不一致');
      hasError = true;
    }
    
    if (!agreeTerms) {
      alert('请先同意用户协议和隐私政策');
      hasError = true;
    }
    
    if (!hasError) {
      setIsLoading(true);
      
      // 模拟注册过程
      setTimeout(() => {
        setIsLoading(false);
        navigate('/home');
      }, 1500);
    }
  };

  // 发送验证码
  const handleSendCode = () => {
    const { phone } = forgotForm;
    
    if (!phone.trim()) {
      showError('phone', '请先输入手机号');
      return;
    }
    
    if (!validatePhone(phone.trim())) {
      showError('phone', '请输入正确的手机号格式');
      return;
    }
    
    hideError('phone');
    setCountdown(60);
    
    // 模拟发送验证码
    console.log('发送验证码到手机号：', phone);
  };

  // 重置密码表单提交
  const handleForgotSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const { phone, code, newPassword } = forgotForm;
    
    // 清除之前的错误
    setErrors({});
    
    let hasError = false;
    
    if (!phone.trim()) {
      showError('phone', '请输入手机号');
      hasError = true;
    } else if (!validatePhone(phone.trim())) {
      showError('phone', '请输入正确的手机号格式');
      hasError = true;
    }
    
    if (!code.trim()) {
      alert('请输入验证码');
      hasError = true;
    }
    
    if (!newPassword) {
      showError('newPassword', '请输入新密码');
      hasError = true;
    } else if (!validatePassword(newPassword)) {
      showError('newPassword', '新密码至少需要6位');
      hasError = true;
    }
    
    if (!hasError) {
      setIsLoading(true);
      
      // 模拟重置密码过程
      setTimeout(() => {
        setIsLoading(false);
        alert('密码重置成功，请重新登录');
        switchToLogin();
      }, 1500);
    }
  };

  // 键盘导航支持
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (currentForm === 'forgotPassword') {
          switchToLogin();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [currentForm]);

  return (
    <div className={styles.pageWrapper}>
      {/* 背景装饰 */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-10 left-10 w-32 h-32 bg-secondary opacity-10 rounded-full"></div>
        <div className="absolute bottom-10 right-10 w-48 h-48 bg-primary opacity-10 rounded-full"></div>
        <div className="absolute top-1/3 right-20 w-24 h-24 bg-accent opacity-5 rounded-full"></div>
      </div>

      {/* 主内容容器 */}
      <div className="relative z-10 w-full max-w-md mx-4">
        {/* Logo和品牌 */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-secondary rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-card">
            <i className="fas fa-piggy-bank text-white text-2xl"></i>
          </div>
          <h1 className="text-3xl font-bold text-text-primary mb-2">省点</h1>
          <p className="text-text-secondary">智能记账，轻松省钱</p>
        </div>

        {/* 登录注册表单容器 */}
        <div className="bg-white rounded-2xl shadow-card p-8">
          {/* 标签切换 */}
          {currentForm !== 'forgotPassword' && (
            <div className="flex bg-gray-100 rounded-lg p-1 mb-6">
              <button 
                onClick={switchToLogin}
                className={`flex-1 py-2 px-4 text-sm font-medium rounded-md transition-colors ${
                  currentForm === 'login' ? styles.tabActive : styles.tabInactive
                }`}
              >
                登录
              </button>
              <button 
                onClick={switchToRegister}
                className={`flex-1 py-2 px-4 text-sm font-medium rounded-md transition-colors ${
                  currentForm === 'register' ? styles.tabActive : styles.tabInactive
                }`}
              >
                注册
              </button>
            </div>
          )}

          {/* 登录表单 */}
          {currentForm === 'login' && (
            <form onSubmit={handleLoginSubmit} className={`space-y-4 ${styles.fadeIn}`}>
              <div>
                <label htmlFor="login-username" className="block text-sm font-medium text-text-primary mb-2">
                  用户名/手机号
                </label>
                <input 
                  type="text" 
                  id="login-username" 
                  value={loginForm.username}
                  onChange={(e) => setLoginForm(prev => ({ ...prev, username: e.target.value }))}
                  className={`w-full px-4 py-3 border rounded-lg ${styles.formInputFocus} ${
                    errors.username ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="请输入用户名或手机号" 
                  required 
                />
                {errors.username && (
                  <div className={styles.errorMessage}>{errors.username}</div>
                )}
              </div>

              <div>
                <label htmlFor="login-password" className="block text-sm font-medium text-text-primary mb-2">
                  密码
                </label>
                <div className="relative">
                  <input 
                    type={passwordVisibility.login ? 'text' : 'password'} 
                    id="login-password" 
                    value={loginForm.password}
                    onChange={(e) => setLoginForm(prev => ({ ...prev, password: e.target.value }))}
                    className={`w-full px-4 py-3 pr-12 border rounded-lg ${styles.formInputFocus} ${
                      errors.password ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="请输入密码" 
                    required 
                  />
                  <button 
                    type="button" 
                    onClick={() => togglePasswordVisibility('login')}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <i className={`fas ${passwordVisibility.login ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                  </button>
                </div>
                {errors.password && (
                  <div className={styles.errorMessage}>{errors.password}</div>
                )}
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center">
                  <input 
                    type="checkbox" 
                    checked={loginForm.rememberMe}
                    onChange={(e) => setLoginForm(prev => ({ ...prev, rememberMe: e.target.checked }))}
                    className="w-4 h-4 text-secondary border-gray-300 rounded focus:ring-secondary"
                  />
                  <span className="ml-2 text-sm text-text-secondary">记住密码</span>
                </label>
                <button 
                  type="button" 
                  onClick={switchToForgotPassword}
                  className="text-sm text-secondary hover:text-yellow-500 font-medium"
                >
                  忘记密码？
                </button>
              </div>

              <button 
                type="submit" 
                disabled={isLoading}
                className={`w-full py-3 px-4 font-medium rounded-lg ${styles.btnPrimary}`}
              >
                <i className={`fas ${isLoading ? 'fa-spinner fa-spin' : 'fa-sign-in-alt'} mr-2`}></i>
                {isLoading ? '登录中...' : '登录'}
              </button>

              <div className="text-center text-sm text-text-secondary">
                还没有账号？
                <button 
                  type="button" 
                  onClick={switchToRegister}
                  className="text-secondary hover:text-yellow-500 font-medium ml-1"
                >
                  立即注册
                </button>
              </div>
            </form>
          )}

          {/* 注册表单 */}
          {currentForm === 'register' && (
            <form onSubmit={handleRegisterSubmit} className={`space-y-4 ${styles.fadeIn}`}>
              <div>
                <label htmlFor="register-username" className="block text-sm font-medium text-text-primary mb-2">
                  用户名
                </label>
                <input 
                  type="text" 
                  id="register-username" 
                  value={registerForm.username}
                  onChange={(e) => setRegisterForm(prev => ({ ...prev, username: e.target.value }))}
                  className={`w-full px-4 py-3 border rounded-lg ${styles.formInputFocus} ${
                    errors.username ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="请输入用户名" 
                  required 
                />
                {errors.username && (
                  <div className={styles.errorMessage}>{errors.username}</div>
                )}
              </div>

              <div>
                <label htmlFor="register-phone" className="block text-sm font-medium text-text-primary mb-2">
                  手机号
                </label>
                <input 
                  type="tel" 
                  id="register-phone" 
                  value={registerForm.phone}
                  onChange={(e) => setRegisterForm(prev => ({ ...prev, phone: e.target.value }))}
                  className={`w-full px-4 py-3 border rounded-lg ${styles.formInputFocus} ${
                    errors.phone ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="请输入手机号" 
                  required 
                />
                {errors.phone && (
                  <div className={styles.errorMessage}>{errors.phone}</div>
                )}
              </div>

              <div>
                <label htmlFor="register-password" className="block text-sm font-medium text-text-primary mb-2">
                  密码
                </label>
                <div className="relative">
                  <input 
                    type={passwordVisibility.register ? 'text' : 'password'} 
                    id="register-password" 
                    value={registerForm.password}
                    onChange={(e) => setRegisterForm(prev => ({ ...prev, password: e.target.value }))}
                    className={`w-full px-4 py-3 pr-12 border rounded-lg ${styles.formInputFocus} ${
                      errors.password ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="请输入密码（至少6位）" 
                    required 
                  />
                  <button 
                    type="button" 
                    onClick={() => togglePasswordVisibility('register')}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <i className={`fas ${passwordVisibility.register ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                  </button>
                </div>
                {errors.password && (
                  <div className={styles.errorMessage}>{errors.password}</div>
                )}
              </div>

              <div>
                <label htmlFor="register-confirm-password" className="block text-sm font-medium text-text-primary mb-2">
                  确认密码
                </label>
                <div className="relative">
                  <input 
                    type={passwordVisibility.confirm ? 'text' : 'password'} 
                    id="register-confirm-password" 
                    value={registerForm.confirmPassword}
                    onChange={(e) => setRegisterForm(prev => ({ ...prev, confirmPassword: e.target.value }))}
                    className={`w-full px-4 py-3 pr-12 border rounded-lg ${styles.formInputFocus} ${
                      errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="请再次输入密码" 
                    required 
                  />
                  <button 
                    type="button" 
                    onClick={() => togglePasswordVisibility('confirm')}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <i className={`fas ${passwordVisibility.confirm ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                  </button>
                </div>
                {errors.confirmPassword && (
                  <div className={styles.errorMessage}>{errors.confirmPassword}</div>
                )}
              </div>

              <div className="flex items-start">
                <input 
                  type="checkbox" 
                  id="agree-terms" 
                  checked={registerForm.agreeTerms}
                  onChange={(e) => setRegisterForm(prev => ({ ...prev, agreeTerms: e.target.checked }))}
                  className="w-4 h-4 text-secondary border-gray-300 rounded focus:ring-secondary mt-1" 
                  required 
                />
                <label htmlFor="agree-terms" className="ml-2 text-sm text-text-secondary">
                  我已阅读并同意
                  <button type="button" className="text-secondary hover:text-yellow-500 font-medium">《用户协议》</button>
                  和
                  <button type="button" className="text-secondary hover:text-yellow-500 font-medium">《隐私政策》</button>
                </label>
              </div>

              <button 
                type="submit" 
                disabled={isLoading}
                className={`w-full py-3 px-4 font-medium rounded-lg ${styles.btnPrimary}`}
              >
                <i className={`fas ${isLoading ? 'fa-spinner fa-spin' : 'fa-user-plus'} mr-2`}></i>
                {isLoading ? '注册中...' : '注册'}
              </button>

              <div className="text-center text-sm text-text-secondary">
                已有账号？
                <button 
                  type="button" 
                  onClick={switchToLogin}
                  className="text-secondary hover:text-yellow-500 font-medium ml-1"
                >
                  立即登录
                </button>
              </div>
            </form>
          )}

          {/* 忘记密码表单 */}
          {currentForm === 'forgotPassword' && (
            <form onSubmit={handleForgotSubmit} className={`space-y-4 ${styles.fadeIn}`}>
              <div className="text-center mb-6">
                <h3 className="text-lg font-semibold text-text-primary mb-2">重置密码</h3>
                <p className="text-sm text-text-secondary">请输入您的手机号，我们将发送验证码</p>
              </div>

              <div>
                <label htmlFor="forgot-phone" className="block text-sm font-medium text-text-primary mb-2">
                  手机号
                </label>
                <input 
                  type="tel" 
                  id="forgot-phone" 
                  value={forgotForm.phone}
                  onChange={(e) => setForgotForm(prev => ({ ...prev, phone: e.target.value }))}
                  className={`w-full px-4 py-3 border rounded-lg ${styles.formInputFocus} ${
                    errors.phone ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="请输入手机号" 
                  required 
                />
                {errors.phone && (
                  <div className={styles.errorMessage}>{errors.phone}</div>
                )}
              </div>

              <div className="flex space-x-3">
                <input 
                  type="text" 
                  id="verification-code" 
                  value={forgotForm.code}
                  onChange={(e) => setForgotForm(prev => ({ ...prev, code: e.target.value }))}
                  className={`flex-1 px-4 py-3 border border-gray-300 rounded-lg ${styles.formInputFocus}`}
                  placeholder="验证码" 
                  required 
                />
                <button 
                  type="button" 
                  onClick={handleSendCode}
                  disabled={countdown > 0}
                  className={`px-4 py-3 font-medium rounded-lg whitespace-nowrap ${styles.btnSecondary}`}
                >
                  {countdown > 0 ? `${countdown}秒后重发` : '发送验证码'}
                </button>
              </div>

              <div>
                <label htmlFor="new-password" className="block text-sm font-medium text-text-primary mb-2">
                  新密码
                </label>
                <div className="relative">
                  <input 
                    type={passwordVisibility.new ? 'text' : 'password'} 
                    id="new-password" 
                    value={forgotForm.newPassword}
                    onChange={(e) => setForgotForm(prev => ({ ...prev, newPassword: e.target.value }))}
                    className={`w-full px-4 py-3 pr-12 border rounded-lg ${styles.formInputFocus} ${
                      errors.newPassword ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="请输入新密码（至少6位）" 
                    required 
                  />
                  <button 
                    type="button" 
                    onClick={() => togglePasswordVisibility('new')}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <i className={`fas ${passwordVisibility.new ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                  </button>
                </div>
                {errors.newPassword && (
                  <div className={styles.errorMessage}>{errors.newPassword}</div>
                )}
              </div>

              <div className="flex space-x-3">
                <button 
                  type="button" 
                  onClick={switchToLogin}
                  className={`flex-1 py-3 px-4 font-medium rounded-lg ${styles.btnSecondary}`}
                >
                  <i className="fas fa-arrow-left mr-2"></i>
                  返回登录
                </button>
                <button 
                  type="submit" 
                  disabled={isLoading}
                  className={`flex-1 py-3 px-4 font-medium rounded-lg ${styles.btnPrimary}`}
                >
                  <i className={`fas ${isLoading ? 'fa-spinner fa-spin' : 'fa-key'} mr-2`}></i>
                  {isLoading ? '重置中...' : '重置密码'}
                </button>
              </div>
            </form>
          )}
        </div>

        {/* 底部链接 */}
        <div className="text-center mt-6 space-y-2">
          <div className="flex justify-center space-x-6 text-sm text-text-secondary">
            <button type="button" className="hover:text-secondary transition-colors">帮助中心</button>
            <button type="button" className="hover:text-secondary transition-colors">联系我们</button>
            <button type="button" className="hover:text-secondary transition-colors">意见反馈</button>
          </div>
          <p className="text-xs text-text-secondary">© 2024 省点. 保留所有权利</p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;

