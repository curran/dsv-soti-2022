import { useRef, useEffect } from 'react';
import { select } from 'd3-selection';
import { max } from 'd3-array';
import { scaleLinear, scaleBand } from 'd3-scale';
import { axisBottom, axisLeft } from 'd3-axis';

const margin = { top: 10, right: 10, bottom: 30, left: 190 };
const width = 900;
const barHeight = 16;

export const QuestionViz = ({ question }) => {
  const ref = useRef();

  const data = question.answers;
  const xValue = (d) => d.count;
  const yValue = (d) => d.answer;

  const { top, right, bottom, left } = margin;
  const height = top + bottom + barHeight * data.length;

  useEffect(() => {
    const svg = select(ref.current);

    const xScale = scaleLinear()
      .domain([0, max(data, xValue)])
      .range([left, width - right]);

    const yScale = scaleBand()
      .domain(data.map(yValue))
      .range([top, height - bottom])
      .padding(0.1);

    svg
      .selectAll('g.x-axis')
      .data([null])
      .join('g')
      .attr('class', 'x-axis')
      .attr('transform', `translate(0,${height - bottom})`)
      .call(axisBottom(xScale))
      .call((selection) => selection.selectAll('.domain').remove());

    svg
      .selectAll('g.y-axis')
      .data([null])
      .join('g')
      .attr('class', 'y-axis')
      .attr('transform', `translate(${left}, 0)`)
      .call(axisLeft(yScale).tickPadding(0))
      .call((selection) => {
        selection.selectAll('.domain').remove();
        selection.selectAll('.tick line').remove();
      });

    svg
      .selectAll('rect')
      .data(data)
      .join('rect')
      .attr('x', xScale(0))
      .attr('y', (d) => yScale(yValue(d)))
      .attr('width', (d) => xScale(xValue(d)) - xScale(0))
      .attr('height', yScale.bandwidth());
  }, [question]);

  return <svg width={width} height={height} ref={ref} />;
};
