module.exports =  function(app,name){
    //메인 페이지 이동
    app.get('/', function(req,res){
        res.end();
    });

    //구글 로그인을 통한 로그인
    app.post('/login', function(req,res){
        var email = req.body.email;
        const find = await user.findOne({ where: { email: email } })
        if (!find) {
            console.log("not exist user");
            return res.json({code: 0});
        }else{
            console.log("exist user")
            return res.json({code: 1});
        }
    });

    // 로그인 후 유저별 워크스페이스
    app.get('/main/:user_id', function(req,res){
        res.end();
    });

    //디렉토리 생성 및 수정
    app.put('/main/:user_id', function(req,res){
        res.end();
    });

    //디렉토리 삭제
    app.delete('/main/:user_id', function(req,res){
        res.end();
    });

    //추가하는 링크 데이터 저장
    app.post('/main/:user_id/link',function(req,res){
        res.end();
    });
    //user 조회
    app.get('/user', function(req,res){
        user.find(function (err, user) {
            if(err) return res.status(500).send({error: 'database failure'});
            res.json(user);
        })
    });

    /////test
    /*
    app.get('/name', function(req,res){
        name.find(function (err, name) {
            if(err) return res.status(500).send({error: 'database failure'});
            res.json(name);
        })
    });
    */

    app.post('/name', function(req, res){
        /*
        var Name = new name();
        Name.name = req.body.name;
        Name.user_id = req.body.user_id;
        Name.email = req.body.email;
        Name.display_name = req.body.display_name;
        Name.entry_dir_id = req.body.entry_dir_id;
            Name.save(function(err){
            if(err){
                console.error(err);
                res.json({result: 0});
                return;
            }
            res.json({result: 1});
        });
        */
       var user_email = req.body.email;
        name.findOne({email : user_email}, ){

        };
    });
    //////

    router.post('/signin', function(req, res, next){
        var u_id = req.body.id;
        var u_pw = req.body.pw;
      
        userModel.findOne({id : u_id, pw: u_pw}, function(err, user){
          if(err) return console.log(err);
          else if(user == null){
            res.send({code: 0})
          }else{
            res.send({code: 1})
          }
        })
      });

}