import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Home from '../page'; // adjust path if using app directory

describe('Home page', () => {
  it('renders the welcome text', () => {
    render(<Home />);
    expect(screen.getByText(/welcome/i)).toBeInTheDocument();
  });
});
