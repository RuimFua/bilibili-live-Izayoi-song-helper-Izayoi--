const fs = require('fs');
const cheerio = require('cheerio');

function getSongs() {
  try {
    const data = fs.readFileSync('16y.html', 'utf-8');
    const $ = cheerio.load(data);
    const songList = [];

    // 找到所有的行
    const trs = $('.v-data-table__tr--clickable');
    console.log('一共找到了 ' + trs.length + ' 行数据，开始提取...');

    trs.each((i, el) => {
      const cells = $(el).find('td');
      
      // cells.eq(0) 是封面图，我们从 eq(1) 开始找
      // 歌名在 eq(1) 的 div 里
      // 歌手在 eq(2) 的 div 里
      // 语言在 eq(3) 的 div 里
      
      const songInfo = {
        name: cells.eq(1).find('div').text().trim(), 
        artist: cells.eq(2).find('div').text().trim(),
        lang: cells.eq(3).find('div').text().trim(),
        style: cells.eq(4).find('.v-chip__content').text().trim(), // 曲风在 chip 里
        freq: 0,
        lastTime: "2026-05-25"
      };

      // 只有当歌名不为空时，才存入
      if (songInfo.name) {
        songList.push(songInfo);
      } else {
        console.log('第 ' + (i+1) + ' 行没抓到歌名，跳过');
      }
    });

    return songList;
  } catch (error) {
    console.error('出错了：', error.message);
    return [];
  }
}

const result = getSongs();
fs.writeFileSync('songs.json', JSON.stringify(result, null, 2));
console.log('成功！抓取了 ' + result.length + ' 首歌，已保存至 songs.json');