<script setup>

</script>

<template>
  <footer>
    <div class="footer-container">
      <ul class="foot-list">
        <li><a href="https://www.instagram.com/thirdpartylive/" target="_blank" >Instargram</a></li>
        <li><a href="https://www.threads.com/@thirdpartylive" target="_blank">Threads</a></li>
        <li><a href="https://www.youtube.com/@thirdpartychannel" target="_blank" >Youtube</a></li>
        <li><a href="https://prog.djthirdparty.com" target="_blank">Team Progressive House</a></li>
      </ul>
      <div class="foot-copy">© 2026, THIRD Ξ PARTY </div>
    </div>
  </footer>
</template>

<style>
.footer-container {
  position: relative;
  height: 230px;
  border-top: 1px solid #eee;
  margin: 0 50px;
}
.foot-list {
  display: flex;
  align-items: center;
  justify-content: end;
  margin-top: 20px;
}
.foot-list li{
  padding: 0 10px;
}
.foot-list li a:hover {
  font-weight: bold;
}
.foot-copy {
  position: absolute;
  bottom: 50px;
}
/* 모바일 (320px 이상) */
@media (min-width: 320px) {
  /* 스타일 정의 */
}

@media (max-width: 429px) {
  .footer-container {
    margin: 0 30px;
  }
  .foot-list {
    margin-top: 20px;
    padding: 0;
  }
  .foot-list li{
    padding: 0 10px;
  }
  .foot-copy {
    bottom: 30px;
    font-size: 14px;
  }
}

@media (min-width: 430px) and (max-width: 600px) {
  .footer-container {
    margin: 0 30px;
  }
  .foot-list {
    margin-top: 20px;
    padding: 0;
  }
  .foot-list li{
    padding: 0 10px;
  }
  .foot-copy {
    bottom: 30px;
    font-size: 14px;
  }
}


@media (max-width: 768px) {
  .footer-container {
    margin: 0 30px;
  }
  .foot-list {
    display: flex;
    flex-direction: column;
    margin-top: 20px;
    gap: 10px;
    padding: 0;
  }
}
</style>