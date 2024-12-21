"use client";
import React, { useEffect, useState } from 'react';
import { ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { apiGetCountStatus } from '../../../apis';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const PieChartExample = () => {
  const [count, setCount] = useState([]);

  useEffect(() => {
    const fetchCount = async () => {
        const response = await apiGetCountStatus();
        if (response.success) 
          setCount(response.data);
    };

    fetchCount();
  }, []);

  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * (Math.PI / 180));
    const y = cy + radius * Math.sin(-midAngle * (Math.PI / 180));
  
    return (
      <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };
  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
      <Pie
          data={count ? Object.entries(count).map(([status, value]) => ({ status, value })) : []}
          cx="50%"
          cy="50%"
          labelLine={false}
          label={renderCustomizedLabel}
          outerRadius={135}
          fill="#8884d8"
          dataKey="value"
          nameKey="status"
        >
          {count &&
            Object.keys(count).map((status, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
        </Pie>
        <Legend align="center" verticalAlign="bottom" layout="horizontal" />
      </PieChart>
    </ResponsiveContainer>
  );
};

export default PieChartExample;
