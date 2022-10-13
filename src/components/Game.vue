<template>
  <div :id="containerId" v-if="downloaded" />
  <div class="placeholder" v-else>
    Downloading ...
  </div>
</template>

<script>
import TikTokIOConnection from '../tiktok/wrapper'
import  * as ttListener from '../tiktok/tiktokListener'
export default {
  
  data() {
    return {
      token: "",
      downloaded: false,
      gameInstance: null,
      containerId: 'game-container'
    }
  },
  async mounted() {
    const beHost = 'http://localhost:8081'
    const tiktok = new TikTokIOConnection(beHost)
    tiktok.connect()

    // listener
    tiktok.on('like', ttListener.onLikeEventListener)
    
    const game = await import(/* webpackChunkName: "game" */ '@/game/game')
    this.downloaded = true
    this.$nextTick(() => {
      this.gameInstance = game.launch(this.containerId)
    })
  },
  destroyed() {
    this.gameInstance.destroy(false)
  }
}
</script>

<style lang="scss" scoped>
.placeholder {
  font-size: 2rem;
  font-family: 'Courier New', Courier, monospace;
}
</style>
