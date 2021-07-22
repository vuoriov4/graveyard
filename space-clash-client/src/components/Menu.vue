<template>
  <div id="menu">
      <div id="menu-title">S P A C E &nbsp C L A S H </div>
      <div id="menu-start-button"  class="btn" v-on:click="start()">
          <span v-if="inQueue">Q U E U E</span>
          <span v-else>S T A R T</span>
      </div>
  </div>
</template>

<script>
import { setLocation, locations } from '@/Location.js'
import { queue, connect, startSession } from '@/Network.js'

export default {
	name: 'Menu',
	data() {
    	return {
            inQueue: false
  		}
	},
	methods: {
		start() {
            this.inQueue = true;
            queue().then(() => {
                this.inQueue = false;
                connect().then(() => {
                    setLocation(locations.GAME);
                    startSession();
                });
            });
		}
	}
}
</script>

<style>
    #menu {
        width: 350px;
        height: 185px;
        position: absolute;
        top: calc(50% - 92.5px);
        left: calc(50% - 175px);
        border: 2px solid #ff0088;
    }
    #menu-title {
        text-align: center;
        color: white;
        margin-top: 25px;
        font-size: 25px;
        line-height: 50px;
        margin-left: 25px;
        width: calc(100% - 50px);
        height: 50px;
        background: rgba(0,0,0,0);
        font-weight: bold;
    }
</style>
