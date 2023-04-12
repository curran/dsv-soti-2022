import { descending } from 'd3-array';
import { QuestionViz } from './QuestionViz';

// A sentinel value representing that the answer was not chosen.
const notChosen = '[^not chosen]';

export const Viz = ({ dataset }) => {
  //console.log(JSON.stringify(questions, null, 2));
  const { multipleChoiceQuestions } = dataset;

  for (const question of multipleChoiceQuestions) {
    const columns = question.answerColumns;

    // Calculate counts for each answer.
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
  return multipleChoiceQuestions.map((question) => (
    <div className="question" key={question.questionColumn}>
      <div className="question-text">{question.text}</div>
      <QuestionViz question={question} />
    </div>
  ));
};
