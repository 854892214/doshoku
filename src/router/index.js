import vue from "vue"
import Router from "vue-router"
import home from "@/components/Home/Home.vue"
import order from "@/components/order/order.vue"
import NotFound from "@/components/404/NotFound.vue"
import Details from "@/components/details/details.vue"
import afterDetails from "@/components/details/after-details.vue"
import bill from "@/components/bill/bill.vue"
import paySuccess from '@/components/success/pay-success.vue'
import trans from '@/components/transition/trans'
import pay from '@/components/pay/pay'
import success from '@/components/pay/paySuccess'
import register from '@/components/register/register'

vue.use(Router)
export default new Router({
    // base: "/h5/test/food/doshoku/",
    base: "/h5/food/doshoku/",
    routes: [
        {path: '/home', component: home},
        {path: '/order', component: order},
        {path: '/Details', component: Details},
        {path: '/bill', name: "bill", component: bill,},
        {path: '/paySuccess', component: paySuccess},
        {path: '/afterDetails', name: "afterDetails", component: afterDetails},
        {path: '/trans', component: trans},
        {path: '/pay', component: pay},
        {path: '/success', component: success},
        {path: '/register', component: register},
        {path: '*', component: NotFound}
    ],
    scrollBehavior(to, from, savedPosition) {
        if (savedPosition) {
            return savedPosition
        } else {
            return {
                x: 0,
                y: 0
            }
        }
    }
})
