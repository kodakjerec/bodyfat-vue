import { createRouter, createWebHistory } from "vue-router";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      components:{
        home: () => import("@/views/home.vue"),
        settings: () => import("@/views/settings.vue"),
        calendar: () => import("@/views/calendar.vue"),
        chart: () => import("@/views/chart.vue")
      }
    }
  ]
});

const history = window.history;
const hasPushState = typeof history.pushState === 'function';

if (hasPushState) {
  const replaceState = history.replaceState.bind(history);

  history.replaceState = function(state) {
    try {
      replaceState.apply(this, (arguments as any));
    } catch (e) {
      window.location.href = "/";
    }
  }
}

export default router;
