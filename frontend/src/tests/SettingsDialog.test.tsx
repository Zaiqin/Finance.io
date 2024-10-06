import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import SettingsDialog from '../components/SettingsDialog';
import { Category } from '../interfaces/interface';

const mockCategories: Category[] = [
  { _id: undefined, description: 'Category 1' },
  { _id: undefined, description: 'Category 2' },
];

const mockOnClose = jest.fn();
const mockOnAddCategory = jest.fn();
const mockOnDeleteCategory = jest.fn();
const mockOnUpdateCategory = jest.fn();


const renderComponent = () =>
  render(
    <SettingsDialog
      categories={mockCategories}
      onClose={mockOnClose}
      onAddCategory={mockOnAddCategory}
      onDeleteCategory={mockOnDeleteCategory}
      onUpdateCategory={mockOnUpdateCategory}
    />
  );

  describe('SettingsDialog', () => {
    it('Renders the component', () => {
      renderComponent();
      expect(screen.getByText('Manage Categories')).toBeInTheDocument();
    });
  
    it('Adds a new category', () => {
      renderComponent();
      const input = screen.getByPlaceholderText('Name');
      fireEvent.change(input, { target: { value: 'Category 3' } });
      fireEvent.click(screen.getByText('Add'));
      expect(mockOnAddCategory).toHaveBeenCalledWith('Category 3');
    });
  
    it('Does not add a duplicate category', () => {
      renderComponent();
      const input = screen.getByPlaceholderText('Name');
      fireEvent.change(input, { target: { value: 'Category 1' } });
      fireEvent.click(screen.getByText('Add'));
      expect(mockOnAddCategory).not.toHaveBeenCalled();
    });
  
    it('Closes the dialog', () => {
      renderComponent();
      fireEvent.click(screen.getByText('Close'));
      expect(mockOnClose).toHaveBeenCalled();
    });
  });