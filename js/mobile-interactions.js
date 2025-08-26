// 千年经济分析系统 - 移动端交互功能模块
// 提供触摸友好的交互体验

class MobileInteractionManager {
    constructor() {
        this.isMobile = this.detectMobile();
        this.touchStartX = 0;
        this.touchStartY = 0;
        this.isMenuOpen = false;
        this.init();
    }

    detectMobile() {
        return window.innerWidth <= 768 || 
               /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    }

    init() {
        if (this.isMobile) {
            this.setupMobileNavigation();
            this.setupTouchGestures();
            this.setupMobileCharts();
            this.setupMobileFactorControls();
            this.setupMobileExportMenu();
            this.addMobileStyles();
        }

        // 监听屏幕尺寸变化
        window.addEventListener('resize', () => {
            this.isMobile = this.detectMobile();
            if (this.isMobile) {
                this.addMobileStyles();
            }
        });
    }

    setupMobileNavigation() {
        // 创建移动端汉堡菜单
        const header = document.querySelector('header');
        if (!header) return;

        const nav = header.querySelector('nav');
        if (!nav) return;

        // 创建汉堡菜单按钮
        const menuButton = document.createElement('button');
        menuButton.className = 'mobile-menu-button md:hidden p-2';
        menuButton.innerHTML = `
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
            </svg>
        `;

        // 创建移动端菜单
        const mobileMenu = document.createElement('div');
        mobileMenu.className = 'mobile-menu hidden';
        
        // 复制导航链接到移动端菜单
        const navLinks = nav.querySelectorAll('a');
        navLinks.forEach(link => {
            const mobileLink = link.cloneNode(true);
            mobileLink.className = 'block px-4 py-3 text-gray-700 hover:bg-gray-50';
            mobileMenu.appendChild(mobileLink);
        });

        // 添加到header
        const headerContainer = header.querySelector('.flex.justify-between');
        const rightSection = headerContainer.querySelector('.flex.items-center.space-x-4');
        rightSection.appendChild(menuButton);
        header.appendChild(mobileMenu);

        // 菜单切换事件
        menuButton.addEventListener('click', () => {
            this.toggleMobileMenu(mobileMenu, menuButton);
        });

        // 点击菜单项关闭菜单
        mobileMenu.addEventListener('click', (e) => {
            if (e.target.tagName === 'A') {
                this.closeMobileMenu(mobileMenu, menuButton);
            }
        });

        // 点击外部关闭菜单
        document.addEventListener('click', (e) => {
            if (!header.contains(e.target) && this.isMenuOpen) {
                this.closeMobileMenu(mobileMenu, menuButton);
            }
        });
    }

    toggleMobileMenu(menu, button) {
        this.isMenuOpen = !this.isMenuOpen;
        
        if (this.isMenuOpen) {
            menu.classList.remove('hidden');
            button.innerHTML = `
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
            `;
        } else {
            menu.classList.add('hidden');
            button.innerHTML = `
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
                </svg>
            `;
        }
    }

    closeMobileMenu(menu, button) {
        this.isMenuOpen = false;
        menu.classList.add('hidden');
        button.innerHTML = `
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
            </svg>
        `;
    }

    setupTouchGestures() {
        // 为时间轴添加滑动手势
        const timelineContainer = document.querySelector('.timeline-container') || 
                                 document.querySelector('[class*="timeline"]');
        
        if (timelineContainer) {
            this.addSwipeGesture(timelineContainer, {
                onSwipeLeft: () => this.nextYear(),
                onSwipeRight: () => this.previousYear()
            });
        }

        // 为图表添加滑动手势
        const chartContainers = document.querySelectorAll('canvas');
        chartContainers.forEach(canvas => {
            this.addSwipeGesture(canvas.parentElement, {
                onSwipeLeft: () => this.nextChart(),
                onSwipeRight: () => this.previousChart()
            });
        });

        // 为页面添加滑动导航
        this.addSwipeGesture(document.body, {
            onSwipeLeft: () => this.nextPage(),
            onSwipeRight: () => this.previousPage(),
            threshold: 100 // 增加阈值，避免误触
        });
    }

    addSwipeGesture(element, options = {}) {
        const threshold = options.threshold || 50;
        let startX, startY, startTime;

        element.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
            startY = e.touches[0].clientY;
            startTime = Date.now();
        }, { passive: true });

        element.addEventListener('touchend', (e) => {
            if (!startX || !startY) return;

            const endX = e.changedTouches[0].clientX;
            const endY = e.changedTouches[0].clientY;
            const endTime = Date.now();

            const deltaX = endX - startX;
            const deltaY = endY - startY;
            const deltaTime = endTime - startTime;

            // 检查是否为有效滑动
            if (Math.abs(deltaX) > threshold && 
                Math.abs(deltaX) > Math.abs(deltaY) && 
                deltaTime < 500) {
                
                if (deltaX > 0 && options.onSwipeRight) {
                    options.onSwipeRight();
                } else if (deltaX < 0 && options.onSwipeLeft) {
                    options.onSwipeLeft();
                }
            }

            startX = startY = null;
        }, { passive: true });
    }

    nextYear() {
        if (window.timelineController) {
            const currentIndex = window.AppData.availableYears.indexOf(window.AppData.currentYear);
            const nextIndex = (currentIndex + 1) % window.AppData.availableYears.length;
            window.timelineController.setYear(window.AppData.availableYears[nextIndex]);
        }
    }

    previousYear() {
        if (window.timelineController) {
            const currentIndex = window.AppData.availableYears.indexOf(window.AppData.currentYear);
            const prevIndex = currentIndex === 0 ? window.AppData.availableYears.length - 1 : currentIndex - 1;
            window.timelineController.setYear(window.AppData.availableYears[prevIndex]);
        }
    }

    nextChart() {
        // 切换图表显示类型
        if (window.chartManager) {
            window.chartManager.switchChartType();
        }
    }

    previousChart() {
        // 切换图表显示类型（反向）
        if (window.chartManager) {
            window.chartManager.switchChartType(true);
        }
    }

    nextPage() {
        const pages = ['index.html', '历史分析页面.html', '经济因子页面.html', '分析结果页面.html', '年份对比页面.html'];
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';
        const currentIndex = pages.indexOf(currentPage);
        const nextIndex = (currentIndex + 1) % pages.length;
        
        if (nextIndex !== currentIndex) {
            window.location.href = pages[nextIndex];
        }
    }

    previousPage() {
        const pages = ['index.html', '历史分析页面.html', '经济因子页面.html', '分析结果页面.html', '年份对比页面.html'];
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';
        const currentIndex = pages.indexOf(currentPage);
        const prevIndex = currentIndex === 0 ? pages.length - 1 : currentIndex - 1;
        
        if (prevIndex !== currentIndex) {
            window.location.href = pages[prevIndex];
        }
    }

    setupMobileCharts() {
        // 优化图表的触摸交互
        const canvases = document.querySelectorAll('canvas');
        
        canvases.forEach(canvas => {
            // 添加触摸缩放功能
            this.addPinchZoom(canvas);
            
            // 添加触摸提示
            this.addTouchTooltip(canvas);
            
            // 优化Canvas尺寸
            this.optimizeCanvasForMobile(canvas);
        });
    }

    addPinchZoom(canvas) {
        let scale = 1;
        let lastDistance = 0;

        canvas.addEventListener('touchstart', (e) => {
            if (e.touches.length === 2) {
                lastDistance = this.getDistance(e.touches[0], e.touches[1]);
            }
        });

        canvas.addEventListener('touchmove', (e) => {
            if (e.touches.length === 2) {
                e.preventDefault();
                const currentDistance = this.getDistance(e.touches[0], e.touches[1]);
                const scaleChange = currentDistance / lastDistance;
                scale *= scaleChange;
                scale = Math.max(0.5, Math.min(3, scale)); // 限制缩放范围
                
                canvas.style.transform = `scale(${scale})`;
                lastDistance = currentDistance;
            }
        });
    }

    getDistance(touch1, touch2) {
        const dx = touch1.clientX - touch2.clientX;
        const dy = touch1.clientY - touch2.clientY;
        return Math.sqrt(dx * dx + dy * dy);
    }

    addTouchTooltip(canvas) {
        const tooltip = document.createElement('div');
        tooltip.className = 'mobile-tooltip absolute bg-black text-white px-2 py-1 rounded text-sm pointer-events-none z-50 hidden';
        document.body.appendChild(tooltip);

        canvas.addEventListener('touchstart', (e) => {
            const touch = e.touches[0];
            const rect = canvas.getBoundingClientRect();
            const x = touch.clientX - rect.left;
            const y = touch.clientY - rect.top;
            
            // 这里可以根据图表数据显示相应的提示信息
            tooltip.textContent = `坐标: (${Math.round(x)}, ${Math.round(y)})`;
            tooltip.style.left = touch.clientX + 10 + 'px';
            tooltip.style.top = touch.clientY - 30 + 'px';
            tooltip.classList.remove('hidden');
        });

        canvas.addEventListener('touchend', () => {
            tooltip.classList.add('hidden');
        });
    }

    optimizeCanvasForMobile(canvas) {
        const container = canvas.parentElement;
        const containerWidth = container.clientWidth;
        
        // 设置Canvas适合移动端的尺寸
        canvas.style.maxWidth = '100%';
        canvas.style.height = 'auto';
        
        // 如果Canvas太小，增加最小高度
        if (canvas.height < 250) {
            canvas.style.minHeight = '250px';
        }
    }

    setupMobileFactorControls() {
        const factorSliders = document.querySelectorAll('input[type="range"]');
        
        factorSliders.forEach(slider => {
            // 增大滑块的触摸区域
            slider.style.height = '40px';
            slider.style.cursor = 'pointer';
            
            // 添加触摸反馈
            slider.addEventListener('touchstart', () => {
                slider.style.transform = 'scale(1.05)';
            });
            
            slider.addEventListener('touchend', () => {
                slider.style.transform = 'scale(1)';
            });
            
            // 添加震动反馈（如果支持）
            slider.addEventListener('input', () => {
                if (navigator.vibrate) {
                    navigator.vibrate(10);
                }
            });
        });
    }

    setupMobileExportMenu() {
        // 优化导出菜单的移动端显示
        document.addEventListener('click', (e) => {
            if (e.target.closest('.export-button')) {
                const menu = document.querySelector('.export-menu');
                if (menu && this.isMobile) {
                    // 移动端显示为底部弹出菜单
                    menu.style.position = 'fixed';
                    menu.style.bottom = '0';
                    menu.style.left = '0';
                    menu.style.right = '0';
                    menu.style.top = 'auto';
                    menu.style.borderRadius = '1rem 1rem 0 0';
                    menu.style.maxHeight = '50vh';
                    menu.style.overflowY = 'auto';
                }
            }
        });
    }

    addMobileStyles() {
        // 动态添加移动端样式
        if (!document.getElementById('mobile-dynamic-styles')) {
            const style = document.createElement('style');
            style.id = 'mobile-dynamic-styles';
            style.textContent = `
                @media (max-width: 768px) {
                    .mobile-optimized {
                        padding: 0.5rem !important;
                        margin: 0.25rem !important;
                    }
                    
                    .mobile-full-width {
                        width: 100% !important;
                    }
                    
                    .mobile-text-center {
                        text-align: center !important;
                    }
                    
                    .mobile-hidden {
                        display: none !important;
                    }
                    
                    .mobile-block {
                        display: block !important;
                    }
                }
            `;
            document.head.appendChild(style);
        }
    }

    // 添加移动端专用的快捷操作
    addMobileShortcuts() {
        // 双击返回顶部
        let lastTap = 0;
        document.addEventListener('touchend', (e) => {
            const currentTime = new Date().getTime();
            const tapLength = currentTime - lastTap;
            
            if (tapLength < 500 && tapLength > 0) {
                // 双击事件
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
            lastTap = currentTime;
        });

        // 长按显示操作菜单
        let pressTimer;
        document.addEventListener('touchstart', (e) => {
            pressTimer = setTimeout(() => {
                this.showMobileActionMenu(e);
            }, 800);
        });

        document.addEventListener('touchend', () => {
            clearTimeout(pressTimer);
        });

        document.addEventListener('touchmove', () => {
            clearTimeout(pressTimer);
        });
    }

    showMobileActionMenu(e) {
        const menu = document.createElement('div');
        menu.className = 'mobile-action-menu fixed bg-white border border-gray-200 rounded-lg shadow-lg z-50 p-2';
        menu.style.left = e.touches[0].clientX + 'px';
        menu.style.top = e.touches[0].clientY + 'px';
        
        menu.innerHTML = `
            <button class="block w-full text-left px-3 py-2 text-sm hover:bg-gray-50" onclick="window.scrollTo({top: 0, behavior: 'smooth'})">返回顶部</button>
            <button class="block w-full text-left px-3 py-2 text-sm hover:bg-gray-50" onclick="window.history.back()">返回上页</button>
            <button class="block w-full text-left px-3 py-2 text-sm hover:bg-gray-50" onclick="window.location.reload()">刷新页面</button>
        `;
        
        document.body.appendChild(menu);
        
        // 3秒后自动关闭
        setTimeout(() => {
            if (menu.parentElement) {
                menu.remove();
            }
        }, 3000);
        
        // 点击外部关闭
        setTimeout(() => {
            document.addEventListener('click', function closeActionMenu() {
                if (menu.parentElement) {
                    menu.remove();
                }
                document.removeEventListener('click', closeActionMenu);
            });
        }, 100);
    }
}

// 全局移动端交互管理器
window.MobileInteractionManager = MobileInteractionManager;

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', function() {
    window.mobileInteractionManager = new MobileInteractionManager();
    console.log('移动端交互管理器已初始化');
});
