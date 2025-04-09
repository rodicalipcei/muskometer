// API service to handle all API calls

// Base URL from environment variables
// const API_URL = import.meta.env.VITE_API_URL;

// Types
export interface Quote {
  id: number;
  text: string;
  date: string;
}

export interface RatingData {
  averageRating: number;
  totalVotes: number;
}

export interface HistoricalRating {
  date: string;
  rating: number;
}

// API functions
export const apiService = {
  /**
   * Get the quote of the day
   */
  async getQuoteOfTheDay(): Promise<Quote> {
    try {
      // In a real app, this would be an actual API call
      // const response = await fetch(`${API_URL}/quotes/today`);
      // if (!response.ok) throw new Error('Failed to fetch quote');
      // return await response.json();
      
      // Mock data for development
      return {
        id: 1,
        text: "I have not personally committed violence, nor have I ever advocated that others engage in violence, yet the left has firebombed and shot bullets into my stores and many have advocated for my death.\n\nThey are guilty of that which they accuse me.",
        date: new Date().toISOString().split('T')[0]
      };
    } catch (error) {
      console.error('Error fetching quote of the day:', error);
      throw error;
    }
  },

  /**
   * Get current rating statistics
   */
  async getCurrentRating(): Promise<RatingData> {
    try {
      // In a real app, this would be an actual API call
      // const response = await fetch(`${API_URL}/ratings/current`);
      // if (!response.ok) throw new Error('Failed to fetch current rating');
      // return await response.json();
      
      // Mock data for development
      return {
        averageRating: 5.0,
        totalVotes: 10
      };
    } catch (error) {
      console.error('Error fetching current rating:', error);
      throw error;
    }
  },

  /**
   * Submit a new rating
   * TODO:
   *  async submitRating(rating: number): Promise<RatingData> {
   */
  async submitRating(): Promise<RatingData> {
    try {
      // In a real app, this would be an actual API call
      // const response = await fetch(`${API_URL}/ratings`, {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json'
      //   },
      //   body: JSON.stringify({ rating })
      // });
      // if (!response.ok) throw new Error('Failed to submit rating');
      // return await response.json();
      
      // Mock response for development
      return {
        averageRating: 5.2,
        totalVotes: 11
      };
    } catch (error) {
      console.error('Error submitting rating:', error);
      throw error;
    }
  },

  /**
   * Get historical rating data
   */
  async getHistoricalRatings(period: string): Promise<HistoricalRating[]> {
    try {
      // In a real app, this would be an actual API call
      // const response = await fetch(`${API_URL}/ratings/history?period=${period}`);
      // if (!response.ok) throw new Error('Failed to fetch historical ratings');
      // return await response.json();
      
      // Mock data for development
      const data: HistoricalRating[] = [];
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
      
      const today = new Date();
      for (let i = days; i >= 0; i -= (days > 180 ? 7 : 1)) {
        const date = new Date(today);
        date.setDate(today.getDate() - i);
        
        // Generate slightly random ratings that hover around 5
        const baseRating = 5;
        const randomVariation = Math.random() * 3 - 1.5; // Between -1.5 and 1.5
        const rating = Math.max(0, Math.min(10, baseRating + randomVariation));
        
        data.push({
          date: date.toISOString().split('T')[0],
          rating: parseFloat(rating.toFixed(1))
        });
      }
      
      return data;
    } catch (error) {
      console.error('Error fetching historical ratings:', error);
      throw error;
    }
  }
};

export default apiService;