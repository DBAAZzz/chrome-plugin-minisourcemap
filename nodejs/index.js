const Koa = require('koa');
const bodyParser = require('koa-bodyparser')
const cors = require('koa2-cors');
const router = require('./router')
const app = new Koa();

app.use(cors({
  credentials: true
}));
app.use(bodyParser())
app.use(router.routes())

app.listen(3000, () => {
  console.log('监听3000端口成功')
});