var express = require("express");
var router = express.Router();
const userModel = require("../models/user");
const linkModel = require("../models/link");
const directoryModel = require("../models/directory");
const mailModel = require("../models/mail");
const direcrotynameModel = require("../models/directoryName");

//메세지 전송
//display_name : 송신자
//sender : 수신자
//type :0 공유 btn 클릭할때  1 공유 거절할때  2 공유 수락할때
router.post('/:display_name/:sender/:type', async (req,res)=>{
    const displayName = req.params.display_name;
    const senderName = req.params.sender;
    const type = req.params.type;

    if(type ==0) {
        const dirID = req.body.dir_id;

        await direcrotynameModel.find({dir_id: dirID}, {_id: 0, name: 1}, function (err, name) {
            console.log(name[0].name);
            const dirName = name[0].name;

            const Mail = new mailModel({
                display_name: senderName,
                sender: displayName,
                message: displayName + "님이 " + dirName + " 디렉토리를 공유했습니다.",
                status: 1,
                dir_id : dirID
            })
            Mail.save();
            return res.send(200);
        });
    }

    if(type ==1){
        const mailID = req.body.mail_id;
        //거절 메세지 보내기
        const Mail = new mailModel({
            display_name: senderName,
            sender: displayName,
            message: displayName + "님이 디렉토리를 공유를 거절했습니다.",
            status :0,
            dir_id :0
        })
        Mail.save();
        //해당 메세지 삭제
        mailModel.deleteOne({mail_id: mailID},function (err) {
            if(err){
                console.log(err);
                res.status(404).send('delete fail');
            } else{
                res.status(200).send('delete mail')
            }
        })
    }
    else if(type ==2){
        const dirID = req.body.dir_id;

        const Mail = new mailModel({
            display_name: senderName,
            sender: displayName,
            message: displayName + "님이 디렉토리를 공유를 수락했습니다.",
            status :0,
            dir_id: 0
        })
        Mail.save();

        //해당 메세지 삭제
        const mailID = req.body.mail_id;
        mailModel.deleteOne({mail_id: mailID},function (err) {
            if(err){
                console.log(err);
              //  res.status(404).send('delete fail');
            } else{
              //  res.status(200).send('delete mail')
            }
        });

        directoryModel.find({shared: displayName, dir_id: dirID}, {_id: 0, shared: 1}, async (err, shared)=> {
            if (err) console.log(err);
            if (shared.length == 1) {
                console.log(shared[0].shared);
                return res.send("this user already shared");
            }
            else {
                await directoryModel.updateOne({dir_id: dirID}, {$push: {shared: displayName}}, function (err) {
                    if (err) console.log(err);
                    res.send("share to user")
                })
            }
        })
    }
});

//메세지 갯수 알림
router.get("/:display_name/mailnumber", async(req,res)=>{
    mailModel.find({display_name:req.params.display_name},{_id:0, mail_id :1},function (err,mail_id){
        if(err) console.log(err);

        return res.json({mailnumber :JSON.stringify(mail_id.length)});
    })
})

//유저 메세지함 출력
router.get("/:display_name/mailList", async(req,res)=>{
    mailModel.find({display_name:req.params.display_name},{_id:0, message:1,display_name:1,sender:1,status:1,mail_id:1,dir_id:1},function (err, message) {
        if(err) console.log(err);

        return res.json(message);
    })
} )

//메세지 삭제
router.get("/:mail_id/delete", function (req, res) {
    var mailID = req.params.mail_id;

    mailModel.deleteOne({mail_id : mailID},function (err) {
        if(err){
            console.log(err);
            res.status(404).send('delete fail');
        } else{
            res.status(200).send('delete mail')
        }
    })

})
module.exports = router;