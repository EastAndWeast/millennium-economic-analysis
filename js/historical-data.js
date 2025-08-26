// 千年经济分析系统 - 详细历史数据库
// 基于真实历史资料的数据集合

const HistoricalDatabase = {
    1348: {
        name: "黑死病大流行",
        period: "1347-1351年",
        type: "生物灾害引发的经济社会危机",
        
        // 基本信息
        basicInfo: {
            duration: "4年 (1347-1351)",
            scope: "欧洲、亚洲、北非",
            population: "欧洲人口减少30-60%",
            mortality: "7500万-2亿人死亡",
            economic: "欧洲GDP下降40-50%",
            recovery: "50-100年完全恢复"
        },
        
        // 历史事件
        events: [
            {
                date: "1347年10月",
                name: "黑死病传入欧洲",
                type: "disaster",
                impact: "high",
                description: "热那亚商船从克里米亚带回鼠疫，首先在西西里岛爆发"
            },
            {
                date: "1348年春",
                name: "疫情席卷西欧",
                type: "disaster", 
                impact: "high",
                description: "法国、英国、德国相继沦陷，死亡率达30-50%"
            },
            {
                date: "1348年夏",
                name: "劳动力严重短缺",
                type: "economic",
                impact: "high", 
                description: "农业生产崩溃，工匠大量死亡，经济活动停滞"
            },
            {
                date: "1349年",
                name: "社会秩序动荡",
                type: "political",
                impact: "medium",
                description: "封建制度受冲击，农民起义频发，宗教权威下降"
            },
            {
                date: "1350年",
                name: "货币贬值严重",
                type: "economic",
                impact: "high",
                description: "银币含银量下降，通胀严重，贸易萎缩"
            }
        ],
        
        // 经济因子权重
        factors: {
            economic: 25,  // 经济因素相对较低，主要是被动影响
            political: 30, // 政治动荡，社会秩序崩坏
            disaster: 40,  // 天灾是主导因素
            gdp: 5        // GDP概念尚未出现
        },
        
        // 资产价格变化（相对于危机前）
        assets: {
            housing: {
                change: -70,
                reason: "人口锐减导致房屋需求暴跌",
                peak: 100,
                trough: 30,
                recovery: "1400年左右恢复到危机前60%"
            },
            stock: {
                change: 0,
                reason: "股票市场尚未出现",
                note: "主要是商业合伙和行会制度"
            },
            gold: {
                change: 25,
                reason: "避险需求增加，但开采能力下降",
                peak: 125,
                details: "金银比价从12:1上升到16:1"
            }
        },
        
        // 关键数据指标
        keyMetrics: {
            populationLoss: "30-60%",
            economicContraction: "40-50%", 
            inflationRate: "200-300%",
            tradeVolume: "-80%",
            agriculturalOutput: "-60%",
            urbanPopulation: "-50%"
        },
        
        // 长期影响
        longTermImpact: [
            "封建制度衰落，雇佣关系兴起",
            "劳动力稀缺推动技术进步",
            "城市化进程暂时逆转",
            "宗教改革思想萌芽",
            "现代医学和公共卫生概念产生"
        ]
    },
    
    1492: {
        name: "地理大发现时代",
        period: "1492-1504年",
        type: "全球贸易革命和经济扩张",
        
        basicInfo: {
            duration: "持续影响300年",
            scope: "全球",
            population: "欧洲人口增长15%",
            economic: "全球贸易增长500%",
            goldInflux: "美洲黄金白银大量流入欧洲",
            recovery: "开启全球化时代"
        },
        
        events: [
            {
                date: "1492年10月12日",
                name: "哥伦布发现美洲",
                type: "political",
                impact: "high",
                description: "开启欧洲殖民扩张和全球贸易新时代"
            },
            {
                date: "1494年",
                name: "《托德西利亚斯条约》",
                type: "political",
                impact: "medium",
                description: "西班牙和葡萄牙瓜分新世界，确立殖民体系"
            },
            {
                date: "1497年",
                name: "达·伽马绕过好望角",
                type: "economic",
                impact: "high",
                description: "开辟通往印度的海上航线，香料贸易繁荣"
            },
            {
                date: "1500年",
                name: "美洲白银开采",
                type: "economic",
                impact: "high",
                description: "波托西银矿发现，大量白银流入欧洲"
            },
            {
                date: "1503年",
                name: "塞维利亚贸易垄断",
                type: "economic",
                impact: "medium",
                description: "西班牙建立美洲贸易垄断体系"
            }
        ],
        
        factors: {
            economic: 45,  // 贸易革命是主要驱动力
            political: 35, // 殖民扩张和政治重组
            disaster: 5,   // 相对和平时期
            gdp: 15       // 早期国家财富概念
        },
        
        assets: {
            housing: {
                change: 20,
                reason: "城市化和贸易繁荣推动房价上涨",
                peak: 120,
                details: "港口城市房价涨幅最大"
            },
            stock: {
                change: 0,
                reason: "现代股票市场尚未出现",
                note: "主要是商业合伙和贸易公司股份"
            },
            gold: {
                change: -15,
                reason: "美洲大量黄金流入导致欧洲金价下跌",
                trough: 85,
                details: "金银比价从10:1下降到15:1"
            }
        },
        
        keyMetrics: {
            tradeGrowth: "500%",
            goldInflux: "年均16吨黄金流入",
            silverInflux: "年均200吨白银流入", 
            populationGrowth: "15%",
            urbanization: "+25%",
            priceInflation: "300% (价格革命)"
        },
        
        longTermImpact: [
            "全球贸易网络形成",
            "资本主义萌芽",
            "银行业和信贷发展",
            "价格革命推动经济变革",
            "殖民体系确立"
        ]
    },
    
    1929: {
        name: "美国大萧条",
        period: "1929-1939年",
        type: "金融危机引发的全球经济衰退",
        
        basicInfo: {
            duration: "10年 (1929-1939)",
            scope: "全球，美国最严重",
            unemployment: "美国失业率达25%",
            economic: "美国GDP下降30%",
            stockMarket: "道琼斯指数下跌89%",
            recovery: "二战刺激经济复苏"
        },
        
        events: [
            {
                date: "1929年10月24日",
                name: "黑色星期四",
                type: "economic",
                impact: "high",
                description: "纽约股市开始崩盘，单日成交1289万股创纪录"
            },
            {
                date: "1929年10月29日", 
                name: "黑色星期二",
                type: "economic",
                impact: "high",
                description: "股市彻底崩溃，道琼斯指数单日下跌12%"
            },
            {
                date: "1930年6月",
                name: "《斯穆特-霍利关税法》",
                type: "political",
                impact: "high",
                description: "美国提高关税，引发全球贸易战"
            },
            {
                date: "1931年",
                name: "银行倒闭潮",
                type: "economic",
                impact: "high",
                description: "美国2294家银行倒闭，信贷紧缩加剧"
            },
            {
                date: "1933年3月",
                name: "罗斯福新政开始",
                type: "political",
                impact: "medium",
                description: "实施紧急银行法，开启政府干预经济"
            }
        ],
        
        factors: {
            economic: 65,  // 金融投机和经济结构问题
            political: 20, // 政府政策失误
            disaster: 5,   // 自然灾害影响较小
            gdp: 10       // 经济产出大幅下降
        },
        
        assets: {
            housing: {
                change: -30,
                reason: "失业率高企，购房需求暴跌",
                peak: 100,
                trough: 70,
                recovery: "1940年代恢复"
            },
            stock: {
                change: -89,
                reason: "投机泡沫破裂，企业盈利暴跌",
                peak: 381.17,
                trough: 41.22,
                recovery: "1954年恢复到1929年水平"
            },
            gold: {
                change: 69,
                reason: "美元贬值，避险需求激增",
                details: "金价从20.67美元/盎司涨至35美元/盎司"
            }
        },
        
        keyMetrics: {
            unemploymentRate: "25%",
            gdpContraction: "-30%",
            industrialProduction: "-50%",
            bankFailures: "9000家银行倒闭",
            farmIncome: "-60%",
            internationalTrade: "-25%"
        },
        
        longTermImpact: [
            "现代宏观经济学诞生",
            "政府干预经济成为常态",
            "社会保障制度建立",
            "金融监管体系完善",
            "凯恩斯主义经济政策兴起"
        ]
    },
    
    2008: {
        name: "全球金融危机",
        period: "2007-2009年",
        type: "次贷危机引发的全球金融海啸",
        
        basicInfo: {
            duration: "2年主要冲击期",
            scope: "全球，美国为震中",
            unemployment: "美国失业率达10.1%",
            economic: "全球GDP下降0.6%",
            stockMarket: "标普500下跌57%",
            recovery: "2010年开始缓慢复苏"
        },
        
        events: [
            {
                date: "2007年8月",
                name: "次贷危机爆发",
                type: "economic",
                impact: "high",
                description: "美国房地产泡沫破裂，次级抵押贷款违约率飙升"
            },
            {
                date: "2008年3月",
                name: "贝尔斯登倒闭",
                type: "economic",
                impact: "medium",
                description: "第五大投资银行被摩根大通收购"
            },
            {
                date: "2008年9月15日",
                name: "雷曼兄弟破产",
                type: "economic",
                impact: "high",
                description: "158年历史的投资银行宣布破产，引发全球恐慌"
            },
            {
                date: "2008年10月",
                name: "TARP救助计划",
                type: "political",
                impact: "high",
                description: "美国政府推出7000亿美元银行救助计划"
            },
            {
                date: "2009年3月",
                name: "股市触底反弹",
                type: "economic",
                impact: "medium",
                description: "标普500指数在676点触底，开始缓慢回升"
            }
        ],
        
        factors: {
            economic: 70,  // 金融体系问题是核心
            political: 20, // 监管失败和政策应对
            disaster: 0,   // 无自然灾害因素
            gdp: 10       // 实体经济受冲击
        },
        
        assets: {
            housing: {
                change: -33,
                reason: "次贷危机直接冲击房地产市场",
                peak: 206.52,
                trough: 138.07,
                recovery: "2012年开始恢复"
            },
            stock: {
                change: -57,
                reason: "金融恐慌和经济衰退预期",
                peak: 1565.15,
                trough: 676.53,
                recovery: "2013年超过危机前水平"
            },
            gold: {
                change: 182,
                reason: "避险情绪和量化宽松政策",
                start: 680,
                peak: 1920,
                details: "2011年达到历史最高点"
            }
        },
        
        keyMetrics: {
            unemploymentRate: "10.1%",
            gdpContraction: "-5.1%",
            housingPriceDecline: "-33%",
            bankLosses: "2.8万亿美元",
            governmentStimulus: "1.4万亿美元",
            globalTradeDecline: "-12%"
        },
        
        longTermImpact: [
            "金融监管大幅加强",
            "量化宽松成为常规政策工具",
            "全球经济治理机制改革",
            "金融科技快速发展",
            "收入不平等问题凸显"
        ]
    }
};

// 获取年份数据的辅助函数
function getHistoricalData(year) {
    return HistoricalDatabase[year] || null;
}

// 获取所有可用年份
function getAvailableYears() {
    return Object.keys(HistoricalDatabase).map(year => parseInt(year)).sort();
}

// 获取年份对比数据
function getComparisonData(years) {
    return years.map(year => ({
        year: year,
        data: HistoricalDatabase[year]
    })).filter(item => item.data);
}

// 导出到全局
window.HistoricalDatabase = HistoricalDatabase;
window.getHistoricalData = getHistoricalData;
window.getAvailableYears = getAvailableYears;
window.getComparisonData = getComparisonData;
