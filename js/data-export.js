// 千年经济分析系统 - 数据导出工具模块
// 支持多种格式的数据导出功能

class DataExportManager {
    constructor() {
        this.supportedFormats = ['json', 'csv', 'excel', 'pdf'];
        this.init();
    }

    init() {
        this.addExportButtons();
        this.setupEventListeners();
    }

    // 添加导出按钮到各个页面
    addExportButtons() {
        // 查找需要添加导出功能的容器
        const containers = [
            '.bg-white.rounded-lg.shadow-sm', // 卡片容器
            '.grid.grid-cols-1', // 网格容器
            '.flex.justify-center' // 按钮容器
        ];

        containers.forEach(selector => {
            const elements = document.querySelectorAll(selector);
            elements.forEach(element => {
                if (this.shouldAddExportButton(element)) {
                    this.addExportButtonToElement(element);
                }
            });
        });
    }

    shouldAddExportButton(element) {
        // 检查是否已经有导出按钮
        if (element.querySelector('.export-button')) return false;
        
        // 检查是否包含数据内容
        const hasData = element.querySelector('canvas') || 
                       element.querySelector('table') || 
                       element.querySelector('.chart-container') ||
                       element.textContent.includes('数据') ||
                       element.textContent.includes('分析');
        
        return hasData;
    }

    addExportButtonToElement(element) {
        const exportButton = this.createExportButton();
        
        // 找到合适的位置插入按钮
        const buttonContainer = element.querySelector('.flex.justify-center') ||
                               element.querySelector('.flex.space-x-4') ||
                               element;

        if (buttonContainer === element) {
            // 创建按钮容器
            const container = document.createElement('div');
            container.className = 'flex justify-center mt-4 space-x-2';
            container.appendChild(exportButton);
            element.appendChild(container);
        } else {
            buttonContainer.appendChild(exportButton);
        }
    }

    createExportButton() {
        const button = document.createElement('button');
        button.className = 'export-button bg-finance-green text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-green-700 transition-colors flex items-center space-x-2';
        button.innerHTML = `
            <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M3 17a1 1 0 011-1h12a1 1 0 011 1v1a1 1 0 01-1 1H4a1 1 0 01-1-1v-1zM6.293 6.707a1 1 0 010-1.414l3-3a1 1 0 011.414 0l3 3a1 1 0 01-1.414 1.414L11 5.414V13a1 1 0 11-2 0V5.414L7.707 6.707a1 1 0 01-1.414 0z"/>
            </svg>
            <span>导出数据</span>
        `;
        
        button.addEventListener('click', (e) => {
            e.preventDefault();
            this.showExportMenu(e.target.closest('.export-button'));
        });

        return button;
    }

    showExportMenu(button) {
        // 移除现有的菜单
        const existingMenu = document.querySelector('.export-menu');
        if (existingMenu) {
            existingMenu.remove();
        }

        const menu = document.createElement('div');
        menu.className = 'export-menu absolute bg-white border border-gray-200 rounded-lg shadow-lg z-50 min-w-48';
        menu.style.top = button.offsetTop + button.offsetHeight + 5 + 'px';
        menu.style.left = button.offsetLeft + 'px';

        menu.innerHTML = `
            <div class="py-2">
                <div class="px-4 py-2 text-sm font-medium text-gray-700 border-b">选择导出格式</div>
                <button class="export-option w-full text-left px-4 py-2 text-sm hover:bg-gray-50 flex items-center space-x-2" data-format="json">
                    <span class="w-2 h-2 bg-blue-500 rounded-full"></span>
                    <span>JSON 格式</span>
                </button>
                <button class="export-option w-full text-left px-4 py-2 text-sm hover:bg-gray-50 flex items-center space-x-2" data-format="csv">
                    <span class="w-2 h-2 bg-green-500 rounded-full"></span>
                    <span>CSV 表格</span>
                </button>
                <button class="export-option w-full text-left px-4 py-2 text-sm hover:bg-gray-50 flex items-center space-x-2" data-format="excel">
                    <span class="w-2 h-2 bg-yellow-500 rounded-full"></span>
                    <span>Excel 文件</span>
                </button>
                <button class="export-option w-full text-left px-4 py-2 text-sm hover:bg-gray-50 flex items-center space-x-2" data-format="image">
                    <span class="w-2 h-2 bg-purple-500 rounded-full"></span>
                    <span>图片格式</span>
                </button>
            </div>
        `;

        // 添加到按钮的父容器
        button.parentElement.style.position = 'relative';
        button.parentElement.appendChild(menu);

        // 添加选项点击事件
        menu.querySelectorAll('.export-option').forEach(option => {
            option.addEventListener('click', (e) => {
                const format = e.currentTarget.dataset.format;
                this.exportData(format, button);
                menu.remove();
            });
        });

        // 点击外部关闭菜单
        setTimeout(() => {
            document.addEventListener('click', function closeMenu(e) {
                if (!menu.contains(e.target) && !button.contains(e.target)) {
                    menu.remove();
                    document.removeEventListener('click', closeMenu);
                }
            });
        }, 100);
    }

    exportData(format, button) {
        const container = button.closest('.bg-white') || button.closest('.grid') || button.closest('section');
        const data = this.extractDataFromContainer(container);
        
        switch (format) {
            case 'json':
                this.exportAsJSON(data);
                break;
            case 'csv':
                this.exportAsCSV(data);
                break;
            case 'excel':
                this.exportAsExcel(data);
                break;
            case 'image':
                this.exportAsImage(container);
                break;
        }
    }

    extractDataFromContainer(container) {
        const data = {
            timestamp: new Date().toISOString(),
            source: window.location.href,
            type: this.getDataType(container),
            content: {}
        };

        // 提取图表数据
        const canvas = container.querySelector('canvas');
        if (canvas && window.chartManager) {
            data.content.chartData = this.extractChartData(canvas);
        }

        // 提取表格数据
        const tables = container.querySelectorAll('table');
        if (tables.length > 0) {
            data.content.tableData = this.extractTableData(tables);
        }

        // 提取文本数据
        const textElements = container.querySelectorAll('p, h1, h2, h3, h4, h5, h6, span');
        data.content.textData = this.extractTextData(textElements);

        // 提取当前年份和因子数据
        if (window.AppData) {
            data.content.currentYear = window.AppData.currentYear;
            data.content.yearData = window.AppData.getYearData(window.AppData.currentYear);
        }

        if (window.factorController) {
            data.content.factors = window.factorController.factors;
        }

        return data;
    }

    getDataType(container) {
        if (container.querySelector('canvas')) return 'chart';
        if (container.querySelector('table')) return 'table';
        if (container.textContent.includes('对比')) return 'comparison';
        if (container.textContent.includes('分析')) return 'analysis';
        return 'general';
    }

    extractChartData(canvas) {
        const year = window.AppData?.currentYear || 2008;
        const chartData = window.chartManager?.chartData?.[year];
        
        return {
            year: year,
            labels: chartData?.labels || [],
            datasets: {
                housing: chartData?.housing || [],
                stock: chartData?.stock || [],
                gold: chartData?.gold || []
            }
        };
    }

    extractTableData(tables) {
        const tableData = [];
        
        tables.forEach(table => {
            const rows = [];
            const tableRows = table.querySelectorAll('tr');
            
            tableRows.forEach(row => {
                const cells = [];
                const tableCells = row.querySelectorAll('td, th');
                
                tableCells.forEach(cell => {
                    cells.push(cell.textContent.trim());
                });
                
                if (cells.length > 0) {
                    rows.push(cells);
                }
            });
            
            tableData.push(rows);
        });
        
        return tableData;
    }

    extractTextData(elements) {
        const textData = [];
        
        elements.forEach(element => {
            const text = element.textContent.trim();
            if (text && text.length > 0) {
                textData.push({
                    tag: element.tagName.toLowerCase(),
                    text: text,
                    className: element.className
                });
            }
        });
        
        return textData;
    }

    exportAsJSON(data) {
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        this.downloadFile(blob, `千年经济分析_${data.type}_${this.getTimestamp()}.json`);
        this.showSuccessMessage('JSON 数据已导出');
    }

    exportAsCSV(data) {
        let csvContent = '';
        
        // 添加基本信息
        csvContent += `导出时间,${data.timestamp}\n`;
        csvContent += `数据类型,${data.type}\n`;
        csvContent += `当前年份,${data.content.currentYear || 'N/A'}\n\n`;
        
        // 添加图表数据
        if (data.content.chartData) {
            csvContent += '图表数据\n';
            csvContent += '时间,房价,股市,黄金\n';
            
            const chartData = data.content.chartData;
            chartData.labels.forEach((label, index) => {
                csvContent += `${label},${chartData.datasets.housing[index] || 0},${chartData.datasets.stock[index] || 0},${chartData.datasets.gold[index] || 0}\n`;
            });
            csvContent += '\n';
        }
        
        // 添加表格数据
        if (data.content.tableData) {
            csvContent += '表格数据\n';
            data.content.tableData.forEach(table => {
                table.forEach(row => {
                    csvContent += row.join(',') + '\n';
                });
                csvContent += '\n';
            });
        }
        
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        this.downloadFile(blob, `千年经济分析_${data.type}_${this.getTimestamp()}.csv`);
        this.showSuccessMessage('CSV 文件已导出');
    }

    exportAsExcel(data) {
        // 简化的Excel导出（实际项目中可以使用SheetJS等库）
        const csvContent = this.generateCSVContent(data);
        const blob = new Blob([csvContent], { type: 'application/vnd.ms-excel' });
        this.downloadFile(blob, `千年经济分析_${data.type}_${this.getTimestamp()}.xls`);
        this.showSuccessMessage('Excel 文件已导出');
    }

    exportAsImage(container) {
        // 使用html2canvas库导出图片（需要引入库）
        if (typeof html2canvas !== 'undefined') {
            html2canvas(container).then(canvas => {
                canvas.toBlob(blob => {
                    this.downloadFile(blob, `千年经济分析_截图_${this.getTimestamp()}.png`);
                    this.showSuccessMessage('图片已导出');
                });
            });
        } else {
            // 简化版本：导出Canvas图表
            const canvas = container.querySelector('canvas');
            if (canvas) {
                canvas.toBlob(blob => {
                    this.downloadFile(blob, `千年经济分析_图表_${this.getTimestamp()}.png`);
                    this.showSuccessMessage('图表图片已导出');
                });
            } else {
                this.showErrorMessage('无法导出图片，请安装html2canvas库');
            }
        }
    }

    generateCSVContent(data) {
        // 重用CSV生成逻辑
        return this.exportAsCSV(data);
    }

    downloadFile(blob, filename) {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    getTimestamp() {
        const now = new Date();
        return now.getFullYear() + 
               String(now.getMonth() + 1).padStart(2, '0') + 
               String(now.getDate()).padStart(2, '0') + '_' +
               String(now.getHours()).padStart(2, '0') + 
               String(now.getMinutes()).padStart(2, '0');
    }

    showSuccessMessage(message) {
        if (window.FeedbackSystem) {
            window.FeedbackSystem.showSuccess(message);
        } else {
            alert(message);
        }
    }

    showErrorMessage(message) {
        if (window.FeedbackSystem) {
            window.FeedbackSystem.showError(message);
        } else {
            alert(message);
        }
    }

    setupEventListeners() {
        // 监听页面变化，动态添加导出按钮
        const observer = new MutationObserver(() => {
            this.addExportButtons();
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }
}

// 全局导出功能
window.DataExportManager = DataExportManager;

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', function() {
    window.dataExportManager = new DataExportManager();
    console.log('数据导出管理器已初始化');
});
