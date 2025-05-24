<template>
  <div class="notfound-flex">
    <div class="not-found">
      <h1>404 - Page Not Found</h1>
      <p>Sorry, the page you are looking for does not exist.</p>
    </div>
    <div class="sorry">
      <img src="@/assets/img/sorry.png">
      <a href="/" >Go back to Home</a>
    </div>
  </div>
</template>

<script setup>
</script>

<style scoped lang="scss">
.notfound-flex {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: end;
  height: 80vh;
}
.not-found {
    text-align: center;
    padding: 4rem;
  h1 {
    font-size: 3rem;
    margin-bottom: 1rem;
  }
  p {
    font-size: 1.25rem;
  }
  
}
.sorry {
  position: relative;
  height: 500px;
  img{
    height: 100%;
  }
  a {
    cursor: pointer;
    position: absolute;
    top: 40%;
    left: 0;
    width: 100%;
    text-align: center;
    padding: 20px 0;
    font-size: 2rem;
    background: rgba(255, 255, 255, 0.25);
    box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.37);
    backdrop-filter: blur( 4px );
    -webkit-backdrop-filter: blur( 4px );
    border-radius: 10px;
    border: 1px solid rgba( 255, 255, 255, 0.18 );
    color: #ffffff;
    text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.6);
    cursor: pointer;
    transition: 0.3s;
    &:hover {
    background-color: rgba( 255, 255, 255, 0.1 );
    font-weight: normal;
    }
    &:active {
      background-color: rgba( 255, 255, 255, 0.5 );
    }
  }
}
</style>