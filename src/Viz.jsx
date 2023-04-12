const width = 500;
const height = 200;

// A sentinel value representing that the answer was not chosen.
const notChosen = '[^not chosen]';

export const Viz = ({ dataset }) => {
  console.log(dataset.main.columns);

  const columns = [
    'DataVizRoles_Freelance',
    'DataVizRoles_Employee',
    'DataVizRoles_Hobbyist',
    'DataVizRoles_Student',
    'DataVizRoles_Academic',
    'DataVizRoles_PassiveIncome',
    'DataVizRoles_PreferNot',
  ];

  // Initialize counts to 0.
  const counts = new Map(columns.map((column) => [column, 0]));

  for (const d of dataset.main) {
    for (const column of columns) {
      if (d[column] !== notChosen) {
        counts.set(column, counts.get(column) + 1);
      }
    }
  }

  console.log(counts);
  return <svg width={width} height={height} />;
};
