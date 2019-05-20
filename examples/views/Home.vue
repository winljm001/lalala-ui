<template>
  <div class="home">
    <button @click="change">消失事件</button>
    <div class="tmpl">
      <span>菜单1</span>
      <text-particles v-model="isShow">
        <span>菜单2</span>
      </text-particles>
      <text-particles v-model="isShow">
        <span>菜单3</span>
      </text-particles>
      <text-particles v-model="isShow">
        <span>菜单4</span>
      </text-particles>
      <span>菜单5</span>
      <span>菜单6</span>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src

export default {
  name: "home",
  data() {
    return {
      isShow: true
    };
  },
  methods: {
    change() {
      this.isShow = !this.isShow;
      console.log(this.isShow);
    }
  }
};
</script>
