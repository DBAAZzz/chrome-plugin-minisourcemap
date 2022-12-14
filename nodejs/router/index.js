const Router = require('koa-router')
const { getSourceMap } = require('../utils')
const analysis = require('../utils/analysis')

let router = new Router();

router.get('/', async (ctx, next) => {
  console.log(ctx)
  await next()
})

router.post('/getSourceMap', async (ctx, next) => {
  const { cookie, id } = ctx.request.body
  await getSourceMap(cookie, id || 'all')

  ctx.body = {
    code: 200
  }
  next()
})

router.post('/getErrorInfo', async (ctx, next) => {
  const { errorString, id } = ctx.request.body
  console.log('errorString', errorString)
  try {
    let data = await analysis(errorString, id)
    ctx.body = {
      code: 200,
      data
    }
  } catch (error) {
    console.log('getErrorInfo', JSON.stringify(error))
    ctx.body = {
      code: 300,
      data: JSON.stringify(error)
    }
  }
})

module.exports = router