/**
 * 全球定位数据 - 大洲→国家→省/州→市→县/区
 */

export interface District {
  name: string;
  children?: District[];
}

export interface City {
  name: string;
  districts?: District[];
}

export interface Province {
  name: string;
  cities?: City[];
}

export interface Country {
  name: string;
  provinces?: Province[];
}

export interface Continent {
  name: string;
  countries: Country[];
}

export const WORLD_LOCATIONS: Continent[] = [
  {
    name: "亚洲",
    countries: [
      {
        name: "中国",
        provinces: [
          { name: "北京市", cities: [{ name: "北京市", districts: [{ name: "朝阳区" }, { name: "海淀区" }, { name: "东城区" }, { name: "西城区" }, { name: "丰台区" }, { name: "通州区" }, { name: "昌平区" }, { name: "大兴区" }, { name: "顺义区" }, { name: "房山区" }] }] },
          { name: "上海市", cities: [{ name: "上海市", districts: [{ name: "浦东新区" }, { name: "黄浦区" }, { name: "静安区" }, { name: "徐汇区" }, { name: "长宁区" }, { name: "普陀区" }, { name: "虹口区" }, { name: "杨浦区" }, { name: "闵行区" }, { name: "宝山区" }] }] },
          { name: "广东省", cities: [{ name: "广州市", districts: [{ name: "天河区" }, { name: "越秀区" }, { name: "荔湾区" }, { name: "海珠区" }, { name: "白云区" }, { name: "番禺区" }, { name: "黄埔区" }] }, { name: "深圳市", districts: [{ name: "福田区" }, { name: "罗湖区" }, { name: "南山区" }, { name: "宝安区" }, { name: "龙岗区" }, { name: "龙华区" }] }, { name: "珠海市" }, { name: "佛山市" }, { name: "东莞市" }, { name: "中山市" }] },
          { name: "浙江省", cities: [{ name: "杭州市", districts: [{ name: "西湖区" }, { name: "上城区" }, { name: "拱墅区" }, { name: "滨江区" }, { name: "萧山区" }, { name: "余杭区" }] }, { name: "宁波市" }, { name: "温州市" }, { name: "嘉兴市" }, { name: "绍兴市" }] },
          { name: "江苏省", cities: [{ name: "南京市", districts: [{ name: "玄武区" }, { name: "秦淮区" }, { name: "建邺区" }, { name: "鼓楼区" }, { name: "浦口区" }, { name: "栖霞区" }] }, { name: "苏州市" }, { name: "无锡市" }, { name: "常州市" }, { name: "扬州市" }] },
          { name: "四川省", cities: [{ name: "成都市", districts: [{ name: "锦江区" }, { name: "青羊区" }, { name: "金牛区" }, { name: "武侯区" }, { name: "成华区" }, { name: "高新区" }] }, { name: "绵阳市" }, { name: "乐山市" }, { name: "南充市" }] },
          { name: "湖北省", cities: [{ name: "武汉市", districts: [{ name: "江岸区" }, { name: "江汉区" }, { name: "硚口区" }, { name: "汉阳区" }, { name: "武昌区" }, { name: "洪山区" }] }, { name: "宜昌市" }, { name: "襄阳市" }] },
          { name: "陕西省", cities: [{ name: "西安市", districts: [{ name: "新城区" }, { name: "碑林区" }, { name: "莲湖区" }, { name: "雁塔区" }, { name: "未央区" }] }, { name: "宝鸡市" }, { name: "咸阳市" }] },
          { name: "重庆市", cities: [{ name: "重庆市", districts: [{ name: "渝中区" }, { name: "江北区" }, { name: "南岸区" }, { name: "九龙坡区" }, { name: "沙坪坝区" }, { name: "渝北区" }] }] },
          { name: "山东省", cities: [{ name: "济南市" }, { name: "青岛市" }, { name: "烟台市" }, { name: "潍坊市" }] },
          { name: "河南省", cities: [{ name: "郑州市" }, { name: "洛阳市" }, { name: "开封市" }] },
          { name: "湖南省", cities: [{ name: "长沙市" }, { name: "株洲市" }, { name: "湘潭市" }] },
          { name: "福建省", cities: [{ name: "福州市" }, { name: "厦门市" }, { name: "泉州市" }] },
          { name: "安徽省", cities: [{ name: "合肥市" }, { name: "芜湖市" }, { name: "蚌埠市" }] },
          { name: "河北省", cities: [{ name: "石家庄市" }, { name: "唐山市" }, { name: "保定市" }] },
          { name: "辽宁省", cities: [{ name: "沈阳市" }, { name: "大连市" }, { name: "鞍山市" }] },
          { name: "黑龙江省", cities: [{ name: "哈尔滨市" }, { name: "齐齐哈尔市" }] },
          { name: "吉林省", cities: [{ name: "长春市" }, { name: "吉林市" }] },
          { name: "天津市", cities: [{ name: "天津市" }] },
          { name: "云南省", cities: [{ name: "昆明市" }, { name: "大理市" }, { name: "丽江市" }] },
          { name: "广西壮族自治区", cities: [{ name: "南宁市" }, { name: "桂林市" }, { name: "柳州市" }] },
          { name: "海南省", cities: [{ name: "海口市" }, { name: "三亚市" }] },
          { name: "贵州省", cities: [{ name: "贵阳市" }, { name: "遵义市" }] },
          { name: "江西省", cities: [{ name: "南昌市" }, { name: "九江市" }] },
          { name: "山西省", cities: [{ name: "太原市" }, { name: "大同市" }] },
          { name: "甘肃省", cities: [{ name: "兰州市" }, { name: "天水市" }] },
          { name: "新疆维吾尔自治区", cities: [{ name: "乌鲁木齐市" }, { name: "喀什市" }] },
          { name: "内蒙古自治区", cities: [{ name: "呼和浩特市" }, { name: "包头市" }] },
          { name: "西藏自治区", cities: [{ name: "拉萨市" }] },
          { name: "宁夏回族自治区", cities: [{ name: "银川市" }] },
          { name: "青海省", cities: [{ name: "西宁市" }] },
          { name: "台湾省", cities: [{ name: "台北市" }, { name: "高雄市" }, { name: "台中市" }] },
          { name: "香港特别行政区", cities: [{ name: "香港岛" }, { name: "九龙" }, { name: "新界" }] },
          { name: "澳门特别行政区", cities: [{ name: "澳门半岛" }, { name: "氹仔" }, { name: "路环" }] },
        ]
      },
      {
        name: "日本",
        provinces: [
          { name: "东京都", cities: [{ name: "千代田区" }, { name: "港区" }, { name: "新宿区" }, { name: "涩谷区" }] },
          { name: "大阪府", cities: [{ name: "大阪市" }, { name: "堺市" }] },
          { name: "京都府", cities: [{ name: "京都市" }] },
          { name: "神奈川县", cities: [{ name: "横滨市" }, { name: "川崎市" }] },
          { name: "爱知县", cities: [{ name: "名古屋市" }] },
          { name: "北海道", cities: [{ name: "札幌市" }] },
          { name: "福冈县", cities: [{ name: "福冈市" }] },
          { name: "冲绳县", cities: [{ name: "那霸市" }] },
        ]
      },
      {
        name: "韩国",
        provinces: [
          { name: "首尔特别市", cities: [{ name: "江南区" }, { name: "江北区" }, { name: "中区" }] },
          { name: "釜山广域市", cities: [{ name: "海云台区" }] },
          { name: "仁川广域市", cities: [{ name: "中区" }] },
          { name: "京畿道", cities: [{ name: "水原市" }] },
          { name: "济州特别自治道", cities: [{ name: "济州市" }] },
        ]
      },
      {
        name: "新加坡",
        provinces: [
          { name: "中央区", cities: [{ name: "新加坡市", districts: [{ name: "滨海湾" }, { name: "乌节路" }, { name: "牛车水" }] }] },
          { name: "东北部", cities: [{ name: "实龙岗" }] },
          { name: "西北部", cities: [{ name: "兀兰" }] },
        ]
      },
      {
        name: "泰国",
        provinces: [
          { name: "曼谷直辖市", cities: [{ name: "挽叻区" }, { name: "宛他那区" }, { name: "拍那空区" }] },
          { name: "清迈府", cities: [{ name: "清迈市" }] },
          { name: "普吉府", cities: [{ name: "普吉市" }] },
        ]
      },
      {
        name: "马来西亚",
        provinces: [
          { name: "吉隆坡联邦直辖区", cities: [{ name: "吉隆坡市" }] },
          { name: "雪兰莪州", cities: [{ name: "八打灵再也" }] },
          { name: "槟城州", cities: [{ name: "乔治市" }] },
          { name: "柔佛州", cities: [{ name: "新山市" }] },
        ]
      },
      {
        name: "印度尼西亚",
        provinces: [
          { name: "雅加达首都特区", cities: [{ name: "雅加达市中心" }, { name: "南雅加达" }] },
          { name: "巴厘岛省", cities: [{ name: "登巴萨市" }] },
          { name: "日惹特区", cities: [{ name: "日惹市" }] },
        ]
      },
      {
        name: "菲律宾",
        provinces: [
          { name: "马尼拉大都会", cities: [{ name: "马卡蒂市" }, { name: "奎松市" }] },
          { name: "宿务省", cities: [{ name: "宿务市" }] },
        ]
      },
      {
        name: "越南",
        provinces: [
          { name: "河内市", cities: [{ name: "还剑郡" }, { name: "巴亭郡" }] },
          { name: "胡志明市", cities: [{ name: "第一郡" }, { name: "第三郡" }] },
          { name: "岘港市", cities: [{ name: "海洲郡" }] },
        ]
      },
      {
        name: "印度",
        provinces: [
          { name: "德里国家首都辖区", cities: [{ name: "新德里" }, { name: "旧德里" }] },
          { name: "马哈拉施特拉邦", cities: [{ name: "孟买" }, { name: "浦那" }] },
          { name: "卡纳塔克邦", cities: [{ name: "班加罗尔" }] },
          { name: "泰米尔纳德邦", cities: [{ name: "金奈" }] },
          { name: "西孟加拉邦", cities: [{ name: "加尔各答" }] },
          { name: "喀拉拉邦", cities: [{ name: "科钦" }] },
        ]
      },
      {
        name: "阿联酋",
        provinces: [
          { name: "迪拜酋长国", cities: [{ name: "迪拜市中心" }, { name: "朱美拉" }, { name: "迪拜码头" }] },
          { name: "阿布扎比酋长国", cities: [{ name: "阿布扎比市" }] },
          { name: "沙迦酋长国", cities: [{ name: "沙迦市" }] },
        ]
      },
      {
        name: "沙特阿拉伯",
        provinces: [
          { name: "利雅得省", cities: [{ name: "利雅得市" }] },
          { name: "麦加省", cities: [{ name: "吉达市" }, { name: "麦加市" }] },
          { name: "东部省", cities: [{ name: "达曼市" }, { name: "胡拜尔市" }] },
        ]
      },
      {
        name: "以色列",
        provinces: [
          { name: "耶路撒冷区", cities: [{ name: "耶路撒冷" }] },
          { name: "特拉维夫区", cities: [{ name: "特拉维夫-雅法" }] },
          { name: "海法区", cities: [{ name: "海法" }] },
        ]
      },
      {
        name: "土耳其",
        provinces: [
          { name: "伊斯坦布尔省", cities: [{ name: "法提赫区" }, { name: "贝伊奥卢区" }] },
          { name: "安卡拉省", cities: [{ name: "安卡拉市" }] },
          { name: "安塔利亚省", cities: [{ name: "安塔利亚市" }] },
        ]
      },
      {
        name: "卡塔尔",
        provinces: [
          { name: "多哈市", cities: [{ name: "西湾区" }, { name: "珍珠岛" }] },
        ]
      },
      {
        name: "哈萨克斯坦",
        provinces: [
          { name: "阿拉木图市" },
          { name: "努尔苏丹市" },
        ]
      },
      {
        name: "乌兹别克斯坦",
        provinces: [
          { name: "塔什干市" },
          { name: "撒马尔罕州", cities: [{ name: "撒马尔罕市" }] },
        ]
      },
      {
        name: "巴基斯坦",
        provinces: [
          { name: "信德省", cities: [{ name: "卡拉奇" }] },
          { name: "旁遮普省", cities: [{ name: "拉合尔" }] },
          { name: "伊斯兰堡首都区", cities: [{ name: "伊斯兰堡" }] },
        ]
      },
      {
        name: "缅甸",
        provinces: [
          { name: "仰光省", cities: [{ name: "仰光市" }] },
          { name: "曼德勒省", cities: [{ name: "曼德勒市" }] },
        ]
      },
      {
        name: "柬埔寨",
        provinces: [
          { name: "金边市" },
          { name: "暹粒省", cities: [{ name: "暹粒市" }] },
        ]
      },
      {
        name: "老挝",
        provinces: [
          { name: "万象市" },
          { name: "琅勃拉邦省", cities: [{ name: "琅勃拉邦市" }] },
        ]
      },
      {
        name: "尼泊尔",
        provinces: [
          { name: "巴格马蒂省", cities: [{ name: "加德满都" }] },
          { name: "甘达基省", cities: [{ name: "博卡拉" }] },
        ]
      },
      {
        name: "斯里兰卡",
        provinces: [
          { name: "西部省", cities: [{ name: "科伦坡" }] },
          { name: "中部省", cities: [{ name: "康提" }] },
        ]
      },
      {
        name: "孟加拉国",
        provinces: [
          { name: "达卡专区", cities: [{ name: "达卡市" }] },
          { name: "吉大港专区", cities: [{ name: "吉大港市" }] },
        ]
      },
      {
        name: "蒙古",
        provinces: [
          { name: "乌兰巴托市" },
        ]
      },
      {
        name: "文莱",
        provinces: [
          { name: "文莱摩拉县", cities: [{ name: "斯里巴加湾市" }] },
        ]
      },
      {
        name: "马尔代夫",
        provinces: [
          { name: "马累市" },
        ]
      },
      {
        name: "不丹",
        provinces: [
          { name: "廷布宗", cities: [{ name: "廷布" }] },
        ]
      },
      {
        name: "朝鲜",
        provinces: [
          { name: "平壤市" },
        ]
      },
      {
        name: "阿曼",
        provinces: [
          { name: "马斯喀特省", cities: [{ name: "马斯喀特" }] },
        ]
      },
      {
        name: "科威特",
        provinces: [
          { name: "科威特省", cities: [{ name: "科威特城" }] },
        ]
      },
      {
        name: "巴林",
        provinces: [
          { name: "首都省", cities: [{ name: "麦纳麦" }] },
        ]
      },
      {
        name: "约旦",
        provinces: [
          { name: "安曼省", cities: [{ name: "安曼" }] },
        ]
      },
      {
        name: "黎巴嫩",
        provinces: [
          { name: "贝鲁特省", cities: [{ name: "贝鲁特" }] },
        ]
      },
      {
        name: "伊拉克",
        provinces: [
          { name: "巴格达省", cities: [{ name: "巴格达" }] },
        ]
      },
      {
        name: "伊朗",
        provinces: [
          { name: "德黑兰省", cities: [{ name: "德黑兰" }] },
        ]
      },
      {
        name: "格鲁吉亚",
        provinces: [
          { name: "第比利斯" },
        ]
      },
      {
        name: "亚美尼亚",
        provinces: [
          { name: "埃里温" },
        ]
      },
      {
        name: "阿塞拜疆",
        provinces: [
          { name: "巴库" },
        ]
      },
      {
        name: "吉尔吉斯斯坦",
        provinces: [
          { name: "比什凯克" },
        ]
      },
      {
        name: "塔吉克斯坦",
        provinces: [
          { name: "杜尚别" },
        ]
      },
      {
        name: "土库曼斯坦",
        provinces: [
          { name: "阿什哈巴德" },
        ]
      },
      {
        name: "叙利亚",
        provinces: [
          { name: "大马士革省", cities: [{ name: "大马士革" }] },
        ]
      },
      {
        name: "也门",
        provinces: [
          { name: "萨那" },
        ]
      },
      {
        name: "东帝汶",
        provinces: [
          { name: "帝力" },
        ]
      },
    ]
  },
  {
    name: "欧洲",
    countries: [
      { name: "英国", provinces: [{ name: "英格兰", cities: [{ name: "伦敦" }, { name: "曼彻斯特" }, { name: "伯明翰" }] }, { name: "苏格兰", cities: [{ name: "爱丁堡" }, { name: "格拉斯哥" }] }, { name: "威尔士", cities: [{ name: "加的夫" }] }, { name: "北爱尔兰", cities: [{ name: "贝尔法斯特" }] }] },
      { name: "法国", provinces: [{ name: "法兰西岛", cities: [{ name: "巴黎" }, { name: "凡尔赛" }] }, { name: "普罗旺斯-阿尔卑斯-蔚蓝海岸", cities: [{ name: "马赛" }, { name: "尼斯" }] }, { name: "奥弗涅-罗讷-阿尔卑斯", cities: [{ name: "里昂" }] }, { name: "新阿基坦", cities: [{ name: "波尔多" }] }] },
      { name: "德国", provinces: [{ name: "巴伐利亚州", cities: [{ name: "慕尼黑" }, { name: "纽伦堡" }] }, { name: "北莱茵-威斯特法伦州", cities: [{ name: "科隆" }, { name: "杜塞尔多夫" }] }, { name: "柏林", cities: [{ name: "柏林市" }] }, { name: "巴登-符腾堡州", cities: [{ name: "斯图加特" }] }, { name: "汉堡", cities: [{ name: "汉堡市" }] }] },
      { name: "意大利", provinces: [{ name: "拉齐奥", cities: [{ name: "罗马" }] }, { name: "伦巴第", cities: [{ name: "米兰" }] }, { name: "威尼托", cities: [{ name: "威尼斯" }] }, { name: "托斯卡纳", cities: [{ name: "佛罗伦萨" }] }, { name: "坎帕尼亚", cities: [{ name: "那不勒斯" }] }] },
      { name: "西班牙", provinces: [{ name: "加泰罗尼亚", cities: [{ name: "巴塞罗那" }] }, { name: "马德里自治区", cities: [{ name: "马德里" }] }, { name: "安达卢西亚", cities: [{ name: "塞维利亚" }, { name: "马拉加" }] }] },
      { name: "荷兰", provinces: [{ name: "北荷兰省", cities: [{ name: "阿姆斯特丹" }] }, { name: "南荷兰省", cities: [{ name: "鹿特丹" }, { name: "海牙" }] }, { name: "乌得勒支省", cities: [{ name: "乌得勒支" }] }] },
      { name: "瑞士", provinces: [{ name: "苏黎世州", cities: [{ name: "苏黎世" }] }, { name: "日内瓦州", cities: [{ name: "日内瓦" }] }, { name: "沃州", cities: [{ name: "洛桑" }] }, { name: "伯尔尼州", cities: [{ name: "伯尔尼" }] }] },
      { name: "奥地利", provinces: [{ name: "维也纳", cities: [{ name: "维也纳市" }] }, { name: "萨尔茨堡州", cities: [{ name: "萨尔茨堡" }] }, { name: "蒂罗尔州", cities: [{ name: "因斯布鲁克" }] }] },
      { name: "瑞典", provinces: [{ name: "斯德哥尔摩省", cities: [{ name: "斯德哥尔摩" }] }, { name: "西哥特兰省", cities: [{ name: "哥德堡" }] }, { name: "斯科讷省", cities: [{ name: "马尔默" }] }] },
      { name: "挪威", provinces: [{ name: "奥斯陆", cities: [{ name: "奥斯陆市" }] }, { name: "霍达兰郡", cities: [{ name: "卑尔根" }] }] },
      { name: "丹麦", provinces: [{ name: "首都大区", cities: [{ name: "哥本哈根" }] }, { name: "中日德兰大区", cities: [{ name: "奥胡斯" }] }] },
      { name: "芬兰", provinces: [{ name: "赫尔辛基" }, { name: "坦佩雷" }] },
      { name: "比利时", provinces: [{ name: "布鲁塞尔首都大区" }, { name: "佛兰德斯大区", cities: [{ name: "布鲁日" }, { name: "安特卫普" }] }, { name: "瓦隆大区" }] },
      { name: "葡萄牙", provinces: [{ name: "里斯本区", cities: [{ name: "里斯本" }] }, { name: "波尔图区", cities: [{ name: "波尔图" }] }, { name: "法鲁区", cities: [{ name: "法鲁" }] }] },
      { name: "希腊", provinces: [{ name: "阿提卡", cities: [{ name: "雅典" }, { name: "比雷埃夫斯" }] }, { name: "中马其顿", cities: [{ name: "塞萨洛尼基" }] }, { name: "南爱琴", cities: [{ name: "圣托里尼" }] }] },
      { name: "爱尔兰", provinces: [{ name: "伦斯特省", cities: [{ name: "都柏林" }] }, { name: "芒斯特省", cities: [{ name: "科克" }] }] },
      { name: "波兰", provinces: [{ name: "马佐夫舍省", cities: [{ name: "华沙" }] }, { name: "小波兰省", cities: [{ name: "克拉科夫" }] }] },
      { name: "捷克", provinces: [{ name: "布拉格" }, { name: "南摩拉维亚州", cities: [{ name: "布尔诺" }] }] },
      { name: "匈牙利", provinces: [{ name: "布达佩斯" }] },
      { name: "俄罗斯", provinces: [{ name: "莫斯科", cities: [{ name: "莫斯科市" }] }, { name: "圣彼得堡" }, { name: "列宁格勒州", cities: [{ name: "圣彼得堡市" }] }, { name: "滨海边疆区", cities: [{ name: "符拉迪沃斯托克" }] }] },
      { name: "乌克兰", provinces: [{ name: "基辅" }] },
      { name: "冰岛", provinces: [{ name: "首都区", cities: [{ name: "雷克雅未克" }] }] },
      { name: "克罗地亚", provinces: [{ name: "萨格勒布" }, { name: "斯普利特-达尔马提亚县", cities: [{ name: "斯普利特" }] }, { name: "杜布罗夫尼克-内雷特瓦县", cities: [{ name: "杜布罗夫尼克" }] }] },
      { name: "罗马尼亚", provinces: [{ name: "布加勒斯特" }] },
      { name: "保加利亚", provinces: [{ name: "索非亚" }] },
      { name: "塞尔维亚", provinces: [{ name: "贝尔格莱德" }] },
      { name: "斯洛伐克", provinces: [{ name: "布拉迪斯拉发" }] },
      { name: "斯洛文尼亚", provinces: [{ name: "卢布尔雅那" }] },
      { name: "立陶宛", provinces: [{ name: "维尔纽斯" }] },
      { name: "拉脱维亚", provinces: [{ name: "里加" }] },
      { name: "爱沙尼亚", provinces: [{ name: "塔林" }] },
      { name: "卢森堡", provinces: [{ name: "卢森堡市" }] },
      { name: "马耳他", provinces: [{ name: "瓦莱塔" }] },
      { name: "塞浦路斯", provinces: [{ name: "尼科西亚" }] },
      { name: "摩纳哥", provinces: [{ name: "摩纳哥城" }] },
      { name: "安道尔", provinces: [{ name: "安道尔城" }] },
      { name: "列支敦士登", provinces: [{ name: "瓦杜兹" }] },
      { name: "圣马力诺", provinces: [{ name: "圣马力诺市" }] },
      { name: "梵蒂冈", provinces: [{ name: "梵蒂冈城" }] },
      { name: "北马其顿", provinces: [{ name: "斯科普里" }] },
      { name: "阿尔巴尼亚", provinces: [{ name: "地拉那" }] },
      { name: "波斯尼亚和黑塞哥维那", provinces: [{ name: "萨拉热窝" }] },
      { name: "黑山", provinces: [{ name: "波德戈里察" }] },
      { name: "摩尔多瓦", provinces: [{ name: "基希讷乌" }] },
      { name: "白俄罗斯", provinces: [{ name: "明斯克" }] },
      { name: "科索沃", provinces: [{ name: "普里什蒂纳" }] },
    ]
  },
  {
    name: "北美洲",
    countries: [
      {
        name: "美国",
        provinces: [
          { name: "加利福尼亚州", cities: [{ name: "洛杉矶" }, { name: "旧金山" }, { name: "圣地亚哥" }, { name: "圣何塞" }] },
          { name: "纽约州", cities: [{ name: "纽约市" }, { name: "布法罗" }] },
          { name: "德克萨斯州", cities: [{ name: "休斯顿" }, { name: "达拉斯" }, { name: "奥斯汀" }, { name: "圣安东尼奥" }] },
          { name: "佛罗里达州", cities: [{ name: "迈阿密" }, { name: "奥兰多" }, { name: "坦帕" }] },
          { name: "伊利诺伊州", cities: [{ name: "芝加哥" }] },
          { name: "马萨诸塞州", cities: [{ name: "波士顿" }] },
          { name: "华盛顿州", cities: [{ name: "西雅图" }] },
          { name: "内华达州", cities: [{ name: "拉斯维加斯" }] },
          { name: "科罗拉多州", cities: [{ name: "丹佛" }] },
          { name: "亚利桑那州", cities: [{ name: "凤凰城" }] },
          { name: "佐治亚州", cities: [{ name: "亚特兰大" }] },
          { name: "宾夕法尼亚州", cities: [{ name: "费城" }, { name: "匹兹堡" }] },
          { name: "夏威夷州", cities: [{ name: "檀香山" }] },
          { name: "密歇根州", cities: [{ name: "底特律" }] },
          { name: "俄亥俄州", cities: [{ name: "克利夫兰" }, { name: "辛辛那提" }] },
          { name: "华盛顿哥伦比亚特区", cities: [{ name: "华盛顿特区" }] },
          { name: "俄勒冈州", cities: [{ name: "波特兰" }] },
          { name: "犹他州", cities: [{ name: "盐湖城" }] },
          { name: "路易斯安那州", cities: [{ name: "新奥尔良" }] },
          { name: "田纳西州", cities: [{ name: "纳什维尔" }] },
          { name: "北卡罗来纳州", cities: [{ name: "夏洛特" }] },
          { name: "威斯康星州", cities: [{ name: "密尔沃基" }] },
          { name: "明尼苏达州", cities: [{ name: "明尼阿波利斯" }] },
          { name: "密苏里州", cities: [{ name: "堪萨斯城" }] },
          { name: "康涅狄格州", cities: [{ name: "纽黑文" }] },
          { name: "新泽西州", cities: [{ name: "纽瓦克" }] },
          { name: "马里兰州", cities: [{ name: "巴尔的摩" }] },
          { name: "弗吉尼亚州", cities: [{ name: "里士满" }] },
          { name: "印第安纳州", cities: [{ name: "印第安纳波利斯" }] },
          { name: "南卡罗来纳州", cities: [{ name: "查尔斯顿" }] },
        ]
      },
      {
        name: "加拿大",
        provinces: [
          { name: "安大略省", cities: [{ name: "多伦多" }, { name: "渥太华" }] },
          { name: "魁北克省", cities: [{ name: "蒙特利尔" }, { name: "魁北克市" }] },
          { name: "不列颠哥伦比亚省", cities: [{ name: "温哥华" }, { name: "维多利亚" }] },
          { name: "艾伯塔省", cities: [{ name: "卡尔加里" }, { name: "埃德蒙顿" }] },
        ]
      },
      { name: "墨西哥", provinces: [{ name: "墨西哥城" }, { name: "哈利斯科州", cities: [{ name: "瓜达拉哈拉" }] }, { name: "金塔纳罗奥州", cities: [{ name: "坎昆" }] }, { name: "下加利福尼亚州", cities: [{ name: "蒂华纳" }] }] },
      { name: "古巴", provinces: [{ name: "哈瓦那" }] },
      { name: "牙买加", provinces: [{ name: "金斯敦" }] },
      { name: "多米尼加", provinces: [{ name: "圣多明各" }] },
      { name: "巴拿马", provinces: [{ name: "巴拿马城" }] },
      { name: "哥斯达黎加", provinces: [{ name: "圣何塞" }] },
      { name: "危地马拉", provinces: [{ name: "危地马拉城" }] },
      { name: "洪都拉斯", provinces: [{ name: "特古西加尔巴" }] },
      { name: "巴哈马", provinces: [{ name: "拿骚" }] },
      { name: "巴巴多斯", provinces: [{ name: "布里奇敦" }] },
      { name: "特立尼达和多巴哥", provinces: [{ name: "西班牙港" }] },
      { name: "伯利兹", provinces: [{ name: "贝尔莫潘" }] },
      { name: "萨尔瓦多", provinces: [{ name: "圣萨尔瓦多" }] },
      { name: "尼加拉瓜", provinces: [{ name: "马那瓜" }] },
      { name: "海地", provinces: [{ name: "太子港" }] },
      { name: "安提瓜和巴布达", provinces: [{ name: "圣约翰" }] },
      { name: "圣卢西亚", provinces: [{ name: "卡斯特里" }] },
      { name: "格林纳达", provinces: [{ name: "圣乔治" }] },
      { name: "圣基茨和尼维斯", provinces: [{ name: "巴斯特尔" }] },
      { name: "圣文森特和格林纳丁斯", provinces: [{ name: "金斯敦" }] },
    ]
  },
  {
    name: "南美洲",
    countries: [
      { name: "巴西", provinces: [{ name: "圣保罗州", cities: [{ name: "圣保罗市" }] }, { name: "里约热内卢州", cities: [{ name: "里约热内卢" }] }, { name: "巴伊亚州", cities: [{ name: "萨尔瓦多" }] }, { name: "米纳斯吉拉斯州", cities: [{ name: "贝洛奥里藏特" }] }] },
      { name: "阿根廷", provinces: [{ name: "布宜诺斯艾利斯省", cities: [{ name: "布宜诺斯艾利斯" }] }, { name: "科尔多瓦省", cities: [{ name: "科尔多瓦" }] }, { name: "门多萨省", cities: [{ name: "门多萨" }] }] },
      { name: "智利", provinces: [{ name: "圣地亚哥首都大区", cities: [{ name: "圣地亚哥" }] }, { name: "瓦尔帕莱索大区", cities: [{ name: "瓦尔帕莱索" }] }] },
      { name: "秘鲁", provinces: [{ name: "利马省", cities: [{ name: "利马" }] }, { name: "库斯科大区", cities: [{ name: "库斯科" }] }] },
      { name: "哥伦比亚", provinces: [{ name: "波哥大首都区" }, { name: "安蒂奥基亚省", cities: [{ name: "麦德林" }] }] },
      { name: "厄瓜多尔", provinces: [{ name: "皮钦查省", cities: [{ name: "基多" }] }, { name: "瓜亚斯省", cities: [{ name: "瓜亚基尔" }] }] },
      { name: "乌拉圭", provinces: [{ name: "蒙得维的亚省", cities: [{ name: "蒙得维的亚" }] }] },
      { name: "巴拉圭", provinces: [{ name: "亚松森" }] },
      { name: "玻利维亚", provinces: [{ name: "拉巴斯" }, { name: "圣克鲁斯省", cities: [{ name: "圣克鲁斯" }] }] },
      { name: "委内瑞拉", provinces: [{ name: "加拉加斯" }] },
      { name: "圭亚那", provinces: [{ name: "乔治敦" }] },
      { name: "苏里南", provinces: [{ name: "帕拉马里博" }] },
    ]
  },
  {
    name: "大洋洲",
    countries: [
      { name: "澳大利亚", provinces: [{ name: "新南威尔士州", cities: [{ name: "悉尼" }] }, { name: "维多利亚州", cities: [{ name: "墨尔本" }] }, { name: "昆士兰州", cities: [{ name: "布里斯班" }, { name: "黄金海岸" }] }, { name: "西澳大利亚州", cities: [{ name: "珀斯" }] }, { name: "南澳大利亚州", cities: [{ name: "阿德莱德" }] }] },
      { name: "新西兰", provinces: [{ name: "奥克兰大区", cities: [{ name: "奥克兰" }] }, { name: "惠灵顿大区", cities: [{ name: "惠灵顿" }] }, { name: "坎特伯雷大区", cities: [{ name: "基督城" }] }, { name: "奥塔哥大区", cities: [{ name: "皇后镇" }] }] },
      { name: "斐济", provinces: [{ name: "中央区", cities: [{ name: "苏瓦" }] }, { name: "西部区", cities: [{ name: "楠迪" }] }] },
      { name: "巴布亚新几内亚", provinces: [{ name: "国家首都区", cities: [{ name: "莫尔兹比港" }] }] },
      { name: "帕劳", provinces: [{ name: "梅莱凯奥克" }] },
      { name: "萨摩亚", provinces: [{ name: "阿皮亚" }] },
      { name: "汤加", provinces: [{ name: "努库阿洛法" }] },
      { name: "瓦努阿图", provinces: [{ name: "维拉港" }] },
      { name: "所罗门群岛", provinces: [{ name: "霍尼亚拉" }] },
      { name: "基里巴斯", provinces: [{ name: "塔拉瓦" }] },
      { name: "密克罗尼西亚联邦", provinces: [{ name: "帕利基尔" }] },
      { name: "马绍尔群岛", provinces: [{ name: "马朱罗" }] },
      { name: "瑙鲁", provinces: [{ name: "亚伦" }] },
      { name: "图瓦卢", provinces: [{ name: "富纳富提" }] },
    ]
  },
  {
    name: "非洲",
    countries: [
      { name: "南非", provinces: [{ name: "豪登省", cities: [{ name: "约翰内斯堡" }, { name: "比勒陀利亚" }] }, { name: "西开普省", cities: [{ name: "开普敦" }] }, { name: "夸祖鲁-纳塔尔省", cities: [{ name: "德班" }] }] },
      { name: "埃及", provinces: [{ name: "开罗省", cities: [{ name: "开罗" }] }, { name: "亚历山大省", cities: [{ name: "亚历山大" }] }, { name: "卢克索省", cities: [{ name: "卢克索" }] }, { name: "南西奈省", cities: [{ name: "沙姆沙伊赫" }] }] },
      { name: "摩洛哥", provinces: [{ name: "卡萨布兰卡-塞塔特大区", cities: [{ name: "卡萨布兰卡" }] }, { name: "马拉喀什-萨菲大区", cities: [{ name: "马拉喀什" }] }, { name: "非斯-梅克内斯大区", cities: [{ name: "非斯" }] }] },
      { name: "肯尼亚", provinces: [{ name: "内罗毕" }, { name: "蒙巴萨" }] },
      { name: "坦桑尼亚", provinces: [{ name: "达累斯萨拉姆" }, { name: "阿鲁沙" }, { name: "桑给巴尔" }] },
      { name: "埃塞俄比亚", provinces: [{ name: "亚的斯亚贝巴" }] },
      { name: "尼日利亚", provinces: [{ name: "拉各斯" }, { name: "阿布贾" }] },
      { name: "加纳", provinces: [{ name: "阿克拉" }] },
      { name: "突尼斯", provinces: [{ name: "突尼斯市" }] },
      { name: "塞舌尔", provinces: [{ name: "维多利亚" }] },
      { name: "毛里求斯", provinces: [{ name: "路易港" }] },
      { name: "阿尔及利亚", provinces: [{ name: "阿尔及尔" }] },
      { name: "利比亚", provinces: [{ name: "的黎波里" }] },
      { name: "乌干达", provinces: [{ name: "坎帕拉" }] },
      { name: "赞比亚", provinces: [{ name: "卢萨卡" }] },
      { name: "津巴布韦", provinces: [{ name: "哈拉雷" }] },
      { name: "博茨瓦纳", provinces: [{ name: "哈博罗内" }] },
      { name: "纳米比亚", provinces: [{ name: "温得和克" }] },
      { name: "马达加斯加", provinces: [{ name: "塔那那利佛" }] },
      { name: "喀麦隆", provinces: [{ name: "雅温得" }] },
      { name: "科特迪瓦", provinces: [{ name: "阿比让" }] },
      { name: "塞内加尔", provinces: [{ name: "达喀尔" }] },
      { name: "卢旺达", provinces: [{ name: "基加利" }] },
      { name: "刚果民主共和国", provinces: [{ name: "金沙萨" }] },
      { name: "安哥拉", provinces: [{ name: "罗安达" }] },
      { name: "莫桑比克", provinces: [{ name: "马普托" }] },
      { name: "马拉维", provinces: [{ name: "利隆圭" }] },
    ]
  },
  {
    name: "南极洲",
    countries: [
      { name: "南极洲（科研站）", provinces: [{ name: "中国南极长城站" }, { name: "中国南极中山站" }, { name: "中国南极昆仑站" }, { name: "中国南极泰山站" }] },
    ]
  },
];
