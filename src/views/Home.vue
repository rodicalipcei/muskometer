<template>
  <div class="home-container">
    <RatingPoll 
      @rating-submitted="handleRatingSubmitted" 
      :total-votes="totalVotes"
    />
    
    <RatingGauge 
      :average-rating="averageRating" 
      :total-votes="totalVotes"
      :has-voted="hasVoted"
    />

    <!-- <HistoryChart :has-voted="hasVoted" /> -->
    
    <QuoteCard :quote="quoteOfTheDay" />
  
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import RatingPoll from '@/components/polls/RatingPoll.vue';
import RatingGauge from '@/components/polls/RatingGauge.vue';
import QuoteCard from '@/components/quotes/QuoteCard.vue';
// import HistoryChart from '@/components/charts/HistoryChart.vue';

// State
const hasVoted = ref(false);
const averageRating = ref(0);
const totalVotes = ref(0);

// Quote of the day
const quoteOfTheDay = ref({
  id: 1,
  text: "I have not personally committed violence, nor have I ever advocated that others engage in violence, yet the left has firebombed and shot bullets into my stores and many have advocated for my death.\n\nThey are guilty of that which they accuse me.",
  date: "2023-04-09"
});

// Handle rating submission
const handleRatingSubmitted = (rating: number) => {
  console.log('Rating submitted:', rating);
  hasVoted.value = true;
  
  // In a real application, this would update the server and fetch new data
  // For now, just simulate a slight change in the average
  const oldTotal = averageRating.value * totalVotes.value;
  totalVotes.value += 1;
  averageRating.value = (oldTotal + rating) / totalVotes.value;
};

// Fetch initial data
onMounted(async () => {
  try {
    // TODO: Replace with real API calls
    // Fetch quote of the day, average rating, and total votes
    console.log('Fetching initial data...');
    
    // For demo purposes, set some initial values
    averageRating.value = 5.0;
    totalVotes.value = 10;
    
    // Check if user has already voted today (could be stored in localStorage)
    const storedVote = localStorage.getItem('muskometer_voted_today');
    if (storedVote) {
      hasVoted.value = true;
    }
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

@media (max-width: 768px) {
  .home-container {
    gap: 1rem;
  }
}
</style>