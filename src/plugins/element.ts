import ElementPlus from 'element-plus'
import Element from 'element-plus'
import 'element-plus/theme-chalk/index.css'
import locale from 'element-plus/lib/locale/lang/zh-cn'

export default (app:any) => {
    app.use(ElementPlus, { locale })
    app.use(Element)
}
