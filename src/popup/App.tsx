
import { useEffect, useState } from 'react';
import { PieChart } from 'react-minimal-pie-chart';

const RED = '#ff0000';
const ORANGE = '#ff9900';
const GREEN = '#008000';

const colors = {
  hard: RED,
  medium: ORANGE,
  light: GREEN,
}

const labels = {
  hard: 'Сложные',
  medium: 'Средние',
  light: 'Простые',
}

export function App() {
  const [levels, setLevels] = useState<Record<string, number>>({});

  useEffect(() => {
    chrome.storage.sync.get('levels').then(({ levels }) => {
      setLevels(levels);
    });

    chrome.runtime.onMessage.addListener((message) => {
      if (message.type === 'aggregated') {
        setLevels(message.payload.levels);
      }
    });
  }, []);

  return (
    <div style={{ width: '200px' }} className="m-2">
      <p><strong>Кол-во чекпоинтов по сложности:</strong></p>
      <ul className="list-group">
        {Object.entries(levels).map(([level, count]) => (
          <li
            className="list-group-item"
            style={{ color: colors[level] }}
          >{labels[level]}: {count}</li>
        ))}
      </ul>
      <p className='mt-2'><strong>Преобладающая оценка сложности:</strong></p>
      <PieChart
        data={Object.entries(levels).map(([level, count]) => ({
          title: labels[level],
          value: count,
          color: colors[level]
        }))}
        lineWidth={60}
        label={({ dataEntry }) => dataEntry.title}
        labelStyle={{
          fontSize: '5px',
          fontFamily: 'sans-serif',
        }}
        radius={42}
        labelPosition={110}
      />
    </div>
  );
}
