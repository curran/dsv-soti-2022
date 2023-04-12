const notChosen = '[^not chosen]';
const notAnswered = '[^not answered]';
const unasked = '[\\unasked]';
const unfinished = '[\\unfinished]';

export const hasData = (value) =>
  value !== notChosen &&
  value !== unasked &&
  value !== unfinished &&
  value !== notAnswered;
