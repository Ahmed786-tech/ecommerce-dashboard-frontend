import { ref } from 'vue';
import api from '../services/api';
import {formatDate} from '../utils/dateFormat';

interface DashboardData {
  inventory: {
    totalProducts: number;
    totalStock: number;
    lowStock: number;
    outOfStock: number
  };
  stats: {
    totalRevenue: number
    totalOrders: number
    totalCustomers: number,
    lowStock: number
    recentOrders: number
},
  analytics: {
    revenue: ChartData;
    sales: ChartData;
    orders: ChartData;
  };
}

interface ChartData {
  categories: string[];
  series: { name: string; data: number[] }[];
}

export const useDashboard = () => {
  const dashboardData = ref<DashboardData | null>(null);
  const loading = ref(false);
  const error = ref<string | null>(null);

  const fetchDashboardData = async (startDate: string, endDate: string) => {
    try {
      loading.value = true;
      const formattedStart = formatDate(startDate);
      const formattedEnd = formatDate(endDate);
      const response = await api.get('/dashboard',{
        params: {
          startDate: formattedStart,
          endDate: formattedEnd
        }
      });
      const data = response.data;
      dashboardData.value = {
        inventory: {
          totalProducts: data.totalProducts,
          totalStock: data.totalStock ?? 0,
          lowStock: data.lowStock,
          outOfStock: data.outOfStock
        },
        stats: {
            totalRevenue: data.totalRevenue,
            totalOrders: data.totalOrders,
            totalCustomers: data.totalCustomers,
            lowStock: data.lowStock,
            recentOrders: data.recentOrders,
        },
        analytics: {
          revenue: transformRevenueByDate(data?.revenueByDate),
          sales: transformSalesByCategory(data?.salesByCategory),
          orders: transformOrdersByDate(data?.ordersByDate), 
        },
      };
    } catch (err) {
      error.value = 'Failed to load dashboard data';
    } finally {
      loading.value = false;
    }
  };

 const transformSalesByCategory = (salesByCategory: any[]): ChartData => {
    const categorySet = new Set<string>();
    const dateLabels: string[] = [];
  
    salesByCategory.forEach(entry => {
      dateLabels.push(entry.date);
      entry.categories.forEach((cat: any) => {
        categorySet.add(cat.category);
      });
    });
  
    const categories = Array.from(categorySet);
    const series = categories.map(category => {
      return {
        name: category,
        data: salesByCategory.map(entry => {
          const found = entry.categories.find((cat: any) => cat.category === category);
          return found ? found.totalSales : 0;
        })
      };
    });
  
    return {
      categories: dateLabels,
      series
    };
  };

  const transformOrdersByDate = (ordersByDate: any[]): ChartData => {
    const categories = ordersByDate.map(order => order._id);
    const series = [
      {
        name: 'Orders',
        data: ordersByDate.map(order => order.totalOrders)
      }
    ];
  
    return {
      categories,
      series
    };
  };

  const transformRevenueByDate = (revenueByDate: any[]): ChartData => {
    const categories = revenueByDate?.map(entry => entry._id);
    const series = [
      {
        name: 'Revenue',
        data: revenueByDate.map(entry => entry.totalRevenue)
      }
    ];
  
    return {
      categories,
      series
    };
  };

  return {
    dashboardData,
    loading,
    error,
    fetchDashboardData,
  };
};


  