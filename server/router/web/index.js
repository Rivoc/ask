module.exports = app => {
  const router = require('express').Router()
  const User = require('../../models/User')
  const Answer = require('../../models/Answer')
  const Category = require('../../models/Category')
  const Post = require('../../models/Post')
  const Reply = require('../../models/Reply')
  const mongoose = require('mongoose')
  app.use('/web/api', router)






  // 问答模块

  //获取所有问题                    ok
  router.get('/question', async (req, res) => {
    const model = await Post.find()
    res.send(model)
  })
  //发布问题                        ok
  router.post('/question', async (req, res) => {
    const model = await Post.create(req.body)
    console.log(req.body)
    res.send(model)
  })
  // 修改问题                       ok
  router.put('/question/:id', async (req, res) => {
    const model = await Post.findByIdAndUpdate(req.params.id, req.body)
    res.send(model)
  })
  //查看问题详情 并且每浏览一次就+1浏览量                      ok
  router.get('/question/:id', async (req, res) => {
    let { view_count } = await Post.findById(req.params.id)
    console.log(typeof view_count)
    view_count++
    console.log(view_count)
    console.log(req.params.id)
    const model = await Post.findById(req.params.id).populate('category').findOneAndUpdate(req.params.id, { view_count })
    res.send(model)
  })

  //获取某一问题的所有回答(问题的id)
  router.get('/question/ans/:id', async (req, res) => {
    const model = Answer.find({ answer_for: req.params.id }).populate('created_by').populate('collected_by').populate('like')
    res.send(model)
  })
  //发表回答(问题的id)
  router.post('/question/ans', async (req, res) => {
    const model = Answer.create(req.body)
  })
  // //点赞回答(回答的id)
  // router.put('/like/:id', (req, res) => {
  //   const model = reply.findByIdAndUpdate(req.params.id, {})
  // })
  //获取某一回答下的所有回复(回答的id)
  router.get('/answer/reply/:id', async (req, res) => {
    const model = Reply.find({ reply_for: req.params.id }).populate('created_by').populate('like')
    res.send(model)
  })
  //发表回复（回答的id)
  router.post('/answer/reply/:id', async (req, res) => {
    const model = Reply.create(req.body)
  })




  // 分类
  //获取分类 (只有分类名称)                   ok
  router.get('/category', async (req, res) => {
    const model = await Category.find()
    res.send(model)
  })
  //新增分类                        ok
  router.post('/category', async (req, res) => {
    const model = await Category.create(req.body)
    res.send(model)
  })
  //修改分类                        ok
  router.put('/category/:name', async (req, res) => {
    const model = await Category.findOneAndUpdate(req.params.name, req.body)
    res.send(model)
  })
  //获取指定分类对应的所有文章    ok 
  router.get('/question/category/:name', async (req, res) => {
    const model = await Category.aggregate([
      {
        $lookup: {
          from: 'posts',//这里必须要转为小写加复数的形式，因为mongodb会偷偷将表名转化
          localField: '_id',//主表的字段（当前collection中要连接的字段）
          foreignField: 'category',//关联表的字段(关联colletion中连接查询的字段)
          as: 'postList'//新生成的字段
        }
      }
      // { $project: { 'postList': 1, "_id": 0 } }
    ])

    res.send(model)

  })


  //用户模块
  //注册
  router.post('/register', async (req, res) => {
    const model = await User.create(req.body)
    res.send({
      model,
      code: 200,
      message: '注册成功'
    })
  })
  //登录
  router.post('/login', async (req, res) => {
    const { username, password } = req.body
    const user = await User.findOne({ username })
    const uid = user._id
    // assert(user, res.status(422), '用户不存在')
    if (!user) {
      res.status(422).send({
        message: '用户不存在'
      })
    }
    if (user.password === password) {
      //
      req.session.uid = user._id
      res.send({
        msg: "登陆成功"
      })
    }
  })

  //测试用接口
  router.get('/', async (req, res) => {
    console.log(req.session.uid)
    const model = await User.findById(req.session.uid)
    res.send(model)
  })

  //获取指定用户信息                ok
  router.get('/user/:id', async (req, res) => {
    // const userPost = await User.aggregate([
    //   { $match: { id: req.params.id } },//过滤数据，只查指定用户
    //   {
    //     $lookup: {
    //       from: 'posts',//找用户的所有提问帖子
    //       localField: '_id',
    //       foreignField: 'created_by',//关联表的字段(关联colletion中连接查询的字段)
    //       as: 'postlist'
    //     },
    //   },
    //   { $project: { 'postlist': 1, "_id": 0 } }
    // ])
    // const userAnswer = await User.aggregate([
    //   { $match: { id: req.params.id } },
    //   {
    //     $lookup: {
    //       from: 'answers',//找用户的所有回答
    //       localField: '_id',
    //       foreignField: 'created_by',
    //       as: 'answerlist'
    //     },
    //   }
    // ])
    //用户的所有提问
    let userPost = await Post.find({ created_by: req.params.id })
    //用户回答过的所有问题
    const userAnsFor = await Answer.find({ answer_for: req.params.id })
    //用户所有的回答
    const userAns = await Answer.find({ created_by: req.params.id })
    //用户关注过的问题
    const userWatchqs = await Post.find({ watched_by: req.params.id })
    //用户关注的人和用户的粉丝
    let follow = (await User.find({ _id: mongoose.Types.ObjectId(req.params.id) }, { follow: 1, fans: 1 }).populate("follow").populate("fans"))[0]
    //得到的follow其实引用自数据库，增添属性是无效的，深拷贝一下
    let userInfo = JSON.parse(JSON.stringify(follow))
    userInfo.userPost = userPost
    res.send(userInfo)

  })
  //文章相关
  //






















  // //资源中间件，用来查找并引入模型
  // const resource = require('../../Middleware/resource')()
  // //资源路由，加了两个中间件，先看用户是否存在，再看模型是否存在，最后挂载路由
  // app.use('/web/api/rest/:resource',
  //   resource,
  //   router)//挂载子路由





  // //检测用户是否存在接口
  // app.post('/web/api/ckExist', async (req, res) => {
  //   const { username } = req.body
  //   const user = await User.findOne({ username })
  //   if (user) {
  //     res.status(422).send()
  //   }
  // })
  // //登录接口
  // // app.post('/web/api/login', async (req, res) => {
  // //   const { username, password } = req.body
  // //   //根据用户名找用户(因为密码被散列，只能通过用户名找)

  // //   //查找条件用{key:value}表示
  // //   //因为数据库中的密码设置了不允许查询，所以这里要特别查询出来
  // //   const user = await AdminUser.findOne({ username }).select('+password')
  // //   // assert(user, res.status(422), '用户不存在')
  // //   if (!user) {
  // //     res.status(422).send({
  // //       message: '用户不存在'
  // //     })
  // //   }



  // //注册接口
  // app.post('/web/api/register', async (req, res) => {
  //   console.log('请求注册带的cookies.name是' + req.cookies.name)
  //   //因为req.xx的都是字符串类型，生成的验证码是数字类型，需要转换
  //   let reqCode = Number(req.body.userCode)
  //   console.log('请求注册里req.session.verifyCode' + req.session.verifyCode)
  //   //比对session里的验证码与用户输入的验证码
  //   if (req.session.verifyCode === reqCode) {
  //     const model = await User.create(req.body)
  //     res.send({
  //       model,
  //       code: 200,
  //       message: '注册成功'
  //     })
  //   } else {
  //     res.send({ code: 201, message: '验证码错误' })
  //   }




  // })
  // //生成验证码接口
  // //邮箱验证码
  // app.post('/web/api/getMailCode', async (req, res) => {

  //   //如果请求里带了名为name的cookie，说明该请求在一分钟内再次发起，返回错误，拒绝发送验证码
  //   if (req.cookies.name) {
  //     res.send({ code: 201, message: '一分钟之内不能重复发送' })
  //   } else {
  //     let { mail } = req.body
  //     try {
  //       let code = await Mail.send(mail, parseInt(Math.random() * 10000))
  //       req.session.verifyCode = code;
  //       console.log('验证码接口设置了session.verifyCode' + req.session.verifyCode)
  //       console.log('验证码是' + code)
  //       // res.cookie('isVisit', 1, { maxAge: 60 * 1000, httpOnly: true }) // 该处是设置 cookie
  //       res.send({ code: 200, message: '发送成功,请前往邮箱查看' })
  //     }
  //     catch (err) {
  //       res.send({ code: 201, message: '发送失败，请确认邮箱地址是否存在' })
  //     }
  //   }
  // })

  // //手机验证码
  // app.post('/web/api/getPhoneCode', async (req, res) => {
  //   let { phone } = req.body
  //   res.send({ code: 201, message: '收到请求啦没有发送出去(发短信是要收费哒)' })

  // })


}
