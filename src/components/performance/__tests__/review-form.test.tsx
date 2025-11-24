import { render, screen } from '@testing-library/react';
import { ReviewForm } from '../review-form';

describe('ReviewForm', () => {
  it('renders the form with submit button', () => {
    const mockOnSubmit = jest.fn();
    const mockOnCancel = jest.fn();
    
    render(<ReviewForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);
    
    const submitButton = screen.getByRole('button', { name: /create review/i });
    expect(submitButton).toBeInTheDocument();
  });
});
