var express = require("express");
var router = express.Router();
const linkModel = require("../models/link");
const directoryModel = require("../models/directory");
const userModel = require("../models/user");
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
        read_status: 1,
        favorite_status: 0
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

    res.status(201).json(metadata);
});

//링크 데이터 전달 디렉토리 id/링크 id
router.post("/:dir_id/:link_id/read" , async (req, res) => {
    let result = null;

    try {
        result = await linkModel.find({
            dir_id: req.params.dir_id,
            link_id: req.params.link_id
        },{_id:0, link :1,tag:1,desc:1,meta_desc:1,
            meta_imgUrl: 1,meta_title: 1,read_status: 1,created_time: 1, revised_time: 1, link_id:1, favorite_status:1
        });
        console.log("DB find");
        return await res.json(result);
    } catch (err) {
        return res.status(500).json({
            msg: "DB Find error"
        });
    }
    if (!result) {
        res.status(404).json({
            msg: "Cannot find the directory id"
        });
        return;
    }
});

//디렉토리 내부 모든 링크 호출
router.post("/:dir_id/read" , async (req, res) => {
    let result = null;

    try {
        result = await linkModel.find({
            dir_id: req.params.dir_id,
        },{_id:0, link :1,tag:1,desc:1,meta_desc:1,
            meta_imgUrl: 1,meta_title: 1,read_status: 1,created_time: 1, revised_time: 1, link_id:1, favorite_status:1
        });
        console.log("DB find");
        return await res.json(result);
    } catch (err) {
        return res.status(500).json({
            msg: "DB Find error"
        });
    }
    if (!result) {
        res.status(404).json({
            msg: "Cannot find the directory id"
        });
        return;
    }
});
//링크 수정

router.post("/:link_id/update" ,async (req,res) =>{
    linkModel.findOneAndUpdate({link_id : req.params.link_id},
        {
            tag: req.body.tag,
            desc: req.body.desc,
            revised_time: Date.now()

        },function (err){
        if(err){
            console.log(err)
            res.send("update fail");
        }
        else{res.send("updated")}
        })
})

//링크 삭제
router.get("/:link_id/delete", async (req, res)=>{
    linkModel.deleteOne({link_id : req.params.link_id},
        function (err) {
            if (err) {
                console.log(err)
                res.status(404).send('delete fail');
            } else {
                res.status(200).send('delete link')
            }
        })
})

// TODO 링크 읽으면 status 변경

// 링크 유저 즐겨찾기 목록 저장 및 삭제
router.post("/:display_name/:link_id/favorite", async(req, res)=>{
    const favoriteLink = req.params.link_id;

    await userModel.find({display_name: req.params.display_name, favorite: favoriteLink}, {
        _id: 0,
        favorite: 1
    }, function (err, favorite) {
        console.log(favorite.length);
        console.log(favorite);

        //배열에서 제거
        if (favorite.length != 0 ) {
            linkModel.findOneAndUpdate({link_id: favoriteLink}, {
                favorite_status: 0
            }, function (err) {
                if (err) console.log(err)
            });

            userModel.updateOne({display_name: req.params.display_name}, {$pull: {favorite: favoriteLink}}, function (err) {
                if (err) console.log(err);
            })
            return res.send("link delete to favorite");
        }
        //배열에 추가
        else {
            linkModel.findOneAndUpdate({link_id: favoriteLink}, {
                favorite_status: 1
            }, function (err) {
                if (err) console.log(err)
            });

            userModel.updateOne({display_name: req.params.display_name}, {$push: {favorite: favoriteLink}}, function (err) {
                if (err) console.log(err);
            })
            return res.send("link to favorite");
        }
    })
})

module.exports = router;