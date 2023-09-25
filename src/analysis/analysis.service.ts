import { Injectable } from '@nestjs/common';
import axios from 'axios';
import * as convert from 'xml-js';
import * as cheerio from 'cheerio';

@Injectable()
export class AnalysisService {
  async parseRssList(url: string) {
    const res: any = await axios({
      method: 'get',
      url,
      headers: {
        'Content-Type': 'application/xml',
      },
    });

    const resJson = JSON.parse(
      convert.xml2json(res.data, { compact: true, spaces: 4 }),
    );
    const list = [];
    if (!resJson.feed || !resJson.feed.entry) return [];
    resJson.feed.entry.forEach((item) => {
      if (!!item.category) {
        const tempItem: Record<string, any> = {};
        tempItem.title = item.title._text;
        tempItem.link = item.link._attributes.href;
        tempItem.id = item.id._text;
        tempItem.published = new Date(item.published._text).toLocaleString();
        tempItem.updated = new Date(item.updated._text).toLocaleString();
        list.push(tempItem);
      }
    });
    return list;
  }

  async parseHtml(url: string) {
    const res: any = await axios({
      method: 'get',
      url,
      headers: {
        'Content-Type': 'application/html',
      },
    });
    const htmlCtx = cheerio.load(res.data);
    // 最后更新时间
    const updated = htmlCtx('.post-meta time').text();

    // 每个番剧的基本信息
    const htmlList = [];
    htmlCtx('article table').each((index, el) => {
      htmlList.push(htmlCtx(el).html());
    });
    // 每个番剧的图片信息
    const imgList = [];
    htmlCtx('img[referrerpolicy]').each((index, el) => {
      imgList.push(htmlCtx(el).attr('src'));
    });
    const mixList = htmlList.map((item, index) => {
      return {
        table: item,
        cover: imgList[index],
      };
    });
    return {
      updated,
      list: mixList,
    };
  }
}
