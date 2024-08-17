import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';

const fetchQuotes = async () => {
  const response = await fetch('https://fakestoreapi.com/products'); // Replace with your API endpoint
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return response.json();
};

export const useRandomQuotes = () => {
  const [quoteIndex, setQuoteIndex] = useState(0);

  //   const { data: quotes, refetch } = useQuery(queryKey, fetchQuotes, {
  const { data: quotes, refetch } = useQuery({
    queryKey: ['quotes'], // Assuming 'todos' is correct
    queryFn: fetchQuotes,
  });

  const getNextQuote = () => {
    if (!quotes) return null;

    // Get the current quote
    const quote = quotes[quoteIndex];

    // Increment the index, and refetch if we've used all quotes
    if (quoteIndex >= quotes.length - 1) {
      setQuoteIndex(0);
      refetch(); // Fetch new quotes after exhausting the current list
    } else {
      setQuoteIndex((prevIndex) => prevIndex + 1);
    }

    return quote;
  };

  return { getNextQuote, quotes };
};
