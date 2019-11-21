var express = require("express");
var router = express.Router();
const linkModel = require("../models/link");
const directoryModel = require("../models/directory");
const Scraper = require("../utils/Scraper");

// link 추가
router.post("/:dir_id/saved", async (req, res) => {
    let result = null;

    try {
        result = await directoryModel.findOne({
            dir_id: req.params.dir_id
        });
        console.log(result);
    } catch (err) {
        return res.status(500).json({
            msg: "DB Find Error"
        });
    }
    if (!result) {
        res.status(404).json({
            msg: "Cannot find the directory id"
        });
        return;
    }

    const scraper = new Scraper(req.body.link);
    let resData = null;
    try {
        resData = await scraper.getResponse();
    } catch (err) {
        console.log(`Scraping Error\n ${err}`);
        res.status(500).json({
            msg: "Request for metadata failed"
        });
        return;
    }
    const metadata = scraper.getData(resData);

    const link = new linkModel({
        link : req.body.link,
        dir_id: req.params.dir_id,
        tag: req.body.tag,
        desc: req.body.desc,
        meta_title: metadata.title,
        meta_desc: metadata.desc,
        meta_imgUrl: metadata.imgUrl,
        read_status: 1
    });

    try {
        await link.save();
    } catch (err) {
        console.log(`Link Insertion Error\n ${err}`);
        res.status(500).json({
            msg: "DB Insertion Error"
        });
        return;
    }

    res.status(202).json(metadata);
});
module.exports = router;