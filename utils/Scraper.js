const axios = require("axios");
const cheerio = require("cheerio");

class Scraper {
    constructor(url) {
        this.url = url;
    }

    async getResponse() {
        const {
            data
        } = await axios.get(this.url);
        return data;
    }

    filterByTarget({
                       data,
                       target
                   }) {
        return data.filter(
            elem =>
                elem.itemprop === target ||
                elem.property === target ||
                elem.name === target
        );
    }

    getData(html) {
        const $ = cheerio.load(html);
        let data = [];

        $("meta").each((i, elem) => {
            const attrib = elem.attribs;
            if (attrib.itemprop || attrib.property || attrib.name)
                data = [...data, attrib];
        });
        const [title, ...titleArg] = this.filterByTarget({
            data,
            target: "title"
        });
        const [ogTitle, ...ogTitleArg] = this.filterByTarget({
            data,
            target: "og:title"
        });
        const [desc, ...descArg] = this.filterByTarget({
            data,
            target: "description"
        });
        const [ogDesc, ...ogDescArg] = this.filterByTarget({
            data,
            target: "og:description"
        });
        const [imgUrl, ...imgUrlArg] = this.filterByTarget({
            data,
            target: "image"
        });
        const [ogImgUrl, ...ogImgUrlArg] = this.filterByTarget({
            data,
            target: "og:image"
        });

        return {
            title: ogTitle ? ogTitle.content : title.content,
            desc: ogDesc ? ogDesc.content : desc.content,
            imgUrl: ogImgUrl ? ogImgUrl.content : imgUrl.content
        };
    }
}

// Usage, testcode

// (async () => {
//   const scraper = new Scraper("https://www.naver.com/");
//   const resData = await scraper.getResponse();
//   const metaData = scraper.getData(resData);

//   console.log(metaData);
// })();

// 끝

module.exports = Scraper;