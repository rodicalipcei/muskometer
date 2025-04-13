<template>
  <div class="card rating-poll">
    <h2>Rate Elon Musk from 0 to 10: 
      <span class="current-rating">{{ currentRating }}</span></h2>
    
    <div v-if="!hasVoted">
      <div class="rating-slider-container">
        <div class="rating-slider-track">
          <input 
            type="range" 
            min="0" 
            max="10" 
            step="1" 
            v-model.number="currentRating" 
            class="rating-slider"
          />
        </div>
      </div>
      
      <button 
        @click="submitRating" 
        class="submit-button"
        :disabled="isSubmitting"
      >
        {{ isSubmitting ? 'SUBMITTING...' : 'SUBMIT VOTE' }}
      </button>
      
      <p class="rating-note">
        Submit vote to see the results of the poll.
      </p>
    </div>
    
    <div v-else class="voted-message">
      <p>Thank you for your vote!</p>
      <p class="voted-value">Your rating: <span>{{ submittedRating }}</span></p>
    </div>
    
    <p v-if="totalVotes > 0" class="vote-stats">
      {{ totalVotes }} votes, last 30 days
    </p>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';

const currentRating = ref(5);
const isSubmitting = ref(false);
const submittedRating = ref(5);

// Add props for total votes and voting status
const props = defineProps<{
  totalVotes: number;
  hasVoted: boolean;
}>();

onMounted(() => {
  // Force a re-render to ensure the slider position matches the value
  currentRating.value = 5;
  
  // Check if there's a saved rating value in sessionStorage
  const savedRating = sessionStorage.getItem('muskometer_rating');
  if (savedRating) {
    submittedRating.value = parseInt(savedRating, 10);
  }
});

const submitRating = async () => {
  isSubmitting.value = true;
  
  try {
    console.log('Submitting rating:', currentRating.value);
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Save the submitted rating to display later
    submittedRating.value = currentRating.value;
    sessionStorage.setItem('muskometer_rating', currentRating.value.toString());
    
    emit('rating-submitted', currentRating.value);
  } catch (error) {
    console.error('Error submitting rating:', error);
  } finally {
    isSubmitting.value = false;
  }
};

const emit = defineEmits<{
  (e: 'rating-submitted', rating: number): void
}>();
</script>

<style scoped>
.current-rating{
  color: var(--primary-color);
  font-size:1.5rem;
}

.card {
  background-color: var(--card-background);
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.rating-poll {
  text-align: center;
}

.rating-slider-container {
  margin: 2rem 0;
  position: relative;
  padding: 0 10px;
}

.rating-slider-track {
  position: relative;
  height: 8px;
  border-radius: 4px;
  background: linear-gradient(to right, red, yellow, lime);
  margin: 0 10px;
}

.rating-slider {
  position: absolute;
  top: 50%;
  left: 0;
  transform: translateY(-50%);
  width: 100%;
  height: 30px;
  margin: 0;
  -webkit-appearance: none;
  appearance: none;
  background: transparent;
  outline: none;
  cursor: pointer;
}

/* Webkit browsers (Chrome, Safari) */
.rating-slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: var(--primary-color);
  cursor: pointer;
  border: 2px solid white;
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.3);
}

/* Firefox */
.rating-slider::-moz-range-thumb {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: var(--primary-color);
  cursor: pointer;
  border: 2px solid white;
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.3);
}

/* Hide the default track in Firefox */
.rating-slider::-moz-range-track {
  background: transparent;
}

.submit-button {
  background-color: var(--primary-color);
  color: white;
  border: none;
  border-radius: 20px;
  padding: 0.75rem 2rem;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.3s;
}

.submit-button:hover {
  background-color: #e64a8f;
}

.submit-button:disabled {
  background-color: #9b3462;
  cursor: not-allowed;
}

/* Style for the vote stats */
.vote-stats {
  margin-top: 1rem;
  color: var(--text-gray);
  font-size: 0.9rem;
}

.rating-note {
  margin-top: 1rem;
  color: var(--text-gray);
  font-size: 0.8rem;
  font-style: italic;
}

.voted-message {
  margin: 2rem 0;
  padding: 1rem;
  border-radius: 8px;
  background-color: rgba(255, 86, 160, 0.1);
  border: 1px solid rgba(255, 86, 160, 0.3);
}

.voted-value {
  margin: 0.5rem 0;
  font-size: 1.2rem;
}

.voted-value span {
  font-weight: bold;
  color: var(--primary-color);
}
</style>