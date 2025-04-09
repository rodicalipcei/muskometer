<template>
  <div class="card chart-card" v-if="hasVoted">
    <h2>Historical Ratings</h2>
    
    <div class="chart-container">
      <div class="chart-wrapper">
        <LineChart 
          :chart-data="chartData" 
          :options="chartOptions" 
        />
      </div>
    </div>
    
    <div class="chart-controls">
      <button 
        v-for="(period, index) in timePeriods" 
        :key="index"
        @click="selectTimePeriod(period.value)"
        :class="{ active: selectedPeriod === period.value }"
        class="period-button"
      >
        {{ period.label }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { Line as LineChart } from 'vue-chartjs';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

// Register ChartJS components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

// Define props
const props = defineProps<{
  hasVoted: boolean;
}>();

// Time period options
const timePeriods = [
  { label: '1M', value: '1month' },
  { label: '3M', value: '3months' },
  { label: '6M', value: '6months' },
  { label: '1Y', value: '1year' },
  { label: 'ALL', value: 'all' }
];

// State
const selectedPeriod = ref('1month');
const historicalData = ref<{ date: string; rating: number }[]>([]);

// Select time period
const selectTimePeriod = (period: string) => {
  selectedPeriod.value = period;
  fetchHistoricalData(period);
};

// Fetch historical data based on time period
const fetchHistoricalData = async (period: string) => {
  // This is mock data for demonstration
  const mockData = generateMockData(period);
  historicalData.value = mockData;
};

// Generate mock data for demonstration
const generateMockData = (period: string) => {
  const data = [];
  let days = 30;
  
  switch (period) {
    case '3months':
      days = 90;
      break;
    case '6months':
      days = 180;
      break;
    case '1year':
      days = 365;
      break;
    case 'all':
      days = 730; // ~2 years
      break;
  }
  
  // Reduce the number of data points to avoid overcrowding
  const interval = period === '1month' ? 3 : (period === '3months' ? 7 : 14);
  
  const today = new Date();
  for (let i = days; i >= 0; i -= interval) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    
    // Generate slightly random ratings that hover around 5
    const baseRating = 5;
    const randomVariation = Math.random() * 1.5 - 0.75; // Less variation for cleaner chart
    const rating = Math.max(0, Math.min(10, baseRating + randomVariation));
    
    data.push({
      date: date.toISOString().split('T')[0],
      rating: parseFloat(rating.toFixed(1))
    });
  }
  
  return data;
};

// Computed properties for the chart
const chartData = computed(() => {
  return {
    labels: historicalData.value.map(item => {
      // Format date labels based on period
      const date = new Date(item.date);
      if (selectedPeriod.value === '1month') {
        return `${date.getDate()}/${date.getMonth() + 1}`;
      } else if (selectedPeriod.value === '3months') {
        return `${date.getDate()}/${date.getMonth() + 1}`;
      } else {
        return `${date.getMonth() + 1}/${date.getFullYear().toString().substr(2, 2)}`;
      }
    }),
    datasets: [
      {
        label: 'Average Rating',
        backgroundColor: 'rgba(255, 86, 160, 0.2)',
        borderColor: 'rgba(255, 86, 160, 1)',
        borderWidth: 2,
        pointBackgroundColor: 'rgba(255, 86, 160, 1)',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: 'rgba(255, 86, 160, 1)',
        data: historicalData.value.map(item => item.rating)
      }
    ]
  };
});

const chartOptions = computed(() => {
  return {
    responsive: true,
    maintainAspectRatio: false,
    layout: {
      padding: {
        bottom: 30 // Add padding at the bottom for x-axis labels
      }
    },
    scales: {
      y: {
        min: 3.5, // Set a smaller range to make variations more visible
        max: 6.5,
        grid: {
          color: 'rgba(255, 255, 255, 0.1)'
        },
        ticks: {
          color: 'rgba(255, 255, 255, 0.7)'
        }
      },
      x: {
        grid: {
          color: 'rgba(255, 255, 255, 0.1)'
        },
        ticks: {
          color: 'rgba(255, 255, 255, 0.7)',
          maxRotation: 45,
          minRotation: 45,
          autoSkip: true,
          maxTicksLimit: 10, // Limit the number of ticks to avoid crowding
          font: {
            size: 10 // Smaller font size
          },
          padding: 5 // Add padding to the ticks
        }
      }
    },
    plugins: {
      legend: {
        labels: {
          color: 'rgba(255, 255, 255, 0.7)'
        }
      }
    }
  };
});

// Fetch initial data on component mount
onMounted(() => {
  fetchHistoricalData(selectedPeriod.value);
});
</script>

<style scoped>
.card {
  background-color: var(--card-background);
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.chart-card h2 {
  margin-top: 0;
  margin-bottom: 1rem;
}

.chart-container {
  width: 100%;
  margin-bottom: 30px; /* Add margin at the bottom */
}

.chart-wrapper {
  position: relative;
  width: 100%;
}

.chart-controls {
  display: flex;
  justify-content: center;
  margin-top: 1rem;
  gap: 0.5rem;
}

.period-button {
  background-color: transparent;
  border: 1px solid var(--text-gray);
  color: var(--text-gray);
  border-radius: 4px;
  padding: 0.3rem 0.8rem;
  cursor: pointer;
  transition: all 0.3s;
}

.period-button.active {
  background-color: var(--primary-color);
  border-color: var(--primary-color);
  color: white;
}

.period-button:hover:not(.active) {
  border-color: var(--primary-color);
  color: var(--primary-color);
}
</style>