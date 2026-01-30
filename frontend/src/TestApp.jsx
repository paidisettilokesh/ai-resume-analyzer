import React, { useState } from 'react';

export default function TestApp() {
    const [count, setCount] = useState(0);
    return (
        <div style={{ padding: 20 }}>
            <h1>Test App Working</h1>
            <p>Count: {count}</p>
            <button onClick={() => setCount(c => c + 1)}>Increment</button>
        </div>
    );
}
