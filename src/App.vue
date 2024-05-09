<script setup>
import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
   <div class="wrapper">
      <nav class="navbar navbar-expand-lg">
        <div class="container">
          <div class="collapse navbar-collapse" id="navbarSupportedContent">
            <ul class="navbar-nav ms-auto mb-2 mb-lg-10">

              <li class="nav-item">
                <RouterLink class="nav-link" to="/">Home</RouterLink>
              </li>
              <li class="nav-item">
                <RouterLink class="nav-link" to="/students/create">Create</RouterLink>
              </li>
              <li class="nav-item">
                <RouterLink class="nav-link" to="/students">Students</RouterLink>
              </li>
            </ul>
            
          </div>
        </div>
      </nav>
    </div>
    <div id="index"></div>

  <RouterView />

</template>

<style scoped></style>
