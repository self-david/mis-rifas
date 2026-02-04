/**
 * Determines the winner(s) of the raffle based on the "Closest Number" strategy.
 *
 * Rules:
 * 1. Takes the last 3 digits of the National Lottery Major Prize.
 * 2. Matches exactly with a participant's number.
 * 3. If no exact match:
 *    - Assigns to the number with the smallest absolute difference.
 *    - If there is a tie (one above, one below with same difference), BOTH win.
 *
 * @param {number[]} participants - Array of occupied ticket numbers (integers).
 * @param {number} winningNumber - The winning number from the National Lottery (last 3 digits).
 * @returns {object} Result object containing:
 *   - {string} type: 'EXACT' | 'CLOSEST';
 *   - {number[]} winners: Array of winning ticket numbers.
 *   - {number} diff: The difference (0 for exact).
 */
export function findWinner(participants, winningNumber) {
  if (!participants || participants.length === 0) {
    return { type: "NO_PARTICIPANTS", winners: [], diff: null };
  }

  // Sort participants for easier logic (though not strictly necessary with this algo)
  const sortedParticipants = [...participants].sort((a, b) => a - b);

  // 1. Check for Exact Match
  if (sortedParticipants.includes(winningNumber)) {
    return {
      type: "EXACT",
      winners: [winningNumber],
      diff: 0,
    };
  }

  // 2. Find Closest Number(s)
  let minDiff = Infinity;
  let winners = [];

  for (const ticket of sortedParticipants) {
    const diff = Math.abs(ticket - winningNumber);

    if (diff < minDiff) {
      minDiff = diff;
      winners = [ticket];
    } else if (diff === minDiff) {
      winners.push(ticket);
    }
  }

  return {
    type: "CLOSEST",
    winners: winners.sort((a, b) => a - b),
    diff: minDiff,
  };
}
