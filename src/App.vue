<template>
  <div class="app-container">
    <header>
      <nav>
        <RouterLink to="/">Home</RouterLink> | 
        <RouterLink to="/about">About</RouterLink>
      </nav>
    </header>
    <main>
      <div class="content-container">
        <RouterView />
      </div>
    </main>
    <footer>
      <p>© {{ currentYear }} Muskometer App</p>
      <div class="contact-links">
        <a href="mailto:contact@muskometer.com">contact@muskometer.com</a>
        <a href="https://twitter.com/muskometer">@muskometer</a>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { RouterLink, RouterView } from 'vue-router';

const currentYear = computed(() => new Date().getFullYear());
</script>

<style>
.app-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

header {
  padding: 1rem;
  background-color: var(--background-dark);
  border-bottom: 1px solid #333;
}

nav a {
  color: var(--primary-color);
  text-decoration: none;
  margin: 0 0.5rem;
}

main {
  flex: 1;
  padding: 1rem;
}

.content-container {
  max-width: 800px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

footer {
  padding: 1rem;
  background-color: var(--background-dark);
  border-top: 1px solid #333;
  text-align: center;
  font-size: 0.8rem;
  color: var(--text-gray);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.contact-links {
  display: flex;
  gap: 1rem;
}

.contact-links a {
  color: var(--text-gray);
  text-decoration: none;
}

@media (max-width: 768px) {
  footer {
    flex-direction: column;
    gap: 0.5rem;
  }
}
</style>