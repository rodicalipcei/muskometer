<template>
  <div class="card quote-card">
    <h2>Quote of the day:</h2>
    
    <div class="tweet-container">
      <div class="tweet-header">
        <div class="tweet-avatar">
          <img src="https://via.placeholder.com/48" alt="User avatar" />
        </div>
        <div class="tweet-user-info">
          <div class="tweet-name">
            Elon Musk
            <span class="verified-badge">✓</span>
          </div>
          <div class="tweet-handle">@elonmusk</div>
        </div>
        <div class="tweet-action">
          <button class="subscribe-button">Subscribe</button>
        </div>
      </div>
      
      <div class="tweet-content">
        <p>{{ quote.text }}</p>
      </div>
      
      <div class="tweet-footer">
        {{ formattedDate }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';

interface Quote {
  id: number;
  text: string;
  date: string;
}

// Prop to receive quote data
const props = defineProps<{
  quote: Quote;
}>();

// Format the date nicely
const formattedDate = computed(() => {
  try {
    const date = new Date(props.quote.date);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  } catch (e) {
    return props.quote.date;
  }
});
</script>

<style scoped>
.card {
  background-color: var(--card-background);
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.quote-card h2 {
  margin-top: 0;
  margin-bottom: 1rem;
}

.tweet-container {
  background-color: #000;
  border-radius: 8px;
  overflow: hidden;
  padding: 1rem;
}

.tweet-header {
  display: flex;
  align-items: center;
  margin-bottom: 0.75rem;
}

.tweet-avatar {
  width: 48px;
  height: 48px;
  margin-right: 0.75rem;
}

.tweet-avatar img {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
}

.tweet-user-info {
  flex: 1;
}

.tweet-name {
  font-weight: bold;
  display: flex;
  align-items: center;
  gap: 4px;
}

.verified-badge {
  color: #1d9bf0;
  font-size: 0.9em;
}

.tweet-handle {
  color: var(--text-gray);
  font-size: 0.9em;
}

.subscribe-button {
  background-color: white;
  color: black;
  border: none;
  border-radius: 20px;
  padding: 0.4rem 1rem;
  font-weight: bold;
  cursor: pointer;
}

.tweet-content {
  margin-bottom: 1rem;
  font-size: 1.1em;
  line-height: 1.4;
}

.tweet-footer {
  color: var(--text-gray);
  font-size: 0.9em;
}
</style>