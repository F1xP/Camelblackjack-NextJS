'use server';

import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/session';
import { getErrorMessage } from '@/lib/utils';
import { fromZodError } from 'zod-validation-error';
import { z } from 'zod';

export const unhashSeedAction = async (formData: FormData) => {
  try {
    const user = await getCurrentUser();
    if (!user || !user.email) return { message: null, error: 'You must be signed in.' };

    const seed: any = formData.get('seed');
    if (!seed) return { message: null, error: `Server Seed field is required.` };

    const schema = z.object({
      seed: z.string(),
    });
    try {
      schema.parse({
        seed: seed,
      });
    } catch (e: any) {
      const validationError = fromZodError(e);
      return {
        message: null,
        error: validationError.message.split(' ').slice(2, -2).join(' ') + '.' || 'Unknown Error',
      };
    }

    const unhashedSeed = await prisma.game.findFirst({
      where: { hashedSeed: seed },
    });

    if (unhashedSeed?.active) return { message: null, error: `Unable to unhash, game is in progress.` };

    return { message: 'Seed unhashed successfully.', error: null, state: unhashedSeed?.seed };
  } catch (e: unknown) {
    console.log(e);
    return { message: null, error: getErrorMessage(e) };
  }
};
