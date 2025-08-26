// 千年经济分析系统 - 核心JavaScript功能
// 解决P0优先级问题：核心交互功能实现

// 全局数据管理
const AppData = {
    currentYear: 1492,
    availableYears: [1348, 1492, 1929, 2008],

    // 获取年份数据
    getYearData(year) {
        // 使用历史数据库
        if (window.HistoricalDatabase && window.HistoricalDatabase[year]) {
            return window.HistoricalDatabase[year];
        }
        // 如果没有精确数据，返回最接近的年份数据
        return this.getClosestYearData(year);
    },

    // 获取最接近的年份数据
    getClosestYearData(targetYear) {
        if (!window.HistoricalDatabase) return null;

        const availableYears = Object.keys(window.HistoricalDatabase).map(y => parseInt(y));
        let closestYear = availableYears[0];
        let minDiff = Math.abs(targetYear - closestYear);

        for (let year of availableYears) {
            const diff = Math.abs(targetYear - year);
            if (diff < minDiff) {
                minDiff = diff;
                closestYear = year;
            }
        }

        return window.HistoricalDatabase[closestYear];
    },
    
    // 更新当前年份
    setCurrentYear(year) {
        this.currentYear = year;
        this.notifyYearChange();
    },
    
    // 通知年份变化
    notifyYearChange() {
        document.dispatchEvent(new CustomEvent('yearChanged', { 
            detail: { year: this.currentYear, data: this.getYearData(this.currentYear) }
        }));
    }
};

// 时间轴控制器
class TimelineController {
    constructor() {
        this.slider = null;
        this.yearDisplay = null;
        this.init();
    }
    
    init() {
        // 查找时间轴元素
        this.slider = document.querySelector('input[type="range"]');
        this.yearDisplay = document.querySelector('.font-medium.text-finance-blue');
        this.yearSelector = document.querySelector('select');

        if (this.slider) {
            this.slider.addEventListener('input', (e) => this.handleSliderChange(e));
            this.updateDisplay(this.slider.value);
        }

        // 添加快速年份选择器事件
        if (this.yearSelector) {
            this.yearSelector.addEventListener('change', (e) => this.handleYearSelection(e));
        }

        // 监听年份变化事件
        document.addEventListener('yearChanged', (e) => this.onYearChanged(e));

        // 设置滑块的步进值，只允许选择有数据的年份
        this.setupSliderSteps();
    }
    
    setupSliderSteps() {
        if (!this.slider || !window.HistoricalDatabase) return;

        const availableYears = Object.keys(window.HistoricalDatabase).map(y => parseInt(y)).sort();
        if (availableYears.length > 0) {
            this.slider.min = availableYears[0];
            this.slider.max = availableYears[availableYears.length - 1];
            this.slider.value = availableYears[1] || availableYears[0]; // 默认选择1492年
        }
    }

    handleSliderChange(event) {
        const year = parseInt(event.target.value);
        const closestYear = this.findClosestAvailableYear(year);

        if (closestYear !== year) {
            event.target.value = closestYear;
        }

        AppData.setCurrentYear(closestYear);
        this.updateDisplay(closestYear);
        this.showLoadingFeedback();
    }

    handleYearSelection(event) {
        const selectedYear = parseInt(event.target.value);
        if (selectedYear && window.HistoricalDatabase[selectedYear]) {
            AppData.setCurrentYear(selectedYear);
            this.updateDisplay(selectedYear);

            if (this.slider) {
                this.slider.value = selectedYear;
            }

            this.showLoadingFeedback();
            event.target.value = ''; // 重置选择器
        }
    }

    findClosestAvailableYear(targetYear) {
        if (!window.HistoricalDatabase) return targetYear;

        const availableYears = Object.keys(window.HistoricalDatabase).map(y => parseInt(y));
        let closestYear = availableYears[0];
        let minDiff = Math.abs(targetYear - closestYear);

        for (let year of availableYears) {
            const diff = Math.abs(targetYear - year);
            if (diff < minDiff) {
                minDiff = diff;
                closestYear = year;
            }
        }

        return closestYear;
    }
    
    updateDisplay(year) {
        if (this.yearDisplay) {
            this.yearDisplay.textContent = `${year}年`;
        }
        
        // 更新URL参数
        const url = new URL(window.location);
        url.searchParams.set('year', year);
        window.history.replaceState({}, '', url);
    }
    
    onYearChanged(event) {
        const { year } = event.detail;
        if (this.slider && parseInt(this.slider.value) !== year) {
            this.slider.value = year;
            this.updateDisplay(year);
        }
    }
    
    showLoadingFeedback() {
        // 显示加载状态
        const loadingEl = document.createElement('div');
        loadingEl.className = 'fixed top-4 right-4 bg-finance-blue text-white px-4 py-2 rounded-md text-sm z-50';
        loadingEl.textContent = '数据更新中...';
        document.body.appendChild(loadingEl);
        
        setTimeout(() => {
            loadingEl.remove();
        }, 800);
    }
}

// 经济因子控制器
class FactorController {
    constructor() {
        this.factors = { economic: 65, political: 20, disaster: 5, gdp: 10 };
        this.sliders = {};
        this.displays = {};
        this.init();
    }
    
    init() {
        // 查找所有滑块
        const sliderContainers = document.querySelectorAll('input[type="range"]');
        sliderContainers.forEach((slider, index) => {
            if (slider.closest('.mb-8')) { // 确保是因子滑块
                const factorNames = ['economic', 'political', 'disaster', 'gdp'];
                const factorName = factorNames[index - 1]; // 减1因为第一个是时间轴
                if (factorName) {
                    this.sliders[factorName] = slider;
                    slider.addEventListener('input', (e) => this.handleFactorChange(factorName, e));
                }
            }
        });
        
        // 查找显示元素
        this.findDisplayElements();
        this.updateAllDisplays();
    }
    
    findDisplayElements() {
        const percentageElements = document.querySelectorAll('.text-lg.font-bold');
        const factorNames = ['economic', 'political', 'disaster', 'gdp'];
        
        percentageElements.forEach((el, index) => {
            if (el.textContent.includes('%')) {
                const factorName = factorNames[index];
                if (factorName) {
                    this.displays[factorName] = el;
                }
            }
        });
    }
    
    handleFactorChange(factorName, event) {
        const value = parseInt(event.target.value);
        this.factors[factorName] = value;
        this.normalizeFactors(factorName);
        this.updateAllDisplays();
        this.updatePieChart();
        this.showFactorFeedback(factorName, value);
    }
    
    normalizeFactors(changedFactor) {
        // 简单的权重归一化
        const total = Object.values(this.factors).reduce((sum, val) => sum + val, 0);
        if (total !== 100) {
            const diff = 100 - total;
            const otherFactors = Object.keys(this.factors).filter(f => f !== changedFactor);
            const adjustment = diff / otherFactors.length;
            
            otherFactors.forEach(factor => {
                this.factors[factor] = Math.max(0, Math.min(100, this.factors[factor] + adjustment));
            });
        }
    }
    
    updateAllDisplays() {
        Object.keys(this.factors).forEach(factor => {
            if (this.displays[factor]) {
                this.displays[factor].textContent = `${Math.round(this.factors[factor])}%`;
            }
            if (this.sliders[factor]) {
                this.sliders[factor].value = this.factors[factor];
            }
        });
    }
    
    updatePieChart() {
        // 更新饼图 - 这里是简化版本
        const pieChart = document.querySelector('svg circle[stroke="#1e40af"]');
        if (pieChart) {
            const circumference = 2 * Math.PI * 40;
            const economicPercent = this.factors.economic / 100;
            const strokeDasharray = `${economicPercent * circumference} ${circumference}`;
            pieChart.setAttribute('stroke-dasharray', strokeDasharray);
        }
    }
    
    showFactorFeedback(factorName, value) {
        const feedback = document.createElement('div');
        feedback.className = 'fixed bottom-4 right-4 bg-green-500 text-white px-4 py-2 rounded-md text-sm z-50';
        feedback.textContent = `${factorName}因子已调整为 ${value}%`;
        document.body.appendChild(feedback);
        
        setTimeout(() => {
            feedback.remove();
        }, 2000);
    }
    
    resetFactors() {
        this.factors = { economic: 65, political: 20, disaster: 5, gdp: 10 };
        this.updateAllDisplays();
        this.updatePieChart();
    }
}

// 页面数据更新器
class PageUpdater {
    constructor() {
        this.init();
    }
    
    init() {
        document.addEventListener('yearChanged', (e) => this.updatePageContent(e));
    }
    
    updatePageContent(event) {
        const { year, data } = event.detail;
        
        // 更新历史分析页面
        this.updateHistoricalAnalysis(year, data);
        
        // 更新经济因子页面
        this.updateFactorAnalysis(year, data);
        
        // 更新分析结果页面
        this.updateResultsAnalysis(year, data);
    }
    
    updateHistoricalAnalysis(year, data) {
        // 更新页面标题中的年份
        const titleElement = document.querySelector('h2');
        if (titleElement && titleElement.textContent.includes('年')) {
            titleElement.textContent = `${year}年历史概况`;
        }

        // 更新主标题
        const mainTitle = document.querySelector('h2.text-lg.font-semibold');
        if (mainTitle) {
            mainTitle.textContent = `${year}年历史概况`;
        }

        // 更新历史事件列表
        const eventContainer = document.querySelector('.space-y-3');
        if (eventContainer && data.events) {
            eventContainer.innerHTML = '';
            data.events.slice(0, 5).forEach(event => { // 只显示前5个事件
                const eventEl = this.createEventElement(event);
                eventContainer.appendChild(eventEl);
            });
        }

        // 更新时代背景
        this.updateTimeBackground(year, data);

        // 更新关键指标
        this.updateKeyMetrics(year, data);

        // 更新历史事件时间线
        this.updateEventTimeline(year, data);
    }
    
    updateTimeBackground(year, data) {
        const backgroundElement = document.querySelector('.bg-gradient-to-r.from-blue-50.to-indigo-50 p');
        if (backgroundElement && data.basicInfo) {
            backgroundElement.textContent = `${year}年正值${data.name}时期。${data.basicInfo.scope}范围内发生重大变化，持续时间${data.basicInfo.duration}。这一时期的特点是${data.type}，对后世产生了深远影响。`;
        }
    }

    updateKeyMetrics(year, data) {
        if (!data.keyMetrics) return;

        const metricCards = document.querySelectorAll('.bg-gradient-to-br.from-blue-500, .bg-gradient-to-br.from-green-500, .bg-gradient-to-br.from-yellow-500');
        const metrics = Object.entries(data.keyMetrics).slice(0, 3);

        metricCards.forEach((card, index) => {
            if (metrics[index]) {
                const [key, value] = metrics[index];
                const valueElement = card.querySelector('.text-2xl.font-bold');
                const labelElement = card.querySelector('.text-blue-100, .text-green-100, .text-yellow-100');

                if (valueElement) valueElement.textContent = value;
                if (labelElement) labelElement.textContent = this.formatMetricLabel(key);
            }
        });
    }

    updateEventTimeline(year, data) {
        const timelineContainer = document.querySelector('.space-y-6');
        if (!timelineContainer || !data.events) return;

        timelineContainer.innerHTML = '';
        data.events.slice(0, 3).forEach((event, index) => {
            const timelineItem = this.createTimelineElement(event, index);
            timelineContainer.appendChild(timelineItem);
        });
    }

    createTimelineElement(event, index) {
        const colors = ['finance-red', 'finance-blue', 'finance-green'];
        const color = colors[index % colors.length];

        const div = document.createElement('div');
        div.className = 'relative flex items-start';
        div.innerHTML = `
            <div class="absolute left-2 w-4 h-4 bg-${color} rounded-full border-2 border-white"></div>
            <div class="ml-10">
                <div class="flex items-center space-x-2">
                    <span class="text-sm font-medium text-gray-900">${event.date || '时期'}</span>
                    <span class="px-2 py-1 bg-${color === 'finance-red' ? 'red' : color === 'finance-blue' ? 'blue' : 'green'}-100 text-${color === 'finance-red' ? 'red' : color === 'finance-blue' ? 'blue' : 'green'}-800 text-xs rounded-full">${this.getEventTypeLabel(event.type)}</span>
                </div>
                <p class="text-sm text-gray-600 mt-1">${event.description}</p>
            </div>
        `;
        return div;
    }

    formatMetricLabel(key) {
        const labels = {
            populationLoss: '人口损失',
            economicContraction: '经济收缩',
            unemploymentRate: '失业率',
            gdpContraction: 'GDP下降',
            tradeGrowth: '贸易增长',
            goldInflux: '黄金流入',
            inflationRate: '通胀率'
        };
        return labels[key] || key;
    }

    getEventTypeLabel(type) {
        const labels = {
            economic: '经济',
            political: '政治',
            disaster: '灾害',
            technology: '技术'
        };
        return labels[type] || type;
    }

    createEventElement(event) {
        const div = document.createElement('div');
        const colorClass = this.getEventColor(event.type);
        const bgColor = event.type === 'economic' ? 'blue' : event.type === 'political' ? 'red' : event.type === 'disaster' ? 'yellow' : 'green';

        div.className = `border-l-4 ${colorClass} pl-4 py-2 bg-${bgColor}-50 rounded-r`;

        div.innerHTML = `
            <div class="flex items-center justify-between">
                <span class="text-sm font-medium text-gray-900">${event.name}</span>
                <span class="text-xs text-gray-500">${event.date || event.type}</span>
            </div>
            <p class="text-xs text-gray-600 mt-1">${event.description}</p>
        `;

        return div;
    }
    
    getEventColor(type) {
        const colors = {
            economic: 'border-finance-blue',
            political: 'border-finance-red',
            disaster: 'border-finance-gold',
            technology: 'border-finance-green'
        };
        return colors[type] || 'border-gray-400';
    }
    
    updateFactorAnalysis(year, data) {
        // 更新因子页面标题
        const factorTitle = document.querySelector('h2');
        if (factorTitle && factorTitle.textContent.includes('经济影响因子')) {
            factorTitle.textContent = `${year}年经济影响因子分析`;
        }
    }
    
    updateResultsAnalysis(year, data) {
        // 更新分析结果页面标题
        const resultsTitle = document.querySelector('h2');
        if (resultsTitle && resultsTitle.textContent.includes('资产价格分析')) {
            resultsTitle.textContent = `${year}年 - 资产价格分析`;
        }
        
        // 更新资产数据
        if (data.assets) {
            this.updateAssetCards(data.assets);
        }
    }
    
    updateAssetCards(assets) {
        // 更新房价卡片
        const housingCard = document.querySelector('.from-blue-500');
        if (housingCard && assets.housing) {
            const changeEl = housingCard.querySelector('.text-2xl.font-bold');
            const peakEl = housingCard.querySelector('.text-blue-100:first-of-type');
            const troughEl = housingCard.querySelector('.text-blue-100:last-of-type');

            if (changeEl) {
                const change = assets.housing.change || assets.housing;
                changeEl.textContent = change === 0 ? 'N/A' : `${change > 0 ? '+' : ''}${change}%`;
            }
            if (peakEl && assets.housing.peak) {
                peakEl.textContent = `峰值: ${assets.housing.peak}`;
            }
            if (troughEl && assets.housing.trough) {
                troughEl.textContent = `谷底: ${assets.housing.trough}`;
            }
        }

        // 更新股市卡片
        const stockCard = document.querySelector('.from-red-500');
        if (stockCard && assets.stock) {
            const changeEl = stockCard.querySelector('.text-2xl.font-bold');
            const peakEl = stockCard.querySelector('.text-red-100:first-of-type');
            const troughEl = stockCard.querySelector('.text-red-100:last-of-type');

            if (changeEl) {
                const change = assets.stock.change || assets.stock;
                changeEl.textContent = change === 0 ? 'N/A' : `${change > 0 ? '+' : ''}${change}%`;
            }
            if (peakEl && assets.stock.peak) {
                peakEl.textContent = `峰值: ${assets.stock.peak}`;
            }
            if (troughEl && assets.stock.trough) {
                troughEl.textContent = `谷底: ${assets.stock.trough}`;
            }
        }

        // 更新黄金卡片
        const goldCard = document.querySelector('.from-yellow-500');
        if (goldCard && assets.gold) {
            const changeEl = goldCard.querySelector('.text-2xl.font-bold');
            const startEl = goldCard.querySelector('.text-yellow-100:first-of-type');
            const peakEl = goldCard.querySelector('.text-yellow-100:last-of-type');

            if (changeEl) {
                const change = assets.gold.change || assets.gold;
                changeEl.textContent = `${change > 0 ? '+' : ''}${change}%`;
            }
            if (startEl && assets.gold.start) {
                startEl.textContent = `起点: $${assets.gold.start}`;
            }
            if (peakEl && assets.gold.peak) {
                peakEl.textContent = `峰值: $${assets.gold.peak}`;
            }
        }
    }
}

// 用户反馈系统
class FeedbackSystem {
    static showSuccess(message) {
        this.showNotification(message, 'success');
    }
    
    static showError(message) {
        this.showNotification(message, 'error');
    }
    
    static showInfo(message) {
        this.showNotification(message, 'info');
    }
    
    static showNotification(message, type) {
        const colors = {
            success: 'bg-green-500',
            error: 'bg-red-500',
            info: 'bg-blue-500'
        };
        
        const notification = document.createElement('div');
        notification.className = `fixed top-4 right-4 ${colors[type]} text-white px-6 py-3 rounded-md shadow-lg z-50 transform transition-all duration-300`;
        notification.textContent = message;
        
        // 添加关闭按钮
        const closeBtn = document.createElement('button');
        closeBtn.className = 'ml-4 text-white hover:text-gray-200';
        closeBtn.innerHTML = '×';
        closeBtn.onclick = () => notification.remove();
        notification.appendChild(closeBtn);
        
        document.body.appendChild(notification);
        
        // 自动消失
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }
}

// 初始化应用
document.addEventListener('DOMContentLoaded', function() {
    // 从URL参数获取初始年份
    const urlParams = new URLSearchParams(window.location.search);
    const yearParam = urlParams.get('year');
    if (yearParam) {
        AppData.setCurrentYear(parseInt(yearParam));
    }
    
    // 初始化各个控制器
    window.timelineController = new TimelineController();
    window.factorController = new FactorController();
    window.pageUpdater = new PageUpdater();
    
    // 显示初始化完成提示
    setTimeout(() => {
        FeedbackSystem.showSuccess('系统初始化完成');
    }, 500);
    
    console.log('千年经济分析系统已启动');
});
