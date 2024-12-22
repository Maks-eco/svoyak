<template>
  <div class="message__contnr">
    <div class="message__background" @click="closeWindow" @keydown="divEvent">
      <div class="one-message" @click.stop>
        <div>
          <p class="message__text">Благодарим за покупку!</p>
        </div>
        <div>
          <button class="message__btn" @click="closeWindow">Продолжить покупки</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
const emit = defineEmits(['closeWindow'])

const closeWindow = () => {
  emit('closeWindow')
}
const divEvent = () => {
  // smth
}
</script>

<style scoped>
@media (min-width: 480px) {
  .one-message {
    width: 400px;
    height: 300px;
  }
  .message__text {
    font-size: 36px;
  }
}
@media (max-width: 480px) {
  .one-message {
    width: 90%;
    height: 300px;
  }
  .message__text {
    font-size: 25px;
  }
}
.message__contnr {
  display: flex;
  justify-content: center;
  top: 0px;
  left: 50vw;
  position: fixed;
}
.message__background {
  width: 100vw;
  height: 100vh;
  background-color: #4444447c;
  position: fixed;
  display: flex;
  justify-content: center;
}
.one-message {
  background-color: #fff;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  margin-top: 15vh;
}
.message__text {
  padding-top: 10%;
  text-align: center;
  font-weight: bold;
}
.message__btn {
  background-color: #444;
  border: none;
  color: white;
  padding: 8px 20px;
  text-decoration: none;
  display: inline-block;
  font-size: 16px;
  transition: background-color 0.2s;
  margin-top: auto;
}
.message__btn:hover {
  background-color: #af66d4;
}
</style>
