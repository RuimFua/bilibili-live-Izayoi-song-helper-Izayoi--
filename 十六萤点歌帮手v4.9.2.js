// ==UserScript==
// @name         直播点歌小帮手
// @namespace    tabbit.vtuber.helper
// @version      4.9.1
// @description  强制边界锁定、重置位置、歌单筛选、点歌指令分离 (已修复代码规范)。
// @author       User
// @match        *://live.bilibili.com/*
// @run-at       document-end
// @grant        none
// ==/UserScript==

(function () {
    "use strict";

    // --- 1. 房间号权限检测 ---
    const ALLOWED_ROOMS = ["1741667419"];
    const isAllowedRoom = ALLOWED_ROOMS.some(roomId => window.location.href.includes(roomId));
    if (!isAllowedRoom) return;

    // --- 2. 歌单数据 ---
    const SONG_DATA = [
        {"name": "雨爱", "artist": "杨丞琳", "lang": "国语", "style": "流行影视", "freq": 0, "lastTime": "2026-05-25"},
        {"name": "春夏秋冬", "artist": "SNH48", "lang": "国语", "style": "国风流行", "freq": 0, "lastTime": "2026-05-25"},
        {"name": "爱要坦荡荡", "artist": "萧潇", "lang": "国语", "style": "流行", "freq": 0, "lastTime": "2026-05-25"},
        {"name": "夜风无意作情歌", "artist": "恋恋故人难蔡明希（不才）", "lang": "国语", "style": "流行", "freq": 0, "lastTime": "2026-05-25"},
        {"name": "第57次取消发送", "artist": "菲菲公主（陆绮菲）", "lang": "国语", "style": "流行", "freq": 0, "lastTime": "2026-05-25"},
        {"name": "但愿人长久", "artist": "王菲", "lang": "国语", "style": "流行", "freq": 0, "lastTime": "2026-05-25"},
        {"name": "我只在乎你", "artist": "邓丽君", "lang": "国语", "style": "流行", "freq": 0, "lastTime": "2026-05-25"},
        {"name": "体面 (Live)", "artist": "于文文", "lang": "国语", "style": "流行", "freq": 0, "lastTime": "2026-05-25"},
        {"name": "幻彩国", "artist": "Fesall_秋秋", "lang": "国语", "style": "流行", "freq": 0, "lastTime": "2026-05-25"},
        {"name": "下等马", "artist": "ChiliChill乐团", "lang": "国语", "style": "", "freq": 0, "lastTime": "2026-05-25"},
        {"name": "泪桥", "artist": "Kimi29", "lang": "国语", "style": "流行", "freq": 0, "lastTime": "2026-05-25"},
        {"name": "来不及 (Live)", "artist": "刘瑞琦", "lang": "国语", "style": "流行", "freq": 0, "lastTime": "2026-05-25"},
        {"name": "想你时风起", "artist": "单依纯", "lang": "国语", "style": "流行", "freq": 0, "lastTime": "2026-05-25"},
        {"name": "在夜里跳舞", "artist": "单依纯", "lang": "国语", "style": "流行", "freq": 0, "lastTime": "2026-05-25"},
        {"name": "Letting Go", "artist": "蔡健雅", "lang": "国语", "style": "流行", "freq": 0, "lastTime": "2026-05-25"},
        {"name": "折枝花满衣", "artist": "泽典", "lang": "国语", "style": "国风流行", "freq": 0, "lastTime": "2026-05-25"},
        {"name": "轮回之境", "artist": "CRITTY", "lang": "国语", "style": "流行", "freq": 0, "lastTime": "2026-05-25"},
        {"name": "谓风", "artist": "流仙双笙（陈元汐）", "lang": "国语", "style": "国风流行", "freq": 0, "lastTime": "2026-05-25"},
        {"name": "画骨成沙", "artist": "樱九", "lang": "国语", "style": "流行", "freq": 0, "lastTime": "2026-05-25"},
        {"name": "小丑的品格", "artist": "双笙（陈元汐）三无Marblue", "lang": "国语", "style": "流行二次元", "freq": 0, "lastTime": "2026-05-25"},
        {"name": "女孩你为何踮脚尖", "artist": "双笙（陈元汐）", "lang": "国语", "style": "流行", "freq": 0, "lastTime": "2026-05-25"},
        {"name": "我的一个道姑朋友", "artist": "双笙（陈元汐）", "lang": "国语", "style": "流行", "freq": 0, "lastTime": "2026-05-25"},
        {"name": "故梦", "artist": "双笙（陈元汐）", "lang": "国语", "style": "国风流行", "freq": 0, "lastTime": "2026-05-25"},
        {"name": "世末歌者", "artist": "乐正绫COP", "lang": "国语", "style": "二次元歌声合成", "freq": 0, "lastTime": "2026-05-25"},
        {"name": "琴师", "artist": "音频怪物", "lang": "国语", "style": "流行", "freq": 0, "lastTime": "2026-05-25"},
        {"name": "腐草为萤", "artist": "银临", "lang": "国语", "style": "流行", "freq": 0, "lastTime": "2026-05-25"},
        {"name": "长安忆", "artist": "音频怪物", "lang": "国语", "style": "流行", "freq": 0, "lastTime": "2026-05-25"},
        {"name": "牵丝戏", "artist": "银临Aki阿杰", "lang": "国语", "style": "国风戏腔", "freq": 0, "lastTime": "2026-05-25"},
        {"name": "棠梨煎雪", "artist": "银临", "lang": "国语", "style": "流行", "freq": 0, "lastTime": "2026-05-25"},
        {"name": "锦鲤抄", "artist": "银临云の泣", "lang": "国语", "style": "国风", "freq": 0, "lastTime": "2026-05-25"},
        {"name": "晚来天欲雪", "artist": "恋恋故人难云之泣", "lang": "国语", "style": "流行", "freq": 0, "lastTime": "2026-05-25"},
        {"name": "她本身", "artist": "肥皂菌丨珉珉的猫咪丨云之泣王梓钰祖娅纳惜", "lang": "国语", "style": "国风流行", "freq": 0, "lastTime": "2026-05-25"},
        {"name": "妙笔浮生", "artist": "银临", "lang": "国语", "style": "流行", "freq": 0, "lastTime": "2026-05-25"},
        {"name": "只要平凡", "artist": "张杰张碧晨", "lang": "国语", "style": "影视", "freq": 0, "lastTime": "2026-05-25"},
        {"name": "有一种悲伤", "artist": "马也_Crabbit", "lang": "国语", "style": "流行", "freq": 0, "lastTime": "2026-05-25"},
        {"name": "被驯服的象", "artist": "蔡健雅", "lang": "国语", "style": "流行", "freq": 0, "lastTime": "2026-05-25"},
        {"name": "小半", "artist": "陈粒", "lang": "国语", "style": "民谣", "freq": 0, "lastTime": "2026-05-25"},
        {"name": "光年之外", "artist": "G.E.M.邓紫棋", "lang": "国语", "style": "流行", "freq": 0, "lastTime": "2026-05-25"},
        {"name": "夜会", "artist": "王菲", "lang": "国语", "style": "流行", "freq": 0, "lastTime": "2026-05-25"},
        {"name": "吹灭小山河", "artist": "国风堂司南", "lang": "国语", "style": "国风", "freq": 0, "lastTime": "2026-05-25"},
        {"name": "多情种", "artist": "胡杨林", "lang": "国语", "style": "流行", "freq": 0, "lastTime": "2026-05-25"},
        {"name": "海底", "artist": "一支榴莲", "lang": "国语", "style": "流行", "freq": 0, "lastTime": "2026-05-25"},
        {"name": "夭娘", "artist": "司南", "lang": "国语", "style": "流行", "freq": 0, "lastTime": "2026-05-25"},
        {"name": "燕归巢 (Live)", "artist": "张杰张靓颖", "lang": "国语", "style": "流行", "freq": 0, "lastTime": "2026-05-25"},
        {"name": "繁华梦", "artist": "黄龄", "lang": "国语", "style": "", "freq": 0, "lastTime": "2026-05-25"},
        {"name": "画心", "artist": "张靓颖", "lang": "国语", "style": "流行", "freq": 0, "lastTime": "2026-05-25"},
        {"name": "风月", "artist": "黄龄", "lang": "国语", "style": "流行", "freq": 0, "lastTime": "2026-05-25"},
        {"name": "星河叹", "artist": "黄龄关大洲", "lang": "国语", "style": "", "freq": 0, "lastTime": "2026-05-25"},
        {"name": "好逑", "artist": "黄龄", "lang": "国语", "style": "流行", "freq": 0, "lastTime": "2026-05-25"},
        {"name": "禁区", "artist": "黄龄", "lang": "国语", "style": "流行", "freq": 0, "lastTime": "2026-05-25"},
        {"name": "星辰大海", "artist": "黄霄雲", "lang": "国语", "style": "流行", "freq": 0, "lastTime": "2026-05-25"},
        {"name": "大雾", "artist": "张一乔未知音素", "lang": "国语", "style": "流行", "freq": 0, "lastTime": "2026-05-25"},
        {"name": "萱草花", "artist": "张小斐", "lang": "国语", "style": "", "freq": 0, "lastTime": "2026-05-25"},
        {"name": "爱人错过", "artist": "告五人", "lang": "国语", "style": "摇滚", "freq": 0, "lastTime": "2026-05-25"},
        {"name": "唯一", "artist": "告五人", "lang": "国语", "style": "流行", "freq": 0, "lastTime": "2026-05-25"},
        {"name": "给你一瓶魔法药水", "artist": "告五人", "lang": "国语", "style": "流行", "freq": 0, "lastTime": "2026-05-25"},
        {"name": "尘埃", "artist": "王雨桐", "lang": "国语", "style": "", "freq": 0, "lastTime": "2026-05-25"},
        {"name": "传奇", "artist": "王菲", "lang": "国语", "style": "流行", "freq": 0, "lastTime": "2026-05-25"},
        {"name": "世界赠予我的", "artist": "王菲", "lang": "国语", "style": "流行", "freq": 0, "lastTime": "2026-05-25"},
        {"name": "如愿", "artist": "王菲", "lang": "国语", "style": "流行影视", "freq": 0, "lastTime": "2026-05-25"},
        {"name": "人间", "artist": "王菲", "lang": "国语", "style": "流行", "freq": 0, "lastTime": "2026-05-25"},
        {"name": "红豆", "artist": "王菲", "lang": "国语", "style": "流行", "freq": 0, "lastTime": "2026-05-25"},
        {"name": "流年", "artist": "王菲", "lang": "国语", "style": "流行", "freq": 0, "lastTime": "2026-05-25"},
        {"name": "致青春", "artist": "王菲", "lang": "国语", "style": "流行", "freq": 0, "lastTime": "2026-05-25"},
        {"name": "雾里", "artist": "姚六一", "lang": "国语", "style": "流行", "freq": 0, "lastTime": "2026-05-25"},
        {"name": "山海入梦来", "artist": "邹秋实", "lang": "国语", "style": "", "freq": 0, "lastTime": "2026-05-25"},
        {"name": "如果爱忘了", "artist": "Yusee西", "lang": "国语", "style": "流行", "freq": 0, "lastTime": "2026-05-25"},
        {"name": "这世界那么多人", "artist": "莫文蔚", "lang": "国语", "style": "流行影视", "freq": 0, "lastTime": "2026-05-25"},
        {"name": "我用什么把你留住", "artist": "福禄寿FloruitShow", "lang": "国语", "style": "", "freq": 0, "lastTime": "2026-05-25"},
        {"name": "马", "artist": "福禄寿FloruitShow", "lang": "国语", "style": "民谣", "freq": 0, "lastTime": "2026-05-25"},
        {"name": "孟婆", "artist": "国风堂黄诗扶", "lang": "国语", "style": "", "freq": 0, "lastTime": "2026-05-25"},
        {"name": "杨花落尽子规啼", "artist": "祝青（G2er）黄诗扶国风堂", "lang": "国语", "style": "古风", "freq": 0, "lastTime": "2026-05-25"},
        {"name": "九万字", "artist": "黄诗扶", "lang": "国语", "style": "流行", "freq": 0, "lastTime": "2026-05-25"},
        {"name": "前尘卷", "artist": "黄诗扶网易阴阳师手游", "lang": "国语", "style": "国风游戏", "freq": 0, "lastTime": "2026-05-25"},
        {"name": "默", "artist": "那英", "lang": "国语", "style": "流行", "freq": 0, "lastTime": "2026-05-25"},
        {"name": "笼", "artist": "张碧晨", "lang": "国语", "style": "流行影视", "freq": 0, "lastTime": "2026-05-25"},
        {"name": "爱人", "artist": "莉莉周她说 Lily Chou-Chou Lied", "lang": "国语", "style": "电子流行", "freq": 0, "lastTime": "2026-05-25"},
        {"name": "追", "artist": "陈壹千", "lang": "国语", "style": "", "freq": 0, "lastTime": "2026-05-25"},
        {"name": "追光者", "artist": "岑宁儿", "lang": "国语", "style": "流行", "freq": 0, "lastTime": "2026-05-25"},
        {"name": "零摄氏度月色", "artist": "小蓝背心", "lang": "国语", "style": "", "freq": 0, "lastTime": "2026-05-25"},
        {"name": "醒世文章", "artist": "林斜阳嫌弃", "lang": "国语", "style": "流行", "freq": 0, "lastTime": "2026-05-25"},
        {"name": "广寒宫", "artist": "丸子呦", "lang": "国语", "style": "流行", "freq": 0, "lastTime": "2026-05-25"},
        {"name": "风月令", "artist": "IRiS七叶", "lang": "国语", "style": "国风戏腔", "freq": 0, "lastTime": "2026-05-25"},
        {"name": "嘉宾", "artist": "路飞文", "lang": "国语", "style": "流行", "freq": 0, "lastTime": "2026-05-25"},
        {"name": "星月神话", "artist": "金莎", "lang": "国语", "style": "流行", "freq": 0, "lastTime": "2026-05-25"},
        {"name": "爱的魔法", "artist": "金莎", "lang": "国语", "style": "流行", "freq": 0, "lastTime": "2026-05-25"},
        {"name": "猪之歌", "artist": "香香", "lang": "国语", "style": "流行", "freq": 0, "lastTime": "2026-05-25"},
        {"name": "Virtual to LIVE", "artist": "VirtuaReal", "lang": "国语", "style": "流行", "freq": 0, "lastTime": "2026-05-25"},
        {"name": "体面", "artist": "于文文", "lang": "国语", "style": "流行", "freq": 0, "lastTime": "2026-05-25"},
        {"name": "大东北我的家乡 (DJ何鹏版)", "artist": "何玉", "lang": "国语", "style": "流行电子", "freq": 0, "lastTime": "2026-05-25"},
        {"name": "爱的供养", "artist": "杨幂", "lang": "国语", "style": "流行", "freq": 0, "lastTime": "2026-05-25"},
        {"name": "异想记", "artist": "杨幂", "lang": "国语", "style": "", "freq": 0, "lastTime": "2026-05-25"},
        {"name": "三拜红尘凉", "artist": "尹昔眠", "lang": "国语", "style": "流行", "freq": 0, "lastTime": "2026-05-25"},
        {"name": "笼", "artist": "张碧晨", "lang": "国语", "style": "影视流行", "freq": 0, "lastTime": "2026-05-25"},
        {"name": "年轮", "artist": "张碧晨", "lang": "国语", "style": "流行", "freq": 0, "lastTime": "2026-05-25"},
        {"name": "背对背拥抱", "artist": "林俊杰", "lang": "国语", "style": "流行影视", "freq": 0, "lastTime": "2026-05-25"},
        {"name": "美人鱼", "artist": "林俊杰", "lang": "国语", "style": "流行", "freq": 0, "lastTime": "2026-05-25"},
        {"name": "当你", "artist": "林俊杰", "lang": "国语", "style": "流行", "freq": 0, "lastTime": "2026-05-25"},
        {"name": "修炼爱情", "artist": "林俊杰", "lang": "国语", "style": "流行", "freq": 0, "lastTime": "2026-05-25"},
        {"name": "江南", "artist": "林俊杰", "lang": "国语", "style": "流行", "freq": 0, "lastTime": "2026-05-25"},
        {"name": "一千年以后", "artist": "林俊杰", "lang": "国语", "style": "流行", "freq": 0, "lastTime": "2026-05-25"},
        {"name": "小酒窝", "artist": "林俊杰蔡卓妍", "lang": "国语", "style": "流行", "freq": 0, "lastTime": "2026-05-25"},
        {"name": "娃娃脸", "artist": "后弦", "lang": "国语", "style": "流行", "freq": 0, "lastTime": "2026-05-25"},
        {"name": "坏女孩", "artist": "徐良小凌", "lang": "国语", "style": "流行", "freq": 0, "lastTime": "2026-05-25"},
        {"name": "后会无期", "artist": "汪苏泷徐良", "lang": "国语", "style": "流行", "freq": 0, "lastTime": "2026-05-25"},
        {"name": "七秒钟的记忆", "artist": "徐良孙羽幽", "lang": "国语", "style": "流行", "freq": 0, "lastTime": "2026-05-25"},
        {"name": "客官不可以", "artist": "徐良小凌", "lang": "国语", "style": "流行", "freq": 0, "lastTime": "2026-05-25"},
        {"name": "犯贱", "artist": "徐良阿悄", "lang": "国语", "style": "流行", "freq": 0, "lastTime": "2026-05-25"},
        {"name": "红装", "artist": "徐良阿悄", "lang": "国语", "style": "流行", "freq": 0, "lastTime": "2026-05-25"},
        {"name": "情话", "artist": "徐良孙羽幽", "lang": "国语", "style": "流行", "freq": 0, "lastTime": "2026-05-25"},
        {"name": "虐心", "artist": "徐良孙羽幽", "lang": "国语", "style": "", "freq": 0, "lastTime": "2026-05-25"},
        {"name": "他的猫", "artist": "徐良杨曦", "lang": "国语", "style": "流行", "freq": 0, "lastTime": "2026-05-25"},
        {"name": "有点甜", "artist": "汪苏泷BY2", "lang": "国语", "style": "流行", "freq": 0, "lastTime": "2026-05-25"},
        {"name": "一笑倾城", "artist": "汪苏泷", "lang": "国语", "style": "影视", "freq": 0, "lastTime": "2026-05-25"},
        {"name": "不分手的恋爱", "artist": "汪苏泷", "lang": "国语", "style": "流行", "freq": 0, "lastTime": "2026-05-25"},
        {"name": "小星星", "artist": "汪苏泷", "lang": "国语", "style": "流行", "freq": 0, "lastTime": "2026-05-25"},
        {"name": "万有引力", "artist": "汪苏泷", "lang": "国语", "style": "流行", "freq": 0, "lastTime": "2026-05-25"},
        {"name": "风度", "artist": "汪苏泷", "lang": "国语", "style": "流行", "freq": 0, "lastTime": "2026-05-25"},
        {"name": "巴赫旧约", "artist": "汪苏泷", "lang": "国语", "style": "流行", "freq": 0, "lastTime": "2026-05-25"},
        {"name": "三国杀", "artist": "汪苏泷", "lang": "国语", "style": "流行", "freq": 0, "lastTime": "2026-05-25"},
        {"name": "亲爱的，那不是爱情 (Live)", "artist": "汪苏泷张碧晨", "lang": "国语", "style": "", "freq": 0, "lastTime": "2026-05-25"},
        {"name": "素颜", "artist": "许嵩何曼婷", "lang": "国语", "style": "流行", "freq": 0, "lastTime": "2026-05-25"},
        {"name": "玫瑰花的葬礼", "artist": "许嵩", "lang": "国语", "style": "流行", "freq": 0, "lastTime": "2026-05-25"},
        {"name": "断桥残雪", "artist": "许嵩", "lang": "国语", "style": "流行", "freq": 0, "lastTime": "2026-05-25"},
        {"name": "情花", "artist": "本兮", "lang": "国语", "style": "流行", "freq": 0, "lastTime": "2026-05-25"},
        {"name": "某个心跳", "artist": "本兮", "lang": "国语", "style": "流行", "freq": 0, "lastTime": "2026-05-25"},
        {"name": "自作多情", "artist": "本兮", "lang": "国语", "style": "流行", "freq": 0, "lastTime": "2026-05-25"},
        {"name": "告诉自己忘了他", "artist": "本兮", "lang": "国语", "style": "流行", "freq": 0, "lastTime": "2026-05-25"},
        {"name": "无语", "artist": "本兮", "lang": "国语", "style": "流行", "freq": 0, "lastTime": "2026-05-25"},
        {"name": "情歌悠扬", "artist": "本兮", "lang": "国语", "style": "流行", "freq": 0, "lastTime": "2026-05-25"},
        {"name": "情人节的夜晚", "artist": "本兮小贱", "lang": "国语", "style": "流行", "freq": 0, "lastTime": "2026-05-25"},
        {"name": "会不会", "artist": "本兮", "lang": "国语", "style": "流行", "freq": 0, "lastTime": "2026-05-25"},
        {"name": "一厘米之外", "artist": "本兮", "lang": "国语", "style": "流行", "freq": 0, "lastTime": "2026-05-25"},
        {"name": "白色", "artist": "本兮", "lang": "国语", "style": "流行", "freq": 0, "lastTime": "2026-05-25"},
        {"name": "隐形的翅膀", "artist": "张韶涵", "lang": "国语", "style": "流行", "freq": 0, "lastTime": "2026-05-25"},
        {"name": "QQ爱 (2025版)", "artist": "孙辉蓝若兮", "lang": "国语", "style": "流行", "freq": 0, "lastTime": "2026-05-25"},
        {"name": "伤不起", "artist": "王麟老猫", "lang": "国语", "style": "流行", "freq": 0, "lastTime": "2026-05-25"},
        {"name": "贝多芬的忧伤", "artist": "格子兮", "lang": "国语", "style": "流行", "freq": 0, "lastTime": "2026-05-25"},
        {"name": "月亮代表我的心", "artist": "邓丽君", "lang": "国语", "style": "流行", "freq": 0, "lastTime": "2026-05-25"},
        {"name": "甜蜜蜜", "artist": "邓丽君", "lang": "国语", "style": "流行", "freq": 0, "lastTime": "2026-05-25"},
        {"name": "小城故事", "artist": "邓丽君", "lang": "国语", "style": "流行", "freq": 0, "lastTime": "2026-05-25"},
        {"name": "半城烟沙", "artist": "许嵩", "lang": "国语", "style": "流行", "freq": 0, "lastTime": "2026-05-25"},
        {"name": "桃花诺", "artist": "G.E.M. 邓紫棋", "lang": "国语", "style": "影视", "freq": 0, "lastTime": "2026-05-25"},
        {"name": "喜欢你", "artist": "陈洁仪", "lang": "国语", "style": "流行", "freq": 0, "lastTime": "2026-05-25"},
        {"name": "心上秋", "artist": "忘川风华录星尘", "lang": "国语", "style": "流行", "freq": 0, "lastTime": "2026-05-25"},
        {"name": "红色高跟鞋", "artist": "蔡健雅", "lang": "国语", "style": "流行", "freq": 0, "lastTime": "2026-05-25"},
        {"name": "天空之城", "artist": "樊竹青", "lang": "国语", "style": "流行", "freq": 0, "lastTime": "2026-05-25"},
        {"name": "三寸天堂", "artist": "严艺丹", "lang": "国语", "style": "流行", "freq": 0, "lastTime": "2026-05-25"},
        {"name": "星之所在", "artist": "泠鸢yousa", "lang": "国语", "style": "流行", "freq": 0, "lastTime": "2026-05-25"},
        {"name": "安娜的橱窗", "artist": "封茗囧菌", "lang": "国语", "style": "二次元", "freq": 0, "lastTime": "2026-05-25"},
        {"name": "童话镇", "artist": "暗杠", "lang": "国语", "style": "流行", "freq": 0, "lastTime": "2026-05-25"},
        {"name": "弄舌(女声版)", "artist": "拂言", "lang": "国语", "style": "流行", "freq": 0, "lastTime": "2026-05-25"},
        {"name": "偏偏要", "artist": "庄东茹（豆芽鱼）", "lang": "国语", "style": "流行", "freq": 0, "lastTime": "2026-05-25"},
        {"name": "蝙蝠", "artist": "庆庆", "lang": "国语", "style": "流行", "freq": 0, "lastTime": "2026-05-25"},
        {"name": "不谓侠", "artist": "萧忆情Alex", "lang": "国语", "style": "流行", "freq": 0, "lastTime": "2026-05-25"},
        {"name": "走马", "artist": "陈粒", "lang": "国语", "style": "民谣", "freq": 0, "lastTime": "2026-05-25"},
        {"name": "奇妙能力歌", "artist": "陈粒", "lang": "国语", "style": "民谣", "freq": 0, "lastTime": "2026-05-25"},
        {"name": "易燃易爆炸", "artist": "陈粒", "lang": "国语", "style": "民谣", "freq": 0, "lastTime": "2026-05-25"},
        {"name": "世界正中", "artist": "陈粒", "lang": "国语", "style": "", "freq": 0, "lastTime": "2026-05-25"},
        {"name": "天亮以前说再见", "artist": "曲肖冰", "lang": "国语", "style": "流行", "freq": 0, "lastTime": "2026-05-25"},
        {"name": "最初的梦想", "artist": "范玮琪", "lang": "国语", "style": "流行", "freq": 0, "lastTime": "2026-05-25"},
        {"name": "勾指起誓", "artist": "洛天依Officialilem", "lang": "国语", "style": "二次元歌声合成", "freq": 0, "lastTime": "2026-05-25"},
        {"name": "时间煮雨", "artist": "郁可唯", "lang": "国语", "style": "影视流行", "freq": 0, "lastTime": "2026-05-25"},
        {"name": "日不落", "artist": "蔡依林", "lang": "国语", "style": "流行", "freq": 0, "lastTime": "2026-05-25"},
        {"name": "没有情人的情人节", "artist": "孟庭苇", "lang": "国语", "style": "流行", "freq": 0, "lastTime": "2026-05-25"},
        {"name": "告白气球", "artist": "周杰伦", "lang": "国语", "style": "节奏布鲁斯", "freq": 0, "lastTime": "2026-05-25"},
        {"name": "稻香", "artist": "周杰伦", "lang": "国语", "style": "流行", "freq": 0, "lastTime": "2026-05-25"},
        {"name": "勇敢爱", "artist": "夕凪mio浅水梨什", "lang": "国语", "style": "流行", "freq": 0, "lastTime": "2026-05-25"},
        {"name": "我们的歌", "artist": "刘大拿", "lang": "国语", "style": "", "freq": 0, "lastTime": "2026-05-25"},
        {"name": "人间烟火", "artist": "程响", "lang": "国语", "style": "流行", "freq": 0, "lastTime": "2026-05-25"},
        {"name": "在意识里过一生", "artist": "张婉清", "lang": "国语", "style": "流行", "freq": 0, "lastTime": "2026-05-25"},
        {"name": "月光", "artist": "胡彦斌", "lang": "国语", "style": "流行", "freq": 0, "lastTime": "2026-05-25"},
        {"name": "眉南边", "artist": "银临", "lang": "国语", "style": "古风", "freq": 0, "lastTime": "2026-05-25"},
        {"name": "像鱼", "artist": "王贰浪", "lang": "国语", "style": "流行", "freq": 0, "lastTime": "2026-05-25"},
        {"name": "葬仙-记狠人大帝", "artist": "叶里苑舍", "lang": "国语", "style": "", "freq": 0, "lastTime": "2026-05-25"},
        {"name": "忽如远行客", "artist": "云之泣", "lang": "国语", "style": "流行", "freq": 0, "lastTime": "2026-05-25"},
        {"name": "奢香夫人", "artist": "凤凰传奇", "lang": "国语", "style": "流行", "freq": 0, "lastTime": "2026-05-25"},
        {"name": "最炫民族风", "artist": "凤凰传奇", "lang": "国语", "style": "流行", "freq": 0, "lastTime": "2026-05-25"},
        {"name": "荷塘月色", "artist": "凤凰传奇", "lang": "国语", "style": "流行", "freq": 0, "lastTime": "2026-05-25"},
        {"name": "自由飞翔", "artist": "凤凰传奇", "lang": "国语", "style": "流行", "freq": 0, "lastTime": "2026-05-25"},
        {"name": "郎的诱惑", "artist": "凤凰传奇", "lang": "国语", "style": "流行", "freq": 0, "lastTime": "2026-05-25"},
        {"name": "月亮之上", "artist": "凤凰传奇", "lang": "国语", "style": "流行", "freq": 0, "lastTime": "2026-05-25"},
        {"name": "等爱的玫瑰", "artist": "凤凰传奇", "lang": "国语", "style": "流行", "freq": 0, "lastTime": "2026-05-25"},
        {"name": "我从草原来", "artist": "凤凰传奇", "lang": "国语", "style": "流行", "freq": 0, "lastTime": "2026-05-25"},
        {"name": "天蓝蓝", "artist": "凤凰传奇", "lang": "国语", "style": "流行", "freq": 0, "lastTime": "2026-05-25"},
        {"name": "今天你要嫁给我", "artist": "陶喆蔡依林", "lang": "国语", "style": "流行", "freq": 0, "lastTime": "2026-05-25"},
        {"name": "我的心好冷", "artist": "SARA", "lang": "国语", "style": "流行", "freq": 0, "lastTime": "2026-05-25"},
        {"name": "演员", "artist": "薛之谦", "lang": "国语", "style": "流行", "freq": 0, "lastTime": "2026-05-25"},
        {"name": "说散就散", "artist": "袁娅维TIA RAY", "lang": "国语", "style": "影视", "freq": 0, "lastTime": "2026-05-25"},
        {"name": "房间", "artist": "刘瑞琦", "lang": "国语", "style": "流行", "freq": 0, "lastTime": "2026-05-25"},
        {"name": "樱花草", "artist": "Sweety", "lang": "国语", "style": "流行影视", "freq": 0, "lastTime": "2026-05-25"},
        {"name": "红尘情歌", "artist": "高安黑鸭子演唱组", "lang": "国语", "style": "流行", "freq": 0, "lastTime": "2026-05-25"},
        {"name": "匆匆那年", "artist": "王菲", "lang": "国语", "style": "流行", "freq": 0, "lastTime": "2026-05-25"},
        {"name": "情深深雨濛濛 (Live)", "artist": "翟潇闻", "lang": "国语", "style": "流行", "freq": 0, "lastTime": "2026-05-25"},
        {"name": "永不失联的爱", "artist": "Eric周兴哲", "lang": "国语", "style": "", "freq": 0, "lastTime": "2026-05-25"},
        {"name": "空は高く風は歌う", "artist": "春奈るな", "lang": "日语", "style": "二次元动画流行", "freq": 0, "lastTime": "2026-05-25"},
        {"name": "You", "artist": "雪野五月", "lang": "日语", "style": "影视", "freq": 0, "lastTime": "2026-05-25"},
        {"name": "活动小丑", "artist": "夏九鸢", "lang": "日语", "style": "流行", "freq": 0, "lastTime": "2026-05-25"},
        {"name": "食虫植物", "artist": "理芽", "lang": "日语", "style": "流行", "freq": 0, "lastTime": "2026-05-25"},
        {"name": "嘘月", "artist": "CorLeonis", "lang": "日语", "style": "流行", "freq": 0, "lastTime": "2026-05-25"},
        {"name": "YELLOW", "artist": "神山羊", "lang": "日语", "style": "流行", "freq": 0, "lastTime": "2026-05-25"},
        {"name": "プロポーズ", "artist": "なとり", "lang": "日语", "style": "流行", "freq": 0, "lastTime": "2026-05-25"},
        {"name": "言って。", "artist": "ヨルシカ", "lang": "日语", "style": "流行", "freq": 0, "lastTime": "2026-05-25"},
        {"name": "素顔 -KARAOKE MIX-", "artist": "月宮みどり", "lang": "日语", "style": "", "freq": 0, "lastTime": "2026-05-25"},
        {"name": "懺悔録", "artist": "黒木渚", "lang": "日语", "style": "游戏", "freq": 0, "lastTime": "2026-05-25"},
        {"name": "Euterpe (エウテルペ/欧忒耳佩)", "artist": "EGOIST", "lang": "日语", "style": "流行", "freq": 0, "lastTime": "2026-05-25"},
        {"name": "ロミオとシンデレラ", "artist": "花たん", "lang": "日语", "style": "流行", "freq": 0, "lastTime": "2026-05-25"},
        {"name": "シリウスの心臓", "artist": "ヰ世界情緒", "lang": "日语", "style": "流行", "freq": 0, "lastTime": "2026-05-25"},
        {"name": "Every Heart-ミンナノキモチ-", "artist": "BoA", "lang": "日语", "style": "二次元动画流行", "freq": 0, "lastTime": "2026-05-25"},
        {"name": "ドライフラワー (干花)", "artist": "Ado", "lang": "日语", "style": "流行", "freq": 0, "lastTime": "2026-05-25"},
        {"name": "可愛くてごめん (这么可爱真是抱歉)", "artist": "HoneyWorks早見沙織", "lang": "日语", "style": "二次元", "freq": 0, "lastTime": "2026-05-25"},
        {"name": "Bad Apple!! (feat.nomico)", "artist": "Alstroemeria Records", "lang": "日语", "style": "二次元电子流行", "freq": 0, "lastTime": "2026-05-25"},
        {"name": "庭園にて。 (在庭院中)", "artist": "acane_madder", "lang": "日语", "style": "流行", "freq": 0, "lastTime": "2026-05-25"},
        {"name": "夜明けと蛍 (拂晓与萤火虫)", "artist": "n-buna", "lang": "日语", "style": "二次元歌声合成", "freq": 0, "lastTime": "2026-05-25"},
        {"name": "酔いどれ知らず (不知醉)", "artist": "KanariaGUMI", "lang": "日语", "style": "二次元歌声合成", "freq": 0, "lastTime": "2026-05-25"},
        {"name": "ダーリン", "artist": "須田景凪", "lang": "日语", "style": "流行", "freq": 0, "lastTime": "2026-05-25"},
        {"name": "なぜ？謎？！ANSWER (WHY?MYSTERY?!ANSWER)(TV Version)", "artist": "熊田茜音増井優花", "lang": "日语", "style": "", "freq": 0, "lastTime": "2026-05-25"},
        {"name": "蜜月Un·Deux·Trois", "artist": "Nanaka", "lang": "日语", "style": "二次元", "freq": 0, "lastTime": "2026-05-25"},
        {"name": "からくりピエロ", "artist": "40mP初音ミク", "lang": "日语", "style": "二次元歌声合成", "freq": 0, "lastTime": "2026-05-25"},
        {"name": "残酷な天使のテーゼ (残酷天使的行动纲领)", "artist": "高橋洋子", "lang": "日语", "style": "二次元动画", "freq": 0, "lastTime": "2026-05-25"},
        {"name": "モエチャッカファイア (萌萌点火Fire)", "artist": "弌誠", "lang": "日语", "style": "二次元游戏流行", "freq": 0, "lastTime": "2026-05-25"},
        {"name": "死別", "artist": "シャノンGUMI", "lang": "日语", "style": "二次元歌声合成", "freq": 0, "lastTime": "2026-05-25"},
        {"name": "小さな恋のうた (小小恋歌)", "artist": "Aragaki Yui (新垣結衣)", "lang": "日语", "style": "流行", "freq": 0, "lastTime": "2026-05-25"},
        {"name": "LOVE 2000", "artist": "遠野ひかる", "lang": "日语", "style": "影视", "freq": 0, "lastTime": "2026-05-25"},
        {"name": "MASAYUME CHASING", "artist": "BoA", "lang": "日语", "style": "流行", "freq": 0, "lastTime": "2026-05-25"},
        {"name": "Lemon", "artist": "米津玄師", "lang": "日语", "style": "流行", "freq": 0, "lastTime": "2026-05-25"},
        {"name": "偏食", "artist": "香椎モイミ初音ミク", "lang": "日语", "style": "流行", "freq": 0, "lastTime": "2026-05-25"},
        {"name": "永夜のパレード (永夜的游行)", "artist": "ケーキ姫JUMA", "lang": "日语", "style": "流行", "freq": 0, "lastTime": "2026-05-25"},
        {"name": "踊り子", "artist": "Vaundy", "lang": "日语", "style": "流行", "freq": 0, "lastTime": "2026-05-25"},
        {"name": "たいせつなきみのために、ぼくにできるいちばんのこと (为了最重要的你，我所能做的最好的事)", "artist": "Duca", "lang": "日语", "style": "二次元游戏", "freq": 0, "lastTime": "2026-05-25"},
        {"name": "Six Feet Under", "artist": "Billie Eilish", "lang": "英语", "style": "", "freq": 0, "lastTime": "2026-05-25"},
        {"name": "everytime you kissed me", "artist": "Emily Bindiger", "lang": "英语", "style": "二次元动画", "freq": 0, "lastTime": "2026-05-25"},
        {"name": "Safe & Sound", "artist": "Taylor SwiftThe Civil Wars", "lang": "英语", "style": "影视乡村民谣", "freq": 0, "lastTime": "2026-05-25"},
        {"name": "Living Hell", "artist": "Bella Poarch", "lang": "英语", "style": "流行", "freq": 0, "lastTime": "2026-05-25"},
        {"name": "Chasers", "artist": "Bahari", "lang": "英语", "style": "流行", "freq": 0, "lastTime": "2026-05-25"}
    ];

    const REFERENCE_CALLS = ["\\十六萤/", "\\米米/", "开口跪！", "神仙音色", "吃CD长大的吧", "全体起立！", "前方高能", "注入灵魂", "太温柔了", "破防了", "88888888"];

    let searchText = "";
    let langFilter = "全部";
    const STORAGE_KEY = "bili_helper_call_words_" + (window.location.pathname.replace('/', '') || "default");
    let callWords = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]'); 

    // --- 3. 核心功能 ---
    window.sendDanmaku = function(text, autoSend = true, isAppend = false) {
        const input = document.querySelector('textarea.chat-input') || document.querySelector('div[contenteditable="true"]');
        if (!input) { alert("请确认聊天框已加载"); return; }
        let newText = isAppend ? (input.innerText || input.value) + text : text;
        if (input.tagName === 'TEXTAREA') {
            const nativeSetter = Object.getOwnPropertyDescriptor(window.HTMLTextAreaElement.prototype, "value").set;
            nativeSetter.call(input, newText);
        } else { input.innerText = newText; }
        input.dispatchEvent(new Event('input', { bubbles: true }));
        if (autoSend) {
            setTimeout(() => {
                const sendBtn = document.querySelector('.bl-button--primary') || document.querySelector('.send-btn');
                if (sendBtn && !sendBtn.disabled) sendBtn.click();
            }, 200);
        }
    };

    // --- 4. 渲染 ---
    function renderSongList() {
        const container = document.getElementById('helper-song-list');
        if (!container) return;
        const filtered = SONG_DATA.filter(s => s.name.toLowerCase().includes(searchText) && (langFilter === "全部" || (langFilter === "中文" ? s.lang.includes("国语") : s.lang.includes(langFilter))));
        container.innerHTML = filtered.map(song => `
            <div style="padding:8px 5px; border-bottom:1px solid #f0f0f0; display:flex; justify-content:space-between; align-items:center;">
                <div style="flex:1; overflow:hidden;"><div style="font-size:13px; font-weight:bold; color:#333;">${song.name}</div><div style="font-size:11px; color:#888;">${song.artist}</div></div>
                <div style="display:flex; gap:4px; flex-shrink:0;">
                    <button class="mini-btn" style="background:#f5f5f5; color:#555;" onclick="window.sendDanmaku('点歌 ${song.name}', false, false)">填入</button>
                    <button class="mini-btn" style="background:#00aeec; color:#fff;" onclick="window.sendDanmaku('点歌 ${song.name}', true, false)">发送</button>
                </div>
            </div>
        `).join('');
    }

    function renderCallWords() {
        const container = document.getElementById('helper-call-list');
        if (!container) return;
        container.innerHTML = callWords.map((word, idx) => `<button class="call-tag" data-idx="${idx}">${word}</button>`).join('');
        container.querySelectorAll('.call-tag').forEach(btn => {
            btn.onclick = (e) => { window.sendDanmaku(e.target.innerText, false, true); };
            btn.oncontextmenu = (e) => { e.preventDefault(); callWords.splice(e.target.dataset.idx, 1); localStorage.setItem(STORAGE_KEY, JSON.stringify(callWords)); renderCallWords(); };
        });
    }

    // --- 5. UI构建 ---
    function injectUI() {
        if (document.getElementById("bili-song-helper")) return;
        const style = document.createElement('style');
        style.innerHTML = `
            #bili-song-helper { position:fixed; right:20px; bottom:80px; width:340px; height:500px; background:#ffffff; z-index:999999; border-radius:12px; border:1px solid #ddd; box-shadow:0 4px 15px rgba(0,0,0,0.1); display:flex; flex-direction:column; user-select:none; font-family:sans-serif; min-width:280px; min-height:300px; }
            .helper-header { padding:12px; background:#fafafa; border-bottom:1px solid #eee; border-radius:12px 12px 0 0; cursor:move; font-weight:bold; font-size:14px; flex-shrink:0; display:flex; justify-content:space-between; align-items:center; }
            .helper-body { padding:10px; display:flex; flex-direction:column; flex:1; overflow:hidden; }
            .helper-input { background:#fff; border:1px solid #ddd; border-radius:6px; padding:6px 8px; font-size:12px; }
            .mini-btn { border:none; border-radius:4px; padding:4px 8px; font-size:12px; cursor:pointer; }
            #helper-song-list { flex:1; overflow-y:auto; border:1px solid #eee; border-radius:6px; background:#fafafa; margin:5px 0; }
            .call-tag { padding:4px 10px; border-radius:12px; font-size:12px; background:#e6f7ff; color:#0050b3; border:1px solid #91d5ff; cursor:pointer; margin-bottom:5px; }
            .ref-tag { background:#f5f5f5; color:#555; border:1px solid #ddd; padding:2px 6px; border-radius:12px; font-size:11px; cursor:pointer; margin:2px; }
            #helper-resize { position:absolute; right:0; bottom:0; width:15px; height:15px; cursor:nwse-resize; background:linear-gradient(135deg, transparent 50%, #ccc 50%); border-radius:0 0 12px 0; }
        `;
        document.head.appendChild(style);

        const container = document.createElement("div");
        container.id = "bili-song-helper";
        container.innerHTML = `
            <div class="helper-header">
                <span>🎤 直播点歌小帮手</span>
                <div>
                    <span id="helper-reset" style="cursor:pointer; margin-right:8px; color:#555;" title="重置位置">↺</span>
                    <span id="helper-close" style="cursor:pointer; color:#999;" title="关闭">✖</span>
                </div>
            </div>
            <div class="helper-body">
                <div style="display:flex; gap:5px; margin-bottom:5px;">
                    <input type="text" id="helper-search" class="helper-input" style="flex:1;" placeholder="搜索歌名...">
                    <select id="helper-lang" class="helper-input"><option value="全部">全部</option><option value="中文">中文</option><option value="日语">日语</option><option value="英语">英语</option><option value="粤语">粤语</option></select>
                </div>
                <div id="helper-song-list"></div>
                <div style="flex-shrink:0;">
                    <div style="font-size:12px; color:#888; margin:5px 0;">自定义预设</div>
                    <div style="display:flex; gap:5px; margin-bottom:5px;">
                        <input type="text" id="helper-call-input" class="helper-input" style="flex:1;" placeholder="预设词...">
                        <button id="helper-call-save" class="mini-btn" style="background:#00aeec; color:#fff;">保存</button>
                        <button id="helper-toggle-ref" class="mini-btn" style="background:#eee;">+</button>
                    </div>
                    <div id="helper-ref-panel" style="display:none; flex-wrap:wrap; margin-bottom:5px;">${REFERENCE_CALLS.map(w => `<button class="ref-tag" onclick="window.sendDanmaku('${w}', false, true)">${w}</button>`).join('')}</div>
                    <div id="helper-call-list" style="display:flex; flex-wrap:wrap; gap:5px;"></div>
                </div>
            </div>
            <div id="helper-resize"></div>
        `;
        document.body.appendChild(container);

        // --- 逻辑绑定 (已修复 ESLint 规范) ---
        document.getElementById('helper-close').onclick = () => { container.style.display = 'none'; };
        document.getElementById('helper-reset').onclick = () => { 
            container.style.top = 'auto'; 
            container.style.left = 'auto'; 
            container.style.right = '20px'; 
            container.style.bottom = '80px'; 
            container.style.width = '340px'; 
            container.style.height = '500px'; 
        };
        document.getElementById('helper-toggle-ref').onclick = () => { 
            const p = document.getElementById('helper-ref-panel'); 
            p.style.display = p.style.display === 'none' ? 'flex' : 'none'; 
        };
        document.getElementById('helper-call-save').onclick = () => { 
            const i = document.getElementById('helper-call-input'); 
            if(i.value) { callWords.push(i.value); localStorage.setItem(STORAGE_KEY, JSON.stringify(callWords)); renderCallWords(); i.value=''; } 
        };
        document.getElementById('helper-search').oninput = (e) => { searchText = e.target.value.toLowerCase(); renderSongList(); };
        document.getElementById('helper-lang').onchange = (e) => { langFilter = e.target.value; renderSongList(); };

        // 拖拽+边界锁定
        container.querySelector('.helper-header').onmousedown = (e) => {
            if (e.target.id === 'helper-close' || e.target.id === 'helper-reset') return;
            let sx = e.clientX - container.offsetLeft, sy = e.clientY - container.offsetTop;
            const move = (e) => {
                let x = Math.max(0, Math.min(e.clientX - sx, window.innerWidth - container.offsetWidth));
                let y = Math.max(0, Math.min(e.clientY - sy, window.innerHeight - container.offsetHeight));
                container.style.left = x + 'px'; container.style.top = y + 'px';
                container.style.right = 'auto'; container.style.bottom = 'auto';
            };
            document.addEventListener('mousemove', move);
            document.onmouseup = () => { document.removeEventListener('mousemove', move); };
        };

        // 缩放+边界锁定
        container.querySelector('#helper-resize').onmousedown = (e) => {
            e.stopPropagation();
            let startW = container.offsetWidth, startH = container.offsetHeight, startX = e.clientX, startY = e.clientY;
            const resize = (e) => {
                container.style.width = Math.min(Math.max(250, startW + e.clientX - startX), window.innerWidth - container.offsetLeft) + 'px';
                container.style.height = Math.min(Math.max(300, startH + e.clientY - startY), window.innerHeight - container.offsetTop) + 'px';
            };
            document.addEventListener('mousemove', resize);
            document.onmouseup = () => { document.removeEventListener('mousemove', resize); };
        };

        renderSongList(); renderCallWords();
    }
    setTimeout(injectUI, 2000);
})();