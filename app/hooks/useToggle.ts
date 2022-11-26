import { useState } from 'react';

const useToggle = (initial: boolean): [boolean, () => void] => {
  const [value, setInputValue] = useState(initial);
  const toggle = () => setInputValue((val) => !val);
  return [value, toggle];
};

export default useToggle;
