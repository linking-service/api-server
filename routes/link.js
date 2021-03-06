var express = require("express");
var router = express.Router();
const linkModel = require("../models/link");
const directoryModel = require("../models/directory");
const userModel = require("../models/user");
const Scraper = require("../utils/Scraper");

// link 추가

router.post("/:display_name/:dir_id/saved", async (req, res) => {
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
        display_name: req.params.display_name,
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
// router.post("/:dir_id/:link_id/read" , async (req, res) => {
//     let result = null;
//
//     try {
//         result = await linkModel.find({
//             dir_id: req.params.dir_id,
//             link_id: req.params.link_id
//         },{_id:0, link :1,tag:1,desc:1,meta_desc:1,
//             meta_imgUrl: 1,meta_title: 1,read_status: 1,created_time: 1, revised_time: 1, link_id:1, favorite_status:1
//         });
//         console.log("DB find");
//         return await res.json(result);
//     } catch (err) {
//         return res.status(500).json({
//             msg: "DB Find error"
//         });
//     }
//     if (!result) {
//         res.status(404).json({
//             msg: "Cannot find the directory id"
//         });
//         return;
//     }
// });


//디렉토리 내부 모든 링크 호출
router.post("/:dir_id/read" , async (req, res) => {
    let result = null;

    try {
        result = await linkModel.find({
            dir_id: req.params.dir_id,
        },{_id:0, link :1,tag:1,desc:1,meta_desc:1,
            meta_imgUrl: 1,meta_title: 1,read_status: 1,created_time: 1, revised_time: 1, link_id:1, favorite_status:1
        }).sort({'revised_time':-1});
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
            console.log(err);
            res.send("update fail");
        }
        else{res.send("updated")}
        })
})

//링크 삭제
router.get("/:dir_id/:link_id/delete", function (req, res) {
    var linkID = req.params.link_id;
    var dirID = req.params.dir_id;

    linkModel.deleteOne({link_id: req.params.link_id}, function (err) {
        if (err) {
            console.log(err);
           // return res.send('delete fail');
            res.status(404).send('delete fail');
        } else {

            res.status(200).send('delete link')
        }
    });
    directoryModel.find({dir_id: dirID, link_id: {$in:linkID}}, {
        _id: 0,
        link_id: 1
    }, function (err, link_id) {
        if (link_id.length == 1) {
            directoryModel.updateOne({dir_id: dirID}, {$pull: {link_id: linkID}}, function (err) {
                if (err) console.log(err);
            })
            console.log("link_id deleted in directory model");
        }
    });

    userModel.find({favorite: {$in:linkID}}, {
        _id: 0,
        link_id: 1
    }, function (err, link_id) {
        if (link_id.length == 1) {
            userModel.updateOne({favorite: linkID}, {$pull: {favorite: linkID}}, function (err) {
                if (err) console.log(err);
            })
            console.log("link_id deleted in favorite list");
        }
    });
})

//링크 읽음 상태변경 read_status : 1 ->0
router.post("/:link_id/readState", async(req, res)=> {
   await linkModel.findOneAndUpdate({link_id: req.params.link_id}, {
       read_status: 0
    }, function (err) {
        if (err) console.log(err)
    });
    return res.send("Read Status Changed to read");
});

//링크 읽지 않음 상태 변경 read_Status : 0->1
// router.post("/:link_id/unread", async(req, res)=> {
//     await linkModel.findOneAndUpdate({link_id: req.params.link_id}, {
//         read_status: 1
//     }, function (err) {
//         if (err) console.log(err)
//     });
//     return res.send("Read Status Changed to unread");
// });

router.post("/:link_id/readchange", async(req,res)=>{
     await linkModel.find({link_id :req.params.link_id},{_id:0,read_status:1},async (err,read_status)=> {
        if(err) console.log(err);
        if(read_status[0].read_status== 1){
          await linkModel.findOneAndUpdate({link_id :req.params.link_id},{read_status : 0})

        }else{
            await linkModel.findOneAndUpdate({link_id :req.params.link_id},{read_status : 1})
        }
        return res.json(read_status);
    })
});

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


//favorite 링크 출력
// 링크 출력
router.post("/:display_name/favorite/call", async(req,res)=>{
    let favorite = null;
    try {
        favorite = await userModel.find({display_name: req.params.display_name}, {_id: 0, favorite: 1});
    } catch(e){
        console.log(err);
        return res.status(500).json({
            msg: "Cannot find favorite",
        });
    }

    let resultArray= [];
    for(let i =0; i<(favorite[0].favorite).length; i++){
        let result = null;
        try {
            result = await linkModel.find({
                link_id: (favorite[0].favorite)[i]
            }, {
                _id: 0, link: 1, tag: 1, desc: 1, meta_desc: 1, meta_imgUrl: 1, meta_title: 1,
                read_status: 1, created_time: 1, revised_time: 1, link_id: 1, favorite_status: 1
            });
        } catch(err){
            console.log(err);
            continue;
        }
        resultArray.push(result[0]);
    }
    if(resultArray.length == 0) return res.send("cannot find favorite link");
    else{return res.json(resultArray);}
});


module.exports = router;