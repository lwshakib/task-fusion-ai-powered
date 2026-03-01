import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import React from 'react';

const SampleComponent = () => <h1>Task Fusion AI</h1>;

describe('Sample Component', () => {
  it('renders correctly', () => {
    render(<SampleComponent />);
    expect(screen.getByText('Task Fusion AI')).toBeInTheDocument();
  });
});
