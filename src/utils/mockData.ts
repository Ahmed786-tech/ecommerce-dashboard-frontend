// utils/mockData.ts
interface ChartData {
    labels: string[];
    sales: number[];
    orders: number[];
  }
  
  interface MockChartData {
    Daily: ChartData;
    Weekly: ChartData;
    Monthly: ChartData;
    Annually: ChartData;
  }
  
  const generateTimeSeries = (count: number, startDate: Date, interval: number) => {
    const data = [];
    let current = new Date(startDate);
    for (let i = 0; i < count; i++) {
      data.push(current.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
      current = new Date(current.getTime() + interval);
    }
    return data;
  };
  
  export const mockChartData: MockChartData = {
    Daily: {
      labels: generateTimeSeries(24, new Date(2024, 0, 1, 0, 0), 60 * 60 * 1000), // Hourly intervals
      sales: Array.from({ length: 24 }, () => Math.floor(Math.random() * 5000 + 1000)),
      orders: Array.from({ length: 24 }, () => Math.floor(Math.random() * 200 + 50))
    },
    Weekly: {
      labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      sales: [4500, 5200, 4800, 6100, 7800, 9500, 8200],
      orders: [120, 150, 140, 180, 210, 280, 240]
    },
    Monthly: {
      labels: Array.from({ length: 30 }, (_, i) => `Day ${i + 1}`),
      sales: Array.from({ length: 30 }, () => Math.floor(Math.random() * 8000 + 2000)),
      orders: Array.from({ length: 30 }, () => Math.floor(Math.random() * 300 + 100))
    },
    Annually: {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
      sales: [120000, 110000, 135000, 125000, 140000, 160000, 155000, 165000, 150000, 170000, 185000, 250000],
      orders: [3200, 3000, 3400, 3300, 3600, 4000, 3900, 4100, 3800, 4200, 4400, 5800]
    }
  };
  
  // Example of category filter data (for revenue by category)
  export const categoryData = {
    labels: ['Electronics', 'Clothing', 'Home Goods', 'Beauty', 'Sports'],
    sales: [150000, 120000, 90000, 75000, 60000],
    orders: [4500, 3800, 2800, 2200, 1800]
  };