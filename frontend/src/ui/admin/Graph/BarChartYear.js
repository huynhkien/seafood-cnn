import React, { useEffect, useState } from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { apiGetTotalYear } from '../../../apis';

const BarChartExample = () => {
  const [count, setCount] = useState([]);

  const fetchCount = async () => {
      const response = await apiGetTotalYear();
      if (response.success) 
        setCount(response.data);

  };

  useEffect(() => {
    fetchCount();
  }, []);

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={count}>
        <XAxis dataKey="year" stroke="#8884d8" />
        <YAxis />
        <Tooltip />
        <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
        <Bar dataKey="totalAmount" fill="#8884d8" barSize={30} />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default BarChartExample;
