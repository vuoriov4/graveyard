<template>
    <div id="app">
        <Menu v-if="getLocation() == locations.MENU"/>
        <Game v-if="getLocation() == locations.GAME"/>
    </div>
</template>

<script>
import { getLocation, locations, setRoot } from '@/Location.js'
import Menu from '@/components/Menu';
import Game from '@/components/Game';

export default {
    name: 'App',
    data: () => {
        return { locations }
    },
    methods: {
        getLocation
    },
    mounted() {
        setRoot(this);
    },
    components: { Menu, Game }
}
</script>

<style>
html, body, #app {
    width: 100%;
    height: 100%;
    font-size: 12px;
    padding: 0;
    margin: 0;
    background: black;
    font-family:sans;
    overflow: hidden;
}
.btn {
    text-align: center;
    color: #00aaff;
    margin-top: 25px;
    line-height: 50px;
    margin-left: 25px;
    width: calc(100% - 50px);
    height: 50px;
    background: rgba(0,0,0,0);
    border: 2px solid #00aaff;
    font-weight: bold;
    cursor: pointer;
}
</style>
