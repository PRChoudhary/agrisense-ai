import { jest } from '@jest/globals';

jest.unstable_mockModule('../../src/config/database.js', () => {
  return {
    default: {
      alert: {
        create: jest.fn(),
      },
      crop: {
        findUnique: jest.fn(),
      },
      mandi: {
        findUnique: jest.fn(),
      }
    },
    connectDatabase: jest.fn()
  }
});

const { createPriceAlert } = await import('../../src/services/alerts.service.js');
const { default: prisma } = await import('../../src/config/database.js');

describe('alerts.service.js - createPriceAlert', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should generate alert name if not provided', async () => {
    prisma.crop.findUnique.mockResolvedValue({ name: 'Wheat' });
    prisma.mandi.findUnique.mockResolvedValue({ name: 'Delhi Mandi' });
    prisma.alert.create.mockResolvedValue({ id: 1, name: 'Wheat price > ₹2000 at Delhi Mandi' });

    const result = await createPriceAlert('user-1', {
      cropId: 'crop-1',
      mandiId: 'mandi-1',
      threshold: 2000,
      direction: 'ABOVE'
    });

    expect(result.name).toBe('Wheat price > ₹2000 at Delhi Mandi');
    expect(prisma.alert.create).toHaveBeenCalledWith({
      data: expect.objectContaining({
        userId: 'user-1',
        name: 'Wheat price > ₹2000 at Delhi Mandi'
      }),
      include: expect.any(Object)
    });
  });

  it('should use provided alert name if given', async () => {
    prisma.alert.create.mockResolvedValue({ id: 2, name: 'Custom Name' });

    const result = await createPriceAlert('user-1', {
      name: 'Custom Name',
      cropId: 'crop-1',
      threshold: 2000,
      direction: 'BELOW'
    });

    expect(result.name).toBe('Custom Name');
    expect(prisma.alert.create).toHaveBeenCalledWith({
      data: expect.objectContaining({
        userId: 'user-1',
        name: 'Custom Name'
      }),
      include: expect.any(Object)
    });
    expect(prisma.crop.findUnique).not.toHaveBeenCalled();
  });
});
