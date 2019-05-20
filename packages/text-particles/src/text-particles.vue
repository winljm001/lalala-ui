<template>
  <div class="text-particles" :ref="particlesId">
    <div class="canvas-wrap" :ref="canvasWrapId" v-show="showCanvas">
      <canvas
        v-for="frame in framesLength"
        :width="eleW"
        :height="eleH"
        :class="{
          dust: showDust
        }"
        :key="frame"
      ></canvas>
    </div>
    <div
      class="text-particles-main"
      :class="{ visibility: showDust }"
      v-show="showContent"
    >
      <slot></slot>
    </div>
  </div>
</template>

<script>
import html2canvas from "html2canvas";
export default {
  name: "TextParticles",
  props: {
    value: {
      default: true
    }
  },
  data: function() {
    return {
      framesLength: 32,
      eleW: 0,
      eleH: 0,
      imageDatas: [],
      mainCanvas: null,
      isAnimation: false,
      showContent: true,
      showCanvas: false,
      showDust: false,
      animationTime: 1000,
      inTimer: null,
      outTimer: null
    };
  },
  computed: {
    particlesId() {
      return `particles${this._uid}`;
    },
    canvasWrapId() {
      return `canvasWrap${this._uid}`;
    }
  },
  watch: {
    value: {
      handler: async function(v) {
        if (v) {
          this.generateFrames(this.mainCanvas);
          this.fadeIn();
        } else {
          await this.init();
          this.generateFrames(this.mainCanvas);
          this.fadeOut();
        }
      }
      // immediate: true
    }
  },
  mounted() {
    // this.init();
  },
  methods: {
    // 初始化
    async init() {
      this.showCanvas = true;
      const mainEle = this.$refs[this.particlesId];
      this.eleW = parseInt(window.getComputedStyle(mainEle).width);
      this.eleH = parseInt(window.getComputedStyle(mainEle).height);
      await this.initCanvas();
    },
    async initCanvas() {
      const mainEle = this.$refs[this.particlesId];
      try {
        this.mainCanvas = await html2canvas(mainEle, {
          allowTaint: true,
          logging: false
        });
        this.showCanvas = false;
      } catch (error) {
        /* eslint-disable */
        console.error(1,error);
      }

    },
    // 初始化点
    generateFrames($canvas) {
      const { width, height } = $canvas;
      // get a 2d rendering context from $canvas
      const ctx = $canvas.getContext("2d");
      // copy a rectangular area marked by 4 parameter. A ImageData obj has three property, height,width and data.
      const originalData = ctx.getImageData(0, 0, width, height);
      this.imageDatas = [...Array(this.framesLength)].map(() =>
        // createImageData funciton is used to create a blank ImageData obj
        ctx.createImageData(width, height)
      );
      // pixel level
      for (let x = 0; x < width; ++x) {
        for (let y = 0; y < height; ++y) {
          // show block pixel or original pixel
          // 这里的 i 决定像素密度（相当于把每一个像素分布到几个 canvas 上）
          for (let i = 0; i < 2; ++i) {
            // 随机选中两个 canvas 赋值当前像素
            const dataIndex = Math.floor(
              (this.framesLength * (Math.random() + (2 * x) / width)) / 3
            );
            // 第 i 个像素下标
            const pixelIndex = (y * width + x) * 4;
            for (let offset = 0; offset < 4; ++offset) {
              this.imageDatas[dataIndex].data[pixelIndex + offset] =
                // 第 i 个像素
                originalData.data[pixelIndex + offset];
            }
          }
        }
      }
      
    },
    fadeOut(){
      this.showCanvas = true;
      // draw on canvas list
      this.imageDatas.map((data, index) => {
        const $c = this.$refs[this.canvasWrapId].children[index];
        let random = 2 * Math.PI * (Math.random() - 0.5);
        $c.style.transform = ` 
                            rotate(${15 * (Math.random() - 0.5)}deg)
                            translate(${60 * Math.cos(random)}px, ${30 *
          Math.sin(random)}px)
                            rotate(${-15 * (Math.random() - 0.5)}deg) 
                          `;
        $c.style.opacity = 0;
        // putImageData used to put a ImageData on a canvas
        $c.getContext("2d").putImageData(data, 0, 0);
      });
      this.showDust = true;
      if(this.inTimer){
        window.clearTimeout(this.inTimer)
      }
      this.outTimer=window.setTimeout(() => {
        this.showContent = this.value?true:false;
        this.showCanvas = false;
      }, this.animationTime);
    },
    fadeIn(){
      this.showCanvas = true;
      window.setTimeout(() => {
        this.imageDatas.map((data, index) => {
          const $c = this.$refs[this.canvasWrapId].children[index];
          
          $c.style.transform = `
                          rotate(0deg)
                          translate(0px, 0px)
                          rotate(0deg)
                        `;
          $c.style.opacity = 1;
        });
        this.showContent = true;
        if(this.outTimer){
          window.clearTimeout(this.outTimer)
        }
        this.inTimer=window.setTimeout(() => {
          this.showDust = this.value?false:true;
          this.showCanvas = false;
        }, this.animationTime);
      },10)
    }
  }
};
</script>
<style lang="less">
@import "./index.less";
</style>
