<template>
  <div class="card gauge-container">
    <h2>Muskometer</h2>
    <p class="subtitle">The Ultimate Elon Musk Opinion Poll</p>
    
    <div class="gauge">
      <svg viewBox="0 0 200 120" class="gauge-svg">
        <!-- Gray background arc -->
        <path
          d="M20,100 A80,80 0 0,1 180,100"
          stroke="#444"
          stroke-width="12"
          fill="none"
        />
        
        <!-- Colored arc representing the rating -->
        <path
          :d="ratingArcPath"
          :stroke="gradientUrl"
          stroke-width="12"
          fill="none"
        />
        
        <!-- Rating pointer -->
        <line
          :x1="pointerStartX"
          :y1="pointerStartY"
          :x2="pointerEndX"
          :y2="pointerEndY"
          stroke="var(--primary-color)"
          stroke-width="2"
        />
        
        <!-- Pointer circle -->
        <circle
          :cx="pointerEndX"
          :cy="pointerEndY"
          r="6"
          fill="var(--primary-color)"
        />
        
        <!-- Rating labels and emoji faces -->
        <g v-for="position in positions" :key="position.value">
          <circle
            :cx="position.x"
            :cy="position.y"
            r="12"
            fill="#333"
            stroke="#555"
            stroke-width="1"
          />
          <text
            :x="position.x"
            :y="position.y"
            text-anchor="middle"
            dominant-baseline="middle"
            font-size="10"
            fill="white"
          >
            {{ getFaceForRating(position.value) }}
          </text>
        </g>
        
        <!-- Define gradient for the rating arc -->
        <defs>
          <linearGradient id="ratingGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stop-color="red" />
            <stop offset="50%" stop-color="yellow" />
            <stop offset="100%" stop-color="lime" />
          </linearGradient>
        </defs>
      </svg>
      
      <div class="gauge-stats">
        <p>Average: {{ averageRating.toFixed(1) }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

// Props
const props = defineProps<{
  averageRating: number;
  totalVotes: number;
  hasVoted: boolean;
}>();


// Computed values for SVG drawing
const gradientUrl = computed(() => 'url(#ratingGradient)');

// Calculate the path for the colored arc based on the rating
const ratingArcPath = computed(() => {
  // Map rating 0-10 to an angle 0-180 degrees
  const angle = (props.averageRating / 10) * 180;
  const radians = (angle * Math.PI) / 180;
  
  // Calculate end point on the arc
  const x = 100 - 80 * Math.cos(radians);
  const y = 100 - 80 * Math.sin(radians);
  
  // Create arc path - 0 starts from the right (3 o'clock position)
  // We need to flip it to start from the left
  return `M20,100 A80,80 0 0,1 ${x},${y}`;
});

// Calculate pointer position
const pointerStartX = computed(() => 100);
const pointerStartY = computed(() => 100);
const pointerEndX = computed(() => {
  const angle = (props.averageRating / 10) * Math.PI;
  return 100 - 65 * Math.cos(angle);
});
const pointerEndY = computed(() => {
  const angle = (props.averageRating / 10) * Math.PI;
  return 100 - 65 * Math.sin(angle);
});

// Calculate positions for the rating markers (0, 5, 10)
const positions = computed(() => {
  const positions = [];
  
  for (let i = 0; i <= 10; i += 5) {
    const angle = (i / 10) * Math.PI;
    positions.push({
      value: i,
      x: 100 - 80 * Math.cos(angle),
      y: 100 - 80 * Math.sin(angle)
    });
  }
  
  return positions;
});

// Function to return the appropriate face emoji based on rating value
const getFaceForRating = (rating: number): string => {
  if (rating <= 3) {
    return '😞'; // Sad face for low ratings
  } else if (rating <= 7) {
    return '😐'; // Neutral face for middle ratings
  } else {
    return '😊'; // Happy face for high ratings
  }
};
</script>

<style scoped>
.card {
  background-color: var(--card-background);
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  height: 100%; /* Full height to match history chart */
  display: flex;
  flex-direction: column;
}

.gauge-container {
  text-align: center;
}

.subtitle {
  color: var(--text-gray);
  margin-top: -0.5rem;
  font-size: 0.9rem;
}

.gauge {
  position: relative;
  margin: 1rem auto;
  width: 100%;
  max-width: 300px;
  flex: 1; /* Take up available space */
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.gauge-svg {
  width: 100%;
  height: auto;
}

.gauge-stats {
  margin-top: 1rem;
  display: flex;
  justify-content: center;
}

.gauge-stats p {
  margin: 0;
  font-size: 0.9rem;
}
</style>