// Function to generate a range of lotteries with a specified step size
function generateLotteryRange(start, end, step) {
    const range = [];
    for (let i = start; i <= end; i += step) {
      range.push(i);
    }
    return range;
}
  
export { generateLotteryRange };