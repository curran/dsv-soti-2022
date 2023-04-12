import { useRef, useEffect } from 'react';
import { select } from 'd3-selection';
import { max } from 'd3-array';
import { scalePoint, scaleSqrt } from 'd3-scale';
import { axisBottom, axisLeft } from 'd3-axis';
import './styles.css';

const margin = { top: 5, right: 15, bottom: 30, left: 355 };
const width = 800;
const barHeight = 16;
const maxRadius = 20;

export const MatrixViz = ({
  question,
  handleAnswerToggle,
  filters,
  dictionaryMap,
}) => {
  const ref = useRef();

  const data = question.answers;
  const xValue = (d) => d.count;
  const xValueForeground = (d) => d.countFiltered;
  const yValue = (d) => d.answer;

  const { top, right, bottom, left } = margin;
  const height = top + bottom + barHeight * question.answerColumns.length;

  useEffect(() => {
    const svg = select(ref.current);

    const rScale = scaleSqrt()
      .domain([0, max(data, xValue)])
      .range([0, maxRadius]);

    const xScale = scalePoint()
      .domain(question.matrixAnswers)
      .range([left, width - right])
      .padding(0.5);

    const yScale = scalePoint()
      .domain(question.answerColumns)
      .range([top, height - bottom])
      .padding(0.5);

    svg
      .selectAll('g.x-axis')
      .data([null])
      .join('g')
      .attr('class', 'x-axis')
      .attr('transform', `translate(0,${height - bottom})`)
      .call(axisBottom(xScale).tickSize(-(height - bottom - top)))
      .call((selection) => selection.selectAll('.domain').remove());

    svg
      .selectAll('g.y-axis')
      .data([null])
      .join('g')
      .attr('class', 'y-axis')
      .attr('transform', `translate(${left}, 0)`)
      .call(
        axisLeft(yScale)
          .tickSize(-(width - right - left))
          .tickFormat((d) => dictionaryMap.get(d).qrText_2022)
      )
      .call((selection) => {
        selection.selectAll('.domain').remove();
      });

    for (const d of data) {
      const [y, x] = d.answerKey.split('|');
      d.x = x;
      d.y = y;
    }
    svg
      .selectAll('circle.mark-background')
      .data(data)
      .join('circle')
      .attr('class', 'mark-background')
      .attr('cx', (d) => xScale(d.x))
      .attr('cy', (d) => yScale(d.y))
      .attr('r', (d) => rScale(d.count));
    //.on('click', (event, d) => {
    //  handleAnswerToggle(d.column);
    //});

    svg
      .selectAll('circle.mark-foreground')
      .data(data)
      .join('circle')
      .attr('class', 'mark-foreground')
      .attr('cx', (d) => xScale(d.x))
      .attr('cy', (d) => yScale(d.y))
      .attr('r', (d) => rScale(d.countFiltered));
  }, [question, handleAnswerToggle]);

  return (
    <svg className="question-viz" width={width} height={height} ref={ref} />
  );
};
