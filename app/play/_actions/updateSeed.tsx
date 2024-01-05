'use server';

import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/session';
import { revalidatePath } from 'next/cache';
import { getErrorMessage } from '@/lib/utils';
import { fromZodError } from 'zod-validation-error';
import { z } from 'zod';

export const updateSeedAction = async (formData: FormData) => {
  try {
    const user = await getCurrentUser();
    if (!user || !user.email) throw new Error('You must be signed in.');

    const isActive = await prisma.game.findFirst({
      where: { active: true, user_email: user.email },
    });
    if (isActive) throw new Error('You must finish your active game in order to update your seed.');

    const newSeed: any = formData.get('seed');
    if (!newSeed) throw new Error('Client Seed field is required.');

    const schema = z.object({
      newSeed: z
        .string()
        .min(1, 'Client Seed must be at least 1 character long')
        .max(36, 'Client Seed exceed 36 characters'),
    });
    try {
      schema.parse({
        newSeed: newSeed,
      });
    } catch (e: any) {
      const validationError = fromZodError(e);
      return {
        message: null,
        error: validationError.message.split(' ').slice(2, -2).join(' ') + '.' || 'Unknown Error',
      };
    }

    await prisma.user.update({
      where: { email: user.email as string },
      data: {
        seed: formData.get('seed') as string,
      },
    });

    return { message: 'Your seed has been updated successfully.', error: null };
  } catch (e: unknown) {
    console.log(e);
    return { message: null, error: getErrorMessage(e) };
  }
};
