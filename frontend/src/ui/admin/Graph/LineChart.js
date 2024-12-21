import React, { useEffect, useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { apiGetTotalDay } from '../../../apis';

const BarChartExample = () => {
  const [data, setData] = useState([]);

  const fetchCount = async () => {
      const response = await apiGetTotalDay();
      if (response.success) 
        setData(response.data);
  };

  useEffect(() => {
    fetchCount();
  }, []);
  return (
    <ResponsiveContainer width="95%" height={300}>
      <AreaChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip />
        <Area type="monotone" dataKey="totalAmount" stroke="#8884d8" fill="#8884d8" />
      </AreaChart>
    </ResponsiveContainer>
  );
};

export default BarChartExample;
