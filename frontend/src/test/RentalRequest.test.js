import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import RentalRequests from '../pages/car_owner/RentalRequest';
import axios from 'axios';
import { BrowserRouter } from 'react-router-dom';

jest.mock('axios');

const renderWithRouter = (ui) => {
  return render(ui, { wrapper: BrowserRouter });
};

const mockAccountData = [
  { id: 2, UserName: 'Customer2' },
  { id: 3, UserName: 'Customer3' },
];

const mockCarData = [
  { CarID: 1, CarName: 'Tesla Malibu', Price: 400000, GarageID: 1 },
  { CarID: 2, CarName: 'Toyota Aventador', Price: 500000, GarageID: 1 },
];

const mockRentalData = [
  {
    RentalID: 1,
    CarID: 1,
    CustomerID: 2,
    RentalStatus: 1,
    RentalStart: '2024-10-21T00:00:00.000Z',
    RentalEnd: '2024-10-25T00:00:00.000Z',
  },
  {
    RentalID: 2,
    CarID: 2,
    CustomerID: 2,
    RentalStatus: 1,
    RentalStart: '2024-09-12T00:00:00.000Z',
    RentalEnd: '2024-09-15T00:00:00.000Z',
  },
];

describe('RentalRequests Component', () => {
  beforeEach(() => {
    axios.get.mockImplementation((url) => {
      switch (url) {
        case 'http://localhost:5000/api/account':
          return Promise.resolve({ data: mockAccountData });
        case 'http://localhost:5000/api/car':
          return Promise.resolve({ data: mockCarData });
        case 'http://localhost:5000/api/rental':
          return Promise.resolve({ data: mockRentalData });
        case 'http://localhost:5000/api/garage/2':
          return Promise.resolve({ data: [{ GarageID: 1 }] });
        default:
          return Promise.reject(new Error('not found'));
      }
    });

    localStorage.setItem('user', JSON.stringify({ id: 2, role: 2 }));
  });

  afterEach(() => {
    jest.clearAllMocks();
    localStorage.removeItem('user');
  });

  test('renders RentalRequests and displays rentals', async () => {
    renderWithRouter(<RentalRequests />);
    expect(screen.getAllByText('Rental Requests')[1]).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText('Tesla Malibu')).toBeInTheDocument();
      expect(screen.getByText('Toyota Aventador')).toBeInTheDocument();
      expect(screen.getAllByText(/Customer2/i)[1]).toBeInTheDocument(); 
      expect(screen.getAllByText(/waiting to confirm/i)).toHaveLength(2); // For both rentals
    });
  });

  test('displays error message when user has no permission', async () => {
    localStorage.setItem('user', JSON.stringify({ id: 4, role: 1 }));
  
    renderWithRouter(
      <RentalRequests accountData={mockAccountData} carData={mockCarData} rentalData={mockRentalData} />
    );

    const errorMessage = await screen.findByText("Server error");

    expect(errorMessage).toBeInTheDocument();
  });
});
