<template>
  <div class="about-container">
    <div class="card">
      <h1>About Muskometer</h1>
      
      <p>
        Muskometer is a platform that allows users to rate Elon Musk's public statements and actions on a scale from 0 to 10. 
        The app aggregates these ratings to provide a real-time, crowdsourced gauge of public opinion about one of the world's 
        most influential and controversial entrepreneurs.
      </p>
      
      <h2>How It Works</h2>
      
      <p>
        Every day, we feature a recent quote or action from Elon Musk. Users can submit their rating from 0 to 10, with 0 being 
        extremely negative and 10 being extremely positive. Once you submit your rating, you'll see how others have rated the 
        same content and historical trends.
      </p>
      
      <h2>Our Mission</h2>
      
      <p>
        Our goal is to create a neutral platform that tracks public sentiment about Elon Musk's statements and actions over time. 
        We don't take a position on whether Musk's influence is positive or negative - we simply provide the data and let you 
        draw your own conclusions.
      </p>
      
      <h2>Privacy</h2>
      
      <p>
        Muskometer collects anonymous rating data. We don't store personal information about our users or share individual 
        rating data with third parties. The only information we collect is the rating value and timestamp.
      </p>
      
      <h2>Contact</h2>
      
      <p>
        Have questions, suggestions, or feedback? Reach out to us at:
        <a href="mailto:contact@muskometer.com">contact@muskometer.com</a>
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
  padding: 2rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

h1 {
  color: var(--primary-color);
  margin-top: 0;
}

h2 {
  color: var(--primary-color);
  margin-top: 2rem;
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