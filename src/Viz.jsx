const width = 500;
const height = 200;

// A sentinel value representing that the answer was not chosen.
const notChosen = '[^not chosen]';

export const Viz = ({ dataset }) => {
  const dictionaryMap = new Map(dataset.dictionary.map((d) => [d.Variable, d]));

  const questions = dataset.main.columns
    .filter((column) => column.endsWith('_') && !column.endsWith('__'))
    .map((questionColumn) => ({
      questionColumn,
    }));

  for (const question of questions) {
    const { questionColumn } = question;
    question.text = dictionaryMap.get(questionColumn).qrText_2022;
    question.answerColumns = dataset.main.columns.filter(
      (column) => column.startsWith(questionColumn) && column !== questionColumn
    );
  }
  console.log(JSON.stringify(questions, null, 2));
  //console.log(JSON.stringify(questions, null, 2));

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

  //console.log(counts);
  return <svg width={width} height={height} />;
};
