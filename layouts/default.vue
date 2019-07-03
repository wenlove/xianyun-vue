<template>
  <div>
    <Header/>
    <!-- 内容占位符 -->
    <nuxt/>
    <Footer/>
  </div>
</template>
<script>
import Header from "@/components/header";
import Footer from "@/components/footer";
export default {
  components: {
    Header,
    Footer
  }
};
</script>
<style>
* {
  margin: 0;
  padding: 0;
  /* box-sizing: border-box; */
}
img {
  width: 100%;
  height: auto;
}

a {
  text-decoration: none;
  color: inherit;
}
em,
i {
  font-style: normal;
}
input {
  outline: none;
  border:0;
}
</style>
