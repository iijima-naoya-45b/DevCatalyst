import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import React from 'react';

// A tiny IME Textarea harness to verify composition handling.
const TestTextarea: React.FC = () => {
  const [isComposing, setIsComposing] = React.useState(false);
  const [submitted, setSubmitted] = React.useState(false);
  const onKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey && !isComposing) {
      e.preventDefault();
      setSubmitted(true);
    }
  };
  return (
    <div>
      <textarea
        aria-label="message"
        onCompositionStart={() => setIsComposing(true)}
        onCompositionEnd={() => setIsComposing(false)}
        onKeyDown={onKeyDown}
      />
      <div data-testid="submitted">{submitted ? 'yes' : 'no'}</div>
    </div>
  );
};

describe('Textarea IME behavior', () => {
  it('does not submit on Enter during composition', () => {
    render(<TestTextarea />);
    const textarea = screen.getByLabelText('message');
    const submitted = screen.getByTestId('submitted');
    // start composition
    fireEvent.compositionStart(textarea);
    fireEvent.keyDown(textarea, { key: 'Enter' });
    expect(submitted).toHaveTextContent('no');
    // end composition and press Enter to submit
    fireEvent.compositionEnd(textarea);
    fireEvent.keyDown(textarea, { key: 'Enter' });
    expect(submitted).toHaveTextContent('yes');
  });
});


