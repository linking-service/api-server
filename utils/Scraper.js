const axios = require("axios");
const cheerio = require("cheerio");

class Scraper {
    constructor(url) {
        this.url = url;
    }

    async getResponse() {
        const { data } = await axios.get(this.url);

        return data;
    }

    filterByTarget({ data, target }) {
        return data.filter(elem => {
            const itemprop = elem.itemprop ? elem.itemprop : "";
            const property = elem.property ? elem.property : "";
            const name = elem.name ? elem.name : "";
            return (
                itemprop.includes(target) ||
                property.includes(target) ||
                name.includes(target)
            );
        });
    }

    getData(html) {
        const $ = cheerio.load(html);
        let data = [];

        $("meta").each((i, elem) => {
            const attrib = elem.attribs;
            if (attrib.itemprop || attrib.property || attrib.name)
                data = [...data, attrib];
        });

        const pageTitle = $("title").text();

        const [title, ...titleArg] = this.filterByTarget({
            data,
            target: "title"
        });
        const [desc, ...descArg] = this.filterByTarget({
            data,
            target: "description"
        });
        const [imgUrl, ...imgUrlArg] = this.filterByTarget({
            data,
            target: "image"
        });

        return {
            title: title ? title.content : pageTitle ? pageTitle : this.url,
            desc: desc ? desc.content : "",
            imgUrl: imgUrl ? imgUrl.content : ""
        };
    }
}

// (async () => {
//   const scraper = new Scraper("https://react.semantic-ui.com/elements/icon/");
//   const resData = await scraper.getResponse();
//   const metaData = scraper.getData(resData);

//   console.log(metaData);
// })();

module.exports = Scraper;