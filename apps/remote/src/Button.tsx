import React, { useState } from 'react';

export default function Button() {
  const [count, setCount] = useState(0);
  return (
    <button onClick={() => setCount((c) => c + 1)}>
      Remote count: {count}
    </button>
  );
}
