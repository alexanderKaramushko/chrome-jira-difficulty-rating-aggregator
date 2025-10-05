import { useEffect, useState } from 'react';
import { PieChart } from 'react-minimal-pie-chart';

const RED = '#ff0000';
const ORANGE = '#ff9900';
const GREEN = '#339966';

const colors = {
  hard: RED,
  medium: ORANGE,
  light: GREEN,
};

const labels = {
  hard: 'Сложные',
  medium: 'Средние',
  light: 'Простые',
};

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
    <div style={{ width: '250px' }} className='p-2'>
      {Object.values(levels).some((count) => count > 0) ? (
        <>
          <p>
            <strong>Кол-во чекпоинтов по сложности:</strong>
          </p>
          <ul className='list-group'>
            {Object.entries(levels).map(([level, count]) => (
              <li className='list-group-item' style={{ color: colors[level] }}>
                {labels[level]}: {count}
              </li>
            ))}
          </ul>
          <PieChart
            data={Object.entries(levels)
              .filter(([level, count]) => count > 0)
              .map(([level, count]) => ({
                title: labels[level],
                value: count,
                color: colors[level],
              }))}
            lineWidth={45}
            label={({ dataEntry }) => dataEntry.title}
            labelStyle={{
              fontSize: '5px',
              fontFamily: 'sans-serif',
            }}
            radius={25}
            labelPosition={110}
          />
        </>
      ) : (
        <p>Выберите чекпоинты для отображения результатов</p>
      )}
    </div>
  );
}
