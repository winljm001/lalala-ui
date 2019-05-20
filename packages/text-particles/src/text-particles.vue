<template>
  <div class="text-particles" :ref="particlesId">
    <div
      class="text-particles-main"
      :class="{ visibility: showDust }"
      v-show="showContent"
    >
      <slot></slot>
    </div>
    <div class="canvas-wrap" :ref="canvasWrapId">
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
      showContent: true,
      showDust: false
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
      handler: function(v) {
        if (v) {
          console.log("真", v);
          this.showContent = true;
          this.showDust = false;
          // console.log(this.canvasWrapId);
          // console.log(this.$refs[this.canvasWrapId]);
          this.$refs[this.canvasWrapId].children.forEach(v => {
            v.style.transform = `
                            rotate(0deg)
                            translate(0px, 0px)
                            rotate(0deg)
                          `;
            v.style.opacity = 1;
          });
        } else {
          // console.log(this.particlesId);
          // console.log("refs", this.$refs[this.particlesId]);
          this.drawCanvas(this.$refs[this.particlesId]);
        }
      }
      // immediate: true
    }
  },
  mounted() {
    this.eleW = parseInt(
      window.getComputedStyle(this.$refs[this.particlesId]).width
    );
    this.eleH = parseInt(
      window.getComputedStyle(this.$refs[this.particlesId]).height
    );
  },
  methods: {
    generateFrames($canvas) {
      const { width, height } = $canvas;
      // get a 2d rendering context from $canvas
      const ctx = $canvas.getContext("2d");
      // copy a rectangular area marked by 4 parameter. A ImageData obj has three property, height,width and data.
      const originalData = ctx.getImageData(0, 0, width, height);
      const imageDatas = [...Array(this.framesLength)].map(() =>
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
              imageDatas[dataIndex].data[pixelIndex + offset] =
                // 第 i 个像素
                originalData.data[pixelIndex + offset];
            }
          }
        }
      }
      // console.log(imageDatas);
      // console.log("particlesId", this.$refs[this.particlesId]);
      // draw on canvas list
      imageDatas.map((data, index) => {
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
    },
    async drawCanvas(elm) {
      try {
        const $canvas = await html2canvas(elm, {
          allowTaint: true
        });
        // console.log("canvas", $canvas);
        // // frames for animation
        this.generateFrames($canvas);

        // // add class to trigger transition
        this.$nextTick(() => {
          this.showDust = true;
          window.setTimeout(() => {
            this.showContent = false;
          }, 1000);
        });
      } catch (error) {
        /* eslint-disable */
        console.error(1,error);
      }
    }
  }
};
</script>
<style lang="less" scoped>
@import "./index.less";
</style>
