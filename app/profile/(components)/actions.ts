'use server';

import { prisma } from '@/lib/authOptions';
import { getCurrentUser } from '@/lib/session';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

export const updateProfile = async (currentState: string | null, formData: FormData) => {
  const user = await getCurrentUser();
  if (!user?.email) return { message: null, error: `You must be signed in.` };
  const name: any = formData.get('name');
  if (!name) return { message: null, error: `Name field is required.` };

  try {
    const schema = z.object({
      name: z.string().min(3).max(39),
    });

    schema.parse({
      name: name,
    });
  } catch (e) {
    return { message: null, error: `Name should be between 3 and 39 characters and in the correct format.` };
  }

  try {
    await prisma.user.update({
      where: { email: user?.email },
      data: {
        name: name,
      },
    });
    revalidatePath('/profile');
    return { message: 'User has been updated successfully.', error: null };
  } catch (e) {
    return { message: null, error: 'Failed to update user.' };
  }
};

export const resetProfile = async (currentState: string | null, formData: FormData) => {
  const user = await getCurrentUser();
  if (!user?.email) return { message: null, error: `You must be signed in.` };
  const name: any = formData.get('name');
  if (!name) return { message: null, error: `Name field is required.` };

  try {
    const schema = z.object({
      name: z.string(),
    });

    schema.parse({
      name: name,
    });
  } catch (e) {
    return { message: null, error: `The name you entered is of an invalid format.` };
  }

  try {
    if (user?.name !== name) return { message: null, error: `The name you entered doesn't match your current name.` };
    await prisma.$transaction([
      prisma.user.update({
        where: { email: user?.email },
        data: {
          coins: 500,
          games: 0,
          wins: 0,
          loses: 0,
          pushes: 0,
        },
      }),
      prisma.game.deleteMany({
        where: { user_email: user?.email },
      }),
    ]);

    revalidatePath('/profile');
    return { message: 'User has been reset successfully.', error: null };
  } catch (e) {
    return { message: null, error: 'Failed to reset user.' };
  }
};

export const deleteProfile = async (currentState: string | null, formData: FormData) => {
  const user = await getCurrentUser();
  if (!user?.email) return { message: null, error: `You must be signed in.` };
  const name: any = formData.get('name');
  if (!name) return { message: null, error: `Name field is required.` };

  try {
    const schema = z.object({
      name: z.string(),
    });

    schema.parse({
      name: name,
    });
  } catch (e) {
    return { message: null, error: `The name you entered is of an invalid format.` };
  }

  try {
    if (user?.name !== name) return { message: null, error: `The name you entered doesn't match your current name.` };
    await prisma.user.delete({
      where: { email: user?.email },
    });
    revalidatePath('/profile');
    return { message: 'User has been deleted successfully.', error: null };
  } catch (e) {
    return { message: null, error: 'Failed to delete user.' };
  }
};
