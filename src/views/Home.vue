<template>
  <div class="home-container">
    <RatingPoll 
      @rating-submitted="handleRatingSubmitted" 
      :total-votes="totalVotes"
      :has-voted="hasVoted"
    />
    
    <div v-if="hasVoted" class="results-section">
      <RatingGauge 
        :average-rating="averageRating" 
        :total-votes="totalVotes"
        :has-voted="hasVoted"
      />

      <HistoryChart :has-voted="hasVoted" />
    </div>
    
    <QuoteCard :quote="quoteOfTheDay" />
  
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import RatingPoll from '@/components/polls/RatingPoll.vue';
import RatingGauge from '@/components/polls/RatingGauge.vue';
import QuoteCard from '@/components/quotes/QuoteCard.vue';
import HistoryChart from '@/components/charts/HistoryChart.vue';
import apiService from '@/services/apiService';

// State
const hasVoted = ref(false);
const averageRating = ref(0);
const totalVotes = ref(0);

// Quote of the day
const quoteOfTheDay = ref({
  id: 1,
  text: "Loading quote...",
  date: new Date().toISOString().split('T')[0]
});

// Handle rating submission
const handleRatingSubmitted = async (rating: number) => {
  console.log('Rating submitted:', rating);
  
  try {
    // Submit rating to API
    const response = await apiService.submitRating(rating);
    
    // Update UI with returned data
    averageRating.value = response.averageRating;
    totalVotes.value = response.totalVotes;
    
    // Mark as voted
    hasVoted.value = true;
    
    // Store vote in sessionStorage to remember the user has voted for this session
    sessionStorage.setItem('muskometer_voted', 'true');
  } catch (error) {
    console.error('Error submitting rating:', error);
    
    // Fallback behavior
    const oldTotal = averageRating.value * totalVotes.value;
    totalVotes.value += 1;
    averageRating.value = (oldTotal + rating) / totalVotes.value;
    hasVoted.value = true;
    
    // Store vote in sessionStorage even if API fails
    sessionStorage.setItem('muskometer_voted', 'true');
  }
};

// Check if user has already voted in this session
const checkIfVoted = () => {
  const hasVotedInSession = sessionStorage.getItem('muskometer_voted');
  
  if (hasVotedInSession === 'true') {
    hasVoted.value = true;
  }
};

// Fetch initial data
onMounted(async () => {
  try {
    // Check if user has already voted
    checkIfVoted();
    
    // Fetch quote of the day
    const quote = await apiService.getQuoteOfTheDay();
    quoteOfTheDay.value = quote;
    console.log("Quote fetched:", quote);
    
    // Fetch current rating stats
    const stats = await apiService.getCurrentRating();
    averageRating.value = stats.averageRating;
    totalVotes.value = stats.totalVotes;
    
  } catch (error) {
    console.error('Error fetching initial data:', error);
  }
});
</script>

<style scoped>
.home-container {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.results-section {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  animation: fadeIn 0.5s ease-in-out;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@media (max-width: 768px) {
  .home-container {
    gap: 1rem;
  }
  
  .results-section {
    gap: 1rem;
  }
}
</style>