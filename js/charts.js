// 千年经济分析系统 - 图表功能
// 解决P0优先级问题：图表功能实现

// 图表管理器
class ChartManager {
    constructor() {
        this.charts = {};
        this.chartData = this.generateChartData();
        this.currentChartType = 'all'; // 当前显示的图表类型
        this.chartTypes = ['all', 'housing', 'stock', 'gold']; // 可切换的图表类型
        this.init();
    }

    generateChartData() {
        const data = {};

        // 1348年黑死病数据
        data[1348] = {
            labels: ['1347', '1348', '1349', '1350', '1351', '1355', '1360'],
            housing: [100, 85, 60, 45, 30, 35, 45], // 房价暴跌后缓慢恢复
            stock: [0, 0, 0, 0, 0, 0, 0], // 股市尚未出现
            gold: [100, 110, 115, 125, 125, 120, 115] // 避险需求推高金价
        };

        // 1492年地理大发现数据
        data[1492] = {
            labels: ['1490', '1492', '1494', '1496', '1498', '1500', '1502'],
            housing: [100, 105, 110, 115, 120, 120, 118], // 贸易繁荣推动房价
            stock: [0, 0, 0, 0, 0, 0, 0], // 股市尚未出现
            gold: [100, 95, 90, 85, 85, 85, 88] // 美洲黄金流入导致金价下跌
        };

        // 1929年大萧条数据
        data[1929] = {
            labels: ['1928', '1929', '1930', '1931', '1932', '1935', '1939'],
            housing: [100, 95, 85, 75, 70, 70, 75], // 房价持续下跌
            stock: [100, 89, 65, 45, 11, 25, 45], // 股市暴跌后缓慢恢复
            gold: [100, 100, 115, 140, 169, 169, 169] // 金价大幅上涨
        };

        // 2008年金融危机数据
        data[2008] = {
            labels: ['2006', '2007', '2008', '2009', '2010', '2012', '2015'],
            housing: [100, 95, 80, 70, 67, 67, 85], // 房价下跌后恢复
            stock: [100, 100, 70, 43, 65, 85, 120], // 股市V型反转
            gold: [100, 120, 150, 180, 220, 282, 200] // 黄金大牛市
        };

        return data;
    }
    
    init() {
        // 等待DOM加载完成
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.initCharts());
        } else {
            this.initCharts();
        }
        
        // 监听年份变化
        document.addEventListener('yearChanged', (e) => this.updateCharts(e.detail.year));
    }
    
    initCharts() {
        // 初始化价格走势图
        this.initPriceChart();
        
        // 初始化因子饼图
        this.initFactorPieChart();
        
        // 初始化迷你图表
        this.initMiniCharts();
    }
    
    initPriceChart() {
        const canvas = document.getElementById('priceChart');
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d');
        const year = AppData.currentYear;
        const data = this.chartData[year] || this.chartData[2008];
        
        // 创建简单的线图
        this.drawLineChart(ctx, canvas, data);
        this.charts.priceChart = { canvas, ctx, data };
    }
    
    drawLineChart(ctx, canvas, data) {
        const width = canvas.width;
        const height = canvas.height;
        const padding = 40;
        const chartWidth = width - 2 * padding;
        const chartHeight = height - 2 * padding;
        
        // 清空画布
        ctx.clearRect(0, 0, width, height);
        
        // 设置样式
        ctx.fillStyle = '#f9fafb';
        ctx.fillRect(0, 0, width, height);
        
        // 绘制网格
        this.drawGrid(ctx, padding, chartWidth, chartHeight);
        
        // 根据当前图表类型绘制数据线
        if (this.currentChartType === 'all' || this.currentChartType === 'housing') {
            this.drawDataLine(ctx, data.housing, '#1e40af', padding, chartWidth, chartHeight, '房价');
        }
        if ((this.currentChartType === 'all' || this.currentChartType === 'stock') && data.stock.some(v => v > 0)) {
            this.drawDataLine(ctx, data.stock, '#dc2626', padding, chartWidth, chartHeight, '股市');
        }
        if (this.currentChartType === 'all' || this.currentChartType === 'gold') {
            this.drawDataLine(ctx, data.gold, '#f59e0b', padding, chartWidth, chartHeight, '黄金');
        }
        
        // 绘制图例
        this.drawLegend(ctx, width, height, data);
    }
    
    drawGrid(ctx, padding, chartWidth, chartHeight) {
        ctx.strokeStyle = '#e5e7eb';
        ctx.lineWidth = 1;
        
        // 垂直网格线
        for (let i = 0; i <= 6; i++) {
            const x = padding + (i * chartWidth / 6);
            ctx.beginPath();
            ctx.moveTo(x, padding);
            ctx.lineTo(x, padding + chartHeight);
            ctx.stroke();
        }
        
        // 水平网格线
        for (let i = 0; i <= 5; i++) {
            const y = padding + (i * chartHeight / 5);
            ctx.beginPath();
            ctx.moveTo(padding, y);
            ctx.lineTo(padding + chartWidth, y);
            ctx.stroke();
        }
    }
    
    drawDataLine(ctx, data, color, padding, chartWidth, chartHeight, label) {
        if (!data || data.length === 0) return;
        
        const maxValue = Math.max(...data, 100);
        const minValue = Math.min(...data, 0);
        const range = maxValue - minValue || 1;
        
        ctx.strokeStyle = color;
        ctx.lineWidth = 3;
        ctx.beginPath();
        
        data.forEach((value, index) => {
            const x = padding + (index * chartWidth / (data.length - 1));
            const y = padding + chartHeight - ((value - minValue) / range * chartHeight);
            
            if (index === 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
        });
        
        ctx.stroke();
        
        // 绘制数据点
        ctx.fillStyle = color;
        data.forEach((value, index) => {
            const x = padding + (index * chartWidth / (data.length - 1));
            const y = padding + chartHeight - ((value - minValue) / range * chartHeight);
            
            ctx.beginPath();
            ctx.arc(x, y, 4, 0, 2 * Math.PI);
            ctx.fill();
        });
    }
    
    drawLegend(ctx, width, height, data) {
        const legendY = height - 20;
        let legendX = 60;
        
        // 房价图例
        ctx.fillStyle = '#1e40af';
        ctx.fillRect(legendX, legendY, 12, 12);
        ctx.fillStyle = '#374151';
        ctx.font = '12px sans-serif';
        ctx.fillText('房价', legendX + 20, legendY + 10);
        legendX += 80;
        
        // 股市图例（如果有数据）
        if (data.stock.some(v => v > 0)) {
            ctx.fillStyle = '#dc2626';
            ctx.fillRect(legendX, legendY, 12, 12);
            ctx.fillStyle = '#374151';
            ctx.fillText('股市', legendX + 20, legendY + 10);
            legendX += 80;
        }
        
        // 黄金图例
        ctx.fillStyle = '#f59e0b';
        ctx.fillRect(legendX, legendY, 12, 12);
        ctx.fillStyle = '#374151';
        ctx.fillText('黄金', legendX + 20, legendY + 10);
    }
    
    initFactorPieChart() {
        const pieContainer = document.querySelector('.relative.w-48.h-48');
        if (!pieContainer) return;
        
        // 创建动态饼图
        this.createDynamicPieChart(pieContainer);
    }
    
    createDynamicPieChart(container) {
        const svg = container.querySelector('svg');
        if (!svg) return;
        
        // 清空现有内容
        svg.innerHTML = '';
        
        const factors = AppData.getYearData(AppData.currentYear).factors;
        const colors = ['#1e40af', '#dc2626', '#059669', '#f59e0b'];
        const factorNames = ['economic', 'political', 'gdp', 'disaster'];
        
        let currentAngle = 0;
        const radius = 40;
        const centerX = 50;
        const centerY = 50;
        
        factorNames.forEach((factor, index) => {
            const percentage = factors[factor] / 100;
            const angle = percentage * 2 * Math.PI;
            
            if (percentage > 0) {
                const path = this.createPieSlice(centerX, centerY, radius, currentAngle, currentAngle + angle);
                const pathElement = document.createElementNS('http://www.w3.org/2000/svg', 'path');
                pathElement.setAttribute('d', path);
                pathElement.setAttribute('fill', colors[index]);
                pathElement.setAttribute('stroke', 'white');
                pathElement.setAttribute('stroke-width', '2');
                svg.appendChild(pathElement);
                
                currentAngle += angle;
            }
        });
    }
    
    createPieSlice(centerX, centerY, radius, startAngle, endAngle) {
        const x1 = centerX + radius * Math.cos(startAngle);
        const y1 = centerY + radius * Math.sin(startAngle);
        const x2 = centerX + radius * Math.cos(endAngle);
        const y2 = centerY + radius * Math.sin(endAngle);
        
        const largeArcFlag = endAngle - startAngle <= Math.PI ? "0" : "1";
        
        return `M ${centerX} ${centerY} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2} Z`;
    }
    
    initMiniCharts() {
        // 为资产卡片添加迷你图表
        this.createMiniChart('.from-blue-500', 'housing');
        this.createMiniChart('.from-red-500', 'stock');
        this.createMiniChart('.from-yellow-500', 'gold');
    }
    
    createMiniChart(selector, assetType) {
        const card = document.querySelector(selector);
        if (!card) return;
        
        const miniChartContainer = card.querySelector('.h-16');
        if (!miniChartContainer) return;
        
        const year = AppData.currentYear;
        const data = this.chartData[year] || this.chartData[2008];
        const assetData = data[assetType];
        
        // 清空容器
        miniChartContainer.innerHTML = '';
        
        // 创建SVG迷你图表
        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('width', '100%');
        svg.setAttribute('height', '100%');
        svg.setAttribute('viewBox', '0 0 200 64');
        
        if (assetData && assetData.some(v => v > 0)) {
            this.drawMiniLine(svg, assetData);
        } else {
            // 显示"暂无数据"
            const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
            text.setAttribute('x', '100');
            text.setAttribute('y', '32');
            text.setAttribute('text-anchor', 'middle');
            text.setAttribute('fill', 'rgba(255,255,255,0.7)');
            text.setAttribute('font-size', '12');
            text.textContent = '暂无数据';
            svg.appendChild(text);
        }
        
        miniChartContainer.appendChild(svg);
    }
    
    drawMiniLine(svg, data) {
        const maxValue = Math.max(...data);
        const minValue = Math.min(...data);
        const range = maxValue - minValue || 1;
        
        let pathData = '';
        data.forEach((value, index) => {
            const x = (index / (data.length - 1)) * 200;
            const y = 64 - ((value - minValue) / range * 64);
            
            if (index === 0) {
                pathData += `M ${x} ${y}`;
            } else {
                pathData += ` L ${x} ${y}`;
            }
        });
        
        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        path.setAttribute('d', pathData);
        path.setAttribute('stroke', 'rgba(255,255,255,0.8)');
        path.setAttribute('stroke-width', '2');
        path.setAttribute('fill', 'none');
        svg.appendChild(path);
        
        // 添加数据点
        data.forEach((value, index) => {
            const x = (index / (data.length - 1)) * 200;
            const y = 64 - ((value - minValue) / range * 64);
            
            const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
            circle.setAttribute('cx', x);
            circle.setAttribute('cy', y);
            circle.setAttribute('r', '2');
            circle.setAttribute('fill', 'white');
            svg.appendChild(circle);
        });
    }
    
    updateCharts(year) {
        // 更新主图表
        if (this.charts.priceChart) {
            const data = this.chartData[year] || this.chartData[2008];
            this.drawLineChart(this.charts.priceChart.ctx, this.charts.priceChart.canvas, data);
        }

        // 更新饼图
        this.initFactorPieChart();

        // 更新迷你图表
        this.initMiniCharts();
    }

    // 切换图表类型（用于移动端滑动）
    switchChartType(reverse = false) {
        const currentIndex = this.chartTypes.indexOf(this.currentChartType);
        let nextIndex;

        if (reverse) {
            nextIndex = currentIndex === 0 ? this.chartTypes.length - 1 : currentIndex - 1;
        } else {
            nextIndex = (currentIndex + 1) % this.chartTypes.length;
        }

        this.currentChartType = this.chartTypes[nextIndex];
        this.updatePriceChart(window.AppData?.currentYear || 2008);

        // 显示切换提示
        if (window.FeedbackSystem) {
            const typeNames = {
                'all': '全部数据',
                'housing': '房价数据',
                'stock': '股市数据',
                'gold': '黄金数据'
            };
            window.FeedbackSystem.showInfo(`切换到: ${typeNames[this.currentChartType]}`);
        }
    }

    updatePriceChart(year) {
        if (this.charts.priceChart) {
            const data = this.chartData[year] || this.chartData[2008];
            this.drawLineChart(this.charts.priceChart.ctx, this.charts.priceChart.canvas, data);
        }
    }
    
    // 图表切换功能
    setupChartToggle() {
        const toggleButtons = document.querySelectorAll('.px-3.py-1');
        toggleButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                const buttonText = e.target.textContent.trim();
                this.toggleChartData(buttonText);
                
                // 更新按钮状态
                toggleButtons.forEach(btn => btn.classList.remove('bg-finance-blue', 'text-white'));
                toggleButtons.forEach(btn => btn.classList.add('bg-gray-100', 'text-gray-700'));
                e.target.classList.remove('bg-gray-100', 'text-gray-700');
                e.target.classList.add('bg-finance-blue', 'text-white');
            });
        });
    }
    
    toggleChartData(type) {
        if (!this.charts.priceChart) return;
        
        const year = AppData.currentYear;
        const data = this.chartData[year] || this.chartData[2008];
        const ctx = this.charts.priceChart.ctx;
        const canvas = this.charts.priceChart.canvas;
        
        // 根据选择显示不同数据
        const filteredData = { ...data };
        if (type === '房价') {
            filteredData.stock = new Array(7).fill(0);
            filteredData.gold = new Array(7).fill(0);
        } else if (type === '股市') {
            filteredData.housing = new Array(7).fill(0);
            filteredData.gold = new Array(7).fill(0);
        } else if (type === '黄金') {
            filteredData.housing = new Array(7).fill(0);
            filteredData.stock = new Array(7).fill(0);
        }
        
        this.drawLineChart(ctx, canvas, filteredData);
    }
}

// 初始化图表管理器
document.addEventListener('DOMContentLoaded', function() {
    window.chartManager = new ChartManager();
    
    // 设置图表切换功能
    setTimeout(() => {
        if (window.chartManager) {
            window.chartManager.setupChartToggle();
        }
    }, 1000);
});
