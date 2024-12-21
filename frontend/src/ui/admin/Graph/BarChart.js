import React, { useEffect, useState } from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { apiGetCountRatings } from '../../../apis';

const BarChartExample = () => {
  const [count, setCount] = useState(null);

  const fetchCount = async () => {
      const response = await apiGetCountRatings();
      if (response.success) 
        setCount(response.data);

  };

  useEffect(() => {
    fetchCount();
  }, []);

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={count ? Object.entries(count).map(([key, value]) => ({ name: key, uv: value })) : []}>
        <XAxis dataKey="name" stroke="#8884d8" />
        <YAxis />
        <Tooltip />
        <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
        <Bar dataKey="uv" fill="#8884d8" barSize={30} />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default BarChartExample;
