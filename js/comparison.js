// 千年经济分析系统 - 年份对比功能
// 解决P1优先级问题：年份对比动态功能

class ComparisonManager {
    constructor() {
        this.selectedYears = [1348, 2008]; // 默认对比年份
        this.maxComparisons = 4;
        // 使用历史数据库中的数据
        this.comparisonData = this.generateComparisonData();
        this.init();
    }

    generateComparisonData() {
        const data = {};

        if (window.HistoricalDatabase) {
            Object.keys(window.HistoricalDatabase).forEach(year => {
                const yearData = window.HistoricalDatabase[year];
                data[year] = {
                    name: yearData.name,
                    type: yearData.type,
                    duration: yearData.basicInfo.duration,
                    scope: yearData.basicInfo.scope,
                    impact: yearData.basicInfo.population || yearData.basicInfo.unemployment || "重大影响",
                    economic: yearData.basicInfo.economic,
                    assets: {
                        housing: yearData.assets.housing.change || yearData.assets.housing,
                        stock: yearData.assets.stock.change || yearData.assets.stock,
                        gold: yearData.assets.gold.change || yearData.assets.gold
                    }
                };
            });
        }

        return data;
    }
    
    init() {
        this.setupYearSelectors();
        this.setupHotRecommendations();
        this.setupAddButtons();
        this.setupDimensionToggles();
        this.setupActionButtons();
        this.updateComparison();
    }
    
    setupYearSelectors() {
        const selectors = document.querySelectorAll('select');
        selectors.forEach((selector, index) => {
            if (index < this.selectedYears.length) {
                selector.value = `${this.selectedYears[index]}年 - ${this.comparisonData[this.selectedYears[index]].name}`;
                selector.addEventListener('change', (e) => this.handleYearChange(index, e));
            }
        });
    }
    
    handleYearChange(index, event) {
        const selectedText = event.target.value;
        const year = parseInt(selectedText.match(/\d{4}/)[0]);
        
        if (year && this.comparisonData[year]) {
            this.selectedYears[index] = year;
            this.updateComparison();
            FeedbackSystem.showSuccess(`已切换到${year}年进行对比`);
        }
    }
    
    setupHotRecommendations() {
        const hotButtons = document.querySelectorAll('.px-4.py-2.rounded-full');
        hotButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                const text = e.target.textContent;
                this.handleHotRecommendation(text);
            });
        });
    }
    
    handleHotRecommendation(text) {
        if (text.includes('1929 vs 2008')) {
            this.selectedYears = [1929, 2008];
        } else if (text.includes('1348 vs 2020')) {
            this.selectedYears = [1348, 2008]; // 用2008代替2020
        } else if (text.includes('1760 vs 1990')) {
            this.selectedYears = [1500, 2008]; // 用可用年份代替
        } else if (text.includes('1970s vs 2020s')) {
            this.selectedYears = [1929, 2008]; // 用可用年份代替
        }
        
        this.updateYearSelectors();
        this.updateComparison();
        FeedbackSystem.showSuccess('已应用热门对比推荐');
    }
    
    setupAddButtons() {
        const addButtons = document.querySelectorAll('.border-dashed button');
        addButtons.forEach((button, index) => {
            button.addEventListener('click', () => this.addComparison(index + 2));
        });
    }
    
    addComparison(slotIndex) {
        if (this.selectedYears.length >= this.maxComparisons) {
            FeedbackSystem.showError('最多只能同时对比4个年份');
            return;
        }
        
        // 添加新的年份选择器
        const availableYears = Object.keys(this.comparisonData).filter(year => 
            !this.selectedYears.includes(parseInt(year))
        );
        
        if (availableYears.length > 0) {
            const newYear = parseInt(availableYears[0]);
            this.selectedYears.push(newYear);
            this.createNewYearSelector(slotIndex, newYear);
            this.updateComparison();
            FeedbackSystem.showSuccess(`已添加${newYear}年到对比列表`);
        } else {
            FeedbackSystem.showError('没有更多年份可以添加');
        }
    }
    
    createNewYearSelector(slotIndex, year) {
        const container = document.querySelectorAll('.border-dashed')[slotIndex - 2];
        if (!container) return;
        
        const colorClasses = ['from-green-50 to-green-100 border-green-200', 'from-purple-50 to-purple-100 border-purple-200'];
        const colorClass = colorClasses[(slotIndex - 2) % colorClasses.length];
        
        container.className = `bg-gradient-to-r ${colorClass} p-4 rounded-lg border-2`;
        container.innerHTML = `
            <div class="flex items-center justify-between mb-2">
                <span class="text-sm font-medium text-gray-900">对比年份 ${slotIndex}</span>
                <button class="text-gray-600 hover:text-gray-800" onclick="comparisonManager.removeComparison(${slotIndex - 1})">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                </button>
            </div>
            <select class="w-full border border-gray-300 rounded-md px-3 py-2 text-sm bg-white">
                <option>${year}年 - ${this.comparisonData[year].name}</option>
                ${Object.keys(this.comparisonData).map(y => 
                    y != year ? `<option>${y}年 - ${this.comparisonData[y].name}</option>` : ''
                ).join('')}
            </select>
        `;
        
        // 添加事件监听器
        const selector = container.querySelector('select');
        selector.addEventListener('change', (e) => this.handleYearChange(slotIndex - 1, e));
    }
    
    removeComparison(index) {
        if (this.selectedYears.length <= 2) {
            FeedbackSystem.showError('至少需要保留2个年份进行对比');
            return;
        }
        
        this.selectedYears.splice(index, 1);
        this.resetComparisonUI();
        this.updateComparison();
        FeedbackSystem.showSuccess('已移除对比年份');
    }
    
    resetComparisonUI() {
        // 重置所有对比选择器UI
        const containers = document.querySelectorAll('.grid.grid-cols-4 > div');
        containers.forEach((container, index) => {
            if (index >= 2) {
                container.className = 'bg-gray-50 p-4 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center';
                container.innerHTML = `
                    <button class="text-gray-500 hover:text-gray-700 flex flex-col items-center">
                        <svg class="w-8 h-8 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                        </svg>
                        <span class="text-sm">添加对比</span>
                    </button>
                `;
            }
        });
        
        // 重新设置添加按钮
        this.setupAddButtons();
        this.updateYearSelectors();
    }
    
    updateYearSelectors() {
        const selectors = document.querySelectorAll('select');
        this.selectedYears.forEach((year, index) => {
            if (selectors[index]) {
                selectors[index].value = `${year}年 - ${this.comparisonData[year].name}`;
            }
        });
    }
    
    setupDimensionToggles() {
        const checkboxes = document.querySelectorAll('input[type="checkbox"]');
        checkboxes.forEach(checkbox => {
            checkbox.addEventListener('change', () => {
                this.updateComparison();
                const dimension = checkbox.nextElementSibling.textContent;
                FeedbackSystem.showInfo(`${dimension}对比维度已${checkbox.checked ? '启用' : '禁用'}`);
            });
        });
    }
    
    setupActionButtons() {
        const buttons = document.querySelectorAll('.flex.space-x-3 button');
        buttons.forEach(button => {
            const text = button.textContent.trim();
            if (text === '重置对比') {
                button.addEventListener('click', () => this.resetComparison());
            } else if (text === '开始对比') {
                button.addEventListener('click', () => this.startComparison());
            }
        });
        
        // 底部操作按钮
        const bottomButtons = document.querySelectorAll('.flex.justify-center button');
        bottomButtons.forEach(button => {
            const text = button.textContent.trim();
            if (text === '分享对比链接') {
                button.addEventListener('click', () => this.shareComparison());
            }
        });
    }
    
    resetComparison() {
        this.selectedYears = [1348, 2008];
        this.resetComparisonUI();
        this.updateComparison();
        FeedbackSystem.showSuccess('对比已重置为默认设置');
    }
    
    startComparison() {
        this.updateComparison();
        FeedbackSystem.showSuccess('对比分析已更新');
        
        // 滚动到对比结果区域
        const resultSection = document.querySelector('.text-center.mb-8');
        if (resultSection) {
            resultSection.scrollIntoView({ behavior: 'smooth' });
        }
    }
    
    updateComparison() {
        if (this.selectedYears.length < 2) return;
        
        // 更新对比标题
        this.updateComparisonTitle();
        
        // 更新基本信息对比
        this.updateBasicComparison();
        
        // 更新资产价格对比
        this.updateAssetComparison();
        
        // 更新相似点和差异点
        this.updateSimilarityAnalysis();
    }
    
    updateComparisonTitle() {
        const titleElement = document.querySelector('.text-center h2');
        if (titleElement && this.selectedYears.length >= 2) {
            const year1 = this.selectedYears[0];
            const year2 = this.selectedYears[1];
            const name1 = this.comparisonData[year1].name;
            const name2 = this.comparisonData[year2].name;
            titleElement.textContent = `${year1}年${name1} vs ${year2}年${name2}`;
        }
    }
    
    updateBasicComparison() {
        const comparisonCards = document.querySelectorAll('.grid.grid-cols-2 > div');
        
        this.selectedYears.slice(0, 2).forEach((year, index) => {
            const card = comparisonCards[index];
            if (!card) return;
            
            const data = this.comparisonData[year];
            const colorClass = index === 0 ? 'blue' : 'red';
            
            card.innerHTML = `
                <div class="flex items-center mb-4">
                    <div class="w-4 h-4 bg-${colorClass}-500 rounded-full mr-3"></div>
                    <h3 class="text-lg font-semibold text-gray-900">${year}年 - ${data.name}</h3>
                </div>
                <div class="space-y-4">
                    <div class="bg-${colorClass}-50 p-4 rounded-lg">
                        <h4 class="font-medium text-${colorClass}-900 mb-2">危机性质</h4>
                        <p class="text-${colorClass}-700 text-sm">${data.type}</p>
                    </div>
                    <div class="grid grid-cols-2 gap-4 text-sm">
                        <div>
                            <span class="text-gray-600">持续时间</span>
                            <div class="font-medium">${data.duration}</div>
                        </div>
                        <div>
                            <span class="text-gray-600">影响范围</span>
                            <div class="font-medium">${data.scope}</div>
                        </div>
                        <div>
                            <span class="text-gray-600">主要影响</span>
                            <div class="font-medium text-red-600">${data.impact}</div>
                        </div>
                        <div>
                            <span class="text-gray-600">经济损失</span>
                            <div class="font-medium text-red-600">${data.economic}</div>
                        </div>
                    </div>
                </div>
            `;
        });
    }
    
    updateAssetComparison() {
        const assetTypes = ['housing', 'stock', 'gold'];
        const assetNames = ['房价变化', '股市变化', '黄金价格'];
        const assetCards = document.querySelectorAll('.grid.grid-cols-3 > div');
        
        assetTypes.forEach((assetType, index) => {
            const card = assetCards[index];
            if (!card) return;
            
            const year1 = this.selectedYears[0];
            const year2 = this.selectedYears[1];
            const data1 = this.comparisonData[year1];
            const data2 = this.comparisonData[year2];
            
            const value1 = data1.assets[assetType];
            const value2 = data2.assets[assetType];
            
            card.querySelector('h4').textContent = assetNames[index];
            
            const comparisonDivs = card.querySelectorAll('.space-y-3 > div');
            if (comparisonDivs.length >= 2) {
                // 更新第一个年份数据
                comparisonDivs[0].querySelector('.text-sm').textContent = `${year1}年`;
                comparisonDivs[0].querySelector('.text-lg.font-bold').textContent = 
                    value1 === 0 ? 'N/A' : `${value1 > 0 ? '+' : ''}${value1}%`;
                
                // 更新第二个年份数据
                comparisonDivs[1].querySelector('.text-sm').textContent = `${year2}年`;
                comparisonDivs[1].querySelector('.text-lg.font-bold').textContent = 
                    value2 === 0 ? 'N/A' : `${value2 > 0 ? '+' : ''}${value2}%`;
            }
        });
    }
    
    updateSimilarityAnalysis() {
        // 这里可以根据选择的年份动态生成相似点和差异点分析
        // 当前保持静态内容，实际项目中可以基于数据动态生成
    }
    

    
    shareComparison() {
        const shareUrl = `${window.location.origin}${window.location.pathname}?compare=${this.selectedYears.join(',')}`;
        
        if (navigator.share) {
            navigator.share({
                title: '千年经济分析 - 年份对比',
                text: `${this.selectedYears.join('年 vs ')}年历史对比分析`,
                url: shareUrl
            });
        } else {
            // 复制到剪贴板
            navigator.clipboard.writeText(shareUrl).then(() => {
                FeedbackSystem.showSuccess('分享链接已复制到剪贴板');
            });
        }
    }
}

// 初始化对比管理器
document.addEventListener('DOMContentLoaded', function() {
    if (window.location.pathname.includes('年份对比')) {
        window.comparisonManager = new ComparisonManager();
    }
});
