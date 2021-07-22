<template>
<div id="interface">
    <!-- Hp bar -->
    <div v-for="key in Object.keys(state.assets)">
        <div class="unit-bar" v-for="n in INSTANCES[key]" v-bind:id="'unit-bar-' + key + '-' + (n-1)">
            <div class="unit-bar-name">{{key}}</div>
            <div class="unit-bar-hp" v-bind:id="'unit-bar-hp-' + key + '-' + (n-1)"></div>
        </div>
    </div>
    <!-- Energy -->
    <div id="interface-energy">
	    <div id="interface-energy-fill" v-bind:style="{ width: state.energyLoad + 'px' }"></div>
    </div>
    <div id="interface-totalenergy">
        {{ state.playerEnergy.toFixed(0) }}
    </div>
    <!-- Units -->
    <div id="interface-bottom">
        <div draggable="false" v-bind:class="state.selectedUnitIndex === 1 ? 'interface-unit interface-unit-selected' : 'interface-unit' " v-on:click="selectUnit('fighter', 1, $event)"><div class="interface-unit-content">Fighter</div></div>
        <div draggable="false" v-bind:class="state.selectedUnitIndex === 2 ? 'interface-unit interface-unit-selected' : 'interface-unit' " v-on:click="selectUnit('fighter', 2, $event)"><div class="interface-unit-content">Fighter</div></div>
        <div draggable="false" v-bind:class="state.selectedUnitIndex === 3 ? 'interface-unit interface-unit-selected' : 'interface-unit' " v-on:click="selectUnit('fighter', 3, $event)"><div class="interface-unit-content">Fighter</div></div>
        <div draggable="false" v-bind:class="state.selectedUnitIndex === 4 ? 'interface-unit interface-unit-selected' : 'interface-unit' " v-on:click="selectUnit('fighter', 4, $event)"><div class="interface-unit-content">Fighter</div></div>
        <div draggable="false" v-bind:class="state.selectedUnitIndex === 5 ? 'interface-unit interface-unit-selected' : 'interface-unit' " v-on:click="selectUnit('base', 5, $event)"><div class="interface-unit-content">Base</div></div>
    </div>
    <!-- Finished -->
    <div id="interface-finish" v-if="state.finished">
        <div class="btn">Game over.</div>
        <div class="btn" v-on:click="mainMenu()">Main Menu</div>
    </div>
</div>
</template>

<script>
import { state } from '@/State.js'
import { INSTANCES } from '@/Constants.js'
import { getLocation, setLocation, locations } from '@/Location.js'
import { stopSession } from '@/Network.js'
export default {
	name: 'Interface',
	data() {
    	return { state, INSTANCES }
	},
	mounted() {
	},
	methods: {
        selectUnit(name, index,event) {
            state.selectedUnit = name;
            state.selectedUnitIndex = index;
        },
        mainMenu() {
            stopSession();
            setLocation(locations.MENU);
        }
	}
}
</script>

<style scoped>
.unit-bar {
    position: absolute;
    width: 60px;
    height: 10px;
    font-size: 8px;
    border-radius: 2px;
    background: #00aaff;
    top: 0px;
    left: 0px;
    text-align: center;
    text-transform: uppercase;
    line-height: 10px;
    color: white;
    font-weight: bold;
    transform: translate(-30px, -45px);
}
.unit-bar-hp {
    margin-top: 2px;
    width: 60px;
    height: 5px;
    border: 1px solid rgba(0,0,0,0.5);
    border-radius: 2px;
    background: #44dd44;
}
.unit-bar-name {
    margin-top: 0px;
}
#interface {
	position: absolute;
	top: 0px;
	left: 0px;
	width: 100%;
	height: 100%;
	background: rgba(0,0,0,0);
    pointer-events: none;
}
#interface-energy {
	position: absolute;
	bottom: 100px;
	left: calc(50% - 125px);
	height: 5px;
	width: 250px;
	background: #005599;
}
#interface-energy-fill {
	height: 100%;
	width: 0px;
	background: #00aaff;
}
#interface-totalenergy {
    position: absolute;
	bottom: 100px;
	left: calc(50% + 150px);
    bottom: 50px;
	height: 50px;
	width: 50px;
    color: white;
    font-size: 22px;
    line-height: 50px;
    text-align: center;
	background: rgba(0,0,0,0);
}
#interface-bottom {
	position: absolute;
	bottom: 50px;
	left: calc(50% - 125px);
	height: 50px;
	width: 250px;
	background: white;
    pointer-events: all;
}
.interface-unit {
	height: 100%;
	width: 20%;
	background: #080808;
	outline: 1px solid #00aaff;
	float: left;
	margin: 0px;
	padding: 0px;
    user-select: none;
    user-drag: none;
}
.interface-unit-selected {
    background: #e0e0e0;
}
.interface-unit-content {
    width: 50px;
    height: 50px;
    text-align: center;
    line-height: 50px;
    color: white;
}
#interface-finish {
    position: absolute;
    top: calc(50% - 200px);
    left: calc(50% - 300px);
    width: 600px;
    height: 400px;
    color: white;
    text-align: center;
    opacity: 0.75;
    border: 2px solid white;
    background: black;
    pointer-events: all;
}
</style>
