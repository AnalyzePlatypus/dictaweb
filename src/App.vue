<template>
  <div id="app">
    <div id="nav">
    </div>
    <router-view/>
  </div>
</template>


<style lang="scss">

@import "/assets/fonts.css";

$background-color: #EBD8EC;

html, body {
  padding: 0;
  margin: 0;
  background: $background-color;
  height: 100%;
}

* {
  box-sizing: border-box;
}

#app {
  font-family: 'DIN', 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  height: 100%;
  width: 100%;
}

.flex-horiz {
  display: flex;
  flex-direction: row;
}

.flex-vert {
  display: flex;
  flex-direction: column;
}

.align-center {
  align-items: center;
}

.align-start {
  align-items: flex-start;
}

.align-end {
  align-items: flex-end;
}

.justify-start {
  justify-content: flex-start;
}

.justify-end {
  justify-content: flex-end;
}

.justify-between {
  justify-content: space-between;
}

</style>
