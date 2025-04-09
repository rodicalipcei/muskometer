<template>
  <div class="card rating-poll">
    <h2>Rate Elon Musk from 0 to 10: {{ currentRating }}</h2>
    
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
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';

const currentRating = ref(5);
const isSubmitting = ref(false);

onMounted(() => {
  // Force a re-render to ensure the slider position matches the value
  currentRating.value = 5;
});

const submitRating = async () => {
  isSubmitting.value = true;
  
  try {
    console.log('Submitting rating:', currentRating.value);
    await new Promise(resolve => setTimeout(resolve, 1000));
    
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
</style>