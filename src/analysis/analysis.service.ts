import { Injectable } from '@nestjs/common';
import axios from 'axios';
import * as convert from 'xml-js';
import * as cheerio from 'cheerio';
import { Anime } from './anime.entitiy';
import { writeFile } from 'fs';
import { join, parse } from 'path';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { createHash } from 'crypto';
import * as Catbox from 'catbox.moe';

@Injectable()
export class AnalysisService {
  constructor(
    @InjectRepository(Anime)
    private readonly animeRepository: Repository<Anime>,
  ) {}

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

  async carete(url: string) {
    let res: any = null;
    try {
      res = await axios({
        method: 'get',
        url,
        headers: {
          'Content-Type': 'application/html',
        },
      });
    } catch (error) {
      console.log(error);
      return error;
    }

    const htmlCtx = cheerio.load(res.data);
    // 最后更新时间
    // const updated = htmlCtx('.post-meta time').text();
    const hashUrl = createHash('md5').update(url).digest('hex');
    writeFile(
      join(__dirname, `../${hashUrl}.html`),
      res.data,
      { encoding: 'utf-8' },
      () => {},
    );
    // 每个番剧的基本信息
    const htmlList = [];
    htmlCtx('article table[width="500px"]').each((index, el) => {
      const tableCtx = cheerio.load(el);
      // console.log(tableCtx('.title_cn_r').html());
      const nameZh = tableCtx('.title_main_r p:first-child').text();
      const nameJp = tableCtx('.title_main_r p:last-child').text();
      const type = tableCtx('.title_main_r~td[class^=type]').html();
      const cate = tableCtx('td[class^=type_tag]').text();
      const mainData = tableCtx('td[class^=staff_r]').html() || '';
      const cvData = tableCtx('.cast_r').html() || '';
      const official = tableCtx('.link_a_r a:first-child').attr('href');
      const officialPreview = tableCtx('.link_a_r :nth-child(3)').attr('href');
      const schedule = tableCtx('.link_a_r .broadcast_r').text();
      const scheduleLabel = tableCtx('.link_a_r .broadcast_ex_r').text();
      const staff = {};
      let prevKey = '';
      const cv = cvData
        .split('<br>')
        .map((item) => item.trim())
        .join(',');
      const infoList = mainData.split('<br>');
      infoList.forEach((item) => {
        const keylinkValue = item
          .trim()
          .split('：')
          .map((item) => cheerio.load(item).text());
        if (keylinkValue.length < 2 && prevKey) {
          staff[prevKey].push(keylinkValue[0]);
        } else {
          const key = keylinkValue[0];
          (staff[key] || (staff[key] = [])).push(keylinkValue[1]);
          prevKey = key;
        }
      });

      htmlList.push({
        hashUrl,
        nameZh,
        nameJp,
        type,
        cate,
        official,
        officialPreview,
        staff: JSON.stringify(staff),
        schedule,
        scheduleLabel,
        cv,
      });
    });
    // 每个番剧的图片信息
    const imgTaskList = [];
    htmlCtx('img[width="180px"]').each((index, el) => {
      const url = htmlCtx(el).attr('src');
      // const filename = url.split('/').pop();
      // const output = join(__dirname, '../../public', filename);
      // 不要学这样写，纯垃圾代码
      imgTaskList.push(
        new Promise(async (resolve, reject) => {
          let shortUrl = '';
          const catboxCtx = new Catbox.Catbox();
          shortUrl = await catboxCtx.upload(url);
          debugger;
          // const res = await axios({
          //   method: 'get',
          //   url,
          //   responseType: 'arraybuffer',
          // });
          // writeFile(output, res.data, 'binary', (err) => {
          //   if (err) {
          //     reject(err);
          //     console.log(`${index} error`, err);
          //   }
          // });
          // htmlList[index].cover = `http://127.0.0.1:4396/${filename}`;
          // resolve(`http://127.0.0.1:4396/${filename}`);

          htmlList[index].cover = shortUrl;
          resolve(shortUrl);
        }),
      );
    });
    await Promise.all(imgTaskList);
    await this.animeRepository
      .createQueryBuilder('anime')
      .where(`anime.hashUrl = :hashUrl`, { hashUrl })
      .delete()
      .execute();
    const insertRes = await this.animeRepository.save(htmlList);
    return insertRes;
  }

  async findOne(url) {
    const hashUrl = createHash('md5').update(url).digest('hex');
    const res = await this.animeRepository.find({
      where: { hashUrl },
    });
    const list = res.map((item: any) => {
      const tempArray = [];
      const jsonStaff = JSON.parse(item.staff);
      for (const key in jsonStaff) {
        const arrayItem = { label: key, value: jsonStaff[key] };
        tempArray.push(arrayItem);
      }
      item.staff = tempArray;
      return item;
    });
    return list;
  }
}
