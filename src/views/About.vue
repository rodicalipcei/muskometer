<template>
  <div class="about-container">
    <div class="card">
      <h2>About Muskometer</h2>
      
      <p>
        Welcome to Muskometer, where your opinion on Elon Musk takes center stage!
        Rate the entrepeneur turned politician from 0 to 10 and see how your vote stacks up against the crowd.
        Curious about the world's take on Elon? Check out the live average of all votes-updated with every click.
      </p>
      
      <h2>Contact</h2>
      
      <p>
        Have questions, suggestions, or feedback? Reach out to us at:
        <a href="mailto:luncaapei@gmail.com">luncaapei@gmail.com</a>
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
// No additional script needed for this component
</script>

<style scoped>
.about-container {
  max-width: 800px;
  margin: 0 auto;
}

.card {
  background-color: var(--card-background);
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

h2 {
  color: var(--primary-color);
}

p {
  line-height: 1.6;
  margin-bottom: 1rem;
}

a {
  color: var(--primary-color);
  text-decoration: none;
}

a:hover {
  text-decoration: underline;
}
</style>