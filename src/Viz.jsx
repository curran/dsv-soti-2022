import { descending } from 'd3-array';
const width = 500;
const height = 200;

// A sentinel value representing that the answer was not chosen.
const notChosen = '[^not chosen]';

export const Viz = ({ dataset }) => {
  //console.log(JSON.stringify(questions, null, 2));
  const { multipleChoiceQuestions } = dataset;

  for (const question of multipleChoiceQuestions) {
    const columns = question.answerColumns;
    // Initialize counts to 0.

    const counts = new Map(columns.map((column) => [column, 0]));
    for (const d of dataset.main) {
      for (const column of columns) {
        if (d[column] !== notChosen) {
          counts.set(column, counts.get(column) + 1);
        }
      }
    }

    question.answers = Array.from(counts.entries())
      .map(([column, count]) => ({
        column,
        // Slightly cleaner name for display maybe
        answer: column
          .substring(question.questionColumn.length)
          .replace('__', ''),
        count,
      }))
      .sort((a, b) => descending(a.count, b.count));
  }

  console.log(multipleChoiceQuestions);
  return <svg width={width} height={height} />;
};
