// 导入组件，组件必须声明 name
import textParticles from "./src/text-particles.vue";

// 为组件提供 install 安装方法，供按需引入
textParticles.install = function(Vue) {
  Vue.component(textParticles.name, textParticles);
};

// 默认导出组件
export default textParticles;
