// 千年经济分析系统 - 交互增强功能
// 解决P1优先级问题：用户反馈优化和高级交互

class InteractionManager {
    constructor() {
        this.init();
    }
    
    init() {
        this.setupButtonStates();
        this.setupHoverEffects();
        this.setupKeyboardShortcuts();
        this.setupTooltips();
        this.setupLoadingStates();
        this.setupFormValidation();
    }
    
    // 按钮状态管理
    setupButtonStates() {
        const buttons = document.querySelectorAll('button, .cursor-pointer');
        buttons.forEach(button => {
            // 添加点击反馈
            button.addEventListener('click', (e) => {
                this.addClickFeedback(e.target);
            });
            
            // 添加选中状态
            if (button.classList.contains('px-3') && button.classList.contains('py-1')) {
                button.addEventListener('click', (e) => {
                    this.toggleButtonSelection(e.target);
                });
            }
        });
    }
    
    addClickFeedback(element) {
        // 添加点击波纹效果
        const ripple = document.createElement('div');
        ripple.className = 'absolute inset-0 bg-white opacity-25 rounded transform scale-0 transition-transform duration-300';
        
        const rect = element.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        ripple.style.width = size + 'px';
        ripple.style.height = size + 'px';
        ripple.style.left = '50%';
        ripple.style.top = '50%';
        ripple.style.transform = 'translate(-50%, -50%) scale(0)';
        
        if (element.style.position !== 'relative') {
            element.style.position = 'relative';
        }
        
        element.appendChild(ripple);
        
        // 触发动画
        setTimeout(() => {
            ripple.style.transform = 'translate(-50%, -50%) scale(1)';
        }, 10);
        
        // 清理
        setTimeout(() => {
            ripple.remove();
        }, 300);
    }
    
    toggleButtonSelection(button) {
        // 移除同组其他按钮的选中状态
        const parent = button.parentElement;
        const siblings = parent.querySelectorAll('button');
        siblings.forEach(sibling => {
            sibling.classList.remove('bg-finance-blue', 'text-white');
            sibling.classList.add('bg-gray-100', 'text-gray-700');
        });
        
        // 设置当前按钮为选中状态
        button.classList.remove('bg-gray-100', 'text-gray-700');
        button.classList.add('bg-finance-blue', 'text-white');
    }
    
    // 悬浮效果增强
    setupHoverEffects() {
        const cards = document.querySelectorAll('.hover\\:shadow-lg, .group');
        cards.forEach(card => {
            card.addEventListener('mouseenter', (e) => {
                this.addHoverEffect(e.target);
            });
            
            card.addEventListener('mouseleave', (e) => {
                this.removeHoverEffect(e.target);
            });
        });
    }
    
    addHoverEffect(element) {
        element.style.transform = 'translateY(-2px)';
        element.style.transition = 'all 0.3s ease';
        
        // 为卡片添加更强的阴影
        if (element.classList.contains('bg-white')) {
            element.style.boxShadow = '0 10px 25px rgba(0, 0, 0, 0.15)';
        }
    }
    
    removeHoverEffect(element) {
        element.style.transform = 'translateY(0)';
        element.style.boxShadow = '';
    }
    
    // 键盘快捷键
    setupKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            // Ctrl/Cmd + 数字键快速导航
            if ((e.ctrlKey || e.metaKey) && e.key >= '1' && e.key <= '5') {
                e.preventDefault();
                this.quickNavigate(parseInt(e.key));
            }
            
            // 左右箭头键切换年份
            if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
                this.handleArrowNavigation(e.key);
            }
            
            // ESC键关闭通知
            if (e.key === 'Escape') {
                this.closeAllNotifications();
            }
            
            // 空格键播放/暂停（如果在时间轴页面）
            if (e.key === ' ' && e.target.tagName !== 'INPUT') {
                e.preventDefault();
                this.toggleTimelinePlayback();
            }
        });
    }
    
    quickNavigate(pageNumber) {
        const pages = [
            'index.html',
            '历史分析页面.html',
            '经济因子页面.html',
            '分析结果页面.html',
            '年份对比页面.html'
        ];
        
        if (pages[pageNumber - 1]) {
            window.location.href = pages[pageNumber - 1];
        }
    }
    
    handleArrowNavigation(direction) {
        const slider = document.querySelector('input[type="range"]');
        if (!slider) return;
        
        const currentValue = parseInt(slider.value);
        const step = direction === 'ArrowLeft' ? -10 : 10;
        const newValue = Math.max(1024, Math.min(2024, currentValue + step));
        
        slider.value = newValue;
        slider.dispatchEvent(new Event('input'));
        
        this.showKeyboardHint(`年份: ${newValue}`);
    }
    
    showKeyboardHint(text) {
        const hint = document.createElement('div');
        hint.className = 'fixed bottom-4 left-4 bg-gray-800 text-white px-3 py-2 rounded text-sm z-50';
        hint.textContent = text;
        document.body.appendChild(hint);
        
        setTimeout(() => hint.remove(), 1500);
    }
    
    closeAllNotifications() {
        const notifications = document.querySelectorAll('.fixed.top-4, .fixed.bottom-4');
        notifications.forEach(notification => {
            notification.style.opacity = '0';
            setTimeout(() => notification.remove(), 300);
        });
    }
    
    toggleTimelinePlayback() {
        if (!this.timelinePlayer) {
            this.timelinePlayer = new TimelinePlayer();
        }
        this.timelinePlayer.toggle();
    }
    
    // 工具提示
    setupTooltips() {
        const elementsWithTooltips = document.querySelectorAll('[title]');
        elementsWithTooltips.forEach(element => {
            const title = element.getAttribute('title');
            element.removeAttribute('title'); // 移除默认tooltip
            
            element.addEventListener('mouseenter', (e) => {
                this.showTooltip(e.target, title);
            });
            
            element.addEventListener('mouseleave', () => {
                this.hideTooltip();
            });
        });
        
        // 为特定元素添加自定义提示
        this.addCustomTooltips();
    }
    
    addCustomTooltips() {
        const tooltipData = {
            'input[type="range"]': '拖拽滑块或使用左右箭头键调整年份',
            '.text-finance-blue': '当前选中年份',
            '.bg-finance-gold': '点击进入对比模式',
            '.w-3.h-3.rounded-full': '影响程度指示器'
        };
        
        Object.entries(tooltipData).forEach(([selector, text]) => {
            const elements = document.querySelectorAll(selector);
            elements.forEach(element => {
                element.addEventListener('mouseenter', (e) => {
                    this.showTooltip(e.target, text);
                });
                
                element.addEventListener('mouseleave', () => {
                    this.hideTooltip();
                });
            });
        });
    }
    
    showTooltip(element, text) {
        this.hideTooltip(); // 确保只有一个tooltip
        
        const tooltip = document.createElement('div');
        tooltip.className = 'fixed bg-gray-800 text-white text-xs px-2 py-1 rounded z-50 pointer-events-none';
        tooltip.textContent = text;
        tooltip.id = 'custom-tooltip';
        
        document.body.appendChild(tooltip);
        
        const rect = element.getBoundingClientRect();
        tooltip.style.left = rect.left + (rect.width / 2) - (tooltip.offsetWidth / 2) + 'px';
        tooltip.style.top = rect.top - tooltip.offsetHeight - 5 + 'px';
        
        // 确保tooltip不会超出屏幕
        const tooltipRect = tooltip.getBoundingClientRect();
        if (tooltipRect.left < 0) {
            tooltip.style.left = '5px';
        }
        if (tooltipRect.right > window.innerWidth) {
            tooltip.style.left = window.innerWidth - tooltipRect.width - 5 + 'px';
        }
    }
    
    hideTooltip() {
        const tooltip = document.getElementById('custom-tooltip');
        if (tooltip) {
            tooltip.remove();
        }
    }
    
    // 加载状态管理
    setupLoadingStates() {
        const forms = document.querySelectorAll('form');
        const buttons = document.querySelectorAll('button[type="submit"], .bg-finance-blue');
        
        buttons.forEach(button => {
            button.addEventListener('click', (e) => {
                if (!button.disabled) {
                    this.showLoadingState(button);
                }
            });
        });
    }
    
    showLoadingState(button) {
        const originalText = button.textContent;
        const originalHTML = button.innerHTML;
        
        button.disabled = true;
        button.innerHTML = `
            <svg class="animate-spin -ml-1 mr-3 h-4 w-4 text-white inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            处理中...
        `;
        
        // 模拟处理时间
        setTimeout(() => {
            button.disabled = false;
            button.innerHTML = originalHTML;
        }, 2000);
    }
    
    // 表单验证
    setupFormValidation() {
        const inputs = document.querySelectorAll('input, select, textarea');
        inputs.forEach(input => {
            input.addEventListener('blur', (e) => {
                this.validateField(e.target);
            });
            
            input.addEventListener('input', (e) => {
                this.clearFieldError(e.target);
            });
        });
    }
    
    validateField(field) {
        const value = field.value.trim();
        let isValid = true;
        let errorMessage = '';
        
        // 基本验证规则
        if (field.hasAttribute('required') && !value) {
            isValid = false;
            errorMessage = '此字段为必填项';
        }
        
        if (field.type === 'email' && value && !this.isValidEmail(value)) {
            isValid = false;
            errorMessage = '请输入有效的邮箱地址';
        }
        
        if (field.type === 'number' && value && isNaN(value)) {
            isValid = false;
            errorMessage = '请输入有效的数字';
        }
        
        if (isValid) {
            this.showFieldSuccess(field);
        } else {
            this.showFieldError(field, errorMessage);
        }
        
        return isValid;
    }
    
    showFieldError(field, message) {
        this.clearFieldError(field);
        
        field.classList.add('border-red-500');
        
        const errorDiv = document.createElement('div');
        errorDiv.className = 'text-red-500 text-xs mt-1';
        errorDiv.textContent = message;
        errorDiv.setAttribute('data-error-for', field.name || field.id);
        
        field.parentNode.appendChild(errorDiv);
    }
    
    showFieldSuccess(field) {
        this.clearFieldError(field);
        field.classList.remove('border-red-500');
        field.classList.add('border-green-500');
        
        setTimeout(() => {
            field.classList.remove('border-green-500');
        }, 2000);
    }
    
    clearFieldError(field) {
        field.classList.remove('border-red-500', 'border-green-500');
        
        const errorDiv = field.parentNode.querySelector(`[data-error-for="${field.name || field.id}"]`);
        if (errorDiv) {
            errorDiv.remove();
        }
    }
    
    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
}

// 时间轴播放器
class TimelinePlayer {
    constructor() {
        this.isPlaying = false;
        this.playInterval = null;
        this.playSpeed = 1000; // 毫秒
    }
    
    toggle() {
        if (this.isPlaying) {
            this.pause();
        } else {
            this.play();
        }
    }
    
    play() {
        const slider = document.querySelector('input[type="range"]');
        if (!slider) return;
        
        this.isPlaying = true;
        FeedbackSystem.showInfo('时间轴自动播放已开始 (按空格键暂停)');
        
        this.playInterval = setInterval(() => {
            const currentValue = parseInt(slider.value);
            const newValue = currentValue + 10;
            
            if (newValue > parseInt(slider.max)) {
                this.pause();
                return;
            }
            
            slider.value = newValue;
            slider.dispatchEvent(new Event('input'));
        }, this.playSpeed);
    }
    
    pause() {
        this.isPlaying = false;
        if (this.playInterval) {
            clearInterval(this.playInterval);
            this.playInterval = null;
        }
        FeedbackSystem.showInfo('时间轴播放已暂停');
    }
}

// 初始化交互管理器
document.addEventListener('DOMContentLoaded', function() {
    window.interactionManager = new InteractionManager();
    
    // 显示键盘快捷键提示
    setTimeout(() => {
        if (localStorage.getItem('keyboardHintsShown') !== 'true') {
            FeedbackSystem.showInfo('提示: 使用 Ctrl+1-5 快速导航，左右箭头调整年份');
            localStorage.setItem('keyboardHintsShown', 'true');
        }
    }, 3000);
});
